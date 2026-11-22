#!/usr/bin/env node

/**
 * Autonomous Gemini Pro Image Generation Bot for NESFIC-D-18
 *
 * Uses Puppeteer CDP to drive Google Chrome (logged into sumanzfilms@gmail.com on port 9222)
 *
 * Usage:
 *   NODE_PATH="/Users/kalyan/Downloads/2026/Sep2026/Data Centers and Way Head/node_modules" node scripts/generate_gemini_images.js
 *   NODE_PATH="/Users/kalyan/Downloads/2026/Sep2026/Data Centers and Way Head/node_modules" node scripts/generate_gemini_images.js --id=18
 *   NODE_PATH="/Users/kalyan/Downloads/2026/Sep2026/Data Centers and Way Head/node_modules" node scripts/generate_gemini_images.js --force
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const BASE_DIR = path.resolve(__dirname, '..');
const PROMPTS_FILE = path.join(BASE_DIR, 'scripts', 'image_prompts_d18.json');
const TRACKER_FILE = path.join(BASE_DIR, 'scripts', 'gemini_generated.json');
const OUT_DIR = path.join(BASE_DIR, 'assets', 'proposal_images');

// CLI Arguments
const args = process.argv.slice(2);
let port = 9222;
let filterId = null;
let filterFilename = null;
let forceOverwrite = false;
let limit = null;

args.forEach(arg => {
  if (arg.startsWith('--port=')) {
    port = parseInt(arg.replace('--port=', '').trim(), 10);
  } else if (arg.startsWith('--id=')) {
    filterId = parseInt(arg.replace('--id=', '').trim(), 10);
  } else if (arg.startsWith('--filename=')) {
    filterFilename = arg.replace('--filename=', '').trim();
  } else if (arg.startsWith('--limit=')) {
    limit = parseInt(arg.replace('--limit=', '').trim(), 10);
  } else if (arg === '--force') {
    forceOverwrite = true;
  }
});

if (!fs.existsSync(PROMPTS_FILE)) {
  console.error(`❌ Error: Prompts file not found at ${PROMPTS_FILE}`);
  process.exit(1);
}

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

let completedIds = [];
if (fs.existsSync(TRACKER_FILE)) {
  try {
    completedIds = JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));
  } catch (e) {
    completedIds = [];
  }
}

const allPrompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
let queue = allPrompts.filter(item => {
  if (filterId !== null && item.id !== filterId) return false;
  if (filterFilename && item.filename !== filterFilename) return false;
  if (!forceOverwrite && completedIds.includes(item.id)) {
    return false;
  }
  return true;
});

if (limit && limit > 0) {
  queue = queue.slice(0, limit);
}

console.log('\n=============================================================');
console.log('🤖 NESFIC-D-18 GEMINI PRO IMAGE GENERATION AUTOMATION');
console.log('=============================================================');
console.log(`🔌 Target Chrome Port      : ${port}`);
console.log(`📁 Target Assets Directory : ${OUT_DIR}`);
console.log(`📋 Total Prompts in Queue  : ${queue.length} of ${allPrompts.length}`);
if (filterId !== null) console.log(`🔍 Filter Diagram ID       : Diagram ${filterId}`);
if (filterFilename) console.log(`🔍 Filter Filename         : ${filterFilename}`);
console.log('=============================================================\n');

if (queue.length === 0) {
  console.log('✨ All images in queue already exist! Use --force to regenerate.\n');
  process.exit(0);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  let browser;
  try {
    console.log(`⏳ Connecting to Chrome on http://127.0.0.1:${port}...`);
    browser = await puppeteer.connect({
      browserURL: `http://127.0.0.1:${port}`,
      defaultViewport: null
    });
    console.log(`✅ Connected successfully to Google Chrome!`);
  } catch (err) {
    console.error(`\n❌ Could not connect to Google Chrome on port ${port}.`);
    console.error(`\n👉 Make sure Chrome is running with remote debugging:`);
    console.log(`   /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=${port} &\n`);
    process.exit(1);
  }

  const pages = await browser.pages();
  let geminiPage = pages.find(p => p.url().includes('gemini.google.com'));

  if (!geminiPage) {
    console.log(`🌐 Opening a new tab navigating to https://gemini.google.com/app...`);
    geminiPage = await browser.newPage();
    await geminiPage.goto('https://gemini.google.com/app', { waitUntil: 'networkidle2' });
  } else {
    console.log(`🌐 Found active Gemini tab: ${geminiPage.url()}`);
    await geminiPage.bringToFront();
  }

  // Verify account
  const accountInfo = await geminiPage.evaluate(() => {
    const el = document.querySelector('a[aria-label*="Google Account"], img[alt*="Google Account"], [aria-label*="@"]');
    return el ? (el.getAttribute('aria-label') || el.getAttribute('alt') || el.innerText) : document.title;
  });
  console.log(`👤 Active Gemini User: ${accountInfo}\n`);

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const targetFile = path.join(OUT_DIR, item.filename);

    console.log(`\n-------------------------------------------------------------`);
    console.log(`[${i + 1}/${queue.length}] 🎨 Generating Diagram ${item.id}: ${item.title}`);
    console.log(`   📄 Output File : ${item.filename}`);
    console.log(`-------------------------------------------------------------`);

    let promptSent = false;
    let attempts = 0;

    while (attempts < 2 && !promptSent) {
      attempts++;
      try {
        // Open a clean Gemini chat session
        await geminiPage.goto('https://gemini.google.com/app', { waitUntil: 'networkidle2' });
        await sleep(2500);

        await geminiPage.waitForSelector('.ql-editor, div[contenteditable="true"]', { timeout: 25000 }).catch(() => {});

        // Snapshot current image sources in the page
        const existingImageUrls = await geminiPage.evaluate(() => {
          return Array.from(document.querySelectorAll('img')).map(img => img.src).filter(Boolean);
        });

        const promptText = `Generate a high-quality 16:9 widescreen infographic image: ${item.prompt}`;

        // Focus and type prompt using insertText for Angular/Lit/Quill reactivity
        const typed = await geminiPage.evaluate((text) => {
          const editor = document.querySelector('.ql-editor, div[contenteditable="true"]');
          if (editor) {
            editor.focus();
            document.execCommand('insertText', false, text);
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
          }
          return false;
        }, promptText);

        if (!typed) {
          throw new Error('Could not find or type into Gemini input box');
        }

        await sleep(1500);

        // Click Send button
        const clicked = await geminiPage.evaluate(() => {
          const sendBtn = document.querySelector('button[aria-label*="Send"], button.send-button');
          if (sendBtn && !sendBtn.disabled) {
            sendBtn.click();
            return true;
          }
          return false;
        });

        if (!clicked) {
          // Fallback to Enter key
          await geminiPage.keyboard.press('Enter');
        }

        console.log(`   📤 Prompt submitted to Gemini Pro. Waiting for image generation...`);
        promptSent = true;

        // Poll for newly generated image in DOM
        let imageBuffer = null;
        let waitSeconds = 0;

        while (!imageBuffer && waitSeconds < 75) {
          await sleep(3000);
          waitSeconds += 3;

          // Check if Imagen has rendered the new image
          const newImageData = await geminiPage.evaluate((existingUrls) => {
            const allImages = Array.from(document.querySelectorAll('img'));
            const candidates = allImages.filter(img =>
              img.src &&
              !existingUrls.includes(img.src) &&
              (img.src.includes('googleusercontent.com') || img.src.startsWith('blob:') || img.src.startsWith('data:image')) &&
              img.naturalWidth > 350
            );

            if (candidates.length > 0) {
              const latest = candidates[candidates.length - 1];
              return { src: latest.src, width: latest.naturalWidth, height: latest.naturalHeight };
            }
            return null;
          }, existingImageUrls);

          if (newImageData) {
            console.log(`   🖼️ Image detected in response (${newImageData.width}x${newImageData.height})! Extracting full-res bytes...`);

            // Extract base64 via canvas
            const base64Data = await geminiPage.evaluate((imgSrc) => {
              const img = Array.from(document.querySelectorAll('img')).find(i => i.src === imgSrc);
              if (!img || !img.complete || img.naturalWidth === 0) return null;
              try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                return dataUrl.split(',')[1];
              } catch (e) {
                return null;
              }
            }, newImageData.src);

            if (base64Data) {
              imageBuffer = Buffer.from(base64Data, 'base64');
            } else {
              // Fallback: try fetching directly in page context
              const fetchBase64 = await geminiPage.evaluate(async (imgSrc) => {
                try {
                  const res = await fetch(imgSrc);
                  const blob = await res.blob();
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = () => resolve(null);
                    reader.readAsDataURL(blob);
                  });
                } catch (e) {
                  return null;
                }
              }, newImageData.src);

              if (fetchBase64) {
                imageBuffer = Buffer.from(fetchBase64, 'base64');
              }
            }
          }
        }

        if (imageBuffer) {
          fs.writeFileSync(targetFile, imageBuffer);
          const stats = fs.statSync(targetFile);
          console.log(`   ✅ Successfully saved: assets/proposal_images/${item.filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
          successCount++;
          if (!completedIds.includes(item.id)) {
            completedIds.push(item.id);
            try {
              fs.writeFileSync(TRACKER_FILE, JSON.stringify(completedIds, null, 2));
            } catch (e) {}
          }
        } else {
          console.error(`   ⚠️ Timed out waiting for ${item.filename} (75s). Skipping to next...`);
          failureCount++;
        }

      } catch (err) {
        console.error(`   ⚠️ Error during processing: ${err.message}`);
        if (attempts >= 2) failureCount++;
      }
    }

    if (i < queue.length - 1) {
      console.log(`   ⏳ Cooling down for 6 seconds before next prompt...`);
      await sleep(6000);
    }
  }

  console.log('\n=============================================================');
  console.log(`🎉 AUTOMATION COMPLETE: ${successCount} Generated & Saved, ${failureCount} Failed`);
  console.log('=============================================================\n');

  await browser.disconnect();
}

main().catch(err => {
  console.error(`\n❌ Fatal Error: ${err.message}\n`);
  process.exit(1);
});

import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const [,, url = 'http://localhost:3000', label] = process.argv;
const dir = resolve('./temporary screenshots');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const existing = readdirSync(dir).filter(f => /^screenshot-\d+/.test(f));
const next = existing.length + 1;
const name = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = join(dir, name);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/PC Geek/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// Force all animated elements visible for full-page screenshot
await page.evaluate(() => {
  document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
});
await new Promise(r => setTimeout(r, 300));

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();
console.log(`Screenshot saved → ${outPath}`);

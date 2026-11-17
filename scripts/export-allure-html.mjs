import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resultsDir = path.join(root, 'allure-results');
const outDir = path.join(root, 'allure-report-single');
const html = path.join(outDir, 'index.html');

if (!fs.existsSync(resultsDir) || fs.readdirSync(resultsDir).length === 0) {
  console.error('No allure-results found. Run tests first (npm run test:e2e).');
  process.exit(1);
}

const gen = spawnSync(
  'allure',
  ['generate', './allure-results', '--clean', '-o', './allure-report-single', '--single-file'],
  { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' },
);
if (gen.status !== 0) {
  process.exit(gen.status ?? 1);
}

if (!fs.existsSync(html)) {
  console.error('Expected single-file report at:', html);
  process.exit(1);
}

const desktop = process.env.USERPROFILE
  ? path.join(process.env.USERPROFILE, 'Desktop')
  : null;
const desktopName = process.env.ALLURE_DESKTOP_NAME ?? 'SauceDemo-Allure-Report.html';

if (desktop && fs.existsSync(desktop)) {
  const desktopFile = path.join(desktop, desktopName);
  fs.copyFileSync(html, desktopFile);
  console.log('Desktop (send this file):', desktopFile);
}

const shareZip = path.join(root, 'allure-report-share.zip');
if (fs.existsSync(shareZip)) {
  fs.rmSync(shareZip, { force: true });
}
if (process.platform === 'win32') {
  spawnSync(
    'powershell',
    [
      '-NoProfile',
      '-Command',
      `Compress-Archive -Path '${html.replace(/'/g, "''")}' -DestinationPath '${shareZip.replace(/'/g, "''")}' -Force`,
    ],
    { stdio: 'inherit' },
  );
} else {
  spawnSync('zip', ['-j', shareZip, html], { stdio: 'inherit', cwd: root });
}

console.log('Project copy:', html);
console.log('Zip for email/Teams:', shareZip);
console.log('Recipients can double-click the HTML file — no .bat or server needed.');
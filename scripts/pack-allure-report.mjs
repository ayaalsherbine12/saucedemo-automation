import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportDir = path.join(root, 'allure-report');
const outZip = path.join(root, 'allure-report-share.zip');

if (!fs.existsSync(path.join(reportDir, 'index.html'))) {
  console.error('Missing allure-report/index.html. Run: npm run allure:generate');
  process.exit(1);
}

if (fs.existsSync(outZip)) {
  fs.rmSync(outZip, { force: true });
}

if (process.platform === 'win32') {
  const ps = spawnSync(
    'powershell',
    [
      '-NoProfile',
      '-Command',
      `Compress-Archive -Path '${reportDir.replace(/'/g, "''")}\\*' -DestinationPath '${outZip.replace(/'/g, "''")}' -Force`,
    ],
    { stdio: 'inherit' },
  );
  if (ps.status !== 0) {
    process.exit(ps.status ?? 1);
  }
} else {
  const tar = spawnSync('tar', ['-czf', outZip, '-C', reportDir, '.'], { stdio: 'inherit' });
  if (tar.status !== 0) {
    process.exit(tar.status ?? 1);
  }
}

const batDest = path.join(reportDir, 'OPEN-REPORT.bat');
const batSrc = path.join(root, 'scripts', 'desktop-open-report.bat');
if (fs.existsSync(batSrc)) {
  let bat = fs.readFileSync(batSrc, 'utf8');
  bat = bat.replace(
    /for %%I in \("%~dp0\.\."\).*?\r?\n/,
    `set "PROJECT=${root.replace(/\\/g, '\\\\')}"\r\n`,
  );
  fs.writeFileSync(batDest, bat);
}

const readme = path.join(reportDir, 'READ-ME-FIRST.txt');
fs.writeFileSync(
  readme,
  [
    'Allure reports do not work when you double-click index.html (Failed to fetch).',
    '',
    'Windows: double-click OPEN-REPORT.bat in this folder.',
    'From the project folder: npm run allure:open',
    '',
    'Keep the server window open while viewing the report.',
  ].join('\r\n'),
);

console.log(`Created: ${outZip}`);
console.log('Recipients must run OPEN-REPORT.bat (or npm run allure:open), not open index.html as a file.');
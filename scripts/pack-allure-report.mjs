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

console.log(`Created: ${outZip}`);
console.log('Recipients can unzip and open index.html in a browser.');
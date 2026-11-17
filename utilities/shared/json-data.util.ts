import fs from 'fs';
import path from 'path';

export function loadJson<T>(relativePathFromProjectRoot: string): T {
  const fullPath = path.join(process.cwd(), relativePathFromProjectRoot);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(raw) as T;
}
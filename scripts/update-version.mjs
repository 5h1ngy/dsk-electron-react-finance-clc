#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const [, , nextVersion] = process.argv;

if (!nextVersion || !/^\d+\.\d+\.\d+$/.test(nextVersion)) {
  console.error('Usage: npm run version:set -- <major.minor.patch>');
  process.exit(1);
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
packageJson.version = nextVersion;
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

const envFiles = ['env/.env.development', 'env/.env.production'];
for (const relativePath of envFiles) {
  const filePath = path.join(rootDir, relativePath);
  const contents = readFileSync(filePath, 'utf8');
  const updated = contents.replace(/APP_VERSION=.+/g, `APP_VERSION=${nextVersion}`);
  writeFileSync(filePath, updated);
}

const readmePath = path.join(rootDir, 'README.md');
let readme = readFileSync(readmePath, 'utf8');
readme = readme.replace(
  /(https:\/\/img\.shields\.io\/badge\/version-)([\d.]+)(-blue\.svg)/,
  `$1${nextVersion}$3`
);
readme = readme.replace(/APP_VERSION=\d+\.\d+\.\d+/g, `APP_VERSION=${nextVersion}`);
writeFileSync(readmePath, readme);

console.log(`Version bumped to ${nextVersion}`);

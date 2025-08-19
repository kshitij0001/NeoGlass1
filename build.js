#!/usr/bin/env node

// Custom build script for Vercel deployment
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🏗️  Building for production...');

// Build the Vite client
console.log('📦 Building client...');
execSync('vite build', { stdio: 'inherit' });

// Build the server with esbuild  
console.log('🚀 Building server...');
execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=cjs --outdir=dist --target=node18', { stdio: 'inherit' });

// Ensure the dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

console.log('✅ Build complete!');
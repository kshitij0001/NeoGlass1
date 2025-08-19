import { build } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildProject() {
  try {
    // Build the Vite project
    console.log('Building client with Vite...');
    await build({
      configFile: path.resolve(__dirname, 'vite.config.ts'),
    });

    // Build the server with esbuild
    console.log('Building server with esbuild...');
    const esbuildProcess = spawn('npx', [
      'esbuild',
      'server/index.ts',
      '--platform=node',
      '--packages=external',
      '--bundle',
      '--format=esm',
      '--outdir=dist'
    ], { stdio: 'inherit' });

    esbuildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Build completed successfully!');
      } else {
        console.error('Build failed with code:', code);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildProject();
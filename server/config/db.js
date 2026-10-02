import mongoose from 'mongoose';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mongodProc = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tejmakeup';
  
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`[Database] Connected to MongoDB`);
    return;
  } catch (err) {
    const isLocal = uri.includes('127.0.0.1') || uri.includes('localhost');
    if (!isLocal || process.env.VERCEL) {
      console.error('[Database] Failed to connect to MongoDB URI:', err.message);
      throw err;
    }

    console.log('[Database] Local MongoDB not detected. Starting embedded MongoDB instance...');
    const cacheDir = path.resolve(__dirname, '../node_modules/.cache/mongodb-memory-server');
    let exePath = null;
    
    if (fs.existsSync(cacheDir)) {
      const files = fs.readdirSync(cacheDir);
      const exeName = files.find(f => f.startsWith('mongod') && f.endsWith('.exe'));
      if (exeName) {
        exePath = path.join(cacheDir, exeName);
      }
    }

    if (exePath) {
      const dbPath = path.resolve(__dirname, '../.mongo-data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      mongodProc = spawn(exePath, ['--dbpath', dbPath, '--port', '27017', '--bind_ip', '127.0.0.1'], {
        stdio: 'ignore',
        detached: true
      });
      mongodProc.unref();

      // Poll until connected
      let attempts = 0;
      while (attempts < 10) {
        await new Promise(r => setTimeout(r, 600));
        try {
          await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
          console.log(`[Database] Connected to local embedded MongoDB at ${uri}`);
          return;
        } catch {
          attempts++;
        }
      }
    }

    console.error('[Database] Unable to start or connect to local MongoDB. Error:', err.message);
    throw err;
  }
};

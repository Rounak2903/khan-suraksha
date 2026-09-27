import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const DATA_DIR = path.resolve(__dirname, '.data');
const DATA_FILE = path.resolve(DATA_DIR, 'miners.json');

export function sharedMinersApiPlugin() {
  return {
    name: 'shared-miners-api',
    configureServer(server) {
      server.middlewares.use('/api/miners', (req, res, next) => {
        // Ensure data directory and file exist
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs.existsSync(DATA_FILE)) {
          fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf-8');
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method === 'GET') {
          try {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            res.end(data || '{}');
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}');
              let current = {};
              try {
                const raw = fs.readFileSync(DATA_FILE, 'utf-8');
                current = raw ? JSON.parse(raw) : {};
              } catch {
                current = {};
              }

              if (payload.action === 'register') {
                const worker = payload.worker;
                current[worker.id] = {
                  ...worker,
                  pin: null, // Worker must set PIN on first sign up
                  pinSet: false,
                  status: worker.status || 'SURFACE',
                  location: worker.location || 'Surface Assembly',
                  lastScan: 'Registered Now',
                  enrolledAt: new Date().toISOString()
                };
              } else if (payload.action === 'setPin') {
                const { id, pin } = payload;
                if (current[id]) {
                  current[id].pin = pin;
                  current[id].pinSet = true;
                }
              } else if (payload.action === 'updateStatus') {
                const { id, status, location, lastScan } = payload;
                if (current[id]) {
                  current[id].status = status;
                  current[id].location = location;
                  current[id].lastScan = lastScan;
                }
              } else if (payload.action === 'clearAll') {
                current = {};
              }

              fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf-8');
              res.end(JSON.stringify({ success: true, miners: current }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

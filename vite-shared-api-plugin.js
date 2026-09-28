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
              } else if (payload.action === 'triggerSOS') {
                const { id, workerName, hazard, location } = payload;
                if (id && current[id]) {
                  current[id].sosActive = true;
                  current[id].sosHazard = hazard || 'CH4_GAS';
                  current[id].sosTime = new Date().toLocaleTimeString();
                  current[id].status = 'TRAPPED / CRITICAL';
                  current[id].location = location || 'Seam 4 - Active Longwall Face';
                }
                const emFile = path.resolve(DATA_DIR, 'emergency.json');
                fs.writeFileSync(emFile, JSON.stringify({
                  active: true,
                  triggeredBy: workerName || id || 'Underground Worker',
                  workerId: id,
                  hazard: hazard || 'CH4_GAS',
                  time: new Date().toLocaleTimeString()
                }, null, 2), 'utf-8');
              } else if (payload.action === 'clearSOS') {
                Object.values(current).forEach(w => {
                  delete w.sosActive;
                  delete w.sosHazard;
                  delete w.sosTime;
                  if (w.status === 'TRAPPED / CRITICAL') {
                    w.status = 'UNDERGROUND';
                  }
                });
                const emFile = path.resolve(DATA_DIR, 'emergency.json');
                if (fs.existsSync(emFile)) {
                  fs.writeFileSync(emFile, JSON.stringify({ active: false }, null, 2), 'utf-8');
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
      });

      // Dedicated /api/emergency endpoint for instantaneous two-way SOS broadcast
      server.middlewares.use('/api/emergency', (req, res) => {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        const emFile = path.resolve(DATA_DIR, 'emergency.json');

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
            if (fs.existsSync(emFile)) {
              const raw = fs.readFileSync(emFile, 'utf-8');
              res.end(raw || JSON.stringify({ active: false }));
            } else {
              res.end(JSON.stringify({ active: false }));
            }
          } catch {
            res.end(JSON.stringify({ active: false }));
          }
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}');
              fs.writeFileSync(emFile, JSON.stringify(payload, null, 2), 'utf-8');
              res.end(JSON.stringify({ success: true, emergency: payload }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
      });
    }
  };
}

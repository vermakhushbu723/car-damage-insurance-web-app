// `npm run dev` entry point: starts the local AI ILA backend (YOLO service on
// 8001 + Node assessment server on 8000, from ../ai-damage-assessment-service)
// in the background, then Vite. A service whose port is already in use is
// assumed to be running and is skipped. Ctrl+C stops everything this started.
// Use `npm run dev:web` for Vite alone.

const { spawn } = require('node:child_process');
const net = require('node:net');
const path = require('node:path');
const fs = require('node:fs');

const AI_ROOT = path.resolve(__dirname, '..', '..', 'ai-damage-assessment-service');
const isWin = process.platform === 'win32';
const children = [];

function portInUse(port) {
    return new Promise((resolve) => {
        const socket = net.connect(port, '127.0.0.1');
        socket.once('connect', () => { socket.destroy(); resolve(true); });
        socket.once('error', () => resolve(false));
    });
}

function start(name, command, args, cwd) {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], shell: false });
    const prefix = `[${name}] `;
    const pipe = (stream, out) => stream.on('data', (chunk) => {
        chunk.toString().split(/\r?\n/).filter(Boolean).forEach((line) => out.write(prefix + line + '\n'));
    });
    pipe(child.stdout, process.stdout);
    pipe(child.stderr, process.stderr);
    child.on('exit', (code) => console.log(`${prefix}exited (${code})`));
    children.push(child);
}

async function startService(name, port, command, args, cwd) {
    if (await portInUse(port)) {
        console.log(`[${name}] port ${port} already in use, assuming it's running -- skipped`);
        return;
    }
    if (!fs.existsSync(cwd)) {
        console.warn(`[${name}] ${cwd} not found -- skipped`);
        return;
    }
    console.log(`[${name}] starting on port ${port}`);
    start(name, command, args, cwd);
}

function stopAll() {
    for (const child of children) {
        if (child.exitCode !== null) continue;
        if (isWin) spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
        else child.kill('SIGTERM');
    }
}

(async () => {
    const yoloDir = path.join(AI_ROOT, 'yolo-service');
    const python = path.join(yoloDir, '.venv', isWin ? 'Scripts/python.exe' : 'bin/python');
    await startService('yolo', 8001, python,
        ['-m', 'uvicorn', 'app:app', '--host', '127.0.0.1', '--port', '8001'], yoloDir);
    await startService('ai-server', 8000, process.execPath, ['src/server.js'], path.join(AI_ROOT, 'server'));

    const viteBin = path.resolve(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    const vite = spawn(process.execPath, [viteBin, ...process.argv.slice(2)], { stdio: 'inherit' });
    vite.on('exit', (code) => { stopAll(); process.exit(code ?? 0); });

    for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { stopAll(); vite.kill(sig); });
    process.on('exit', stopAll);
})();

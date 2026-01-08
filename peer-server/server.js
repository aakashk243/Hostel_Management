const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dgram = require('dgram');

const app = express();
const PORT = 5000; 
const DISCOVERY_PORT = 8889;
const SHARED_DIR = path.join(__dirname, '../backend/shared_files');

if (!fs.existsSync(SHARED_DIR)) fs.mkdirSync(SHARED_DIR, { recursive: true });

app.use(cors());
app.use(express.json());

// 1. UPLOAD: Save local files
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, SHARED_DIR),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    res.send({ message: "File saved locally and ready for P2P sharing!" });
});

// 2. DOWNLOAD: Allow other peers to pull files from YOU
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(SHARED_DIR, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath); 
    } else {
        res.status(404).send("File not found on this peer.");
    }
});

app.get('/my-files', (req, res) => {
    fs.readdir(SHARED_DIR, (err, files) => res.json(files || []));
});

// 3. NO CENTRAL SERVER: UDP Discovery
const peers = new Set();
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
    if (msg.toString() === 'HI_PEER') {
        peers.add(rinfo.address);
        console.log(`Peer Found: ${rinfo.address}`);
    }
});

// Broadcast your presence every 5 seconds
setInterval(() => {
    const message = Buffer.from('HI_PEER');
    udpServer.send(message, 0, message.length, DISCOVERY_PORT, '255.255.255.255');
}, 5000);

udpServer.bind(DISCOVERY_PORT);

app.get('/peers', (req, res) => res.json(Array.from(peers)));

app.listen(PORT, () => console.log(`Peer Node active on port ${PORT}`));
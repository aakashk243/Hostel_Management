import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [peers, setPeers] = useState([]);
  const [myFiles, setMyFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [peerFiles, setPeerFiles] = useState({});
  const API = "http://localhost:5000";

  const refreshData = async () => {
    try {
      const pRes = await axios.get(`${API}/peers`);
      setPeers(pRes.data);
      const fRes = await axios.get(`${API}/my-files`);
      setMyFiles(fRes.data);
      pRes.data.forEach(ip => fetchFilesFromPeer(ip));
    } catch (err) { console.error("Peer server is offline"); }
  };

  const fetchFilesFromPeer = async (ip) => {
    try {
      const res = await axios.get(`http://${ip}:5000/my-files`);
      setPeerFiles(prev => ({ ...prev, [ip]: res.data }));
    } catch (err) { console.error(`Could not reach peer ${ip}`); }
  };

  useEffect(() => { refreshData(); }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    await axios.post(`${API}/upload`, formData);
    refreshData();
    alert("File shared on your node!");
  };

  return (
    <div className="container">
      <header>
        <h1>🎓 Academic P2P Network</h1>
        <p>Direct File Sharing Between Students</p>
      </header>

      <div className="card">
        <h3>📤 Your Local Resources</h3>
        <div className="upload-section">
          <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          <button onClick={handleUpload}>Upload to My Node</button>
        </div>
        <div style={{ marginTop: '20px' }}>
          {myFiles.map(f => <div key={f} className="file-item">📄 {f}</div>)}
        </div>
      </div>

      <div className="card">
        <h3>🌐 Peer Resources (Network)</h3>
        <button onClick={refreshData} style={{ marginBottom: '15px' }}>Scan for Peers</button>
        {peers.length === 0 && <p style={{color: '#999'}}>Searching for active students on network...</p>}
        {peers.map(ip => (
          <div key={ip} className="peer-section">
            <h4>📍 Peer IP: {ip}</h4>
            {peerFiles[ip] && peerFiles[ip].length > 0 ? (
              peerFiles[ip].map(file => (
                <div key={file} className="file-item">
                  <span>📄 {file}</span>
                  <button className="dl-btn" onClick={() => window.open(`http://${ip}:5000/download/${file}`, '_blank')}>
                    Download
                  </button>
                </div>
              ))
            ) : <p style={{fontSize: '0.9rem'}}>No files shared by this peer.</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
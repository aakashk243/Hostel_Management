import React, { useState, useEffect } from 'react';
import './App.css'; 

const App = () => {
  const [role, setRole] = useState(null); 
  const [socket, setSocket] = useState(null);
  
  const [formData, setFormData] = useState({ room: '', category: 'Water', desc: '', slot: '' });
  const [ack, setAck] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('ALL');

  // List of Categories for the new buttons
  const CATEGORIES = ['Water', 'Electricity', 'Internet', 'Cleanliness', 'Furniture', 'Other'];

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === 'Received') {
        setAck(data.msg);
        setFormData(prev => ({...prev, desc: '', slot: ''})); 
        setTimeout(() => setAck(''), 3000);
      } else if (data.type === 'SUBMIT_COMPLAINT') {
        setComplaints(prev => {
          const exists = prev.find(c => c.id === data.id);
          return exists ? prev.map(c => c.id === data.id ? data : c) : [data, ...prev];
        });
      }
    };
    setSocket(ws);
    return () => ws.close();
  }, []);

  const loginWarden = () => {
    setRole('warden');
    socket.send(JSON.stringify({ type: 'IDENTIFY', role: 'WARDEN' }));
  };

  const submitComplaint = () => {
    if(!formData.room || !formData.desc || !formData.slot) return alert("Please fill all fields!");
    socket.send(JSON.stringify({
      type: 'SUBMIT_COMPLAINT', id: Date.now().toString(), ...formData, timestamp: new Date().toLocaleTimeString()
    }));
  };

  const resolveComplaint = (id) => socket.send(JSON.stringify({ type: 'RESOLVE_COMPLAINT', id }));

  // Helper calculations
  const total = complaints.length;
  const pendingCount = complaints.filter(c => c.status !== 'Resolved').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const visibleComplaints = complaints.filter(c => {
    if (filter === 'PENDING') return c.status !== 'Resolved';
    if (filter === 'RESOLVED') return c.status === 'Resolved';
    return true; 
  });

  // --- LOGIN SCREEN ---
  if (!role) {
    return (
      <div className="login-container">
        <h1>Hostel Complaint System</h1>
        <div className="role-buttons">
          <button onClick={() => setRole('student')} className="role-btn student-btn">👨‍🎓 Student</button>
          <button onClick={loginWarden} className="role-btn warden-btn">👮‍♂️ Warden</button>
        </div>
      </div>
    );
  }

  // --- STUDENT PORTAL (Updated with Animation) ---
  if (role === 'student') {
    return (
      <div className="app-container">
        <div className="portal-header">
          <div><h2>📝 Student Portal</h2></div>
          <button onClick={() => setRole(null)} className="logout-btn">Back</button>
        </div>
        
        <div className="student-body">
          <div style={{marginBottom:'20px'}}>
            <label>🏠 Room Number</label>
            <input 
              type="text" 
              placeholder="e.g. 101-B" 
              value={formData.room} 
              onChange={e => setFormData({...formData, room: e.target.value})} 
            />
          </div>

          <div style={{marginBottom:'25px'}}>
            <label>⚠️ Select Category</label>
            {/* NEW: Animated Category Tabs instead of Dropdown */}
            <div className="filter-tabs" style={{width: '100%'}}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-tab ${formData.category === cat ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, category: cat})}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{marginBottom: '20px'}}>
            <label>📅 Preferred Time Slot</label>
            <input type="datetime-local" value={formData.slot} onChange={e => setFormData({...formData, slot: e.target.value})} />
          </div>
          
          <div style={{marginBottom: '25px'}}>
            <label>💬 Description</label>
            <textarea rows="4" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
          </div>
          
          <button onClick={submitComplaint} className="submit-btn">Submit Request</button>
        </div>
        
        {ack && <div className="success-popup">✅ {ack}</div>}
      </div>
    );
  }

  // --- WARDEN DASHBOARD ---
  return (
    <div className="app-container" style={{maxWidth:'900px'}}>
      <div className="portal-header">
        <div><h2>🛡️ Warden Dashboard</h2></div>
        <button onClick={() => setRole(null)} className="logout-btn">Logout</button>
      </div>

      <div className="warden-body">
        {/* Warden Filter Tabs (Same Animation!) */}
        <div className="filter-tabs">
          <button className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>
            All <span className="count-badge">{total}</span>
          </button>
          <button className={`filter-tab ${filter === 'PENDING' ? 'active' : ''}`} onClick={() => setFilter('PENDING')}>
            Pending <span className="count-badge">{pendingCount}</span>
          </button>
          <button className={`filter-tab ${filter === 'RESOLVED' ? 'active' : ''}`} onClick={() => setFilter('RESOLVED')}>
            Resolved <span className="count-badge">{resolvedCount}</span>
          </button>
        </div>

        {visibleComplaints.length === 0 ? (
          <div style={{textAlign:'center', color:'#aaa', marginTop:'50px'}}>No complaints here.</div>
        ) : (
          visibleComplaints.map((c) => (
            <div key={c.id} className="complaint-card" style={{
              borderLeft: c.status === 'Resolved' ? '5px solid #22c55e' : '5px solid #ef4444',
              opacity: c.status === 'Resolved' ? 0.8 : 1
            }}>
              <div className="card-header">
                <span className="room-tag">Room {c.room}</span>
                {c.status === 'Resolved' ? <span className="resolved-tag">✅ RESOLVED</span> : 
                  <button onClick={() => resolveComplaint(c.id)} className="resolve-btn">Mark Resolved</button>
                }
              </div>
              <h4 style={{marginBottom:'5px', color:'#334155'}}>{c.category} Issue</h4>
              <p style={{color:'#64748b', lineHeight:'1.5'}}>{c.desc}</p>
              <div className="time-slot-box"><strong>🕒 Student Available:</strong> {new Date(c.slot).toLocaleString()}</div>
              <div style={{textAlign:'right', fontSize:'0.8rem', color:'#94a3b8', marginTop:'10px'}}>ID: {c.id} • {c.timestamp}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
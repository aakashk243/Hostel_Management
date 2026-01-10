import React, { useState, useEffect, useRef } from 'react';
import './Complaints.css'; 

const Complaints = () => {
  const socketRef = useRef(null);
  const [formData, setFormData] = useState({ room: '', category: 'Water', desc: '', slot: '' });
  const [ack, setAck] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  // List of Categories for the new buttons
  const CATEGORIES = ['Water', 'Electricity', 'Internet', 'Cleanliness', 'Furniture', 'Other'];

  // Get role from localStorage
  const getRole = () => {
    return localStorage.getItem("role") || null;
  };

  const setRole = (role) => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
    window.location.reload(); // Refresh to update role
  };

  // Initialize WebSocket connection
  const initializeWebSocket = () => {
    const ws = new WebSocket('ws://localhost:8080/complaints-ws');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      setReconnectAttempt(0);
      
      // Identify role after connection
      const role = getRole();
      if (role) {
        ws.send(JSON.stringify({ 
          type: 'IDENTIFY', 
          role: role.toUpperCase(),
          userId: localStorage.getItem("userId") || `user_${Date.now()}`
        }));
        
        // Load existing complaints for warden
        if (role === 'warden') {
          ws.send(JSON.stringify({ type: 'GET_COMPLAINTS' }));
        }
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        switch(data.type) {
          case 'CONNECTION_ACK':
            console.log('Connection acknowledged:', data.message);
            break;
            
          case 'COMPLAINT_ACK':
            setAck(data.message);
            setFormData(prev => ({...prev, desc: '', slot: ''}));
            setTimeout(() => setAck(''), 3000);
            
            // Add to local state for student to see their own complaint
            if (getRole() === 'student') {
              setComplaints(prev => [data.complaint, ...prev]);
            }
            break;
            
          case 'COMPLAINT_LIST':
            if (data.complaints) {
              setComplaints(data.complaints);
            }
            break;
            
          case 'NEW_COMPLAINT':
            setComplaints(prev => {
              const exists = prev.find(c => c.id === data.complaint.id);
              return exists ? prev.map(c => c.id === data.complaint.id ? data.complaint : c) : [data.complaint, ...prev];
            });
            break;
            
          case 'COMPLAINT_RESOLVED':
            setComplaints(prev => 
              prev.map(c => c.id === data.id ? { ...c, status: 'Resolved', resolvedAt: data.resolvedAt } : c)
            );
            break;
            
          case 'NOTIFICATION':
            showNotification(data);
            break;
            
          default:
            // Handle legacy format for backward compatibility
            if (data.status === 'Received') {
              setAck(data.msg);
              setFormData(prev => ({...prev, desc: '', slot: ''}));
              setTimeout(() => setAck(''), 3000);
            } else if (data.type === 'SUBMIT_COMPLAINT' || data.id) {
              setComplaints(prev => {
                const exists = prev.find(c => c.id === data.id);
                return exists ? prev.map(c => c.id === data.id ? data : c) : [data, ...prev];
              });
            }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      
      // Attempt reconnection
      if (reconnectAttempt < 5 && getRole()) {
        const timeout = Math.min(3000 * (reconnectAttempt + 1), 10000);
        setTimeout(() => {
          setReconnectAttempt(prev => prev + 1);
          initializeWebSocket();
        }, timeout);
      }
    };

    socketRef.current = ws;
  };

  const showNotification = (data) => {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `notification ${data.priority || 'info'}`;
    notification.innerHTML = `
      <strong>${data.title || 'Notification'}</strong>
      <p>${data.message}</p>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  };

  useEffect(() => {
    // Check for existing complaints in localStorage on initial load
    const savedComplaints = localStorage.getItem('hostelComplaints');
    if (savedComplaints && getRole() === 'warden') {
      setComplaints(JSON.parse(savedComplaints));
    }

    // Initialize WebSocket if user has a role
    if (getRole()) {
      initializeWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Save complaints to localStorage whenever they change (for offline access)
  useEffect(() => {
    if (getRole() === 'warden' && complaints.length > 0) {
      localStorage.setItem('hostelComplaints', JSON.stringify(complaints));
    }
  }, [complaints]);

  const loginWarden = () => {
    setRole('warden');
  };

  const submitComplaint = () => {
    if(!formData.room || !formData.desc || !formData.slot) {
      alert("Please fill all fields!");
      return;
    }
    
    const complaint = {
      id: `complaint_${Date.now()}`,
      type: 'SUBMIT_COMPLAINT',
      room: formData.room,
      category: formData.category,
      desc: formData.desc,
      slot: formData.slot,
      timestamp: new Date().toISOString(),
      status: 'Pending',
      studentId: localStorage.getItem("userId") || `student_${Date.now()}`,
      studentName: localStorage.getItem("userName") || "Anonymous Student"
    };

    // Send via WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(complaint));
    } else {
      // Fallback: Store locally and show warning
      alert("Connection lost. Your complaint will be submitted when connection is restored.");
      const pendingComplaints = JSON.parse(localStorage.getItem('pendingComplaints') || '[]');
      pendingComplaints.push(complaint);
      localStorage.setItem('pendingComplaints', JSON.stringify(pendingComplaints));
      
      // Add to local state for immediate feedback
      setComplaints(prev => [complaint, ...prev]);
      setAck('Complaint saved offline. Will submit when connected.');
      setTimeout(() => setAck(''), 3000);
    }

    // Clear description and slot only
    setFormData(prev => ({...prev, desc: '', slot: ''}));
  };

  const resolveComplaint = (id) => {
    const resolveMessage = {
      type: 'RESOLVE_COMPLAINT',
      id,
      resolvedBy: localStorage.getItem("userName") || "Warden",
      resolvedAt: new Date().toISOString()
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(resolveMessage));
    } else {
      // Update locally
      setComplaints(prev => 
        prev.map(c => c.id === id ? { 
          ...c, 
          status: 'Resolved', 
          resolvedAt: new Date().toISOString() 
        } : c)
      );
      alert("Marked as resolved locally. Update will sync when connected.");
    }
  };

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
  if (!getRole()) {
    return (
      <div className="login-container">
        <h1>Hostel Complaint System</h1>
        {reconnectAttempt > 0 && (
          <div className="connection-status reconnecting">
            ⚡ Reconnecting... Attempt {reconnectAttempt} of 5
          </div>
        )}
        <div className="role-buttons">
          <button onClick={() => setRole('student')} className="role-btn student-btn">👨‍🎓 Student</button>
          <button onClick={loginWarden} className="role-btn warden-btn">👮‍♂️ Warden</button>
        </div>
      </div>
    );
  }

  // --- STUDENT PORTAL ---
  if (getRole() === 'student') {
    return (
      <div className="app-container">
        <div className="portal-header">
          <div>
            <h2>📝 Student Portal</h2>
            <div className="connection-status">
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>
          </div>
          {/* <button onClick={() => setRole(null)} className="logout-btn">Logout</button> */}
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
            <input 
              type="datetime-local" 
              value={formData.slot} 
              onChange={e => setFormData({...formData, slot: e.target.value})} 
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          
          <div style={{marginBottom: '25px'}}>
            <label>💬 Description</label>
            <textarea 
              rows="4" 
              placeholder="Describe your issue in detail..." 
              value={formData.desc} 
              onChange={e => setFormData({...formData, desc: e.target.value})} 
            />
          </div>
          
          <button onClick={submitComplaint} className="submit-btn" disabled={!isConnected}>
            {isConnected ? 'Submit Request' : 'Submit (Offline)'}
          </button>
          
          {/* Show student's submitted complaints */}
          {complaints.length > 0 && (
            <div style={{marginTop: '30px'}}>
              <h3>📋 Your Submitted Complaints</h3>
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
              
              {visibleComplaints.map((c) => (
                <div key={c.id} className="complaint-card" style={{
                  borderLeft: c.status === 'Resolved' ? '5px solid #22c55e' : '5px solid #ef4444'
                }}>
                  <div className="card-header">
                    <span className="room-tag">Room {c.room}</span>
                    <span className={`status-tag ${c.status === 'Resolved' ? 'resolved' : 'pending'}`}>
                      {c.status === 'Resolved' ? '✅ RESOLVED' : '⏳ PENDING'}
                    </span>
                  </div>
                  <h4 style={{marginBottom:'5px', color:'#334155'}}>{c.category} Issue</h4>
                  <p style={{color:'#64748b', lineHeight:'1.5'}}>{c.desc}</p>
                  <div className="time-slot-box">
                    <strong>🕒 Preferred Time:</strong> {new Date(c.slot).toLocaleString()}
                  </div>
                  {c.resolvedAt && (
                    <div className="time-slot-box" style={{backgroundColor: '#f0fdf4'}}>
                      <strong>✅ Resolved On:</strong> {new Date(c.resolvedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {ack && <div className="success-popup">✅ {ack}</div>}
      </div>
    );
  }

  // --- WARDEN DASHBOARD ---
  return (
    <div className="app-container" style={{maxWidth:'900px'}}>
      <div className="portal-header">
        <div>
          <h2>🛡️ Warden Dashboard</h2>
          <div className="connection-status">
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            {!isConnected && <span style={{fontSize: '0.8rem', marginLeft: '10px'}}>Showing cached data</span>}
          </div>
        </div>
        {/* <button onClick={() => setRole(null)} className="logout-btn">Logout</button> */}
      </div>

      <div className="warden-body">
        {/* Stats Overview */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{total}</div>
            <div className="stat-label">Total Complaints</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-number">{resolvedCount}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        {/* Warden Filter Tabs */}
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
          <div style={{textAlign:'center', color:'#aaa', marginTop:'50px'}}>
            {isConnected ? 'No complaints to display.' : 'No cached complaints found.'}
          </div>
        ) : (
          visibleComplaints.map((c) => (
            <div key={c.id} className="complaint-card" style={{
              borderLeft: c.status === 'Resolved' ? '5px solid #22c55e' : '5px solid #ef4444',
              opacity: c.status === 'Resolved' ? 0.8 : 1
            }}>
              <div className="card-header">
                <div>
                  <span className="room-tag">Room {c.room}</span>
                  <span className={`category-tag ${c.category.toLowerCase()}`}>{c.category}</span>
                  {c.studentName && <span className="student-tag">👤 {c.studentName}</span>}
                </div>
                {c.status === 'Resolved' ? 
                  <span className="resolved-tag">✅ RESOLVED</span> : 
                  <button 
                    onClick={() => resolveComplaint(c.id)} 
                    className="resolve-btn"
                    disabled={!isConnected}
                  >
                    {isConnected ? 'Mark Resolved' : 'Mark (Offline)'}
                  </button>
                }
              </div>
              <h4 style={{marginBottom:'5px', color:'#334155'}}>{c.category} Issue</h4>
              <p style={{color:'#64748b', lineHeight:'1.5'}}>{c.desc}</p>
              <div className="time-slot-box">
                <strong>🕒 Student Available:</strong> {new Date(c.slot).toLocaleString()}
              </div>
              {c.resolvedAt && (
                <div className="time-slot-box" style={{backgroundColor: '#f0fdf4'}}>
                  <strong>✅ Resolved On:</strong> {new Date(c.resolvedAt).toLocaleString()} 
                  {c.resolvedBy && <span> by {c.resolvedBy}</span>}
                </div>
              )}
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize:'0.8rem', color:'#94a3b8', marginTop:'10px'}}>
                <span>ID: {c.id}</span>
                <span>Submitted: {new Date(c.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Complaints;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MissingItem.css";

function MissingItem() {
  const [student, setStudent] = useState("");
  const [item, setItem] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [complaints, setComplaints] = useState([]);

  const submitComplaint = async () => {
    if (!student || !item || !location) {
      setMessage("⚠️ Fill all fields");
      return;
    }

    await axios.post("http://localhost:8080/missing/report", null, {
      params: { student, item, location },
    });

    setMessage("✅ Complaint submitted");
    setStudent("");
    setItem("");
    setLocation("");
    fetchComplaints();
  };

  const fetchComplaints = async () => {
    const res = await axios.get("http://localhost:8080/missing/all");
    setComplaints(res.data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="missing-container">
      <h2>🚨 Missing Item Complaint</h2>

      <div className="missing-form">
        <input
          placeholder="Student Name"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
        />
        <input
          placeholder="Missing Item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <input
          placeholder="Last Seen Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button onClick={submitComplaint}>Report Item</button>
        {message && <p>{message}</p>}
      </div>

      <h3>📋 Reported Items</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Item</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.studentName}</td>
              <td>{c.itemName}</td>
              <td>{c.location}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MissingItem;

import React, { useState } from "react";
import axios from "axios";
import "./LaundryService.css";

function LaundryService() {
  const [student, setStudent] = useState("");
  const [clothes, setClothes] = useState("");
  const [message, setMessage] = useState("");
  const [queueSize, setQueueSize] = useState(null);

  const submitLaundry = async () => {
    if (!student || !clothes) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:8080/laundry/request", null, {
        params: {
          student: student,
          clothes: clothes,
        },
      });

      setMessage("✅ Laundry request submitted successfully!");
      setStudent("");
      setClothes("");
    } catch (err) {
      setMessage("❌ Server error. Try again.");
    }
  };

  const fetchQueueSize = async () => {
    const res = await axios.get(
      "http://localhost:8080/laundry/queue-size"
    );
    setQueueSize(res.data);
  };

  return (
    <div className="laundry-container">
      <h1 className="laundry-title">🧺 Hostel Laundry Service</h1>

      <div className="laundry-card">
        <label>Student Name</label>
        <input
          type="text"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
          placeholder="Enter your name"
        />

        <label>Number of Clothes</label>
        <input
          type="number"
          value={clothes}
          onChange={(e) => setClothes(e.target.value)}
          placeholder="Enter count"
        />

        <button onClick={submitLaundry} className="submit-btn">
          Submit Laundry
        </button>

        {message && <p className="message">{message}</p>}
      </div>

      <div className="queue-section">
        <button onClick={fetchQueueSize} className="queue-btn">
          Check Laundry Queue
        </button>

        {queueSize !== null && (
          <p className="queue-size">
            🧾 Pending Laundry Requests: <b>{queueSize}</b>
          </p>
        )}
      </div>
    </div>
  );
}

export default LaundryService;

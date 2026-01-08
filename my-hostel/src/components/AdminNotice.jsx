import React, { useState } from 'react';
import axios from 'axios';

const AdminNotice = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const submitNotice = async (e) => {
    e.preventDefault();
    await axios.post('/api/notices', { title, message });
    setTitle('');
    setMessage('');
    alert('Notice added');
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">🛠 Add Notice</h2>

      <form onSubmit={submitNotice} className="space-y-4">
        <input
          className="w-full border p-3 rounded"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded"
          placeholder="Message"
          rows="4"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded">
          Post Notice
        </button>
      </form>
    </div>
  );
};

export default AdminNotice;

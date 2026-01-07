import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios.get('/api/notices')
      .then(res => setNotices(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">📢 Hostel Notice Board</h2>

      {notices.length === 0 && (
        <p className="text-gray-500">No notices available</p>
      )}

      {notices.map((n, i) => (
        <div key={i} className="bg-white p-6 mb-4 rounded-xl shadow">
          <h3 className="text-xl font-semibold">{n.title}</h3>
          <p className="mt-2">{n.message}</p>
          <p className="text-sm text-gray-500 mt-2">{n.date}</p>
        </div>
      ))}
    </div>
  );
};

export default NoticeBoard;

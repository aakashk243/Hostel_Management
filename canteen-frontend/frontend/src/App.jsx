import React, { useState } from 'react';
import Login from './Login';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';

function App() {
  const [userType, setUserType] = useState(null);

  const handleLogin = (type) => {
    setUserType(type);
  };

  const handleLogout = () => {
    setUserType(null);
  };

  return (
    <>
      {!userType && <Login onLogin={handleLogin} />}
      {userType === 'student' && <StudentDashboard onLogout={handleLogout} />}
      {userType === 'admin' && <AdminDashboard onLogout={handleLogout} />}
    </>
  );
}

export default App;
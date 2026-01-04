import { useState } from "react";

export default function Login() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role");
      return;
    }

    if (role === "admin") {
      alert(`Admin ${username} logged in`);
    } else {
      alert(`Student ${username} logged in`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          Hostel Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <select
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

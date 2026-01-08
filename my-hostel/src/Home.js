import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const rollNo = localStorage.getItem("rollNo");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-10 text-center">
          <h1 className="text-4xl font-bold">
            Welcome {username}
          </h1>

          {role === "student" && (
            <p className="mt-3 text-lg text-blue-100">
              Roll Number: <span className="font-semibold">{rollNo}</span>
            </p>
          )}

          {role === "admin" && (
            <p className="mt-3 text-lg text-blue-100">
              Admin Dashboard
            </p>
          )}
        </div>
        <div className="container mx-auto px-6 py-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Hostel Management System
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mt-3">
            Manage hostel rooms easily and efficiently
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2">Hostel Complaint Management System</h2>
            <p className="text-gray-600">
              Socket Programming
            </p>
          </div>

          {/* Card 2 */}
          <div onClick={() => navigate("/room-info")} 
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2">Hostel Room Information Service</h2>
            <p className="text-gray-600">
              JAVA RMI
            </p>
          </div>

          {/* Card 3 */}
          <div onClick={() => navigate("/notice-board")} 
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2">Hostel Notice Board System</h2>
            <p className="text-gray-600">
              RPC (REST API)
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2">Student Resource Sharing System</h2>
            <p className="text-gray-600">
              Peer - to - Peer (P2P)
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2">Mess Feedback Live Counter</h2>
            <p className="text-gray-600">
              Shared Memory
            </p>
          </div>

        </div>

        {/* Call to Action */}
        <div className="mt-14 text-center">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition">
            Get Started
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <p className="text-center text-gray-400">
          © 2026 Hostel Management System
        </p>
      </footer>
    </div>
  );
}

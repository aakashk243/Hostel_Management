import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
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
            <h2 className="text-xl font-semibold mb-2">🏠 Room Availability</h2>
            <p className="text-gray-600">
              View available rooms and capacity in real time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2">📅 Easy Booking</h2>
            <p className="text-gray-600">
              Simple and fast hostel room booking process.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2">🛠 Admin Control</h2>
            <p className="text-gray-600">
              Admins can manage rooms, students, and bookings.
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

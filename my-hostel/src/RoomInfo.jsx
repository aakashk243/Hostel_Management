import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaDoorOpen, FaBuilding } from 'react-icons/fa';
import RoomSearch from './components/RoomSearch';
import RoomBooking from './components/RoomBooking';
import './App.css';

function RoomInfo() {
  const [activeTab, setActiveTab] = useState('search');

  const tabs = [
    { id: 'search', label: 'Room Search', icon: <FaSearch /> },
    { id: 'booking', label: 'Book Room', icon: <FaDoorOpen /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl"
      >
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <FaBuilding className="text-5xl mr-4" />
              <h1 className="text-5xl font-bold">Hostel Management System</h1>
            </div>
            <p className="text-xl text-blue-100 mt-2">Search & Book Your Perfect Room</p>
          </motion.div>
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-2 inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }
                `}
              >
                <span className="mr-3 text-2xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'search' && <RoomSearch />}
            {activeTab === 'booking' && <RoomBooking />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2026 Hostel Management System | Powered by React + Spring Boot
          </p>
        </div>
      </footer>
    </div>
  );
}

export default RoomInfo;
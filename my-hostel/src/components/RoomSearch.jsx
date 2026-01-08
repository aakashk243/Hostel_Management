import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaSearch, FaDoorOpen, FaUsers, FaUserTie, FaPhone, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const RoomSearch = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchRoom = async () => {
    if (!roomNumber.trim()) {
      toast.error('Please enter a room number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/rooms/${roomNumber}`);
      setRoomData(response.data);
      toast.success('Room found!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Room not found');
      setRoomData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchRoom();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Search Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FaSearch className="mr-3 text-blue-600" />
          Search Room Details
        </h2>

        <div className="flex gap-4">
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter room number (e.g., 101, 202, 303)"
            className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={searchRoom}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Searching...
              </div>
            ) : (
              <div className="flex items-center">
                <FaSearch className="mr-2" />
                Search
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Results Card */}
      {roomData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-2xl p-8 border-2 border-green-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-green-700 flex items-center">
              <FaCheckCircle className="mr-3" />
              Room Found
            </h3>
            <span className={`px-4 py-2 rounded-full font-semibold ${
              roomData.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {roomData.available ? 'Available' : 'Occupied'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              icon={<FaDoorOpen />}
              label="Room Number"
              value={roomData.roomNumber}
              color="blue"
            />
            <InfoCard
              icon={<FaBuilding />}
              label="Floor"
              value={`Floor ${roomData.floor}`}
              color="purple"
            />
            <InfoCard
              icon={<FaUsers />}
              label="Capacity"
              value={`${roomData.capacity} students`}
              color="indigo"
            />
            <InfoCard
              icon={<FaCheckCircle />}
              label="Available Spots"
              value={`${roomData.availableSpots} spots`}
              color="green"
            />
          </div>

          {/* Occupants */}
          <div className="mt-6 p-6 bg-white rounded-2xl shadow-md">
            <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <FaUsers className="mr-2 text-blue-600" />
              Current Occupants
            </h4>
            {roomData.occupants && roomData.occupants.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {roomData.occupants.map((name, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No occupants - Room is available</p>
            )}
          </div>

          {/* Warden Info */}
          <div className="mt-6 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaUserTie className="mr-2 text-indigo-600" />
              Warden Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaUserTie className="text-2xl text-indigo-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-800">{roomData.wardenName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-2xl text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-gray-800">{roomData.wardenContact}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const InfoCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white mb-3`}>
        {React.cloneElement(icon, { className: 'text-2xl' })}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default RoomSearch;
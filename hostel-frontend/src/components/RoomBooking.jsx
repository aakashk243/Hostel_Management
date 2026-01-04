import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaDoorOpen, FaUsers, FaBuilding, FaCheckCircle, FaTimesCircle, FaUserTie, FaPhone } from 'react-icons/fa';
import axios from 'axios';

const RoomBooking = () => {
  const [formData, setFormData] = useState({
    studentNames: '',
    numberOfOccupants: 1,
    preferredFloor: 1,
    preferredRoomNumber: ''
  });
  const [bookingResult, setBookingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfOccupants' || name === 'preferredFloor' 
        ? parseInt(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const names = formData.studentNames
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    if (names.length === 0) {
      toast.error('Please enter at least one student name');
      return;
    }

    setLoading(true);
    setBookingResult(null);

    try {
      const payload = {
        studentNames: names,
        numberOfOccupants: formData.numberOfOccupants,
        preferredFloor: formData.preferredFloor,
        preferredRoomNumber: formData.preferredRoomNumber.trim()
      };

      const response = await axios.post('/api/bookings', payload);
      setBookingResult(response.data);
      
      if (response.data.success) {
        toast.success('Room booked successfully!');
        // Reset form
        setFormData({
          studentNames: '',
          numberOfOccupants: 1,
          preferredFloor: 1,
          preferredRoomNumber: ''
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Booking failed';
      toast.error(errorMsg);
      setBookingResult({
        success: false,
        message: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Booking Form Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FaDoorOpen className="mr-3 text-indigo-600" />
          Book Your Room
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Names */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Student Names <span className="text-red-500">*</span>
            </label>
            <textarea
              name="studentNames"
              value={formData.studentNames}
              onChange={handleInputChange}
              placeholder="Enter student names (one per line)&#10;John Smith&#10;Jane Doe"
              rows="4"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
              required
            />
            <p className="text-sm text-gray-500 mt-2">Enter one name per line</p>
          </div>

          {/* Number of Occupants */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Number of Occupants
            </label>
            <select
              name="numberOfOccupants"
              value={formData.numberOfOccupants}
              onChange={handleInputChange}
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            >
              <option value="1">1 Student</option>
              <option value="2">2 Students</option>
              <option value="3">3 Students</option>
            </select>
          </div>

          {/* Preferred Floor */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Preferred Floor
            </label>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(floor => (
                <motion.button
                  key={floor}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData(prev => ({ ...prev, preferredFloor: floor }))}
                  className={`
                    py-4 rounded-xl font-semibold text-lg transition-all
                    ${formData.preferredFloor === floor
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  Floor {floor}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Preferred Room */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Preferred Room Number <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              name="preferredRoomNumber"
              value={formData.preferredRoomNumber}
              onChange={handleInputChange}
              placeholder="e.g., 202, 305"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            />
            <p className="text-sm text-gray-500 mt-2">Leave empty for automatic allocation</p>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Processing Booking...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaCheckCircle className="mr-3 text-2xl" />
                Book Room
              </div>
            )}
          </motion.button>
        </form>
      </div>

      {/* Booking Result */}
      {bookingResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-8 rounded-3xl shadow-2xl p-8 ${
            bookingResult.success
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
              : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200'
          }`}
        >
          <div className="flex items-center mb-6">
            {bookingResult.success ? (
              <FaCheckCircle className="text-5xl text-green-600 mr-4" />
            ) : (
              <FaTimesCircle className="text-5xl text-red-600 mr-4" />
            )}
            <div>
              <h3 className={`text-3xl font-bold ${
                bookingResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {bookingResult.success ? 'Booking Successful!' : 'Booking Failed'}
              </h3>
              <p className="text-lg text-gray-700 mt-1">{bookingResult.message}</p>
            </div>
          </div>

          {bookingResult.success && (
            <div className="space-y-6">
              {/* Room Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  icon={<FaDoorOpen />}
                  label="Room Number"
                  value={bookingResult.allocatedRoomNumber}
                  color="blue"
                />
                <ResultCard
                  icon={<FaBuilding />}
                  label="Floor"
                  value={`Floor ${bookingResult.allocatedFloor}`}
                  color="purple"
                />
              </div>

              {/* Warden Info */}
              <div className="p-6 bg-white rounded-2xl shadow-lg">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaUserTie className="mr-2 text-indigo-600" />
                  Contact Your Warden
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FaUserTie className="text-2xl text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Warden Name</p>
                      <p className="font-semibold text-gray-800">{bookingResult.wardenName}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="text-2xl text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Contact Number</p>
                      <p className="font-semibold text-gray-800">{bookingResult.wardenContact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

const ResultCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white mb-3`}>
        {React.cloneElement(icon, { className: 'text-2xl' })}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default RoomBooking;
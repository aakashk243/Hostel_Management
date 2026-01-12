import React from 'react';
import { User, Shield } from 'lucide-react';

const Login = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Hostel Assist
          </h1>
          <p className="text-gray-600 text-lg">Canteen Service</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => onLogin('student')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <User size={24} />
            <span className="text-lg">Login as Student</span>
          </button>
          
          <button
            onClick={() => onLogin('admin')}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Shield size={24} />
            <span className="text-lg">Login as Admin</span>
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Distributed Systems Lab Project</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
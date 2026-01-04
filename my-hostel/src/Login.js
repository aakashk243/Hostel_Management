import { useState } from "react";
const ADMIN_LIST = ["warden1","warden2","warden3","admin1"];

export default function Login() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [error, setError] = useState("");

  const validateRollNumber = (roll) => {
    // Format: CH.(SC/AI/EN).(U4/I2).(CSE/AIE/CYS/AID/ECE/CCE/MEE/ARE/RAI)(YY)(XXX)
    const regex = /^CH\.(SC|AI|EN)\.(U4|I2)(CSE|AIE|CYS|AID|ECE|CCE|MEE|ARE|RAI)\d{2}\d{3}$/;
    return regex.test(roll);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role");
      return;
    }

    if (role === "admin") {
      if(ADMIN_LIST.includes(username)){
        alert(`Admin ${username} logged in`);
      }
      else alert("Unauthorized admin user");
    } else {
      if (!username.trim()) {
        setError("Please enter your name");
        return;
      }
      if (!validateRollNumber(rollNo)) {
        setError("Invalid roll number format. Example: CH.SC.U4.CSE23001");
        return;
      }
      alert(`Student logged in successfully!\nName: ${username}\nRoll No: ${rollNo}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Hostel Portal</h2>
          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>

        <div className="space-y-5">
          {/* Role selection - moved to top */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setRollNo("");
                setError("");
              }}
            >
              <option value="">Choose your role</option>
              <option value="admin">🔐 Admin/Warden</option>
              <option value="student">🎓 Student</option>
            </select>
          </div>

          {role && (
            <>
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {role === "admin" ? "Admin Name" : "Full Name"}
                </label>
                <input
                  type="text"
                  placeholder={role === "admin" ? "Enter admin name" : "Enter your name"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                />
              </div>

              {/* Student-only Roll Number */}
              {role === "student" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    placeholder="CH.SC.U4.CSE23001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 font-mono"
                    value={rollNo}
                    onChange={(e) => {
                      setRollNo(e.target.value.toUpperCase());
                      setError("");
                    }}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Format: CH.(SC/AI/EN).(U4/I2).(BRANCH)(YEAR)(NUMBER)
                  </p>
                </div>
              )}
            </>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Login
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? Contact your hostel administrator</p>
        </div>
      </div>
    </div>
  );
}

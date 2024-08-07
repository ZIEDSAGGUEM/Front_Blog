import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
const Navigation: React.FC = () => {
  const { userId, setUserId } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-lg font-semibold text-gray-800 hover:text-indigo-600"
          >
            Posts
          </Link>
          {userId ? (
            <Link
              to="/dashboard"
              className="text-lg font-semibold text-gray-800 hover:text-indigo-600"
            >
              My Account
            </Link>
          ) : (
            <Link
              to="/register"
              className="text-lg font-semibold text-gray-800 hover:text-indigo-600"
            >
              Register
            </Link>
          )}
        </div>
        {userId ? (
          <button
            onClick={handleLogout}
            className="text-lg font-semibold text-gray-800 hover:text-red-600"
          >
            Logout
          </button>
        ) : (
          <button className="text-lg font-semibold text-gray-800 hover:text-red-600">
            <Link to="/login">Login</Link>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

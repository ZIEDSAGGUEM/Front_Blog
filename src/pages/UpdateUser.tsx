import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
interface AxiosError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const UpdateUser: React.FC = () => {
  const { userId } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/user/${userId}`
        );
        setEmail(response.data.user.email);
        setUsername(response.data.user.username);
        console.log(response.data);
      } catch (err) {
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API}/update/${userId}`, {
        email,
        password,
        username,
      });
      setSuccess("User updated successfully!");
      setError(null);
      window.location.href = "/";
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      setError(axiosError.response?.data?.message || "An error occurred.");
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Update User Information</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import LinearCurveGraph from "../components/LinearCurveGraph";

interface User {
  id: string;
  username: string;
  email: string;
}

interface Post {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
  date: string;
  likes: number;
  img?: string;
}
interface EntryType {
  postCount: number;
  // Add other properties as needed
}

interface AxiosError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/user/${userId}`
        );
        setUser(response.data.user);
        setPosts(response.data.posts.results);
      } catch (err: unknown) {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "An error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleDelete = async (postId: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API}/user/${userId}/posts/${postId}`
      );
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "An error occurred."
      );
    }
  };
  const userPostData = posts.reduce((acc: any, post) => {
    const user = acc.find((u: any) => u.userId === post.userId);
    if (user) {
      user.postCount += 1;
      user.maxLikes = Math.max(user.maxLikes, post.likes);
      user.totalLikes += post.likes;
    } else {
      acc.push({
        userId: post.userId,
        username: post.username, // Correctly assign the username from the post
        postCount: 1,
        maxLikes: post.likes,
        totalLikes: post.likes,
      });
    }
    return acc;
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading user details and posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        User not found!
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Details Section */}
        <div className="bg-white shadow rounded-lg p-6" data-aos="zoom-y-out">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>ID:</strong> {user.id}
            </p>
            <p className="text-gray-700">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {user.email}
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg transition-colors duration-300">
              <Link
                to={`/update-user/${userId}`}
                className="text-lg font-semibold text-gray-800 hover:text-white"
              >
                Update Profile
              </Link>
            </button>
          </div>
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4">
              User Posts and Likes Graph
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={userPostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="username" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="postCount" fill="#8884d8" name="Post Count" />
                <Bar dataKey="maxLikes" fill="#82ca9d" name="Max Likes">
                  {userPostData.map((entry: EntryType, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.postCount > 10 ? "#8884d8" : "#82ca9d"}
                    />
                  ))}
                </Bar>
                <Bar dataKey="totalLikes" fill="#ff3c3c" name="Total Likes">
                  {userPostData.map((entry: EntryType, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.postCount > 10 ? "#333333" : "#ff3c3c"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <LinearCurveGraph data={userPostData} />
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white shadow rounded-lg p-6" data-aos="zoom-y-out">
          <h2 className="text-2xl font-bold mb-4">Posts</h2>
          {posts.length > 0 ? (
            <ul className="space-y-6">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg p-6 transition-shadow hover:shadow-xl"
                >
                  {post.img && (
                    <img
                      src={post.img}
                      alt={post.title || "Post Image"}
                      className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-t-lg mb-4"
                    />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {post.title || "Post Title"}
                    </h3>
                    <p className="text-gray-800 mb-4">
                      {post.description || "Post Content"}
                    </p>
                    <div className="flex justify-between text-gray-600 text-sm mb-4">
                      <p>
                        <strong>Date:</strong> {post.date || "Post Date"}
                      </p>
                      <p>
                        <strong>Likes:</strong> {Number(post.likes)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                      >
                        Delete
                      </button>
                      <Link to={`/update/${post.id}`}>
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-300">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 text-center text-lg py-6">
              No posts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

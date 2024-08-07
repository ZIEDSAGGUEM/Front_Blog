import React, { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Post {
  postId: string;
  userId: string;
  title: string;
  username: string;
  description: string;
  date: string;
  likes: number;
  img?: string;
}

interface AxiosError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}
const ListPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    AOS.init({
      duration: 700, // Animation duration in milliseconds
      easing: "ease-out-cubic", // Easing function
    });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/posts`);
        console.log(response.data);
        setPosts(response.data.results);
      } catch (err: unknown) {
        const axiosError = err as AxiosError;
        toast.error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "An error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/posts/${postId}/like`,
        { userId }
      );
      console.log(response.data);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === postId
            ? { ...post, likes: response.data.likes }
            : post
        )
      );
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "An error occurred."
      );
    }
  };

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg">
        <div className=" flex justify-between items-center">
          <h2 className="text-3xl font-bold mb-6">All Posts</h2>
          <Link
            to="/create"
            className="text-lg font-semibold text-white  bg-blue-600 rounded-2xl p-2"
          >
            Create Blog
          </Link>
        </div>
        {posts.length > 0 ? (
          <ul className="space-y-8" data-aos="zoom-y-out">
            {posts.map((post) => (
              <li
                key={post.postId}
                className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {post.img && (
                    <div className="md:w-1/2">
                      <img
                        src={post.img}
                        alt={post.title || "Post Image"}
                        className="w-full h-72 object-cover rounded-t-lg md:rounded-t-none md:rounded-l-lg"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-800 mb-4">{post.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-500">{post.date}</p>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">
                            {Number(post.likes)}
                          </span>{" "}
                          likes
                        </p>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                        <img
                          src={`https://avatars.dicebear.com/api/initials/${post.username}.svg`}
                          alt={post.username}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span>
                          Posted by:{" "}
                          <span className="font-bold">{post.username}</span>
                        </span>
                      </h4>
                    </div>
                    {userId && (
                      <button
                        onClick={() => handleLike(post.postId)}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 self-start"
                      >
                        Like Post
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700 text-center text-xl py-8">
            No posts found.
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ListPosts;

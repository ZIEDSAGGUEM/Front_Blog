import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AxiosError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}
const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId"); // Assuming user ID is stored in localStorage
      await axios.post(`${import.meta.env.VITE_API}/posts`, {
        userId,
        title,
        description,
        img,
      });

      setTitle("");
      setDescription("");
      setImg("");
      toast.success("Post created successfully! just Wait Please");

      setTimeout(() => {
        window.location.href = "/";
      }, 8000);

      // Redirect to the home page after successful creation
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "An error occurred."
      );
    }
  };

  return (
    <>
      <div
        className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg"
        data-aos="zoom-y-out"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create a New Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 p-2 block w-full rounded-md border-gray-800 shadow-sm  sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1  p-2 block w-full rounded-md border-gray-800 shadow-sm  sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="img"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="text"
              id="img"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              className="mt-1  p-2 block w-full rounded-md border-gray-800 shadow-sm  sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Post
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreatePost;

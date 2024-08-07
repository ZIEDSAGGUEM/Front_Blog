import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import ListPosts from "./pages/ListPosts";
import UpdatePost from "./pages/UpdatePost";
import Navigation from "./components/Navigation";
import UpdateUser from "./pages/UpdateUser"; // Import the UpdateUser component
import { AuthProvider, useAuth } from "./AuthContext"; // Import AuthProvider and useAuth

const AppRoutes = () => {
  const { userId } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<ListPosts />} />
      <Route
        path="/login"
        element={!userId ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!userId ? <Register /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/create"
        element={userId ? <CreatePost /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={userId ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/update/:postId"
        element={userId ? <UpdatePost /> : <Navigate to="/login" />}
      />
      <Route
        path="/update-user/:userId"
        element={userId ? <UpdateUser /> : <Navigate to="/login" />}
      />
      {/* Redirect unknown paths to the main page */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:5001/api/eduNest/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 404) {
        setError("User not found. Please register first.");
        return;
      }

      if (response.status === 401) {
        setError("Incorrect password. Try again.");
        return;
      }

      if (!response.ok) {
        setError(data.message || "Something went wrong. Try again later.");
        return;
      }

      // Store token
      localStorage.setItem("token", data.token);

      // Store user in context (this also syncs to localStorage via UserContext)
      setUser(data.user);

      // Redirect based on user role
      const role = data.user?.role?.toLowerCase();
      if (role === "student") navigate("/students");
      else if (role === "teacher") navigate("/teachers");
      else if (role === "admin") navigate("/admin");
      else if (role === "institute") navigate("/school");
      else navigate("/");

    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full p-6 bg-base-100 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          <LogIn size={24} className="text-primary" /> Login
        </h1>
        <p className="text-center text-base-content/60 mb-6">Welcome back! Please login to your account.</p>

        {/* Error */}
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {/* Email Input */}
        <div className="mb-4">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="mail@site.com"
            required
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
        </button>

        {/* Register Links */}
        <div className="text-center text-sm mt-4 space-y-1">
          <p>
            New user?{" "}
            <Link to="/registerUser" className="text-primary font-semibold hover:underline">Register here</Link>
          </p>
          <p>
            Register institution?{" "}
            <Link to="/registerInstitute" className="text-secondary font-semibold hover:underline">Register Institution</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;

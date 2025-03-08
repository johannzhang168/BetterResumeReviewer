import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Future: Add authentication logic HERE
    navigate("/dashboard"); // Redirect to dashboard after login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Log In</h2>
        <form onSubmit={handleLogin}>
          <label className="block mb-2">Email:</label>
          <input type="email" className="w-full p-2 border rounded mb-4" placeholder="Enter your email" />
          
          <label className="block mb-2">Password:</label>
          <input type="password" className="w-full p-2 border rounded mb-4" placeholder="Enter your password" />
          
          <button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Log In
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up here</Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;    
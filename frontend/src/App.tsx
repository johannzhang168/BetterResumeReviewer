import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        
        {/* Navbar */}
        <nav className="bg-blue-600 text-white p-4 shadow-lg">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold hover:underline">Resume Reviewer</Link>
            <ul className="flex space-x-6">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/signup" className="hover:underline">Register</Link></li>
              <li><Link to="#" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
        </nav>

        {/* ✅ NEW: Add Routes for different pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <header className="text-center py-20 bg-blue-50">
        <h2 className="text-4xl font-extrabold">Get Your Resume Reviewed by Experts</h2>
        <p className="mt-4 text-lg text-gray-600">Increase your chances of landing your dream job!</p>
        
        <Link to="/signup">
          <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Start Here
          </button>
        </Link>
      </header>

      {/* Service Section */}
      <section className="max-w-5xl mx-auto py-12">
        <h3 className="text-2xl font-bold text-center">Our Services</h3>
        <div className="mt-6 flex flex-col md:flex-row justify-center gap-6">
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <h4 className="text-xl font-semibold">Resume Feedback</h4>
            <p className="text-gray-600">Detailed feedback from professionals.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <h4 className="text-xl font-semibold">Resume Rewriting</h4>
            <p className="text-gray-600">We rewrite your resume to stand out.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <h4 className="text-xl font-semibold">Interview Tips</h4>
            <p className="text-gray-600">Ace your interviews with expert advice.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-blue-600 text-white mt-10">
        &copy; 2025 Resume Reviewer. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">BetterResumeReviewer</h1>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Register</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-20 bg-blue-50">
        <h2 className="text-4xl font-extrabold">Get Your Resume Reviewed by FAANG AI</h2>
        <p className="mt-4 text-lg text-gray-600">Increase your chances of landing your dream SWE job!</p>
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Start Here ...
        </button>
      </header>

      {/* Service Section */}
      <section className="max-w-5xl mx-auto py-12">
        <h3 className="text-2xl font-bold text-center">Why Us?</h3>
        <div className="mt-6 flex flex-col md:flex-row justify-center gap-6">
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <h4 className="text-xl font-semibold">Resume Feedback</h4>
            <p className="text-gray-600">Detailed feedback from professionals.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <h4 className="text-xl font-semibold">Resume Rewriting</h4>
            <p className="text-gray-600">Actionable recommendations to improve.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-blue-600 text-white mt-10">
        &copy; 2025 BetterResumeReviewer. All rights reserved.
      </footer>
    </div>
  );
};

export default App;


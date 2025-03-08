const Signup: React.FC = () => {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 shadow-lg rounded-lg w-96">
              <h2 className="text-2xl font-bold text-center mb-4">Sign Up or Log In</h2>
              <form>
                <label className="block mb-2">Email:</label>
                <input type="email" className="w-full p-2 border rounded mb-4" placeholder="Enter your email" />
      
                <label className="block mb-2">Password:</label>
                <input type="password" className="w-full p-2 border rounded mb-4" placeholder="Enter your password" />
      
                <button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Submit
                </button>
              </form>
            </div>
          </div>
        );
      };
      
export default Signup;      
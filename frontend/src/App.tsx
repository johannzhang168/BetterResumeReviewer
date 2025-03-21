import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Layout from "./layout";
import { UserProvider } from "./context/UserProvider";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <Toaster/>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Layout>
      </UserProvider>
    </Router>
  );
};

export default App;
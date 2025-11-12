import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import BrokerConnectionForm from "./components/BrokerConnectionForm";
import MessageViewer from "./components/MessageViewer";
import LoginPage from "./components/Login";
import SignupPage from "./components/Signup";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/connection"
          element={
            token ? (
              <ProtectedLayout>
                <BrokerConnectionForm token={token} />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/messages"
          element={
            token ? (
              <ProtectedLayout>
                <MessageViewer />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;

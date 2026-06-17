import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Visits from "./pages/Visits";
import FollowUps from "./pages/FollowUps";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import MRPerformance from "./pages/MRPerformance";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--bg-surface-hover)',
            color: 'var(--text-h)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--sans)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: { primary: 'var(--primary)', secondary: 'white' }
          }
        }} 
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="/followups" element={<FollowUps />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<Users />} />
            <Route path="/mr-performance" element={<MRPerformance />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
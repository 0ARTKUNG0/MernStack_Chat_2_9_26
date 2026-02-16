import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

import axiosInstance from "./lib/axios";
import Navbar from "./components/Navbar";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("chat-theme") || "sunset"
  );
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("chat-theme", theme);
  }, [theme]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      setAuthUser(res.data.user);
    } catch {
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="min-h-screen">
      <Toaster position="top-center" />
      <Routes>
        <Route
          path="/signin"
          element={
            !authUser ? (
              <SignInPage setAuthUser={setAuthUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !authUser ? (
              <SignUpPage setAuthUser={setAuthUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/"
          element={
            authUser ? (
              <>
                <Navbar authUser={authUser} setAuthUser={setAuthUser} />
                <HomePage />
              </>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            authUser ? (
              <>
                <Navbar authUser={authUser} setAuthUser={setAuthUser} />
                <SettingsPage theme={theme} setTheme={setTheme} />
              </>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            authUser ? (
              <>
                <Navbar authUser={authUser} setAuthUser={setAuthUser} />
                <ProfilePage authUser={authUser} setAuthUser={setAuthUser} />
              </>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage";
import SettingsPage from "../pages/SettingsPage";
import ProfilePage from "../pages/ProfilePage";
import { useAuthStore } from "../store/useAuthStore";

const AppRouter = ({ theme, setTheme }) => {
  const { authUser } = useAuthStore();
  return (
    <Routes>
      <Route
        path="/signin"
        element={
          !authUser ? (
            <SignInPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/signup"
        element={
          !authUser ? (
            <SignUpPage />
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
              <Navbar />
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
              <Navbar />
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
              <Navbar />
              <ProfilePage />
            </>
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;

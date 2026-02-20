import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

import { useAuthStore } from "./store/useAuthStore";
import AppRouter from "./router/AppRouter";

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("chat-theme") || "sunset"
  );
  const { authUser, isCheckedAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("chat-theme", theme);
  }, [theme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckedAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="min-h-screen">
      <Toaster position="top-center" />
      <AppRouter authUser={authUser} theme={theme} setTheme={setTheme} />
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react"; // Added hooks
import image from "/img/rhv logo.png";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.5, duration: 0.8 },
  },
};

const childVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const Navbar = () => {
  const navigate = useNavigate();

  // 1. Move auth logic into State
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
  });

  // 2. Use useEffect to load data ONCE on mount
  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      setAuthState({
        isAuthenticated: !!token,
        isAdmin: user?.isAdmin === true,
      });
    };

    // Run once on mount
    syncAuth();

    // Listen for a custom "authChange" event
    window.addEventListener("authChange", syncAuth);

    // Also listen for changes from other tabs (standard storage event)
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []); // Empty dependency array prevents infinite loop

  const handleCreateUser = () => navigate("/admin/create-user");
  const handleArchive = () => navigate("/archive");

  const getDashboard = () => {
    if (authState.isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChange"));
    // Using navigate instead of window.location for a smoother feel
    navigate("/login");
    // If you need a hard refresh to clear other states:
    // window.location.reload();
  };

  return (
    <motion.div variants={variants} initial="hidden" animate="visible">
      <motion.nav
        variants={childVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border-b border-gray-200 w-full px-6 py-4"
      >
        <motion.div
          variants={childVariants}
          className="max-w-7xl mx-auto flex items-center justify-between"
        >
          <motion.a
            variants={childVariants}
            href="/"
            className="flex items-center space-x-3 group"
          >
            <motion.img
              variants={childVariants}
              src={image}
              alt="Company Logo"
              className="h-9 w-auto object-contain block"
            />
            <motion.span
              variants={childVariants}
              className="text-xl font-bold text-slate-900 tracking-tight"
            >
              FileHub
            </motion.span>
          </motion.a>

          <motion.div
            variants={variants}
            className="hidden md:flex items-center space-x-8"
          >
            {/* 3. Use authState instead of global constants */}
            {authState.isAuthenticated && authState.isAdmin && (
              <>
                <motion.button
                  variants={childVariants}
                  onClick={getDashboard}
                  className="bg-blue-500 px-6 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-600 cursor-pointer"
                >
                  Dashboard
                </motion.button>
                <motion.button
                  variants={childVariants}
                  onClick={handleCreateUser}
                  className="bg-blue-500 px-6 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-600 cursor-pointer"
                >
                  Create User
                </motion.button>
                <motion.button
                  variants={childVariants}
                  onClick={logout}
                  className="bg-blue-500 px-6 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-600 cursor-pointer"
                >
                  Log out
                </motion.button>
              </>
            )}

            {authState.isAuthenticated && !authState.isAdmin && (
              <>
                <motion.button
                  variants={childVariants}
                  onClick={handleArchive}
                  className="bg-blue-500 px-6 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-600 cursor-pointer"
                >
                  Archive
                </motion.button>
                <motion.button
                  variants={childVariants}
                  onClick={logout}
                  className="bg-blue-500 px-6 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-600 cursor-pointer"
                >
                  Log out
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.nav>
    </motion.div>
  );
};

export default Navbar;

import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";

const variant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { stagger: 0.9, duration: 0.8 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const token = localStorage.getItem("token");

const CreateUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/new-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        setTimeout(() => {
          setError(null);
          navigate("/admin/dashboard");
        }, 3000);
      } else {
        setSuccess("User created successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
        });
        setTimeout(() => {
          setSuccess(null);
          navigate("/admin/dashboard");
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <motion.div
        variants={variant}
        initial="hidden"
        animate="visible"
        className="bg-slate-50 flex items-center justify-center min-h-screen"
      >
        <motion.div
          variants={variant}
          initial="hidden"
          animate="visible"
          className="bg-white p-10 border border-slate-200 rounded-xl shadow-sm w-full max-w-md"
        >
          <motion.header
            variants={childVariants}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <motion.h1
              variants={childVariants}
              initial="hidden"
              animate="visible"
              className="text-2xl font-bold text-slate-900 tracking-tight"
            >
              Create User
            </motion.h1>
            <motion.p
              variants={childVariants}
              initial="hidden"
              animate="visible"
              className="text-sm text-slate-500 mt-1"
            >
              Enter user credentials to access your dashboard.
            </motion.p>
          </motion.header>
          {error && (
            <motion.p
              className="bg-red-400 px-20 py-3 mb-2 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              className="bg-green-400 px-20 py-3 mb-2 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {success}
            </motion.p>
          )}
          <motion.form
            variants={variant}
            onSubmit={handleSubmit}
            initial="hidden"
            animate="visible"
            action="#"
            method="POST"
            className="space-y-5"
          >
            <motion.div
              variants={childVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.label
                variants={childVariants}
                initial="hidden"
                animate="visible"
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2"
              >
                Full Name
              </motion.label>
              <motion.input
                variants={childVariants}
                onChange={handleChange}
                initial="hidden"
                animate="visible"
                type="text"
                id="name"
                name="name"
                required
                className="block w-full mb-2 px-4 py-3 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none text-slate-900 placeholder-slate-400"
                placeholder="John Doe"
              />
              <motion.label
                variants={childVariants}
                initial="hidden"
                animate="visible"
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2"
              >
                Email Address
              </motion.label>
              <motion.input
                variants={childVariants}
                onChange={handleChange}
                initial="hidden"
                animate="visible"
                type="text"
                id="email"
                name="email"
                required
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none text-slate-900 placeholder-slate-400"
                placeholder="name@company.com"
              />
            </motion.div>

            <motion.div
              variants={childVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="flex justify-between mb-2">
                <motion.label
                  variants={childVariants}
                  initial="hidden"
                  animate="visible"
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Password
                </motion.label>
              </motion.div>
              <motion.input
                variants={childVariants}
                initial="hidden"
                animate="visible"
                onChange={handleChange}
                type="password"
                name="password"
                required
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none text-slate-900 placeholder-slate-400"
                placeholder="••••••••"
              />
            </motion.div>

            <motion.div
              className="pt-2"
              variants={childVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.button
                    disabled={isLoading}
                    variants={childVariants}
                    whileTap={{
                      scale: 0.95,
                      transition: {
                        duration: 0.1,
                        type: "spring",
                        stiffness: 500,
                      },
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: {
                        duration: 0.2,
                        type: "spring",
                        stiffness: 500,
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    type="submit"
                    className="disabled:opacity-50 w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-md hover:bg-black active:bg-slate-800 flex items-center gap-2"
                  >
                    <Loader2 className="animate-spin" size={20} />
                    Creating User...
                  </motion.button>
                ) : (
                  <motion.button
                    disabled={isLoading}
                    variants={childVariants}
                    whileTap={{
                      scale: 0.95,
                      transition: {
                        duration: 0.1,
                        type: "spring",
                        stiffness: 500,
                      },
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: {
                        duration: 0.2,
                        type: "spring",
                        stiffness: 500,
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    type="submit"
                    className="disabled:opacity-50 w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-md hover:bg-black active:bg-slate-800"
                  >
                    Create User
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateUser;

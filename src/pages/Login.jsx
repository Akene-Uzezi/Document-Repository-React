import { motion } from "motion/react";
const variant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { stagger: 0.9, duration: 0.8 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};
const Login = () => {
  return (
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
            Account Login
          </motion.h1>
          <motion.p
            variants={childVariants}
            initial="hidden"
            animate="visible"
            className="text-sm text-slate-500 mt-1"
          >
            Enter your credentials to access your dashboard.
          </motion.p>
        </motion.header>

        <motion.form
          variants={variant}
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
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2"
            >
              Email Address
            </motion.label>
            <motion.input
              variants={childVariants}
              initial="hidden"
              animate="visible"
              type="email"
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
              type="password"
              id="password"
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
            <motion.button
              variants={childVariants}
              initial="hidden"
              animate="visible"
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-md hover:bg-black active:bg-slate-800"
            >
              Sign In
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default Login;

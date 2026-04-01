import image from "/img/rhv logo.png";
import { motion } from "motion/react";
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
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto flex items-center justify-between"
        >
          <motion.a
            variants={childVariants}
            href="/"
            className="flex items-center space-x-3 group"
          >
            <motion.img
              variants={childVariants}
              initial="hidden"
              animate="visible"
              src={image}
              alt="Company Logo"
              className="h-9 w-auto object-contain block"
            />

            <motion.span
              variants={childVariants}
              initial="hidden"
              animate="visible"
              className="text-xl font-bold text-slate-900 tracking-tight"
            >
              Document Repository
            </motion.span>
          </motion.a>

          {/* <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-semibold text-blue-600">
              Home
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              Features
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2">
              Log in
            </button>
            <button className="text-sm font-bold text-white bg-blue-600 px-5 py-2 rounded-md hover:bg-blue-700 active:bg-blue-800">
              Get Started
            </button>
          </div>

          <div className="md:hidden">
            <button className="text-slate-600 p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div> */}
        </motion.div>
      </motion.nav>
    </motion.div>
  );
};

export default Navbar;

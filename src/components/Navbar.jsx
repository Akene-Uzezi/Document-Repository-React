import image from "../../public/img/rhv logo.png";
import "../App.css";
const Navbar = () => {
  return (
    <div>
      <nav className="bg-white border-b border-gray-200 w-full px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3 group">
            <img
              src={image}
              alt="Company Logo"
              className="h-9 w-auto object-contain block"
            />

            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Document Repository
            </span>
          </a>

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
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

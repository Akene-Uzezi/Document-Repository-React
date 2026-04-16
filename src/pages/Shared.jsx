import { Search, FileText, User, MoreVertical, LayoutGrid } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const Shared = () => {
  const fetchFiles = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/shared/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      response.ok && console.table(data.files);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchFiles();
  }, []);
  const filters = ["all", "pdf", "word", "excel", "image"];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Shared with me</h1>
          <p className="text-sm text-slate-500">
            Files others have shared with you
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search shared files..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all border 
              ${
                filter === "all"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 cursor-pointer"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Placeholder Card (Repeat this for your map) */}
        {[1, 2, 3, 4].map((item) => (
          <motion.div
            key={item}
            whileHover={{ y: -4 }}
            className="bg-white group p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <FileText size={24} />
              </div>
              <button className="text-slate-300 hover:text-slate-600 cursor-pointer">
                <MoreVertical size={18} />
              </button>
            </div>

            <h3 className="font-semibold text-slate-800 text-sm truncate mb-1">
              filename
            </h3>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-4">
              <span className="bg-slate-100 px-2 py-0.5 rounded">
                filetype e.g pdf
              </span>
              <span>•</span>
              <span>filesize</span>
            </div>

            {/* Shared By Info */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <User size={12} />
              </div>
              <span className="text-xs text-slate-500 truncate">
                Shared by{" "}
                <span className="font-medium text-slate-700">file owner</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State (Hidden by default, used when results === 0) */}
      <div className="hidden text-center py-20">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <LayoutGrid className="text-slate-300" size={32} />
        </div>
        <h3 className="text-slate-800 font-semibold">No shared files found</h3>
        <p className="text-slate-500 text-sm">
          You haven't received any files yet.
        </p>
      </div>
    </div>
  );
};

export default Shared;

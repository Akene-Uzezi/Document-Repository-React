import {
  Search,
  FileText,
  User,
  MoreVertical,
  LayoutGrid,
  Eye,
  Download,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState, useRef } from "react";

const Shared = () => {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState(null); // Tracks the ID/Name of the open menu
  const menuRef = useRef(null);
  const token = localStorage.getItem("token");
  const fetchFiles = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/shared/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 401) {
        // 1. Clear local storage so the app knows we are logged out
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // 2. Send the user to login
        window.location.href = "/login";
        return;
      }
      const data = await response.json();
      response.ok && setFiles(data.files);
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    fetchFiles();
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch = file.name
        .toLowerCase()
        .includes((search || "").toLowerCase());
      return matchesSearch;
    });
  }, [search, files]);
  const handleView = async (fileid) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/view/${fileid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 401) {
        // 1. Clear local storage so the app knows we are logged out
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // 2. Send the user to login
        window.location.href = "/login";
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch file");
      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 10000);
      setActiveMenu(null);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDownload = async (e, fileid, fileName) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/download/${fileid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 401) {
        // 1. Clear local storage so the app knows we are logged out
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // 2. Send the user to login
        window.location.href = "/login";
        return;
      }
      if (!response.ok) throw new Error("Failed to download");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "downloadedFile");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setActiveMenu(null);
    } catch (err) {
      console.log(err);
    }
  };
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
            onChange={handleChange}
            placeholder="Search shared files..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Files Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <motion.div
              key={file.name}
              whileHover={{ y: -4 }}
              className="bg-white group p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === file ? null : file)
                  }
                  className="text-slate-300 hover:text-slate-600 cursor-pointer"
                >
                  <MoreVertical size={18} />
                </button>
                <AnimatePresence>
                  {activeMenu === file && (
                    <motion.div
                      ref={menuRef}
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => handleView(file._id)}
                        className="cursor-pointer w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={(e) => handleDownload(e, file._id, file.name)}
                        className="cursor-pointer w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 border-t border-slate-50 transition-colors"
                      >
                        <Download size={14} /> Download
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <h3 className="font-semibold text-slate-800 text-sm truncate mb-1">
                {file.name}
              </h3>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-4">
                <span className="bg-slate-100 px-2 py-0.5 rounded">
                  {file.type.split("/")[1]}
                </span>
                <span>•</span>
                <span>{file.sizeMB} MB</span>
              </div>

              {/* Shared By Info */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User size={12} />
                </div>
                <span className="text-xs text-slate-500 truncate">
                  Shared by{" "}
                  <span className="font-medium text-slate-700">
                    {file.owner}
                  </span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
      {/* Empty State (Hidden by default, used when results === 0) */}
      {filteredFiles.length === 0 && (
        <>
          <div className=" text-center py-20">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="text-slate-300" size={32} />
            </div>
            <h3 className="text-slate-800 font-semibold">
              No shared files found
            </h3>
            <p className="text-slate-500 text-sm">
              You haven't received any files yet.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Shared;

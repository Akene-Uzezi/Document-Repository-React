import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Loader2,
  Search,
  Share2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const Archive = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [groupedFiles, setGroupedFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(""); // Default to empty string
  const token = localStorage.getItem("token");
  const [filter, setFilter] = useState("All");
  const handleSearch = async () => {
    if (userSearch === "") return console.log("search");
    setIsSearching(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${userSearch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        const user = data.user;
        setFoundUser(user);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsSearching(false);
    }
  };
  const handleClick = (e, type) => {
    e.stopPropagation();
    setFilter((prevFilter) => (prevFilter === type ? "All" : type));
    console.log(filter);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/archive`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to get grouped files");
      const data = await response.json();
      setGroupedFiles(data.files || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);
  const EXTENSION_MAP = {
    PDF: ["pdf"],
    Word: ["doc", "docx"],
    Excel: ["xls", "xlsx", "csv"],
    Image: ["jpg", "jpeg", "png", "gif", "svg", "webp"],
  };
  // DERIVED STATE: Filter the nested object structure
  // We use useMemo so this only recalculates when 'search' or 'groupedFiles' changes
  const filteredGroupedFiles = useMemo(() => {
    return Object.entries(groupedFiles).reduce((acc, [month, days]) => {
      const filteredDays = Object.entries(days).reduce(
        (dayAcc, [day, files]) => {
          const matchingFiles = files.filter((file) => {
            // 1. Search Check
            const matchesSearch = file.name
              .toLowerCase()
              .includes((search || "").toLowerCase());

            // 2. Extension Check
            const fileExtension = file.name.split(".").pop().toLowerCase();

            const matchesFilter =
              filter === "All" ||
              (EXTENSION_MAP[filter] &&
                EXTENSION_MAP[filter].includes(fileExtension));

            return matchesSearch && matchesFilter;
          });

          if (matchingFiles.length > 0) {
            dayAcc[day] = matchingFiles;
          }
          return dayAcc;
        },
        {},
      );

      if (Object.keys(filteredDays).length > 0) {
        acc[month] = filteredDays;
      }
      return acc;
    }, {});
  }, [search, filter, groupedFiles]); // Add 'filter' here!

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
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 10000);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, fileid) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/delete/${fileid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to delete file");

      // Refresh list after deletion
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };
  const handleShareWithUser = async (userID) => {
    const data = {
      userID,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/share/${selectedFile._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );
      const resdata = await response.json();
      response.ok ? console.log(resdata.message) : console.log(resdata.message);
      setIsShareModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 space-y-8 pb-20">
      {/* Search + Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={handleChange}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-sm">
          {["All", "PDF", "Word", "Excel", "Image"].map((type) => (
            <button
              key={type}
              onClick={(e) => handleClick(e, type)}
              className="px-3 py-1.5 rounded-md font-medium transition-colors text-gray-500 hover:text-gray-700 hover:bg-white/50 cursor-pointer"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">File Archive</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and access your stored documents
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Fetching files...</span>
        </div>
      ) : Object.keys(filteredGroupedFiles).length > 0 ? (
        <div className="space-y-10">
          {Object.entries(filteredGroupedFiles).map(([month, days]) => (
            <section key={month} className="space-y-6">
              <h2 className="text-lg font-bold text-blue-600 bg-blue-50/50 px-4 py-2 rounded-md border border-blue-100">
                {month}
              </h2>

              {Object.entries(days).map(([day, files]) => (
                <div key={day} className="ml-2 md:ml-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                    {day}
                  </h3>

                  <div className="grid gap-2">
                    <AnimatePresence>
                      {files.map((file) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={file._id}
                          className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:shadow-md hover:border-blue-200 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-md group-hover:bg-blue-50 transition-colors">
                              <FileText
                                size={18}
                                className="text-gray-400 group-hover:text-blue-500"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px] md:max-w-md">
                              {file.name}
                            </span>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => handleView(file._id)}
                              title="View"
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={(e) =>
                                handleDownload(e, file._id, file.name)
                              }
                              title="Download"
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              id="share"
                              onClick={() => {
                                setSelectedFile(file);
                                setIsShareModalOpen(true);
                              }}
                              title="Share"
                              className="cursor-pointer flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                            >
                              <Share2 size={15} /> Share
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, file._id)}
                              title="Delete"
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-gray-400">No files found matching your search.</p>
        </div>
      )}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">
                  Share File
                </h2>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-4 italic">
                  Sharing:{" "}
                  <span className="font-bold text-gray-700">
                    {selectedFile?.name}
                  </span>
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Search User by Email
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="user@example.com"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                      <button
                        onClick={handleSearch}
                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Placeholder for Search Results */}
                  <div className="min-h-[100px] border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center">
                    {isSearching ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2
                          className="animate-spin text-blue-500"
                          size={20}
                        />
                        <p className="text-xs text-slate-400">
                          Searching for user...
                        </p>
                      </div>
                    ) : foundUser ? (
                      /* Found User Row */
                      <div className="w-full flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700">
                            {foundUser.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {foundUser.email}
                          </span>
                        </div>
                        <button
                          onClick={() => handleShareWithUser(foundUser._id)}
                          className="cursor-pointer flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 transition-colors"
                        >
                          <Share2 size={14} /> Send
                        </button>
                      </div>
                    ) : (
                      /* Empty State */
                      <p className="text-xs text-slate-400">
                        Search results will appear here
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Archive;

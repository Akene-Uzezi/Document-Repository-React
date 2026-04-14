import {
  FileText,
  Download,
  Trash2,
  Loader2,
  Eye,
  Share2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import image from "/img/no files.png";
import useFetchRecents from "./FetchRecents";
const RecentFiles = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const token = localStorage.getItem("token");
  const { recents, loading, fetchResents } = useFetchRecents(token);
  useEffect(() => {
    fetchResents();
  }, []);
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
      if (!response.ok) throw new Error("Failed to download");
      console.log("Downloading ...");
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
      console.log(err);
    }
  };
  const handleDelete = async (e, fileid) => {
    e.stopPropagation();
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
      const data = await response.json();
      console.log(data);
      fetchResents();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="mt-10 max-w-5xl mx-auto px-6">
        <h1 className="font-bold text-center text-lg mb-6">Recent Files</h1>

        {loading ? (
          <div className="flex justify-center py-10">
            <AnimatePresence mode="wait">
              <Loader2 className="animate-spin text-blue-500" size={24} />
            </AnimatePresence>
          </div>
        ) : (
          <>
            {recents.length !== 0 && (
              <div className="grid grid-cols-3 gap-4">
                {recents.map((file) => (
                  <div
                    key={file._id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    {/* Top: icon + name */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <FileText size={20} />
                      </div>
                      <p className="font-medium text-gray-800 text-sm leading-snug break-all line-clamp-2">
                        {file.name}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col gap-1 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>📅</span>
                        <span>
                          {new Date(file.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>💾</span>
                        <span>{file.sizeMB} MB</span>
                      </div>
                      <div className="mt-1">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 border border-green-100">
                          {file.type.split("/")[1].toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                      <button
                        onClick={() => handleView(file._id.toString())}
                        title="View"
                        className="cursor-pointer flex items-center gap-1 text-xs text-green-500 hover:text-green-700 hover:bg-green-50 px-2 py-1 rounded-md transition-colors"
                      >
                        <Eye size={15} /> View
                      </button>
                      <button
                        id="down"
                        onClick={(e) =>
                          handleDownload(e, file._id.toString(), file.name)
                        }
                        title="Download"
                        className="cursor-pointer flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                      >
                        <Download size={15} /> Download
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
                        onClick={(e) => handleDelete(e, file._id.toString())}
                        title="Delete"
                        className="cursor-pointer flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors ml-auto"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {recents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <img
                  src={image}
                  alt="No files"
                  className="w-32 h-auto opacity-75 mb-6 object-cover"
                />
                <h2 className="text-xl font-bold text-gray-800">
                  Quiet in here...
                </h2>
                <p className="text-gray-500 mt-2 text-sm">
                  We couldn't find any recent uploads for your account.
                </p>
              </div>
            )}
          </>
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
                        />
                        <button
                          onClick={() => {
                            /* Add your search function here */
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
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
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 transition-colors"
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
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default RecentFiles;

import { useState, useEffect } from "react";
import { FileText, Download, Trash2, Eye, Loader2, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
const Archive = () => {
  const [groupedFiles, setGroupedFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
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
      setGroupedFiles(data.files);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFiles();
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
      {/* Search + Filter Bar */}
      <div className="max-w-4xl mx-auto mt-10 space-y-8">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search files..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-sm">
            {["All", "PDF", "Word", "Excel", "Image"].map((type) => (
              <button
                key={type}
                className="px-3 py-1.5 rounded-md font-medium transition-colors text-gray-500 hover:text-gray-700"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <h1 className="text-2xl font-bold border-b pb-4">File Archive</h1>
        {loading ? (
          <>
            <AnimatePresence mode="wait">
              <p className="items-center align-center flex gap-2">
                <Loader2 className="animate-spin" size={20} />
                Fetching files...
              </p>
            </AnimatePresence>
          </>
        ) : (
          <>
            {Object.entries(groupedFiles).map(([month, days]) => (
              <section key={month} className="space-y-4">
                <h2 className="text-lg font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-md">
                  {month}
                </h2>

                {/* Loop through Days within that Month (e.g., "October 24") */}
                {Object.entries(days).map(([day, files]) => (
                  <div key={day} className="ml-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {day}
                    </h3>

                    {/* The actual list of files for that day */}
                    <div className="grid gap-2">
                      {files.map((file) => (
                        <div
                          key={file._id}
                          className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <FileText size={18} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                              {file.name}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleView(file._id)}
                              className="p-1 text-gray-400 hover:text-green-500 cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={(e) =>
                                handleDownload(e, file._id, file.name)
                              }
                              className="p-1 text-gray-400 hover:text-blue-500 cursor-pointer"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={(e) =>
                                handleDelete(e, file._id.toString())
                              }
                              className="text-gray-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </>
        )}
        {/* Loop through Months (e.g., "October 2023") */}
      </div>
    </>
  );
};

export default Archive;

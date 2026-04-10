import { FileText, Download, Trash2, Loader2, Eye } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import image from "/img/no files.png";
const RecentFiles = () => {
  const [loading, setLoading] = useState(false);
  const [recents, setRecents] = useState([]);
  const token = localStorage.getItem("token");

  const fetchResents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/files`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRecents(data.files);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
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
      </div>
    </>
  );
};

export default RecentFiles;

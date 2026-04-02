import {
  FileText,
  Download,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import image from "/img/no files.png";
import { tbody } from "motion/react-client";
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
  console.log(recents);
  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-10">
        <h1 className="font-bold text-center">Recent Files</h1>
        <table className="max-4-4xl mx-auto divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">
                File Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">
                Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">
                Size
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">
                Type
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          {loading ? (
            <>
              <AnimatePresence mode="wait">
                <tbody>
                  <tr>
                    <td className="item-center text-center align-center">
                      <Loader2 className="animate-spin" size={20} />
                    </td>
                  </tr>
                </tbody>
              </AnimatePresence>
            </>
          ) : (
            <>
              {recents.length !== 0 && (
                <tbody className="divide-y divide-gray-100">
                  {recents.map((file) => (
                    <tr
                      key={file._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-700 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <FileText size={18} />
                        </div>
                        {file.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-gray-500">
                        {Date(file.date)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-gray-500">
                        {file.sizeMB}MB
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          {file.type.split("/")[1]}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        <button className="text-green-400 hover:text-green-600 mr-3 cursor-pointer">
                          <ExternalLink size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-blue-600 mr-3 cursor-pointer">
                          <Download size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 cursor-pointer">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
              {recents.length === 0 && (
                <tbody>
                  <tr>
                    <td>
                      <img
                        src={image}
                        alt="No files"
                        className="mx-auto w-32 h-auto opacity-75 mb-6 object-cover"
                      />
                    </td>
                    <td>
                      <h2 className="text-xl font-bold text-gray-800">
                        Quiet in here...
                      </h2>
                    </td>
                    <td>
                      <p className="text-gray-500 mt-2">
                        We couldn't find any recent uploads for your account.
                      </p>
                    </td>
                  </tr>
                </tbody>
              )}
            </>
          )}
        </table>
      </div>
    </>
  );
};

export default RecentFiles;

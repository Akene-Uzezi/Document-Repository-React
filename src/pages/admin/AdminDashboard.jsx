import { useState, useEffect } from "react";
import { Loader2, Pencil, Trash2, X, Ban, RotateCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  const handleSuspend = async (user) => {
    const token = localStorage.getItem("token");
    if (user.isSuspended) {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/restore/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } else {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/suspend/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    }
  };
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  return (
    <div>
      {loading && (
        <AnimatePresence mode="wait">
          <Loader2 className="animate-spin text-center" size={48} />
        </AnimatePresence>
      )}
      {!loading && (
        <div className="mt-4 max-w-md mx-auto border border-slate-200 rounded-xl shadow-sm overflow-hidden bg-white">
          {/* 1. THE HEADER */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              User
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Actions
            </span>
          </div>

          {/* 2. THE LOOP */}
          <div className="divide-y divide-slate-50">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors group"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-medium text-slate-900 truncate">
                      {user.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Actions (Pencil & Trash2) */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      handleOpenModal(user);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  {!user.isAdmin && (
                    <>
                      {user.isSuspended ? (
                        <motion.button
                          whileTap={{ rotate: 360 }}
                          onClick={() => {
                            handleSuspend(user);
                          }}
                          className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <RotateCw size={14} />
                        </motion.button>
                      ) : (
                        <button
                          onClick={() => {
                            handleSuspend(user);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Ban size={14} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {isModalOpen && (
            <>
              <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                  >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                      <h2 className="text-lg font-semibold text-slate-800">
                        Edit User
                      </h2>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Modal Body / Form */}
                    <form className="p-4 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedUser?.name}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={selectedUser?.email}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                          }}
                          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </AnimatePresence>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

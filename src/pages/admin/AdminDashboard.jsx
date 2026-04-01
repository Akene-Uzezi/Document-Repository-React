import { useState, useEffect } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
  return (
    <div>
      {loading && (
        <AnimatePresence mode="wait">
          <Loader2 className="animate-spin" size={48} />
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
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

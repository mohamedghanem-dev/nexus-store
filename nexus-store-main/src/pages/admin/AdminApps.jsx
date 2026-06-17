import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useAdmin from "../../hooks/useAdmin";
import { CATEGORIES, getCategoryInfo } from "../../services/appsService";
import Button from "../../components/Button";

const StarMini = ({ rating }) => (
  <span className="flex items-center gap-0.5 text-amber-400 text-xs">
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
    {rating.toFixed(1)}
  </span>
);

const AdminApps = () => {
  const { apps, loading, handleDelete } = useAdmin();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() =>
    apps.filter(a => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
      const matchCat    = category === "all" || a.category === category;
      return matchSearch && matchCat;
    }),
    [apps, search, category]
  );

  const onDelete = async (app) => {
    setConfirmDelete(null);
    await handleDelete(app.id);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-heading">التطبيقات والبرامج</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{apps.length} عنصر إجمالاً</p>
        </div>
        <Button onClick={() => navigate("/admin/apps/new")} className="shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          إضافة تطبيق
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم..."
            className="w-full h-10 pr-9 pl-4 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/30"/>
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="h-10 px-3.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500/30">
          <option value="all">كل الأقسام</option>
          {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        {loading && <div className="text-center py-12 text-slate-400">جاري التحميل...</div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            لا يوجد نتائج.{" "}
            <Link to="/admin/apps/new" className="text-brand-600 hover:underline">أضف تطبيق</Link>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-700">
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">التطبيق</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">القسم</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">التقييم</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">السعر</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                <AnimatePresence>
                  {filtered.map((app, i) => (
                    <motion.tr key={app.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden shrink-0">
                            <img src={app.icon || "./icons/icon-96x96.png"} alt={app.title} className="w-full h-full object-cover"/>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-white line-clamp-1">{app.title}</p>
                            {app.downloads && <p className="text-xs text-slate-400">{app.downloads} تنزيل</p>}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">
                          {getCategoryInfo(app.category).name}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        {app.rating > 0 ? <StarMini rating={app.rating}/> : <span className="text-slate-300">—</span>}
                      </td>

                      <td className="px-5 py-3.5 font-semibold">
                        {app.isFree
                          ? <span className="text-green-600 dark:text-green-400">مجاني</span>
                          : <span className="text-brand-600 dark:text-brand-400">{app.price}$</span>}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/admin/apps/${app.id}/edit`)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 transition-colors">
                            تعديل
                          </button>
                          <button onClick={() => setConfirmDelete(app)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors">
                            حذف
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-modal"
              onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white text-center mb-2">حذف التطبيق؟</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                هل أنت متأكد من حذف "<strong>{confirmDelete.title}</strong>"؟ لا يمكن التراجع.
              </p>
              <div className="flex gap-3">
                <button onClick={() => onDelete(confirmDelete)}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors">
                  نعم، احذف
                </button>
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm transition-colors">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AdminApps;

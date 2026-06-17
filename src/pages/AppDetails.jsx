import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAppById, getCategoryInfo } from "../services/appsService";
import Loader from "../components/Loader";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "201095097334";
const PLACEHOLDER = "./icons/icon-192x192.png";

const getYouTubeEmbed = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map((i) => (
      <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-1">{rating > 0 ? rating.toFixed(1) : "—"}</span>
  </div>
);

const AppDetails = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(false);
    fetchAppById(id)
      .then((d) => { if (active) setApp(d); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <Loader fullPage />;

  if (error || !app) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">التطبيق غير موجود</h1>
      <Link to="/products" className="text-brand-600 hover:underline">تصفح كل التطبيقات</Link>
    </div>
  );

  const cat = getCategoryInfo(app.category);
  const embedUrl = getYouTubeEmbed(app.demoVideoUrl);
  const screenshots = app.screenshots || [];
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحبًا، أريد شراء "${app.title}" من Nexus Arab Store 🛒`)}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4 py-6">

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-brand-500">الرئيسية</Link>
        <span>/</span>
        <Link to={`/products?category=${app.category}`} className="hover:text-brand-500">{cat.name}</Link>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300 line-clamp-1">{app.title}</span>
      </nav>

      {/* ── Header row: icon + info + action ── */}
      <div className="flex items-start gap-4 mb-5">
        {/* Icon */}
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-card">
          <img src={app.icon || PLACEHOLDER} alt={app.title} onError={(e) => { e.target.src = PLACEHOLDER; }} className="w-full h-full object-cover" />
        </div>

        {/* Middle: title + category + rating */}
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-lg font-extrabold text-slate-900 dark:text-white leading-tight mb-1">
            {app.title}
          </h1>
          <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mb-2">{cat.name}</p>
          {app.rating > 0 && <StarRating rating={app.rating} />}
        </div>

        {/* Action button — right side, compact */}
        <div className="shrink-0 pt-1">
          {app.isFree ? (
            <a href={app.downloadLinks?.[0] || "#"} target="_blank" rel="noopener noreferrer">
              <button className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-full shadow-brand transition-all active:scale-95">
                تثبيت
              </button>
            </a>
          ) : (
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <button className="px-4 py-2 bg-[#25D366] hover:bg-[#1ebe5c] text-white text-sm font-bold rounded-full shadow-lg transition-all active:scale-95">
                شراء
              </button>
            </a>
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      {(app.rating > 0 || app.downloads || app.appSize || !app.isFree) && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
          {app.rating > 0 && (
            <div className="shrink-0 flex flex-col items-center px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 min-w-[80px]">
              <span className="text-base font-bold text-slate-800 dark:text-white">{app.rating.toFixed(1)}</span>
              <div className="flex gap-0.5 my-0.5">
                {[1,2,3,4,5].map(i => <svg key={i} className={`w-2.5 h-2.5 ${i<=Math.round(app.rating)?"text-amber-400":"text-slate-300"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
              </div>
              <span className="text-[10px] text-slate-400">التقييم</span>
            </div>
          )}
          {app.downloads && (
            <div className="shrink-0 flex flex-col items-center px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 min-w-[80px]">
              <span className="text-base font-bold text-slate-800 dark:text-white">{app.downloads}</span>
              <span className="text-[10px] text-slate-400 mt-1">تنزيل</span>
            </div>
          )}
          {app.appSize && (
            <div className="shrink-0 flex flex-col items-center px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 min-w-[80px]">
              <span className="text-base font-bold text-slate-800 dark:text-white">{app.appSize}</span>
              <span className="text-[10px] text-slate-400 mt-1">الحجم</span>
            </div>
          )}
          {!app.isFree && (
            <div className="shrink-0 flex flex-col items-center px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 min-w-[80px]">
              <span className="text-base font-bold text-brand-600 dark:text-brand-400">{app.price}$</span>
              <span className="text-[10px] text-slate-400 mt-1">السعر</span>
            </div>
          )}
        </div>
      )}

      {/* ── Screenshots horizontal scroll ── */}
      {screenshots.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-3">لمحة عن التطبيق</h2>
          <div className="flex gap-2.5 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4">
            {screenshots.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIdx(i)}
                className="shrink-0 snap-start rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 w-36 h-64 sm:w-44 sm:h-80 hover:scale-105 transition-transform"
              >
                <img src={src} alt={`${i+1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Demo video ── */}
      {embedUrl && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-3">فيديو توضيحي</h2>
          <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
            <iframe src={embedUrl} title="Demo" className="w-full h-full" allowFullScreen loading="lazy" />
          </div>
        </div>
      )}

      {/* ── Description ── */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-3">لمحة عن هذا التطبيق</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{app.description}</p>
      </div>

      {/* ── Multiple download links ── */}
      {app.isFree && app.downloadLinks?.length > 1 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-3">روابط التحميل</h2>
          <div className="flex flex-col gap-2">
            {app.downloadLinks.map((link, i) => (
              <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-2xl hover:bg-brand-100 transition-colors"
              >
                <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">رابط التحميل {i+1}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxIdx(null)}
          >
            <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white" onClick={() => setLightboxIdx(null)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            {lightboxIdx > 0 && (
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white" onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => i - 1); }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
            )}

            <motion.img
              key={lightboxIdx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={screenshots[lightboxIdx]}
              alt="screenshot"
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {lightboxIdx < screenshots.length - 1 && (
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white" onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => i + 1); }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            )}

            <div className="absolute bottom-4 text-white/60 text-sm">{lightboxIdx + 1} / {screenshots.length}</div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AppDetails;

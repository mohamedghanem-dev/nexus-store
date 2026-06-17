import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppCard from "../components/AppCard";
import SkeletonCard from "../components/SkeletonCard";
import useAdmin from "../hooks/useAdmin";
import useDebounce from "../hooks/useDebounce";
import useI18n from "../hooks/useI18n";
import { CATEGORIES } from "../services/appsService";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { apps: allApps, loading } = useAdmin();
  const { t, lang } = useI18n();

  const [searchQuery, setSearchQuery]   = useState(searchParams.get("search") || "");
  const [selectedCat, setSelectedCat]   = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy]             = useState("default");
  const [currentPage, setCurrentPage]   = useState(1);
  const PER_PAGE = 20;

  const debouncedSearch = useDebounce(searchQuery, 350);

  useEffect(() => {
    const p = {};
    if (debouncedSearch) p.search = debouncedSearch;
    if (selectedCat !== "all") p.category = selectedCat;
    setSearchParams(p, { replace: true });
  }, [debouncedSearch, selectedCat, setSearchParams]);

  const filtered = useMemo(() => {
    let r = [...allApps];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      r = r.filter(a => a.title.toLowerCase().includes(q));
    }
    if (selectedCat !== "all") r = r.filter(a => a.category === selectedCat);
    if (sortBy === "free")     r.sort((a,b) => (b.isFree?1:0)-(a.isFree?1:0));
    if (sortBy === "paid")     r.sort((a,b) => (a.isFree?1:0)-(b.isFree?1:0));
    if (sortBy === "rating")   r.sort((a,b) => b.rating - a.rating);
    if (sortBy === "name")     r.sort((a,b) => a.title.localeCompare(b.title));
    return r;
  }, [allApps, debouncedSearch, selectedCat, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, selectedCat, sortBy]);
  const paginated = filtered.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

      {/* Search bar */}
      <div className="relative mb-4">
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
        </svg>
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder={lang === "ar" ? "بحث عن تطبيق أو برنامج..." : "Search apps & software..."}
          className="w-full h-11 pr-9 pl-4 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"/>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1 snap-x">
        <button onClick={() => setSelectedCat("all")}
          className={`shrink-0 snap-start px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCat==="all" ? "bg-brand-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}>
          {lang === "ar" ? "الكل" : "All"}
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat.slug} onClick={() => setSelectedCat(cat.slug)}
            className={`shrink-0 snap-start px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${selectedCat===cat.slug ? "bg-brand-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}>
            {lang === "ar" ? cat.name : cat.nameEn}
          </button>
        ))}
      </div>

      {/* Sort + count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500">{filtered.length} {lang === "ar" ? "عنصر" : "items"}</p>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="h-8 px-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 outline-none">
          <option value="default">{lang==="ar" ? "الأحدث" : "Latest"}</option>
          <option value="rating">{lang==="ar" ? "الأعلى تقييماً" : "Top Rated"}</option>
          <option value="free">{lang==="ar" ? "المجاني أولاً" : "Free First"}</option>
          <option value="paid">{lang==="ar" ? "المدفوع أولاً" : "Paid First"}</option>
          <option value="name">{lang==="ar" ? "أبجدي" : "A-Z"}</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <p>{lang==="ar" ? "لا يوجد نتائج" : "No results found"}</p>
        </div>
      )}

      {/* List */}
      {!loading && filtered.length > 0 && (
        <>
          <div className="card-base overflow-hidden">
            <AnimatePresence>
              {paginated.map((app, i) => (
                <motion.div key={app.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}>
                  <AppCard
                    id={app.id} icon={app.icon} title={app.title}
                    category={app.category} isFree={app.isFree} price={app.price}
                    description={app.description} rating={app.rating}
                    downloads={app.downloads} appSize={app.appSize}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
              <button onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={currentPage===1}
                className="px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                {lang==="ar" ? "السابق" : "Prev"}
              </button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${p===currentPage ? "bg-brand-600 text-white" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages,p+1))} disabled={currentPage===totalPages}
                className="px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                {lang==="ar" ? "التالي" : "Next"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;

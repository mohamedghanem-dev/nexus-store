import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppCard from "../components/AppCard";
import SkeletonCard from "../components/SkeletonCard";
import useAdmin from "../hooks/useAdmin";
import useI18n from "../hooks/useI18n";
import { CATEGORIES } from "../services/appsService";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "201095097334";
const fade = (d=0) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:0.45,delay:d} });

const Home = () => {
  const navigate = useNavigate();
  const { apps, loading } = useAdmin();
  const { t, lang } = useI18n();

  const featured = apps.slice(0, 8);
  const freeApps = apps.filter(a => a.isFree).slice(0, 4);
  const paidApps = apps.filter(a => !a.isFree).slice(0, 4);

  const FEATURES = [
    { icon:"⬇️", title: t("feat1_title"), desc: t("feat1_desc") },
    { icon:"🛡️", title: t("feat2_title"), desc: t("feat2_desc") },
    { icon:"💬", title: t("feat3_title"), desc: t("feat3_desc") },
    { icon:"🔄", title: t("feat4_title"), desc: t("feat4_desc") },
  ];

  const AppSection = ({ apps: list, title, link, accent = "brand" }) => (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-1 h-5 rounded-full bg-${accent}-600`} />
          <h2 className="font-display text-lg font-bold text-slate-800 dark:text-white">{title}</h2>
        </div>
        <Link to={link} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
          {t("see_all")}
        </Link>
      </div>
      <div className="card-base overflow-hidden">
        {list.map(app => (
          <AppCard key={app.id} id={app.id} icon={app.icon} title={app.title}
            category={app.category} isFree={app.isFree} price={app.price}
            description={app.description} rating={app.rating}
            downloads={app.downloads} appSize={app.appSize} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="w-full -mt-6 sm:-mt-8">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-hero-dark min-h-[380px] flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl"/>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-brand-800/20 rounded-full blur-3xl"/>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-14 w-full">
          <motion.div {...fade(0)}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-900/60 text-brand-300 text-xs font-semibold rounded-full mb-4 border border-brand-700/50">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"/>
              {t("hero_badge")}
            </span>
          </motion.div>
          <motion.h1 {...fade(0.1)} className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            {t("hero_title1")}<br/><span className="text-brand-400">{t("hero_title2")}</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-sm sm:text-base text-slate-300 leading-relaxed mb-7 max-w-lg">
            {t("hero_desc")}
          </motion.p>
          <motion.div {...fade(0.3)} className="flex flex-wrap gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-2xl shadow-brand transition-all active:scale-95 text-sm">
              ⬇️ {t("hero_cta")}
            </Link>
            <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t("wa_contact_msg"))}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-all active:scale-95 text-sm">
              💬 {t("hero_contact")}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({icon,title,desc},i) => (
              <motion.div key={title} {...fade(i*0.06)} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-lg shrink-0">{icon}</div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">{title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-brand-600"/>
            <h2 className="font-display text-lg font-bold text-slate-800 dark:text-white">{t("section_categories")}</h2>
          </div>
          <Link to="/categories" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">{t("all_categories")}</Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map(({slug,name,nameEn,icon},i) => (
            <motion.button key={slug} {...fade(i*0.04)} onClick={() => navigate(`/products?category=${slug}`)}
              className="flex flex-col items-center gap-1.5 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 group-hover:border-brand-400 group-hover:shadow-brand-sm transition-all">
                <img src={icon} alt={lang==="ar"?name:nameEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 text-center leading-tight line-clamp-2">
                {lang==="ar" ? name : nameEn}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-brand-600"/>
            <h2 className="font-display text-lg font-bold text-slate-800 dark:text-white">{t("section_featured")}</h2>
          </div>
          <Link to="/products" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">{t("see_all")}</Link>
        </div>
        {loading
          ? <div className="space-y-2">{Array.from({length:4}).map((_,i)=><SkeletonCard key={i}/>)}</div>
          : featured.length > 0
            ? <div className="card-base overflow-hidden">
                {featured.map(app => (
                  <AppCard key={app.id} id={app.id} icon={app.icon} title={app.title}
                    category={app.category} isFree={app.isFree} price={app.price}
                    description={app.description} rating={app.rating}
                    downloads={app.downloads} appSize={app.appSize}/>
                ))}
              </div>
            : <div className="text-center py-10 text-slate-400 text-sm">{lang==="ar" ? "لا يوجد تطبيقات بعد" : "No apps yet"}</div>
        }
      </section>

      {!loading && freeApps.length > 0 && (
        <AppSection apps={freeApps} title={t("section_free")} link="/products" accent="green"/>
      )}
      {!loading && paidApps.length > 0 && (
        <AppSection apps={paidApps} title={t("section_paid")} link="/products?category=systems-crm" accent="amber"/>
      )}

      {/* ── WHATSAPP CTA ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111] to-[#1a0505] border border-brand-900/40 text-white px-6 sm:px-10 py-10">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"/>
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-2">{t("cta_title")}</h2>
              <p className="text-slate-300 text-sm max-w-md">{t("cta_desc")}</p>
            </div>
            <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t("wa_contact_msg"))}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold rounded-2xl transition-all active:scale-95 shrink-0 text-sm shadow-lg">
              💬 {t("cta_btn")}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

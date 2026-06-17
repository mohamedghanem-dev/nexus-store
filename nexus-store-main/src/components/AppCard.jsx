import { useNavigate } from "react-router-dom";
import { getCategoryInfo } from "../services/appsService";

const PLACEHOLDER = "./icons/icon-192x192.png";

const StarRating = ({ rating }) => {
  const r = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <svg key={i} className={`w-3 h-3 ${i <= r ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1">{rating > 0 ? rating.toFixed(1) : ""}</span>
    </div>
  );
};

const AppCard = ({ id, icon, title, category, isFree, price, description, rating = 0, downloads = "", appSize = "" }) => {
  const navigate = useNavigate();
  const cat = getCategoryInfo(category);

  return (
    <div
      onClick={() => navigate(`/apps/${id}`)}
      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
        <img
          src={icon || PLACEHOLDER}
          alt={title}
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cat.name}</p>
        <div className="flex items-center gap-2 mt-1">
          {rating > 0 && <StarRating rating={rating} />}
          {downloads && <span className="text-[11px] text-slate-400">{downloads}</span>}
          {appSize && <span className="text-[11px] text-slate-400">{appSize}</span>}
        </div>
      </div>

      {/* Action button */}
      <div className="shrink-0">
        {isFree ? (
          <span className="inline-flex items-center px-4 py-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-full border border-brand-200 dark:border-brand-800">
            تثبيت
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-full">
            {price}$
          </span>
        )}
      </div>
    </div>
  );
};

export default AppCard;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useAdmin from "../../hooks/useAdmin";
import { CATEGORIES } from "../../services/appsService";
import { getPublicUrl } from "../../services/supabaseClient";
import Input from "../../components/Input";
import Button from "../../components/Button";

const AppForm = ({ mode = "add", app = null }) => {
  const { handleAdd, handleEdit } = useAdmin();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title:        app?.title        || "",
    description:  app?.description  || "",
    category:     app?.category     || CATEGORIES[0].slug,
    isFree:       app?.isFree       ?? true,
    price:        app?.price        || "",
    demoVideoUrl: app?.demoVideoUrl || "",
    rating:       app?.rating       || "",
    downloads:    app?.downloads    || "",
    appSize:      app?.appSize      || "",
    downloadLinks: app?.downloadLinks?.length ? app.downloadLinks : [""],
  });

  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(app?.icon || "");
  const [screenshotFiles, setScreenshotFiles] = useState([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState(app?.screenshots || []);
  const [existingScreenshots, setExistingScreenshots] = useState(app?.screenshots || []);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const handleScreenshotsChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setScreenshotFiles(p => [...p, ...files]);
    setScreenshotPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeScreenshot = (index) => {
    const ec = existingScreenshots.length;
    if (index < ec) {
      setExistingScreenshots(p => p.filter((_, i) => i !== index));
    } else {
      setScreenshotFiles(p => p.filter((_, i) => i !== (index - ec)));
    }
    setScreenshotPreviews(p => p.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index, value) => {
    setForm(p => { const l = [...p.downloadLinks]; l[index] = value; return { ...p, downloadLinks: l }; });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "الاسم مطلوب";
    if (!form.description.trim()) e.description = "الوصف مطلوب";
    if (!form.isFree && (!form.price || isNaN(form.price) || Number(form.price) <= 0)) e.price = "السعر مطلوب";
    if (!form.downloadLinks.some(l => l.trim())) e.downloadLinks = "أضف رابط واحد على الأقل";
    if (form.rating && (isNaN(form.rating) || Number(form.rating) < 0 || Number(form.rating) > 5)) e.rating = "التقييم بين 0 و 5";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const payload = {
        title:         form.title.trim(),
        description:   form.description.trim(),
        category:      form.category,
        isFree:        form.isFree,
        price:         form.isFree ? 0 : Number(form.price),
        demoVideoUrl:  form.demoVideoUrl.trim(),
        rating:        form.rating ? Number(form.rating) : 0,
        downloads:     form.downloads.trim(),
        appSize:       form.appSize.trim(),
        downloadLinks: form.downloadLinks.map(l => l.trim()).filter(Boolean),
        iconFile,
        iconUrl:       app?.icon || "",
        screenshotFiles,
        existingScreenshots,
      };
      if (mode === "add") await handleAdd(payload);
      else await handleEdit(app.id, payload);
      navigate("/admin/apps");
    } catch (err) {
      toast.error("حدث خطأ: " + (err.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-2xl">

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/admin/apps")} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 className="section-heading">{mode === "add" ? "إضافة تطبيق جديد" : "تعديل التطبيق"}</h1>
          <p className="text-slate-500 text-sm">تطبيقات، ألعاب، برامج، أو أنظمة CRM</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card-base p-6 space-y-5">

          {/* Icon */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">أيقونة التطبيق</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                {iconPreview
                  ? <img src={iconPreview} alt="preview" className="w-full h-full object-cover" />
                  : <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                }
              </div>
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">
                اختر صورة
                <input type="file" accept="image/*" onChange={handleIconChange} className="hidden" />
              </label>
            </div>
          </div>

          <Input label="اسم التطبيق / البرنامج *" name="title" placeholder="مثال: PUBG Mobile مهكرة" value={form.title} onChange={handleChange} error={errors.title} required />

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">القسم *</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all">
              {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">الوصف *</label>
            <textarea name="description" rows={5} placeholder="اكتب وصفاً مختصراً عن التطبيق..." value={form.description} onChange={handleChange}
              className={`w-full border ${errors.description ? "border-red-400" : "border-slate-200 dark:border-slate-600"} bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all resize-none`}/>
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Free / Paid */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">نوع التطبيق</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setForm(p => ({ ...p, isFree: true }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${form.isFree ? "bg-green-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                مجاني (تحميل مباشر)
              </button>
              <button type="button" onClick={() => setForm(p => ({ ...p, isFree: false }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${!form.isFree ? "bg-brand-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                مدفوع (شراء عبر واتساب)
              </button>
            </div>
          </div>

          {!form.isFree && <Input label="السعر ($) *" name="price" type="number" placeholder="9.99" value={form.price} onChange={handleChange} error={errors.price} />}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">التقييم (0-5)</label>
              <input type="number" name="rating" min="0" max="5" step="0.1" placeholder="4.5" value={form.rating} onChange={handleChange}
                className={`w-full border ${errors.rating ? "border-red-400" : "border-slate-200 dark:border-slate-600"} bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30`}/>
              {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">التنزيلات</label>
              <input type="text" name="downloads" placeholder="١م+" value={form.downloads} onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30"/>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">الحجم</label>
              <input type="text" name="appSize" placeholder="35 م.ب" value={form.appSize} onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30"/>
            </div>
          </div>

          {/* Download links */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">روابط التحميل *</label>
            <div className="space-y-2">
              {form.downloadLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={link} onChange={(e) => handleLinkChange(i, e.target.value)} placeholder={`رابط ${i+1} (Google Drive, MediaFire...)`}
                    className="flex-1 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30"/>
                  {form.downloadLinks.length > 1 && (
                    <button type="button" onClick={() => setForm(p => ({ ...p, downloadLinks: p.downloadLinks.filter((_, j) => j !== i) }))}
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.downloadLinks && <p className="text-xs text-red-500 mt-1">{errors.downloadLinks}</p>}
            <button type="button" onClick={() => setForm(p => ({ ...p, downloadLinks: [...p.downloadLinks, ""] }))}
              className="mt-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">
              + أضف رابط آخر
            </button>
          </div>

          <Input label="رابط فيديو توضيحي (اختياري)" name="demoVideoUrl" placeholder="https://youtube.com/watch?v=..." value={form.demoVideoUrl} onChange={handleChange} />

          {/* Screenshots */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">صور / لقطات شاشة</label>
            <div className="flex flex-wrap gap-3">
              {screenshotPreviews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
                  <img src={src.startsWith("http") || src.startsWith("blob:") ? src : getPublicUrl(src)} alt={`${i+1}`} className="w-full h-full object-cover"/>
                  <button type="button" onClick={() => removeScreenshot(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
              <label className="cursor-pointer w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                <span className="text-[11px]">إضافة</span>
                <input type="file" accept="image/*" multiple onChange={handleScreenshotsChange} className="hidden"/>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" size="lg" className="flex-1" loading={submitting} disabled={submitting}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            {mode === "add" ? "إضافة التطبيق" : "حفظ التعديلات"}
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => navigate("/admin/apps")}>إلغاء</Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AppForm;

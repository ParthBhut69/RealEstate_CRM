import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

export const FormCard = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-blue-600 px-8 py-8 md:px-12 md:py-10">
      <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
        {Icon && <Icon className="w-8 h-8" />}
        {title}
      </h1>
      {subtitle && <p className="text-blue-100 text-sm md:text-base mt-2 font-medium">{subtitle}</p>}
    </div>
    <div className="p-8 md:p-12">
      {children}
    </div>
  </div>
);

export const FormGroup = ({ label, error, children, required }) => (
  <div className="space-y-2">
    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-in fade-in duration-200">{error}</p>}
  </div>
);

export const Input = React.forwardRef(({ icon: Icon, ...props }, ref) => (
  <div className="relative group">
    {Icon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
    )}
    <input
      ref={ref}
      {...props}
      className={`w-full ${Icon ? 'pl-12' : 'px-5'} pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-300 shadow-sm`}
    />
  </div>
));

export const Select = React.forwardRef(({ options, ...props }, ref) => (
  <select
    ref={ref}
    {...props}
    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-900 font-bold appearance-none cursor-pointer shadow-sm"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
));

export const Textarea = React.forwardRef((props, ref) => (
  <textarea
    ref={ref}
    {...props}
    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-300 shadow-sm min-h-[120px] resize-none"
  />
));

export const CheckboxGroup = React.forwardRef(({ options, value, onChange, ...props }, ref) => {
  const [selected, setSelected] = useState(value ? (typeof value === 'string' ? value.split(',').map(s=>s.trim()) : value) : []);

  useEffect(() => {
    if (value) {
      setSelected(typeof value === 'string' ? value.split(',').map(s=>s.trim()) : value);
    }
  }, [value]);

  const handleToggle = (optValue) => {
    let newSelected;
    if (selected.includes(optValue)) {
      newSelected = selected.filter(v => v !== optValue);
    } else {
      newSelected = [...selected, optValue];
    }
    setSelected(newSelected);
    if (onChange) onChange(newSelected.join(', '));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-100 cursor-pointer hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => handleToggle(opt.value)}
            className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20 transition-all"
          />
          <span className="text-sm font-bold text-slate-700">{opt.label}</span>
        </label>
      ))}
      {/* Hidden input for react-hook-form to register the value if needed */}
      <input type="hidden" ref={ref} value={selected.join(', ')} {...props} />
    </div>
  );
});

export const FileInput = React.forwardRef(({ onChange, value, ...props }, ref) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (value && value.length > 0) {
      const urls = Array.from(value).map(file => URL.createObjectURL(file));
      setPreviews(urls);
      return () => urls.forEach(URL.revokeObjectURL);
    } else {
      setPreviews([]);
    }
  }, [value]);

  return (
    <div className="space-y-4">
      <div className="relative group">
        <input
          type="file"
          ref={ref}
          onChange={onChange}
          {...props}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer group/label"
        >
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover/label:scale-110 transition-transform">
            <PlusCircle className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm font-black text-slate-600">Click to upload photos</span>
          <span className="text-xs text-slate-400 font-medium mt-1">PNG, JPG or WEBP (Max 5MB)</span>
        </label>
      </div>
      
      {previews.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {previews.map((url, i) => (
            <div key={i} className="relative w-24 h-24 flex-shrink-0 group/preview rounded-xl overflow-hidden border border-slate-200">
              <img src={url} alt="preview" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export const Button = ({ children, loading, variant = 'primary', icon: Icon, ...props }) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200',
    secondary: 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-100',
    outline: 'bg-transparent border-2 border-slate-100 text-slate-600 hover:border-blue-500 hover:text-blue-600',
  };

  return (
    <button
      {...props}
      disabled={loading}
      className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 ${variants[variant]}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
};

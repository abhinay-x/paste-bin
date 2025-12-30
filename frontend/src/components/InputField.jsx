export default function InputField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  inputMode = "text",
  type = "text",
  error
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-end justify-between">
        <label className="text-sm font-medium text-slate-200">{label}</label>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      <input
        className={
          "w-full rounded-lg border bg-slate-900 px-3 py-2 text-sm outline-none transition " +
          (error
            ? "border-rose-500/70 focus:border-rose-500"
            : "border-slate-800 focus:border-slate-600")
        }
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        type={type}
      />
      {error ? <div className="text-xs text-rose-400">{error}</div> : null}
    </div>
  );
}

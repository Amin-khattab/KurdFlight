"use client";

type AuthFormFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
};

export function AuthFormField({
  id,
  label,
  type = "text",
  value,
  placeholder,
  autoComplete,
  onChange,
}: AuthFormFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
      />
    </label>
  );
}

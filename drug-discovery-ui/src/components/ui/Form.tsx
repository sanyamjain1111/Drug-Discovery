import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 rounded-lg
          border-2 border-slate-200
          bg-white text-slate-900
          placeholder-slate-400
          transition-all duration-200
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200
          disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60
          ${error ? 'border-rose-500 focus:ring-rose-200' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-slate-500">{helperText}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-2.5 rounded-lg
          border-2 border-slate-200
          bg-white text-slate-900
          placeholder-slate-400
          transition-all duration-200
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200
          disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60
          resize-vertical min-h-[120px]
          ${error ? 'border-rose-500 focus:ring-rose-200' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-slate-500">{helperText}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: Array<{ label: string; value: string }>
}

export function Select({
  label,
  error,
  helperText,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2.5 rounded-lg
          border-2 border-slate-200
          bg-white text-slate-900
          appearance-none
          bg-right bg-no-repeat
          pr-10
          transition-all duration-200
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200
          disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60
          ${error ? 'border-rose-500 focus:ring-rose-200' : ''}
          ${className}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
        }}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-slate-500">{helperText}</p>}
    </div>
  )
}

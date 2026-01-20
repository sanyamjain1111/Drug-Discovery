import React from 'react'
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from 'lucide-react'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  onClose?: () => void
  closeable?: boolean
}

export function Alert({
  variant = 'info',
  title,
  onClose,
  closeable = false,
  className = '',
  children,
  ...props
}: AlertProps) {
  const styles = {
    info: {
      container: 'bg-cyan-50 border border-cyan-200',
      icon: 'text-cyan-600',
      title: 'text-cyan-900',
      text: 'text-cyan-700',
      Icon: InfoIcon,
    },
    success: {
      container: 'bg-emerald-50 border border-emerald-200',
      icon: 'text-emerald-600',
      title: 'text-emerald-900',
      text: 'text-emerald-700',
      Icon: CheckCircle,
    },
    warning: {
      container: 'bg-amber-50 border border-amber-200',
      icon: 'text-amber-600',
      title: 'text-amber-900',
      text: 'text-amber-700',
      Icon: AlertTriangle,
    },
    error: {
      container: 'bg-rose-50 border border-rose-200',
      icon: 'text-rose-600',
      title: 'text-rose-900',
      text: 'text-rose-700',
      Icon: AlertCircle,
    },
  }

  const style = styles[variant]

  return (
    <div
      className={`rounded-lg p-4 ${style.container} ${className}`}
      {...props}
    >
      <div className="flex gap-3">
        <div className={`flex-shrink-0 ${style.icon}`}>
          <style.Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          {title && <h3 className={`font-semibold ${style.title}`}>{title}</h3>}
          <div className={`text-sm ${style.text}`}>{children}</div>
        </div>
        {closeable && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${style.icon} hover:opacity-70 transition-opacity`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}

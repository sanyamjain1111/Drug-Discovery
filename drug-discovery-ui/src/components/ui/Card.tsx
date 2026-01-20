import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'glass' | 'neon'
  hover?: boolean
}

export function Card({ 
  variant = 'default', 
  hover = true, 
  className = '', 
  ...props 
}: CardProps) {
  const baseStyles = 'rounded-xl border bg-white p-6 transition-all duration-300'
  
  const variants = {
    default: 'border-slate-200 shadow-md hover:shadow-lg hover:border-primary-300',
    gradient: 'border-primary-200/50 bg-gradient-card shadow-md hover:shadow-lg',
    glass: 'backdrop-blur-md bg-white/80 border-white/30 hover:bg-white/90 shadow-lg',
    neon: 'border-primary-400/50 shadow-neon-blue hover:shadow-lg',
  }

  const hoverClass = hover ? variants[variant] : ''
  
  return (
    <div 
      className={`${baseStyles} ${hover ? 'cursor-pointer' : ''} ${className} ${hoverClass}`}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className = '', ...props }: CardHeaderProps) {
  return (
    <div 
      className={`mb-4 pb-4 border-b border-slate-200 ${className}`}
      {...props}
    />
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className = '', ...props }: CardTitleProps) {
  return (
    <h3 
      className={`text-xl font-bold text-slate-900 ${className}`}
      {...props}
    />
  )
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className = '', ...props }: CardDescriptionProps) {
  return (
    <p 
      className={`text-sm text-slate-600 ${className}`}
      {...props}
    />
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className = '', ...props }: CardContentProps) {
  return (
    <div 
      className={`${className}`}
      {...props}
    />
  )
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className = '', ...props }: CardFooterProps) {
  return (
    <div 
      className={`flex items-center justify-between pt-4 border-t border-slate-200 ${className}`}
      {...props}
    />
  )
}

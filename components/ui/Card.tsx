import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, glass = true, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-200 border',
        glass
          ? 'bg-slate-900/60 backdrop-blur-xl border-slate-800 shadow-xl shadow-slate-950/40'
          : 'bg-slate-900 border-slate-800 shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

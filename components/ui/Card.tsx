import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "bg-[#1B2333] border border-[#6B7280]/40 rounded-xl p-6 sm:p-8 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

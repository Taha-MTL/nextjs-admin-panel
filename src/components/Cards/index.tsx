import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card ${className}`}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => <div className={`mb-4 ${className}`}>{children}</div>;

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = "",
}) => (
  <h3
    className={`text-title-sm font-bold text-black dark:text-white ${className}`}
  >
    {children}
  </h3>
);

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => <div className={className}>{children}</div>;

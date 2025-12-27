import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <motion.button
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      {children}
    </motion.button>
  );
};

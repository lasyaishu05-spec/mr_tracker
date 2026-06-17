import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8">
      <div className={`glass-panel rounded-2xl shadow-2xl border border-border bg-surface ${sizeClasses[size]} w-full max-h-full flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-text-h">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-text hover:text-text-h hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

export const FormGroup = ({ label, error, required = false, children }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-text mb-2">
        {label}
        {required && <span className="text-accent">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-accent">{error}</p>}
    </div>
  );
};

export const Form = ({ onSubmit, children, loading = false }) => {
  return (
    <form onSubmit={onSubmit}>
      {children}
      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

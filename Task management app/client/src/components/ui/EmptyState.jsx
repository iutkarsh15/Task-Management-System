import React from 'react';
import { ClipboardList } from 'lucide-react';

const EmptyState = ({
  title = 'No tasks found',
  description = 'Get started by creating your first task to stay organized.',
  icon: Icon = ClipboardList,
  actionText,
  onAction
}) => {
  return (
    <div className="flex min-h-[350px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-100">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 active:scale-95 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

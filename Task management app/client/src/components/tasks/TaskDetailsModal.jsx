import React, { useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, Edit, Trash2 } from 'lucide-react';

const TaskDetailsModal = ({ isOpen, onClose, task, onEdit, onDelete }) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const { title, description, status, priority, dueDate, createdAt, updatedAt } = task;

  // Format date for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = () => {
    if (status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  const getStatusStyles = (taskStatus) => {
    switch (taskStatus) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Progress':
        return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  const getPriorityStyles = (taskPriority) => {
    switch (taskPriority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Low':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Category Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getStatusStyles(status)}`}>
            {status}
          </span>
          <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getPriorityStyles(priority)}`}>
            {priority} Priority
          </span>
          {isOverdue() && (
            <span className="inline-flex items-center gap-1 rounded-md border border-rose-100 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
              <AlertCircle className="h-3 w-3" />
              Overdue
            </span>
          )}
        </div>

        {/* Task Title */}
        <h3 className="mt-4 text-xl font-bold text-slate-800 leading-snug">
          {title}
        </h3>

        {/* Task Description */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Description
          </h4>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
            {description || 'No description provided for this task.'}
          </p>
        </div>

        {/* Time Meta Data */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-500">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Due Date</span>
              <span className={`text-xs font-medium text-slate-700 ${isOverdue() ? 'text-rose-600 font-bold' : ''}`}>
                {formatDate(dueDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-500">
              <Clock className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Timeline</span>
              <span className="block text-xs font-medium text-slate-500">
                Created: {formatTime(createdAt)}
              </span>
              {createdAt !== updatedAt && (
                <span className="block text-[10px] text-slate-400 italic">
                  Updated: {formatTime(updatedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={() => {
              onDelete(task._id);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            onClick={() => {
              onEdit(task);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 active:scale-95 transition-all"
          >
            <Edit className="h-4 w-4" />
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;

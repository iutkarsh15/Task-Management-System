import React from 'react';
import { Calendar, AlertCircle, Edit2, Trash2, Eye } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onView, onStatusChange }) => {
  const { title, description, status, priority, dueDate } = task;

  // Format date for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  // Status Badge styling classes
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

  // Priority Badge styling classes
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
    <div className={`relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 ${
      status === 'Completed' ? 'opacity-80' : ''
    }`}>
      {/* Upper Section */}
      <div>
        <div className="flex items-start justify-between gap-4">
          {/* Status Checkbox + Title */}
          <div className="flex items-start gap-3 min-w-0">
            <input
              type="checkbox"
              checked={status === 'Completed'}
              onChange={() =>
                onStatusChange(task._id, status === 'Completed' ? 'Pending' : 'Completed')
              }
              className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <h4
              onClick={() => onView(task)}
              className={`font-semibold text-slate-800 leading-snug cursor-pointer hover:text-brand-600 transition-colors truncate ${
                status === 'Completed' ? 'line-through text-slate-400' : ''
              }`}
            >
              {title}
            </h4>
          </div>
        </div>

        {/* Description */}
        <p className={`mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed ${
          status === 'Completed' ? 'line-through text-slate-400/80' : ''
        }`}>
          {description || 'No description provided.'}
        </p>
      </div>

      {/* Lower Section (Meta & Badges) */}
      <div className="mt-5 space-y-3.5 border-t border-slate-100 pt-4">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${getStatusStyles(status)}`}>
            {status}
          </span>
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${getPriorityStyles(priority)}`}>
            {priority} Priority
          </span>
          {isOverdue() && (
            <span className="inline-flex items-center gap-1 rounded-md border border-rose-100 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
              <AlertCircle className="h-3 w-3" />
              Overdue
            </span>
          )}
        </div>

        {/* Date & Actions row */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="h-3.5 w-3.5" />
            <span className={isOverdue() ? 'text-rose-600 font-semibold' : ''}>
              {formatDate(dueDate)}
            </span>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onView(task)}
              className="rounded-lg p-1.5 hover:bg-slate-50 hover:text-slate-700 transition-colors"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(task)}
              className="rounded-lg p-1.5 hover:bg-slate-50 hover:text-slate-700 transition-colors"
              title="Edit Task"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="rounded-lg p-1.5 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

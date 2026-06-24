import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

const TaskSearchBar = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  sort,
  setSort,
  onReset
}) => {
  const hasActiveFilters = search || status !== 'All' || priority !== 'All' || sort !== 'newest';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-sm placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Action / Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 active:scale-95 transition-all self-end md:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        )}
      </div>

      {/* Select Filters Shelf */}
      <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 sm:grid-cols-3">
        {/* Status Filter */}
        <div>
          <label htmlFor="statusFilter" className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Status
          </label>
          <select
            id="statusFilter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-brand-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label htmlFor="priorityFilter" className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Priority
          </label>
          <select
            id="priorityFilter"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-brand-500 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label htmlFor="sortFilter" className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Sort By
          </label>
          <select
            id="sortFilter"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-brand-500 focus:outline-none"
          >
            <option value="newest">Newest Created</option>
            <option value="oldest">Oldest Created</option>
            <option value="dueDate">Due Date (Soonest)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskSearchBar;

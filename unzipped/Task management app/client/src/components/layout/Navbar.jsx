import React from 'react';
import { Menu, Plus, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ toggleSidebar, onOpenCreateModal }) => {
  const { user } = useAuth();

  // Get current date string formatted nicely
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm shadow-slate-100/50 md:px-6">
      {/* Left side: Hamburger (mobile) & Date */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
          <Calendar className="h-4 w-4" />
          <span>{getFormattedDate()}</span>
        </div>
      </div>

      {/* Right side: Greeting, Create Task button */}
      <div className="flex items-center gap-4">
        <div className="hidden text-right md:block">
          <p className="text-sm font-medium text-slate-700">
            Welcome back, <span className="text-brand-700 font-semibold">{user?.name}</span>
          </p>
          <p className="text-xs text-slate-500">Manage your tasks efficiently</p>
        </div>

        {onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 active:scale-95 transition-all md:px-4 md:py-2 md:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">New</span>
          </button>
        )}

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 border border-slate-200 lg:hidden">
          <span className="text-sm font-semibold">{user?.name?.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

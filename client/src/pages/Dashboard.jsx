import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CalendarDays,
  Plus,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import API from '../services/api';
import Loader from '../components/ui/Loader';
import TaskCard from '../components/tasks/TaskCard';
import TaskFormModal from '../components/tasks/TaskFormModal';
import TaskDetailsModal from '../components/tasks/TaskDetailsModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import EmptyState from '../components/ui/EmptyState';

const Dashboard = () => {
  const { refreshTrigger, triggerRefresh } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [taskToView, setTaskToView] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching dashboard tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [refreshTrigger]);

  // Compute Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;

  const highPriorityTasks = tasks.filter(
    (t) => t.priority === 'High' && t.status !== 'Completed'
  ).length;

  const tasksDueSoonList = tasks.filter((t) => {
    if (t.status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(t.dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3; // due in next 3 days
  });
  const dueSoonCount = tasksDueSoonList.length;

  // Active / Urgent tasks to show on Dashboard (top 3 soonest incomplete tasks)
  const urgentTasks = tasks
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  // Quick toggle status handler
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      triggerRefresh();
    } catch (err) {
      console.error('Error toggling task status:', err);
    }
  };

  // Delete task handler
  const handleDeleteConfirm = async () => {
    if (!taskIdToDelete) return;
    try {
      await API.delete(`/tasks/${taskIdToDelete}`);
      setTaskIdToDelete(null);
      triggerRefresh();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ClipboardList,
      colorClass: 'bg-indigo-50 border-indigo-100 text-indigo-700'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      colorClass: 'bg-emerald-50 border-emerald-100 text-emerald-700'
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      colorClass: 'bg-sky-50 border-sky-100 text-sky-700'
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Clock,
      colorClass: 'bg-amber-50 border-amber-100 text-amber-700'
    },
    {
      title: 'High Priority',
      value: highPriorityTasks,
      icon: AlertTriangle,
      colorClass: 'bg-rose-50 border-rose-100 text-rose-700'
    },
    {
      title: 'Due Soon',
      value: dueSoonCount,
      icon: CalendarDays,
      colorClass: 'bg-purple-50 border-purple-100 text-purple-700'
    }
  ];

  if (loading) {
    return <Loader message="Analyzing dashboard statistics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Upper header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500">
            Track your tasks, deadlines, and project completion metrics.
          </p>
        </div>
        <Link
          to="/tasks"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-all self-start sm:self-auto"
        >
          View All Tasks
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`rounded-xl border p-4 transition-all hover:translate-y-[-2px] hover:shadow-sm ${card.colorClass}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 opacity-80">
                  {card.title}
                </span>
                <Icon className="h-5 w-5 opacity-70" />
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Core Panels Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Urgent Incomplete Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-bold text-slate-800">Urgent Incomplete Tasks</h2>
            </div>
            {urgentTasks.length > 0 && (
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                Action Required
              </span>
            )}
          </div>

          {urgentTasks.length === 0 ? (
            <EmptyState
              title="All caught up!"
              description="No pending or in-progress tasks. Create a task to start organizing."
              actionText="Add New Task"
              onAction={() => {
                // Trigger the click event of the navbar's New Task button by simulating it or just redirecting to /tasks?create=true
                // Since layout handles creating, let's navigate to tasks page with create flag
                window.location.hash = '#/tasks?create=true'; // Fallback or we can support a local modal trigger
              }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {urgentTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={(t) => setTaskToEdit(t)}
                  onDelete={(id) => setTaskIdToDelete(id)}
                  onView={(t) => setTaskToView(t)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Column: Due Soon Notifications */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-800">Deadlines (Next 3 Days)</h2>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
              {dueSoonCount}
            </span>
          </div>

          {tasksDueSoonList.length === 0 ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center text-center p-4">
              <CalendarDays className="h-8 w-8 text-slate-300" />
              <p className="mt-2 text-xs font-semibold text-slate-600">No approaching deadlines</p>
              <p className="mt-1 text-[11px] text-slate-400">Everything is scheduled with comfortable padding.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {tasksDueSoonList.map((task) => (
                <div
                  key={task._id}
                  onClick={() => setTaskToView(task)}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-800">{task.title}</p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      task.priority === 'High'
                        ? 'bg-rose-50 text-rose-700'
                        : task.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Details Modal */}
      {taskToView && (
        <TaskDetailsModal
          isOpen={!!taskToView}
          onClose={() => setTaskToView(null)}
          task={taskToView}
          onEdit={(t) => setTaskToEdit(t)}
          onDelete={(id) => setTaskIdToDelete(id)}
        />
      )}

      {/* Task Edit Modal */}
      {taskToEdit && (
        <TaskFormModal
          isOpen={!!taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onSuccess={() => {
            setTaskToEdit(null);
            triggerRefresh();
          }}
          task={taskToEdit}
        />
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={!!taskIdToDelete}
        onClose={() => setTaskIdToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Dashboard;

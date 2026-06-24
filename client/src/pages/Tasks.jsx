import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import Loader from '../components/ui/Loader';
import TaskCard from '../components/tasks/TaskCard';
import TaskSearchBar from '../components/tasks/TaskSearchBar';
import TaskFormModal from '../components/tasks/TaskFormModal';
import TaskDetailsModal from '../components/tasks/TaskDetailsModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import EmptyState from '../components/ui/EmptyState';

const Tasks = () => {
  const { refreshTrigger, triggerRefresh } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search, Filter, Sort States
  const [searchVal, setSearchVal] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sort, setSort] = useState('newest');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);

  // Parse "?create=true" from URL to auto-open creation modal
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setIsCreateOpen(true);
      setSearchParams({}); // Clear query param
    }
  }, [searchParams, setSearchParams]);

  // Debounce search value
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchVal]);

  // Fetch tasks when query parameters or refresh trigger updates
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (status !== 'All') params.status = status;
        if (priority !== 'All') params.priority = priority;
        params.sort = sort;

        const res = await API.get('/tasks', { params });
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching tasks list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [debouncedSearch, status, priority, sort, refreshTrigger]);

  // Quick toggle status handler
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      triggerRefresh();
    } catch (err) {
      console.error('Error updating task status:', err);
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

  // Reset filters helper
  const handleResetFilters = () => {
    setSearchVal('');
    setStatus('All');
    setPriority('All');
    setSort('newest');
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            My Tasks
          </h1>
          <p className="text-sm text-slate-500">
            Create, manage, and filter your work items.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 active:scale-95 transition-all self-start sm:self-auto"
        >
          Add New Task
        </button>
      </div>

      {/* Filter Shelf */}
      <TaskSearchBar
        search={searchVal}
        setSearch={setSearchVal}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        sort={sort}
        setSort={setSort}
        onReset={handleResetFilters}
      />

      {/* Main Grid View */}
      {loading ? (
        <Loader message="Fetching matching tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          title={searchVal || status !== 'All' || priority !== 'All' ? 'No tasks match your filters' : 'No tasks found'}
          description={
            searchVal || status !== 'All' || priority !== 'All'
              ? 'Try resetting the filters or modifying your search term.'
              : 'Add your first task to start tracking your schedule.'
          }
          actionText={searchVal || status !== 'All' || priority !== 'All' ? 'Clear Filters' : 'Create Task'}
          onAction={searchVal || status !== 'All' || priority !== 'All' ? handleResetFilters : () => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
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

      {/* Task Creation Modal */}
      {isCreateOpen && (
        <TaskFormModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => {
            setIsCreateOpen(false);
            triggerRefresh();
          }}
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

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={!!taskIdToDelete}
        onClose={() => setTaskIdToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Tasks;

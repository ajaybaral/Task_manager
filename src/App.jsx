import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Check, X } from 'lucide-react';

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priority, setPriority] = useState('medium');
  const [sortBy, setSortBy] = useState('date');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTaskTitle.trim(),
        completed: false,
        priority,
        createdAt: new Date(),
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'status':
        return Number(a.completed) - Number(b.completed);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-gradient-to-r from-red-50 to-white';
      case 'medium':
        return 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-white';
      case 'low':
        return 'border-l-green-500 bg-gradient-to-r from-green-50 to-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto backdrop-blur-lg bg-white/90 rounded-2xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Task Manager
          </h1>
          <p className="text-gray-600 mt-2">Organize your tasks efficiently</p>
        </div>

        {/* Custom Alert */}
        {showAlert && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800 text-sm animate-fadeIn">
            Task added successfully!
          </div>
        )}

        {/* Add Task Form */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter new task..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ease-out bg-white"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors duration-200 cursor-pointer appearance-none bg-select-arrow bg-no-repeat bg-right-1"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={addTask}
            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-blue-300 active:transform-none"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors duration-200 cursor-pointer sm:w-auto w-full"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-center gap-3 p-4 rounded-xl border-l-4 ${getPriorityStyles(task.priority)} 
                transform hover:translate-x-1 transition-all duration-200 ease-out hover:shadow-md`}
            >
              <button
                onClick={() => toggleComplete(task.id)}
                className={`p-1 rounded-lg transition-colors duration-200 ${
                  task.completed ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {task.completed ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </button>
              <span
                className={`flex-1 ${
                  task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}
              >
                {task.title}
              </span>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  task.priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : task.priority === 'medium'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {task.priority}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {sortedTasks.length === 0 && (
            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
              <p className="text-gray-500 text-lg">No tasks found. Add some tasks to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
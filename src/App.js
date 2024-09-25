import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Fetch tasks for the logged-in user from localStorage
  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`tasks_${user.username}`);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([]);
      }
    }
  }, [user]);

  // Store user-specific tasks in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks_${user.username}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  // Add Task
  const addTask = () => {
    if (newTask.trim() === '') return;
    const task = { id: Date.now(), text: newTask, completed: false };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  // Delete Task
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Edit Task
  const editTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setNewTask(taskToEdit.text);
    setCurrentTask(taskId);
    setIsEditing(true);
  };

  // Update Task
  const updateTask = () => {
    if (newTask.trim() === '') return;
    setTasks(tasks.map((task) => (task.id === currentTask ? { ...task, text: newTask } : task)));
    setNewTask('');
    setCurrentTask(null);
    setIsEditing(false);
  };

  // Toggle Complete Task
  const toggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Handle Logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setTasks([]);
  };

  return (
    <div className="App">
    {isAuthenticated ? (
      <div>
        <h1>{user?.username}'s To-Do List</h1>
        
        
        {/* Task input and buttons */}
        <div className="task-input-container">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          {/* Add or Update Button below input */}
          <button onClick={isEditing ? updateTask : addTask}>
            {isEditing ? 'Update Task' : 'Add Task'}
          </button>
        </div>
        <button onClick={logout}>Logout</button>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <span
                role="button"
                tabIndex={0}
                onClick={() => toggleComplete(task.id)}
                onKeyDown={() => toggleComplete(task.id)}
              >
                {task.text}
              </span>
              <div className="task-buttons">
                <button onClick={() => editTask(task.id)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        
      </div>
    ) : (
      <Auth setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
    )}
  </div>
  

  );
}

function Auth({ setIsAuthenticated, setUser }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Fetch all users from localStorage
  const fetchAllUsers = () => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  // Save all users to localStorage
  const saveAllUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = fetchAllUsers();

    if (isLoginMode) {
      // Login mode
      const existingUser = users.find((u) => u.username === username && u.password === password);
      if (existingUser) {
        setIsAuthenticated(true);
        setUser(existingUser);
      } else {
        alert('Invalid credentials');
      }
    } else {
      // Signup mode
      const newUser = { username, password };
      if (users.find((u) => u.username === username)) {
        alert('User already exists');
        return;
      }
      users.push(newUser);
      saveAllUsers(users);
      alert('Signup successful! Please login.');
      setIsLoginMode(true); // Switch to login mode after signup
    }
  };

  return (
    <div>
      <h1>{isLoginMode ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLoginMode ? 'Login' : 'Sign Up'}</button>
      </form>
      <button onClick={() => setIsLoginMode(!isLoginMode)}>
        {isLoginMode ? 'Switch to Sign Up' : 'Switch to Login'}
      </button>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = `${import.meta.env.VITE_API_URL}/tasks`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      
    
      console.log("API Response Data:", res.data);

      
      setTasks(Array.isArray(res.data) ? res.data : []); 
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!text) return;
    try {
      await axios.post(API, { text });
      setText('');
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>To-Do List with Devops DB Test</h1>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add</button>
      <ul>
        {/* 3. FIX: The '?' (Optional Chaining) prevents the crash if tasks is null */}
        {tasks?.map((task) => (
          <li key={task._id}>
            {task.text}
            <button onClick={() => deleteTask(task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
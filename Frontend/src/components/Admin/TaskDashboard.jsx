import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';



import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  // Removed duplicate declaration of navigate

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = localStorage.getItem('userId'); // or however you store the logged-in user's ID
        const response = await axios.get(`http://localhost:3000/api/tasks/user/${userId}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  <Box>
    <Typography variant="h4" fontWeight="bold">Task Dashboard</Typography>
  </Box>
  <Button variant="contained" size="small" color="primary">
    Create New Task
  </Button>
</Box>

{/* Example Task List */}
<Box mt={3}>
  {tasks.map(task => (
    <Paper key={task.id} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" fontWeight="bold">{task.title}</Typography>
      <Typography variant="body2" color="text.secondary">{task.description}</Typography>
      <Button 
        variant="outlined" 
        size="small" 
        color="primary" 
        sx={{ mt: 1 }}
        onClick={() => navigate('/assign', { state: { task: { ...task, dueDate: new Date(task.dueDate.$date.$numberLong).toISOString().split('T')[0] } } })}
      >
        Edit
      </Button>
    </Paper>
  ))}
</Box>
      </Paper>
    </Box>
  );
};

export default TaskDashboard;

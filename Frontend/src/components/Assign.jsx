import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

import {
  Box,
  TextField,
  Button,
  Card,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';

const Assign = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    userId: '',
    tasks: [
      {
        id: 1,
        task: '',
        dueDate: '',
        priority: 'medium',
        description: ''
      }
    ]
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState({});
  const [taskErrors, setTaskErrors] = useState([{}]);
  
  const steps = ['Project Details', 'Task Information', 'Review & Assign'];

  // Initialize form with current user and fetch team members
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    setCurrentUser(storedUser);
    
    // Fetch team members from API
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, []);

  // Pre-fill form with task/user data
  useEffect(() => {
    if (location.state?.task) {
      const task = location.state.task;
      setFormData({
        projectId: task.projectId || '',
        projectName: task.projectName || '',
        userId: task.assignedToUserId || '',
        tasks: [
          {
            id: 1,
            task: task.title || '',
            dueDate: task.dueDate?.slice(0, 10) || '',
            priority: task.priority || 'medium',
            description: task.description || ''
          }
        ]
      });
    }
    else if (location.state?.assignToUserId) {
      setFormData(prev => ({
        ...prev,
        userId: location.state.assignToUserId
      }));
    }
  }, [location.state]);

  // Function to add a new task
  const addTask = () => {
    const newTaskId = formData.tasks.length > 0
      ? Math.max(...formData.tasks.map(t => t.id)) + 1
      : 1;

    setFormData({
      ...formData,
      tasks: [
        ...formData.tasks,
        {
          id: newTaskId,
          task: '',
          dueDate: '',
          priority: 'medium',
          description: ''
        }
      ]
    });

    setTaskErrors([...taskErrors, {}]);
  };

  // Function to remove a task
  const removeTask = (taskId) => {
    if (formData.tasks.length <= 1) return;

    setFormData({
      ...formData,
      tasks: formData.tasks.filter(task => task.id !== taskId)
    });

    // Also remove corresponding errors
    const taskIndex = formData.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const newTaskErrors = [...taskErrors];
      newTaskErrors.splice(taskIndex, 1);
      setTaskErrors(newTaskErrors);
    }
  };

  // Handle change for project/user fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle change for task fields
  const handleTaskChange = (taskId, e) => {
    const { name, value } = e.target;

    const updatedTasks = formData.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, [name]: value };
      }
      return task;
    });

    setFormData({
      ...formData,
      tasks: updatedTasks
    });

    // Clear error when field is changed
    const taskIndex = formData.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1 && taskErrors[taskIndex]?.[name]) {
      const newTaskErrors = [...taskErrors];
      newTaskErrors[taskIndex] = {
        ...newTaskErrors[taskIndex],
        [name]: null
      };
      setTaskErrors(newTaskErrors);
    }
  };

  const handleNext = () => {
    let valid = true;
    const newErrors = {};
    const newTaskErrors = Array(formData.tasks.length).fill({}).map(() => ({}));

    if (activeStep === 0) {
      if (!formData.projectId) {
        newErrors.projectId = 'Project ID is required';
        valid = false;
      }
      if (!formData.projectName) {
        newErrors.projectName = 'Project Name is required';
        valid = false;
      }
      if (!formData.userId) {
        newErrors.userId = 'Assigned User is required';
        valid = false;
      }
    } else if (activeStep === 1) {
      // Validate each task
      formData.tasks.forEach((task, index) => {
        if (!task.task) {
          newTaskErrors[index].task = 'Task description is required';
          valid = false;
        }
        if (!task.dueDate) {
          newTaskErrors[index].dueDate = 'Due date is required';
          valid = false;
        }
      });
    }

    setErrors(newErrors);
    setTaskErrors(newTaskErrors);

    if (valid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      for (const task of formData.tasks) {
        const payload = {
          title: task.task || 'Default Title',
          description: task.description || '',
          status: 'to-do',
          priority: task.priority || 'medium',
          dueDate: task.dueDate || null,
          projectId: formData.projectId,
          projectName: formData.projectName,
          assignedToUserId: formData.userId,
          createdByUserId: currentUser?.userId || 'admin'
        };
        await axios.post(`http://localhost:3000/user/${formData.userId}/newtask`, payload);
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error submitting tasks:', error);
      alert('Failed to assign tasks. Please try again.');
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    navigate('/profile'); // Navigate to admin profile after closing snackbar
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.userId}>
                  <InputLabel>Assign To</InputLabel>
                  <Select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    label="Assign To"
                    variant="outlined"
                  >
                    {users.map(user => (
                      <MenuItem key={user.userId} value={user.userId}>
                        {user.username} ({user.userId})
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.userId && (
                    <FormHelperText>{errors.userId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="projectId"
                  label="Project ID"
                  variant="outlined"
                  value={formData.projectId}
                  onChange={handleChange}
                  error={!!errors.projectId}
                  helperText={errors.projectId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="projectName"
                  label="Project Name"
                  variant="outlined"
                  value={formData.projectName}
                  onChange={handleChange}
                  error={!!errors.projectName}
                  helperText={errors.projectName}
                />
              </Grid>
            </Grid>
          </Card>
        );
      case 1:
        return (
          <Card sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Assign multiple tasks to the user
            </Typography>

            {formData.tasks.map((task, index) => (
              <Box key={task.id} sx={{
                mb: 3,
                p: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                backgroundColor: '#f9fafc'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Task #{index + 1}
                  </Typography>
                  {formData.tasks.length > 1 && (
                    <IconButton
                      onClick={() => removeTask(task.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="task"
                      label="Task Description"
                      variant="outlined"
                      value={task.task}
                      onChange={(e) => handleTaskChange(task.id, e)}
                      error={!!(taskErrors[index]?.task)}
                      helperText={taskErrors[index]?.task}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="dueDate"
                      label="Task Due Date"
                      type="date"
                      variant="outlined"
                      value={task.dueDate}
                      onChange={(e) => handleTaskChange(task.id, e)}
                      error={!!(taskErrors[index]?.dueDate)}
                      helperText={taskErrors[index]?.dueDate}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!(taskErrors[index]?.priority)}>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        name="priority"
                        value={task.priority}
                        onChange={(e) => handleTaskChange(task.id, e)}
                        label="Priority"
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="critical">Critical</MenuItem>
                      </Select>
                      {taskErrors[index]?.priority && (
                        <FormHelperText>{taskErrors[index].priority}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="description"
                      label="Additional Details"
                      variant="outlined"
                      value={task.description}
                      onChange={(e) => handleTaskChange(task.id, e)}
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={addTask}
              sx={{ mt: 1 }}
            >
              Add Another Task
            </Button>
          </Card>
        );
      case 2:
        return (
          <Card sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Review Task Assignment
            </Typography>

            <Box sx={{ mb: 3, backgroundColor: '#f9fafc', p: 3, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Project ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formData.projectId}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Project Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formData.projectName}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Assigned To
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {users.find(u => u.userId === formData.userId)?.username || formData.userId}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Tasks to Assign ({formData.tasks.length})
            </Typography>

            {formData.tasks.map((task, index) => (
              <Card key={task.id} sx={{ mb: 3, p: 2, backgroundColor: '#f9fafc', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Task #{index + 1}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {task.task || 'None'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Due Date
                    </Typography>
                    <Typography variant="body1">
                      {task.dueDate || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Priority
                    </Typography>
                    <Typography variant="body1">
                      {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Additional Details
                    </Typography>
                    <Typography variant="body1">
                      {task.description || 'None'}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Card>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box
      sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f4 100%)',
        minHeight: '100vh'
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            color: '#1e293b',
            background: 'linear-gradient(90deg, #4f46e5 0%, #3a8dff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Task Assignment
          </Typography>
        </Box>

        <Box>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                fontWeight: 600,
                borderColor: '#cbd5e1',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f1f5f9'
                }
              }}
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #4f46e5 0%, #3a8dff 100%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #4338ca 0%, #2a7def 100%)',
                  }
                }}
              >
                Assign {formData.tasks.length} Task{formData.tasks.length > 1 ? 's' : ''}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #4f46e5 0%, #3a8dff 100%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #4338ca 0%, #2a7def 100%)',
                  }
                }}
              >
                {activeStep === steps.length - 2 ? 'Review Tasks' : 'Next'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Task(s) assigned successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Assign;
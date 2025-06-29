import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import './Edit.css';
import {
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    }
  },
});

const Edit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    dueDate: '',
    projectId: '',
    projectName: '',
    assignedToUserId: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState({});
  const taskId = location.state?.taskId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, taskResponse] = await Promise.all([
          axios.get('http://localhost:3000/user'),
          axios.get(`http://localhost:3000/task/${taskId}`)
        ]);
        
        setUsers(usersResponse.data);
        const task = taskResponse.data;
        
        setFormData({
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'to-do',
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          projectId: task.projectId || '',
          projectName: task.projectName || '',
          assignedToUserId: task.assignedToUserId || ''
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (taskId) {
      fetchData();
    }
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = {};
    if (!formData.title) validation.title = 'Title is required';
    if (!formData.projectId) validation.projectId = 'Project ID is required';
    if (!formData.assignedToUserId) validation.assignedToUserId = 'User assignment is required';

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    try {
      await axios.put(`http://localhost:3000/task/${taskId}`, formData);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    navigate('/profile');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="edit-container">
        <Paper
          elevation={3}
          className="edit-paper"
          sx={{
            width: '100%',
            maxWidth: 800,
            margin: '0 auto'
          }}
        >
          <div className="edit-form">
            <h1 className="edit-title">Edit Task</h1>
            <p className="edit-subtitle">Update task details and assignments</p>

            <div className="info-box">
              <InfoIcon className="info-box-icon" />
              <span className="info-box-text">
                Changes will be reflected immediately for all team members
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="section-title">
                  <PersonIcon /> Assignment Details
                </div>
                <Grid container spacing={3}>
                  <Grid item xs={12} className="form-row">
                    <FormControl fullWidth error={!!errors.assignedToUserId}>
                      <InputLabel>Assigned To</InputLabel>
                      <Select
                        name="assignedToUserId"
                        value={formData.assignedToUserId}
                        onChange={handleChange}
                        label="Assigned To"
                      >
                        {users.map(user => (
                          <MenuItem key={user.userId} value={user.userId}>
                            {user.username} ({user.userId})
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.assignedToUserId && (
                        <FormHelperText>{errors.assignedToUserId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </div>

              <div className="form-section">
                <div className="section-title">
                  <AssignmentIcon /> Project Information
                </div>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} className="form-row">
                    <TextField
                      fullWidth
                      name="projectId"
                      label="Project ID"
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
                      value={formData.projectName}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </div>

              <div className="form-section">
                <div className="section-title">
                  <PriorityHighIcon /> Task Details
                </div>
                <Grid container spacing={3}>
                  <Grid item xs={12} className="form-row">
                    <TextField
                      fullWidth
                      name="title"
                      label="Task Title"
                      value={formData.title}
                      onChange={handleChange}
                      error={!!errors.title}
                      helperText={errors.title}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Status"
                      >
                        <MenuItem value="to-do">To Do</MenuItem>
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="done">Done</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        label="Priority"
                        className={`priority-select ${formData.priority}`}
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="dueDate"
                      label="Due Date"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="description"
                      label="Description"
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </div>

              <div className="button-group">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Confirm Edit
                </Button>
              </div>
            </form>
          </div>
        </Paper>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            Task updated successfully!
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};

export default Edit;

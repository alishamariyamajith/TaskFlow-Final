import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box, Typography,
  Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material';
import {
  Add,
  Person, Email, Close,
  Work, Lock
} from '@mui/icons-material';

const TeamManagement = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    userId: '',
    password: ''
  });

  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users-with-stats');
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
        alert('Failed to fetch team members. Check console for details.');
      }
    };

    fetchTeamMembers();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewMember({
      name: '',
      role: '',
      email: '',
      userId: '',
      password: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      axios.post('http://localhost:3000/newuser', {
        username: newMember.name,
        email: newMember.email,
        role: newMember.role,
        userId: newMember.userId,
        password: newMember.password
      })
        .then((response) => {
          setTeamMembers([...teamMembers, response.data]);
          alert('Member added successfully!');
          handleCloseDialog();
        })
        .catch((error) => {
          console.error('Error adding team member:', error.response?.data || error.message);
          alert('Failed to add member. Please check the console for more details.');
        });
    } else {
      alert('Name and Role are required fields!');
    }
  };

  const handleDeleteMember = (userId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      axios.delete(`http://localhost:3000/user/${userId}`)
        .then(() => {
          setTeamMembers(prev => prev.filter(m => m.userId !== userId));
          alert('Member deleted successfully!');
        })
        .catch(err => {
          console.error('Error deleting member:', err);
          alert('Failed to delete member. Please try again.');
        });
    }
  };

  return (
    <Box sx={{
      p: 4,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f4 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{
        maxWidth: 1400,
        mx: 'auto',
        background: 'white',
        borderRadius: 4,
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
          color: 'white'
        }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Team Management
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
              Manage your team members and assignments
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenDialog}
            sx={{
              backgroundColor: 'white',
              color: '#4f46e5',
              '&:hover': { backgroundColor: '#f1f5f9' },
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: '12px',
              fontWeight: 600,
              boxShadow: '0 4px 6px rgba(79, 70, 229, 0.3)'
            }}
          >
            Add Member
          </Button>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 3, fontWeight: 600 }}>
            Team Members
          </Typography>

          <div className="row g-3">
            {teamMembers.map(member => (
              <div key={member.userId} className="col-md-6">
                <div className="card border-0 shadow-sm-hover" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div className="card-body p-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="avatar-xl">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center w-100 h-100 fs-3 fw-bold">
                          {member.username ? member.username.split(' ').map(n => n[0]).join('') : ''}
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="card-title mb-1 fw-bold">{member.username || 'No Name Provided'}</h5>
                        <p className="text-primary small fw-medium mb-2">{member.role}</p>
                        <p className="text-muted small mb-2">User ID: {member.userId}</p>
                        <div className="d-flex justify-content-between mt-2">
                          <div className="text-center">
                            <div className="fw-bold">{member.tasks || 0}</div>
                            <small className="text-muted">Tasks</small>
                          </div>
                          <div className="text-center">
                            <div className="fw-bold">{member.completion || 0}%</div>
                            <small className="text-muted">Completion</small>
                          </div>
                          <div className="text-center">
                            <div className="fw-bold">4.8</div>
                            <small className="text-muted">Rating</small>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate('/assign', { state: { assignToUserId: member.userId } })}
                        >
                          Assign Task
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteMember(member.userId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Box>

      {/* Add Member Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            minHeight: '500px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backgroundColor: '#f8fafc',
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 600,
          fontSize: '1.25rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          py: 2,
          px: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1, color: '#4f46e5' }} />
            Add New Team Member
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={newMember.name}
              onChange={handleInputChange}
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontWeight: 500,
                  color: '#334155',
                  backgroundColor: 'white',
                  padding: '0 4px',
                  marginLeft: '-4px'
                }
              }}
              placeholder="John Smith"
              sx={{ mt: 2 }}
            />

            <TextField
              fullWidth
              label="Role"
              name="role"
              value={newMember.role}
              onChange={handleInputChange}
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work color="action" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontWeight: 500,
                  color: '#334155',
                  backgroundColor: 'white',
                  padding: '0 4px',
                  marginLeft: '-4px'
                }
              }}
              placeholder="Frontend Developer"
            />
           
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={newMember.email}
              onChange={handleInputChange}
              variant="outlined"
              required
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontWeight: 500,
                  color: '#334155',
                  backgroundColor: 'white',
                  padding: '0 4px',
                  marginLeft: '-4px'
                }
              }}
              placeholder="john.smith@example.com"
            />

            <TextField
              fullWidth
              label="User ID"
              name="userId"
              value={newMember.userId}
              onChange={handleInputChange}
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontWeight: 500,
                  color: '#334155',
                  backgroundColor: 'white',
                  padding: '0 4px',
                  marginLeft: '-4px'
                }
              }}
              placeholder="12345"
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={newMember.password}
              onChange={handleInputChange}
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontWeight: 500,
                  color: '#334155',
                  backgroundColor: 'white',
                  padding: '0 4px',
                  marginLeft: '-4px'
                }
              }}
              placeholder="Enter password"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #e2e8f0'
        }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              color: '#4a5568',
              borderColor: '#cbd5e0',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#f1f5f9',
                borderColor: '#a0aec0'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMember}
            variant="contained"
            sx={{
              backgroundColor: '#4f46e5',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#4338ca'
              }
            }}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamManagement;
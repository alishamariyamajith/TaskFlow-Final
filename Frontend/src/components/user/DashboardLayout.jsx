import React from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { 
  Box, Typography, List, ListItem, ListItemButton, 
  ListItemIcon, Divider, Button 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Task as TaskIcon, 
  Logout as LogoutIcon 
} from '@mui/icons-material';

const DashboardLayout = () => {
  const { name, userId } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Do you want to logout?");
    if (confirmed) navigate('/');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f4 100%)' 
    }}>
      <Box sx={{ 
        width: 250, 
        bgcolor: 'white', 
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1
      }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Hey {name}
          </Typography>
        </Box>
        <Divider />
        <List sx={{ p: 2, flex: 1 }}>
          <ListItem disablePadding>
            <ListItemButton 
              component={NavLink} 
              to={`/user/${name}/${userId}/dashboard`}
              sx={{
                borderRadius: 2,
                '&.active': { 
                  bgcolor: '#eef2ff',
                  color: '#4f46e5',
                  fontWeight: 600
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <DashboardIcon />
              </ListItemIcon>
              Dashboard
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mt: 1 }}>
            <ListItemButton 
              component={NavLink} 
              to={`/user/${name}/${userId}/tasks`}
              sx={{
                borderRadius: 2,
                '&.active': { 
                  bgcolor: '#eef2ff',
                  color: '#4f46e5',
                  fontWeight: 600
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <TaskIcon />
              </ListItemIcon>
              My Tasks
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth
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
            Logout
          </Button>
        </Box>
      </Box>
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
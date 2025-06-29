import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Avatar,
  Button, List, ListItem,
  ListItemAvatar, ListItemText, Badge
} from '@mui/material';
import TaskTable from './Admin/TaskTable';
import Overview from './Admin/Overview';
import { Email, Work } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState(() => {
    if (location.state?.user) {
      return location.state.user;
    }
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {
      name: 'Alex Morgan',
      role: 'Admin',
      email: 'alex.morgan@taskflowpro.com',
      avatar: 'A',
      userId: 'admin1'
    };
  });

  return (
    <Box className="profile-page" sx={{
      p: 3,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f4 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ maxWidth: 1300, mx: 'auto' }}>

        {/* Two-column layout: Profile + Overview */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          {/* Left: Profile */}
          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                width: '100%',
                p: 3,
                height: '100%',
              }}
            >
              <CardContent sx={{ textAlign: 'center', pt: 4, pb: 3 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Avatar sx={{
                      bgcolor: '#4f46e5',
                      width: 32,
                      height: 32,
                      border: '2px solid white'
                    }}>
                      <Work fontSize="small" />
                    </Avatar>
                  }
                >
                  <Avatar sx={{
                    width: 120,
                    height: 120,
                    fontSize: 48,
                    bgcolor: '#4f46e5',
                    mb: 2,
                    mx: 'auto',
                    color: 'white'
                  }}>
                    {userData.avatar}
                  </Avatar>
                </Badge>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {userData.name}
                </Typography>

                <List sx={{ width: '100%' }}>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#eef2ff', width: 40, height: 40, mb: 1 }}>
                        <Email sx={{ color: '#4f46e5' }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Email"
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: '#64748b' }}
                      secondary={userData.email}
                      secondaryTypographyProps={{ sx: { textAlign: 'center', fontWeight: 500, color: '#1e293b' } }}
                    />
                  </ListItem>
                </List>

                <Typography variant="body2" sx={{
                  color: '#4f46e5',
                  fontWeight: 700,
                  mb: 3,
                  bgcolor: '#eef2ff',
                  py: 1,
                  px: 3,
                  borderRadius: 4,
                  display: 'inline-block'
                }}>
                  {userData.role}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, mb: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/assign')}
                    sx={{
                      fontWeight: 600,
                      borderWidth: '2px',
                      borderColor: '#cbd5e1',
                      color: '#1e293b',
                      '&:hover': {
                        borderColor: '#94a3b8',
                        backgroundColor: '#f1f5f9'
                      },
                      py: 1.2
                    }}
                  >
                    Assign Task
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/team-management')}
                    sx={{
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #4f46e5 0%, #3a8dff 100%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #4338ca 0%, #2a7def 100%)',
                      },
                      py: 1.2
                    }}
                  >
                    Team Management
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right: Overview component */}
          <Box sx={{ flex: 1 }}>
            <Overview />
          </Box>
        </Box>

        {/* Full-width Task Table below */}
        <Box sx={{ mt: 4 }}>
          <TaskTable />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;

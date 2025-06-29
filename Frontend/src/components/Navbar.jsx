import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Button,
  Typography, IconButton, Avatar
} from '@mui/material';

const Navbar = ({ user, setUser, isUserDashboard }) => {
  const navigate = useNavigate();
  // const [user, setUser] = useState(() => {
  //   const storedUser = localStorage.getItem('user');
  //   return storedUser ? JSON.parse(storedUser) : null;
  // });

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('selectedAdmin');
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user) {
      if (user.role === 'admin') {
      navigate('/profile', { state: { user } });
    } else {
      // Go to user dashboard
      navigate(`/user/${user.username}/${user._id}/dashboard`);
    }
  }
  };

  return (
    <AppBar position="static" sx={{
      backgroundColor: 'white',
      color: '#333',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #eee'
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Brand Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3a8dff 0%, #6b5ce7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>TF</Typography>
          </Box>
          <Typography variant="h6" sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #3a8dff 0%, #6b5ce7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            TaskFlow Pro
          </Typography>
        </Box>

        {/* Right-side buttons */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Hi, {user.username}
            </Typography>
            <IconButton onClick={handleProfileClick} color="inherit">
              <Avatar sx={{ bgcolor: '#6b5ce7' }}>{user.initials}</Avatar>
            </IconButton>
            <Button onClick={handleLogout} variant="outlined" color="error">
              Logout
            </Button>
          </Box>
        ) : (
          !isUserDashboard && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/login?role=admin')}
              >
                Admin
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login?role=member')}
              >
                Member
              </Button>
            </Box>
          )
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

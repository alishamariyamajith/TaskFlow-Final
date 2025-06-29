import React from 'react';
import { 
  Box, TextField, Button, Typography, Link, 
  IconButton, DialogTitle, DialogContent 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // ✅ Add this

const MemberSignup = ({ setUser, switchToLogin, onClose }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const navigate = useNavigate(); // ✅ Add this

  const handleSubmit = (e) => {
    e.preventDefault();

    // For demo purposes, simulate signup
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    setUser({
      name,
      initials: initials.substring(0, 2)
    });

    // ✅ Close dialog
    onClose();

    // ✅ Redirect to user dashboard
    navigate('/member');
  };

  return (
    <>
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
          Member Signup
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button 
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#6b5ce7', '&:hover': { bgcolor: '#5a4bd0' } }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link 
              component="button" 
              variant="body2"
              onClick={switchToLogin}
              sx={{ fontWeight: 600 }}
            >
              Admin Login
            </Link>
          </Typography>
        </form>
      </DialogContent>
    </>
  );
};

export default MemberSignup;

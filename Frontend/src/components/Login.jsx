import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert, Link
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ( { setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = new URLSearchParams(location.search).get("role") === "admin";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });

      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('selectedAdmin');
      setUser(user);
      if (user.role === 'admin') {
        navigate('/');
      } else {
        navigate(`/user/${user.username}/${user.userId}/dashboard`);
      }

    } catch (err) {
      setError('Invalid credentials or user not found');
      console.error('Login error:', err);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, #f5f7fa 0%, #e4e7f4 100%),
        radial-gradient(circle at 10% 20%, rgba(175, 189, 255, 0.2) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(192, 202, 255, 0.3) 0%, transparent 20%)
      `,
      backgroundBlendMode: 'overlay',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
        top: '-100px',
        right: '-100px',
        zIndex: 0
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
        bottom: '-150px',
        left: '-150px',
        zIndex: 0
      }
    }}>
      <Box 
        maxWidth={400} 
        width="100%"
        p={4} 
        borderRadius={3}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)',
          zIndex: 1,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <Box textAlign="center" mb={3}>
          <Box 
            component="div" 
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                color: 'white', 
                fontSize: 28, 
                fontWeight: 700,
                transform: 'translateY(2px)'
              }}
            >
              T
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b">
            {isAdmin ? 'Admin Login' : 'Member Login'}
          </Typography>
          <Typography variant="body2" color="#64748b" mt={1}>
            Access your account dashboard
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              style: { borderRadius: 12 }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              style: { borderRadius: 12 }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              py: 1.5,
              bgcolor: '#4f46e5', 
              '&:hover': { 
                bgcolor: '#4338ca',
                transform: 'translateY(-2px)',
                boxShadow: '0 7px 14px rgba(79, 70, 229, 0.3)'
              },
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: 12,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)'
            }}
          >
            Login
          </Button>
        </form>

        {isAdmin && (
          <Typography variant="body2" textAlign="center" mt={3} color="#64748b">
            First time?{' '}
            <Link
              component="button"
              onClick={() => navigate('/register-admin')}
              fontWeight={600}
              sx={{ 
                color: '#4f46e5',
                textDecoration: 'none',
                '&:hover': { 
                  textDecoration: 'underline',
                  color: '#4338ca'
                }
              }}
            >
              Register as Admin
            </Link>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:3000/api/auth/register-admin', {
        username,
        email,
        password
      });

      // After successful registration, redirect to login
      navigate('/login?role=admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box maxWidth={400} mx="auto" p={4} boxShadow={3} borderRadius={2} sx={{ background: 'white' }}>
        <Typography variant="h5" mb={2} fontWeight={600} textAlign="center">
          Register as Admin
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, bgcolor: '#6b5ce7', '&:hover': { bgcolor: '#5a4bd0' } }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AdminRegister;
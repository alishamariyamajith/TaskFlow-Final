import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Alert, Box } from '@mui/material';

const CreateMemberPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/create-member', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Member created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create member');
    }
  };

  return (
    <Box sx={{ width: 300, margin: 'auto', mt: 10 }}>
      <Typography variant="h5" gutterBottom>Create Member</Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Username" name="username" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="Email" name="email" margin="normal" onChange={handleChange} />
        <TextField fullWidth type="password" label="Password" name="password" margin="normal" onChange={handleChange} />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Create</Button>
      </form>
    </Box>
  );
};

export default CreateMemberPage;

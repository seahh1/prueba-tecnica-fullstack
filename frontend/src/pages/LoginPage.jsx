import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { useAuth } from '../store/AuthContext';
import { toast } from 'react-toastify';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error('Por favor, ingresa email y contraseña.');
      return;
    }
    
    await login(email, password); 
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, width: 400 }}>
        <Typography variant="h5" component="h1" align="center" mb={2}>
          Iniciar Sesión
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <TextField
          label="Contraseña"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Acceder'}
        </Button>
      </Paper>
    </Box>
  );
}

export default LoginPage;
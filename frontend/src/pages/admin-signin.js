import React, { useState } from 'react';
import {
  Button, TextField, Box, Typography, Container, Card,
  Snackbar, Alert, InputAdornment, IconButton, Stack,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config/api';

export default function AdminSignIn() {
  const [formData, setFormData] = React.useState({ username: '', password: '' });
  const [errors, setErrors] = React.useState({});
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'error' });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: 'error' });

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackbar({ open: true, message: 'Please fix the errors', severity: 'error' });
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        sessionStorage.setItem('authToken', result.token);
        sessionStorage.setItem('username', formData.username);
        sessionStorage.setItem('admin', JSON.stringify(result.admin));
        setSnackbar({ open: true, message: 'Login successful', severity: 'success' });
        navigate('/admin-dashboard');
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error logging in, please try again later.', severity: 'error' });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <Box>
      <Navbar />
      <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '88vh', py: 6 }}>
        <Card sx={{ width: '100%', maxWidth: 520, overflow: 'hidden', borderRadius: 6, animation: 'pp-pop .4s ease' }}>
          <Box sx={{ p: 4, color: '#fff', textAlign: 'center', background: 'linear-gradient(135deg,#0f3d24,#16a34a)' }}>
            <AdminPanelSettingsRoundedIcon sx={{ fontSize: 48 }} />
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 32, lineHeight: 1, mt: 1 }}>Admin Console</Typography>
            <Typography sx={{ opacity: 0.9 }}>Restricted access — authorised staff only.</Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={1}>
              <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus value={formData.username} onChange={handleChange} error={!!errors.username} helperText={errors.username} />
              <TextField
                fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required margin="normal"
                error={!!errors.password} helperText={errors.password}
                InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowPassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }}
              />
              <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 2 }}>Sign In</Button>
            </Stack>
          </Box>
        </Card>
      </Container>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity || 'error'} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
      <Footer />
    </Box>
  );
}

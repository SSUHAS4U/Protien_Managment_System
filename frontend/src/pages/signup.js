import React, { useState } from 'react';
import {
  Box, Button, Container, FormControl, TextField, Typography, Card, Grid,
  Snackbar, Alert, MenuItem, InputAdornment, IconButton, Stack,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { API_BASE } from '../config/api';

export default function SignUp() {
  const [formData, setFormData] = useState({
    Name: '', email: '', password: '', confirmPassword: '', gender: '',
    birthDate: '', heightFeet: '', heightInches: '', weight: '',
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDateChange = (dateString) => {
    const date = dateString ? new Date(dateString) : null;
    const formattedDate = date && !isNaN(date.getTime()) ? dateString : null;
    setFormData({ ...formData, birthDate: formattedDate });
    if (date && !isNaN(date.getTime())) {
      setErrors((prev) => ({ ...prev, birthDate: '' }));
    } else {
      setErrors((prev) => ({ ...prev, birthDate: 'Invalid date format' }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    setFormSubmitted(true);
    if (!formData.Name) tempErrors.Name = 'Name is required.';
    if (!formData.email) tempErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Email is not valid.';
    if (formData.password.length < 8) tempErrors.password = 'Password must be at least 8 characters long.';
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match.';
    if (!formData.confirmPassword) tempErrors.confirmPassword = 'Confirm Password is required.';
    if (!formData.gender) tempErrors.gender = 'Gender is required.';
    if (!formData.birthDate) {
      tempErrors.birthDate = 'Birth Date is required.';
    } else {
      const date = new Date(formData.birthDate);
      if (isNaN(date.getTime()) || date.toString() === 'Invalid Date') tempErrors.birthDate = 'Birth Date is in incorrect format.';
    }
    if (!formData.heightFeet) tempErrors.heightFeet = 'Height (Feet) is required.';
    if (!formData.heightInches) tempErrors.heightInches = 'Height (Inches) is required.';
    if (!formData.weight) tempErrors.weight = 'Weight is required.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setSnackbarMessage('Please fix the errors before submitting.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    try {
      const existingUserResponse = await axios.get(`${API_BASE}/users/check-email?email=${formData.email}`);
      if (existingUserResponse.data.exists) {
        setSnackbarMessage('User already exists.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      const response = await axios.post(`${API_BASE}/users`, {
        name: formData.Name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        birthDate: formData.birthDate,
        heightFeet: formData.heightFeet,
        heightInches: formData.heightInches,
        weight: formData.weight,
      });
      console.log('User registered successfully:', response.data);
      setSnackbarMessage('User registered successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setFormData({ Name: '', email: '', password: '', confirmPassword: '', gender: '', birthDate: '', heightFeet: '', heightInches: '', weight: '' });
    } catch (error) {
      console.error('There was an error registering the user:', error);
      setSnackbarMessage('There was an error registering the user.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box>
      <Navbar />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
      </Snackbar>

      <Container component="main" maxWidth="md" sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width: '100%', maxWidth: 920, overflow: 'hidden', borderRadius: 6, animation: 'pp-pop .4s ease' }}>
          {/* Header band */}
          <Box sx={{ p: { xs: 3, sm: 4 }, color: '#fff', background: 'linear-gradient(135deg,#15803d,#84cc16)' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PersonAddAltRoundedIcon sx={{ fontSize: 34 }} />
              <Box>
                <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 32, lineHeight: 1 }}>Create your free account</Typography>
                <Typography sx={{ opacity: 0.92 }}>Start your healthier eating journey in under a minute.</Typography>
              </Box>
            </Stack>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: { xs: 3, sm: 4 } }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 20, color: 'primary.dark', mb: 0.5 }}>Account</Typography>
                <TextField fullWidth label="Name" name="Name" value={formData.Name} onChange={handleChange} required margin="normal" error={!!errors.Name} helperText={errors.Name} />
                <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} required margin="normal" error={!!errors.email} helperText={errors.email} />
                <TextField
                  fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required margin="normal"
                  error={!!errors.password} helperText={errors.password}
                  InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowPassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }}
                />
                <TextField
                  fullWidth label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required margin="normal"
                  error={!!errors.confirmPassword} helperText={errors.confirmPassword}
                  InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowConfirmPassword} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 20, color: 'primary.dark', mb: 0.5 }}>Personal details</Typography>
                <FormControl fullWidth margin="normal">
                  <TextField select label="Gender" name="gender" value={formData.gender} onChange={handleChange} error={!!errors.gender} helperText={errors.gender} required
                    InputLabelProps={{ shrink: true }} SelectProps={{ displayEmpty: true, MenuProps: { disableScrollLock: true } }}>
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </FormControl>
                <TextField label="Birth Date" type="date" fullWidth margin="normal" required value={formData.birthDate || ''} onChange={(e) => handleDateChange(e.target.value)}
                  InputLabelProps={{ shrink: true }} inputProps={{ max: new Date().toISOString().split('T')[0] }}
                  error={formSubmitted && !!errors.birthDate} helperText={formSubmitted && errors.birthDate} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Height (Feet)" name="heightFeet" value={formData.heightFeet} onChange={handleChange} required margin="dense" error={!!errors.heightFeet} helperText={errors.heightFeet} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Height (Inches)" name="heightInches" value={formData.heightInches} onChange={handleChange} required margin="dense" error={!!errors.heightInches} helperText={errors.heightInches} />
                  </Grid>
                </Grid>
                <TextField fullWidth label="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} required margin="dense" error={!!errors.weight} helperText={errors.weight} />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 1 }}>Create account</Button>
                <Typography sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                  Already have an account?{' '}
                  <Box component="a" href="/signin" sx={{ color: 'primary.dark', fontWeight: 700, textDecoration: 'none' }}>Sign in</Box>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
}

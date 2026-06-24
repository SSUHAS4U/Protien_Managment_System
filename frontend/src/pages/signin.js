import * as React from 'react';
import {
  Button, TextField, Box, Typography, Container, Card, Grid, Link,
  Snackbar, Alert, InputAdornment, IconButton, Stack,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import EnergySavingsLeafRoundedIcon from '@mui/icons-material/EnergySavingsLeafRounded';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config/api';

export default function SignIn() {
  const [formData, setFormData] = React.useState({ email: '', password: '', enteredCaptcha: '' });
  const [errors, setErrors] = React.useState({});
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'error' });
  const [showPassword, setShowPassword] = React.useState(false);
  const [captcha, setCaptcha] = React.useState('');
  const navigate = useNavigate();

  const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: 'error' });
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const generateCaptcha = async () => {
    try {
      const response = await fetch(`${API_BASE}/captcha/generate`);
      const data = await response.json();
      setCaptcha(data.captcha);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error generating captcha', severity: 'error' });
    }
  };

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.enteredCaptcha) newErrors.captcha = 'Enter the captcha';
    else if (formData.enteredCaptcha !== captcha) newErrors.captcha = 'Captcha is incorrect';
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
      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const result = await response.json();
      if (response.ok) {
        sessionStorage.setItem('authToken', result.token);
        sessionStorage.setItem('email', formData.email);
        navigate('/Dashboard');
        window.location.reload();
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
      <Container component="main" maxWidth="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '88vh', py: 6 }}>
        <Card sx={{ width: '100%', maxWidth: 920, overflow: 'hidden', borderRadius: 6, animation: 'pp-pop .4s ease' }}>
          <Grid container>
            {/* Brand panel */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative', flexDirection: 'column', justifyContent: 'space-between', p: 4, color: '#fff', background: 'linear-gradient(150deg,#15803d,#84cc16)' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EnergySavingsLeafRoundedIcon />
                <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 26 }}>ProteinPro</Typography>
              </Stack>
              <Box>
                <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 40, lineHeight: 1 }}>
                  Welcome back!
                </Typography>
                <Typography sx={{ opacity: 0.92, mt: 1.5, lineHeight: 1.6 }}>
                  Pick up right where you left off — your meals, macros and AI coach are waiting.
                </Typography>
              </Box>
              <Typography sx={{ opacity: 0.8, fontSize: 13 }}>Eat smarter. Live stronger.</Typography>
            </Grid>

            {/* Form */}
            <Grid item xs={12} md={7} sx={{ p: { xs: 3, sm: 5 } }}>
              <Typography component="h1" sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 34 }}>Sign In</Typography>
              <Typography sx={{ color: 'text.secondary', mb: 2 }}>Access your nutrition dashboard.</Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField margin="normal" required fullWidth label="Email Address" name="email" autoComplete="email" autoFocus value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
                <TextField
                  margin="normal" required fullWidth name="password" label="Password"
                  type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                  value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
                  <Box sx={{ flex: 1, textAlign: 'center', py: 1.2, borderRadius: 2, bgcolor: '#eafce9', color: '#15803d', fontWeight: 800, letterSpacing: 4, fontSize: 20, border: '1px dashed #16a34a', userSelect: 'none' }}>
                    {captcha}
                  </Box>
                  <IconButton onClick={generateCaptcha} type="button" aria-label="Refresh captcha" sx={{ bgcolor: '#eafce9', color: '#15803d' }}>
                    <RefreshRoundedIcon />
                  </IconButton>
                </Stack>
                <TextField margin="normal" required fullWidth name="enteredCaptcha" label="Enter Captcha" value={formData.enteredCaptcha} onChange={handleChange} error={!!errors.captcha} helperText={errors.captcha} />
                <Button type="submit" fullWidth variant="contained" size="large" startIcon={<LoginRoundedIcon />} sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>
                <Link href="/signup" variant="body2" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                  Don't have an account? Create one →
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity || 'error'}>{snackbar.message}</Alert>
      </Snackbar>
      <Footer />
    </Box>
  );
}

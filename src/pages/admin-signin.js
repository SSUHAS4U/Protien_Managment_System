import React, { useState} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import img from '../images/bowl.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Updated color theme to sky blue
const skyBlueTheme = createTheme({
  palette: {
    primary: {
      main: '#00bfff', // Sky Blue
    },
    secondary: {
      main: '#00bfff', // Sky Blue
    },
    text: {
      primary: '#000',
    },
    background: {
      default: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fff',
          backgroundColor: '#00bfff', // Sky Blue
          '&:hover': {
            backgroundColor: '#0095e8', // Darker Blue on hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: '#000',
          },
          '& .MuiInputLabel-root': {
            color: '#000',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000',
            },
            '&:hover fieldset': {
              borderColor: '#000',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000',
            },
          },
        },
      },
    },
  },
});

export default function AdminSignIn() {
  const [formData, setFormData] = React.useState({ username: '', password: '' });
  const [errors, setErrors] = React.useState({});
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: '' });
  const navigate = useNavigate(); // Initialize navigate
  const [showPassword, setShowPassword] = useState(false);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } 
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
      const response = await fetch('http://localhost:8080/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        // Create a session with admin data
        sessionStorage.setItem('authToken', result.token); // Assuming the backend sends a token on successful login
        sessionStorage.setItem('username', formData.username); // Store the username in session storage
        sessionStorage.setItem('admin', JSON.stringify(result.admin)); // Store admin data if returned
        
        setSnackbar({ open: true, message: 'Login successful', severity: 'success' });
        
        // Navigate to dashboard
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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    // Apply overflow-x: hidden to the body when the component mounts
    document.body.style.overflowX = 'hidden';

    // Cleanup the style when the component unmounts
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  return (
    <ThemeProvider theme={skyBlueTheme}>
      <div style={{ overflowX: 'hidden', width: '100vw' }}> {/* Apply full width */}
        <Navbar />

        {/* Decorative background container - Hidden on mobile */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none', display: windowWidth < 768 ? 'none' : 'block' }}>
          {/* Circles on the left side */}
          <div style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)' }}>
            {/* First Circle (Left) */}
            <div style={{
              width: windowWidth < 1024 ? '450px' : '600px',
              height: windowWidth < 1024 ? '450px' : '600px',
              backgroundColor: '#87CEEB',
              borderRadius: '50%',
              position: 'absolute',
              left: windowWidth < 1024 ? '-225px' : '-300px',
              top: windowWidth < 1024 ? '-75px' : '-100px',
              opacity: '1',
            }} />
            {/* Second Circle (Left) */}
            <div style={{
              width: windowWidth < 1024 ? '550px' : '750px',
              height: windowWidth < 1024 ? '550px' : '750px',
              backgroundColor: '#87CEEB',
              borderRadius: '50%',
              position: 'absolute',
              left: windowWidth < 1024 ? '-275px' : '-375px',
              top: windowWidth < 1024 ? '-350px' : '-475px',
              opacity: '0.9',
            }} />
          </div>

          {/* Circles on the right side */}
          <div style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)' }}>
            {/* First Circle (Right) */}
            <div style={{
              width: windowWidth < 1024 ? '450px' : '600px',
              height: windowWidth < 1024 ? '450px' : '600px',
              backgroundColor: '#87CEEB',
              borderRadius: '50%',
              position: 'absolute',
              right: windowWidth < 1024 ? '-225px' : '-300px',
              top: windowWidth < 1024 ? '-75px' : '-100px',
              clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
              opacity: '1',
            }} />
            {/* Second Circle (Right) */}
            <div style={{
              width: windowWidth < 1024 ? '550px' : '750px',
              height: windowWidth < 1024 ? '550px' : '750px',
              backgroundColor: '#87CEEB',
              borderRadius: '50%',
              position: 'absolute',
              right: windowWidth < 1024 ? '-275px' : '-375px',
              top: windowWidth < 1024 ? '-350px' : '-475px',
              clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
              opacity: '0.9',
            }} />
          </div>
        </div>

        <Container component="main" maxWidth="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            position: 'relative',
            px: { xs: 2, sm: 3, md: 4 },
            mx: 'auto',
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: { xs: 10, sm: 8 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: { xs: 4, sm: 8 },
              width: '100%',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                boxShadow: 3,
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                height: { xs: 'auto', md: '500px' },
                width: '100%',
                maxWidth: '900px',
                mx: 'auto',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0px 0px 20px 5px rgba(0, 191, 255, 0.5)',
                }
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <CardMedia
                    component="img"
                    image={img}
                    alt="Sign In Image"
                    sx={{ objectFit: 'cover', height: '100%' }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CardContent sx={{ padding: { xs: 2, sm: 3 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: { xs: 2, md: 13 },
                      }}
                    >
                      <Typography component="h1" variant="h5" color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                        Admin Sign In
                      </Typography>
                      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="username"
                          label="Username"
                          name="username"
                          autoComplete="username"
                          autoFocus
                          value={formData.username}
                          onChange={handleChange}
                          error={!!errors.username}
                          helperText={errors.username}
                        />
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          margin="normal"
                          error={!!errors.password}
                          helperText={errors.password}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Sign In
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Container>

        {/* Snackbar for success and error messages */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

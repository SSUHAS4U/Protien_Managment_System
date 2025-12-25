import * as React from 'react';
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
import img from '../images/heart.png';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

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

export default function SignIn() {
  const [formData, setFormData] = React.useState({ email: '', password: '', enteredCaptcha: '' });
  const [errors, setErrors] = React.useState({});
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: '' });
  const [showPassword, setShowPassword] = React.useState(false);
  const [captcha, setCaptcha] = React.useState('');
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Fetch Captcha from Backend
  const generateCaptcha = async () => {
    try {
      const response = await fetch('http://localhost:8080/captcha/generate');
      const data = await response.json();
      setCaptcha(data.captcha);
      
    } catch (error) {
      setSnackbar({ open: true, message: 'Error generating captcha', severity: 'error' });
    }
  };

  // Initialize Captcha on Component Mount
  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (!formData.enteredCaptcha) {
      newErrors.captcha = 'Enter the captcha';
    } else if (formData.enteredCaptcha !== captcha) {
      newErrors.captcha = 'Captcha is incorrect';
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
      const response = await fetch('http://localhost:8080/users/login', {
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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  React.useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  return (
    <ThemeProvider theme={skyBlueTheme}>
      <div style={{ overflowX: 'hidden', width: '100vw' }}>
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
                boxShadow: 3,
                borderRadius: 2,
                display: 'flex',
                height: { xs: 'auto', md: '570px' },
                width: '100%',
                maxWidth: '900px',
                mx: 'auto',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0px 0px 20px 5px rgba(0, 191, 255, 0.5)',
                }
              }}
            >
              <Grid container>
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: { xs: 2, sm: 3 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography component="h1" variant="h5" color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                        Sign In
                      </Typography>
                      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          autoFocus
                          value={formData.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                          sx={{ backgroundColor: 'white', borderRadius: '10px' }}
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          error={!!errors.password}
                          helperText={errors.password}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={togglePasswordVisibility}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Box display="flex" flexDirection="column" alignItems="center" mt={2} sx={{ width: '100%' }}>
                          <Box display="flex" alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 1, sm: 0 }} sx={{ width: '100%' }}>
                            <Typography
                              sx={{
                                display: 'inline-block',
                                padding: { xs: '8px', sm: '10px' },
                                backgroundColor: '#e0f7ff',
                                color: '#007acc',
                                fontWeight: 'bold',
                                borderRadius: '5px',
                                border: '1px solid #007acc',
                                fontSize: { xs: '16px', sm: '18px' },
                                letterSpacing: '2px',
                                marginRight: { xs: 0, sm: '10px' },
                                textAlign: 'center',
                                flex: '1',
                                width: { xs: '100%', sm: 'auto' },
                              }}
                            >
                              {captcha}
                            </Typography>
                            <Button
                              onClick={generateCaptcha}
                              variant="contained"
                              sx={{
                                backgroundColor: '#00bfff',
                                color: '#fff',
                                width: { xs: '100%', sm: 'auto' },
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                  backgroundColor: '#007acc',
                                },
                              }}
                            >
                              Refresh Captcha
                            </Button>
                          </Box>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="enteredCaptcha"
                            label="Enter Captcha"
                            value={formData.enteredCaptcha}
                            onChange={handleChange}
                            error={!!errors.captcha}
                            helperText={errors.captcha}
                            sx={{
                              backgroundColor: 'white',
                              borderRadius: '10px',
                              mt: 2,
                            }}
                          />
                        </Box>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Sign In
                        </Button>
                        <Grid container>
                          <Grid item>
                            <Link href="/signup" variant="body2">
                              {"Don't have an account? Sign Up"}
                            </Link>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <CardMedia
                    component="img"
                    alt="sign-in"
                    height="100%"
                    image={img}
                    sx={{ objectFit: 'cover' }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Container>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </div>
    </ThemeProvider>
  );
}

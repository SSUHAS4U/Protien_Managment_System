import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import img from '../images/heart.png';

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
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#00bfff', // Sky Blue
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

const navbarTheme = createTheme({
  palette: {
    primary: {
      main: '#00bfff', // Sky Blue
    },
    text: {
      primary: '#000', // Black text color
    },
    background: {
      default: '#fff', // White background for navbar
    },
  },
});

export default function SignIn() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={skyBlueTheme}>
      <div style={{ overflowX: 'hidden' }}> {/* Add overflowX hidden */}
        <ThemeProvider theme={navbarTheme}>
          <Navbar />
        </ThemeProvider>

        {/* Circles on the left bottom corner */}
        <div style={{ position: 'absolute', bottom: '0', left: '0', zIndex: '-1', top: '-50px' }}>
          {/* First Circle (Left) */}
          <div style={{
            width: '300px',
            height: '300px',
            backgroundColor: 'skyblue',
            borderRadius: '50%',
            position: 'absolute',
            left: '-150px', // Half of the width to position it partially outside the page
            bottom: '50px',
            zIndex: '-1',
          }} />
          {/* Second Circle (Left) */}
          <div style={{
            width: '400px',
            height: '400px',
            backgroundColor: 'skyblue',
            borderRadius: '50%',
            position: 'absolute',
            left: '-200px', // Slightly larger and more to the left
            top: '100px',
            bottom: '250px',
            zIndex: '-1',
          }} />
        </div>

        {/* Circles on the right bottom corner */}
        <div style={{ position: 'absolute', bottom: '0', right: '0', zIndex: '-1', top: '0' }}>
          {/* First Circle (Right) */}
          <div style={{
            width: '300px',
            height: '300px',
            backgroundColor: 'skyblue',
            right: '-150px',
            borderRadius: '50%',
            position: 'absolute',
            bottom: '50px',
            zIndex: '-1',
            clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', // Cuts right half
          }} />
          {/* Second Circle (Right) */}
          <div style={{
            width: '400px',
            height: '400px',
            backgroundColor: 'skyblue',
            borderRadius: '50%',
            position: 'absolute',
            bottom: '250px',
            right: '-200px',
            top: '60px',
            zIndex: '-1',
            clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', // Cuts right half
          }} />
        </div>

        <div style={{ minHeight: 'calc(100vh - 100px)', paddingBottom: '10px', marginTop: '100px' }}>
          <Container component="main" maxWidth="lg"> {/* Use lg to accommodate the larger card */}
            <CssBaseline />
            <Card 
              sx={{ 
                boxShadow: 3, 
                borderRadius: 2, 
                display: 'flex', 
                height: '500px', // Increase card height
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)', // Enlarge on hover
                  boxShadow: '0px 4px 20px skyblue', // Sky blue box shadow on hover
                }
              }}
            >
              <Grid container>
                <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 3 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Typography component="h1" variant="h5" color="primary">
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
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                        />
                        <FormControlLabel
                          control={<Checkbox value="remember" color="primary" />}
                          label="Remember me"
                        />
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Sign In
                        </Button>
                        <Grid container>
                          <Grid item xs>
                            <Link href="#" variant="body2">
                              Forgot password?
                            </Link>
                          </Grid>
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
                <Grid item xs={6}>
                  <CardMedia
                    component="img"
                    image={img} // Replace with your image path
                    alt="Sign In Image"
                    sx={{ objectFit: 'cover', height: '100%' }} // Adjust height as needed
                  />
                </Grid>
              </Grid>
            </Card>
          </Container>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

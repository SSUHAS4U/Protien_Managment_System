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
import img from '../images/admin.png';

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
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get('username'),
      password: data.get('password'),
    });
  };

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
          <Container component="main" maxWidth="md">
            <CssBaseline />
            <Card 
              sx={{ 
                display: 'flex',
                boxShadow: 3, 
                borderRadius: 2, 
                transition: 'transform 0.3s, box-shadow 0.3s',
                height: '500px',  // Increased height
                width: '100%',     // Full width to maintain responsiveness
                maxWidth: '800px', // Set a maximum width for larger screens
                '&:hover': {
                  transform: 'scale(1.05)', // Enlarge on hover
                  boxShadow: '0px 4px 20px skyblue', // Sky blue box shadow on hover
                }
              }}
            >
              {/* Left part of the card for the image */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CardMedia
                    component="img"
                    image={img} // Replace with your image path
                    alt="Sign In Image"
                    sx={{ objectFit: 'cover', height: '100%' }} // Adjust height as needed
                  />
                </Grid>

                {/* Right part of the card for the form */}
                <Grid item xs={12} sm={6}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 13,
                      }}
                    >
                      <Typography component="h1" variant="h5" color="primary">
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
          </Container>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

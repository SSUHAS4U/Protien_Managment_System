import React, { useState , useEffect} from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  CssBaseline,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Card,
  Grid,
  Divider,
  MenuItem,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import Navbar from '../components/Navbar'; // Adjust the path based on your folder structure
import Footer from '../components/Footer'; // Adjust the path based on your folder structure

// Theme with sky blue palette
const skyBlueTheme = createTheme({
  palette: {
    primary: {
      main: '#00bfff',
    },
    secondary: {
      main: '#00bfff',
    },
    text: {
      primary: '#000',
    },
    background: {
      default: '#fff',
    },
    defaultProps: {
      disableScrollLock: true, // Disable scroll lock globally
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fff',
          backgroundColor: '#00bfff',
          '&:hover': {
            backgroundColor: '#0095e8',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#00bfff',
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

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    yearOfBirth: '',
    birthMonth: '',
    birthDay: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const days = [...Array(31).keys()].map((day) => {
    const dayStr = String(day + 1).padStart(2, '0');
    return { value: dayStr, label: dayStr };
  });

    // Adding overflow-x: hidden to the body
    useEffect(() => {
      const bodyStyle = document.body.style;
      bodyStyle.overflowX = 'hidden';
      bodyStyle.overflowY = 'scroll'; // Allow vertical scroll
      
      return () => {
        bodyStyle.overflowX = 'unset'; // Clean up
        bodyStyle.overflowY = 'unset'; // Clean up
      };
    }, []);

  return (
    <ThemeProvider theme={skyBlueTheme}>
      <Navbar /> {/* Include Navbar here */}
      {/* Circles on the left bottom corner */}
      <div style={{ position: 'absolute', bottom: '0', left: '0', zIndex: '-1',top:'-50px' }}>
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
          top:'100px',
          bottom: '250px',
          zIndex: '-1',
        }} />
      </div>

      {/* Circles on the right bottom corner */}
      <div style={{ position: 'absolute', bottom: '0', right: '0', zIndex: '-1',top: '0' }}>
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
          top:'60px',
          zIndex: '-1',
          clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', // Cuts right half
        }} />
      </div>
      <Container component="main" maxWidth="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh', // Ensures the container takes full height
            position: 'relative', // For positioning circles
          }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 8, // Added margin-bottom to add space before Footer
          }}
        >
        <Card
          sx={{
            padding: 4,
            marginTop: -1,
            width: '100%',
            backgroundColor: 'white',
            boxShadow: 3,
            textAlign: 'center',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Add transition
            '&:hover': {
              transform: 'scale(1.05)', // Enlarge the card on hover
              boxShadow: '0px 0px 20px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
            },
          }}
        >
          
            {/* Moved Sign Up inside the card and centered */}
            <Typography component="h1" variant="h5" color="primary" sx={{ marginBottom: 2 }}>
              SIGN UP
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate >
              <Grid container spacing={2}>
                {/* Left Side - Create a Free Account */}
                <Grid item xs={12} sm={5}>
                  <Typography component="h2" variant="h6" color="primary">
                    Create a Free Account
                  </Typography>

                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>

                {/* Middle Divider */}
                <Grid item xs={12} sm={1}>
                  <Divider orientation="vertical" flexItem sx={{ height: '100%' }} />
                </Grid>

                {/* Right Side - Profile Details */}
                <Grid item xs={12} sm={6}>
                  <Typography component="h2" variant="h6" color="primary">
                    Profile Details
                  </Typography>

                  <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      <FormControlLabel
                        value="Prefer not to say"
                        control={<Radio />}
                        label="Prefer not to say"
                      />
                    </RadioGroup>
                  </FormControl>

                  {/* Date of Birth Inputs */}
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Month"
                      name="birthMonth"
                      value={formData.birthMonth}
                      onChange={handleChange}
                      required
                      select
                      margin="normal"
                      MenuProps={{
                        disableScrollLock: true,
                        disablePortal: true, // This ensures the dropdown stays within the parent container
                      }}
                    >
                      {months.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                          {month.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Day"
                        name="birthDay"
                        value={formData.birthDay}
                        onChange={handleChange}
                        required
                        select
                        margin="normal"
                        MenuProps={{
                          disableScrollLock: true, // Prevents scroll lock
                          disablePortal: true,
                        }}
                      >
                        {days.map((day) => (
                          <MenuItem key={day.value} value={day.value}>
                            {day.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Year"
                        name="yearOfBirth"
                        value={formData.yearOfBirth}
                        onChange={handleChange}
                        required
                        select
                        margin="normal"
                        MenuProps={{
                          disableScrollLock: true, // Prevents scroll lock
                          disablePortal: true,
                        }}
                      >
                        {[...Array(100)].map((_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Height (Feet)"
                        name="heightFeet"
                        value={formData.heightFeet}
                        onChange={handleChange}
                        required
                        select
                        margin="normal"
                        MenuProps={{
                          disableScrollLock: true, // Prevents scroll lock
                          disablePortal: true,
                        }}
                      >
                        {[...Array(8)].map((_, i) => (
                          <MenuItem key={i} value={i}>
                            {i} ft
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Height (Inches)"
                        name="heightInches"
                        value={formData.heightInches}
                        onChange={handleChange}
                        required
                        select
                        margin="normal"
                        MenuProps={{
                          disableScrollLock: true, // Prevents scroll lock
                          disablePortal: true,
                        }}
                      >
                        {[...Array(12)].map((_, i) => (
                          <MenuItem key={i} value={i}>
                            {i} in
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Weight (kgs)"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </Card>
        </Box>
      </Container>
      <Footer /> {/* Include Footer here */}
    </ThemeProvider>
  );
}

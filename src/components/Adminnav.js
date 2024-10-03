import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu'; // Three-line menu icon
import AddIcon from '@mui/icons-material/Add'; // "+" icon
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Exit icon
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom'; // For redirection

export default function ButtonAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate(); // Using React Router's useNavigate hook for redirection

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFoodClick = () => {
    setAnchorEl(null);
    navigate('/admin-addfood'); // Redirect to the "admin-addfood" route
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    navigate('/'); // Redirect to the homepage on logout
  };

  return (
    <Box >
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#ffffff', // Set background color to white
          color: '#333333', // Dark text color for contrast
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          width: '100%', // Ensure full width
          transition: 'background-color 0.3s ease', // Smooth transition for background
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}> {/* Space items evenly */}
          {/* Logo and home link */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => window.location.href = '/admin-dashboard'}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: '#00bfff', // Sky blue color
                fontWeight: 'bold',
                fontSize: '1.5rem',
              }}
            >
              Protein Pro
            </Typography>
          </Box>

          {/* Three-line Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
            sx={{
              marginRight: 2,
              color: '#00bfff', // Sky blue color for the menu icon
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            disableScrollLock={true}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              mt: 1,
              '& .MuiMenuItem-root': {
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: '#f0f0f0', // Light gray on hover
                  borderRadius: '8px', // Rounded corners on hover
                },
              },
            }}
          >
            {/* "Food" Menu Item with "+" Icon */}
            <MenuItem onClick={handleFoodClick} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ marginRight: '8px' }}>Food</Typography>
              <Box
                sx={{
                  backgroundColor: '#00bfff', // Sky blue background
                  borderRadius: '50%', // Circle shape
                  width: '30px', // Adjust size of the circle
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center', // Center "+" icon
                }}
              >
                <AddIcon sx={{ color: '#ffffff', fontSize: '20px' }} /> {/* White "+" icon */}
              </Box>
            </MenuItem>

            {/* "Logout" Menu Item with Exit Icon */}
            <MenuItem onClick={handleLogoutClick} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ marginRight: '8px' }}>Logout</Typography>
              <Box
                sx={{
                  backgroundColor: '#ff4d4d', // Red background for logout
                  borderRadius: '50%', // Circle shape
                  width: '30px', // Adjust size of the circle
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center', // Center "exit" icon
                }}
              >
                <ExitToAppIcon sx={{ color: '#ffffff', fontSize: '20px' }} /> {/* White "exit" icon */}
              </Box>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

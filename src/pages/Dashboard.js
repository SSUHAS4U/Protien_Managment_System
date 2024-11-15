import React, {useEffect,useState } from 'react';
import { styled, useTheme  } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle'; // Add this line
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#87CEEB',  // Sky blue color for the opened drawer
  borderBottomRightRadius: '50px',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  backgroundColor: '#87CEEB',  // Sky blue color for the closed drawer
  borderBottomRightRadius: '50px',
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#87CEEB',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 20px rgba(135, 206, 235, 0.7)',
  },
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [userName, setName] = useState('');
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken || !email) {
      navigate('/'); // Redirect to login if no token or email
    } else {
      axios.get(`http://localhost:8080/users?email=${email}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
        .then(response => {
          if (response.data.user && response.data.user.name) {
            setName(response.data.user.name); // Set the name
            sessionStorage.setItem('userName', response.data.user.name); // Store name in session
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        });
    }
  }, [navigate]);


  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userName');
    navigate('/'); // Redirect to login page after logout
  };
  
  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleFood = () => {
    navigate('/addfood');
  };

  const handleDiary = () => {
    navigate('/diary');
  };

  const handleAccount = () => {
    navigate('/account');
  };

  // Hardcoded graph data for demonstration
  const data = [
    { name: 'Jan', weight: 65, height: 170 },
    { name: 'Feb', weight: 68, height: 172 },
    { name: 'Mar', weight: 70, height: 174 },
    { name: 'Apr', weight: 72, height: 176 },
    { name: 'May', weight: 75, height: 178 },
    { name: 'Jun', weight: 77, height: 180 },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{ marginRight: 5 }, open && { display: 'none' }]}
          >
            <MenuIcon sx={{ color: 'black', fontSize: '32px' }} />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="black">
            Dashboard
          </Typography>
          {/* Logout Button in the Right Corner */}
          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ color: 'black', marginRight: 2 }}>
              Welcome, {userName}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon sx={{ color: 'black' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          {open && (
            <Typography
              variant="h6"
              sx={{
                color: 'Black',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                flexGrow: 1,
                marginLeft: open ? '-30px' : '0px',
              }}
            >
              Menu
            </Typography>
          )}
        </DrawerHeader>
        <Divider />
        <Box sx={{ flexGrow: 1 }}>
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleDashboard}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleFood}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Food" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleDiary}>
                <ListItemIcon>
                  <BookIcon />
                </ListItemIcon>
                <ListItemText primary="Diary" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={handleAccount}>
              <ListItemIcon>
                <AccountCircle /> {/* Updated this line */}
              </ListItemIcon>
              <ListItemText primary="Account" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, height: '100vh' }}>
        <DrawerHeader />

        {/* Main Content with Two Separate Graphs */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Weight Graph */}
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weight Progress
              </Typography>
              <ResponsiveContainer width="90%" height={200}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="weight" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>

          {/* Height Graph */}
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Height Progress
              </Typography>
              <ResponsiveContainer width="90%" height={200}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="height" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>
        </Box>
      </Box>
    </Box>
  );
}

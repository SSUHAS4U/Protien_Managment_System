import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
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
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import img1 from '../images/chicken.png';
import img2 from '../images/veg.png';
import img3 from '../images/salamon.png';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#87CEEB',
  borderBottomRightRadius: '50px',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  backgroundColor: '#87CEEB',
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

const foodItems = [
  {
    name: 'Grilled Chicken',
    image: img1,
    description: 'Juicy grilled chicken with herbs and spices.',
    energy: '300 kcal',
    fat: '10g',
    protein: '45g',
    carbs: '0g',
  },
  {
    name: 'Salmon Fillet',
    image: img3,
    description: 'Rich and flavorful salmon fillet with lemon zest.',
    energy: '350 kcal',
    fat: '20g',
    protein: '35g',
    carbs: '0g',
  },
  {
    name: 'Vegetable Salad',
    image: img2,
    description: 'Fresh vegetable salad with olive oil and vinegar.',
    energy: '150 kcal',
    fat: '8g',
    protein: '3g',
    carbs: '15g',
  },
];

const HoverCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 16px rgba(135, 206, 235, 0.5)', // Sky blue shadow
  },
}));

export default function AddFood() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
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
            Add Food
          </Typography>
          {/* Logout Button in the Right Corner */}
          <Box sx={{ marginLeft: 'auto' }}>
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
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Account" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, height: '100vh' }}>
        <DrawerHeader />
        {/* Food Cards */}
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            {foodItems.map((item, index) => (
              <Grid item xs={12} key={index}>
                <HoverCard>
                  <CardMedia
                    component="img"
                    sx={{ width: 150 }}
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography variant="h5">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                    <Typography variant="body2">Energy: {item.energy}</Typography>
                    <Typography variant="body2">Fat: {item.fat}</Typography>
                    <Typography variant="body2">Protein: {item.protein}</Typography>
                    <Typography variant="body2">Carbs: {item.carbs}</Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="contained" sx={{ backgroundColor: '#87CEEB', '&:hover': { backgroundColor: '#78B2D6' } }}>Add</Button>
                  </Box>
                </HoverCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

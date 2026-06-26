import React, { useEffect, useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, IconButton, Avatar, Divider, Tooltip, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import EnergySavingsLeafRoundedIcon from '@mui/icons-material/EnergySavingsLeafRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import LocalDiningRoundedIcon from '@mui/icons-material/LocalDiningRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Chatbot from './Chatbot';

const DRAWER_WIDTH = 256;

const NAV = [
  { label: 'Dashboard', icon: SpaceDashboardRoundedIcon, path: '/Dashboard' },
  { label: 'Browse Food', icon: RestaurantRoundedIcon, path: '/addfood' },
  { label: 'Recommendations', icon: AutoAwesomeRoundedIcon, path: '/Recommendations' },
  { label: 'Log Exercise', icon: FitnessCenterRoundedIcon, path: '/addexercise' },
  { label: 'Food Stats', icon: LocalDiningRoundedIcon, path: '/foodstats' },
  { label: 'Exercise Stats', icon: MonitorHeartRoundedIcon, path: '/exercisestats' },
  { label: 'Account', icon: AccountCircleRoundedIcon, path: '/account' },
];

/**
 * Shared shell for every authenticated page: consistent sidebar + topbar,
 * a single auth guard, and the NutriBot widget (so the bot only appears
 * once a user is logged in).
 */
export default function AppLayout({ title, children, maxWidth = 'lg' }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });

  // Single auth guard for the whole authenticated area.
  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken || !email) {
      navigate('/signin');
      return;
    }
    setUser({ name: sessionStorage.getItem('userName') || email.split('@')[0], email });
  }, [navigate]);

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const isActive = (path) => location.pathname.toLowerCase() === path.toLowerCase();

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.2 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#16a34a,#84cc16)', boxShadow: '0 8px 18px -8px rgba(22,163,74,.7)' }}>
          <EnergySavingsLeafRoundedIcon sx={{ color: '#fff' }} />
        </Box>
        <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 24, lineHeight: 1, background: 'linear-gradient(135deg,#15803d,#65a30d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ProteinPro
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {NAV.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{
                borderRadius: 3, mb: 0.5, py: 1.1,
                color: active ? '#fff' : 'text.primary',
                background: active ? 'linear-gradient(135deg,#16a34a,#84cc16)' : 'transparent',
                boxShadow: active ? '0 12px 24px -12px rgba(22,163,74,.6)' : 'none',
                '&:hover': { background: active ? 'linear-gradient(135deg,#15803d,#65a30d)' : '#eafce9' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: active ? '#fff' : '#16a34a' }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 800 : 600, fontSize: 15 }} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.2 }}>
        <Avatar sx={{ bgcolor: '#16a34a1a', color: '#16a34a', fontWeight: 800 }}>
          {(user.name || 'U').charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography noWrap sx={{ fontWeight: 700, fontSize: 14 }}>{user.name}</Typography>
          <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>{user.email}</Typography>
        </Box>
        <Tooltip title="Logout">
          <IconButton onClick={logout} size="small" sx={{ color: '#ef4444' }}><LogoutRoundedIcon /></IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Topbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` },
          background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(22,163,74,.12)', color: '#0f172a',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }}><MenuRoundedIcon /></IconButton>
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 26, flexGrow: 1 }}>{title}</Typography>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#16a34a', fontWeight: 800, fontSize: 16 }}>
            {(user.name || 'U').charAt(0).toUpperCase()}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop ? true : mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, borderRight: '1px solid #e6efe6', boxSizing: 'border-box' } }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main */}
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, overflowX: 'hidden', width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, pb: 8 }}>
        <Toolbar />
        <Box sx={{ maxWidth: maxWidth === false ? 'none' : { lg: 1200 }, mx: 'auto', px: { xs: 2, sm: 3 }, pt: 3 }}>
          {children}
        </Box>
      </Box>

      {/* NutriBot — only rendered inside the authenticated shell */}
      <Chatbot />
    </Box>
  );
}

import * as React from 'react';
import {
  AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem, Container, Avatar,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PeopleIcon from '@mui/icons-material/People';
import EnergySavingsLeafRoundedIcon from '@mui/icons-material/EnergySavingsLeafRounded';
import { useNavigate } from 'react-router-dom';

export default function Adminnav({ handleLogout }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const close = () => setAnchorEl(null);

  const ITEMS = [
    { label: 'View All Users', icon: <PeopleIcon fontSize="small" />, onClick: () => { close(); navigate('/admin-viewusers'); }, tint: '#2563eb' },
    { label: 'Logout', icon: <ExitToAppIcon fontSize="small" />, onClick: () => { close(); handleLogout(); }, tint: '#ef4444' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(22,163,74,0.12)', color: '#0f172a',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 70 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexGrow: 1 }} onClick={() => navigate('/admin-dashboard')}>
            <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#16a34a,#84cc16)' }}>
              <EnergySavingsLeafRoundedIcon sx={{ color: '#fff' }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 24, lineHeight: 1, background: 'linear-gradient(135deg,#15803d,#65a30d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ProteinPro
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase' }}>Admin</Typography>
            </Box>
          </Box>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Admin menu" sx={{ color: '#15803d' }}>
            <MenuRoundedIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={close}
            disableScrollLock
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ mt: 1 }}
          >
            {ITEMS.map((it) => (
              <MenuItem key={it.label} onClick={it.onClick} sx={{ display: 'flex', gap: 2, minWidth: 200, py: 1.2 }}>
                <Typography sx={{ flexGrow: 1, fontWeight: 600 }}>{it.label}</Typography>
                <Avatar sx={{ width: 30, height: 30, bgcolor: it.tint, color: '#fff' }}>{it.icon}</Avatar>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

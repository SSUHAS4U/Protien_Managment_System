import * as React from 'react';
import {
  AppBar, Box, Toolbar, Typography, Button, Menu, MenuItem, Container,
  IconButton, Drawer, List, ListItemButton, ListItemText, Divider,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import EnergySavingsLeafRoundedIcon from '@mui/icons-material/EnergySavingsLeafRounded';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
];

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const go = (href) => (window.location.href = href);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(22,163,74,0.12)',
        color: '#0f172a',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 70, gap: 2 }}>
          {/* Brand */}
          <Box
            onClick={() => go('/')}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexGrow: 1 }}
          >
            <Box
              sx={{
                width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center',
                background: 'linear-gradient(135deg,#16a34a,#84cc16)',
                boxShadow: '0 8px 18px -8px rgba(22,163,74,.7)',
              }}
            >
              <EnergySavingsLeafRoundedIcon sx={{ color: '#fff' }} />
            </Box>
            <Typography
              sx={{
                fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 26, lineHeight: 1,
                background: 'linear-gradient(135deg,#15803d,#65a30d)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}
            >
              ProteinPro
            </Typography>
          </Box>

          {/* Desktop links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {NAV_LINKS.map((l) => (
              <Button key={l.href} onClick={() => go(l.href)} sx={{ color: '#0f172a', fontWeight: 600 }}>
                {l.label}
              </Button>
            ))}
            <Button
              variant="contained"
              endIcon={<ArrowDropDownIcon />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              Sign In
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              disableScrollLock
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => go('/signin')}>User Sign In</MenuItem>
              <MenuItem onClick={() => go('/signup')}>Create Account</MenuItem>
              <Divider />
              <MenuItem onClick={() => go('/admin-signin')}>Admin Sign In</MenuItem>
            </Menu>
          </Box>

          {/* Mobile */}
          <IconButton sx={{ display: { xs: 'inline-flex', md: 'none' } }} onClick={() => setMobileOpen(true)}>
            <MenuRoundedIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <List>
            {NAV_LINKS.map((l) => (
              <ListItemButton key={l.href} onClick={() => go(l.href)}>
                <ListItemText primary={l.label} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItemButton onClick={() => go('/signin')}>
              <ListItemText primary="User Sign In" />
            </ListItemButton>
            <ListItemButton onClick={() => go('/signup')}>
              <ListItemText primary="Create Account" />
            </ListItemButton>
            <ListItemButton onClick={() => go('/admin-signin')}>
              <ListItemText primary="Admin Sign In" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

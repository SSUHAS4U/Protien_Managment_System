import React, { useEffect } from 'react';
import Adminnav from '../components/Adminnav';
import { Box, Container, Typography, Card, Grid, Button, Stack, Avatar } from '@mui/material';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  // Session guard
  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken || !username) navigate('/admin-signin');
  }, [navigate]);

  return (
    <Box>
      <Adminnav handleLogout={handleLogout} />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Hero */}
        <Box
          sx={{
            borderRadius: 5, p: { xs: 3, md: 5 }, mb: 4, color: '#fff', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg,#0f3d24,#16a34a)',
            boxShadow: '0 24px 50px -22px rgba(22,163,74,.6)',
          }}
        >
          <PeopleAltRoundedIcon sx={{ position: 'absolute', right: -8, top: -8, fontSize: 160, opacity: 0.12 }} />
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 32, md: 44 }, lineHeight: 1 }}>
            Admin Console
          </Typography>
          <Typography sx={{ opacity: 0.92, mt: 1, maxWidth: 560 }}>
            Food and recommendations are now served live from Spoonacular — no manual catalogue upkeep needed.
            Your main job here is managing the community of users.
          </Typography>
        </Box>

        {/* Action cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: '#16a34a1a', color: '#16a34a', mb: 2 }}>
                <PeopleAltRoundedIcon />
              </Avatar>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 26 }}>Manage Users</Typography>
              <Typography sx={{ color: 'text.secondary', mt: 0.5, mb: 2 }}>
                View, search and manage all registered members of ProteinPro.
              </Typography>
              <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/admin-viewusers')}>
                View all users
              </Button>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: '#fb923c1a', color: '#fb923c' }}>
                  <RestaurantMenuRoundedIcon />
                </Avatar>
                <Avatar sx={{ width: 56, height: 56, bgcolor: '#6366f11a', color: '#6366f1' }}>
                  <SmartToyRoundedIcon />
                </Avatar>
              </Stack>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 26 }}>Automated Content</Typography>
              <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
                Recipes, macros, cooking steps and filtered recommendations are powered by the Spoonacular API,
                and NutriBot handles personalised suggestions — all without admin input.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Admin;

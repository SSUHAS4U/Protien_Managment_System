import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Avatar } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import img1 from '../images/track2.jpg';

const FEATURES = [
  { icon: FilterAltRoundedIcon, title: 'Smart filters', desc: 'Browse by high-protein, high-energy, low-carb and more — instantly.', span: { xs: 12, md: 5 }, tint: '#16a34a' },
  { icon: SmartToyRoundedIcon, title: 'NutriBot AI', desc: 'Chat your cravings and goals; get tailored meals with cooking steps.', span: { xs: 12, md: 7 }, tint: '#6366f1' },
  { icon: MenuBookRoundedIcon, title: 'Step-by-step cooking', desc: 'Every dish ships with clear, numbered instructions and ingredients.', span: { xs: 12, md: 7 }, tint: '#fb923c' },
  { icon: InsightsRoundedIcon, title: 'Macro insights', desc: 'Visualise protein, energy, carbs & fat across your day.', span: { xs: 12, md: 5 }, tint: '#2563eb' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      <Navbar />

      {/* HERO — 21st.dev animated aurora */}
      <Hero />

      {/* BENTO FEATURES */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography sx={{ textAlign: 'center', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 34, md: 48 } }}>
          Everything you need to eat well
        </Typography>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 1, mb: 5, fontSize: 18 }}>
          A vibrant toolkit for discovering, cooking and tracking nutritious food.
        </Typography>
        <Grid container spacing={3}>
          {FEATURES.map((f, i) => (
            <Grid item {...f.span} key={f.title}>
              <Box
                sx={{
                  height: '100%', p: { xs: 3, md: 4 }, borderRadius: 5, bgcolor: '#fff',
                  border: '1px solid', borderColor: 'divider', position: 'relative', overflow: 'hidden',
                  transition: 'transform .25s ease, box-shadow .25s ease',
                  animation: 'pp-fade-up .5s ease both', animationDelay: `${i * 0.06}s`,
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 26px 50px -24px rgba(15,23,42,.3)' },
                }}
              >
                <Box sx={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', bgcolor: `${f.tint}12` }} />
                <Avatar sx={{ width: 56, height: 56, bgcolor: `${f.tint}1a`, color: f.tint, mb: 2 }}>
                  <f.icon />
                </Avatar>
                <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 26 }}>{f.title}</Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: 16, lineHeight: 1.6, maxWidth: 460 }}>{f.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA BAND */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            borderRadius: 7, p: { xs: 4, md: 7 }, color: '#fff', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg,#15803d,#84cc16)',
            boxShadow: '0 30px 60px -26px rgba(22,163,74,.7)',
          }}
        >
          <Box component="img" src={img1} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.14 }} />
          <Box sx={{ position: 'relative' }}>
            <RestaurantMenuRoundedIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 34, md: 50 }, lineHeight: 1 }}>
              Ready to transform your plate?
            </Typography>
            <Typography sx={{ opacity: 0.95, mt: 1.5, fontSize: 18, maxWidth: 560 }}>
              Join ProteinPro today and let NutriBot craft your next delicious, goal-crushing meal.
            </Typography>
            <Button size="large" onClick={() => navigate('/signup')} sx={{ mt: 3, bgcolor: '#fff', color: '#15803d', fontWeight: 800, '&:hover': { bgcolor: '#f0fdf4' } }} endIcon={<ArrowForwardRoundedIcon />}>
              Create your free account
            </Button>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}

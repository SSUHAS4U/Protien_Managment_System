import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Stack, Chip, Avatar } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import img1 from '../images/track2.jpg';
import img2 from '../images/eat healthy.png';
import img3 from '../images/stayfit.jpg';

const STATS = [
  { value: '5,000+', label: 'Recipes' },
  { value: '84', label: 'Nutrients tracked' },
  { value: 'AI', label: 'Powered coach' },
];

const FEATURES = [
  { icon: FilterAltRoundedIcon, title: 'Smart filters', desc: 'Browse by high-protein, high-energy, low-carb and more — instantly.', span: { xs: 12, md: 5 }, tint: '#16a34a' },
  { icon: SmartToyRoundedIcon, title: 'NutriBot AI', desc: 'Chat your cravings and goals; get tailored meals with cooking steps.', span: { xs: 12, md: 7 }, tint: '#6366f1' },
  { icon: MenuBookRoundedIcon, title: 'Step-by-step cooking', desc: 'Every dish ships with clear, numbered instructions and ingredients.', span: { xs: 12, md: 7 }, tint: '#fb923c' },
  { icon: InsightsRoundedIcon, title: 'Macro insights', desc: 'Visualise protein, energy, carbs & fat across your day.', span: { xs: 12, md: 5 }, tint: '#2563eb' },
];

function FloatCard({ icon: Icon, color, label, value, sx }) {
  return (
    <Box
      sx={{
        position: 'absolute', display: 'flex', gap: 1.2, alignItems: 'center',
        bgcolor: 'rgba(255,255,255,.92)', backdropFilter: 'blur(6px)',
        px: 2, py: 1.2, borderRadius: 3, boxShadow: '0 16px 40px -18px rgba(15,23,42,.4)',
        animation: 'pp-float 4s ease-in-out infinite', ...sx,
      }}
    >
      <Avatar sx={{ bgcolor: `${color}1a`, color, width: 38, height: 38 }}>
        <Icon fontSize="small" />
      </Avatar>
      <Box>
        <Typography sx={{ fontWeight: 800, fontFamily: "'Barlow Condensed'", fontSize: 20, lineHeight: 1 }}>{value}</Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{label}</Typography>
      </Box>
    </Box>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      <Navbar />

      {/* HERO */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip
              icon={<BoltRoundedIcon />}
              label="Your vibrant nutrition companion"
              sx={{ mb: 2, bgcolor: '#eafce9', color: '#15803d', fontWeight: 700 }}
            />
            <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 48, md: 72 }, lineHeight: 0.98 }}>
              Eat smarter.<br />
              <Box component="span" sx={{ background: 'linear-gradient(135deg,#16a34a,#84cc16)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Live stronger.
              </Box>
            </Typography>
            <Typography sx={{ fontSize: { xs: 17, md: 20 }, color: 'text.secondary', mt: 2, maxWidth: 480, lineHeight: 1.6 }}>
              Discover high-protein meals, track every macro, and let our AI coach plan and cook with you — all in one delightful place.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} sx={{ mt: 4 }}>
              <Button size="large" variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/signup')}>
                Get started — it's free
              </Button>
              <Button size="large" variant="outlined" color="primary" onClick={() => navigate('/signin')} sx={{ borderWidth: 2 }}>
                I have an account
              </Button>
            </Stack>
            <Stack direction="row" gap={4} sx={{ mt: 4 }}>
              {STATS.map((s) => (
                <Box key={s.label}>
                  <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 30, color: 'primary.main', lineHeight: 1 }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{s.label}</Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Image collage */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', height: { xs: 360, md: 460 } }}>
              <Box
                component="img"
                src={img2}
                alt="Healthy bowl"
                sx={{ position: 'absolute', top: 0, right: 0, width: '74%', height: '70%', objectFit: 'cover', borderRadius: 6, boxShadow: '0 30px 60px -24px rgba(22,163,74,.5)' }}
              />
              <Box
                component="img"
                src={img3}
                alt="Stay fit"
                sx={{ position: 'absolute', bottom: 0, left: 0, width: '52%', height: '46%', objectFit: 'cover', borderRadius: 5, border: '6px solid #fff', boxShadow: '0 24px 50px -22px rgba(15,23,42,.4)' }}
              />
              <FloatCard icon={FitnessCenterRoundedIcon} color="#6366f1" value="32g" label="Protein / meal" sx={{ top: '8%', left: '-4%' }} />
              <FloatCard icon={VerifiedRoundedIcon} color="#16a34a" value="Verified" label="Nutrition data" sx={{ bottom: '6%', right: '-2%', animationDelay: '1.2s' }} />
            </Box>
          </Grid>
        </Grid>
      </Container>

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

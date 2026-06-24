import React from 'react';
import { Box, Container, Typography, Grid, Stack, Chip, Avatar, Button, Divider } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate } from 'react-router-dom';

const WHAT_WE_DO = [
  { icon: RestaurantMenuRoundedIcon, tint: '#16a34a', title: 'Real recipes, real macros', desc: 'Thousands of dishes with verified calories, protein, carbs and fat — plus step-by-step cooking instructions.' },
  { icon: SmartToyRoundedIcon, tint: '#6366f1', title: 'An AI coach in your pocket', desc: 'NutriBot suggests meals around your taste, cravings and goals, and walks you through cooking them.' },
  { icon: InsightsRoundedIcon, tint: '#2563eb', title: 'Effortless macro tracking', desc: 'Log meals and workouts and watch your daily protein, energy and balance come to life in vivid charts.' },
  { icon: FitnessCenterRoundedIcon, tint: '#fb923c', title: 'Workouts that count', desc: 'Browse exercises with instructions and log the calories you burn, calculated from your body and effort.' },
];

const VALUES = [
  { icon: FavoriteRoundedIcon, title: 'Health first', desc: 'Every feature exists to help you eat better and feel stronger — not to chase vanity numbers.' },
  { icon: ShieldRoundedIcon, title: 'Privacy & trust', desc: 'Your data is yours. Secrets are locked down and we never sell your information.' },
  { icon: BoltRoundedIcon, title: 'Delightfully simple', desc: 'Powerful nutrition tools should feel light, fast and genuinely fun to use.' },
];

const STATS = [
  { value: '5,000+', label: 'Recipes' },
  { value: '84', label: 'Nutrients tracked' },
  { value: 'AI', label: 'Powered coaching' },
  { value: '100%', label: 'Free to start' },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <Box>
      <Navbar />

      {/* Hero */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 9 }, pb: { xs: 4, md: 6 } }}>
        <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto' }}>
          <Chip icon={<FavoriteRoundedIcon />} label="Our story" sx={{ mb: 2, bgcolor: '#eafce9', color: '#15803d', fontWeight: 700 }} />
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 40, md: 60 }, lineHeight: 1 }}>
            We make healthy eating{' '}
            <Box component="span" sx={{ background: 'linear-gradient(135deg,#16a34a,#84cc16)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              feel effortless
            </Box>
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: 17, md: 20 }, mt: 2.5, lineHeight: 1.7 }}>
            ProteinPro started with a simple frustration: tracking nutrition was tedious, and figuring out
            <em> what </em> to cook was even harder. So we built a vibrant companion that brings real recipes,
            honest macros, an AI food coach and effortless tracking together in one joyful place.
          </Typography>
          <Stack direction="row" gap={1.5} justifyContent="center" sx={{ mt: 4 }} flexWrap="wrap">
            <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/signup')}>Join ProteinPro</Button>
            <Button variant="outlined" color="primary" onClick={() => navigate('/')} sx={{ borderWidth: 2 }}>Back to home</Button>
          </Stack>
        </Box>
      </Container>

      {/* Stats band */}
      <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 } }}>
        <Box sx={{ borderRadius: 5, p: { xs: 3, md: 4 }, background: 'linear-gradient(135deg,#15803d,#84cc16)', color: '#fff', boxShadow: '0 24px 50px -24px rgba(22,163,74,.6)' }}>
          <Grid container spacing={2}>
            {STATS.map((s) => (
              <Grid item xs={6} md={3} key={s.label} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 34, md: 44 }, lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ opacity: 0.9, mt: 0.5 }}>{s.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* What we do */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography sx={{ textAlign: 'center', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 32, md: 44 } }}>What we do</Typography>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 1, mb: 4, fontSize: 18 }}>
          Four pillars that turn good intentions into delicious, healthy habits.
        </Typography>
        <Grid container spacing={3}>
          {WHAT_WE_DO.map((f, i) => (
            <Grid item xs={12} sm={6} key={f.title}>
              <Box sx={{ height: '100%', p: { xs: 3, md: 4 }, borderRadius: 5, bgcolor: '#fff', border: '1px solid', borderColor: 'divider', animation: 'pp-fade-up .5s ease both', animationDelay: `${i * 0.06}s`, transition: 'transform .25s ease, box-shadow .25s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 26px 50px -24px rgba(15,23,42,.28)' } }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: `${f.tint}1a`, color: f.tint, mb: 2 }}><f.icon /></Avatar>
                <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 24 }}>{f.title}</Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: 16, lineHeight: 1.6 }}>{f.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Values */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ borderRadius: 6, p: { xs: 3, md: 5 }, bgcolor: '#f7fdf6', border: '1px solid', borderColor: 'divider' }}>
          <Typography sx={{ textAlign: 'center', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 30, md: 40 }, mb: 1 }}>What we stand for</Typography>
          <Divider sx={{ maxWidth: 80, mx: 'auto', borderColor: 'primary.main', borderBottomWidth: 3, mb: 4 }} />
          <Grid container spacing={3}>
            {VALUES.map((v) => (
              <Grid item xs={12} md={4} key={v.title} sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1.5, background: 'linear-gradient(135deg,#16a34a,#84cc16)', color: '#fff' }}><v.icon /></Avatar>
                <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 22 }}>{v.title}</Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5, lineHeight: 1.6 }}>{v.desc}</Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <Box sx={{ borderRadius: 7, p: { xs: 4, md: 6 }, textAlign: 'center', color: '#fff', background: 'linear-gradient(135deg,#2563eb,#22d3ee)', boxShadow: '0 30px 60px -26px rgba(37,99,235,.6)' }}>
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: { xs: 32, md: 46 }, lineHeight: 1 }}>
            Ready to eat smarter with us?
          </Typography>
          <Typography sx={{ opacity: 0.95, mt: 1.5, fontSize: 18 }}>Create a free account and let NutriBot plan your next great meal.</Typography>
          <Button size="large" onClick={() => navigate('/signup')} endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 3, bgcolor: '#fff', color: '#1d4ed8', fontWeight: 800, '&:hover': { bgcolor: '#eff6ff' } }}>
            Get started — it's free
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}

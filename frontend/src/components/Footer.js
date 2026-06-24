import React from 'react';
import { Box, Container, Grid, Typography, Stack, IconButton, Divider } from '@mui/material';
import EnergySavingsLeafRoundedIcon from '@mui/icons-material/EnergySavingsLeafRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';

const COLS = [
  { title: 'Product', links: [['Recommendations', '/Recommendations'], ['Dashboard', '/Dashboard'], ['About', '/about']] },
  { title: 'Account', links: [['Sign In', '/signin'], ['Create Account', '/signup'], ['Admin', '/admin-signin']] },
  { title: 'Legal', links: [['Terms', '/terms'], ['Privacy', '/privacy'], ['Contact', '/contact']] },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 8, color: '#e7f4ea', background: 'linear-gradient(135deg,#0f3d24,#14532d)' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#16a34a,#84cc16)' }}>
                <EnergySavingsLeafRoundedIcon sx={{ color: '#fff' }} />
              </Box>
              <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 28 }}>ProteinPro</Typography>
            </Stack>
            <Typography sx={{ opacity: 0.8, maxWidth: 320, lineHeight: 1.6 }}>
              Your vibrant nutrition companion — discover high-protein meals, track macros, and cook smarter with AI.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {[InstagramIcon, TwitterIcon, GitHubIcon].map((Icon, i) => (
                <IconButton key={i} sx={{ color: '#e7f4ea', bgcolor: 'rgba(255,255,255,.08)', '&:hover': { bgcolor: 'rgba(255,255,255,.18)' } }}>
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>
          {COLS.map((col) => (
            <Grid item xs={6} md={Math.floor(8 / COLS.length)} key={col.title}>
              <Typography sx={{ fontWeight: 700, fontFamily: "'Barlow Condensed'", fontSize: 20, mb: 1.5 }}>{col.title}</Typography>
              <Stack spacing={1}>
                {col.links.map(([label, href]) => (
                  <Box
                    key={label}
                    component="a"
                    href={href}
                    sx={{ color: '#cfe8d6', textDecoration: 'none', fontSize: 15, '&:hover': { color: '#fff' } }}
                  >
                    {label}
                  </Box>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,.12)' }} />
        <Typography sx={{ textAlign: 'center', opacity: 0.7, fontSize: 14 }}>
          © {new Date().getFullYear()} ProteinPro. Crafted with care for healthier eating.
        </Typography>
      </Container>
    </Box>
  );
}

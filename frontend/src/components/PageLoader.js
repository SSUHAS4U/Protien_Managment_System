import React from 'react';
import { Box, Typography } from '@mui/material';

/** Branded full-screen loading state with an animated pulsing logo dot. */
export default function PageLoader({ label = 'Loading goodness…' }) {
  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #16a34a, #84cc16)',
              animation: 'pp-float 0.9s ease-in-out infinite',
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </Box>
      <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>{label}</Typography>
    </Box>
  );
}

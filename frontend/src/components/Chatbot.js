import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Paper, IconButton, TextField, Typography, Avatar, Fab, Zoom, Chip, Stack,
} from '@mui/material';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import axios from 'axios';
import { API_BASE } from '../config/api';

const SUGGESTIONS = [
  'High-protein vegetarian dinner',
  'Quick low-carb breakfast',
  'Spicy chicken, under 500 kcal',
  'How do I cook salmon?',
];

const GREETING = {
  role: 'assistant',
  content:
    "Hi! I'm **NutriBot** 🥗 — tell me your taste, craving or goal (e.g. *high-protein*, *low-carb*, *vegetarian*) and I'll suggest meals with cooking steps.",
};

// Tiny, safe markdown-ish renderer (bold + line breaks only).
function renderText(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const payload = {
        messages: next
          .filter((m) => m.role !== 'system')
          .map((m) => ({ role: m.role, content: m.content })),
      };
      const res = await axios.post(`${API_BASE}/api/chat`, payload);
      setMessages((m) => [...m, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      const msg =
        err.response?.data?.hint ||
        err.response?.data?.error ||
        'Sorry, I had trouble connecting. Please try again.';
      setMessages((m) => [...m, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <Zoom in={!open}>
        <Fab
          onClick={() => setOpen(true)}
          aria-label="Open NutriBot food assistant"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1400,
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #16a34a, #84cc16)',
            color: '#fff',
            boxShadow: '0 16px 36px -10px rgba(22,163,74,.6)',
            '&:hover': { background: 'linear-gradient(135deg, #15803d, #65a30d)' },
          }}
        >
          <SmartToyRoundedIcon sx={{ fontSize: 30 }} />
        </Fab>
      </Zoom>

      {/* Panel */}
      <Zoom in={open}>
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: { xs: 0, sm: 24 },
            right: { xs: 0, sm: 24 },
            zIndex: 1400,
            width: { xs: '100%', sm: 380 },
            height: { xs: '80vh', sm: 560 },
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: { xs: '20px 20px 0 0', sm: '24px' },
            border: '1px solid #e6efe6',
            boxShadow: '0 30px 70px -20px rgba(15,23,42,.45)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              background: 'linear-gradient(135deg, #16a34a, #84cc16)',
              color: '#fff',
            }}
          >
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,.2)' }}>
              <SmartToyRoundedIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: 800, fontFamily: "'Barlow Condensed'", fontSize: 22, lineHeight: 1 }}>
                NutriBot
              </Typography>
              <Typography sx={{ fontSize: 12, opacity: 0.9 }}>AI food &amp; recipe assistant</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} sx={{ color: '#fff' }} aria-label="Close chat">
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            ref={scrollRef}
            sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#f7fdf6', display: 'flex', flexDirection: 'column', gap: 1.25 }}
          >
            {messages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  px: 1.75,
                  py: 1.25,
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#16a34a,#84cc16)' : '#fff',
                  color: m.role === 'user' ? '#fff' : '#0f172a',
                  border: m.role === 'user' ? 'none' : '1px solid #e6efe6',
                  whiteSpace: 'pre-wrap',
                  fontSize: 14.5,
                  lineHeight: 1.5,
                  animation: 'pp-pop .2s ease',
                }}
              >
                {renderText(m.content)}
              </Box>
            ))}
            {loading && (
              <Box sx={{ alignSelf: 'flex-start', display: 'flex', gap: 0.6, px: 2, py: 1.5, bgcolor: '#fff', borderRadius: '16px', border: '1px solid #e6efe6' }}>
                {[0, 1, 2].map((i) => (
                  <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#16a34a', animation: 'pp-float .9s ease-in-out infinite', animationDelay: `${i * 0.12}s` }} />
                ))}
              </Box>
            )}
            {messages.length <= 1 && (
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                {SUGGESTIONS.map((s) => (
                  <Chip
                    key={s}
                    icon={<RestaurantRoundedIcon />}
                    label={s}
                    onClick={() => send(s)}
                    sx={{ bgcolor: '#fff', border: '1px solid #cdeccd', '&:hover': { bgcolor: '#eafce9' } }}
                  />
                ))}
              </Stack>
            )}
          </Box>

          {/* Composer */}
          <Box sx={{ p: 1.5, display: 'flex', gap: 1, borderTop: '1px solid #e6efe6', bgcolor: '#fff' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask for a meal or recipe…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <IconButton
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              sx={{
                background: 'linear-gradient(135deg,#16a34a,#84cc16)',
                color: '#fff',
                '&:hover': { background: 'linear-gradient(135deg,#15803d,#65a30d)' },
                '&.Mui-disabled': { background: '#cbd5d1', color: '#fff' },
              }}
            >
              <SendRoundedIcon />
            </IconButton>
          </Box>
        </Paper>
      </Zoom>
    </>
  );
}

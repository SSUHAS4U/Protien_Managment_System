import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Apple, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 21st.dev "variant 1" animated aurora hero, adapted to ProteinPro
// (JavaScript, brand copy, real CTAs). Tailwind utilities + framer-motion.

function AnimatedAuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50" />
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-400/30 via-green-400/30 to-transparent rounded-full blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-lime-400/30 via-green-400/30 to-transparent rounded-full blur-3xl"
        animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-emerald-300/20 via-green-300/20 to-transparent rounded-full blur-2xl"
        animate={{ x: [0, -50, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function FloatingCard({ icon: Icon, title, value, subtitle, delay = 0, position }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, type: 'spring', stiffness: 100 }}
      className={`absolute ${position} hidden lg:block z-20`}
    >
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="backdrop-blur-xl bg-white/40 border border-white/60 shadow-2xl rounded-2xl p-6 w-64">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 text-white">
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-emerald-900/70">{title}</span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{value}</div>
            <div className="text-xs text-emerald-700/60 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {subtitle}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => { if (isInView) controls.start('visible'); }, [isInView, controls]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } };

  return (
    <div ref={ref} className="relative min-h-[92vh] w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      <AnimatedAuroraBackground />

      <FloatingCard icon={Apple} title="Protein / meal" value="32g" subtitle="goal-crushing" delay={1.2} position="top-24 left-8 xl:left-20" />
      <FloatingCard icon={Zap} title="AI meal ideas" value="∞" subtitle="tailored to you" delay={1.4} position="top-40 right-8 xl:right-20" />

      <div className="relative z-10 flex items-center justify-center min-h-[92vh] px-4 sm:px-6 lg:px-8 py-16">
        <motion.div variants={containerVariants} initial="hidden" animate={controls} className="max-w-5xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-6">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-emerald-200/50 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Your vibrant nutrition companion</span>
            </motion.div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-[0.95] font-display">
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 bg-clip-text text-transparent inline-block">Eat smarter.</span>
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent inline-block">Live stronger.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg sm:text-xl md:text-2xl text-emerald-900/70 mb-10 max-w-3xl mx-auto leading-relaxed">
            Discover high-protein meals, track every macro, and let our AI coach plan and cook with you — all in one delightful place.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 border-0 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-xl shadow-emerald-500/30 px-8 py-4 text-lg rounded-full font-bold transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" /> Get started — it's free <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/signin')}
              className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/60 hover:bg-white/80 text-emerald-700 border-2 border-emerald-300/60 hover:border-emerald-400 shadow-lg px-8 py-4 text-lg rounded-full font-bold transition-all duration-300 cursor-pointer"
            >
              <TrendingUp className="w-5 h-5" /> I have an account
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-emerald-700/70">
            {['100% free to start', 'AI-powered coaching', '5,000+ recipes'].map((t, i) => (
              <div key={t} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${['bg-emerald-500', 'bg-green-500', 'bg-lime-500'][i]}`} />
                <span>{t}</span>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1 }} className="mt-16">
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 blur-3xl rounded-3xl" />
              <div className="relative backdrop-blur-xl bg-white/50 border border-white/60 shadow-2xl p-8 rounded-3xl">
                <div className="grid grid-cols-3 gap-6">
                  {[['5,000+', 'Recipes'], ['84', 'Nutrients tracked'], ['AI', 'Powered coach']].map(([v, l]) => (
                    <div key={l} className="text-center">
                      <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-1 font-display">{v}</div>
                      <div className="text-xs sm:text-sm text-emerald-700/70">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useInView, useAnimation } from 'framer-motion';

// Premium animated stat card (21st.dev-derived), adapted to the light brand.
// Props: label, value, unit, color (hex), Icon (lucide/any), progress (0-100), delay.

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { damping: 30, stiffness: 120 });

  useEffect(() => { if (inView) spring.set(value || 0); }, [inView, value, spring]);
  useEffect(() => spring.on('change', (v) => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString(); }), [spring]);

  return <span ref={ref}>0</span>;
}

function ProgressRing({ progress = 0, color, size = 60 }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, progress) / 100) * circ;
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) controls.start({ strokeDashoffset: offset, transition: { duration: 1.3, ease: 'easeOut' } });
  }, [inView, offset, controls]);

  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 64 64" className="-rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6" opacity="0.15" />
      <motion.circle
        cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={controls}
        style={{ filter: `drop-shadow(0 0 6px ${color}55)` }}
      />
    </svg>
  );
}

export default function StatCard({ label, value = 0, unit = '', color = '#16a34a', Icon, progress = null, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-5 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.25)]"
    >
      <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full blur-2xl opacity-20" style={{ background: color }} />

      <div className="relative z-10 flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 10px 22px -10px ${color}` }}
        >
          {Icon ? <Icon className="h-6 w-6" strokeWidth={2.4} /> : null}
        </div>
        {progress != null && (
          <div className="relative">
            <ProgressRing progress={progress} color={color} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-bold" style={{ color }}>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-4 flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          <AnimatedNumber value={value} />
        </span>
        {unit ? <span className="text-base font-semibold text-slate-400">{unit}</span> : null}
      </div>
      <div className="relative z-10 mt-0.5 text-sm font-medium text-slate-500">{label}</div>

      <div className="absolute bottom-0 left-0 right-0 h-1 opacity-70" style={{ background: `linear-gradient(90deg, ${color}, ${color}55)` }} />
    </motion.div>
  );
}

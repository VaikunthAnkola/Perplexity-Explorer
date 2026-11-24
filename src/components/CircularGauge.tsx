import React from 'react';
import { motion } from 'framer-motion';

interface CircularGaugeProps {
  value: number;
  max?: number;
  label?: string;
  size?: number;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  max = 100,
  label = 'Perplexity',
  size = 200
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const displayVal = Math.max(1, value);
  const normalizedScore = Math.min(1, Math.log10(displayVal) / Math.log10(max));
  const strokeDashoffset = circumference - normalizedScore * circumference * 0.75; // 270 degree arc

  let color = '#0D9488'; // teal (confident)
  let statusText = 'Very Predictable';
  if (value > 60) {
    color = '#E11D48'; // rose (high surprise)
    statusText = 'Highly Surprised';
  } else if (value > 20) {
    color = '#D97706'; // amber
    statusText = 'Moderate Surprise';
  } else if (value > 8) {
    color = '#0284C7'; // sky blue
    statusText = 'Typical Fluent Text';
  }

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-135"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Track with light / dark reactivity */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-cyan-100 dark:text-slate-800/90"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />

          {/* Animated Value Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${color}50)`
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-900/60 dark:text-cyan-400 font-mono">
            {label}
          </span>
          <motion.div
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans mt-0.5"
          >
            {value.toFixed(2)}
          </motion.div>
          <span
            className="text-xs px-2.5 py-0.5 mt-1 rounded-full font-semibold border"
            style={{ 
              backgroundColor: `${color}15`, 
              color,
              borderColor: `${color}35`
            }}
          >
            {statusText}
          </span>
        </div>
      </div>

      <div className="mt-2 text-center text-xs text-slate-600 dark:text-slate-400 max-w-[220px]">
        Equivalent to randomly guessing between <strong className="text-cyan-800 dark:text-cyan-300 font-bold">~{Math.round(value)}</strong> equally likely words.
      </div>
    </div>
  );
};

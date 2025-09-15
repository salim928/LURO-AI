module.exports = function ({ addBase }) {
  addBase({
    ':root': {
      '--color-bg-0': '#07060a',
      '--color-bg-1': 'linear-gradient(135deg, #0b1226 0%, #0f1724 40%, #1f1147 100%)',
      '--color-surface': 'rgba(255,255,255,0.02)',
      '--color-on-surface': '#e6eef8',
      '--color-accent': '#4f46e5',
      '--color-accent-600': '#3730a3',
      '--color-accent-400': '#7c3aed',
      '--color-muted': 'rgba(230,238,248,0.6)',
    }
  });
};

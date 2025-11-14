module.exports = {
  presets: [
    'next/babel', // Next.js preset includes JSX support
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
    }],
  ],
};


// next.config.js
const withPlugins = require("next-compose-plugins");

const withLess = require("next-with-less");

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
  devIndicators: {
    buildActivity: false,
  },
};

const plugins = [
  [
    withLess,
    {
      lessLoaderOptions: {
        /* ... */
      },
    },
  ],
  nextConfig,
];

module.exports = withPlugins(plugins, {
  /* ... */
});

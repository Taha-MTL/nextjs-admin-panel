/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(?:js|ts)$/,
      include: [/node_modules\/(undici)/],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["next/babel"],
            plugins: [
              "@babel/plugin-transform-private-property-in-object",
              "@babel/plugin-transform-private-methods",
            ],
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;

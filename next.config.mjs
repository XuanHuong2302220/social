/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(wav|mp3|ogg|flac)$/,
      type: 'asset/resource', // Ensures the file is handled as a resource
    });
    return config;
  },
};

export default nextConfig;

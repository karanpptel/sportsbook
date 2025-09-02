/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // experimental: {
  //   serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  // },
}

module.exports = nextConfig
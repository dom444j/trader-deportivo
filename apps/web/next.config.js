/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router está habilitado por defecto en Next.js 14+
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Configuración para CSS global
  compiler: {
    styledComponents: false,
  },
}

module.exports = nextConfig
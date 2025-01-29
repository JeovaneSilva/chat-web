/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'official-hinda-jeovanesilva-b7372ca0.koyeb.app', // Substituindo pelo seu domínio de backend
        port: '', // Deixe vazio se não usar uma porta específica
      },
    ],
    // remotePatterns: [
    //   {
    //     protocol: 'http',
    //     hostname: 'localhost', // Substituindo pelo seu domínio de backend
    //     port: '3333', // Deixe vazio se não usar uma porta específica
    //   },
    // ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3333', // Porta onde o NestJS está rodando
          pathname: '/uploads/profile_pictures/**', // Caminho para as imagens
        },
      ],
    },
  };
  
  export default nextConfig;
  
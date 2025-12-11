import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },

  async redirects() {
    return [
      {
        source: "/cmd",
        destination: "/command",
        permanent: true, // 301 리다이렉션 (SEO에 반영됨)
      },
      {
        source: "/login",
        destination: "/user/login",
        permanent: true, // 301 리다이렉션 (SEO에 반영됨)
      },
      {
        source: "/mypage",
        destination: "/user/mypage",
        permanent: true, // 301 리다이렉션 (SEO에 반영됨)
      },
      {
        source: "/register",
        destination: "/user/register",
        permanent: true, // 301 리다이렉션 (SEO에 반영됨)
      },
      {
        source: "/verifyEmail",
        destination: "/user/verifyEmail",
        permanent: true, // 301 리다이렉션 (SEO에 반영됨)
      },
      {
        source: "/bookPrice",
        destination: "/price/book",
        permanent: true, // 301 리다이렉션 (SEO에 반영됨)
      },
      {
        source: "/jewelPrice",
        destination: "/price/jewel",
        permanent: true, // 301 리다이렉션 (SEO에 반영됨)
      },
      {
        source: "/efficiency",
        destination: "/efficiency/package",
        permanent: true, // 301 리다이렉션 (SEO에 반영됨)
      }
    ];
  },
  
};

export default nextConfig;

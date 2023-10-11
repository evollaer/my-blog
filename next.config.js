/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    newNextLinkBehavior: false,
  },
}

const removeImports=require('next-remove-imports')()


module.exports = removeImports(nextConfig)

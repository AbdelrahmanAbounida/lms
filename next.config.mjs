/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "storage.googleapis.com",
      "lh1.googleusercontent.com",
      "lh2.googleusercontent.com",
      "lh3.googleusercontent.com",
      "lh4.googleusercontent.com",
      "lh5.googleusercontent.com",
      "lh6.googleusercontent.com",
      "avatars.githubusercontent.com",
      "api-production.s3.amazonaws.com",
      "s3.amazonaws.com",
      `lms-nextjs.s3.us-east-1.amazonaws.com`,
      "learning-management-system-app.s3.ca-central-1.amazonaws.com",
      `learning-management-system-app.s3.us-east-1.amazonaws.com`,
      `learning-management-system-app.s3.us-west-1.amazonaws.com`,
      `learning-management-system-app.s3.eu-west-1.amazonaws.com`,
      `learning-management-system-app.s3.ap-southeast-1.amazonaws.com`,
      `learning-management-system-app.s3.ap-southeast-2.amazonaws.com`,
    ],
  },
};

export default nextConfig;

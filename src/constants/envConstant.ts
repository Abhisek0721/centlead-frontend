// Single source for all env vars. Never use process.env directly outside this file.
const envConstant = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000',
};

export default envConstant;

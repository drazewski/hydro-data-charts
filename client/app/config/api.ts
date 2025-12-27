import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_VITE_BASE_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_VITE_BASE_URL is not set. Please provide API base URL (e.g. http://localhost:8080)");
}

export default axios.create({
    baseURL: `${baseURL}/api`,
    timeout: 6000,
    headers: {
        'Content-type': 'application/json',
    },
});

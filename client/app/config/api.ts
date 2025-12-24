import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_VITE_BASE_URL;

export default axios.create({
    baseURL: `${baseURL}/api`,
    timeout: 6000,
    headers: {
        'Content-type': 'application/json',
    },
});

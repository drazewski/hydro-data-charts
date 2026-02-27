import axios from 'axios';

export default axios.create({
    baseURL: '/api',
    timeout: 6000,
    headers: {
        'Content-type': 'application/json',
    },
});

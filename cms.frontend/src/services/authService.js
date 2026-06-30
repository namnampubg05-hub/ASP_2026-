import axiosClient from '../api/axiosClient';

const authService = {
    register: (data) => {
        const url = '/Auth/CustomerRegister';
        return axiosClient.post(url, data);
    },

    login: (data) => {
        const url = '/Auth/CustomerLogin';
        return axiosClient.post(url, data);
    }
};

export default authService;

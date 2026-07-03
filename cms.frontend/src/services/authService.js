import axiosClient from '../api/axiosClient';

const authService = {
    register: (data) => {
        const url = '/Auth/CustomerRegister';
        return axiosClient.post(url, data);
    },

    login: (data) => {
        const url = '/Auth/CustomerLogin';
        return axiosClient.post(url, data);
    },

    forgotPassword: (data) => {
        const url = '/Auth/ForgotPassword';
        return axiosClient.post(url, data);
    },

    resetPassword: (data) => {
        const url = '/Auth/ResetPassword';
        return axiosClient.post(url, data);
    }
};

export default authService;

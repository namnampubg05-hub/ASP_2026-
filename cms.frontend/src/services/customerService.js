import axiosClient from '../api/axiosClient';

const customerService = {
    getById: (id) => {
        return axiosClient.get(`/Customers/${id}`);
    },

    update: (id, data) => {
        return axiosClient.put(`/Customers/${id}`, data);
    },

    changePassword: (id, data) => {
        return axiosClient.put(`/Customers/${id}/password`, data);
    }
};

export default customerService;

import axiosClient from '../api/axiosClient';

const orderService = {
    getByCustomer: (customerId) => {
        return axiosClient.get(`/Orders/customer/${customerId}`);
    },

    create: (data) => {
        return axiosClient.post('/Orders', data);
    }
};

export default orderService;

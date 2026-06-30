import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: () => {
        const url = '/Products';
        return axiosClient.get(url);
    },

    getById: (id) => {
        const url = `/Products/${id}`;
        return axiosClient.get(url);
    },

    getByCategoryId: (categoryId) => {
        const url = `/Products/category/${categoryId}`;
        return axiosClient.get(url);
    },

    search: (keyword) => {
        const url = `/Products/search?keyword=${encodeURIComponent(keyword)}`;
        return axiosClient.get(url);
    }
};

export default productService;

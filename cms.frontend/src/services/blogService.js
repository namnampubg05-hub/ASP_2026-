import axiosClient from '../api/axiosClient';

const blogService = {
    // Hàm gọi API lấy danh mục các chủ đề bài viết
    getBlogCategories: () => {
        const url = '/Categories'; // Khớp với Route quản lý chuyên mục tin tức ở Backend
        return axiosClient.get(url);
    },

    getAllPosts: () => {
        const url = '/Posts';
        return axiosClient.get(url);
    },

    getById: (id) => {
        const url = `/Posts/${id}`;
        return axiosClient.get(url);
    }
};

export default blogService;

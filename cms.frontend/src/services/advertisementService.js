import axiosClient from '../api/axiosClient';

const advertisementService = {
    getAll: () => {
        const url = '/Advertisements';
        return axiosClient.get(url);
    }
};

export default advertisementService;

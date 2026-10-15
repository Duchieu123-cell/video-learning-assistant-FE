import { axiosClient } from './axiosClient.js'

export const userApi = {
    register: (data) => {
        return axiosClient.post('/register', data)
    }
}
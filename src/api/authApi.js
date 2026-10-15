import { axiosClient } from "./axiosClient.js";

export const authApi = {
    login: (formData) => {
        const data = new URLSearchParams();
        data.append("username", formData.email);
        data.append("password", formData.password);
        return axiosClient.post("/auth/token", data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    },
    logout: () => {
        return axiosClient.post("/auth/logout");
    }
}
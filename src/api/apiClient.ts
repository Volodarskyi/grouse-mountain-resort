import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const apiClient = axios.create({
    baseURL: baseURL,

    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },

    timeout: 25000,
});

import axios from "axios";

const baseURL = 'placeholderForBaseURL';

export const apiClient = axios.create({
    baseURL: baseURL,

    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Nesto-Candidat": "Artem",
    },

    timeout: 25000,
});
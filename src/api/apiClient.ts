import axios from "axios";

export const apiClient = axios.create({
    baseURL: "https://nesto-fe-exam.vercel.app/api",

    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Nesto-Candidat": "Artem",
    },

    timeout: 25000,
});
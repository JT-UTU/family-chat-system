import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token')
    }),

    getters: {
        getUser: (state) => state.user,
        isLoggedIn: (state) => state.isAuthenticated
    },

    actions: {
        async login(credentials) {
            try {
                const response = await axios.post('/api/auth/login', credentials);
                const { token, user } = response.data;

                this.user = user;
                this.token = token;
                this.isAuthenticated = true;

                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                return { success: true };
            } catch (error) {
                return {
                    success: false,
                    message: error.response && error.response.data && error.response.data.message || '登录失败，请稍后再试'
                };
            }
        },

        async register(userData) {
            try {
                const response = await axios.post('/api/auth/register', userData);
                return { success: true, data: response.data };
            } catch (error) {
                return {
                    success: false,
                    message: error.response && error.response.data && error.response.data.message || '注册失败，请稍后再试'
                };
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;

            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    }
});
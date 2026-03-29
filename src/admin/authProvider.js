import API_BASE_URL from '../config';

const authProvider = {
    login: async ({ username, password }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                body: JSON.stringify({ email: username, password }),
                headers: new Headers({ 'Content-Type': 'application/json' }),
            });
            if (response.status < 200 || response.status >= 300) {
                const error = await response.json();
                throw new Error(error.message || response.statusText);
            }
            const { authToken } = await response.json();
            localStorage.setItem('admin_auth', authToken);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },
    logout: () => {
        localStorage.removeItem('admin_auth');
        return Promise.resolve();
    },
    checkAuth: () => {
        return localStorage.getItem('admin_auth') ? Promise.resolve() : Promise.reject();
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('admin_auth');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getIdentity: () => {
        try {
            const id = localStorage.getItem('admin_auth');
            return Promise.resolve({ id, fullName: id });
        } catch (error) {
            return Promise.reject(error);
        }
    },
    getPermissions: () => Promise.resolve(),
};

export default authProvider;

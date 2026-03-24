const authProvider = {
    login: ({ username, password }) => {
        if (username === 'alishan1@gmail.com' && password === '123456') {
            localStorage.setItem('admin_auth', username);
            return Promise.resolve();
        }
        return Promise.reject(new Error('Invalid admin credentials'));
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

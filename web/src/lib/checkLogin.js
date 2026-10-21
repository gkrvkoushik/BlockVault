const checkLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const expiration = parseInt(localStorage.getItem('tokenExpiration'), 10);
        if (isNaN(expiration) || expiration < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiration');
            return false;
        }
        return true;
    }
    return false;
}
export default checkLogin;

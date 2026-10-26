module.exports = (req, res, next) => {
    // req.body must have username or email and password
    if (!req.body) {
        return res.status(400).send({ code: 400, message: 'Request body is missing' });
    }

    const { email, password } = req.body;

    if (!email) {
        return res.status(400).send({ code: 400, message: 'email or username is required' });
    }
    if (!password) {
        return res.status(400).send({ code: 400, message: 'password is required' });
    }
    next();
}
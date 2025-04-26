const checkAuth = (req, res, next) => {
    console.log('checkAuth сработал');
    next();
};

module.exports = { checkAuth };

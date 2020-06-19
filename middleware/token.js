const jwt = require('jsonwebtoken');
const serect = 'gjtkyz';
module.exports = (userinfo) => {
    const token = jwt.sign({
        user: userinfo.user,
        id: userinfo.id
    }, serect, {expiresIn: '1h'});
    return token;
};
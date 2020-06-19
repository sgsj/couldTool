const jwt = require('jsonwebtoken');
const serect = 'gjtkyz';
module.exports = (token) => {
    if (token) {
        let tk = token.split(' ')[1];
        let decoded = jwt.decode(tk, serect);
        return decoded;
    }
};
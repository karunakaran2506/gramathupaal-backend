const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(8);
const { secret } = require('./constants');
const jwt = require('jsonwebtoken');
const Users = require('../model/users');

async function jwtToken(token) {
    let result;
    try {
        result = jwt.verify(token, secret);
    } catch (error) {
    }
    let { id } = result;
    let findUser = await Users.findById(id);
    return findUser;
}

const verifyAdminToken = async (token) => {
    let result = await jwtToken(token);
    return result.role === 'Superadmin' ? true : false;
}

const verifyToken = async (token) => {
    let result = await jwtToken(token);
    return result.role === 'Storeclerk' ? true : false;
}

const getUser = async (token) => {
    let result = await jwtToken(token);
    return result;
}

const signToken = (id) => {
    return jwt.sign({ id: id }, secret, { expiresIn: '10d' })
}

const checkPassword = (password1, password2) => {
    return bcrypt.compareSync(password1, password2)
}

const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt)
}

const generateOrderId = async () => {
    let findDate = new Date();
    let date = findDate.getDate();
    let month = findDate.getMonth();
    let year = findDate.getFullYear();
    let otp = 12;
    let orderId = 'GPORD' + year + month + date + otp;
    return orderId;
}

module.exports = {
    verifyAdminToken,
    signToken,
    checkPassword,
    hashPassword,
    verifyToken,
    getUser,
    generateOrderId
}
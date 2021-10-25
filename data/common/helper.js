const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(8);
const secret = require('./constants').secret;
const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const otpGenerator = require('otp-generator');

const verifyAdminToken = async (token) =>{
    let {id} = jwt.verify(token, secret);
    let findUser = await Users.findById(id);
    return findUser.role === 'Superadmin' ? true : false;
}

const verifyToken = async (token) =>{
    let {id} = jwt.verify(token, secret);
    let findUser = await Users.findById(id);
    return findUser ? true : false;
}

const getUser = async (token) =>{
    let {id} = jwt.verify(token, secret);
    let findUser = await Users.findById(id);
    return findUser;
}

const signToken = (id) => {
    return jwt.sign({ id: id }, secret, { expiresIn: '10d' })
}

const checkPassword = (password1, password2) => {
    return bcrypt.compareSync( password1, password2)
}

const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt)
}

const generateOtp = async (length, data) => {
    let otp = await otpGenerator.generate(length, data)
    return otp;
}

module.exports = {
    verifyAdminToken,
    signToken,
    checkPassword,
    hashPassword,
    verifyToken,
    generateOtp,
    getUser
}
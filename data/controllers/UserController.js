const Users = require('../model/users');
const helper = require('../common/helper');

const UserLogin = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.phone && req.body.password;

        if (validParams) {

            try {
                // to check whether user exist
                const findUser = await Users.findOne({ phone: req.body.phone });

                if (findUser) {
                    // compare the password using bcrypt
                    let passwordCheck = helper.checkPassword(req.body.password, findUser.password);

                    if (passwordCheck) {

                        let token = helper.signToken(findUser.id);

                        resolve({ status: 200, success: true, user: findUser, token: token, message : 'Login Successful'})
                    }
                    else {
                        reject({ status: 403, success: false, message: 'Incorrect Password' })
                    }
                }

                else {
                    reject({ status: 200, success: false, message: 'User does not exist' });
                }
            } catch (error) {
                reject({ status: 200, success: false, message: error.message })
            }
        }
        else {
            reject({ status: 200, success: false, message: 'Provide Valid data' })
        }
    });

    promise

    .then(function (data) {
        res.status(data.status).send({ success: data.success, message: data.message, user : data.user, token : data.token});
    })
    .catch(function (error) {
        res.status(error.status).send({ success: error.success, message: error.message });
    })

}

const UserSignUp = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        // main code
        try {

            let validParams = req.body.phone && req.body.name && req.body.password && req.body.role;

            if (validParams) {

                let findUser = await Users.findOne({ phone: req.body.phone })

                if (findUser) {
                    reject({ status: 200, success: false, message: 'User already exist' })
                }

                else {

                    let hashedPassword = helper.hashPassword(req.body.password);
                    let createUser = await Users.create({
                        name: req.body.name,
                        phone: req.body.phone,
                        email: req.body.email,
                        password: hashedPassword,
                        role: req.body.role,
                        store: req.body.store
                    }).then(async (data) => {
                        resolve({ status: 200, success: true, message: 'User created successfully' })
                    })
                }

            }
            else {
                reject({ status: 200, success: false, message: 'Provide all necessary fields' })
            }

        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
        }

    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

module.exports = {
    UserLogin,
    UserSignUp
};
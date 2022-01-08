const Users = require('../model/users');
const Session = require('../model/userSession');
const Order = require('../model/orders');
const helper = require('../common/helper');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const uploadImg = multer({ storage: storage, fileFilter: fileFilter }).single('image');

const UserLogin = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.phone && req.body.password;

        if (validParams) {

            try {
                // to check whether user exist
                const findUser = await Users.findOne({ phone: req.body.phone, role: 'Storeclerk', isdeleted: 0 });

                if (findUser) {
                    // compare the password using bcrypt
                    let passwordCheck = helper.checkPassword(req.body.password, findUser.password);

                    if (passwordCheck) {

                        let token = helper.signToken(findUser.id);

                        resolve({ status: 200, success: true, user: findUser, token: token, message: 'Login Successful' })
                    }
                    else {
                        reject({ status: 200, success: false, message: 'Incorrect Password' })
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
            res.status(data.status).send({ success: data.success, message: data.message, user: data.user, token: data.token });
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
                        store: req.body.store,
                        adhar: req.body.adhar
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

const UserSignupWithImage = async function (req, res) {

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
                    await Users.create({
                        name: req.body.name,
                        phone: req.body.phone,
                        email: req.body.email,
                        userimage: req.file.path,
                        password: hashedPassword,
                        role: req.body.role,
                        store: req.body.store,
                        adhar: req.body.adhar
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

const AdminLogin = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.phone && req.body.password;

        if (validParams) {

            try {
                // to check whether user exist
                const findUser = await Users.findOne({ phone: req.body.phone, role: 'Superadmin' });

                if (findUser) {
                    // compare the password using bcrypt
                    let passwordCheck = helper.checkPassword(req.body.password, findUser.password);

                    if (passwordCheck) {

                        let token = helper.signToken(findUser.id);

                        resolve({ status: 200, success: true, user: findUser, token: token, message: 'Login Successful' })
                    }
                    else {
                        reject({ status: 200, success: false, message: 'Incorrect Password' })
                    }
                }

                else {
                    reject({ status: 200, success: false, message: 'Admin does not exist' });
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
            res.status(data.status).send({ success: data.success, message: data.message, user: data.user, token: data.token });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const ViewUsersbyStore = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        const validParams = req.body.store && req.headers.token;
        const token = req.headers.token;

        if (validParams) {

            const checkAccess = await helper.verifyAdminToken(token);

            if (checkAccess) {
                try {
                    const result = await Users.find({ store: req.body.store, role: 'Storeclerk', isdeleted: 0 })
                        .populate('store')

                    resolve({ status: 200, success: true, users: result, message: 'Users list' })
                } catch (error) {
                    reject({ status: 200, success: false, message: error.message })
                }
            } else {
                reject({ status: 200, success: false, message: 'Admin does not exist' });
            }
        }
        else {
            reject({ status: 200, success: false, message: 'Provide Valid data' })
        }
    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, users: data.users });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const ViewUserDetails = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        const validParams = req.body.user && req.headers.token;
        const token = req.headers.token;

        if (validParams) {

            const checkAccess = await helper.verifyAdminToken(token);

            if (checkAccess) {
                try {
                    const result = await Users.findById(req.body.user).populate('store')

                    let newdate = new Date();
                    const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
                    const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));
                    const orders = await Order.find({ user: req.body.user, createdat: { $gte: start, $lt: end } })
                        .sort({ createdat: -1 })

                    const sessionIn = await Session.find({ user: req.body.user, sessiontype: 'in', entrydate: { $gte: start, $lt: end } })
                        .sort({ entrydate: 1 })
                        .limit(1)

                    const sessionOut = await Session.find({ user: req.body.user, sessiontype: 'out', entrydate: { $gte: start, $lt: end } })
                        .sort({ entrydate: -1 })
                        .limit(1)

                    const session = {
                        entrydate: sessionIn.length ? sessionIn[0].entrydate : '',
                        sessionIn: sessionIn.length ? sessionIn[0].sessiontime : '',
                        sessionOut: sessionOut.length ? sessionOut[0].sessiontime : ''
                    }
                    resolve({ status: 200, success: true, user: result, message: 'Users list', orders, session })
                } catch (error) {
                    reject({ status: 200, success: false, message: error.message })
                }
            } else {
                reject({ status: 200, success: false, message: 'Admin does not exist' });
            }
        }
        else {
            reject({ status: 200, success: false, message: 'Provide Valid data' })
        }
    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, user: data.user, orders: data.orders, session: data.session });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const EditUser = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        // main code
        try {

            let validParams = req.body.user && req.headers.token;

            if (validParams) {

                let bodyParams = {
                    name: req.body.name,
                    email: req.body.email,
                    store: req.body.store,
                    adhar: req.body.adhar,
                    userimage: req.file.path,
                };

                if (req.body.password) {
                    let hashedPassword = helper.hashPassword(req.body.password);
                    bodyParams = {
                        ...bodyParams,
                        password: hashedPassword
                    }
                }

                await Users.updateOne({ _id: req.body.user }, {
                    $set: bodyParams
                }).then(async (data) => {
                    resolve({ status: 200, success: true, message: 'User edited successfully' })
                })

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

const EditUserWithoutImage = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        // main code
        try {

            let validParams = req.body.user && req.headers.token;

            if (validParams) {

                let bodyParams = {
                    name: req.body.name,
                    email: req.body.email,
                    store: req.body.store,
                    adhar: req.body.adhar,
                };

                if (req.body.password) {
                    let hashedPassword = helper.hashPassword(req.body.password);
                    bodyParams = {
                        ...bodyParams,
                        password: hashedPassword
                    }
                }

                await Users.updateOne({ _id: req.body.user }, {
                    $set: bodyParams
                }).then(async (data) => {
                    resolve({ status: 200, success: true, message: 'User edited successfully' })
                })

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

const ViewUserPastSessions = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        const validParams = req.body.user && req.body.date && req.headers.token;
        const token = req.headers.token;

        if (validParams) {

            const checkAccess = await helper.verifyAdminToken(token);

            if (checkAccess) {
                try {

                    let newdate = req.body.date;
                    const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
                    const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

                    const sessionIn = await Session.find({ user: req.body.user, sessiontype: 'in', entrydate: { $gte: start, $lt: end } })
                        .sort({ entrydate: 1 })
                        .limit(1)

                    const sessionOut = await Session.find({ user: req.body.user, sessiontype: 'out', entrydate: { $gte: start, $lt: end } })
                        .sort({ entrydate: -1 })
                        .limit(1)

                    const session = {
                        entrydate: sessionIn.length ? sessionIn[0].entrydate : '',
                        sessionIn: sessionIn.length ? sessionIn[0].sessiontime : '',
                        sessionOut: sessionIn.length ? sessionOut[0].sessiontime : ''
                    }
                    resolve({ status: 200, success: true, message: 'Users list', session })
                } catch (error) {
                    reject({ status: 200, success: false, message: error.message })
                }
            } else {
                reject({ status: 200, success: false, message: 'Admin does not exist' });
            }
        }
        else {
            reject({ status: 200, success: false, message: 'Provide Valid data' })
        }
    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, session: data.session });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const DeleteUser = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        // main code
        try {

            let validParams = req.body.user && req.headers.token;

            if (validParams) {

                await Users.updateOne({ _id: req.body.user }, {
                    $set: {
                        isdeleted: 1
                    }
                }).then(async (data) => {
                    resolve({ status: 200, success: true, message: 'User deleted successfully' })
                })

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

const CustomerSignUp = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {

            let validParams = req.body.phone && req.body.name;

            if (validParams) {

                let findUser = await Users.findOne({ phone: req.body.phone })

                if (findUser) {
                    reject({ status: 200, success: false, message: 'User already exist' })
                }

                else {

                    let hashedPassword = helper.hashPassword('123456');
                    let createUser = await Users.create({
                        name: req.body.name,
                        phone: req.body.phone,
                        password: hashedPassword,
                        role: 'Customer',
                        store: req.body.store
                    }).then(async (data) => {
                        resolve({ status: 200, success: true, message: 'Customer created successfully' })
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

const ViewCustomerbyStore = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {
            const result = await Users.find({ store: req.headers.store, role: 'Customer' })

            resolve({ status: 200, success: true, customer: result, message: 'Customer list' })
        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
        }
    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, customer: data.customer });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

module.exports = {
    uploadImg,
    UserLogin,
    UserSignUp,
    UserSignupWithImage,
    AdminLogin,
    ViewUsersbyStore,
    ViewUserDetails,
    EditUser,
    EditUserWithoutImage,
    ViewUserPastSessions,
    DeleteUser,
    CustomerSignUp,
    ViewCustomerbyStore
};
const helper = require('../common/helper');
const Milkcard = require('../model/milkcard');
const Milkcardentry = require('../model/milkcardentry');
const Milkcardhistory = require('../model/milkcardhistory');
const Users = require('../model/users');

const CreateMilkcard = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.name && req.body.price && req.body.validity && req.body.product;

        if (validParams) {
            try {
                let findDate = new Date();
                let milkcard = await Milkcard.create({
                    name: req.body.name,
                    price: req.body.price,
                    validity: req.body.validity,
                    product: req.body.product,
                    createdat: findDate
                }).then((data) => {
                    resolve({ status: 200, success: true, message: 'Milkcard created successfully' })
                })
            } catch (error) {
                reject({ status: 200, success: false, message: error.message })
            }
        }
        else {
            reject({ status: 200, success: false, message: 'Provide all necessary fields' })
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

const ListMilkcard = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {
            let product = await Milkcard.find({}).populate('product')
                .then((data) => {
                    resolve({ status: 200, success: true, message: 'Milkcard list', milkcard: data })
                })
        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
        }

    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, milkcard: data.milkcard });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const CreateMilkcardEntry = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.customer && req.body.validity && req.body.milkcard;

        if (validParams) {
            try {

                let customer;
                let findDate = new Date();
                const user = await helper.getUser(req.headers.token);

                if (req.body.customer.name && req.body.customer.phone) {

                    let findCustomer = await Users.findOne({ phone: req.body.customer.phone })

                    if (findCustomer) {
                        reject({ status: 200, success: false, message: 'Phone number already exist' })
                    } else {
                        let hashedPassword = helper.hashPassword('123456');
                        let createUser = await Users.create({
                            name: req.body.customer.name,
                            phone: req.body.customer.phone,
                            password: hashedPassword,
                            role: 'Customer',
                            store: req.body.store,
                            createdat: findDate,
                        }).then(async (data) => {
                            customer = data._id;
                        })
                    }
                } else if (req.body.customer.id) {
                    customer = req.body.customer.id;
                } else {
                    reject({ status: 200, success: false, message: 'Provide all customer details' })
                }

                const milkcardhistory = await Milkcardhistory.create({
                    customer,
                    milkcard: req.body.milkcard,
                    price: req.body.price,
                    paymentMethod: req.body.paymentMethod,
                    store: req.body.store,
                    soldby: user,
                    createdat: findDate
                })

                const result = await Milkcardentry.findOne({ customer, milkcard: req.body.milkcard })

                if (result) {
                    const updatedValidity = Number(result.validity) + Number(req.body.validity);
                    await Milkcardentry.findByIdAndUpdate(result._id,
                        { validity: updatedValidity },
                        { new: true, useFindAndModify: false }
                    ).then((data) => {
                        resolve({ status: 200, success: true, message: 'Milkcard entry created successfully' })
                    })
                } else {
                    let milkcard = await Milkcardentry.create({
                        customer,
                        validity: req.body.validity,
                        milkcard: req.body.milkcard,
                        createdat: findDate
                    }).then((data) => {
                        resolve({ status: 200, success: true, message: 'Milkcard entry created successfully' })
                    })
                }
            } catch (error) {
                reject({ status: 200, success: false, message: error.message })
            }
        }
        else {
            reject({ status: 200, success: false, message: 'Provide all necessary fields' })
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

const ListMilkcardEntrybyCustomer = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {
            let product = await Milkcardentry.find({ customer: req.body.customer }).populate('milkcard')
                .then((data) => {
                    resolve({ status: 200, success: true, message: 'Milkcard entry list', entry: data })
                })
        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
        }

    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, entry: data.entry });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const ListMilkcardHistorybyStore = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {

            let newdate = req.body.date;
            const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
            const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

            let product = await Milkcardhistory.find({ store: req.body.store, createdat: { $gte: start, $lt: end } })
                .populate('milkcard')
                .populate('soldby')
                .populate('customer')
                .then((data) => {
                    resolve({ status: 200, success: true, message: 'Milkcard history list', history: data })
                })
        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
        }

    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, history: data.history });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

module.exports = {
    CreateMilkcard,
    ListMilkcard,
    CreateMilkcardEntry,
    ListMilkcardEntrybyCustomer,
    ListMilkcardHistorybyStore
}
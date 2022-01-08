const helper = require('../common/helper');
const Milkcard = require('../model/milkcard');
const Milkcardentry = require('../model/milkcardentry');
const Users = require('../model/users');

const CreateMilkcard = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.name && req.body.price && req.body.validity && req.body.product;

        if (validParams) {
            try {
                let milkcard = await Milkcard.create({
                    name: req.body.name,
                    price: req.body.price,
                    validity: req.body.validity,
                    product: req.body.product,
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
                            store: req.body.store
                        }).then(async (data) => {
                            customer = data._id;
                        })
                    }
                } else if (req.body.customer.id) {
                    customer = req.body.customer.id;
                } else {
                    reject({ status: 200, success: false, message: 'Provide all customer details' })
                }

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
                        customer: req.body.customer,
                        validity: req.body.validity,
                        milkcard: req.body.milkcard
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

module.exports = {
    CreateMilkcard,
    ListMilkcard,
    CreateMilkcardEntry,
    ListMilkcardEntrybyCustomer
}
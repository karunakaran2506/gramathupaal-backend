const ProductToken = require('../model/producttoken');
const Users = require('../model/users');
const helper = require('../common/helper');

const CreateProductToken = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.customer && req.body.quantity && req.body.store && req.body.product;

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

                const result = await ProductToken.findOne({ customer, product: req.body.product })

                if (result) {
                    const updatedQuantity = Number(result.quantity) + Number(req.body.quantity);
                    await ProductToken.findByIdAndUpdate(result._id,
                        { quantity: updatedQuantity },
                        { new: true, useFindAndModify: false }
                    ).then((data) => {
                        resolve({ status: 200, success: true, message: 'Product Token created successfully' })
                    })
                } else {
                    let token = await ProductToken.create({
                        customer,
                        quantity: req.body.quantity,
                        product: req.body.product,
                        store: req.body.store
                    }).then((data) => {
                        resolve({ status: 200, success: true, message: 'Product Token created successfully' })
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

const ListProductTokenbyStore = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {
            let product = await ProductToken.find({ store: req.body.store }).populate('product')
                .then((data) => {
                    resolve({ status: 200, success: true, message: 'Product token list', token: data })
                })
        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
        }

    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, token: data.token });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const ListProductTokenbyCustomer = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {
            let product = await ProductToken.find({ customer: req.body.customer }).populate('product')
                .then((data) => {
                    resolve({ status: 200, success: true, message: 'Product Token list', token: data })
                })
        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
        }

    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, token: data.token });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

module.exports = {
    CreateProductToken,
    ListProductTokenbyStore,
    ListProductTokenbyCustomer
}
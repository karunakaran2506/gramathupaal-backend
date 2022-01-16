const helper = require('../common/helper');
const Subscriptionpack = require('../model/subscriptionpack');
const Subscriptionorders = require('../model/subscriptionorders');
const Deliveryavailablity = require('../model/deliveryavailablity');
const Deliveryentry = require('../model/deliveryentry');
const Users = require('../model/users');

const CreateSubscriptionpack = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.name && req.body.price && req.body.validity && req.body.product;

        if (validParams) {
            try {
                let findDate = new Date();
                let subscriptionpack = await Subscriptionpack.create({
                    name: req.body.name,
                    price: req.body.price,
                    validity: req.body.validity,
                    product: req.body.product,
                    createdat: findDate
                }).then((data) => {
                    resolve({ status: 200, success: true, message: 'Subscriptionpack created successfully' })
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

const ListSubscriptionpack = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {
            let product = await Subscriptionpack.find({}).populate('product')
                .then((data) => {
                    resolve({ status: 200, success: true, message: 'Subscription pack list', subscriptionpack: data })
                })
        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
        }

    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, subscriptionpack: data.subscriptionpack });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const CreateSubscriptionorder = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.customer && req.body.validity && req.body.subscriptionpack && req.body.deliveryman;

        if (validParams) {
            try {

                let customer;
                let findDate = new Date();

                const result = await Subscriptionorders.findOne({ customer, subscriptionpack: req.body.subscriptionpack })

                if (result) {
                    const updatedValidity = Number(result.validity) + Number(req.body.validity);
                    await Subscriptionorders.findByIdAndUpdate(result._id,
                        { validity: updatedValidity },
                        { new: true, useFindAndModify: false }
                    ).then((data) => {
                        resolve({ status: 200, success: true, message: 'Subscription order created successfully' })
                    })
                } else {
                    let subscriptionpackorder = await Subscriptionorders.create({
                        customer: req.body.customer,
                        deliveryman: req.body.deliveryman,
                        customeraddress: req.body.customeraddress,
                        validity: req.body.validity,
                        store: req.body.store,
                        subscriptionpack: req.body.subscriptionpack,
                        createdat: findDate
                    }).then((data) => {
                        resolve({ status: 200, success: true, message: 'Subscription order created successfully' })
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

const ListSubscriptionorderbyCustomer = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {
            let product = await Subscriptionorders.find({ customer: req.body.customer }).populate('subscriptionpack')
                .then((data) => {
                    resolve({ status: 200, success: true, message: 'Subscription order list', order: data })
                })
        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
        }

    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, order: data.order });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const ListSubscriptionorderbyStore = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {
            let product = await Subscriptionorders.find({ store: req.body.store })
                .populate('subscriptionpack', 'name validity')
                .populate('customer', 'name phone')
                .populate('customeraddress')
                .populate('deliveryman', 'name phone')
                .then((data) => {
                    resolve({ status: 200, success: true, message: 'Subscription order list', order: data })
                })
        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
        }

    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, order: data.order });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const CreateDeliveryavailablity = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.entrydate && req.body.subscriptionpackorder;

        if (validParams) {
            try {
                let findDate = new Date();
                let subscriptionpack = await Deliveryavailablity.create({
                    subscriptionpackorder: req.body.subscriptionpackorder,
                    entrydate: req.body.entrydate,
                    availablity: req.body.availablity,
                    comments: req.body.comments,
                    createdat: findDate
                }).then((data) => {
                    resolve({ status: 200, success: true, message: 'Delivery availablity created successfully' })
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

const ListordersbyDeliveryman = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {

            let newdate = new Date();
            const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
            const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

            const user = await helper.getUser(req.headers.token);
            await Subscriptionorders.find({ deliveryman: user, validity: { $gt: 0 } })
                .select('_id subscriptionpack customer customeraddress')
                .populate({
                    path: 'subscriptionpack',
                    select: 'name',
                    populate: {
                        path: 'product',
                        select: 'name quantity unit'
                    }
                })
                .populate('customer', 'name phone')
                .populate('customeraddress')
                .then(async (data) => {
                    let result = [];
                    for (let i = 0; i < data.length; i++) {
                        const order = data[i];

                        const deliveryEntry = await Deliveryentry.find({ subscriptionpackorder: order._id, entrydate: { $gte: start, $lt: end } })
                        const isPending = deliveryEntry.length ? false : true;
                        const isDelivered = deliveryEntry.length ? deliveryEntry[0].isdelivered : false;

                        const availablity = await Deliveryavailablity.find({ subscriptionpackorder: order._id, entrydate: { $gte: start, $lt: end } })
                        const isAvailable = availablity.length ? availablity[0].availablity : true;

                        let object = {
                            _id: order._id,
                            subscriptionpack: order.subscriptionpack,
                            customer: order.customer,
                            customeraddress: order.customeraddress,
                            isDelivered,
                            isPending,
                            isAvailable
                        };
                        result.push(object);

                    }
                    resolve({ status: 200, success: true, message: 'Delivery order list', order: result })
                })
        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
        }

    });

    promise

        .then(function (data) {
            res.status(data.status).send({ success: data.success, message: data.message, order: data.order });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const CreateDeliveryEntry = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.subscriptionpackorder;

        if (validParams) {
            try {

                let findDate = new Date();
                const user = await helper.getUser(req.headers.token);

                const result = await Subscriptionorders.findById(req.body.subscriptionpackorder)

                const createDeliveryEntry = async () => {
                    await Deliveryentry.create({
                        subscriptionpackorder: req.body.subscriptionpackorder,
                        isdelivered: req.body.isdelivered,
                        entrydate: findDate,
                        createdat: findDate,
                        deliveredby: user
                    }).then((data) => {
                        resolve({ status: 200, success: true, message: 'Deliver entry created successfully' })
                    })
                }

                if (req.body.isdelivered) {
                    const updatedValidity = Number(result.validity) - 1;
                    await Subscriptionorders.findByIdAndUpdate(result._id,
                        { validity: updatedValidity },
                        { new: true, useFindAndModify: false }
                    ).then((data) => {
                        createDeliveryEntry();

                        resolve({ status: 200, success: true, message: 'Deliver entry created successfully' })
                    })
                } else {
                    createDeliveryEntry();
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

module.exports = {
    CreateSubscriptionpack,
    ListSubscriptionpack,
    CreateSubscriptionorder,
    ListSubscriptionorderbyCustomer,
    ListSubscriptionorderbyStore,
    CreateDeliveryavailablity,
    ListordersbyDeliveryman,
    CreateDeliveryEntry
}
const Order = require('../model/orders');
const Orderitems = require('../model/orderitems');
const helper = require('../common/helper');

const PlaceOrder = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let checkAccess = helper.verifyToken(req.headers.token);
        if (checkAccess) {
            try {

                let orderid = 'GPORD' + '2020' + '10' + '25';

                console.log('orderid', orderid);

                let order = await Order.create({
                    name: req.body.name,
                    orderid: orderid,
                    store: req.body.store,
                    subtotal: req.body.subtotal,
                    totalamount: req.body.totalamount,
                }).then(async (data) => {
                    console.log('data', data);

                    let orderitems = [];

                    for (let i = 0; i < req.body.orderitems.length; i++) {
                        let orderitem = await Orderitems.create({
                            quantity: req.body.orderitems[i].quantity,
                            totalamount: req.body.orderitems[i].totalamount,
                            product: req.body.orderitems[i].product,
                            order: data._id
                        })
                        orderitems.push(orderitem._id);
                    }

                    await Order.findByIdAndUpdate(data._id,
                        { orderitems: orderitems },
                        { new: true, useFindAndModify: false }
                    )
                    resolve({ status: 200, success: true, message: 'Order Placed successfully' })
                })

            } catch (error) {
                reject({ status: 200, success: false, message: error.message })
            }
        }
        else {
            reject({ status: 200, success: false, message: 'No access to proceed this action' })
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

const ListOrders = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store;

        if (validParams) {
            try {
                let orders = await Order.find({ store: req.body.store })
                    .populate({
                        path: 'orderitems',
                        select: 'product',
                        populate: {
                            path: 'product'
                        }
                    })
                    .then((data) => {
                        resolve({ status: 200, success: true, message: 'Order list', orders: data })
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
            res.status(data.status).send({ success: data.success, message: data.message, orders: data.orders });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

module.exports = {
    PlaceOrder,
    ListOrders
}
const helper = require('../common/helper');
const Milksupply = require('../model/milksupply');

const MilkSupplyEntry = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.quantity && req.body.deliveryman && req.body.product && req.body.store;

        if (validParams) {
            try {
                let findDate = new Date();
                let milksupply = await Milksupply.create({
                    quantity: req.body.quantity,
                    deliveryman: req.body.deliveryman,
                    store: req.body.store,
                    product: req.body.product,
                    entrydate: findDate,
                    createdat: findDate
                }).then((data) => {
                    resolve({ status: 200, success: true, message: 'Milksupply entry created successfully' })
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

const ListTodayMilkSupplies = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {

            let newdate = new Date();
            const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
            const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

            const milkentry = await Milksupply.find({ store: req.body.store, entrydate: { $gte: start, $lt: end } })
                .select('quantity product entrydate deliveryman')
                .populate('product', 'name quantity unit milktype')
                .populate('deliveryman', 'name phone store')
                .sort({ deliveryman: -1 })
                .then((data) => {
                    resolve({ status: 200, success: true, message: 'Milk supply entry list', entry: data })
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

const GetMilkSupplybyDeliveryman = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {

            let newdate = new Date();
            const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
            const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));
            const user = await helper.getUser(req.headers.token);
            const milkentry = await Milksupply.find({ deliveryman: user, entrydate: { $gte: start, $lt: end } })
                .select('quantity product')
                .populate('product', 'name quantity unit milktype')
                .sort({ deliveryman: -1 })
                .then((data) => {
                    resolve({ status: 200, success: true, message: 'Milk supply entry list', entry: data })
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
    MilkSupplyEntry,
    ListTodayMilkSupplies,
    GetMilkSupplybyDeliveryman
}
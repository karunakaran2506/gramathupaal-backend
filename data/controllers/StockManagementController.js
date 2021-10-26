const Stock = require('../model/stockmanagement');
const helper = require('../common/helper');

const SaveStockEntry = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.date && req.body.product && req.body.quantity && req.body.store && req.body.type && req.headers.token;

        if (validParams) {

            let token = req.headers.token;

            let checkAccess = await helper.verifyToken(token);
            let user = await helper.getUser(token);
            if (checkAccess) {
                try {
                    let result = await Stock.create({
                        product : req.body.product,
                        store: req.body.store,
                        stocktype: 'in',
                        quantity : req.body.quantity,
                        producttype : req.body.type,
                        entrydate : req.body.date
                    }).then((data) => {
                        resolve({ status: 200, success: true, message: 'Entry created successfully' })
                    })
                } catch (error) {
                    reject({ status: 200, success: false, message: error.message })
                }
            }
            else {
                reject({ status: 200, success: false, message: 'No access to proceed this action' })
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

const ListStockEntries = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store && req.body.date;

        if (validParams) {
            try {

                let newdate = req.body.date;
                const start = new Date(new Date(newdate).setUTCHours(0, 0, 0, 0));
                const end = new Date(new Date(newdate).setUTCHours(23, 59, 59, 999));
                let entries = await Stock.find({ store: req.body.store, entrydate: { $gte: start, $lt: end } }).populate('product')
                .then((data) => {
                        resolve({ status: 200, success: true, message: 'Entries list', entries: data })
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
            res.status(data.status).send({ success: data.success, message: data.message, entries: data.entries });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

module.exports = {
    SaveStockEntry,
    ListStockEntries
}
const Store = require('../model/store');
const helper = require('../common/helper');

const CreateStore = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.name && req.body.location && req.headers.token;

        if (validParams) {

            let checkAccess = await helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

                    let newStore = await Store.create({
                        name: req.body.name,
                        location: req.body.location,
                        email: req.body.email,
                        createdat: new Date()
                    }).then((data) => {
                        resolve({ status: 200, success: true, message: "Store created successfully" })
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

const ListStores = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let checkAccess = helper.verifyAdminToken(req.headers.token);
        if (checkAccess) {
            try {
                let stores = await Store.find({})
                resolve({ status: 200, success: true, message: "Stores list", stores: stores })

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
            res.status(data.status).send({ success: data.success, message: data.message, stores: data.stores });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

module.exports = {
    CreateStore,
    ListStores
}
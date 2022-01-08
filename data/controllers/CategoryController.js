const Category = require('../model/category');
const helper = require('../common/helper');

const CreateCategory = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store && req.body.name && req.headers.token;

        if (validParams) {

            let checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

                    let category = await Category.create({
                        name: req.body.name,
                        store: req.body.store
                    }).then((data) => {
                        resolve({ status: 200, success: true, message: 'Category created successfully' })
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

const ListCategory = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store;

        if (validParams) {
            try {
                let category = await Category.find({ store: req.body.store })
                    .then((data) => {
                        resolve({ status: 200, success: true, message: 'Category list', category : data })
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
            res.status(data.status).send({ success: data.success, message: data.message, category: data.category });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

module.exports = {
    CreateCategory,
    ListCategory
}
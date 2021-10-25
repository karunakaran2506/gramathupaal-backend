const Product = require('../model/product');
const helper = require('../common/helper');

const CreateProduct = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store && req.body.category && req.headers.token;

        if (validParams) {

            let checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

                    let product = await Product.create({
                        name: req.body.name,
                        category: req.body.category,
                        image: req.body.image,
                        type: req.body.type,
                        quantity: req.body.quantity,
                        unit: req.body.unit,
                        price: req.body.price,
                        store: req.body.store,
                    }).then((data) => {
                        resolve({ status: 200, success: true, message: 'Product created successfully' })
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

const ListProduct = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store;

        if (validParams) {
            try {
                let product = await Product.find({ store: req.body.store })
                    .then((data) => {
                        resolve({ status: 200, success: true, message: 'Product list', product : data })
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
            res.status(data.status).send({ success: data.success, message: data.message, product: data.product });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

module.exports = {
    CreateProduct,
    ListProduct
}
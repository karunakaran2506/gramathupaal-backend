const Product = require('../model/product');
const helper = require('../common/helper');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadImg = multer({ storage: storage, fileFilter: fileFilter }).single('image');

const CreateProduct = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store && req.body.category && req.headers.token;

        if (validParams) {

            let checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

                    let findDate = new Date();

                    let product = await Product.create({
                        name: req.body.name,
                        category: req.body.category,
                        image: req.file.path,
                        type: req.body.type,
                        quantity: req.body.quantity,
                        milktype: req.body.milktype,
                        unit: req.body.unit,
                        price: req.body.price,
                        store: req.body.store,
                        createdat: findDate
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
                let product = await Product.find({ store: req.body.store }).populate('category')
                product.sort(function (a, b) {
                    var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                    if (nameA < nameB) //sort string ascending
                        return -1
                    if (nameA > nameB)
                        return 1
                    return 0 //default return value (no sorting)
                })
                resolve({ status: 200, success: true, message: 'Product list', product })

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

const EditProduct = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token && req.body.product;

        if (ValidParams) {
            try {
                let checkAccess = helper.verifyAdminToken(req.headers.token);

                if (checkAccess) {
                    try {
                        await Product.updateOne(

                            { _id: req.body.product },
                            {
                                $set: {
                                    name: req.body.name,
                                    category: req.body.category,
                                    image: req.file.path,
                                    type: req.body.type,
                                    quantity: req.body.quantity,
                                    unit: req.body.unit,
                                    price: req.body.price,
                                    store: req.body.store,
                                    milktype: req.body.milktype,
                                }
                            })

                        resolve({ success: true, message: 'Product edited successfully' })
                    } catch (error) {
                        reject({ success: false, message: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No access found' })
                }
            }
            catch {
                reject({ success: false, message: 'Invalid token found' })
            }
        }
        else {
            reject({ success: false, message: 'No valid token' })
        }

    });

    promise

        .then((data) => {
            console.log(data.message)
            res.send({ success: data.success, message: data.message });
        })
        .catch((error) => {
            console.log(error);
            console.log(error.message);
            res.send({ success: error.success, message: error.message });
        })

}

const EditProductwithoutImage = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token && req.body.product;

        if (ValidParams) {
            try {
                let checkAccess = helper.verifyAdminToken(req.headers.token);

                if (checkAccess) {
                    try {
                        await Product.updateOne(
                            { _id: req.body.product },
                            {
                                $set: {
                                    name: req.body.name,
                                    category: req.body.category,
                                    type: req.body.type,
                                    quantity: req.body.quantity,
                                    unit: req.body.unit,
                                    price: req.body.price,
                                    store: req.body.store,
                                    milktype: req.body.milktype,
                                }
                            })

                        resolve({ success: true, message: 'Product edited successfully' })
                    } catch (error) {
                        reject({ success: false, message: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No vendor found' })
                }
            }
            catch {
                reject({ success: false, message: 'Invalid token found' })
            }
        }
        else {
            reject({ success: false, message: 'No valid token' })
        }

    });

    promise

        .then((data) => {
            res.send({ success: data.success, message: data.message });
        })
        .catch((error) => {
            res.send({ success: error.success, message: error.message });
        })

}

module.exports = {
    uploadImg,
    CreateProduct,
    ListProduct,
    EditProduct,
    EditProductwithoutImage
}
const Medicine = require('../model/medicine');
const MedicineStock = require('../model/medicinestock');
const helper = require('../common/helper');

const CreateMedicine = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store && req.body.name && req.body.category && req.headers.token;

        if (validParams) {

            let checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

                    let findDate = new Date();

                    await Medicine.create({
                        name: req.body.name,
                        category: req.body.category,
                        store: req.body.store,
                        createdat: findDate
                    }).then((data) => {
                        resolve({ status: 200, success: true, message: 'Medicine created successfully' })
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

const ListMedicine = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store;

        if (validParams) {
            try {
                await Medicine.find({ store: req.body.store })
                    .then((data) => {
                        resolve({ status: 200, success: true, message: 'Medicine list', medicine: data })
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
            res.status(data.status).send({ success: data.success, message: data.message, medicine: data.medicine });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const AddMedicineStock = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store && req.body.medicine && req.body.quantity && req.body.stocktype && req.body.entrydate && req.headers.token;

        if (validParams) {

            let checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {
                    let findDate = new Date();
                    await MedicineStock.create({
                        store: req.body.store,
                        medicine: req.body.medicine,
                        quantity: req.body.quantity,
                        stocktype: req.body.stocktype,
                        entrydate: req.body.entrydate,
                        createdat: findDate
                    }).then((data) => {
                        resolve({ status: 200, success: true, message: 'Medicine stock added successfully' })
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

const ViewMedicineStock = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store;

        if (validParams) {
            try {
                const entries = [];
                const medicineList = await Medicine.find({ store: req.body.store }).select('name')

                for (let i = 0; i < medicineList.length; i++) {
                    let totalStockIn = 0;
                    let totalStockOut = 0;
                    await MedicineStock.aggregate([
                        {
                            $match: { stocktype: "in", medicine: medicineList[i]._id },
                        },
                        {
                            $group: {
                                _id: 1,
                                sum: { $sum: "$quantity" },
                            },
                        },
                    ]).then((data) => {
                        let quantity = 0;
                        if (data.length) {
                            quantity = data[0].sum + quantity;
                        }
                        totalStockIn = quantity;
                    });

                    await MedicineStock.aggregate([
                        {
                            $match: { stocktype: "out", medicine: medicineList[i]._id },
                        },
                        {
                            $group: {
                                _id: 1,
                                sum: { $sum: "$quantity" },
                            },
                        },
                    ]).then((data) => {
                        let quantity = 0;
                        if (data.length) {
                            quantity = data[0].sum + quantity;
                        }
                        totalStockOut = quantity;
                    });

                    let data = {
                        medicine: medicineList[i],
                        totalStockIn,
                        totalStockOut
                    };
                    entries.push(data);
                }
                resolve({
                    status: 200,
                    success: true,
                    message: "Medical Stock list",
                    entries,
                });
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
    CreateMedicine,
    ListMedicine,
    AddMedicineStock,
    ViewMedicineStock
}
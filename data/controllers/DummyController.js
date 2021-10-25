const helper = require('../common/helper');

const DummyFunctionWithoutAccess = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.phone && req.body.name && req.body.password && req.body.role;

        if (validParams) {
            try {

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

const DummyFunctionWithNoParams = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {

        } catch (error) {
            reject({ status: 200, success: false, message: error.message })
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

const DummyFunctionWithAccess = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.name && req.body.location && req.headers.token;

        if (validParams) {

            let checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

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
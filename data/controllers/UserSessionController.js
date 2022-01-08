const helper = require('../common/helper');
const Session = require('../model/userSession');

const CreateSession = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        const validParams = req.body.store && req.headers.token;

        if (validParams) {

            const findDate = new Date();
            const findTime = findDate.toLocaleTimeString();
            const token = req.headers.token;
            const checkAccess = await helper.verifyToken(token);
            const user = await helper.getUser(token);

            if (checkAccess) {
                try {
                    await Session.create({
                        entrydate: new Date(),
                        sessiontime: findTime,
                        sessiontype: req.body.sessiontype,
                        user : user._id,
                        store: req.body.store,
                    })
                    resolve({ status: 200, success: false, message: 'Session created successfully' })
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

const ListSessionbyUser = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.headers.token;

        if (validParams) {

            const checkAccess = helper.verifyToken(req.headers.token);
            const findDate = new Date();
            const user = helper.getUser(token);

            if (checkAccess) {
                try {
                    const sessions = await Session.find({ user, entrydate: findDate })
                    resolve({ status: 200, success: false, message: 'Session List', sessions })
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
            res.status(data.status).send({ success: data.success, message: data.message, sessions : data.sessions});
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const ListSessionbyStore = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store && req.body.sessionout && req.headers.token;

        if (validParams) {

            const checkAccess = helper.verifyAdminToken(req.headers.token);
            const findDate = new Date();

            if (checkAccess) {
                try {
                    const sessions = await Session.find({ user: req.body.store, entrydate : findDate})
                    .populate('user')
                    resolve({ status: 200, success: false, message: 'Session List', sessions })
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
            res.status(data.status).send({ success: data.success, message: data.message, sessions : data.sessions});
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

module.exports = {
    CreateSession,
    ListSessionbyUser,
    ListSessionbyStore
}
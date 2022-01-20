const Leads = require('../model/leads');
const helper = require('../common/helper');

const CreateLead = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store && req.body.name && req.body.phone && req.headers.token;

        if (validParams) {

            let checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

                    let findDate = new Date();

                    let lead = await Leads.create({
                        name: req.body.name,
                        phone: req.body.phone,
                        email: req.body.email,
                        status: req.body.status,
                        comment: req.body.comment,
                        modeofreferral: req.body.modeofreferral,
                        store: req.body.store,
                        createdat: findDate
                    }).then((data) => {
                        resolve({ status: 200, success: true, message: 'Lead created successfully' })
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

const ListLeads = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.store;

        if (validParams) {
            try {
                let leads = await Leads.find({ store: req.body.store })
                    .then((data) => {
                        resolve({ status: 200, success: true, message: 'Leads list', leads: data })
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
            res.status(data.status).send({ success: data.success, message: data.message, leads: data.leads });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const EditLead = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token && req.body.lead;

        if (ValidParams) {
            try {
                let checkAccess = helper.verifyAdminToken(req.headers.token);

                if (checkAccess) {
                    try {
                        await Leads.updateOne(
                            { _id: req.body.lead },
                            {
                                $set: {
                                    name: req.body.name,
                                    phone: req.body.phone,
                                    email: req.body.email,
                                    status: req.body.status,
                                    comment: req.body.comment,
                                    modeofreferral: req.body.modeofreferral,
                                    store: req.body.store,
                                }
                            })

                        resolve({ success: true, message: 'Lead edited successfully' })
                    } catch (error) {
                        reject({ success: false, message: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No admin found' })
                }
            }
            catch {
                reject({ success: false, message: 'Invalid token found' })
            }
        }
        else {
            reject({ success: false, message: 'Provide all necessary fields' })
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
    CreateLead,
    EditLead,
    ListLeads
}
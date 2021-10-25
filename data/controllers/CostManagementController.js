const CashManagement = require('../model/cashmanagement');
const helper = require('../common/helper');

const SaveCostEntry = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.date && req.body.type && req.body.amount && req.body.store && req.headers.token;

        if (validParams) {

            let token = req.headers.token;

            let checkAccess = await helper.verifyToken(token);
            let user = await helper.getUser(token);
            console.log(user);
            if (checkAccess) {
                try {
                    let result = await CashManagement.create({
                        entrydate : req.body.date,
                        type : req.body.type,
                        comment : req.body.comment,
                        amount : req.body.amount,
                        store : req.body.store,
                        user : user
                    }).then((data)=>{
                        resolve({ status: 200, success: true, message: 'Entry created successfully'})
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

module.exports = {
    SaveCostEntry
}
const Cow = require('../model/cow');
const CowMilk = require('../model/cowmilk');
const CowWeight = require('../model/cowweight');
const Vaccination = require('../model/vaccination');
const helper = require('../common/helper');

const AddCow = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        const validParams = req.body.tagnumber && req.body.name && req.headers.token;

        if (validParams) {

            const checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

                    const findDate = new Date();
                    const { name, type, gender, tagnumber, mothercowname,
                        mothercownumber, fathercowname, fathercownumber,
                        dateofbirth, timeofbirth, birthweight, dateofdewarming,
                        dateoffirstfeedtaken, dateofmilkstop, dateoffirstheat,
                        dateofinsemination, stomachcleaning, calciumintake,
                        brownsugar, colostrummilkweight, dateofnormalmilk,
                        dateoffirstheataftercalving, dateofartificialinsemination,
                        dateofpregnancyconfirmation, dateofcalving } = req.body;

                    const vaccination = JSON.parse(req.body.vaccination);
                    const cowweight = JSON.parse(req.body.cowweight);
                    const cowmilk = JSON.parse(req.body.cowmilk);

                    const cow = await Cow.create({
                        name,
                        type,
                        gender,
                        tagnumber,
                        mothercowname,
                        mothercownumber,
                        fathercowname,
                        fathercownumber,
                        dateofbirth,
                        timeofbirth,
                        birthweight,
                        dateofdewarming,
                        dateoffirstfeedtaken,
                        dateofmilkstop,
                        dateoffirstheat,
                        dateofinsemination,
                        stomachcleaning,
                        calciumintake,
                        brownsugar,
                        colostrummilkweight,
                        dateofnormalmilk,
                        dateoffirstheataftercalving,
                        dateofartificialinsemination,
                        dateofpregnancyconfirmation,
                        dateofcalving,
                        createdat: findDate
                    }).then(async (data) => {

                        if (vaccination.length) {

                            const vaccinationList = [];

                            for (let i = 0; i < vaccination.length; i++) {
                                const vaccine = vaccination[i];
                                const creatVaccine = await Vaccination.create({
                                    name: vaccine.name,
                                    description: vaccine.description,
                                    cow: data._id,
                                    entrydate: vaccine.entryDate,
                                    createdat: new Date()
                                })
                                vaccinationList.push(creatVaccine._id);
                            }

                            await Cow.findByIdAndUpdate(data._id,
                                { vaccination: vaccinationList },
                                { new: true, useFindAndModify: false }
                            )
                        }

                        if (cowweight.length) {

                            const cowweightList = [];

                            for (let i = 0; i < cowweight.length; i++) {
                                const weight = cowweight[i];
                                const creatCowWeight = await CowWeight.create({
                                    quantity: weight.quantity,
                                    cow: data._id,
                                    entrydate: weight.entryDate,
                                    createdat: new Date()
                                })
                                cowweightList.push(creatCowWeight._id);
                            }

                            await Cow.findByIdAndUpdate(data._id,
                                { cowweight: cowweightList },
                                { new: true, useFindAndModify: false }
                            )
                        }

                        if (cowmilk.length) {

                            const cowmilkList = [];

                            for (let i = 0; i < cowmilk.length; i++) {
                                const milk = cowmilk[i];
                                const creatCowmilk = await CowMilk.create({
                                    session: milk.session,
                                    quantity: milk.quantity,
                                    entrydate: milk.entryDate,
                                    cow: data._id,
                                    createdat: new Date()
                                })
                                cowmilkList.push(creatCowmilk._id);
                            }

                            await Cow.findByIdAndUpdate(data._id,
                                { cowmilk: cowmilkList },
                                { new: true, useFindAndModify: false }
                            )
                        }
                        resolve({ status: 200, success: true, message: 'Cow created successfully' })
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

const EditCow = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        const validParams = req.body.tagnumber && req.body.name && req.headers.token;

        if (validParams) {

            const checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

                    const findDate = new Date();
                    const { name, type, gender, tagnumber, mothercowname,
                        mothercownumber, fathercowname, fathercownumber,
                        dateofbirth, timeofbirth, birthweight, dateofdewarming,
                        dateoffirstfeedtaken, dateofmilkstop, dateoffirstheat,
                        dateofinsemination, stomachcleaning, calciumintake,
                        brownsugar, colostrummilkweight, dateofnormalmilk,
                        dateoffirstheataftercalving, dateofartificialinsemination,
                        dateofpregnancyconfirmation, dateofcalving, cow } = req.body;

                    const vaccination = JSON.parse(req.body.vaccination);
                    const cowweight = JSON.parse(req.body.cowweight);
                    const cowmilk = JSON.parse(req.body.cowmilk);

                    const editCow = await Cow.findByIdAndUpdate(cow,
                        {
                            name,
                            type,
                            gender,
                            tagnumber,
                            mothercowname,
                            mothercownumber,
                            fathercowname,
                            fathercownumber,
                            dateofbirth,
                            timeofbirth,
                            birthweight,
                            dateofdewarming,
                            dateoffirstfeedtaken,
                            dateofmilkstop,
                            dateoffirstheat,
                            dateofinsemination,
                            stomachcleaning,
                            calciumintake,
                            brownsugar,
                            colostrummilkweight,
                            dateofnormalmilk,
                            dateoffirstheataftercalving,
                            dateofartificialinsemination,
                            dateofpregnancyconfirmation,
                            dateofcalving,
                            createdat: findDate
                        },
                        { new: true, useFindAndModify: false }
                    ).then(async (data) => {

                        if (vaccination.length) {

                            const vaccinationList = [];

                            for (let i = 0; i < vaccination.length; i++) {
                                const vaccine = vaccination[i];
                                if (vaccine.id) {
                                    await Vaccination.findByIdAndUpdate(vaccine.id, {
                                        name: vaccine.name,
                                        description: vaccine.description,
                                        entrydate: vaccine.entryDate,
                                    })
                                    vaccinationList.push(vaccine.id);

                                } else {
                                    const creatVaccine = await Vaccination.create({
                                        name: vaccine.name,
                                        description: vaccine.description,
                                        cow,
                                        entrydate: vaccine.entryDate,
                                        createdat: new Date()
                                    })
                                    vaccinationList.push(creatVaccine._id);
                                }
                            }

                            await Cow.findByIdAndUpdate(cow,
                                { vaccination: vaccinationList },
                                { new: true, useFindAndModify: false }
                            )
                        }

                        if (cowweight.length) {

                            const cowweightList = [];

                            for (let i = 0; i < cowweight.length; i++) {
                                const weight = cowweight[i];
                                if (weight.id) {
                                    await CowWeight.findByIdAndUpdate(weight.id, {
                                        quantity: weight.quantity,
                                        entrydate: weight.entryDate,
                                    }, { new: true, useFindAndModify: false })
                                    cowweightList.push(weight.id);
                                } else {
                                    const creatCowWeight = await CowWeight.create({
                                        quantity: weight.quantity,
                                        cow,
                                        entrydate: weight.entryDate,
                                        createdat: new Date()
                                    })
                                    cowweightList.push(creatCowWeight._id);
                                }
                            }

                            await Cow.findByIdAndUpdate(cow,
                                { cowweight: cowweightList },
                                { new: true, useFindAndModify: false }
                            )
                        }

                        if (cowmilk.length) {

                            const cowmilkList = [];

                            for (let i = 0; i < cowmilk.length; i++) {
                                const milk = cowmilk[i];
                                if (milk.id) {
                                    await CowMilk.findByIdAndUpdate(milk.id, {
                                        session: milk.session,
                                        quantity: milk.quantity,
                                        entrydate: milk.entryDate
                                    }, { new: true, useFindAndModify: false })
                                    cowmilkList.push(milk.id);
                                } else {
                                    const creatCowmilk = await CowMilk.create({
                                        session: milk.session,
                                        quantity: milk.quantity,
                                        entrydate: milk.entryDate,
                                        cow,
                                        createdat: new Date()
                                    })
                                    cowmilkList.push(creatCowmilk._id);
                                }
                            }

                            await Cow.findByIdAndUpdate(cow,
                                { cowmilk: cowmilkList },
                                { new: true, useFindAndModify: false }
                            )
                        }
                        resolve({ status: 200, success: true, message: 'Cow edited successfully' })
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

const ViewCow = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.headers.token;

        if (validParams) {
            try {
                let category = await Cow.find({ isDeleted: false })
                    .populate({ path: 'vaccination', select: 'name description entrydate', options: { sort: { 'entrydate': -1 } } })
                    .populate({ path: 'cowweight', select: 'quantity entrydate', options: { sort: { 'entrydate': -1 } } })
                    .populate({ path: 'cowmilk', select: 'session quantity entrydate', options: { sort: { 'entrydate': -1 } } })
                    .then((data) => {
                        resolve({ status: 200, success: true, message: 'Cow list', cow: data })
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
            res.status(data.status).send({ success: data.success, message: data.message, cow: data.cow });
        })
        .catch(function (error) {
            res.status(error.status).send({ success: error.success, message: error.message });
        })

}

const AddVaccination = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        const validParams = req.body.name && req.body.cow && req.body.entrydate;

        if (validParams) {

            const checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

                    let vaccinationList = [];

                    const { name, description, cow, entrydate } = req.body;

                    const cowInfo = await Cow.findById(cow).select('vaccination');
                    vaccinationList = cowInfo.vaccination;

                    const creatVaccine = await Vaccination.create({
                        name,
                        description,
                        cow,
                        entrydate,
                        createdat: new Date()
                    })
                    vaccinationList.push(creatVaccine._id);

                    await Cow.findByIdAndUpdate(cow,
                        { vaccination: vaccinationList },
                        { new: true, useFindAndModify: false }
                    )
                        .then(async (data) => {
                            resolve({ status: 200, success: true, message: 'Vaccine added successfully' })
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

const AddCowWeight = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        const validParams = req.body.quantity && req.body.cow && req.body.entrydate;

        if (validParams) {

            const checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

                    let cowweightList = [];

                    const { quantity, cow, entrydate } = req.body;

                    const cowInfo = await Cow.findById(cow).select('cowweight');
                    cowweightList = cowInfo.cowweight;

                    const creatCowWeight = await CowWeight.create({
                        quantity,
                        cow,
                        entrydate,
                        createdat: new Date()
                    })
                    cowweightList.push(creatCowWeight._id);

                    await Cow.findByIdAndUpdate(cow,
                        { cowweight: cowweightList },
                        { new: true, useFindAndModify: false }
                    )
                        .then(async (data) => {
                            resolve({ status: 200, success: true, message: 'Cow Weight added successfully' })
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

const AddCowMilk = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        const validParams = req.body.quantity && req.body.cow && req.body.entrydate;

        if (validParams) {

            const checkAccess = helper.verifyAdminToken(req.headers.token);
            if (checkAccess) {
                try {

                    let cowmilkList = [];

                    const { quantity, session, cow, entrydate } = req.body;

                    const cowInfo = await Cow.findById(cow).select('cowmilk');
                    cowmilkList = cowInfo.cowmilk;

                    const creatCowmilk = await CowMilk.create({
                        quantity,
                        session,
                        cow,
                        entrydate,
                        createdat: new Date()
                    })
                    cowmilkList.push(creatCowmilk._id);

                    await Cow.findByIdAndUpdate(cow,
                        { cowmilk: cowmilkList },
                        { new: true, useFindAndModify: false }
                    )
                        .then(async (data) => {
                            resolve({ status: 200, success: true, message: 'Cow Milk Entry added successfully' })
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
    AddCow,
    EditCow,
    ViewCow,
    AddVaccination,
    AddCowWeight,
    AddCowMilk
}
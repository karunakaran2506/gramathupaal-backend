const Cow = require("../model/cow");
const CowMilk = require("../model/cowmilk");
const CowWeight = require("../model/cowweight");
const Vaccination = require("../model/vaccination");
const CowHeat = require("../model/cowheat");
const CowTeeth = require("../model/cowteeth");
const CowDewarming = require("../model/cowdewarming");
const CowTreatment = require("../model/cowtreatment");
const CalfDelivery = require("../model/calfdelivery");
const helper = require("../common/helper");

const AddCow = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams =
      req.body.tagnumber && req.body.name && req.headers.token;

    if (validParams) {
      const checkAccess = helper.verifyAdminToken(req.headers.token);
      if (checkAccess) {
        try {
          const findDate = new Date();
          const {
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
            antibiotictonobil,
            colostrumfeeded,
            bullname,
            bulldescription,
            exapar,
            breeddescription,
            breedtype,
            dateofpregnancyconfirmation,
            dateofcalving,
            store,
          } = req.body;

          const vaccination = JSON.parse(req.body.vaccination);
          const cowweight = JSON.parse(req.body.cowweight);
          const cowmilk = JSON.parse(req.body.cowmilk);
          const cowdewarming = JSON.parse(req.body.cowdewarming);
          const cowheat = JSON.parse(req.body.cowheat);
          const cowteeth = JSON.parse(req.body.cowteeth);

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
            store,
            antibiotictonobil: !!antibiotictonobil,
            colostrumfeeded,
            bullname,
            bulldescription,
            exapar,
            breeddescription,
            breedtype,
            createdat: findDate,
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
                  createdat: new Date(),
                });
                vaccinationList.push(creatVaccine._id);
              }

              await Cow.findByIdAndUpdate(
                data._id,
                { vaccination: vaccinationList },
                { new: true, useFindAndModify: false }
              );
            }

            if (cowweight.length) {
              const cowweightList = [];

              for (let i = 0; i < cowweight.length; i++) {
                const weight = cowweight[i];
                const creatCowWeight = await CowWeight.create({
                  quantity: weight.quantity,
                  cow: data._id,
                  entrydate: weight.entryDate,
                  createdat: new Date(),
                });
                cowweightList.push(creatCowWeight._id);
              }

              await Cow.findByIdAndUpdate(
                data._id,
                { cowweight: cowweightList },
                { new: true, useFindAndModify: false }
              );
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
                  createdat: new Date(),
                });
                cowmilkList.push(creatCowmilk._id);
              }

              await Cow.findByIdAndUpdate(
                data._id,
                { cowmilk: cowmilkList },
                { new: true, useFindAndModify: false }
              );
            }

            if (cowdewarming.length) {
              const cowdewarmingList = [];

              for (let i = 0; i < cowdewarming.length; i++) {
                const dewarming = cowdewarming[i];
                const createNew = await CowDewarming.create({
                  description: dewarming.description,
                  cow: data._id,
                  entrydate: dewarming.entryDate,
                  createdat: new Date(),
                });
                cowdewarmingList.push(createNew._id);
              }

              await Cow.findByIdAndUpdate(
                data._id,
                { cowdewarming: cowdewarmingList },
                { new: true, useFindAndModify: false }
              );
            }

            if (cowheat.length) {
              const cowheatList = [];

              for (let i = 0; i < cowheat.length; i++) {
                const heat = cowheat[i];
                const createNew = await CowHeat.create({
                  description: heat.description,
                  cow: data._id,
                  entrydate: heat.entryDate,
                  createdat: new Date(),
                });
                cowheatList.push(createNew._id);
              }

              await Cow.findByIdAndUpdate(
                data._id,
                { cowheat: cowheatList },
                { new: true, useFindAndModify: false }
              );
            }

            if (cowteeth.length) {
              const cowteethList = [];

              for (let i = 0; i < cowteeth.length; i++) {
                const teeth = cowteeth[i];
                const createNew = await CowTeeth.create({
                  description: teeth.description,
                  cow: data._id,
                  entrydate: teeth.entryDate,
                  createdat: new Date(),
                });
                cowteethList.push(createNew._id);
              }

              await Cow.findByIdAndUpdate(
                data._id,
                { cowteeth: cowteethList },
                { new: true, useFindAndModify: false }
              );
            }

            resolve({
              status: 200,
              success: true,
              message: "Cow created successfully",
            });
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "No access to proceed this action",
        });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const EditCow = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams =
      req.body.tagnumber && req.body.name && req.headers.token;

    if (validParams) {
      const checkAccess = helper.verifyAdminToken(req.headers.token);
      if (checkAccess) {
        try {
          const findDate = new Date();
          const {
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
            antibiotictonobil,
            colostrumfeeded,
            bullname,
            bulldescription,
            exapar,
            breeddescription,
            breedtype,
            dateofpregnancyconfirmation,
            dateofcalving,
            store,
          } = req.body;

          const vaccination = JSON.parse(req.body.vaccination);
          const cowweight = JSON.parse(req.body.cowweight);
          const cowmilk = JSON.parse(req.body.cowmilk);
          const cowdewarming = JSON.parse(req.body.cowdewarming);
          const cowheat = JSON.parse(req.body.cowheat);
          const cowteeth = JSON.parse(req.body.cowteeth);

          const editCow = await Cow.findByIdAndUpdate(
            cow,
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
              store,
              antibiotictonobil: !!antibiotictonobil,
              colostrumfeeded,
              bullname,
              bulldescription,
              exapar,
              breeddescription,
              breedtype,
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
                  });
                  vaccinationList.push(vaccine.id);
                } else {
                  const creatVaccine = await Vaccination.create({
                    name: vaccine.name,
                    description: vaccine.description,
                    cow,
                    entrydate: vaccine.entryDate,
                    createdat: new Date(),
                  });
                  vaccinationList.push(creatVaccine._id);
                }
              }

              await Cow.findByIdAndUpdate(
                cow,
                { vaccination: vaccinationList },
                { new: true, useFindAndModify: false }
              );
            }

            if (cowweight.length) {
              const cowweightList = [];

              for (let i = 0; i < cowweight.length; i++) {
                const weight = cowweight[i];
                if (weight.id) {
                  await CowWeight.findByIdAndUpdate(
                    weight.id,
                    {
                      quantity: weight.quantity,
                      entrydate: weight.entryDate,
                    },
                    { new: true, useFindAndModify: false }
                  );
                  cowweightList.push(weight.id);
                } else {
                  const creatCowWeight = await CowWeight.create({
                    quantity: weight.quantity,
                    cow,
                    entrydate: weight.entryDate,
                    createdat: new Date(),
                  });
                  cowweightList.push(creatCowWeight._id);
                }
              }

              await Cow.findByIdAndUpdate(
                cow,
                { cowweight: cowweightList },
                { new: true, useFindAndModify: false }
              );
            }

            if (cowmilk.length) {
              const cowmilkList = [];

              for (let i = 0; i < cowmilk.length; i++) {
                const milk = cowmilk[i];
                if (milk.id) {
                  await CowMilk.findByIdAndUpdate(
                    milk.id,
                    {
                      session: milk.session,
                      quantity: milk.quantity,
                      entrydate: milk.entryDate,
                    },
                    { new: true, useFindAndModify: false }
                  );
                  cowmilkList.push(milk.id);
                } else {
                  const creatCowmilk = await CowMilk.create({
                    session: milk.session,
                    quantity: milk.quantity,
                    entrydate: milk.entryDate,
                    cow,
                    createdat: new Date(),
                  });
                  cowmilkList.push(creatCowmilk._id);
                }
              }

              await Cow.findByIdAndUpdate(
                cow,
                { cowmilk: cowmilkList },
                { new: true, useFindAndModify: false }
              );
            }

            if (cowdewarming.length) {
              const cowdewarmingList = [];

              for (let i = 0; i < cowdewarming.length; i++) {
                const dewarming = cowdewarming[i];
                if (dewarming.id) {
                  await CowDewarming.findByIdAndUpdate(
                    dewarming.id,
                    {
                      description: dewarming.description,
                      entrydate: dewarming.entryDate,
                    },
                    { new: true, useFindAndModify: false }
                  );
                  cowdewarmingList.push(dewarming.id);
                } else {
                  const createNew = await CowDewarming.create({
                    description: dewarming.description,
                    entrydate: dewarming.entryDate,
                    cow,
                    createdat: new Date(),
                  });
                  cowdewarmingList.push(createNew._id);
                }
              }

              await Cow.findByIdAndUpdate(
                cow,
                { cowdewarming: cowdewarmingList },
                { new: true, useFindAndModify: false }
              );
            }

            if (cowheat.length) {
              const cowheatList = [];

              for (let i = 0; i < cowheat.length; i++) {
                const heat = cowheat[i];
                if (heat.id) {
                  await CowHeat.findByIdAndUpdate(
                    heat.id,
                    {
                      description: heat.description,
                      entrydate: heat.entryDate,
                    },
                    { new: true, useFindAndModify: false }
                  );
                  cowheatList.push(heat.id);
                } else {
                  const createNew = await CowHeat.create({
                    description: heat.description,
                    entrydate: heat.entryDate,
                    cow,
                    createdat: new Date(),
                  });
                  cowheatList.push(createNew._id);
                }
              }

              await Cow.findByIdAndUpdate(
                cow,
                { cowheat: cowheatList },
                { new: true, useFindAndModify: false }
              );
            }

            if (cowteeth.length) {
              const cowteethList = [];

              for (let i = 0; i < cowteeth.length; i++) {
                const teeth = cowteeth[i];
                if (teeth.id) {
                  await CowTeeth.findByIdAndUpdate(
                    teeth.id,
                    {
                      description: teeth.description,
                      entrydate: teeth.entryDate,
                    },
                    { new: true, useFindAndModify: false }
                  );
                  cowteethList.push(teeth.id);
                } else {
                  const createNew = await CowTeeth.create({
                    description: teeth.description,
                    entrydate: teeth.entryDate,
                    cow,
                    createdat: new Date(),
                  });
                  cowteethList.push(createNew._id);
                }
              }

              await Cow.findByIdAndUpdate(
                cow,
                { cowteeth: cowteethList },
                { new: true, useFindAndModify: false }
              );
            }

            resolve({
              status: 200,
              success: true,
              message: "Cow edited successfully",
            });
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "No access to proceed this action",
        });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ViewCow = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token;

    if (validParams) {
      try {
        let category = await Cow.find({
          isDeleted: false,
          store: req.body.store,
        })
          .populate({
            path: "vaccination",
            select: "name description entrydate",
            options: { sort: { entrydate: -1 } },
          })
          .populate({
            path: "cowweight",
            select: "quantity entrydate",
            options: { sort: { entrydate: -1 } },
          })
          .populate({
            path: "cowmilk",
            select: "session quantity entrydate",
            options: { sort: { entrydate: -1 } },
          })
          .populate({
            path: "cowdewarming",
            select: "description entrydate",
            options: { sort: { entrydate: -1 } },
          })
          .populate({
            path: "cowheat",
            select: "description entrydate",
            options: { sort: { entrydate: -1 } },
          })
          .populate({
            path: "cowteeth",
            select: "description entrydate",
            options: { sort: { entrydate: -1 } },
          })
          .then((data) => {
            resolve({
              status: 200,
              success: true,
              message: "Cow list",
              cow: data,
            });
          });
      } catch (error) {
        reject({ status: 200, success: false, message: error.message });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message, cow: data.cow });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ViewCowbyStore = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token;

    if (validParams) {
      try {
        let category = await Cow.find({
          isDeleted: false,
          store: req.body.store,
        })
          .select("name tagnumber")
          .then((data) => {
            resolve({
              status: 200,
              success: true,
              message: "Cow list",
              cow: data,
            });
          });
      } catch (error) {
        reject({ status: 200, success: false, message: error.message });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message, cow: data.cow });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const AddVaccination = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams = req.body.name && req.body.cow && req.body.entrydate;

    if (validParams) {
      const checkAccess = helper.verifyAdminToken(req.headers.token);
      if (checkAccess) {
        try {
          let vaccinationList = [];

          const { name, description, cow, entrydate } = req.body;

          const cowInfo = await Cow.findById(cow).select("vaccination");
          vaccinationList = cowInfo.vaccination;

          const creatVaccine = await Vaccination.create({
            name,
            description,
            cow,
            entrydate,
            createdat: new Date(),
          });
          vaccinationList.push(creatVaccine._id);

          await Cow.findByIdAndUpdate(
            cow,
            { vaccination: vaccinationList },
            { new: true, useFindAndModify: false }
          ).then(async (data) => {
            resolve({
              status: 200,
              success: true,
              message: "Vaccine added successfully",
            });
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "No access to proceed this action",
        });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const AddCowWeight = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams = req.body.quantity && req.body.cow && req.body.entrydate;

    if (validParams) {
      const checkAccess = helper.verifyAdminToken(req.headers.token);
      if (checkAccess) {
        try {
          let cowweightList = [];

          const { quantity, cow, entrydate } = req.body;

          const cowInfo = await Cow.findById(cow).select("cowweight");
          cowweightList = cowInfo.cowweight;

          const creatCowWeight = await CowWeight.create({
            quantity,
            cow,
            entrydate,
            createdat: new Date(),
          });
          cowweightList.push(creatCowWeight._id);

          await Cow.findByIdAndUpdate(
            cow,
            { cowweight: cowweightList },
            { new: true, useFindAndModify: false }
          ).then(async (data) => {
            resolve({
              status: 200,
              success: true,
              message: "Cow Weight added successfully",
            });
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "No access to proceed this action",
        });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const AddCowMilk = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams = req.body.quantity && req.body.cow && req.body.entrydate;

    if (validParams) {
      const checkAccess = helper.verifyAdminToken(req.headers.token);
      if (checkAccess) {
        try {
          let cowmilkList = [];

          const { quantity, session, cow, entrydate } = req.body;

          const cowInfo = await Cow.findById(cow).select("cowmilk");
          cowmilkList = cowInfo.cowmilk;

          const creatCowmilk = await CowMilk.create({
            quantity,
            session,
            cow,
            entrydate,
            createdat: new Date(),
          });
          cowmilkList.push(creatCowmilk._id);

          await Cow.findByIdAndUpdate(
            cow,
            { cowmilk: cowmilkList },
            { new: true, useFindAndModify: false }
          ).then(async (data) => {
            resolve({
              status: 200,
              success: true,
              message: "Cow Milk Entry added successfully",
            });
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "No access to proceed this action",
        });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ViewCowMilkEntrybyDate = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token;

    if (validParams) {
      try {
        let newdate = req.body.date;
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));
        await CowMilk.find({ cow: req.body.cow, entrydate: { $gte: start, $lt: end } }).then((data) => {
          resolve({
            status: 200,
            success: true,
            message: "Cow milk entry",
            milkentry: data,
          });
        });
      } catch (error) {
        reject({ status: 200, success: false, message: error.message });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res.status(data.status).send({
        success: data.success,
        message: data.message,
        milkentry: data.milkentry,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const AddCowDewarming = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams =
      req.body.description && req.body.cow && req.body.entrydate;

    if (validParams) {
      const checkAccess = helper.verifyAdminToken(req.headers.token);
      if (checkAccess) {
        try {
          let cowdewarmingList = [];

          const { description, cow, entrydate } = req.body;

          const cowInfo = await Cow.findById(cow).select("cowdewarming");
          cowdewarmingList = cowInfo.cowdewarming;

          const creatDewarming = await CowDewarming.create({
            description,
            cow,
            entrydate,
            createdat: new Date(),
          });
          cowdewarmingList.push(creatDewarming._id);

          await Cow.findByIdAndUpdate(
            cow,
            { cowdewarming: cowdewarmingList },
            { new: true, useFindAndModify: false }
          ).then(async (data) => {
            resolve({
              status: 200,
              success: true,
              message: "Dewarming added successfully",
            });
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "No access to proceed this action",
        });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const AddCowHeat = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams =
      req.body.description && req.body.cow && req.body.entrydate;

    if (validParams) {
      const checkAccess = helper.verifyAdminToken(req.headers.token);
      if (checkAccess) {
        try {
          let cowheatList = [];

          const { description, cow, entrydate } = req.body;

          const cowInfo = await Cow.findById(cow).select("cowheat");
          cowheatList = cowInfo.cowheat;

          const createNew = await CowHeat.create({
            description,
            cow,
            entrydate,
            createdat: new Date(),
          });
          cowheatList.push(createNew._id);

          await Cow.findByIdAndUpdate(
            cow,
            { cowheat: cowheatList },
            { new: true, useFindAndModify: false }
          ).then(async (data) => {
            resolve({
              status: 200,
              success: true,
              message: "Heat details added successfully",
            });
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "No access to proceed this action",
        });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const AddCowTeeth = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams =
      req.body.description && req.body.cow && req.body.entrydate;

    if (validParams) {
      const checkAccess = helper.verifyAdminToken(req.headers.token);
      if (checkAccess) {
        try {
          let cowteethList = [];

          const { description, cow, entrydate } = req.body;

          const cowInfo = await Cow.findById(cow).select("cowteeth");
          cowteethList = cowInfo.cowteeth;

          const createNew = await CowTeeth.create({
            description,
            cow,
            entrydate,
            createdat: new Date(),
          });
          cowteethList.push(createNew._id);

          await Cow.findByIdAndUpdate(
            cow,
            { cowteeth: cowteethList },
            { new: true, useFindAndModify: false }
          ).then(async (data) => {
            resolve({
              status: 200,
              success: true,
              message: "Teeth details added successfully",
            });
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "No access to proceed this action",
        });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

// For milk entry man

const AddCowMilkEntry = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams = req.body.quantity && req.body.cow && req.body.entrydate;

    if (validParams) {
      const checkAccess = req.headers.token;
      if (checkAccess) {
        try {
          let cowmilkList = [];

          const { quantity, session, cow, entrydate } = req.body;

          const cowInfo = await Cow.findById(cow).select("cowmilk");
          cowmilkList = cowInfo.cowmilk;

          const creatCowmilk = await CowMilk.create({
            quantity,
            session,
            cow,
            entrydate,
            createdat: new Date(),
          });
          cowmilkList.push(creatCowmilk._id);

          await Cow.findByIdAndUpdate(
            cow,
            { cowmilk: cowmilkList },
            { new: true, useFindAndModify: false }
          ).then(async (data) => {
            resolve({
              status: 200,
              success: true,
              message: "Cow Milk Entry added successfully",
            });
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "No access to proceed this action",
        });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ViewCowMilkEntry = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token;

    if (validParams) {
      try {
        await CowMilk.find({ cow: req.body.cow }).then((data) => {
          resolve({
            status: 200,
            success: true,
            message: "Cow milk entry",
            milkentry: data,
          });
        });
      } catch (error) {
        reject({ status: 200, success: false, message: error.message });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res.status(data.status).send({
        success: data.success,
        message: data.message,
        milkentry: data.milkentry,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const DeleteCow = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.id;

    if (validParams) {
      try {
        let cow = await Cow.updateOne(
          { _id: req.body.id },
          {
            $set: {
              isDeleted: true,
            },
          }
        ).then((data) => {
          resolve({
            status: 200,
            success: true,
            message: "Cow deleted successfully",
          });
        });
      } catch (error) {
        reject({ status: 200, success: false, message: error.message });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

//

// cow treatment & calf delivery

const AddCowTreatment = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams =
      req.body.problem && req.body.prescription && req.body.cow && req.body.store && req.body.entrydate;

    if (validParams) {
      const checkAccess = helper.verifyAdminToken(req.headers.token);
      if (checkAccess) {
        try {
          const { problem, prescription, cow, entrydate, comment, store } = req.body;

          await CowTreatment.create({
            problem,
            prescription,
            store,
            cow,
            entrydate,
            comment,
            createdat: new Date(),
          }).then(async (data) => {
            resolve({
              status: 200,
              success: true,
              message: "Cow treatment added successfully",
            });
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "No access to proceed this action",
        });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ListCowTreatment = async function (req, res) {

  const promise = new Promise(async function (resolve, reject) {

    let validParams = req.body.store;

    if (validParams) {
      try {
        await CowTreatment.find({ store: req.body.store }).populate("cow", "name tagnumber")
          .then((data) => {
            resolve({ status: 200, success: true, message: 'Cow treatment list', data })
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
      res.status(data.status).send({ success: data.success, message: data.message, data: data.data });
    })
    .catch(function (error) {
      res.status(error.status).send({ success: error.success, message: error.message });
    })

}

const AddCalfDelivery = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams =
      req.body.cow && req.body.weight && req.body.gender && req.body.store && req.body.entrydate;

    if (validParams) {
      const checkAccess = helper.verifyAdminToken(req.headers.token);
      if (checkAccess) {
        try {
          const { weight, gender, cow, entrydate, status, store, comment } = req.body;

          await CalfDelivery.create({
            weight,
            gender,
            store,
            cow,
            entrydate,
            status,
            comment,
            createdat: new Date(),
          }).then(async (data) => {
            resolve({
              status: 200,
              success: true,
              message: "Calf delivery added successfully",
            });
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "No access to proceed this action",
        });
      }
    } else {
      reject({
        status: 200,
        success: false,
        message: "Provide all necessary fields",
      });
    }
  });

  promise

    .then(function (data) {
      res
        .status(data.status)
        .send({ success: data.success, message: data.message });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ListCalfDelivery = async function (req, res) {

  const promise = new Promise(async function (resolve, reject) {

    let validParams = req.body.store;

    if (validParams) {
      try {
        await CalfDelivery.find({ store: req.body.store }).populate("cow", "name tagnumber")
          .then((data) => {
            resolve({ status: 200, success: true, message: 'Calf delivery list', data })
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
      res.status(data.status).send({ success: data.success, message: data.message, data: data.data });
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
  AddCowMilk,
  AddCowMilkEntry,
  ViewCowbyStore,
  ViewCowMilkEntry,
  AddCowDewarming,
  AddCowHeat,
  AddCowTeeth,
  ViewCowMilkEntrybyDate,
  DeleteCow,
  AddCowTreatment,
  ListCowTreatment,
  AddCalfDelivery,
  ListCalfDelivery
};

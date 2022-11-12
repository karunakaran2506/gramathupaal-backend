const Production = require("../model/production");
const helper = require("../common/helper");

const CreateProduction = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams =
      req.body.store &&
      req.body.product &&
      req.body.quantity &&
      req.headers.token;

    if (validParams) {
      let checkAccess = helper.verifyAdminToken(req.headers.token);
      if (checkAccess) {
        try {
          let findDate = new Date();

          await Production.create({
            preparationdate: req.body.preparationdate,
            rawmaterials: req.body.rawmaterials,
            labourcharges: req.body.labourcharges,
            quantity: req.body.quantity,
            batchnumber: req.body.batchnumber,
            description: req.body.description,
            product: req.body.product,
            store: req.body.store,
            createdat: findDate,
          }).then((data) => {
            resolve({
              status: 200,
              success: true,
              message: "Production created successfully",
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

const ListProduction = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.store;

    if (validParams) {
      try {
        let newdate = req.body.date;
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

        await Production.find({
          store: req.body.store,
          createdat: { $gte: start, $lt: end },
        })
          .populate("product", "_id name unit quantity")
          .then((data) => {
            resolve({
              status: 200,
              success: true,
              message: "Production list",
              production: data,
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
        production: data.production,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const EditProduction = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let ValidParams = req.headers.token && req.body.lead;

    if (ValidParams) {
      try {
        let checkAccess = helper.verifyAdminToken(req.headers.token);

        if (checkAccess) {
          try {
            await Production.updateOne(
              { _id: req.body.id },
              {
                $set: {
                  preparationdate: req.body.preparationdate,
                  rawmaterials: req.body.rawmaterials,
                  labourcharges: req.body.labourcharges,
                  quantity: req.body.quantity,
                  batchnumber: req.body.batchnumber,
                  description: req.body.description,
                  product: req.body.product,
                  store: req.body.store,
                },
              }
            );

            resolve({
              success: true,
              message: "Production edited successfully",
            });
          } catch (error) {
            reject({ success: false, message: error.message });
          }
        } else {
          reject({ success: false, message: "No admin found" });
        }
      } catch {
        reject({ success: false, message: "Invalid token found" });
      }
    } else {
      reject({ success: false, message: "Provide all necessary fields" });
    }
  });

  promise

    .then((data) => {
      res.send({ success: data.success, message: data.message });
    })
    .catch((error) => {
      res.send({ success: error.success, message: error.message });
    });
};

module.exports = {
  CreateProduction,
  ListProduction,
  EditProduction,
};

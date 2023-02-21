const Stock = require("../model/stockmanagement");
const helper = require("../common/helper");
const Product = require("../model/product");
const moment = require("moment");
const { ObjectId } = require("bson");

const SaveStockEntry = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams =
      req.body.entryDate &&
      req.body.product &&
      req.body.quantity &&
      req.body.store &&
      req.body.producttype &&
      req.headers.token;

    if (validParams) {
      let token = req.headers.token;

      let checkAccess = await helper.verifyAdminToken(token);
      let user = await helper.getUser(token);
      if (checkAccess) {
        try {
          let result = await Stock.create({
            product: req.body.product,
            store: req.body.store,
            stocktype: req.body.stocktype,
            quantity: req.body.quantity,
            producttype: req.body.producttype,
            entrydate: req.body.entryDate,
            user,
            createdat: new Date(),
          }).then((data) => {
            resolve({
              status: 200,
              success: true,
              message: "Entry created successfully",
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

// overall stock entries for a store
const ListAllStockEntries = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.store;

    if (validParams) {
      try {
        const entries = [];
        let stockentry;

        stockentry = await Product.find({ store: req.body.store, isDeleted: false })
          .select("_id name quantity milktype unit")
          .populate("category", '_id name');

        for (let i = 0; i < stockentry.length; i++) {
          let totalStockIn = 0;
          let totalStockOut = 0;
          let totalByproduct = 0;
          await Stock.aggregate([
            {
              $match: { stocktype: "in", product: stockentry[i]._id },
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

          await Stock.aggregate([
            {
              $match: { stocktype: "out", product: stockentry[i]._id },
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

          await Stock.aggregate([
            {
              $match: { stocktype: "byproduct", product: stockentry[i]._id },
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
            totalByproduct = quantity;
          });

          let data = {
            product: stockentry[i],
            totalStockIn,
            totalStockOut,
            totalByproduct,
          };
          entries.push(data);
        }

        resolve({
          status: 200,
          success: true,
          message: "Entries list",
          entries,
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
        entries: data.entries,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

// datewise / userwise stock

const ListUserwiseStockEntries = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.store;

    if (validParams) {
      try {
        const startHour = moment(req.body.startTime, ["h:mm A"]).format("HH");
        const startMinutes = moment(req.body.startTime, ["h:mm A"]).format(
          "mm"
        );
        const start = new Date(
          new Date(req.body.date).setHours(startHour, startMinutes, 0, 0)
        );
        const endHour = moment(req.body.endTime, ["h:mm A"]).format("HH");
        const endMinutes = moment(req.body.endTime, ["h:mm A"]).format("mm");

        const end = new Date(
          new Date(req.body.date).setHours(endHour, endMinutes, 00, 00)
        );

        const entries = [];
        let stockentry;

        stockentry = await Product.find({ store: req.body.store, isDeleted: false })
          .select("_id name quantity milktype unit")
          .populate("category", "_id name");

        for (let i = 0; i < stockentry.length; i++) {
          let totalStockIn = 0;
          let totalStockOut = 0;
          let userStockOut = 0;
          let totalByproduct = 0;
          await Stock.aggregate([
            {
              $match: {
                stocktype: "in",
                product: stockentry[i]._id,
              },
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

          await Stock.aggregate([
            {
              $match: {
                stocktype: "out",
                product: stockentry[i]._id
              },
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

          await Stock.aggregate([
            {
              $match: {
                stocktype: "byproduct",
                product: stockentry[i]._id
              },
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
            totalByproduct = quantity;
          });

          // user wise stockout
          await Stock.aggregate([
            {
              $match: {
                stocktype: "out",
                product: stockentry[i]._id,
                entrydate: { $gte: start, $lte: end },
                user: ObjectId(req.body.user),
              },
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
            userStockOut = quantity;
          });

          let data = {
            product: stockentry[i],
            userStockOut,
            remainingStock: (totalStockIn - (totalStockOut + totalByproduct))
          };
          entries.push(data);
        }

        resolve({
          status: 200,
          success: true,
          message: "Entries list",
          entries,
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
        entries: data.entries,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ListTodayStockEntries = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token && req.body.store;

    if (validParams) {
      try {
        let newdate = new Date();
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

        let product = await Stock.find({
          store: req.body.store,
          stocktype: { $in: ["out", "byproduct"] },
          entrydate: { $gte: start, $lt: end },
        })
          .populate("product", "_id name quantity milktype unit")
          .sort({ entrydate: -1 });
        resolve({
          status: 200,
          success: true,
          message: "Entries list",
          product,
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
        entries: data.product,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ListTodayStockBalance = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.store;

    if (validParams) {
      try {
        let newdate = new Date();

        const startHour = moment(req.body.startTime, ["h:mm A"]).format("HH");
        const startMinutes = moment(req.body.startTime, ["h:mm A"]).format(
          "mm"
        );
        const start = new Date(
          new Date(newdate).setHours(startHour, startMinutes, 0, 0)
        );
        const endHour = moment(req.body.endTime, ["h:mm A"]).format("HH");
        const endMinutes = moment(req.body.endTime, ["h:mm A"]).format("mm");

        const end = new Date(
          new Date(newdate).setHours(endHour, endMinutes, 00, 00)
        );

        const entries = [];
        let stockentry;

        stockentry = await Product.find({ store: req.body.store, isDeleted: false })
          .select("_id name quantity milktype unit")
          .populate("category", "name categorytype");

        for (let i = 0; i < stockentry.length; i++) {
          let totalStockIn = 0;
          let totalStockOut = 0;
          let totalByproduct = 0;
          await Stock.aggregate([
            {
              $match: {
                stocktype: "in",
                product: stockentry[i]._id,
                entrydate: { $gte: start, $lte: end },
              },
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

          await Stock.aggregate([
            {
              $match: {
                stocktype: "out",
                product: stockentry[i]._id,
                entrydate: { $gte: start, $lte: end },
              },
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

          await Stock.aggregate([
            {
              $match: {
                stocktype: "byproduct",
                product: stockentry[i]._id,
                entrydate: { $gte: start, $lte: end },
              },
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
            totalByproduct = quantity;
          });

          let data = {
            product: stockentry[i],
            totalStockIn,
            totalStockOut,
            totalByproduct,
          };
          entries.push(data);
        }

        resolve({
          status: 200,
          success: true,
          message: "Entries list",
          entries,
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
        entries: data.entries,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ListTodayStockEntriesbyProduct = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.store;

    if (validParams) {
      try {
        let newdate = new Date();
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));
        const entries = [];
        let stockentry;

        stockentry = await Product.find({ store: req.body.store, isDeleted: false })
          .select("_id name quantity milktype unit");

        for (let i = 0; i < stockentry.length; i++) {
          let totalStockIn = 0;
          let totalStockOut = 0;
          let totalByproduct = 0;
          await Stock.aggregate([
            {
              $match: {
                stocktype: "in",
                product: stockentry[i]._id,
                entrydate: { $gte: start, $lt: end },
              },
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

          await Stock.aggregate([
            {
              $match: {
                stocktype: "out",
                product: stockentry[i]._id,
                entrydate: { $gte: start, $lt: end },
              },
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

          await Stock.aggregate([
            {
              $match: {
                stocktype: "byproduct",
                product: stockentry[i]._id,
                entrydate: { $gte: start, $lt: end },
              },
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
            totalByproduct = quantity;
          });

          let data = {
            product: stockentry[i],
            totalStockIn,
            totalStockOut,
            totalByproduct,
          };
          entries.push(data);
        }

        resolve({
          status: 200,
          success: true,
          message: "Entries list",
          entries,
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
        entries: data.entries,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ListStockEntriesByProducts = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.product;

    if (validParams) {
      try {
        let product = await Stock.find({ product: req.body.product }).sort({
          entrydate: -1,
        });
        resolve({
          status: 200,
          success: true,
          message: "Entries list",
          product,
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
        entries: data.product,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ListStockEntriesByDate = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token;

    if (validParams) {
      try {
        let newdate = req.body.date;
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

        let entries = await Stock.find({
          store: req.body.store,
          stocktype: { $in: ["out"] },
          entrydate: { $gte: start, $lt: end },
        })
          .populate("product")
          .sort({ entrydate: -1 });

        resolve({
          status: 200,
          success: true,
          message: "Entries list",
          entries,
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
        entries: data.entries,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

module.exports = {
  SaveStockEntry,
  ListAllStockEntries,
  ListTodayStockEntries,
  ListTodayStockEntriesbyProduct,
  ListStockEntriesByProducts,
  ListStockEntriesByDate,
  ListTodayStockBalance,
  ListUserwiseStockEntries,
};

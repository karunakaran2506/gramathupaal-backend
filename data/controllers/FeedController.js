const Feed = require("../model/feed");
const FeedStock = require("../model/feedstock");
const FeedLedger = require("../model/feedledger");
const helper = require("../common/helper");
const s3 = require("../common/appConfig").s3;
const { v4 } = require("uuid");
const { MediaContentTypes } = require("../common/constants");

const CreateFeed = function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.name && req.body.store && req.headers.token;

    if (validParams) {
      let token = req.headers.token;

      let checkAccess = await helper.verifyAdminToken(token);
      if (checkAccess) {
        try {
          let result = await Feed.create({
            name: req.body.name,
            store: req.body.store,
            unit: req.body.unit,
            createdat: new Date(),
          }).then((data) => {
            resolve({
              status: 200,
              success: true,
              message: "Feed created successfully",
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

const ListFeed = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.store;

    if (validParams) {
      try {
        let feed = await Feed.find({ store: req.body.store });
        resolve({
          status: 200,
          success: true,
          message: "Feed list",
          feed,
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
        feed: data.feed,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const SaveFeedStockEntry = function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams =
      req.body.entryDate &&
      req.body.feed &&
      req.body.quantity &&
      req.body.store &&
      req.headers.token;

    if (validParams) {
      let token = req.headers.token;

      let checkAccess = await helper.verifyAdminToken(token);
      let user = await helper.getUser(token);
      if (checkAccess) {
        try {
          let result = await FeedStock.create({
            feed: req.body.feed,
            store: req.body.store,
            stocktype: req.body.stocktype,
            quantity: req.body.quantity,
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

const ListFeedStockEntriesByDate = function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token;

    if (validParams) {
      try {
        let newdate = req.body.date;
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

        let entries = await FeedStock.find({
          store: req.body.store,
          entrydate: { $gte: start, $lt: end },
        })
          .populate("feed", "name unit")
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

const SaveFeedLedgerEntry = function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams =
      req.body.entryDate &&
      req.body.feed &&
      req.body.quantity &&
      req.body.store &&
      req.headers.token;

    if (validParams) {
      let token = req.headers.token;

      let checkAccess = await helper.verifyAdminToken(token);
      let user = await helper.getUser(token);
      if (checkAccess) {
        try {
          const { fileType, filesource } = req.body;
          const filePath = `gramathupaal/feed-bills/${Date.now().toString()}-${v4().replace(
            /-/g,
            ""
          )}.${fileType}`;
          const buf = Buffer.from(filesource, "base64");
          const params = {
            Bucket: process.env.BUCKETNAME,
            Key: filePath,
            ACL: "public-read",
            Body: buf,
            ContentEncoding: "base64",
            ContentType: MediaContentTypes[`${fileType}`],
          };
          try {
            await s3.upload(params, function (err, data) {
              if (err) {
                console.log(err);
                console.log("Error uploading data: ", data);
              } else {
                console.log("successfully uploaded the image!");
              }
            });
          } catch (error) {
            console.log("error", error);
          }

          let result = await FeedLedger.create({
            feed: req.body.feed,
            store: req.body.store,
            stocktype: req.body.stocktype,
            quantity: req.body.quantity,
            entrydate: req.body.entryDate,
            totalamount: req.body.totalamount,
            receivedamount: req.body.receivedamount,
            billimage: filePath,
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

const ListFeedLedgerEntriesByDate = function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token;

    if (validParams) {
      try {
        let newdate = req.body.date;
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

        let entries = await FeedLedger.find({
          store: req.body.store,
          entrydate: { $gte: start, $lt: end },
        })
          .populate("feed", "name unit")
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

const UpdateBalance = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let ValidParams = req.headers.token && req.body.ledger;

    if (ValidParams) {
      try {
        let checkAccess = helper.verifyAdminToken(req.headers.token);

        if (checkAccess) {
          try {
            await FeedLedger.updateOne(
              { _id: req.body.ledger },
              {
                $set: {
                  receivedamount: req.body.receivedamount,
                },
              }
            );

            resolve({ success: true, message: "Balance updated successfully" });
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

// overall stock entries for a store
const ListAllFeedStock = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.store;

    if (validParams) {
      try {
        const entries = [];
        let feedstock;

        feedstock = await Feed.find({ store: req.body.store }).select(
          "_id name unit"
        );

        for (let i = 0; i < feedstock.length; i++) {
          let totalStockIn = 0;
          let totalStockOut = 0;
          await FeedStock.aggregate([
            {
              $match: { stocktype: "in", feed: feedstock[i]._id },
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

          await FeedStock.aggregate([
            {
              $match: { stocktype: "out", feed: feedstock[i]._id },
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
            feed: feedstock[i],
            totalStockIn,
            totalStockOut,
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

module.exports = {
  CreateFeed,
  ListFeed,
  SaveFeedStockEntry,
  ListFeedStockEntriesByDate,
  SaveFeedLedgerEntry,
  ListFeedLedgerEntriesByDate,
  ListAllFeedStock,
  UpdateBalance,
};

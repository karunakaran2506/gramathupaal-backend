const Order = require("../model/orders");
const Store = require("../model/store");
const Credit = require("../model/ordercredit");
const Users = require("../model/users");
const Orderitems = require("../model/orderitems");
const Stock = require("../model/stockmanagement");
const Milkcardentry = require("../model/milkcardentry");
const ProductToken = require("../model/producttoken");
const helper = require("../common/helper");
const { ObjectId } = require("bson");

const PlaceOrder = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let checkAccess = helper.verifyToken(req.headers.token);
    if (checkAccess) {
      try {
        let findDate = new Date();
        let customer;
        let ordercredit;
        let orderid = await helper.generateOrderId();
        const user = await helper.getUser(req.headers.token);

        const createOrder = async () => {
          let order = await Order.create({
            orderid: orderid,
            store: req.body.store,
            subtotal: req.body.subtotal,
            totalamount: req.body.totalamount,
            paymentMethod: req.body.paymentMethod,
            createdat: findDate,
            user,
            customer,
            ordercredit,
          }).then(async (data) => {
            let orderitems = [];

            for (let i = 0; i < req.body.orderitems.length; i++) {
              let item = req.body.orderitems[i];
              let orderitem = await Orderitems.create({
                quantity: item.quantity,
                totalamount: item.totalamount,
                product: item.product,
                order: data._id,
                createdat: findDate,
              });
              orderitems.push(orderitem._id);

              let quantity = item.quantity;
              if (item.type === "milk") {
                if (item.unit === "millilitre") {
                  quantity = (item.productquantity / 1000) * item.quantity;
                }
              }
              let stockParams = {
                product: item.product,
                order: data._id,
                store: req.body.store,
                stocktype: "out",
                quantity,
                producttype: item.type,
                user,
                entrydate: findDate,
              };
              let result = await Stock.create(stockParams);
            }

            await Order.findByIdAndUpdate(
              data._id,
              { orderitems },
              { new: true, useFindAndModify: false }
            );
            resolve({
              status: 200,
              success: true,
              message: "Order Placed successfully",
            });
          });
        };

        if (req.body.customer.name && req.body.customer.phone) {
          let findCustomer = await Users.findOne({
            phone: req.body.customer.phone,
          });

          if (findCustomer) {
            reject({
              status: 200,
              success: false,
              message: "Phone number already exist",
            });
          } else {
            let hashedPassword = helper.hashPassword("123456");
            let createUser = await Users.create({
              name: req.body.customer.name,
              phone: req.body.customer.phone,
              password: hashedPassword,
              role: "Customer",
              store: req.body.store,
              createdat: findDate,
            }).then(async (data) => {
              customer = data._id;
            });
          }
        } else if (req.body.customer.id) {
          customer = req.body.customer.id;
        } else {
          reject({
            status: 200,
            success: false,
            message: "Provide all customer details",
          });
        }

        if (
          req.body.paymentMethod === "credit" ||
          req.body.paymentMethod === "free"
        ) {
          await Credit.create({
            customer,
            reason: req.body.creditreason,
            createdat: findDate,
          }).then(async (data) => {
            ordercredit = data._id;
            await createOrder();
          });
        }

        if (req.body.paymentMethod === "milkcard") {
          const item = req.body.orderitems[0];
          let milkentry = await Milkcardentry.findOne({ customer }).populate(
            "milkcard",
            "_id product"
          );
          if (milkentry && milkentry.milkcard) {
            const result =
              milkentry.milkcard.product == item.product ? milkentry : null;
            if (result) {
              if (result.validity >= item.quantity) {
                const updatedValidity = result.validity - item.quantity;
                await Milkcardentry.findByIdAndUpdate(
                  result._id,
                  { validity: updatedValidity },
                  { new: true, useFindAndModify: false }
                );
                await createOrder();
              } else {
                reject({
                  status: 200,
                  success: false,
                  message: "No validity for the requested product",
                });
              }
            } else {
              reject({
                status: 200,
                success: false,
                message: "No milkcard found for the product",
              });
            }
          } else {
            reject({
              status: 200,
              success: false,
              message: "No milkcard found for the customer",
            });
          }
        }

        if (req.body.paymentMethod === "token") {
          const item = req.body.orderitems[0];
          let result = await ProductToken.findOne({
            customer,
            product: item.product,
          });
          if (result) {
            if (result.quantity >= item.quantity) {
              const updatedQuantity = result.quantity - item.quantity;
              await ProductToken.findByIdAndUpdate(
                result._id,
                { quantity: updatedQuantity },
                { new: true, useFindAndModify: false }
              );
              await createOrder();
            } else {
              reject({
                status: 200,
                success: false,
                message:
                  "No token available for the requested product quantity",
              });
            }
          } else {
            reject({
              status: 200,
              success: false,
              message: "No token found for the product",
            });
          }
        }

        if (
          req.body.paymentMethod === "cash" ||
          req.body.paymentMethod === "card" ||
          req.body.paymentMethod === "upi"
        ) {
          await createOrder();
        }
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

const ListOrders = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.store;

    if (validParams) {
      try {
        let orders = await Order.find({ store: req.body.store })
          .populate({
            path: "orderitems",
            populate: {
              path: "product",
            },
          })
          .populate("store")
          .populate("customer")
          .populate("ordercredit")
          .sort({ createdat: -1 })
          .then((data) => {
            resolve({
              status: 200,
              success: true,
              message: "Order list",
              orders: data,
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
        orders: data.orders,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const DashboardDetails = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token;

    if (validParams) {
      try {
        let newdate = new Date();
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

        let todaySales = 0;
        let todayOrders = 0;
        let totalStores = 0;

        await Order.aggregate([
          {
            $match: { createdat: { $gte: start, $lt: end } },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          todaySales = sales;
        });

        todayOrders = await Order.find({
          createdat: { $gte: start, $lt: end },
        }).count();
        totalStores = await Store.find({}).count();

        let data = {
          todayOrders,
          totalStores,
          todaySales,
        };

        resolve({ status: 200, success: true, message: "Order list", data });
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
        data: data.data,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ListOrdersbyDate = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.store;

    if (validParams) {
      try {
        let newdate = req.body.date;
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

        let orders = await Order.find({
          store: req.body.store,
          createdat: { $gte: start, $lt: end },
        })
          .populate({
            path: "orderitems",
            select: "product totalamount quantity",
            populate: {
              path: "product",
              select: "name quantity unit milktype",
            },
          })
          .populate("store", "name location")
          .populate("customer", "name phone nickname")
          .populate("ordercredit", "reason")
          .sort({ createdat: -1 })
          .then((data) => {
            resolve({
              status: 200,
              success: true,
              message: "Order list",
              orders: data,
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
        orders: data.orders,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const TodayOrders = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.store;

    if (validParams) {
      try {
        let newdate = new Date();
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));
        await Order.find({
          store: req.body.store,
          createdat: { $gte: start, $lt: end },
        })
          .populate({
            path: "orderitems",
            select: "product totalamount",
            populate: {
              path: "product",
              select: "name quantity unit milktype",
            },
          })
          .populate("store", "name location")
          .populate("customer", "name phone nickname")
          .populate("ordercredit", "reason")
          .sort({ createdat: -1 })
          .then((data) => {
            resolve({
              status: 200,
              success: true,
              message: "Order list",
              orders: data,
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
        orders: data.orders,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ViewUserPastSales = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    const validParams = req.body.user && req.body.date && req.headers.token;
    const token = req.headers.token;

    if (validParams) {
      const checkAccess = await helper.verifyAdminToken(token);

      if (checkAccess) {
        try {
          let newdate = req.body.date;
          const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
          const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

          let totalcredit = 0;
          let totalfree = 0;
          let totalcash = 0;
          let totalcard = 0;
          let totalupi = 0;
          let totaltoken = 0;
          let totalmilkcard = 0;

          await Order.aggregate([
            {
              $match: {
                paymentMethod: "credit",
                user: ObjectId(req.body.user),
                createdat: { $gte: start, $lt: end },
              },
            },
            {
              $group: {
                _id: 1,
                sum: { $sum: "$totalamount" },
              },
            },
          ]).then((data) => {
            let sales = 0;
            if (data.length) {
              sales = data[0].sum + sales;
            }
            totalcredit = sales;
          });

          await Order.aggregate([
            {
              $match: {
                paymentMethod: "free",
                user: ObjectId(req.body.user),
                createdat: { $gte: start, $lt: end },
              },
            },
            {
              $group: {
                _id: 1,
                sum: { $sum: "$totalamount" },
              },
            },
          ]).then((data) => {
            let sales = 0;
            if (data.length) {
              sales = data[0].sum + sales;
            }
            totalfree = sales;
          });

          await Order.aggregate([
            {
              $match: {
                paymentMethod: "cash",
                user: ObjectId(req.body.user),
                createdat: { $gte: start, $lt: end },
              },
            },
            {
              $group: {
                _id: 1,
                sum: { $sum: "$totalamount" },
              },
            },
          ]).then((data) => {
            let sales = 0;
            if (data.length) {
              sales = data[0].sum + sales;
            }
            totalcash = sales;
          });

          await Order.aggregate([
            {
              $match: {
                paymentMethod: "card",
                user: ObjectId(req.body.user),
                createdat: { $gte: start, $lt: end },
              },
            },
            {
              $group: {
                _id: 1,
                sum: { $sum: "$totalamount" },
              },
            },
          ]).then((data) => {
            let sales = 0;
            if (data.length) {
              sales = data[0].sum + sales;
            }
            totalcard = sales;
          });

          await Order.aggregate([
            {
              $match: {
                paymentMethod: "upi",
                user: ObjectId(req.body.user),
                createdat: { $gte: start, $lt: end },
              },
            },
            {
              $group: {
                _id: 1,
                sum: { $sum: "$totalamount" },
              },
            },
          ]).then((data) => {
            let sales = 0;
            if (data.length) {
              sales = data[0].sum + sales;
            }
            totalupi = sales;
          });

          await Order.aggregate([
            {
              $match: {
                paymentMethod: "token",
                user: ObjectId(req.body.user),
                createdat: { $gte: start, $lt: end },
              },
            },
            {
              $group: {
                _id: 1,
                sum: { $sum: "$totalamount" },
              },
            },
          ]).then((data) => {
            let sales = 0;
            if (data.length) {
              sales = data[0].sum + sales;
            }
            totaltoken = sales;
          });

          await Order.aggregate([
            {
              $match: {
                paymentMethod: "milkcard",
                user: ObjectId(req.body.user),
                createdat: { $gte: start, $lt: end },
              },
            },
            {
              $group: {
                _id: 1,
                sum: { $sum: "$totalamount" },
              },
            },
          ]).then((data) => {
            let sales = 0;
            if (data.length) {
              sales = data[0].sum + sales;
            }
            totalmilkcard = sales;
          });

          const stats = {
            totalcredit,
            totalfree,
            totalcash,
            totalcard,
            totalupi,
            totaltoken,
            totalmilkcard,
          };
          const orders = await Order.find({
            user: req.body.user,
            createdat: { $gte: start, $lt: end },
          })
            .populate({
              path: "orderitems",
              populate: {
                path: "product",
              },
            })
            .populate("customer")
            .populate("store")
            .populate("ordercredit")
            .sort({ createdat: -1 });

          resolve({
            status: 200,
            success: true,
            message: "Users list",
            orders,
            stats,
          });
        } catch (error) {
          reject({ status: 200, success: false, message: error.message });
        }
      } else {
        reject({
          status: 200,
          success: false,
          message: "Admin does not exist",
        });
      }
    } else {
      reject({ status: 200, success: false, message: "Provide Valid data" });
    }
  });

  promise

    .then(function (data) {
      res.status(data.status).send({
        success: data.success,
        message: data.message,
        orders: data.orders,
        stats: data.stats,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const TodayOrderDetails = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token;

    if (validParams) {
      try {
        let newdate = new Date();
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

        let totalcredit = 0;
        let totalfree = 0;
        let totalcash = 0;
        let totalcard = 0;
        let totalupi = 0;
        let totaltoken = 0;
        let totalmilkcard = 0;

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "credit",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalcredit = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "free",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalfree = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "cash",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalcash = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "card",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalcard = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "upi",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalupi = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "token",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totaltoken = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "milkcard",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalmilkcard = sales;
        });

        let data = {
          totalcredit,
          totalfree,
          totalcash,
          totalcard,
          totalupi,
          totaltoken,
          totalmilkcard,
        };

        resolve({ status: 200, success: true, message: "Order list", data });
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
        data: data.data,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const ListOrdersbyCustomer = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.body.customer;

    if (validParams) {
      try {
        let orders = await Order.find({ customer: req.body.customer })
          .select("orderid store subtotal totalamount paymentMethod createdat")
          .populate({
            path: "orderitems",
            select: "quantity totalamount product",
            populate: {
              path: "product",
              select: "milktype name quantity unit price",
            },
          })
          .populate("store", "name")
          .populate("customer", "name phone email nickname")
          .populate("ordercredit", "reason")
          .sort({ createdat: -1 })
          .then((data) => {
            resolve({
              status: 200,
              success: true,
              message: "Order list",
              orders: data,
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
        orders: data.orders,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const OverallTodayOrderDetails = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token;

    if (validParams) {
      try {
        let newdate = new Date();
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

        let totalcredit = 0;
        let totalfree = 0;
        let totalcash = 0;
        let totalcard = 0;
        let totalupi = 0;
        let totaltoken = 0;
        let totalmilkcard = 0;

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "credit",
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalcredit = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "free",
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalfree = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "cash",
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalcash = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "card",
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalcard = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "upi",
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalupi = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "token",
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totaltoken = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "milkcard",
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalmilkcard = sales;
        });

        let data = {
          totalcredit,
          totalfree,
          totalcash,
          totalcard,
          totalupi,
          totaltoken,
          totalmilkcard,
        };

        resolve({ status: 200, success: true, message: "Order list", data });
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
        data: data.data,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const DatewiseOrderDetails = async function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    let validParams = req.headers.token;

    if (validParams) {
      try {
        let newdate = req.body.date;
        const start = new Date(new Date(newdate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(newdate).setHours(23, 59, 59, 999));

        let totalcredit = 0;
        let totalfree = 0;
        let totalcash = 0;
        let totalcard = 0;
        let totalupi = 0;
        let totaltoken = 0;
        let totalmilkcard = 0;

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "credit",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalcredit = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "free",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalfree = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "cash",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalcash = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "card",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalcard = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "upi",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalupi = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "token",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totaltoken = sales;
        });

        await Order.aggregate([
          {
            $match: {
              paymentMethod: "milkcard",
              store: ObjectId(req.body.store),
              createdat: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: 1,
              sum: { $sum: "$totalamount" },
            },
          },
        ]).then((data) => {
          let sales = 0;
          if (data.length) {
            sales = data[0].sum + sales;
          }
          totalmilkcard = sales;
        });

        let data = {
          totalcredit,
          totalfree,
          totalcash,
          totalcard,
          totalupi,
          totaltoken,
          totalmilkcard,
        };

        resolve({ status: 200, success: true, message: "Order list", data });
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
        data: data.data,
      });
    })
    .catch(function (error) {
      res
        .status(error.status)
        .send({ success: error.success, message: error.message });
    });
};

const DeleteOrder = function (req, res) {
  const promise = new Promise(async function (resolve, reject) {
    // main code
    try {
      let validParams = req.body.order && req.headers.token;

      if (validParams) {
        await Order.deleteOne({ _id: req.body.order })
          .then(async () => {
            await Orderitems.deleteMany({ order: req.body.order });
          })
          .then(async () => {
            await Stock.deleteMany({ order: req.body.order });
          })
          .then(async (data) => {
            resolve({
              status: 200,
              success: true,
              message: "Order deleted successfully",
            });
          });
      } else {
        reject({
          status: 200,
          success: false,
          message: "Provide all necessary fields",
        });
      }
    } catch (error) {
      reject({ status: 200, success: false, message: error.message });
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

module.exports = {
  PlaceOrder,
  ListOrders,
  TodayOrders,
  DashboardDetails,
  ListOrdersbyDate,
  ViewUserPastSales,
  TodayOrderDetails,
  ListOrdersbyCustomer,
  OverallTodayOrderDetails,
  DatewiseOrderDetails,
  DeleteOrder
};

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductionSchema = new Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    batchnumber: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    labourcharges: {
      type: Number,
      required: true,
    },
    rawmaterials: {
      type: String,
      required: true,
    },
    preparationdate: {
      type: Date,
      required: true,
    },
    createdat: {
      type: Date,
      default: new Date(),
      required: true,
    },
  },
  {
    timezone: "Asia/Kolkata",
  }
);

module.exports = Production = mongoose.model("production", ProductionSchema);

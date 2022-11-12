const mongoose = require("mongoose");
const { FeedStocktype } = require("../common/constants");
const Schema = mongoose.Schema;

const FeedStockSchema = new Schema(
  {
    feed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "feed",
      required: true,
    },
    stocktype: {
      type: String,
      enum: FeedStocktype,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    entrydate: {
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

module.exports = FeedStock = mongoose.model("feedstock", FeedStockSchema);

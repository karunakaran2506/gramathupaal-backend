const mongoose = require("mongoose");
const { FeedUnit } = require("../common/constants");
const Schema = mongoose.Schema;

const FeedLedgerSchema = new Schema({
  feed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "feed",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalamount: {
    type: Number,
    required: true,
  },
  receivedamount: {
    type: Number,
    default: 0,
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
  billimage: {
    type: String,
    required: false,
    default: null,
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
});

module.exports = FeedLedger = mongoose.model("feedledger", FeedLedgerSchema);

const mongoose = require("mongoose");
const { FeedUnit } = require("../common/constants");
const Schema = mongoose.Schema;

const FeedSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      enum: FeedUnit,
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      required: true,
    },
    createdat: {
      type: Date,
      default: new Date(),
      required: true,
    },
  }
);

module.exports = Feed = mongoose.model("feed", FeedSchema);

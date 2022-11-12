const secret = 'gramathupaal@123';
const Cashmanagementtype = ["sales", "expenses"];
const Categorytype = ['milk', 'others'];
const Paymentmethod1 = [ 'credit', 'free', 'cash', 'card', 'upi', 'token', 'milkcard'];
const Paymentmethod2 = [ 'credit', 'free', 'cash', 'card', 'upi'];
const Milktype = ['buffalomilk', 'a1milk', 'a2milk'];
const Units = ['gram', 'kilogram', 'litre', 'millilitre', 'piece'];
const Stocktype = ['in', 'out', 'byproduct'];
const FeedStocktype = ["in", "out"];
const FeedUnit = ["kilogram", "pack", "tonnage"];
const Usertypes = ['Superadmin', 'Storeclerk', 'Customer', 'Deliveryman', 'Milkentryman'];
const CowType = ['cow', , 'hiefer', 'calf'];
const CowGender = ['male', 'female'];
const MediaContentTypes = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

module.exports = {
  secret,
  Cashmanagementtype,
  Categorytype,
  Paymentmethod1,
  Paymentmethod2,
  Milktype,
  Units,
  Stocktype,
  FeedStocktype,
  Usertypes,
  CowType,
  CowGender,
  FeedUnit,
  MediaContentTypes,
};
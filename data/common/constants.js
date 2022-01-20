const secret = 'gramathupaal@123';
const Cashmanagementtype = ["sales", "expenses"];
const Categorytype = ['milk', 'others'];
const Paymentmethod1 = [ 'credit', 'free', 'cash', 'card', 'upi', 'token', 'milkcard'];
const Paymentmethod2 = [ 'credit', 'free', 'cash', 'card', 'upi'];
const Milktype = ['buffalomilk', 'a1milk', 'a2milk'];
const Units = ['gram', 'kilogram', 'litre', 'millilitre', 'piece'];
const Stocktype = ['in', 'out', 'byproduct'];
const Usertypes = ['Superadmin', 'Storeclerk', 'Customer', 'Deliveryman'];

module.exports = {
    secret,
    Cashmanagementtype,
    Categorytype,
    Paymentmethod1,
    Paymentmethod2,
    Milktype,
    Units,
    Stocktype,
    Usertypes
}
const router = require('express').Router();
const UserController = require('../controllers/UserController');
const StoreController = require('../controllers/StoreController');
const CategoryController = require('../controllers/CategoryController');
const ProductController = require('../controllers/ProductController');
const OrderController = require('../controllers/OrderController');
const CostManagementController = require('../controllers/CostManagementController');
const StockManagementController = require('../controllers/StockManagementController');
const UserSessionController = require('../controllers/UserSessionController');
const MilkcardController = require('../controllers/MilkcardController');
const ProducttokenController = require('../controllers/ProducttokenController');
const SubscriptionController = require('../controllers/SubscriptionController');
const LeadsController = require('../controllers/LeadsController');
const MilkSupplyController = require('../controllers/MilkSupplyController');
const CowController = require('../controllers/CowController');
const ProductionController = require("../controllers/ProductionController");
const FeedController = require("../controllers/FeedController");

// User Functions
router.post('/adminLogin', UserController.AdminLogin);

router.post('/userLogin', UserController.UserLogin);
router.post('/userSignup', UserController.UserSignUp);
router.post('/userSignupWithImage', UserController.uploadImg, UserController.UserSignupWithImage);
router.post('/viewUsers', UserController.ViewUsersbyStore);
router.post('/viewUserDetails', UserController.ViewUserDetails);
router.post('/editUser', UserController.uploadImg, UserController.EditUser);
router.post('/editUserWithoutImage', UserController.uploadImg, UserController.EditUserWithoutImage);
router.post('/viewUserPastSessions', UserController.ViewUserPastSessions);
router.post('/deleteUser', UserController.DeleteUser);

router.post("/customerLogin", UserController.CustomerLogin);
router.post("/customerSignUp", UserController.CustomerSignUp); 
router.post('/editCustomer', UserController.EditCustomer);
router.get('/viewCustomerbyStore', UserController.ViewCustomerbyStore);
router.post("/editCustomerDetails", UserController.EditCustomerDetails);
router.post("/editCustomerLocation", UserController.EditCustomerLocation);
router.post('/viewCustomerAddress', UserController.ViewCustomerAddress);

router.post('/deliveryUserSignup', UserController.CreateDeliveryUser);
router.post('/editDeliveryUser', UserController.EditDeliveryUser);
router.post('/viewDeliverymanbyStore', UserController.ViewDeliverymanbyStore);
router.post('/deliveryLogin', UserController.DeliveryManLogin);

router.post('/createMilkentryman', UserController.CreateMilkentryman);
router.post('/milkentrymanLogin', UserController.MilkentrymanLogin);
router.post('/editMilkentryman', UserController.EditMilkentryman);
router.post('/viewMilkentrymanbyStore', UserController.ViewMilkentrymanbyStore);

// Store Functions 
router.post('/createStore', StoreController.CreateStore);
router.get('/listStores', StoreController.ListStores);

// Category function
router.post('/createCategory', CategoryController.CreateCategory);
router.post('/listCategory', CategoryController.ListCategory);

// Product function
router.post('/createProduct', ProductController.uploadImg, ProductController.CreateProduct);
router.post('/listProduct', ProductController.ListProduct);
router.post("/deleteProduct", ProductController.DeleteProduct);
router.post('/editProduct', ProductController.uploadImg, ProductController.EditProduct);
router.post('/editProductwithoutImage', ProductController.uploadImg, ProductController.EditProductwithoutImage);

// Order function
router.post('/placeOrder', OrderController.PlaceOrder);
router.post('/listOrders', OrderController.ListOrders);
router.post('/todayOrders', OrderController.TodayOrders);
router.post('/listOrdersbyDate', OrderController.ListOrdersbyDate);
router.get('/dashboarDetails', OrderController.DashboardDetails);
router.post('/viewUserPastSales', OrderController.ViewUserPastSales);
router.post('/todayOrderDetails', OrderController.TodayOrderDetails);
router.post('/listOrdersbyCustomer', OrderController.ListOrdersbyCustomer);
router.get('/overallTodayOrderDetails', OrderController.OverallTodayOrderDetails);
router.post('/datewiseOrderDetails', OrderController.DatewiseOrderDetails);
router.post("/deleteOrder", OrderController.DeleteOrder);

// Cost entry functions
router.post('/saveCostEntry', CostManagementController.SaveCostEntry);
router.post('/listEntries', CostManagementController.ListEntries);

// Stock entry functions
router.post('/saveStockEntry', StockManagementController.SaveStockEntry);
router.post('/listAllStockEntries', StockManagementController.ListAllStockEntries);
router.post('/listTodayStockEntries', StockManagementController.ListTodayStockEntries);
router.post('/listTodayStockEntriesbyProduct', StockManagementController.ListTodayStockEntriesbyProduct);
router.post('/listStockEntriesByProduct', StockManagementController.ListStockEntriesByProducts);
router.post('/listStockEntriesByDate', StockManagementController.ListStockEntriesByDate);
router.post('/listTodayStockBalance', StockManagementController.ListTodayStockBalance);
router.post('/listUserwiseStockEntries', StockManagementController.ListUserwiseStockEntries);

// User Session function
router.post('/createSession', UserSessionController.CreateSession);
router.post('/listSessionbyUser', UserSessionController.ListSessionbyUser);

// Milk card function
router.post('/createMilkcard', MilkcardController.CreateMilkcard);
router.post('/createMilkcardEntry', MilkcardController.CreateMilkcardEntry);
router.get('/listMilkcard', MilkcardController.ListMilkcard);
router.post('/listMilkcardEntrybyCustomer', MilkcardController.ListMilkcardEntrybyCustomer);
router.post('/listMilkcardHistorybyStore', MilkcardController.ListMilkcardHistorybyStore);

router.post('/editMilkcard', MilkcardController.EditMilkcard);
router.post('/deleteMilkcard', MilkcardController.DeleteMilkcard);

// Product Token functions
router.post('/createProductToken', ProducttokenController.CreateProductToken);
router.post('/listProductTokenbyCustomer', ProducttokenController.ListProductTokenbyCustomer);
router.post('/listProductTokenbyStore', ProducttokenController.ListProductTokenbyStore);
router.post('/listTokenHistorybyStore', ProducttokenController.ListTokenHistorybyStore);

// Subscription order function
router.post('/createSubscriptionorder', SubscriptionController.CreateSubscriptionorder); 
router.post('/editSubscriptionorder', SubscriptionController.EditSubscriptionorder); 
router.post('/createSubscriptionpack', SubscriptionController.CreateSubscriptionpack);
router.post('/editSubscriptionpack', SubscriptionController.EditSubscriptionpack);
router.post('/deactivateSubscriptionorder', SubscriptionController.DeactivateSubscriptionorder);
router.post('/listSubscriptionorderbyCustomer', SubscriptionController.ListSubscriptionorderbyCustomer);
router.get('/listSubscriptionpack', SubscriptionController.ListSubscriptionpack);
router.post('/listSubscriptionHistorybyStore', SubscriptionController.ListSubscriptionHistorybyStore);
router.post('/listActiveSubscriptionorderbyStore', SubscriptionController.ListActiveSubscriptionorderbyStore);
router.post('/listActiveSubscriptionorderbyDeliveryMan', SubscriptionController.ListActiveSubscriptionorderbyDeliveryMan);
router.post('/createDeliveryavailablity', SubscriptionController.CreateDeliveryavailablity);
router.get('/listordersbyDeliveryman', SubscriptionController.ListordersbyDeliveryman);
router.post('/createDeliveryEntry', SubscriptionController.CreateDeliveryEntry);
router.post('/milkSupplyEntry', MilkSupplyController.MilkSupplyEntry);
router.post('/listTodayMilkSupplies', MilkSupplyController.ListTodayMilkSupplies);
router.get('/getMilkSupplybyDeliveryman', MilkSupplyController.GetMilkSupplybyDeliveryman);
router.get("/listDeliveryEntries", SubscriptionController.ListDeliveryEntries);
router.post("/listDeliveryEntriesbyDate", SubscriptionController.ListDeliveryEntriesbyDate);
router.post("/viewDeliveryHistory", SubscriptionController.ViewDeliveryHistory);
router.post('/activeSubscriptionordersbyDeliveryMan', SubscriptionController.ActiveSubscriptionsByDeliveryman);


// Leads function
router.post('/createLead', LeadsController.CreateLead);
router.post('/editLead', LeadsController.EditLead);
router.post('/listLeads', LeadsController.ListLeads);

// Cow functions
router.post('/addCow', CowController.AddCow);
router.post('/editCow', CowController.EditCow);
router.post("/deleteCow", CowController.DeleteCow);
router.post('/listCow', CowController.ViewCow);
router.post('/listCowbyStore', CowController.ViewCowbyStore);

router.post('/addVaccination', CowController.AddVaccination);
router.post('/addCowWeight', CowController.AddCowWeight);

router.post('/addCowMilk', CowController.AddCowMilk);
router.post('/viewCowMilkEntrybyDate', CowController.ViewCowMilkEntrybyDate);

router.post('/addCowDewarming', CowController.AddCowDewarming);
router.post('/addCowHeat', CowController.AddCowHeat);
router.post('/addCowTeeth', CowController.AddCowTeeth);

router.post('/viewCowMilkEntry', CowController.ViewCowMilkEntry);
router.post('/addCowMilkentry', CowController.AddCowMilkEntry);

// Production function
router.post("/createProduction", ProductionController.CreateProduction);
router.post("/listProduction", ProductionController.ListProduction);
router.post("/editProduction", ProductionController.EditProduction);

// Stock function
router.post("/saveFeedStockEntry", FeedController.SaveFeedStockEntry);
router.post("/listFeedStock", FeedController.ListFeedStockEntriesByDate);
router.post("/createFeed", FeedController.CreateFeed);
router.post("/listFeed", FeedController.ListFeed);
router.post("/saveFeedLedgerEntry", FeedController.SaveFeedLedgerEntry);
router.post("/listFeedLedger", FeedController.ListFeedLedgerEntriesByDate);
router.post("/updateBalance", FeedController.UpdateBalance);
router.post("/listAllFeedStock", FeedController.ListAllFeedStock);

// Customer function
router.post("/listCustomerProductToken", ProducttokenController.ListCustomerProductToken);
router.post("/customerMilkcard", MilkcardController.CustomerActiveMilkcard);
router.post("/listActiveSubscription", SubscriptionController.ListActiveSubscriptionorderbyCustomer);
;;

module.exports = router;
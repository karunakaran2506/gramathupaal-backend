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

// User Functions
router.post('/userLogin', UserController.UserLogin);
router.post('/userSignup', UserController.UserSignUp);
router.post('/userSignupWithImage', UserController.uploadImg, UserController.UserSignupWithImage);
router.post('/adminLogin', UserController.AdminLogin);
router.post('/viewUsers', UserController.ViewUsersbyStore);
router.post('/viewUserDetails', UserController.ViewUserDetails);
router.post('/editUser', UserController.uploadImg, UserController.EditUser);
router.post('/editUserWithoutImage', UserController.uploadImg, UserController.EditUserWithoutImage);
router.post('/viewUserPastSessions', UserController.ViewUserPastSessions);
router.post('/deleteUser', UserController.DeleteUser);
router.post('/customerSignUp', UserController.CustomerSignUp); 
router.post('/editCustomer', UserController.EditCustomer); 
router.get('/viewCustomerbyStore', UserController.ViewCustomerbyStore);
router.post('/deliveryUserSignup', UserController.CreateDeliveryUser);
router.post('/editDeliveryUser', UserController.EditDeliveryUser);
router.post('/viewDeliverymanbyStore', UserController.ViewDeliverymanbyStore);
router.post('/deliveryLogin', UserController.DeliveryManLogin);
router.post('/viewCustomerAddress', UserController.ViewCustomerAddress);

// Store Functions 
router.post('/createStore', StoreController.CreateStore);
router.get('/listStores', StoreController.ListStores);

// Category function
router.post('/createCategory', CategoryController.CreateCategory);
router.post('/listCategory', CategoryController.ListCategory);

// Product function
router.post('/createProduct', ProductController.uploadImg, ProductController.CreateProduct);
router.post('/listProduct', ProductController.ListProduct);
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

// User Session function
router.post('/createSession', UserSessionController.CreateSession);
router.post('/listSessionbyUser', UserSessionController.ListSessionbyUser);

// Milk card function
router.post('/createMilkcard', MilkcardController.CreateMilkcard);
router.post('/createMilkcardEntry', MilkcardController.CreateMilkcardEntry);
router.get('/listMilkcard', MilkcardController.ListMilkcard);
router.post('/listMilkcardEntrybyCustomer', MilkcardController.ListMilkcardEntrybyCustomer);
router.post('/listMilkcardHistorybyStore', MilkcardController.ListMilkcardHistorybyStore);

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
router.post('/createDeliveryavailablity', SubscriptionController.CreateDeliveryavailablity);
router.get('/listordersbyDeliveryman', SubscriptionController.ListordersbyDeliveryman);
router.post('/createDeliveryEntry', SubscriptionController.CreateDeliveryEntry);

// Leads function
router.post('/createLead', LeadsController.CreateLead);
router.post('/editLead', LeadsController.EditLead);
router.post('/listLeads', LeadsController.ListLeads);

module.exports = router;
const router = require('express').Router();

const UserController = require('../controllers/UserController');
const StoreController = require('../controllers/StoreController');
const CategoryController = require('../controllers/CategoryController');
const ProductController = require('../controllers/ProductController');
const OrderController = require('../controllers/OrderController');
const CostManagementController = require('../controllers/CostManagementController');

// User Functions
router.post('/userLogin', UserController.UserLogin);
router.post('/userSignup', UserController.UserSignUp);

// Store Functions 
router.post('/createStore', StoreController.CreateStore);
router.get('/listStores', StoreController.ListStores);

// Category function
router.post('/createCategory', CategoryController.CreateCategory);
router.post('/listCategory', CategoryController.ListCategory);

// Product function
router.post('/createProduct', ProductController.CreateProduct);
router.post('/listProduct', ProductController.ListProduct);

// Order function
router.post('/placeOrder', OrderController.PlaceOrder);
router.post('/listOrders', OrderController.ListOrders);


// Cost entry functions
router.post('/saveCostEntry', CostManagementController.SaveCostEntry);

module.exports = router;
const {Router}  = require('express')
const authmiddleware = require('../middleware/auth.middleware')
const transactionController = require('../controllers/transaction.controller')
const transactionRoutes = Router();

transactionRoutes.post('/',authmiddleware.authMiddleware,transactionController.createTransaction)

transactionRoutes.post('/system/initial-fund',authmiddleware.authMiddleware,transactionController.creatInitialFundsTransaction)

transactionRoutes.get("/recent-transactions",authmiddleware.authMiddleware,transactionController.getRecentTransaction)

module.exports = transactionRoutes;
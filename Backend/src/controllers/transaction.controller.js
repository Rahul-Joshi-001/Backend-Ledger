const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')


const emailService = require('../services/email.service')
/**
 * * - Create a new transaction
 * The 10 step transfer flow
    * 1 - validate request
    * 2 - vaidate idempotency key
    * 3 - check account status
    * 4 - derive sender balance from ledger
    * 5 - create trasnaction(pending)
    * 6 - create debit ledger entry
    * 7 - create credit ledger entry
    * 8 - mark transaction complelted 
    * 9 - commit mongoDB session
    * 10 - send email notification
 */

async function createTransaction(req,res){
    
    const {fromAccount,toAccount,amount,idempotencyKey} = req.body;

    

}
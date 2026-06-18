const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const accountModel = require('../models/account.model')
const emailService = require('../services/email.service')

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


// VALIDATE REQUEST

    const {fromAccount,toAccount,amount,idempotencyKey} = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"FromAccount , toAccount , amount , idempotencyKey is required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id:fromAccount,
    })
    const toUserAccount = await accountModel.findOne({
        _id:toAccount,
    })

    if(!fromUserAccount || toUserAccount){
        return res.status(400).json({
            message:"Invalid fromAccount or toAccount",
        })
    }

// VALIDATE IDEMPOTENCY KEY

    const isTransactionAlreadyExist = await transactionModel.findOne({
        idempotencyKey:idempotencyKey,
    })

    if(isTransactionAlreadyExist){
        if(isTransactionAlreadyExist.status == "COMPLETED"){
            return res.status(200).json({
                message:"Transaction is Completed",
                transaction: isTransactionAlreadyExist
            })
        }
        if(isTransactionAlreadyExist.status == "PENDING"){
            return res.status(200).json({
                message:"Transaction is still processing",
            })
        }
        if(isTransactionAlreadyExist.status == "FAILED"){
            return res.status(500).json({
                message:"Transaction processing failed"
            })
        }
        if(isTransactionAlreadyExist.status == 'REVERSED'){
            return res.status(500).json({
                message:"Transaction is Reversed ! Retry"
            })
        }
    }

// CHECK ACCOUNT STATUS

    if(fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE'){
        return res.status(400).json({
            message:"Both Account should be Active"
        })
    }

}

module.exports = {createTransaction}
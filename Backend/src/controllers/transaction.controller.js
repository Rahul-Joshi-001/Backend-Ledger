const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const accountModel = require('../models/account.model')
const mongoose = require('mongoose')
const emailService = require('../services/email.service')
const userModel = require('../models/user.model')

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

async function createTransaction(req, res) {


    // VALIDATE REQUEST

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "FromAccount , toAccount , amount , idempotencyKey is required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    })
    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount",
        })
    }

    // VALIDATE IDEMPOTENCY KEY

    const isTransactionAlreadyExist = await transactionModel.findOne({
        idempotencyKey: idempotencyKey,
    })

    if (isTransactionAlreadyExist) {
        if (isTransactionAlreadyExist.status == "COMPLETED") {
            return res.status(200).json({
                message: "Transaction is Completed",
                transaction: isTransactionAlreadyExist
            })
        }
        if (isTransactionAlreadyExist.status == "PENDING") {
            return res.status(200).json({
                message: "Transaction is still processing",
            })
        }
        if (isTransactionAlreadyExist.status == "FAILED") {
            return res.status(500).json({
                message: "Transaction processing failed"
            })
        }
        if (isTransactionAlreadyExist.status == 'REVERSED') {
            return res.status(500).json({
                message: "Transaction is Reversed ! Retry"
            })
        }
    }

    // CHECK ACCOUNT STATUS

    if (fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE') {
        return res.status(400).json({
            message: "Both Account should be Active"
        })
    }

    // DERIVE SENDER BALANCE FROM LEDGER 

    const balance = await fromUserAccount.getBalance()

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient Balance. Current Balance is ${balance}. Requested amount is ${amount}`,
        })
    }

    // CREATE TRANSACTION PENDING
    let transaction
    try {

        const session = await mongoose.startSession()
        session.startTransaction()

        transaction = (await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session }))[0]

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session })

        const CreditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })

        transaction.status = "COMPLETED"

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )

        await session.commitTransaction()
        session.endSession()
    }
    catch (error) {
        return res.status(400).json({
            message: "Transaction is pending due to some issues",
        })
    }

    // SENDING MAIL 

    await emailService.sendTransaction(req.user.email, req.user.name, amount, toAccount)

    return res.status(200).json({
        message: "Transaction is Completed",
        transaction: transaction
    })
}

async function creatInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

    const systemUser = await userModel.findOne({
        systemUser: true
    }).select("+systemUser")

    if (!systemUser) {
        return res.status(400).json({
            message: "System user not found"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: systemUser._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System account not found"
        })
    }

    const systemBalance = await fromUserAccount.getBalance()

    if (systemBalance < amount) {
        return res.status(400).json({
            message: "System account has insufficient funds"
        })
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const transaction = (await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session }))[0]

        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session })

        await ledgerModel.create([{
            account: toAccount,
            amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })

        await transactionModel.findByIdAndUpdate(
            transaction._id,
            { status: "COMPLETED" },
            { session }
        )

        await session.commitTransaction()
        session.endSession()

        await emailService.sendTransaction(
            req.user.email,
            req.user.name,
            amount,
            toAccount
        )

        return res.status(200).json({
            message: "Initial funds transaction completed successfully",
            transaction
        })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()

        return res.status(500).json({
            message: "Transaction failed",
            error: error.message
        })
    }
}

module.exports = { createTransaction, creatInitialFundsTransaction }
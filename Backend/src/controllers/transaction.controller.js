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

    const { fromAccount, email, amount, idempotencyKey } = req.body;

    if (!fromAccount || !email || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "fromAccount, email, amount and idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
        user: req.user._id
    })

    const receiverUser = await userModel.findOne({
        email
    });

    if (!receiverUser) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (req.user.email === email) {
        return res.status(400).json({
            message: "You cannot transfer money to yourself"
        });
    }

    const toUserAccount = await accountModel.findOne({
        user: receiverUser._id
    });


    if (!fromUserAccount) {
        return res.status(400).json({
            message: "Invalid sender account"
        })
    }

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Receiver account not found"
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
    let session
    try {

        session = await mongoose.startSession()
        session.startTransaction()

        transaction = (await transactionModel.create([{
            fromAccount,
            toAccount: toUserAccount._id,
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
            account: toUserAccount._id,
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

        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        return res.status(500).json({
            message: "Transaction failed",
            error: error.message
        });
    }

    // SENDING MAIL 

    await emailService.sendTransaction(
        req.user.email,
        req.user.name,
        amount,
        email
    )

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
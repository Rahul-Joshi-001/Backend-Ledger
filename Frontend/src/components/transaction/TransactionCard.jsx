import React from "react";

const TransactionCard = ({ transaction }) => {
    const isCredit = transaction.type === "CREDIT";

    return (
        <div
            className={`rounded-xl border p-3 ${
                isCredit
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
            }`}
        >
            {/* Top */}

            <div className="flex justify-between items-center">

                <h3
                    className={`text-xl font-bold ${
                        isCredit
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                >
                    {isCredit ? "+" : "-"}₹{transaction.amount}
                </h3>

                <p className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                </p>

            </div>

            {/* Middle */}

            <div className="flex items-center gap-2 mt-2 text-sm">

                <span className="font-semibold">
                    {transaction.from.name}
                </span>

                <span className="text-gray-400">
                    →
                </span>

                <span className="font-semibold">
                    {transaction.to.name}
                </span>

            </div>

            {/* Bottom */}

            <p className="text-xs text-gray-400 mt-2">
                Txn ID: {transaction.transactionId.slice(-8)}
            </p>

        </div>
    );
};

export default TransactionCard;
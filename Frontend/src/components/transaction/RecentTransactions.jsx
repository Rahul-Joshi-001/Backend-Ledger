import React from "react";
import TransactionCard from "./TransactionCard";

const RecentTransactions = ({ transactions }) => {
    return (
       <div className="bg-white rounded-2xl shadow-lg p-6 h-[460px] flex flex-col">

            {/* Header */}

            <div className="flex justify-between items-center mb-5">

                <div>
                    <h2 className="text-2xl font-bold text-indigo-600">
                        Recent Transactions
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Your latest account activity
                    </p>
                </div>

                <span className="bg-indigo-100 text-indigo-600 text-sm font-semibold px-3 py-1 rounded-full">
                    {transactions.length}
                </span>

            </div>

            {transactions.length === 0 ? (

                <div className="h-72 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl">

                    <div className="text-5xl">
                        💳
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-700">
                        No Transactions Yet
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                        Your recent transfers will appear here.
                    </p>

                </div>

            ) : (

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">

                    {transactions.map((transaction) => (

                        <TransactionCard
                            key={transaction.transactionId}
                            transaction={transaction}
                        />

                    ))}

                </div>

            )}

        </div>
    );
};

export default RecentTransactions;
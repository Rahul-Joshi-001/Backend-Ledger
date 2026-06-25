import React from "react";

const DashboardCards = ({ account, balance }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            {/* Balance Card */}

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-lg">
                <p className="text-gray-300 text-sm">
                    Current Balance
                </p>

                <h2 className="text-3xl font-bold text-white mt-2">
                    ₹ {balance}
                </h2>

                <div className="mt-3">
                    <p className="text-xs text-gray-400">
                        Account ID
                    </p>

                    <div className="mt-1 bg-black/20 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-200 truncate">
                            {account?._id}
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Card */}

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-lg">
                <p className="text-gray-300 text-sm">
                    Account Status
                </p>

                <h2 className="text-2xl font-bold text-green-400 mt-2">
                    {account?.status}
                </h2>

                <p className="text-sm text-gray-300 mt-4">
                    Your account is active and ready for transactions.
                </p>
            </div>

            {/* Currency Card */}

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-lg">
                <p className="text-gray-300 text-sm">
                    Currency
                </p>

                <h2 className="text-2xl font-bold text-purple-300 mt-2">
                    {account?.currency}
                </h2>

                <p className="text-sm text-gray-300 mt-4">
                    All transactions are processed in this currency.
                </p>
            </div>

        </div>
    );
};

export default DashboardCards;
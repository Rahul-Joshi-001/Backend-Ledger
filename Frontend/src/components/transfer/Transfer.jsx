import React from "react";

const Transfer = ({
    email,
    setemail,
    amount,
    setAmount,
    handleTransfer,
    sending,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 h-[460px] flex flex-col">

            <div className="mb-5">
                <h2 className="text-2xl font-bold text-indigo-600">
                    Transfer Money
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Send money securely to another account.
                </p>
            </div>

            <form
                onSubmit={handleTransfer}
                className="space-y-4"
            >

                {/* Recipient */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Amount */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                    </label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="₹ 0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={sending}
                    className={`w-full py-3 rounded-xl font-semibold transition duration-200 ${
                        sending
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                >
                    {sending ? "Sending..." : "Send Money"}
                </button>

            </form>

            <div className="mt-5 border-t pt-4">
                <p className="text-xs text-gray-500">
                    ✔ Secure transfers
                </p>

                <p className="text-xs text-gray-500 mt-1">
                    ✔ Instant processing
                </p>

                <p className="text-xs text-gray-500 mt-1">
                    ✔ Encrypted transactions
                </p>
            </div>

        </div>
    );
};

export default Transfer;
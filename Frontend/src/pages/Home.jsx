import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserAccounts, getAccountBalance } from "../api/account";
import { createTransaction } from "../api/trasnsaction";
import { logoutUser } from "../api/auth";

const Home = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(0);

    const [email, setemail] = useState("");
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const accountRes = await getUserAccounts();

            const userAccount = accountRes.data.account[0];

            setAccount(userAccount);

            const balanceRes = await getAccountBalance(userAccount._id);

            setBalance(balanceRes.data.balance);
        } catch (error) {
            console.log(error);
            setIsError(true);
            setMessage("Failed to load account data");
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();

        if (sending) return;

        setSending(true);

        if (!email || !amount) {
            setIsError(true);
            setMessage("Please fill all fields");
            return;
        }

        try {
            const res = await createTransaction({
                fromAccount: account._id,
                email,
                amount: Number(amount),
                idempotencyKey: crypto.randomUUID(),
            });

            setIsError(false);
            setMessage(res.data.message);

            setemail("");
            setAmount("");

            fetchData();
        } catch (error) {
            setIsError(true);
            setMessage(
                error.response?.data?.message || "Transaction failed"
            );
        }
        finally {
            setSending(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.log(error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
                <h1 className="text-white text-3xl font-bold">
                    Loading...
                </h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                    <div>
                        <h1 className="text-5xl font-bold text-white">
                            Welcome {user?.name} 👋
                        </h1>

                        <p className="text-indigo-200 mt-2 text-lg">
                            Banking Ledger Dashboard
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Message */}

                {message && (
                    <div
                        className={`mb-6 p-4 rounded-2xl text-center font-medium ${isError
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-green-100 text-green-700 border border-green-300"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* Dashboard Cards */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-xl">
                        <p className="text-gray-300 text-sm">
                            Current Balance
                        </p>

                        <h2 className="text-4xl font-bold text-white mt-2">
                            ₹ {balance}
                        </h2>

                        <div className="mt-4">
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

                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-xl">
                        <p className="text-gray-300 text-sm">
                            Account Status
                        </p>

                        <h2 className="text-3xl font-bold text-green-400 mt-2">
                            {account?.status}
                        </h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-xl">
                        <p className="text-gray-300 text-sm">
                            Currency
                        </p>

                        <h2 className="text-3xl font-bold text-purple-300 mt-2">
                            {account?.currency}
                        </h2>
                    </div>
                </div>

                {/* Transfer Card */}

                <div className="grid md:grid-cols-2 gap-6">

                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <h2 className="text-3xl font-bold text-indigo-600 mb-2">
                            Transfer Money
                        </h2>

                        <p className="text-gray-500 mb-8">
                            Send money to another account securely.
                        </p>

                        <form
                            onSubmit={handleTransfer}
                            className="space-y-5"
                        >
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Recipient Email
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter recipient email"
                                    value={email}
                                    onChange={(e) =>
                                        setemail(e.target.value)
                                    }
                                    className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className={`w-full py-4 rounded-2xl font-semibold text-lg transition ${sending
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    }`}
                            >
                                {sending ? "Sending..." : "Send Money"}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <h2 className="text-3xl font-bold text-indigo-600 mb-6">
                            Recent Transactions
                        </h2>

                        <div className="flex items-center justify-center h-72 border-2 border-dashed border-gray-300 rounded-2xl">
                            <div className="text-center">
                                <p className="text-lg font-semibold text-gray-600">
                                    No Transactions Yet
                                </p>

                                <p className="text-sm text-gray-400 mt-2">
                                    Recent transfers will appear here.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserAccounts, getAccountBalance } from "../api/account";
import { createTransaction, getRecentTransactions } from "../api/trasnsaction";
import { logoutUser } from "../api/auth";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import MessageAlert from "../components/dashboard/MessageAlert";
import DashboardCards from "../components/dashboard/DashboardCards";
import Transfer from "../components/transfer/Transfer";
import RecentTransactions from "../components/transaction/RecentTransactions";

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
    const [transactions, setTransactions] = useState([]);

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

            const transactionRes = await getRecentTransactions();

            setTransactions(transactionRes.data.transactions);
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-5">
            <div className="max-w-7xl mx-auto">
                {/* Header */}

                <DashboardHeader
                    user={user}
                    handleLogout={handleLogout}
                />

                {/* Message */}

                <MessageAlert
                    message={message}
                    isError={isError}
                />

                {/* Dashboard Cards */}

                <DashboardCards
                    account={account}
                    balance={balance}
                />

                {/* Transfer Card */}

                <div className="grid md:grid-cols-2 gap-6">
                    <Transfer
                        email={email}
                        setemail={setemail}
                        amount={amount}
                        setAmount={setAmount}
                        handleTransfer={handleTransfer}
                        sending={sending}
                    />

                    <RecentTransactions
                        transactions={transactions}
                    />
                </div>

            </div>
        </div>
    );
};


export default Home;
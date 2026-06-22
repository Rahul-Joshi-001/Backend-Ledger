import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../api/account";

const CreateAccount = () => {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateAccount = async () => {
        try {
            setLoading(true);

            const res = await createAccount();

            setMessage("Account Created Successfully!");

            console.log(res.data);

            setTimeout(() => {
                navigate("/initial-funds", {
                    state: {
                        accountId: res.data.account._id,
                    },
                });
            }, 1000);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Failed to create account"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
                <h1 className="text-4xl font-bold text-center text-indigo-600 mb-2">
                    Create Account
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Create your first ledger account
                </p>

                {message && (
                    <div className="mb-4 p-3 rounded-xl text-center font-medium bg-green-100 text-green-700 border border-green-300">
                        {message}
                    </div>
                )}

                <button
                    onClick={handleCreateAccount}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition duration-300"
                >
                    {loading ? "Creating..." : "Create Account"}
                </button>
            </div>
        </div>
    );
};

export default CreateAccount;
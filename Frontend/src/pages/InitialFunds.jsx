import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createInitialFund } from "../api/trasnsaction";

const InitialFunds = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const accountId = location.state?.accountId;

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setIsError(true);
      setMessage("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await createInitialFund({
        toAccount: accountId,
        amount: Number(amount),
        idempotencyKey: crypto.randomUUID(),
      });

      setIsError(false);
      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error(error);

      setIsError(true);
      setMessage(
        error.response?.data?.message ||
          "Failed to add initial funds"
      );
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-2">
          Initial Funds
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Add funds to activate your account
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded-xl text-center font-medium border ${
              isError
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-green-100 text-green-700 border-green-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Enter Initial Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:bg-indigo-400"
          >
            {loading ? "Processing..." : "Add Initial Funds"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitialFunds;
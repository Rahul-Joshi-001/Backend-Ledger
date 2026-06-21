import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await registerUser(formData);
            localStorage.setItem("token", res.data.token);
            setMessage("Registration Successful!");
            setMessageType("success");
            setTimeout(() => {
                navigate("/create-account");
            }, 1000);
        } catch (error) {
            setMessage(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Something went wrong"
            );
            setMessageType("error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
                <h1 className="text-4xl font-bold text-center text-indigo-600 mb-2">
                    Create Account
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Welcome to your Ledger App
                </p>
                {message && (
                    <div
                        className={`mb-4 p-3 rounded-xl text-center font-medium ${messageType === "success"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                            }`}
                    >
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition duration-300"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
import React from "react";

const DashboardHeader = ({ user, handleLogout }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">

            {/* Welcome Section */}

            <div>
                <h1 className="text-4xl font-bold text-white">
                    Welcome, {user?.name} 👋
                </h1>

                <p className="text-indigo-200 mt-1">
                    Manage your account and transactions
                </p>
            </div>

            {/* Logout Button */}

            <button
                onClick={handleLogout}
                className="mt-4 md:mt-0 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg transition duration-200"
            >
                Logout
            </button>

        </div>
    );
};

export default DashboardHeader;
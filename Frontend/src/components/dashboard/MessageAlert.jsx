import React from "react";

const MessageAlert = ({ message, isError }) => {
    if (!message) return null;

    return (
        <div
            className={`mb-6 p-4 rounded-2xl text-center font-medium ${
                isError
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-green-100 text-green-700 border border-green-300"
            }`}
        >
            {message}
        </div>
    );
};

export default MessageAlert;
import { useState, useEffect } from "react";
import { handleDocumentQuery } from "../services/api";

export default function Chat({ documentId }) {
    const [query, setQuery] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [flashMessage, setFlashMessage] = useState("");

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true); // Set processing state
        setFlashMessage(""); // Clear any previous flash message

        try {
            const response = await handleDocumentQuery(documentId, query, setChatHistory, setIsProcessing, setFlashMessage);
            if (response.ok) {
                // Update chat history
                setChatHistory((prev) => [
                    ...prev,
                    { sender: "user", message: query },
                    { sender: "assistant", message: response.message },
                ]);
                setFlashMessage("");
            }
            else {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                throw new Error(errorData.detail || "Server error");
            } 
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "An error occurred. Please try again.";
            setFlashMessage(errorMsg);
        } finally {
            setIsProcessing(false); // Reset processing state
            setQuery(""); // Clear the input field
        }
    };

    // Clear flash message after 3 seconds
    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => {
                setFlashMessage("");
            }, 3000);

            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [flashMessage]);

    return (
        <div className="container mx-auto px-4 py-6 mt-4 bg-white rounded-lg max-w-6xl">
            {/* Flash Message */}
            {flashMessage && (
                <div className="mb-4 text-center text-white bg-red-500 p-2 rounded-lg">
                    {flashMessage}
                </div>
            )}

            {/* Chat History */}
            <div className="chat-history h-full border overflow-y-scroll mb-4 rounded-md p-4 bg-gray-50">
                {chatHistory.map((chat, index) => (
                    <div
                        key={index}
                        className={`mb-2 ${
                            chat.sender === "user" ? "text-blue-600" : "text-green-700"
                        }`}
                    >
                        <strong>{chat.sender === "user" ? "You" : "Assistant"}:</strong> {chat.message}
                    </div>
                ))}
            </div>

            {/* Query Input Form */}
            <form onSubmit={handleQuerySubmit} className="flex justify-between md:mx-28 mx-5 my-10 border-slate-300 bg-zinc-50  h-12 p-2 rounded items-center rounded-md">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question about the PDF..."
                    className="flex-grow border border-gray-300 p-2 rounded-md"
                    disabled={isProcessing}
                /> &nbsp;
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    disabled={isProcessing}
                >
                    {isProcessing ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    );
}

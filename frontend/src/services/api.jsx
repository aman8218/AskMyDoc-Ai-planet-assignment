// src/services/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Update with your backend URL if different

// Upload document function
export const uploadDocument = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/upload-pdf`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("Axios Response: ", response);
        return response.data;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
};

// Handle question query
export async function handleDocumentQuery(documentId, query, setChatHistory, setIsProcessing, setFlashMessage) {
    if (!query.trim()) return;

    // Add user's question to the chat history
    setChatHistory((prevHistory) => [...prevHistory, { sender: "user", message: query }]);
    setIsProcessing(true);
    setFlashMessage("");

    try {
        const requestBody = {
            text_id: documentId,
            question: query
        };
    
        const response = await fetch(`${API_URL}/ask-question`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error details:", errorData);
            throw new Error(errorData.detail || "Server error");
        }
    
        const data = await response.json();
        console.log("Response data:", data);  // Check if `answer` exists in response
    
        if (data.answer) {
            setChatHistory((prevHistory) => [
                ...prevHistory,
                { sender: "ai", message: data.answer },
            ]);
        } else {
            throw new Error("Unexpected response format");
        }
    } catch (error) {
        console.error("Error fetching response:", error);
        setFlashMessage(typeof error.message === "string" ? error.message : JSON.stringify(error));
    } finally {
        setIsProcessing(false);
    }
}

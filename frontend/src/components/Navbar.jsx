import { useState, useEffect } from "react";
import { uploadDocument } from "../services/api";

export default function Navbar({ setDocumentId }) {
    const [showForm, setShowForm] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [flashMessage, setFlashMessage] = useState("");
    const [filename, setFileName] = useState("");

    const handleUploadClick = () => setShowForm(true);
    const handleCancel = () => setShowForm(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const file = e.target.elements.fileInput.files[0];

        // Check if the file is a PDF
        if (!file || file.type !== "application/pdf") {
            setFlashMessage("Please upload a valid PDF file.");
            setTimeout(() => setFlashMessage(""), 3000);
            return;
        }

        setIsUploading(true);
        setFlashMessage(""); // Clear previous messages

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await uploadDocument(formData); // Call API function
            console.log("Upload Response:", response); // Log the response
                setFlashMessage(response.message);
                setDocumentId(response.document_id);
                setFileName(response.filename); // Only set filename if upload is successful
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "Error uploading PDF. Please try again.";
            setFlashMessage(errorMsg);
        } finally {
            setIsUploading(false);
            setShowForm(false);

            // Clear flash message after 3 seconds
            setTimeout(() => setFlashMessage(""), 3000);
        }
    };

    // Clear flash message after 3 seconds
    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => {
                setFlashMessage("");
            }, 3000);

            return () => clearTimeout(timer); // Cleanup the timer on unmount or change
        }
    }, [flashMessage]);

    return (
        <>
            <div className="container mx-auto px-4 py-6 flex items-center justify-between bg-gray-100">
                <div className="logo">
                    <img src="./logo.png" alt="Logo" className="w-32 h-auto" />
                </div>
                <div className="upload-pdf flex items-center">
                {filename && (
                    <p className="text-gray-700 mr-4">
                        <span className="hidden sm:inline">{filename}</span> {/* Full filename on larger screens */}
                        <span className="sm:hidden">{filename.substring(0, 4)}</span> {/* First 4 characters on mobile */}
                    </p>
                    )}
                    <button
                        onClick={handleUploadClick}
                        className="bg-white text-black py-2 px-4 rounded-lg border border-black transition-colors"
                    >
                        + Upload PDF
                    </button>
                </div>
            </div>

            {/* Flash Message */}
            {flashMessage && (
                <div className="mt-4 text-center text-white bg-blue-500 p-2 rounded-lg">
                    {flashMessage}
                </div>
            )}

            {/* Upload Form */}
            {showForm && (
                <div className="mt-6 p-6 bg-white border border-gray-300 rounded-lg shadow-md mx-auto max-w-md">
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <label className="text-gray-700">Choose a PDF file:</label>
                        <input
                            type="file"
                            accept=".pdf"
                            name="fileInput"
                            className="border border-gray-300 p-2 rounded-md"
                        />

                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                disabled={isUploading}
                            >
                                {isUploading ? "Uploading..." : "Submit"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

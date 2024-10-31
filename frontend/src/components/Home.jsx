import { useState } from "react";
import Chat from "./Chat";
import Navbar from "./Navbar";

export default function Home()
{

    // State to store the documentId
    const [documentId, setDocumentId] = useState(null);

    return(
        <>
        <Navbar setDocumentId = {setDocumentId} />
        <Chat documentId = {documentId} />
        </>
    )
}
import { useState } from "react";
import chatService from "../../services/chat-service";
import { useAuth } from "../../hooks/useAuth/AuthContext";

const ChatPage = () => {
    const { user } = useAuth(); 

    const [question, setQuestion] = useState(""); 
    const [response, setResponse] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setLoading(true); 
        setError(null); 
    
        try {
            const chatData = {
                content: question, 
                username: user!.username,
            };
    
            const { request } = chatService.createChatMessage(chatData); 
            const { data } = await request; 
    
            if (data) {
                setResponse(data.content);
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="chat-page">
            <h1>Ask your GymBuddy a Question</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)} 
                    placeholder="Ask a question..."
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Asking..." : "Ask"}
                </button>
            </form>
            {response && (
                <div>
                    <h2>Response</h2>
                    <p>{response}</p>
                </div>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default ChatPage;

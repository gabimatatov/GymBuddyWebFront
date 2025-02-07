import { useState } from "react";
import { z } from "zod"; 
import chatService from "../../services/chat-service";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import styles from "./Chat.module.css"; 

const chatSchema = z.object({
    content: z.string().max(100, "Content must be 100 characters or less"),
});

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
    
            const validationResult = chatSchema.safeParse(chatData);
    
            if (!validationResult.success) {
                setError(validationResult.error.errors[0].message);
                setLoading(false);
                return;
            }
    
            const { request } = chatService.createChatMessage(chatData);
            const { data } = await request;
    
            if (data && data.response) {
                setResponse(data.response);
            } else {
                setError("Unexpected response format.");
            }
        } catch (err) {
            console.error("Error in handleSubmit:", err);
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Welcome to GymBuddy!</h1>
            <p className={styles.introduction}>Hi, it's me, your GymBuddy! I'm here to help with all your fitness questions. Whether you're looking for workout ideas, tips, or motivation, just ask away!</p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputWrapper}>
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a question..."
                        className={styles.textarea}
                        required
                    />
                    <button
                        type="submit"
                        className={`${styles.button} ${loading ? styles.loading : ""}`}
                        disabled={loading}
                    >
                        {loading ? "GymBuddy is thinking..." : "Ask"}
                    </button>
                </div>
                {error && <p className={styles.error}>{error}</p>}
            </form>
            {loading && !error && <p className={styles.thinkingMessage}>GymBuddy is thinking...</p>}
            {response && (
                <div className={styles.responseSection}>
                    <h2>Your GymBuddy's Response</h2>
                    <p className={styles.response}>{response}</p>
                </div>
            )}
        </div>
    );
};

export default ChatPage;

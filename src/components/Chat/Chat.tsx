import { useState } from "react";
import chatService from "../../services/chat-service";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import styles from "./Chat.module.css"; // Import the CSS module

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
        <div className={styles.container}>
            <h1>Ask your GymBuddy a Question</h1>
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
                        {loading ? "Asking..." : "Ask"}
                    </button>
                </div>
                {error && <p className={styles.error}>{error}</p>}
            </form>
            {response && (
                <div className={styles.responseSection}>
                    <h2>Response</h2>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default ChatPage;

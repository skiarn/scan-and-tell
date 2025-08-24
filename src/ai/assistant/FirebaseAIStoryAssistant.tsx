import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getAI, getGenerativeModel, GoogleAIBackend, ChatSession } from "firebase/ai";
import firebaseApp from '../../shared/firebase/firebase'; // Ensure this path is correct for your project
import useDebouncedValue from '../../shared/debounce';

// Define a type for a single part of the conversation (user or model)
type ConversationPart = {
    role: 'user' | 'model';
    text: string;
};

// Props for the StoryAssistant component
type StoryAssistantProps = {
    initialStoryIdea: string; // Renamed 'input' for better clarity as the starting point
};

const StoryAssistant: React.FC<StoryAssistantProps> = ({ initialStoryIdea }) => {
    // State to hold the entire conversation history
    const [conversationHistory, setConversationHistory] = useState<ConversationPart[]>([]);
    // State for the user's current input message
    const [currentMessage, setCurrentMessage] = useState<string>('');
    // State to indicate if an AI response is being generated
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // State to signal if the user has completed the story session
    const [isStoryCompleted, setIsStoryCompleted] = useState<boolean>(false);
    const [hasStarted, setHasStarted] = useState(false);

    // Using useRef to persist the ChatSession instance across renders
    const chatSessionRef = useRef<ChatSession | null>(null);

    const debouncedQuery = useDebouncedValue(currentMessage, 1000); 
    
    // Initialize Firebase AI services once outside the component render loop
    // These instances don't change, so they can be defined here.
    const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
    const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

    // Function to start a new chat session with an initial prompt to set the story context
    const startNewStoryChat = useCallback(async () => {
        setIsLoading(true);
        setConversationHistory([]); // Clear any previous conversation
        setIsStoryCompleted(false); // Reset completion status

        try {
            // Initialize a new chat session with the model
            const chat = model.startChat();
            chatSessionRef.current = chat; // Store the chat session reference

            // Craft the initial prompt using the user's initial idea
            const initialPrompt = `You are a creative writing assistant. Help users turn ideas into compelling stories. I want to write a story about: "${initialStoryIdea}". Let's begin building it. Please start by suggesting an opening paragraph or a few key elements to get us started.`;

            // Send the first message to the model to kick off the story
            //const result = await chat.sendMessage(initialPrompt);
            const result = { response: { text: () => "This is a placeholder response from the AI model." + "await chat.sendMessage(initialPrompt);"} }; // Placeholder for testing
            const responseText = result.response.text();

            // Add the model's first response to the conversation history
            setConversationHistory([{ role: 'model', text: responseText }]);
        } catch (error) {
            console.error('Error starting new story chat:', error);
            setConversationHistory([{ role: 'model', text: 'Oops! Something went wrong while starting the story. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    }, [model, initialStoryIdea]); // Dependencies for useCallback

    // Effect hook to trigger starting the chat when the component mounts or initialStoryIdea changes
    useEffect(() => {
        if (debouncedQuery && initialStoryIdea && !hasStarted) {
            startNewStoryChat();
            setHasStarted(true);
        }
    }, [initialStoryIdea, startNewStoryChat]); // Re-run if initialStoryIdea or startNewStoryChat changes

    // Function to send a user's message and receive the model's response
    const handleSendMessage = async () => {
        console.log("Sending message:", currentMessage);
        // Don't send if message is empty or chat session isn't active
        if (!currentMessage.trim() || !chatSessionRef.current) return;

        const userMessage = currentMessage.trim();
        // Add the user's message to the history immediately
        setConversationHistory(prev => [...prev, { role: 'user', text: userMessage }]);
        setCurrentMessage(''); // Clear the input field

        setIsLoading(true); // Indicate that we are waiting for a response
        console.log("Chat session ref:", chatSessionRef.current);
        try {
            console.log("Chat session exists, sending message to model.");
            // Send the user's message using the active chat session
            //const result = await chatSessionRef.current.sendMessage(userMessage);
            //const modelResponse = result.response.text();
            const modelResponse = "This is a placeholder response from the AI model. chatSessionRef.current.sendMessage(userMessage)"; // Placeholder response for testing
            // Add the model's response to the history
            setConversationHistory(prev => [...prev, { role: 'model', text: modelResponse }]);
        } catch (error) {
            console.error('Error sending message:', error);
            // Provide a fallback message if an error occurs
            setConversationHistory(prev => [...prev, { role: 'model', text: 'I encountered an issue. Could you please rephrase or try again?' }]);
        } finally {
            setIsLoading(false); // End loading state
        }
    };

    // Function to handle the "Complete Story" action
    const handleCompleteStory = async () => {
        setIsLoading(true);
        setIsStoryCompleted(true); // Mark the story session as completed

        // Optionally, send a final prompt to the AI for a conclusion or summary
        if (chatSessionRef.current) {
            try {
                const finalPrompt = "Based on our conversation so far, please provide a concise and satisfying conclusion or summary for this story. Make it feel complete.";
                //const result = await chatSessionRef.current.sendMessage(finalPrompt);
                const result = { response: { text: () => "This is a placeholder final conclusion from the AI model." + "chatSessionRef.current.sendMessage(finalPrompt)"} }; // Placeholder for testing
                const finalResponse = result.response.text();
                setConversationHistory(prev => [...prev, { role: 'model', text: finalResponse }]);
            } catch (error) {
                console.error('Error completing story:', error);
                setConversationHistory(prev => [...prev, { role: 'model', text: 'I had trouble generating a final conclusion.' }]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle Enter key press to send messages
    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !isLoading && !isStoryCompleted) {
            event.preventDefault(); // Prevent new line in textarea
            handleSendMessage(); // Send the message
        }
    };

    if (!initialStoryIdea) {
        return <p style={{ textAlign: 'center', color: '#888' }}>Please provide an initial story idea to start.</p>;
    }

    return (
        <div className="story-assistant" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '1.5rem' }}>AI Story Assistant</h2>

            {/* Display the conversation history */}
            <div className="conversation-history" style={{
                border: '1px solid #ddd',
                padding: '1rem',
                minHeight: '250px',
                maxHeight: '500px', // Restrict height and enable scrolling
                overflowY: 'auto',
                marginBottom: '1rem',
                borderRadius: '8px',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {conversationHistory.length === 0 && !isLoading && (
                    <p style={{ color: '#888', textAlign: 'center', margin: 'auto' }}>
                        Type your initial story idea and let's begin!
                    </p>
                )}
                {conversationHistory.map((part, index) => (
                    <div key={index} style={{
                        alignSelf: part.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '0.8rem 1.2rem',
                        borderRadius: '18px',
                        backgroundColor: part.role === 'user' ? '#007bff' : '#f0f0f0',
                        color: part.role === 'user' ? 'white' : '#333',
                        whiteSpace: 'pre-wrap', // Preserve line breaks
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>
                            {part.role === 'user' ? 'You' : 'Assistant'}
                        </span>
                        <p style={{ margin: '0', paddingTop: '5px' }}>{part.text}</p>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                        <p>Generating response...</p>
                    </div>
                )}
            </div>

            {/* Input area for user messages */}
            {!isStoryCompleted && (
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
                    <textarea
                        value={currentMessage}
                        onChange={e => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Continue the story, ask a question, or give a new direction..."
                        rows={3}
                        style={{ flexGrow: 1, resize: 'vertical', borderRadius: '8px', border: '1px solid #ddd', padding: '0.8rem', fontSize: '1rem' }}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !currentMessage.trim()}
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: isLoading || !currentMessage.trim() ? '#adb5bd' : '#007bff',
                            color: 'white',
                            cursor: isLoading || !currentMessage.trim() ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            )}

            {/* Complete Story Button */}
            <button
                onClick={handleCompleteStory}
                disabled={isLoading || isStoryCompleted || conversationHistory.length === 0} // Disable if no conversation yet
                style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isStoryCompleted ? '#6c757d' : '#28a745',
                    color: 'white',
                    cursor: isLoading || isStoryCompleted || conversationHistory.length === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                {isStoryCompleted ? 'Story Completed!' : 'Complete Story'}
            </button>

            {isStoryCompleted && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #28a745', borderRadius: '8px', backgroundColor: '#e0ffe0', textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', color: '#28a745', margin: '0' }}>Your story building session has concluded!</p>
                    <p style={{ fontSize: '0.9em', color: '#444', marginTop: '0.5em' }}>You can review the full conversation above.</p>
                </div>
            )}
        </div>
    );
};

export default StoryAssistant;

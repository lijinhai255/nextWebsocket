"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            console.log("Connected to WebSocket server");
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            console.log("Received from server:", event.data);
            setMessages((prev) => [...prev, `Server: ${event.data}`]);
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket server");
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        wsRef.current = ws;

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (inputValue.trim() && wsRef.current && isConnected) {
            wsRef.current.send(inputValue);
            setMessages((prev) => [...prev, `You: ${inputValue}`]);
            setInputValue("");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
            <main className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <h1 className="text-2xl font-bold text-white">WebSocket Chat</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div
                            className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                        ></div>
                        <span className="text-white/80 text-sm">{isConnected ? "Connected" : "Disconnected"}</span>
                    </div>
                </div>

                <div className="h-96 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                        <div className="text-center text-zinc-400 mt-20">
                            <p>No messages yet</p>
                            <p className="text-sm mt-1">Start chatting!</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg ${msg.startsWith("You:") ? "bg-blue-50 dark:bg-blue-900/30 ml-12" : "bg-zinc-100 dark:bg-zinc-800 mr-12"}`}
                            >
                                <p className="text-sm">{msg}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type a message..."
                            disabled={!isConnected}
                            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!isConnected || !inputValue.trim()}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

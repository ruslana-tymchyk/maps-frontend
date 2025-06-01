import MessageComponent from "./MessageComponent"
import { useEffect, useRef, useState } from 'react';

// Message type definition
export type Message = {
    index: number;
    sender: string;
    text: string;
  };

type ChatProps = {
    //specifying that it is a function that accepts boolean as an argument
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    messages: Message[];
    isLoading?: boolean;
    responseSummary?: string;
}


export default function ChatContainer({onSubmit, messages, isLoading, responseSummary} : ChatProps){

    const messagesEndRef = useRef<HTMLDivElement>(null) // Specify the type of element (HTMLDivElement)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'})
    }
  
    useEffect(() => {scrollToBottom()}, [messages])

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Input area and input form */}
            <div className="border-b border-gray-300 p-4 bg-white sticky top-0 z-10">
                <form className="flex items-center gap-2"
                      onSubmit={onSubmit}> 
                    <input type="text"
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-baseoutlineblue"
                            />
                    <button type="submit" className="bg-evendarkerblue text-white p-3 rounded-full hover:bg-darkerblue transition-colors" > 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{transform: 'rotate(90deg)'}} > 
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /> 
                        </svg> 
                    </button>
                </form>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
                {messages.map((message) => (
                    <MessageComponent key={message.index} sender={message.sender} message={message.text}/>)
                )}

                {/* Invisible div to scroll to when new messages come in */}
                <div ref={messagesEndRef} />
             {/* Messages container - scrollable */}
             {/* Messages will be rendered here */}
                {isLoading && (
                <div className="my-2 p-4 rounded-lg max-w-xs md:max-w-md break-words mr-auto bg-gray-100 text-gray-800 rounded-bl-none">
                    <div className="flex items-center gap-2">
                    <div className = 'text-sm mt-1'>Searching, this will take a minute</div>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    </div>
                    <div className="text-xs mt-1 text-gray-500">
                    Bot
                    </div>
                </div>
                )}
            
            </div>
        </div>

    )
}
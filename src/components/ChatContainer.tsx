import MessageComponent from "./MessageComponent"
import {useEffect, useRef, useState} from 'react'

type ChatProps = {
    //specifying that it is a function that accepts boolean as an argument
    onStateChange : (value: boolean) => void,
}

export default function ChatContainer({onStateChange} : ChatProps){

    const messagesSetup = [{ index: 1, 
        sender: 'bot',
        text: 'Hi! I am GeoS - your geographical search engine. Tell me the kinds of books that you like i.e. genres, authors etc. And I will show similar books for each country in the world!' },
       {index: 2, 
        sender: 'user', 
        text: ''
       }]

    const [messages, setMessages] = useState<{index: number;
                                              sender: string;
                                              text:string;}[]>(messagesSetup)

    useEffect(() => {
        if (messages.length !== messagesSetup.length) {
            onStateChange(true)
        }
    }, [messages])


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.target as HTMLFormElement;
        const input = (form.elements[0] as HTMLInputElement)?.value;
        const sender = (form.elements[1] as HTMLInputElement)?.value;
        if (!input) return

        const newMessage = {
            index: messages.length + 1,
            sender: sender,
            text: input
        }
        setMessages(prev => [...prev, newMessage])
        form.reset()
    }

    const messagesEndRef = useRef<HTMLDivElement>(null) // Specify the type of element (HTMLDivElement)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
    }

    useEffect(() => {scrollToBottom()}, [messages])

    return (
        <div className="flex flex-col h-60 bg-gray-100 overflow-auto">
            {/* Input area and input form */}
            <div className="border-b border-gray-300 p-4 bg-white sticky top-0 z-10">
                <form className="flex items-center gap-2"
                      onSubmit={handleSubmit}> 
                    <input type="text"
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                    <button type="submit"
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
                {messages.map((message) => (
                    <MessageComponent key={message.index} message={message.text}/>)
                )}

                {/* Invisible div to scroll to when new messages come in */}
                <div ref={messagesEndRef} />
             {/* Messages container - scrollable */}
             {/* Messages will be rendered here */}
            </div>
        </div>

    )
}
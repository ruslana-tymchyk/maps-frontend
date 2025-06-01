type MessageProps = {
    message:string;
    sender:string;
}

export default function MessageComponent({message, sender} : MessageProps){
    const commonStyles = 'my-2 p-4 rounded-lg max-w-xs md:max-w-md break-words'

    const messageStyles = 
        sender === 'user'
        ? "ml-auto bg-evendarkerblue text-white rounded-br-none"
        : "mr-auto bg-gray-100 text-gray-800 rounded-bl-none"
    return(
        <div className={`${commonStyles} ${messageStyles}`}>
            <p className="text-sm">{message}</p>
            <div className={`text-xs mt-1 ${sender === 'user' ? "text-blue-100" : "text-gray-500"}`}>
                {sender === 'user' ? 'You' : 'Bot'}
            </div>
        </div>
    )
}
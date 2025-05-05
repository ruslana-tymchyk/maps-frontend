type MessageProps = {
    message:string;
}

export default function MessageComponent({message} : MessageProps){
    return(
        <div className="bg-blue-100">
            <h1>{message}</h1>   
        </div>
    )
}
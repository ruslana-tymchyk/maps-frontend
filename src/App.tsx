import './App.css';
import MapComponent from './components/MapComponent'
import Header from './components/Header'
import ChatContainer from './components/ChatContainer'
import EntriesComponent from './components/EntriesComponent'
import { useEffect, useState } from 'react';
import { ReactNode } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api/chat';

function App() {
  // nice fix to make sure page always starts on top after a refresh
  useEffect(() => {
    window.scroll(0,0)
  }, [])

  const [showEntries, setShowEntries] = useState(false)

  // ----------------CHAT------------------

  const [isLoading, setIsLoading] = useState<boolean>(false);

  type Message = {
    index: number;
    sender: string;
    text: string;
  };

  const messagesSetup: Message[] = [{ 
    index: 1, 
    sender: 'bot',
    text: 'Hi! I am GeoS - your geographical search engine. Tell me the kinds of books that you like i.e. genres, authors etc. And I will show similar books for each country in the world!' 
  }];

  const [messages, setMessages] = useState<Message[]>(messagesSetup);


  useEffect(() => {
      if (messages.length !== messagesSetup.length) {
          setShowEntries(true); 
      }
  }, [messages])

   // Handle chat submission
  // State for API response data
  const [responseData, setResponseData] = useState<{
    response_summary: string;
    json_response: any;
  }>({
    response_summary: '',
    json_response: null
  });

  const handleChatSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const form = event.target as HTMLFormElement;
      const input = (form.elements[0] as HTMLInputElement)?.value;
      const sender = 'user'
      if (!input) return

      const newMessage = {
          index: messages.length + 1,
          sender: sender,
          text: input
      }
      // setMessages(prev => [...prev, newMessage])

      const updatedMessages = [...messages, newMessage]
      setMessages(updatedMessages)

      form.reset()

      // Show loading indicator
      setIsLoading(true);

      //Call ChatGPT and get a response

      try{
          const response: Response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                  'Content-Type' : 'application/json'
              },
              body: JSON.stringify({
                  message:input,
                  chatHistory: messages
              })
          })

          const data = await response.json();

          setResponseData({
            response_summary: data.response_summary,
            json_response: data.json_response
          })

          //Add bot response to messages
          const botMessage = {
              index: messages.length + 2,
              sender: 'bot',
              text: data.response_summary
          };
          setMessages(prev => [...prev, botMessage]);
      }catch(error){
          const botMessage = {
              index: messages.length + 2,
              sender: 'bot',
              text: 'Sorry, I encountered an error. Please try again.'
          }
          setMessages(prev => [...prev, botMessage])
      } finally {
          setIsLoading(false)
      }

      }

    // ----------------TABS------------------

    type Tab = {
      id:string, 
      label: string}
    
    type Tabs = Tab[]

    const tabs:Tabs = [
      {id: "tab1", label: "Chat"},
      {id: "tab2", label: "Entries"}
    ]

    type tabKey = typeof tabs[number]["id"]

    type TabContentMap = {
      [key in tabKey]: ReactNode
    }

    const [activeTab, setActiveTab] = useState<tabKey>("tab1")
  
    const TabContent: TabContentMap = {
      tab1: ( <div className="col-span-2 flex-col justify-end overflow-auto">
        <ChatContainer 
              onSubmit={handleChatSubmit}
              messages={messages}
              isLoading={isLoading}
              responseSummary={responseData.response_summary}
              />
      </div>), 
      tab2: (<div>
        {showEntries && responseData.json_response ?
        (<EntriesComponent
               responseData={responseData.json_response}
               />) : <div> No entries to display. Ask question in a chat to display entries. </div>
        }
        </div>)
    }

  // "grid grid-cols-[60%_40%] grid-rows-[80%_20%] bg-gray-300 h-screen"
  return (
      // This top div can be used if I want to add more info to scroll into at the bottom
       <div className='overflow-auto'> 
          <div className='h-screen'>
              <Header></Header>
              <div className="grid grid-rows-[80%_20%] grid-cols-[60%_40%] h-[90%] pl-2">
                  <MapComponent 
                        responseData={responseData.json_response}
                        showEntries={showEntries}/>
                  <div>
                      {tabs.map((tab) => (
                        <button key={tab.id}
                                className = {`px-4 py-2 font-semibold ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-500' : 'text-grey-500 hover:text-blue-500'}`} 
                                onClick={() => setActiveTab(tab.id)}>
                                {tab.label}
                                </button>
                      ))}
                      <div>{TabContent[activeTab]}</div>
                  </div>
                </div>
            </div>
          </div>
          )
}

export default App;

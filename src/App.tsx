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
    text: "Hello! I'm GeoS. What do you feel like reading today? Whether you're searching for 'historical fiction', 'books similar to Pachinko', or 'novels set in the 1920s', just ask and I'll uncover incredible books from every corner of the world."
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
               />) : <div className="flex flex-col items-center justify-center h-full p-8 text-center rounded-lg">
                    {/* Icon */}
                    <div className="mb-4">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    
                    {/* Main Message */}
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No Books Found
                    </h3>
                    
                    {/* Instruction */}
                    <p className="text-gray-500 mb-4 max-w-sm">
                      Start your literary journey by asking for book recommendations in a chat.
                    </p>
                    
                    {/* Example queries */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400 mb-2">Example searches:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          "mystery novels"
                        </span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                          "books about travel"
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          "sci-fi classics"
                        </span>
                      </div>
                    </div>
                  </div>
        }
        </div>)
    }

return (
  <div className='h-screen overflow-auto'>
    {/* Main Content Section */}
    <div className='flex flex-col'>
      <Header></Header>
      {/* <div className="grid grid-rows-[1fr_auto] grid-cols-[60%_40%] h-[90%] pl-2"> */}
      <div className="grid grid-rows-[600px] grid-cols-[60%_40%] pl-2">
        <MapComponent
          responseData={responseData.json_response}
          showEntries={showEntries}/>
        <div>
          {tabs.map((tab) => (
            <button key={tab.id}
              className={`px-4 py-2 font-semibold ${activeTab === tab.id ? 'border-b-2 border-darkerblue text-darkerblue' : 'text-grey-500 hover:text-darkerblue'}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
          <div>{TabContent[activeTab]}</div>
        </div>
      </div>
    </div>
    
    {/* Project Info Section */}
    <div className='bg-gray-50 p-8 border-t border-gray-200'>
      <div className='max-w-8xl'>
        <h2 className='text-3xl font-bold text-darkerblue mb-6'>About This Project</h2>
        
        <div className='grid md:grid-cols-2 gap-12'>
          {/* Description */}
          <div>
            <h3 className='text-xl font-semibold mb-3'>Description</h3>
            <p className='text-gray-700 leading-relaxed'>
              GeoS is an intelligent geographical search engine that transforms how people discover literature. 
              Users can ask natural-language queries like "fiction books about nature" and instantly see example 
              books from various genres displayed on an interactive map. Powered by GPT-4o and 
              enriched with comprehensive book metadata including titles, authors, publication years, and Goodreads 
              ratings, GeoS makes literary exploration visual, intuitive, and engaging.
            </p>
          </div>
          
          {/* Motivation */}
          <div>
            <h3 className='text-xl font-semibold mb-3'>Motivation</h3>
            <p className='text-gray-700 leading-relaxed'>
              Traditional book discovery relies on rigid search filters and categories that often miss the nuanced 
              way readers think about books. GeoS bridges this gap by combining natural language processing with 
              geographical visualization, allowing users to explore literature through the lens of place and story. 
              This project demonstrates how AI can make cultural discovery more accessible and visually compelling, 
              turning book recommendations into an interactive journey across the literary world.
            </p>
          </div>
        </div>
        
        {/* Links */}
        <div className='mt-8 flex flex-wrap gap-4'>
          <a 
            href="https://github.com/ruslana-tymchyk" 
            target="_blank" 
            rel="noopener noreferrer"
            className='flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors'
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            View on GitHub
          </a>
          
          <a 
            href="https://linkedin.com/in/tymchyk" 
            target="_blank" 
            rel="noopener noreferrer"
            className='flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
            </svg>
            LinkedIn Profile
          </a>
        </div>
      </div>
    </div>
  </div>
)
}

export default App;

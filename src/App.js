import './App.css';
import MapComponent from './components/MapComponent'
import Entry from './components/Entry'
import Header from './components/Header'
import ChatContainer from './components/ChatContainer'
import data from './data'
import { useEffect } from 'react';

function App() {
  // nice fix to make sure page always starts on top after a refresh
  useEffect(() => {
    window.scroll(0,0)
  }, [])

  const entryElements = data.map((entry) => {
    return(
      <Entry 
         key = {entry.id}
         entry = {entry}/>
    )
  })
  // "grid grid-cols-[60%_40%] grid-rows-[80%_20%] bg-gray-300 h-screen"
  return (
      // This top div can be used if I want to add more info to scroll into at the bottom
       <div className='overflow-auto'> 
          <div className='h-screen'>
              <Header></Header>
              <div className="grid grid-rows-[80%_20%] grid-cols-[60%_40%] h-[90%] pl-2">
                  <MapComponent/>
                  <div>
                      <div className="col-span-2 flex-col justify-end overflow-auto">
                        <ChatContainer />
                      </div>
                      {/* Add filter to filter entries by continent, year & rating */}
                      <main className="border-x-4 border-y-4 border-white h-3/5 overflow-auto">
                      {entryElements}
                      </main>
                  </div>
                </div>
            </div>
          </div>
          )
}

export default App;

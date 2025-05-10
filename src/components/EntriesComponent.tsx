// import data from './data'
import Entry from './Entry'
import { EntryType } from '../types/entry'

export interface ApiResponse {
    countries: EntryType[];
  }

export default function EntriesComponent({responseData}: any) {

    const parsed: ApiResponse = JSON.parse(responseData);

    const countries: EntryType[] = parsed.countries;

    const entryElements = countries.map((entry: EntryType) => {
        return(
          <Entry 
             key = {entry.id}
             entry = {entry}/>
        )
      })

    return(
        <main className="border-x-4 border-y-4 border-white h-3/5 overflow-auto transition-all duration-500 ease-out opacity-100 translate-y-0">
        {entryElements}
        </main>
    )

}

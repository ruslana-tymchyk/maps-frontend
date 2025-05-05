export default function Header(){
    return(
    <header className="bg-white text-white p-4 shadow-md">
        <div className="flex">
            <div className="text-2xl font-sans text-hoveroutlineblue">
                GeoS
            </div>
            <div className="ml-auto flex gap-x-4">
                <button className="px-6 py-2 bg-primary text-baseoutlineblue rounded-full hover:bg-primary/90 transition shadow-sm">
                About
                </button>
                <button className="px-6 py-2 bg-primary text-baseoutlineblue rounded-full hover:bg-primary/90 transition shadow-sm">
                Contact
                </button>
            </div>
        </div>
    </header>
    )
}
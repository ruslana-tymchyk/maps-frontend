export default function Header(){
    return(
    <header className="bg-white text-white p-4 shadow-md">
        <div class="flex">
            <div class="text-2xl font-sans text-hoveroutlineblue">
                A La Carta
            </div>
            <div class="ml-auto flex gap-x-4">
                <button class="px-6 py-2 bg-primary text-baseoutlineblue rounded-full hover:bg-primary/90 transition shadow-sm">
                About
                </button>
                <button class="px-6 py-2 bg-primary text-baseoutlineblue rounded-full hover:bg-primary/90 transition shadow-sm">
                Contact
                </button>
            </div>
        </div>
    </header>
    )
}
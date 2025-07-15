import { useState } from "react"
import { useEffect } from "react";
import Search from "./Search"
import BookList from "./BookList";
import BookModal from "./BookModal";
import Header from "./Header";
import Sidebar from "./Sidebar";
import QuoteBanner from "./QuoteBanner";
import { useUser } from './contexts/UserContext';
import { saveBookstoDB, getBooksFromDB } from "./utils/db";
import { toast } from 'react-toastify';
import BookFlippingLoader from "./BookFlippingLoader";
function Home(props) {
    const [searchInput, setSearchInput] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [popularBooks, setPopularBooks] = useState([])
    const [isClicked, setIsClicked] = useState(false)
    const [modalBook, setModalBook] = useState({})
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const ApiKey = import.meta.env.VITE_API_KEY;
    const { user, setUser } = useUser()
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev)
    }
    function handleFormChange(e) {
        setSearchInput(() => e.target.value)
    }
    async function fetchPopularBooks() {
        if (navigator.onLine) {
            try {
                const url = `http://localhost:3000/popular`
                const response = await fetch(url)
                const data = await response.json()
                setPopularBooks(data)
                setIsLoading(false)
                await saveBookstoDB(data)
            } catch {
                setIsLoading(false)
                return false
            }
        } else {
            const cached = await getBooksFromDB()
            if (cached) {

                setPopularBooks(cached)
            } else {
                alert("No offline data found")
            }
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchPopularBooks()
    }, [])
    async function fetchBookSearch() {
        const url = `http://localhost:3000/search?q=${searchInput}`
        const response = await fetch(url);
        const data = await response.json();
        setSearchResults(data)
    }
    function handleSearch(e) {
        e.preventDefault()
        fetchBookSearch()
    }
    function clearSearch(e) {
        e.preventDefault()
        setSearchResults([])
        setSearchInput("")
        fetchPopularBooks()
    }
    return (
        <div>


            <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}></Sidebar>
            <div id="main" className={isSidebarOpen === true ? "main-sidebar-open" : "main"}><Header toggleSidebar={toggleSidebar} ></Header>
                <QuoteBanner></QuoteBanner>
                <Search
                    handleFormChange={handleFormChange}
                    handleSearch={handleSearch}
                    fetchBookSearch={fetchBookSearch}
                    clearSearch={clearSearch}
                    searchInput={searchInput}></Search>
                <div>{isLoading && (
                    <BookFlippingLoader />
                )}</div>
                <BookList isClicked={isClicked}
                    setIsClicked={setIsClicked} popularBooks={popularBooks}
                    searchResults={searchResults}
                    modalBook={modalBook}
                    setModalBook={setModalBook}></BookList>
            </div>
            {isClicked === true && <BookModal setIsClicked={setIsClicked} modalBook={modalBook} />}
        </div>
    )
}
export default Home;

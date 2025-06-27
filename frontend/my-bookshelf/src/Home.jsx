import { useState } from "react"
import { useEffect } from "react";
import Search from "./Search"
import BookList from "./BookList";
import BookModal from "./BookModal";
import { useUser } from './contexts/UserContext';
function Home(props) {
    const [searchInput, setSearchInput] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [popularBooks, setPopularBooks] = useState([])
    const [isClicked, setIsClicked] = useState(false)
    const [modalBook, setModalBook] = useState({})
    const ApiKey = import.meta.env.VITE_API_KEY;
    const {user, setUser} = useUser()

    function handleFormChange(e) {
        setSearchInput(() => e.target.value)
        console.log(searchInput)
    }
    async function fetchPopularBooks() {
        const url = `http://localhost:3000/popular`
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        setPopularBooks(data)

    }
    useEffect(() => {
        fetchPopularBooks()
    }, [])
    async function fetchBookSearch() {
        const url = `http://localhost:3000/search?q=${searchInput}`
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.items)
        setSearchResults(data)


    }
    function handleSearch(e) {
        e.preventDefault()
        fetchBookSearch()
        // setSearchInput("")
    }
    function clearSearch(e) {
        e.preventDefault()
        setSearchResults([])
        setSearchInput("")
        fetchPopularBooks()

    }

    return (
        <div>
            <h2>Welcome, {user?.username || "Guest"}</h2>
            <Search
                handleFormChange={handleFormChange}
                handleSearch={handleSearch}
                fetchBookSearch={fetchBookSearch}
                clearSearch={clearSearch}
                searchInput={searchInput}></Search>
            <BookList isClicked={isClicked}
                setIsClicked={setIsClicked} popularBooks={popularBooks}
                searchResults={searchResults}
                modalBook={modalBook}
                setModalBook={setModalBook}></BookList>

                {isClicked === true && <BookModal setIsClicked={setIsClicked} modalBook={modalBook}/>}
        </div>
    )

}
export default Home;

import { use, useEffect, useState } from "react"
import { useUser } from "./contexts/UserContext"
import { useNavigate } from "react-router-dom"
import "./BookModal.css"
function BookModal(props) {
    const [bookshelves, setBookshelves] = useState([])
    const [selectedBookshelf, setSelectedBookshelf] = useState("")
    const [shelfOptions, setShelfOptions] = useState([])
    const [booksInShelf, setBooksInShelf] = useState([])
    const { user, setUser } = useUser()
    const navigate = useNavigate()
    const closeModal = () => {
        props.setIsClicked(false)
    }
    const fetchShelfOption = async () => {
        try {
            const res = await fetch("http://localhost:3000/shelves", {
                credentials: "include",
            })
            const data = await res.json();
            setShelfOptions(data)
        } catch (err) {
            console.error("Error fetching bookshelves", err)
        }
    }
    const fetchBookshelves = async () => {
        try {
            const res = await fetch("http://localhost:3000/bookshelf", {
                credentials: "include",
            });
            const data = await res.json();
            setBookshelves(data);
        } catch (err) {
            console.error("Error fetching bookshelves", err)
        }
    }
    async function fetchBooksInShelves() {
        try {
            const res = await fetch('http://localhost:3000/user-bookshelves', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json()
            for (const shelf in data) {
                const found = data[shelf].find((book) => book.googleId === props.modalBook.googleId)
                if (found) {
                    setSelectedBookshelf(shelf)
                    break;
                }
            }

        } catch (err) {
            console.error("Error fetching bookshelves", err)
        }
        if (props.modalBook.googleId) {
            fetchBooksInShelves()
        }
    }
    useEffect(() => {
        fetchBookshelves()
        fetchShelfOption()

    }, [])
    useEffect(() => {
        fetchBooksInShelves()
    }, [props.modalBook.googleId])
    const addToBookshelf = async (e) => {
        const selected = e.target.value
        console.log(selected)
        if (!selected) {
            return alert("Please select a bookshelf")
        }
        setSelectedBookshelf(selected)
        localStorage.setItem(`${user.user.id}shelf for ${props.modalBook.title}`, selected)
        try {
            const res = await fetch("http://localhost:3000/bookshelf/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    title: props.modalBook.title,
                    author: props.modalBook.author,
                    genre: props.modalBook.genre,
                    cover: props.modalBook.cover,
                    description: props.modalBook.description,
                    googleId: props.modalBook.googleId,
                    bookshelfId: selected
                }),
            });
            const data = await res.json();
            fetchBookshelves()
            alert("Book added to bookshelf")
        } catch (err) {
            console.error("Error adding book to bookshelf", err)
            alert("Error adding book to bookshelf")
        }
    }
    return (
        <div className="modal-container">
            <div className="modal">
                <div className="modal-header">
                    <i onClick={closeModal} id="closeIcon" className="fa-solid fa-xmark"></i>
                    <img className="book-cover" src={props.modalBook.cover} alt="bookcover" />

                    <div className="book-details">
                        <h3>{props.modalBook.title}</h3>
                        <h4>{props.modalBook.author}</h4>
                        <button className="see-more" onClick={() => navigate(`/books/${props.modalBook.googleId}/reflection`, { state: props.modalBook })}>See Reviews</button></div>

                    {/* <a href={props.modalBook.barnesandNobleLink}>Buy on Barnes & Noble</a>
                    <a href={props.modalBook.amazonLink}>Buy on Amazon</a> */}

                </div>

                <div><h3>{props.modalBook.description}</h3></div>
                <select value={selectedBookshelf} onChange={(e) => {
                    setSelectedBookshelf(e.target.value);
                    addToBookshelf(e)
                }} defaultValue="">
                    <option value="">Select a  shelf</option>
                    {shelfOptions.map((shelf) => (
                        <option key={shelf} value={shelf}>{shelf.replace(/([A-Z])/g, "$1").trim()}</option>
                    ))}
                </select>
            </div>
        </div >
    )
}
export default BookModal;

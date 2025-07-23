import { use, useEffect } from "react";
import { useState } from "react";
import './BookShelf.css'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function BookShelf() {
    const [bookshelves, setBookshelves] = useState([])
    const navigate = useNavigate()
    const [openShelf, setOpenShelf] = useState(null);
    const toggleShelf = (shelfname) => {
        setOpenShelf(prev => (prev === shelfname ? null : shelfname));
    };

    async function fetchBookShelves() {
        try {
            const res = await fetch('http://localhost:3000/user-bookshelves', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json()
            setBookshelves(data)
        } catch (err) {
            toast.error("Error fetching bookshelves", err)
        }
    }
    const goBackHome = () => {
        navigate("/home")
    }
    useEffect(() => {
        fetchBookShelves()
    }, [])
    return (
        <div>
            <div className="header">
                <i id="goBack" onClick={goBackHome} className="fa-solid fa-arrow-left"></i>
                <h1 className="my-books">MY BOOKS</h1>
            </div>
            {Object.entries(bookshelves).map(([shelfname, books]) => (
                <div key={shelfname} className="accordion-section">
                    <div
                        className="accordion-header"
                        onClick={() => toggleShelf(shelfname)}
                    >
                        <h2>
                            {shelfname.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/to/g, ' to ')}
                        </h2>
                        <i
                            className={`fa-solid fa-caret-down accordion-icon ${openShelf === shelfname ? 'open' : ''}`}
                            aria-hidden="true"
                        ></i>
                    </div>

                    <div
                        className={`accordion-content ${openShelf === shelfname ? "open" : ""}`}
                    >
                        <div className="books">
                            {books.map((book) => (
                                <div className="book-card" key={book.googleId}>
                                    <Link
                                        state={{ book }}
                                        to={`/books/${book.googleId}/reflection`}
                                    >
                                        <img src={book.cover} alt="bookcover" />
                                    </Link>
                                    <div>
                                        <h4>{book.title}</h4>
                                        <p>{book.authors}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
export default BookShelf;

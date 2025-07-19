import { use, useEffect } from "react";
import { useState } from "react";
import './BookShelf.css'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function BookShelf() {
    const [bookshelves, setBookshelves] = useState([])
    const navigate = useNavigate()
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
            <div className="header"><i id="goBack" onClick={goBackHome} className="fa-solid fa-arrow-left"></i>
                <h2 className="my-books">MY BOOKS</h2></div>

            {Object.entries(bookshelves).map(([shelfname, books]) => (
                <div key={shelfname}>
                    <h2>
                        {shelfname}
                    </h2>
                    <div className="book-list">
                        {books.map((book) => (
                            <div className="book" key={book.googleId}>
                                <Link state={book} to={`/books/${book.googleId}/reflection`}> <img src={book.cover} alt="bookcover" /></Link>
                                <h4>{book.title}
                                </h4>

                                <p>{book.author}</p>
                            </div>
                        ))}
                    </div>

                </div>
            ))}
        </div>
    )
}
export default BookShelf;

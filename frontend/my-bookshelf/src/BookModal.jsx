import { use, useEffect, useState } from "react"
function BookModal(props) {
    const [bookshelves, setBookshelves] = useState([])
    const [selectedBookshelf, setSelectedBookshelf] = useState("")
    const closeModal = () => {
        props.setIsClicked(false)
    }
    const fetchBookshelves = async () => {
        try {
            const res = await fetch("http://localhost:3000/bookshelf", {
                credentials: "include",
            });
            const data = await res.json();
            console.log(data)
            setBookshelves(data);
        } catch (err) {
            console.error("Error fetching bookshelves", err)
        }
    }
    useEffect(() => {
        fetchBookshelves()
    }, [])
    useEffect(() => {
        const saved = localStorage.getItem(`shelf for ${props.modalBook.title}`)
        if (saved) {
            setSelectedBookshelf(saved)
        }

    }, [props.modalBook.googleId])

    const addToBookshelf = async (e) => {
        const selected = e.target.value
        if (!selected) {
            return alert("Please select a bookshelf")
        }
        setSelectedBookshelf(selected)
        localStorage.setItem(`shelf for ${props.modalBook.title}`, selected)
        try {
            console.log(props.modalBook)
            const res = await fetch("http://localhost:3000/bookshelf/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    title: props.modalBook.title,
                    author: props.modalBook.author,
                    cover: props.modalBook.cover,
                    description: props.modalBook.description,
                    googleId: props.modalBook.googleId,
                    bookshelfId: Number(selected)
                }),
            });
            const data = await res.json();
            console.log("book added", props.modalBook.googleId)
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
                    <img src={props.modalBook.cover} alt="" />

                    <div className="book-details">
                        <h3>{props.modalBook.title}</h3>
                        <h4>{props.modalBook.author}</h4></div>
                    <a href={props.modalBook.barnesandNobleLink}>Buy on Barnes & Noble</a>
                    <a href={props.modalBook.amazonLink}>Buy on Amazon</a>
                </div>
                <div><h3>{props.modalBook.description}</h3></div>
                <select value={selectedBookshelf} onChange={addToBookshelf} defaultValue="">
                    <option value="">Select a  shelf</option>
                    {bookshelves.map((bookshelf) => (
                        <option key={bookshelf.id} value={bookshelf.id}>{bookshelf.name}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}
export default BookModal

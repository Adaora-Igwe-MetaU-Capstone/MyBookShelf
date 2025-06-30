import { use, useEffect } from "react";
import { useState } from "react";
import './BookShelf.css'
import { useNavigate } from "react-router-dom";
function BookShelf(){
    const [bookshelves, setBookshelves] = useState([])
    const navigate = useNavigate()
async function fetchBookShelves(){
    try{
        const res = await fetch('http://localhost:3000/user-bookshelves',{
            method: 'GET',
            credentials: 'include'
        })
        const data = await res.json()
        console.log(data)
        setBookshelves(data)
    }catch(err){
        console.error("Error fetching bookshelves", err)
    }

}
const goBackHome = ()=>{
    navigate("/home")

}
useEffect(()=>{
    fetchBookShelves()
    console.log(bookshelves)
},[])
    return(
        <div>
            <i onClick={goBackHome} class="fa-solid fa-arrow-left"></i>
            <h2>MY BOOKS</h2>
            {Object.entries(bookshelves).map(([shelfname, books]) =>(
                <div key={shelfname}>
                    <h2>
                        {shelfname}
                    </h2>
                    <div className="book-list">
                        {books.map((book) =>(
                            <div  className="book" key={book.googleId}>
                                <img src={book.cover} alt="bookcover" />
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

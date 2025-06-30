import { use, useEffect } from "react";
import { useState } from "react";
function BookShelf(){
    const [bookshelves, setBookshelves] = useState([])
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
useEffect(()=>{
    fetchBookShelves()
    console.log(bookshelves)
},[])
    return(
        <div>
            <h2>MY BOOKS</h2>
            {Object.entries(bookshelves).map(([shelfname, books]) =>(
                <div key={shelfname}>
                    <h2>
                        {shelfname}
                    </h2>
                    <div>
                        {books.map((book) =>(
                            <div key={book.googleId}>
                                <img src={book.cover} alt="" />
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

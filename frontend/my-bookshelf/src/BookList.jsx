import Book from "./Book";
function BookList(props) {
    return(
        <div className="book-list">
    {(props.searchResults.length > 0 ? props.searchResults: props.popularBooks).map((book)=>{
        const info = book.volumeInfo;
        return(
        <div key = {book.id}>
            <Book
            modalBook = {props.modalBook}
            setModalBook = {props.setModalBook}
            isClicked = {props.isClicked}
            setIsClicked = {props.setIsClicked}
            googleId = {book.id}
            bookCover = {info.imageLinks?.thumbnail}
            bookTitle = {info.title}
            bookAuthor = {info.authors?.join(", ")}
            bookDescription = {info.description}/>
        </div>




        )
    }) }
        </div>
    )
}
export default BookList;

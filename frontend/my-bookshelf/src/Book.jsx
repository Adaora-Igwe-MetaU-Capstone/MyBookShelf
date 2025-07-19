import './Book.css'
function Book(props) {
    const modalBookObject = {
        title: props.bookTitle,
        author: props.bookAuthor,
        cover: props.bookCover,
        description: props.bookDescription,
        amazonLink: `https://www.amazon.com/s?k=${encodeURIComponent(props.bookTitle + ' ' + props.bookAuthor)}`,
        barnesandNobleLink: `https://www.barnesandnoble.com/s/${encodeURIComponent(props.bookTitle + ' ' + props.bookAuthor)}`,
        googleId: props.googleId,
        genres: props.genres
    }
    const modalDisplay = () => {
        props.setIsClicked(true)
        props.setModalBook(modalBookObject)
    }
    return (
        <div className="book" onClick={modalDisplay}>
            <img src={props.bookCover} alt="" />
            <h2>{props.bookTitle}</h2>
            <p>{props.bookAuthor}</p>
        </div>
    )
}
export default Book;

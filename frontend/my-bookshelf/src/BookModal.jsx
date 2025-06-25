import { useDebugValue } from "react";

function BookModal(props) {
const closeModal = () => {
    props.setIsClicked(false)
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
                <button>Add to BookShelf</button>

            </div>
        </div>

    )
}
export default BookModal

import { useLocation } from "react-router-dom";
function BookReviewsPage() {
    const location = useLocation();
    const recievedData = location.state;
    console.log(recievedData)
    return (
        <div>review page</div>
    )
}
export default BookReviewsPage

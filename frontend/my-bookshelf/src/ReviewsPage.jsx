import { useState, useEffect } from "react"
import { useUser } from "./contexts/UserContext"
function ReviewsPage(props) {
    const [editMode, setEditMode] = useState(false)
    const [content, setContent] = useState("")
    const [rating, setRating] = useState(0)
    const { user } = useUser()
    async function handleSave() {
        const res = await fetch(`http://localhost:3000/review/${props.bookData.googleId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({
                content,
                rating
            })
        })
        if (res.ok) {
            setEditMode(false)
            props.getReviews()
        } else {
            alert('Something went wrong')
        }
    }
    useEffect(() => {
        props.getReviews()
    }, [props.bookData.googleId])
    return (
        <div><div>
            <h1>Reviews</h1>
            {props.reviews.length === 0 ? (
                <p>No reviews yet</p>
            ) : (
                props.reviews.map((review) => (
                    <div>
                        <strong>{review.user.username}</strong>
                        <p>{review.content}</p>
                        <p>{review.rating}//5</p>
                        {review.user.username === user.user.username && !editMode && (
                            <button onClick={() => setEditMode(true)}>Edit</button>
                        )}
                    </div>
                ))
            )}
        </div>
            {editMode && (
                <div>
                    <h3>Edit Your Review:</h3>
                    <textarea onChange={(e) => setContent(e.target.value)
                    } value={content} name="" id=""></textarea>
                    <input value={rating} onChange={(e) => setRating(e.target.value)} type="number" max='5' min="1" />
                    <button onClick={handleSave}>Save Changes</button>
                </div>
            )}
        </div>
    )
} export default ReviewsPage

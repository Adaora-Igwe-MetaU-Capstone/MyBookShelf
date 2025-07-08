import { useState, useEffect } from "react"
import { useUser } from "./contexts/UserContext"
function ReviewsPage(props) {
    const [editMode, setEditMode] = useState(false)
    const [content, setContent] = useState()
    const [rating, setRating] = useState()
    const { user } = useUser()
    async function getReviews() {
        const res = await fetch('http://localhost:3000/reviews')
        const data = await res.json()
        const filteredReviews = data.filter((review) => (review.googleId === props.bookData.googleId))
        const userReview = filteredReviews.find((review) => (review.userId === user.user.id))
        console.log("userReview", userReview)
        if (userReview) {
            console.log("userReview", userReview)
            setContent(userReview.content)
            setRating(() => userReview.rating)
        }
        console.log(user)

    }
    const handleEdit = () => {
        getReviews()
        setContent(content)
        setRating(Number(rating))
        setEditMode(true)
    }
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
    console.log("content", content, "rating", rating)
    useEffect(() => {

        getReviews()
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
                            <button onClick={handleEdit}>Edit</button>
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
                    <input value={Number(rating)} onChange={(e) => setRating(e.target.value)} type="number" max='5' min="1" />
                    <button onClick={handleSave}>Save Changes</button>
                </div>
            )}
        </div>
    )
} export default ReviewsPage

import { useState, useEffect } from "react"
import { useUser } from "./contexts/UserContext"
import { addToQueue } from "./utils/db"

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
        if (userReview) {
            setContent(userReview.content)
            setRating(() => userReview.rating)
        }

    }
    const handleEdit = () => {
        getReviews()
        setContent(content)
        setRating(Number(rating))
        setEditMode(true)
    }
    async function handleSave(e) {
        e.preventDefault()
        const data = { content, rating, googleId: props.bookData.googleId }
        if (!navigator.onLine) {
            await addToQueue({ type: "EDIT_REVIEW", data: data })

            alert("You are offline, We'll sync this when you come online")
            setEditMode(false)
            return
        }
        const res = await fetch(`http://localhost:3000/review/${props.bookData.googleId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(data)
        })
        if (res.ok) {
            setEditMode(false)
            props.getReviews()
        } else {
            alert('Something went wrong')
        }
    }
    useEffect(() => {

        getReviews()
    }, [props.bookData.googleId])
    useEffect(() => {
        const handleSync = (e) => {
            if (!e.detail) return
            const { review, rating, googleId } = e.detail
            if (googleId === props.bookData.googleId) {
                setEditMode(false)
                props.getReviews()
                // setReview(review)
                // setRating(rating)

            }

        }
        window.addEventListener('REVIEW_SAVED', handleSync)
        return () => { window.removeEventListener('REVIEW_SAVED', handleSync) }
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

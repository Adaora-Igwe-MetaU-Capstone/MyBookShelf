import { useState, useEffect } from "react"
import { useUser } from "./contexts/UserContext"
import { addToQueue } from "./utils/db"
function ReviewForm(props) {
    const [review, setReview] = useState("")
    const [rating, setRating] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const { user } = useUser()
    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            googleId: props.bookData.googleId,
            content: review,
            rating: Number(rating),
            title: props.bookData.title,
            author: props.bookData.author,
            cover: props.bookData.cover,
            description: props.bookData.description,
        }
        if (!navigator.onLine) {
            await addToQueue({ type: "ADD_REVIEW", data: data })
            toast.info("You are offline, We'll sync this when you come online")
            return
        }
        try {
            const res = await fetch('http://localhost:3000/review', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data)
            })
            if (res.ok) {
                setSubmitted(() => true)
                props.getReviews()
                toast.success("Review submitted successfully")
            } else {
                toast.error("Error submitting review")

            }
        } catch (err) {
        }
    }
    const userReview = props.reviews.find((review) => review.googleId === props.bookData.googleId && review.userId === user.user.id)
    useEffect(() => {
    }, [])
    useEffect(() => {
        const handleSync = (e) => {
            if (!e.detail) return
            const { review, rating, googleId } = e.detail
            if (googleId === props.bookData.googleId) {
                setSubmitted(true)
                props.getReviews()
                setReview(review)
                setRating(rating)

            }

        }
        window.addEventListener('REVIEW_SAVED', handleSync)
        return () => { window.removeEventListener('REVIEW_SAVED', handleSync) }
    }, [props.bookData.googleId])
    return (

        <div>
            {!userReview ? (<form onSubmit={handleSubmit} action="">
                <label htmlFor="">Review: </label>
                <textarea value={review} name="" id="" onChange={(e) => setReview(e.target.value)}></textarea>
                <br />
                <label htmlFor="">Rating:</label>
                <input value={rating} type="number" min="1" max="5" name="" id="" onChange={(e) => setRating(Number(e.target.value))} />
                <br />
                <button type="submit">Submit</button>
            </form>) : (<div>Review submitted</div>)}
        </div>
    )
}

export default ReviewForm

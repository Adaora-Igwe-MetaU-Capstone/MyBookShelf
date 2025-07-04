import { useState } from "react"
function ReviewForm(props) {
    const [review, setReview] = useState("")
    const [rating, setRating] = useState(0)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch('http://localhost:3000/review', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                googleId: props.bookData.googleId,
                content: review,
                rating: Number(rating),
                title: props.bookData.title,
                author: props.bookData.author,
                cover: props.bookData.cover,
                description: props.bookData.description,
            })
        })
        if (res.ok) {
            alert("Review submitted successfully")
        } else {
            alert("Error submitting review")

        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} action="">
                <label htmlFor="">Review:</label>
                <textarea value={review} name="" id="" onChange={(e) => setReview(e.target.value)}></textarea>
                <br />
                <label htmlFor="">Rating:</label>
                <input value={rating} type="number" min="1" max="5" name="" id="" onChange={(e) => setRating(Number(e.target.value))} />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default ReviewForm

import { useState } from "react"
function ReviewForm(props) {
    const [review, setReview] = useState("")
    const [rating, setRating] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
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
                setSubmitted(true)
                props.getReviews()
                alert("Review submitted successfully")
            } else {
                alert("Error submitting review")

            }
        } catch (err) {
            console.log(err)
        }
    }
    return (

        <div>
            {!submitted && (<form onSubmit={handleSubmit} action="">
                <label htmlFor="">Review:</label>
                <textarea value={review} name="" id="" onChange={(e) => setReview(e.target.value)}></textarea>
                <br />
                <label htmlFor="">Rating:</label>
                <input value={rating} type="number" min="1" max="5" name="" id="" onChange={(e) => setRating(Number(e.target.value))} />
                <br />
                <button type="submit">Submit</button>
            </form>)}
        </div>
    )
}

export default ReviewForm

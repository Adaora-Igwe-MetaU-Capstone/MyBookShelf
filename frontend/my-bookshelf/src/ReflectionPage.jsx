import { useLocation } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react"
import ReviewForm from "./ReviewForm"
import ReviewsPage from "./ReviewsPage"
import { useUser } from "./contexts/UserContext"
import { addToQueue } from "./utils/db"
function ReflectionPage(props) {
    const location = useLocation()
    const bookData = location.state
    const [reflection, setReflection] = useState(" ")
    const [reviews, setReviews] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [content, setContent] = useState("")
    const [rating, setRating] = useState(0)
    const user = useUser()
    const [existingReflection, setExistingReflection] = useState(false)
    const fetchReflection = async () => {
        const res = await fetch(`http://localhost:3000/reflection/${bookData.googleId}`, {
            method: 'GET',
            credentials: 'include',
        }
        )
        const data = await res.json()
        if (data?.content) {
            setReflection(data.content)
            setExistingReflection(true)
        }
    }
    async function getReviews() {
        const res = await fetch('http://localhost:3000/reviews')
        const data = await res.json()
        const filteredReviews = data.filter((review) => (review.googleId === bookData.googleId))
        const userReview = filteredReviews.find((review) => (review.userId === user.user.id))
        if (userReview) {
            setContent(userReview.content)
            setRating(() => userReview.rating)
        }
        setReviews(() => filteredReviews)

    }
    const handleSave = async (e) => {
        e.preventDefault()
        const data = {
            googleId: bookData.googleId,
            content: reflection,
            title: bookData.title,
            author: bookData.author,
            cover: bookData.cover,
            description: bookData.description,
        }
        if (!navigator.onLine) {
            await addToQueue({ type: "SAVE_REFLECTION", data: data })
            alert("You are offline, We'll sync this when you come online")
            return
        }
        try {
            const res = await fetch('http://localhost:3000/reflection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            })
            if (res && res.ok) {
                alert("Reflection saved successfully")
                setEditMode(false)
                setExistingReflection(true)
            } else {
                alert("Error saving reflection")
            }
        } catch (err) {
            console.error(err)

        }
    }
    useEffect(() => {

        fetchReflection()
        getReviews()

    }, [bookData.googleId])
    useEffect(() => {
        const handleSync = (e) => {
            if (!e.detail) return
            const { reflection, googleId } = e.detail
            if (googleId === bookData.googleId) {
                setReflection(reflection)
                setEditMode(false)
                setExistingReflection(true)
            }

        }
        window.addEventListener('REFLECTION_SAVED', handleSync)
        return () => { window.removeEventListener('REFLECTION_SAVED', handleSync) }
    }, [bookData.googleId])
    return (
        <>
            <div>
                <img src={bookData.cover} alt="bookcover" />
                <h3>{bookData.title} - {bookData.author}</h3>
                <p>{bookData.description}</p>
                <a href={bookData.barnesandNobleLink}>Buy on Barnes & Noble</a>
                <a href={bookData.amazonLink}>Buy on Amazon</a>
            </div>
            <ReviewForm setContent={setContent} setRating={setRating} content={content} rating={rating} reviews={reviews} getReviews={getReviews} bookData={bookData} />
            <ReviewsPage etContent={setContent} setRating={setRating} content={content} rating={rating} reviews={reviews} getReviews={getReviews} bookData={bookData} />
            {existingReflection && !editMode ? (
                <>
                    <p><strong>Your Reflection:</strong></p>
                    <p>{reflection}</p>
                    <button onClick={() => setEditMode(true)}><i class="fa-solid fa-pen"></i></button></>

            ) : (<div>

                <form action="">
                    <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} rows="40" cols="40" name="" id=""></textarea>
                </form>
                <button onClick={handleSave}>{existingReflection ? "Save Changes" : "Save Reflection"}</button>
            </div>)
            }</>

    )
}
export default ReflectionPage

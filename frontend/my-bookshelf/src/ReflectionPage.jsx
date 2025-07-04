import { useLocation } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react"
import ReviewForm from "./ReviewForm"
function ReflectionPage() {
    const location = useLocation()
    const bookData = location.state
    const [reflection, setReflection] = useState(" ")
    const [editMode, setEditMode] = useState(false)
    const [existingReflection, setExistingReflection] = useState(false)
    console.log(bookData)
    const fetchReflection = async () => {
        const res = await fetch(`http://localhost:3000/reflection/${bookData.googleId}`, {
            method: 'GET',
            credentials: 'include',
        }
        )
        const data = await res.json()
        console.log(data)
        if (data?.content) {
            setReflection(data.content)
            setExistingReflection(true)
        }
    }
    const handleSave = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:3000/reflection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    googleId: bookData.googleId,
                    content: reflection,
                    title: bookData.title,
                    author: bookData.author,
                    cover: bookData.cover,
                    description: bookData.description,
                })
            })
            if (res.ok) {
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
        console.log(bookData)
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
            <ReviewForm bookData={bookData} />

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

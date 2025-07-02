import { useLocation } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react"
function ReflectionPage() {
    const location = useLocation()
    const bookData = location.state
    const [reflection, setReflection] = useState("")
    console.log(bookData)
    const fetchReflection = async () => {
        const res = await fetch(`http://localhost:3000/reflection/${bookData.id}`, {
            method: 'GET',
            credentials: 'include',
        }
        )
        const data = await res.json()
        console.log(data)
        if (data?.content) {
            setReflection(data.content)
        }
    }
    const handleSave = async () => {
        try {
            const res = await fetch('http://localhost:3000/reflection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    bookId: bookData.id,
                    content: reflection,
                })
            })
            if (res.ok) {
                alert("Reflection saved successfully")
            } else {
                alert("Error saving reflection")
            }
        } catch (err) {
            console.error(err)

        }
    }
    useEffect(() => {
        fetchReflection()
    }, [bookData.id])
    return (
        <>
            <div>
                <img src={bookData.cover} alt="bookcover" />
                <h3>{bookData.title}</h3>
            </div>
            <div>

                <form action="">
                    <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} rows="40" cols="40" name="" id=""></textarea>
                </form>
                <button onClick={handleSave}>Save Reflection</button>
            </div></>

    )
}
export default ReflectionPage

import { useState } from "react"
function GoalForm(props) {
    const currentYear = new Date().getFullYear()
    const [target, setTarget] = useState(0)
    const [isPublic, setIsPublic] = useState(false)
    const handleFormChange = (e) => {
        setTarget(() => e.target.value)
    }
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:3000/goal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year: currentYear, target, isPublic }),
                credentials: 'include'
            })
            const data = await res.json()
            props.fetchGoal()
            props.fetchAllGoal()
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <form action="">
                <label htmlFor="">Set your {currentYear} reading goal!</label>
                <input onChange={handleFormChange} value={target} type="number" />
                <label htmlFor="">Make goal pubic!</label>
                <input checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} type="checkbox" />

            </form>
            <button onClick={handleSubmit} type="submit">Save Goal</button>
        </div>
    )
}
export default GoalForm

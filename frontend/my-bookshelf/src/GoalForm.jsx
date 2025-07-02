import { useState } from "react"
function GoalForm(props) {
    const currentYear = new Date().getFullYear()
    const [target, setTarget] = useState(0)
    const handleFormChange = (e) => {
        setTarget(() => e.target.value)
    }
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:3000/setgoal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year: currentYear, target }),
                credentials: 'include'
            })
            const data = await res.json()
            props.fetchGoal()
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <form action="">
                <label htmlFor="">Set your {currentYear} reading goal!</label>
                <input onChange={handleFormChange} value={target} type="number" />
            </form>
            <button onClick={handleSubmit} type="submit">Save Goal</button>
        </div>
    )
}
export default GoalForm

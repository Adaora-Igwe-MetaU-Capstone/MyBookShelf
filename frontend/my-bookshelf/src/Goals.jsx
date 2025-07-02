import { useEffect, useState } from "react"
import GoalForm from "./GoalForm"
import GoalCircle from "./GoalCircle"
function Goals() {
    const [goal, setGoal] = useState(null)
    async function fetchGoal() {
        const res = await fetch('http://localhost:3000/goal', {
            method: 'GET',
            credentials: 'include'
        })
        const data = await res.json()
        console.log(data)
        setGoal(data);
    }
    useEffect(() => {
        fetchGoal()
    }, [])
    return (
        <>
            {goal !== null ? <GoalCircle goal={goal} /> : (<GoalForm fetchGoal={fetchGoal} />)}

        </>
    )

}
export default Goals

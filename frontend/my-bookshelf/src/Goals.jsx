import { useEffect, useState } from "react"
import GoalForm from "./GoalForm"
import GoalCircle from "./GoalCircle"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
function Goals() {
    const [goal, setGoal] = useState(null)
    const [allGoals, setAllGoals] = useState([])
    const [showAllGoals, setShowAllGoals] = useState(false)
    async function fetchGoal() {
        const res = await fetch('http://localhost:3000/goal', {
            method: 'GET',
            credentials: 'include'
        })
        const data = await res.json()
        console.log(data)
        setGoal(data);
    }
    async function fetchAllGoal() {
        try {
            const res = await fetch('http://localhost:3000/goals', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json()
            console.log(data)
            setAllGoals(data)

        } catch (err) {
            console.error("Error fetching goals", err)
        }
    }
    useEffect(() => {
        fetchGoal()
        fetchAllGoal()
    }, [])
    return (
        <>
            {goal !== null ? <GoalCircle goal={goal} /> : (<GoalForm fetchAllGoal={fetchAllGoal} fetchGoal={fetchGoal} />)}
            <button onClick={() => setShowAllGoals(prev => !prev)}>{showAllGoals === true ? "Hide Community Goals" : "Show Community Goals"}</button>
            {showAllGoals && (
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Goal</th>
                        </tr>
                    </thead>
                    {allGoals.map(goal => (
                        <thead>
                            <tr>
                                <th>@{goal.user.username}</th>
                                <th>{goal.target}</th>
                            </tr>

                        </thead>
                    ))}
                </table>
            )}
        </>
    )
}
export default Goals

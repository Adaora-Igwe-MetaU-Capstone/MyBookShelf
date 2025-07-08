import { useEffect, useState } from "react"
import GoalForm from "./GoalForm"
import GoalCircle from "./GoalCircle"
import './Goals.css'
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
        setGoal(data);
    }
    async function fetchAllGoal() {
        try {
            const res = await fetch('http://localhost:3000/goals', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json()
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
            <button className="goals-button" onClick={() => setShowAllGoals(prev => !prev)}>{showAllGoals === true ? "Hide Community Goals" : "Show Community Goals"}</button>
            {showAllGoals && (
                <table id="goals">
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

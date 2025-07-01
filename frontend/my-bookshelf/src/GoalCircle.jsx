import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './GoalCircle.css';
import { useState } from 'react';
import { useEffect } from 'react';
function GoalCircle(props) {
    const [progress, setProgress] = useState(0);
    async function fetchProgress() {
        try {
            const res = await fetch('http://localhost:3000/user-bookshelves', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json()
            console.log(data)
            console.log(data.Read.length / props.goal)
            setProgress(data.Read.length)
        } catch (err) {
            console.error("Error fetching bookshelves", err)
        }
    }
    useEffect(() => {
        fetchProgress()
        console.log(progress, props.goal.target)
    }, [])
    return (
        <div className='goal-progress-circle-container' >
            <CircularProgressbar
                styles={buildStyles({
                    pathColor: '#4e342e',
                    textColor: '#4e342e',
                    rotation: 0.25,
                })}
                className='goal-progress-circle'
                value={progress / props.goal.target * 100}
                text={`${Math.round(progress / props.goal.target * 100)}%`}
            />
            <p>You've read {progress} out of your {props.goal.target} books goal!</p>
        </div>
    )
}
export default GoalCircle;

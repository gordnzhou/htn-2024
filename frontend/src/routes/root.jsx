import '../App.css';
import LandingMic from '../widgets/LandingMic';
import MemoryNote from '../widgets/MemoryNote';
import { Divider } from "antd";

function Root({ notes }) {
    return (
        <>
            <div>
                <h2>Record a memory</h2>
                <LandingMic/>
            </div>
            <Divider style={{borderTop: '2px solid #f0f0f0'}}/>
            <div>
                <h2>Recent Memories</h2>
                {notes.slice(0, 3).map((note, index) => (
                    <MemoryNote key={index} note={note}/>
                ))}
            </div>
        </>
    )
}

export default Root
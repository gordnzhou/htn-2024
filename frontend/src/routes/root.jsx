import '../App.css';
import MemoryNote from '../widgets/MemoryNote';

function Root({ notes }) {

  return (
    <>
        <div className="card">
            <h2>Record a memory</h2>
        </div>
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
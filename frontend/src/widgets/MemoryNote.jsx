

function MemoryNote({ note }) {

    return (
        <div>
            <h3>{note.title}</h3>
            <h4>{note.date}</h4>
            {note.text}
        </div>
    );
}

export default MemoryNote
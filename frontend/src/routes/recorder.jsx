import VoiceButton from '../widgets/VoiceButton'
import { useState, useEffect, useRef } from 'react'

function Recorder() {
    const [transcript, setTranscript] = useState("");
    const endOfContentRef = useRef(null);

    const scrollToBottom = () => {
        console.log("scroll");
        endOfContentRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [transcript]);

    return (
        <>
            <div style={{
                height: '200px', 
                width: '100%',  
                fontSize: '1.5em', 
                fontWeight: 'bold',
                fontFamily: "inherit",
                border: "none",
                overflow: "auto",
                whiteSpace: 'pre-wrap'
            }} 
            contentEditable 
            suppressContentEditableWarning={true}
            >
                {transcript}
                <div ref={endOfContentRef} />
            </div>
            <VoiceButton setTranscript={setTranscript}/>
        </>
    )
}

export default Recorder
import { useNavigate } from 'react-router-dom';
import VoiceButton from '../widgets/VoiceButton'
import { useState, useEffect, useRef } from 'react'

function Recorder({transcript, setTranscript}) {
    const [done, setDone] = useState(false);
    const navigateTo = useNavigate();

    const endOfContentRef = useRef(null);

    useEffect(() => {
        if (done) {
            // Navigates to summary page with finished transcript state
            navigateTo('/summary')
        }
    }, [done]);

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
            <VoiceButton setTranscript={setTranscript} setDone={setDone}/>
        </>
    )
}

export default Recorder
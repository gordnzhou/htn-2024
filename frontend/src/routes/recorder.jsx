import VoiceButton from '../widgets/VoiceButton'
import { useState } from 'react'

function Recorder() {
    const [summary, setSummary] = useState("");

    return (
        <>
            <VoiceButton setComments={setSummary}/>
            <h2>{summary}</h2>
        </>
    )
}

export default Recorder
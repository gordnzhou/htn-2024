import { useEffect, useRef, useState } from "react";
import { IoMdRadioButtonOn } from "react-icons/io";

export default function VoiceButton({setTranscript, setDone}) {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [transcribedText, setTranscribedText] = useState("");
    const recognitionRef = useRef(new window.SpeechRecognition());

    useEffect(() => {
        // Updates parent input field
        setTranscript(transcribedText);
    }, [transcribedText]);
    
    const activateVoice = (recognition) => {
        if ('SpeechRecognition' in window) {
            try {
                recognition.continuous = true;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.start();

                recognition.onstart = function() {
                    console.log("Started transcription.");
                };

                recognition.onresult = function(event) {
                    const eventsLen = event.results.length;
                    const transcript = event.results[eventsLen - 1][0].transcript;
                    setTranscribedText(prevText => prevText + transcript) // Sets content of comments input field from parent
                    // console.log("Added to transcription:", transcript);
                };

                recognition.onspeechend = function() {
                    if (isVoiceActive) {
                        recognition.start();
                        console.log("Continuing to listen...");
                    }
                };

                recognition.onerror = function(event) {
                    setIsVoiceActive(false);
                    console.error("An error occured while transcribing:", event.error)
                };
            } catch (err) {
                console.log("An error occured in speech recognition:", err);
            }
        } else {
            console.log("Browser does not support speech recognition.");
        }
    };

    const handleClick = async () => {
        const recognition = recognitionRef.current;

        if (!isVoiceActive) {
            setTranscribedText("");
            setIsVoiceActive(true);
            activateVoice(recognition);
        } else {
            recognition.stop();
            setIsVoiceActive(false);
            setDone(true);
            if (transcribedText.length > 0) {
                setTranscribedText(transcribedText)
            }
        }
    };

    return (
        <>
            <div style={{visibility: isVoiceActive ? 'visible' : 'hidden'}}>
                <h2>Recording in progress...</h2>
                <p style={{marginBottom: "0.5rem", marginTop: "0.25rem", paddingLeft: "0.5rem", fontSize: "0.8rem"}}>
                    Don't worry if the transcription isn't perfect, we'll summarize it for you when you finish.
                </p>
                </div>
            <div>
                <button onClick={handleClick} style={{background: 'none', border: 'none', outline: 'none'}}>
                    <IoMdRadioButtonOn style={{color: isVoiceActive ? "red" : "black", fontSize: '5em' }}/>
                </button>
            </div>
        </>
    );
}
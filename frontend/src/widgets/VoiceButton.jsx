import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function VoiceButton({setComments}) {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [transcribedText, setTranscribedText] = useState("");
    const recognitionRef = useRef(new window.SpeechRecognition());

    useEffect(() => {
        // Updates parent input field
        setComments(transcribedText);
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
            if (transcribedText.length > 0) {
                setTranscribedText(transcribedText)
            }
        }
    };

    const micOn = (
        <>
            Speak normally, click on the microphone to end transcription
            <h2>Mic On</h2>
        </>
    );

    const micOff = (
        <>
            Review using your voice
            <h2>Mic Off</h2>
        </>
    );

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            <button onClick={handleClick}>{!isVoiceActive ?  micOff : micOn}</button>
            {!isVoiceActive ?
                ""
                :
                <p style={{marginBottom: "0.5rem", marginTop: "0.25rem", paddingLeft: "0.5rem", fontSize: "0.8rem", color: "gray"}}>
                    * Don't worry if the transcription isn't perfect, we will summarize it for you when you finish.
                </p>
            }
        </div>
    );
}
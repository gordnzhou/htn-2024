import { useNavigate } from 'react-router-dom';

function LandingMic(props) {
    const navigateTo = useNavigate();
    
    return (
        <button onClick={() => navigateTo("/record")}
            style={{
                borderRadius: '50%',
                width: "128px",
                height: "128px",
                border: '5px solid black',
                backgroundColor: "#bfdbfe",
            }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%', // Make the div fill the button
            }}>
                <svg
                    {...props}
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 23 23"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
            </div>
        </button>
    )
}

export default LandingMic
import axios from "axios";
import { useState } from "react";
import {Button} from "antd";

const BACKEND_URL = "http://127.0.0.1:8000/create_note";

function Summary() {
    const [summary, setSummary] = useState("Blah blah blah");

    const postNote = async (note) => {
        try {
            console.log(note)
            const response = await axios.post(BACKEND_URL, {
                text: note
            });

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Summary</h1>
            <Button type="primary">Primary Button</Button>

            {summary}

            <button>Edit Summary</button>
            <button onClick={() => postNote(summary)}>Save Summary</button>
        </div>
    )
}

export default Summary
import { Link } from "react-router-dom";
import { FiMenu } from 'react-icons/fi'

function Navbar() {
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: "100%", display: "top" }}>
            <div></div>
            <h2><Link style={{ textDecoration: "none", color: "black", fontWeight: 600 }} to="/">memora.</Link></h2>
            <FiMenu size={30}/>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        </nav>
    );
}

export default Navbar
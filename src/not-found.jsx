import { useState } from "react"
import { Link } from "react-router-dom"
export function NotFound()
{
    const [style] = useState({
        notFoundPage :{
          textAlign: 'center',
          marginTop: '50px',
          padding: '20px',
          borderRadius: '10px',
        color:'white'
        }})
    return(
        <div style={style.notFoundPage} >
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you're looking for doesn't exist.</p>
            <Link to="/login" className="text-white">Go Back to Login Page</Link>
    </div>
    )
}
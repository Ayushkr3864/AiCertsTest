import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from 'react'

function Protected({children}) {
     const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await fetch(
                  `https://aicertstest.onrender.com/admin/auth`,
                  {
                    method: "GET",
                    credentials: "include",
                  }
                );
                if (!res.ok) throw new Error("Unauthorized");
                 setAuthorized(true);
            }
             catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
        }
        checkAdmin()
    },[])
    if (loading) return <p>Checking admin access...</p>;
    return authorized? children :<Navigate to="/login" replace/>
}

export default Protected
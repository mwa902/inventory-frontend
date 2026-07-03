import { useState, useEffect } from "react";

const AdminDashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch("", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1>Welcome {user?.username}</h1>
        </div>
    );
};

export default AdminDashboard;
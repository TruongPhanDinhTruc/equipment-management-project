import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function FloManagement() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!sessionStorage.getItem("admin") && !sessionStorage.getItem("user")) {
            navigate("/auth");
            return;
        }
        dispatch(setPageTitle("Floor Management"));
    }, []);
    return (
        <div>floManagement</div>
    )
}

export default FloManagement
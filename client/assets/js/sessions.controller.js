const backendUrl = 'http://localhost:8000/';

// get session (ajax) using fetch
export const getOwnerSession = (session_id) => {
    const isConnected = sessionStorage.getItem('connected');
    
    if (isConnected) {
        return fetch(`${backendUrl}session/${session_id}`)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    } else {
        window.location.href = '/auth/login';
    }
}

// get reader session (ajax) using fetch
export const getReaderSession = (session_id) => {
    return fetch(`${backendUrl}session/spectate/${session_id}`)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
}

// new session
export const newSession = () => {
    const isConnected = sessionStorage.getItem('connected');
    
    if (isConnected) {
        return fetch(`${backendUrl}session/new`)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    } else {
        window.location.href = '/auth/login';
    }
}

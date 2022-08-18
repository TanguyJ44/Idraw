const backendUrl = 'http://localhost:8000/';

// get session (ajax) using fetch
export const getOwnerSession = (session_id) => {
    return fetch(`${backendUrl}session/${session_id}`)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
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
    return fetch(`${backendUrl}session/new`)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
}

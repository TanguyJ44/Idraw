// Called when the page has finished loading
window.onload = function () {
    confirm();
};

// Define backend url
const backend_url = 'http://localhost:8000/';

// Confirm email address
function confirm() {
    // Get account id from url
    const params = new URLSearchParams(window.location.search);
    const accountId = params.get('id');

    fetch(backend_url + 'auth/confirm', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'id': accountId
        })
    }).then(function (response) {
        if (response.status === 200) {
            setTimeout(function () {
                $('.confirm-process').hide();
                $('.confirm-finish').show();
            }, 1000);
        } else {
            alert('Impossible de vérifier votre email, merci de réessayer plus tard !');
        }
    }).catch(function (error) {
        console.log(error);
        alert('Impossible de vérifier votre email, merci de réessayer plus tard !');
    });
}

// Disable right click
document.oncontextmenu = () => false;
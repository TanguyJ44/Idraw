// Define backend url
const backend_url = 'http://localhost:8000/';

// Event called with login button pressed
// Login user
$("#connect").click(function () {
    $('#connect').prop('disabled', true);

    fetch(backend_url + 'auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'pseudo': $('#pseudo').val(),
            'password': $('#password').val()
        })
    }).then(function (response) {
        if (response.status === 200) {
            sessionStorage.setItem('connected', true);
            sessionStorage.setItem('pseudo', $('#pseudo').val());
            window.location.href = '/';
        } else {
            alert('Authentification impossible, merci de vérifier les points suivants :\n- Votre pseudo\n- Votre mot de passe\n- Votre adresse email à bien été confirmée');
            $('#connect').prop('disabled', false);
        }
    }).catch(function (error) {
        console.log(error);
        alert('Échec de l\'authentification, merci de réessayer plus tard !');
        $('#connect').prop('disabled', false);
    });
});

// Disable right click
document.oncontextmenu = () => false;
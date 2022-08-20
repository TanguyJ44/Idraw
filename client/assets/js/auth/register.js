const backend_url = 'http://localhost:8000/';

$("#regist").click(function () {
    $('#regist').prop('disabled', true);

    fetch(backend_url + 'auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'pseudo': $('#pseudo').val(),
            'email': $('#email').val(),
            'password': $('#password').val()
        })
    }).then(function (response) {
        if (response.status === 200) {
            alert('Vous êtes désormais inscrit !\n\nAvant de vous connecter, merci de confirmer votre adresse email en cliquant sur le lien reçu (' + $('#email').val() + ')');
            window.location.href = '/auth/login';
        } else {
            alert('Inscription impossible, merci de vérifier les points suivants :\n- Votre pseudo doit être unique\n- Votre adresse mail doit être bien formatée');
            $('#regist').prop('disabled', false);
        }
    }).catch(function (error) {
        console.log(error);
        alert('Échec de l\'inscription, merci de réessayer plus tard !');
        $('#regist').prop('disabled', false);
    });
});

document.oncontextmenu = () => false;
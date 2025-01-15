

function validarSenhas() {
    const novaSenha = document.getElementById('nova').value;
    const confirmeSenha = document.getElementById('confirmeSenha').value;

    if (novaSenha !== confirmeSenha) {
       // alert("A nova senha e a confirmação não são iguais. Por favor, tente novamente.");
        boom()
        return false; // Impede o envio do formulário
    }

    return true; // Permite o envio do formulário
}

function boom(){
    new Notify({
        status: 'error',
        title: 'Erro',
        text: 'A nova senha e a confirmação não são iguais. ',
        effect: 'fade',
        speed: 200,
        autoclose: true,
        autotimeout: 4000,
        position: 'center',
        gap: 50
    });
}
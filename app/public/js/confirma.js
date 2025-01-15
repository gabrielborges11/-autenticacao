document.addEventListener("DOMContentLoaded", () => {
    const confirmaSenha = document.getElementById("confirma");

    if (confirmaSenha) {
        // Impede colar no campo de confirmação de senha
        confirmaSenha.addEventListener("paste", function (e) {
            e.preventDefault();
        });
    }
});



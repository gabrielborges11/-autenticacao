const userModel = require('../models/userModel');

const register = async (req, res) => {
    const { nome_usuario, email_usuario, senha_usuario } = req.body;

    if (!nome_usuario || !email_usuario || !senha_usuario) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    try {
        await userModel.createUser(nome_usuario, email_usuario, senha_usuario);
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).send('Erro no servidor');
    }
};

const updatePassword = async (req, res) => {
    const { velha, novasenha } = req.body;
    const email = req.session.usuario?.email;

    if (!email) {
        return res.status(401).send('Usuário não autenticado.');
    }

    try {
        const usuario = await userModel.getUserByEmail(email);

        if (!usuario || usuario.senha_usuario !== velha) {
            return res.status(400).send('Senha antiga incorreta.');
        }

        await userModel.updateUserPassword(email, novasenha);
        res.redirect('/user/perfil');
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        res.status(500).send('Erro no servidor.');
    }
};

const getProfile = async (req, res) => {
    const email = req.session.usuario?.email;

    if (!email) {
        return res.redirect('/auth/login');
    }

    try {
        const usuario = await userModel.getUserByEmail(email);

        if (usuario) {
            res.render('pages/perfil', { usuario });
        } else {
            res.status(404).send('Usuário não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        res.status(500).send('Erro no servidor.');
    }
};

const updateUsername = async (req, res) => {
    const { username } = req.body; // O nome de usuário enviado no body
    const userEmail = req.session.usuario?.email; // Recupera o email da sessão do usuário

    if (!userEmail) {
        return res.status(401).send("Usuário não autenticado."); // Verifica se o usuário está autenticado
    }

    try {
        // Atualiza o nome de usuário no banco de dados
        const usuario = await userModel.updateUsername(userEmail, username);

        if (usuario.affectedRows > 0) {
            res.redirect('/user/perfil'); // Redireciona para o perfil após atualização
        } else {
            res.status(404).send("Usuário não encontrado.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao atualizar o nome do usuário.");
    }
};

module.exports = { register, updatePassword, updateUsername, getProfile };

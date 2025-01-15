const pool = require("../../config/pool_conexoes");

// Renderiza a página de cadastro
function renderCadastroPage(req, res) {
    res.render("pages/cadastro", { pagina: "cadastro", logado: null });
}

// Renderiza a página de login
function renderLoginPage(req, res) {
    res.render("pages/login", { pagina: "login", logado: null });
}

// Realiza o cadastro do usuário
async function registerUser(req, res) {
    const { nome_usuario: nome, email_usuario: email, senha_usuario: senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).send("Todos os campos são obrigatórios.");
    }

    const query = "INSERT INTO usuario (nome_usuario, email_usuario, senha_usuario) VALUES (?, ?, ?)";

    try {
        await pool.query(query, [nome, email, senha]);

        req.session.usuario = {
            email,
            nome_usuario: nome,
            logado: true
        };

        res.redirect("/inicial");
    } catch (err) {
        console.error("Erro ao cadastrar usuário:", err);
        res.status(500).send("Erro no servidor.");
    }
}

// Realiza o login do usuário
async function loginUser(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        const msgErro = {
            email: !email ? "Email é obrigatório" : "",
            senha: !senha ? "Senha é obrigatória" : ""
        };
        return res.render("pages/login", { msgErro });
    }

    try {
        const [rows] = await pool.query("SELECT * FROM usuario WHERE email_usuario = ?", [email]);

        if (rows.length === 0 || rows[0].senha_usuario !== senha) {
            return res.render("pages/login", { msgErro: "Email ou senha incorretos." });
        }

        const usuario = rows[0];
        req.session.usuario = {
            email: usuario.email_usuario,
            nome_usuario: usuario.nome_usuario,
            logado: true
        };
        

        res.redirect("/inicial");
    } catch (error) {
        console.error("Erro ao logar: ", error);
        res.render("pages/login", { msgErro: "Erro no servidor." });
    }
}

// Realiza o logout do usuário
function logoutUser(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.redirect("/inicial");
        }
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
}

// Renderiza a página inicial
async function renderInicialPage(req, res) {
    if (!req.session.usuario || !req.session.usuario.logado) {
        return res.redirect("/login");
    }

    try {
        const [rows] = await pool.query(
            "SELECT nome_usuario FROM usuario WHERE email_usuario = ?",
            [req.session.usuario.email]
        );

        if (rows.length > 0) {
            res.render("pages/inicial", {
                pagina: "inicial",
                logado: req.session.usuario.logado,
                nome: rows[0].nome_usuario
            });
        } else {
            res.status(404).send("Usuário não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        res.status(500).send("Erro no servidor.");
    }
}

// Atualiza o nome do usuário
async function updateUsername(req, res) {
    const { username } = req.body;
    const emailUsuario = req.session.usuario?.email; // Busca o email corretamente

    if (!emailUsuario) {
        return res.status(401).send("Usuário não autenticado.");
    }

    try {
        const [rows] = await pool.query(
            "UPDATE usuario SET nome_usuario = ? WHERE email_usuario = ?",
            [username, emailUsuario]
        );

        if (rows.affectedRows > 0) {
            res.redirect("/inicial");
        } else {
            res.status(404).send("Usuário não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao atualizar nome do usuário:", error);
        res.status(500).send("Erro no servidor.");
    }
}


// Atualiza a senha do usuário
async function updatePassword(req, res) {
    const { velha, novasenha } = req.body;
    const emailUsuario = req.session.usuario?.email; // Busca o email corretamente

    if (!emailUsuario) {
        return res.status(401).send("Usuário não autenticado.");
    }

    try {
        const [rows] = await pool.query(
            "SELECT senha_usuario FROM usuario WHERE email_usuario = ?",
            [emailUsuario]
        );

        if (!rows[0] || rows[0].senha_usuario !== velha) {
            return res.status(400).send("Senha antiga incorreta.");
        }

        await pool.query(
            "UPDATE usuario SET senha_usuario = ? WHERE email_usuario = ?",
            [novasenha, emailUsuario]
        );

        res.redirect("/inicial");
    } catch (error) {
        console.error("Erro ao atualizar senha:", error);
        res.status(500).send("Erro no servidor.");
    }
}


module.exports = {
    renderCadastroPage,
    renderLoginPage,
    registerUser,
    loginUser,
    logoutUser,
    renderInicialPage,
    updateUsername,
    updatePassword
};


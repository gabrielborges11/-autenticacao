const pool = require('../../config/pool_conexoes');

const getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE email_usuario = ?', [email]);
    return rows[0];
};

const createUser = async (nome, email, senha) => {
    const query = 'INSERT INTO usuario (nome_usuario, email_usuario, senha_usuario) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [nome, email, senha]);
    return result;
};

const updateUserPassword = async (email, senha) => {
    const query = 'UPDATE usuario SET senha_usuario = ? WHERE email_usuario = ?';
    const [result] = await pool.query(query, [senha, email]);
    return result;
};

module.exports = {
    getUserByEmail,
    createUser,
    updateUserPassword,
};

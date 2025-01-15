const express = require("express");
const app = express();
//const port = 3000;
const session = require('express-session')

const env = require("dotenv").config();
const port = process.env.APP_PORT;

app.use(session({
    secret: "secret", // Substitua por uma string segura em produção
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false } // Defina como true em produção se usar HTTPS
}));

// Middleware para inicializar 'req.session.usuario' se não estiver definido
app.use(function(req, res, next) {
    if (!req.session.usuario) {
        req.session.usuario = { logado: false };
    }
    next();
});

app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

var rotas = require("./app/routes/router");
app.use("/", rotas);

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});


const mysql = require('mysql2')

const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORDITB,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, conn) => {
    if(err) 
        console.log(err)
    else
        console.log("Conectado ao SGBD!")
})



module.exports = pool.promise()



const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'seu_usuario', // Substitua pelo seu usuário
    password: 'sua_senha', // Substitua pela sua senha
    database: 'seu_banco_de_dados' // Substitua pelo seu banco de dados
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados!');
});

// Rota para obter perguntas
app.get('/questions/:level', (req, res) => {
    const level = req.params.level;
    db.query(`
        SELECT * FROM questions WHERE level = ? ORDER BY RAND() LIMIT 1
    `, [level], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Rota para atualizar XP do usuário
app.post('/updateXP', (req, res) => {
    const { userId, xpGained } = req.body;

    db.query(`
        UPDATE users SET xp = xp + ? WHERE id = ?
    `, [xpGained, userId], (err) => {
        if (err) throw err;
        
        db.query(`
            SELECT xp, level FROM users WHERE id = ?
        `, [userId], (err, results) => {
            if (err) throw err;

            const user = results[0];
            const nextLevelXP = user.level * 675;
            const canLevelUp = user.xp >= nextLevelXP;
            res.json({ canLevelUp, nextLevelXP });
        });
    });
});

// Rota para mudar o nível do usuário
app.post('/levelUp', (req, res) => {
    const { userId, newLevel } = req.body;

    db.query(`
        UPDATE users SET level = ? WHERE id = ?
    `, [newLevel, userId], (err) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

// Rota para registrar respostas
app.post('/answers', (req, res) => {
    const { userId, questionId, isCorrect } = req.body;

    // Aqui você pode implementar lógica para armazenar respostas ou estatísticas, se necessário
    res.sendStatus(200);
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

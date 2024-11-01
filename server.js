const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user'); // Certifique-se de que o caminho está correto

const app = express();
const PORT = 3000;

// Configuração do bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexão ao MongoDB
mongoose.connect('mongodb+srv://testenatan:natan1234@cluster0.2varw.mongodb.net/reservas_de_modelos?retryWrites=true&w=majority')
    .then(() => {
        console.log('Conectado ao MongoDB!');
    })
    .catch((error) => {
        console.error('Erro ao conectar ao MongoDB:', error);
    });

// Definindo o diretório das views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rota principal
app.get('/', (req, res) => {
    res.render('index');
});

// Rota para cadastrar um novo usuário
app.post('/cadastrar', async (req, res) => {
    const { nome, email, senha, cidade, tipo } = req.body;
    console.log('Dados recebidos:', { nome, email, senha, cidade, tipo });
    try {
        const novoUsuario = new User({ nome, email, senha, cidade, tipo });
        await novoUsuario.save();
        res.redirect('/'); // Redireciona após o cadastro
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).send('Erro ao cadastrar usuário');
    }
});

// Rota da página de administração
app.get('/admin', async (req, res) => {
    try {
        const usuarios = await User.find(); // Busca todos os usuários no banco de dados
        res.render('admin', { usuarios }); // Passa os usuários para a view
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).send('Erro ao buscar usuários');
    }
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
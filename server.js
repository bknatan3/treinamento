const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;



// Configuração do bodyParser e das sessões
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'seu_segredo', resave: false, saveUninitialized: true }));

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexão ao MongoDB
mongoose.connect('mongodb+srv://testenatan:natan1234@cluster0.2varw.mongodb.net/reservas_de_modelos?retryWrites=true&w=majority')
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Configuração das views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Rota de Registro de Usuário
app.post('/cadastrar', async (req, res) => {
    const { nome, email, senha, cidade, tipo, isAdmin } = req.body;
    try {
        const hashSenha = await bcrypt.hash(senha, 10);  // Corrigido bcryptjs para bcrypt
        const novoUsuario = new User({ nome, email, senha: hashSenha, cidade, tipo, isAdmin: isAdmin === 'on' });
        await novoUsuario.save();
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).send('Erro ao cadastrar usuário');
    }
});

// Rota de Login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await User.findOne({ email });
        if (usuario && await bcrypt.compare(senha, usuario.senha)) {
            req.session.userId = usuario._id;
            req.session.isAdmin = usuario.isAdmin;
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Credenciais inválidas');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).send('Erro ao fazer login');
    }
});

// Middleware para proteger rotas
function autenticar(req, res, next) {
    if (!req.session.userId) return res.redirect('/');
    next();
}

app.get('/', (req, res) => {
    res.render('index'); // Certifique-se de ter uma view chamada 'index.ejs' na pasta 'views'
});


function autorizarAdmin(req, res, next) {
    if (!req.session.isAdmin) return res.status(403).send('Acesso negado');
    next();
}

// Rota de Dashboard (para usuários logados)
app.get('/dashboard', autenticar, (req, res) => {
    res.render('dashboard', { usuario: req.session });
});

// Rota da página de administração (apenas para admin)
app.get('/admin', autenticar, autorizarAdmin, async (req, res) => {
    try {
        const usuarios = await User.find();
        res.render('admin', { usuarios });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).send('Erro ao buscar usuários');
    }
});

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

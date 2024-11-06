// Importando o bcryptjs
const bcrypt = require('bcryptjs');

// Função para testar a criação de hash e comparação
const testBcryptjs = async () => {
  try {
    // Texto da senha para hash
    const password = 'minhasenha123';

    // Gerando o hash
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hash gerado:', hashedPassword);

    // Comparando a senha com o hash
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('As senhas são iguais?', isMatch); // Esperado: true

    const wrongPassword = 'senhaerrada';
    const isMatchWrong = await bcrypt.compare(wrongPassword, hashedPassword);
    console.log('As senhas são iguais?', isMatchWrong); // Esperado: false
  } catch (err) {
    console.error('Erro durante o teste do bcryptjs:', err);
  }
};

// Executando o teste
testBcryptjs();

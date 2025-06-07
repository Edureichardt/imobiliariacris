const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configura MongoDB
mongoose.connect('mongodb://localhost/imoveisdb', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => {
  console.log('MongoDB conectado');
}).catch((err) => {
  console.error('Erro ao conectar MongoDB:', err);
});

// Definindo Schema do imóvel
const imovelSchema = new mongoose.Schema({
  tipo: String,
  descricao: String,
  endereco: String,
  preco: Number,
  imagemUrl: String,
});

const Imovel = mongoose.model('Imovel', imovelSchema);

// Config Multer para upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Rota para upload de imagem
app.post('/upload', upload.single('imagem'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  // Retorna URL pública da imagem
  res.json({ imagePath: `http://localhost:3001/uploads/${req.file.filename}` });
});

// Rota para criar imóvel
app.post('/imoveis', async (req, res) => {
  try {
    const imovel = new Imovel(req.body);
    await imovel.save();
    res.status(201).json(imovel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para listar imóveis
app.get('/imoveis', async (req, res) => {
  try {
    const imoveis = await Imovel.find();
    res.json(imoveis);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar imóveis' });
  }
});

// Serve arquivos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicia o servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});

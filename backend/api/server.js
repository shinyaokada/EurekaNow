require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const uri = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDBとの接続
mongoose.connect(uri);

const userSchema = new mongoose.Schema({
  name: String,
  isCheckedIn: Boolean,
});

const User = mongoose.model('User', userSchema);

// CORS設定
app.use(cors({
  origin: ['https://eureka-now.vercel.app', 'https://eureka-now-viewer.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
});

// ユーザーの取得
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 新規ユーザーの登録
app.post('/users', async (req, res) => {
  const { name } = req.body;
  const newUser = new User({ name, isCheckedIn: false });
  await newUser.save();
  res.json(newUser);
});

// ユーザーのチェックイン/チェックアウトの更新
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  user.isCheckedIn = !user.isCheckedIn;
  await user.save();
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.get('/get-ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('IP Address:', ip); // IPアドレスをログに出力
  res.status(200).json({ ip });
});

app.put('/users/checkout-all', async (req, res) => {
  try {
    await User.updateMany({ isCheckedIn: true }, { isCheckedIn: false });
    res.status(200).send('All users checked out');
  } catch (error) {
    res.status(500).send('Error checking out users');
  }
});



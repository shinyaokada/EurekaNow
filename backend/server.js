require('dotenv').config();



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uri = process.env.MONGODB_URI;

const app = express();
const PORT = 5000;

// MongoDBとの接続
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  isCheckedIn: Boolean,
});

const User = mongoose.model('User', userSchema);

app.use(cors({
  origin: ['https://eureka-now.vercel.app', 'https://eureka-now-viewer.vercel.app']
}));
app.use(express.json());

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

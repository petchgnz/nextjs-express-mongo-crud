const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require("dotenv").config()


const app = express()

// allown frontend (localhost:3000) to call this API
app.use(cors({
  // origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000'
  origin: "*"
}))
app.use(express.json())

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.log("MongoDB connection error: ", err)
    process.exit(1)
  })

// Create Schema/Model (mongoose)
const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })
const Item = mongoose.model('Item', itemSchema)

/* API Routes */
// Get all items
app.get('/api/items', async (_req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// Create an item
app.post('/api/items', async (req, res) => {
  try {
    const { title } = req.body
    if (!title) return res.status(400).json({ message: 'title required' })
    const item = await Item.create({ title: req.body.title })
    res.status(201).json(item)
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" })
  }
})

app.patch('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // (ทางเลือก) กัน key แปลก ๆ
    const allowed = ['title', 'done'];
    const patch = {};
    for (const k of allowed) if (k in req.body) patch[k] = req.body[k];

    const item = await Item.findByIdAndUpdate(id, patch, {
      new: true,            // 🔑 ต้องได้ "ค่าใหม่" กลับมา
      runValidators: true,  // ตรวจ schema ตอนอัปเดต
    });

    if (!item) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(item);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid id' });
    }
    console.error(e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE: ถ้าใช้ 204 ห้ามมี body
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.status(204).end(); // หรือ res.status(200).json(item)
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// start server
const port = process.env.PORT ?? 4000;
app.listen(port, () => {
  console.log(`🚀 API ready on http://localhost:${port}`)
})
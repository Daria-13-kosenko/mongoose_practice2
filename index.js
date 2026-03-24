import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected successfully')
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message)
  })

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.post('/products', async (req, res) => {
  try {
    const { name, price, category } = req.body
    const product = new Product({
      name,
      price,
      category,
    })

    const savedProduct = await product.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(400).json({
      message: 'Error creating product',
      error: error.message,
    })
  }
})

app.get('/products', async (req, res) => {
  try {
    const { category, sort } = req.query
    const filter = {}

    if (category) {
      filter.category = category
    }
    let sortOption = {}

    if (sort === 'asc') {
      sortOption.price = 1
    } else if (sort === 'desc') {
      sortOption.price = -1
    }

    const products = (await Product.find(filter)).toSorted(sortOption)
    res.json(products)
  } catch (error) {
    res.status(500).json({
      message: 'Error products',
      error: error.message,
    })
  }
})

app.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Product not found',
      })
    }

    res.json(updatedProduct)
  } catch (error) {
    res.status(400).json({
      message: 'Error updating product',
      error: error.message,
    })
  }
})

app.delete('/product/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)

    if (!deletedProduct) {
      return res.status(404).json({
        message: 'Product not found',
      })
    }
    res.json({
      message: 'Product deleted successfully',
      deletedProduct,
    })
  } catch (error) {
    res.status(400).json({
      message: 'Error deleting product',
      error: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`)
})

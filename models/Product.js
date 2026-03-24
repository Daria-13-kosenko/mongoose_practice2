import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price connot be nagative'],
  },
  categoty: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
})

const Product = mongoose.model('Product', productSchema)

export default Product

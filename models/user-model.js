const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')

const userModel = new Schema(
  {
    name: { trim: true, index: true, required: true, type: String },
    email: { type: String },
    type: { type: String, default: 'client' },
    cpf: { type: String },
    phone: { type: String },
    password: { type: String },
    active: { type: Boolean, required: true, default: true },
    payDay: {
      type: Date,
      default: new Date(moment().add(7, 'days')._d.toISOString())
    },
    createdAt: { type: Date, default: Date.now }
  },
  { versionkey: false }
)

userModel.pre('save', (next) => {
  const now = new Date()
  const datav = new Date(moment().add(7, 'days')._d.toISOString())
  if (!this.createdAt) this.createdAt = now
  if (!this.payDay) this.payDay = datav
  next()
})

module.exports = mongoose.model('User', userModel)

const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
    img: {
        type: Array,
        required: true
    },
    id:{
        type: Number,
        required : true
    }
})

module.exports = mongoose.model('Image', imageSchema)
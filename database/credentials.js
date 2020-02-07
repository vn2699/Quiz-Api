const mongoose = require('mongoose');

var conn1 = mongoose.createConnection('mongodb://localhost/credentials');
const credentialsSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password:{
        type: String,
        trim: true
    },
    clearance:{
        type: String,
        required: true,
        default: 'user'
    },
    result: {
        type: Number,
        default: 0
    }
})

module.exports = conn1.model('Credentials', credentialsSchema);
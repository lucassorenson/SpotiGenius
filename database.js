const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

mongoose.connect(process.env.DB, {
    useNewUrlParser: true, 
    useFindAndModify: false, 
    useCreateIndex: true, 
    useUnifiedTopology: true
})

const userSchema = new Schema({
    Spotify_id: String,
    Spotify_access_token: String,
    Spotify_refresh_token: String,
    Spotify_expires_on: Date
})

const User = mongoose.model('User', userSchema)

module.exports = User
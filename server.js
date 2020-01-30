const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const cors = require('cors')

process.env.NODE_ENV = app.get("env")
const folderForIndex = app.get("env") === 'development' ? 'public' : 'build'

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(require('./routes/spotify-routes.js'))
app.use(express.static(path.join(__dirname, `client/${folderForIndex}`)));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + `/client/${folderForIndex}/index.html`));
})

app.listen(port, (req, res) => {
    console.log(`server listening on port: ${port}`)
});

module.exports = app
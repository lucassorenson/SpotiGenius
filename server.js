const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const cors = require('cors')
const folderForIndex = app.get("env") === 'development' ? 'public' : 'build'

app.use(cors({ origin: 'http://localhost:3000' }))

app.get('/', (req, res) => {
    res.send('root route')
})

app.get('/getProfile', (req, res) => {
    let testVal = {
        name: "John Test"
    }

    res.send(testVal)
})

app.get('/getSong', (req, res) => {
    let testVal = {
        title: 'Fake Song',
        artist: 'Test Artist',
        album: 'Not a Real Album'
    }
    
    res.send(testVal)
})


app.use(express.static(path.join(__dirname, `client/${folderForIndex}`)));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + `/client/${folderForIndex}/index.html`));
})

app.listen(port, (req, res) => {
    console.log(`server listening on port: ${port}`)
});
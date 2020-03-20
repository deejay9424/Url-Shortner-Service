const express = require('express');
const app = express();
const mongoose = require('mongoose');
const shorturl = require('./models/shorturls');

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    const shorturls = await shorturl.find();
    res.render('index', { shorturls: shorturls })
});

app.post('/shorturl', async (req, res) => {
    await shorturl.create({ full: req.body.url });
    res.redirect('/')
});

app.get('/:shortUrl', async (req, res) => {
    const url = await shorturl.findOne({ short: req.params.shortUrl });
    if (!shorturl) return res.sendStatus(404)

    url.clicks++;
    url.save();

    res.redirect(url.full);
})
app.listen(process.env.PORT || 5000);
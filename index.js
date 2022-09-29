const PORT = 7000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const newsPapers = [
    {
        name: "theTimes",
        address: "https://www.thetimes.co.uk/environment/climate-change"
    },
    {
        name: "guardian",
        address: "https://www.theguardian.com/environment/climate-crisis"
    },
    {
        name: "telegraph",
        address: "https://www.telegraph.co.uk/climate-change/"
    }
]

const articles = []

app.get('/', (req, res) => {
    res.json("Welcome to my climate change application")
})

app.get('/news', (req, res) => {
    axios.get('https://www.theguardian.com/environment/climate-crisis')
    .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html)

        $('a:contains("climate")',html).each(function () {
            const text = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                text,
                url
            })
        })
        res.json(articles)
    })
    .catch((err) => console.log(err))
})
app.listen(PORT, () => console.log(`Server is Running on PORT ${PORT}`))
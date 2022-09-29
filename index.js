const PORT = process.env.PORT || 7000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const newsPapers = [
    {
        name: "theTimes",
        address: "https://www.thetimes.co.uk/environment/climate-change",
        base: ""
    },
    {
        name: "guardian",
        address: "https://www.theguardian.com/environment/climate-crisis",
        base: ""
    },
    {
        name: "telegraph",
        address: "https://www.telegraph.co.uk/climate-change/",
        base: "https://www.telegraph.co.uk"
    }
]

const articles = []

newsPapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html)

            $('a:contains("climate")',html).each(function (){
                const title = $(this).text();
                const url = $(this).attr('href');

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json("Welcome to my climate change application")
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperID', (req, res) => {
    const newspaperID = req.params.newspaperID;

    const newspaperAddress = newsPapers.filter(newspaper => newspaper.name == newspaperID)[0].address;
    const newspaperBase = newsPapers.filter(newspaper => newspaper.name == newspaperID)[0].base;

    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const specificArticle = [];

        $('a:contains("climate")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticle.push({
                title,
                url: newspaperBase + url,
                source: newspaperID
            })
        })
        res.json(specificArticle)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`Server is Running on PORT ${PORT}`))
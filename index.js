const express = require('express');
const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))
// API key von .env importieren
const config = require('./.env')
require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});


app.listen(process.env.PORT, () => console.log('Listening at 5003'))


spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



//Routing
app.get("/", (req, res) => {
    res.render("index")
})

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artistName)
        .then((data) => {
            // console.log(‘The received data from the API: ’, data.body);
            // ----> ‘HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API’
            console.log(data.body.artists.items);
            res.render('artists', {
                results: data.body.artists.items,
                title: data.body.name,
            });
        })
        .catch((err) =>
            console.log('The error while searching artists occurred: ', err)
        );
});

app.get('artist')

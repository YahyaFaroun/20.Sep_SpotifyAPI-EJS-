const express = require('express');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config()
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))
// API key von .env importieren
// const config = require('./.env')
// const PORT = process.env.PORT || 5004


app.listen(process.env.PORT, () => {
    console.log('Listening at 3011');
})



const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


//Routing
app.get("/", (req, res) => {
    res.render("index")
})
app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artistName)
        .then((data) => {
            // console.log(‘The received data from the API: ’, data.body);
            // ----> ‘HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API’
            console.log(data.body.artists.items);
            res.render('artist-search-results', { artistData: data.body.artists.items })
        })
        .catch((err) =>
            console.log('The error while searching artists occurred: ', err)
        );
});
app.get('/albums/:id', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id).then(
        (data) => {
            console.log('Artist albums', data.body);
            res.render("albums", { albumsData: data.body.items })
        },
        (err) => {
            console.error(err);
        }
    );
})
app.get('/tracks/:idTrack', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.idTrack)
        .then(function (data) {
            console.log('tracks', data.body.items);
            res.render('tracks', { tracksData: data.body.items })
        }, function (err) {
            console.log('Something went wrong!', err);
        });
})
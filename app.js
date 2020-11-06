require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//Step 1
app.get('/', (req,res) => {
  console.log('Hello from the index');
  res.render('index');
});

//Step 2
app.get('/artist-search', (req,res) => {
spotifyApi
  .searchArtists(req.query.searchArtist)
  .then(data => {
    let artistData = data.body.artists.items;
    console.log('The received data from the API: ', data.body);
    res.render('artist-search-results' ,{artistData});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistid', (req,res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistid) //use route params when using a link href from our artist-search-results anchor tag.
    .then(data => {
      let albumData = data.body.items;
      console.log('Artist Albums', data.body);
      res.render('albums', {albumData});
    }).catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:albumid', (req,res) => {
  let albumid = req.params.albumid;
  spotifyApi
    .getAlbumTracks(albumid)
    .then((data) => {
      console.log('Response from getAlbumTracks', data.body);
      res.render('tracks', {tracks: data.body.items});
    });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

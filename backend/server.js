const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const parseString = require('xml2js').parseString;
var https = require('https');

//model
const { Venue, Event } = require('./models/Models')

// router
const venueRoute = require('./routes/venues')

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

// routes for localhost/api/venues/...
app.use('/api/venues', venueRoute);

// connect to db
mongoose.connect('mongodb://127.0.0.1:27017/project')
    .then(() => {
        // listen for request
        app.listen(3000, () => {
            console.log('listening on 3000');
        })

        // initialize venues
        var data = '';
        https.get('https://www.lcsd.gov.hk/datagovhk/event/venues.xml', function (res) {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                res.on('data', function (data_) { data += data_.toString(); });
                res.on('end', function () {
                    parseString(data, { trim: true }, function (err, result) {
                        let venuesList = result.venues.venue;
                        for (var i in venuesList) {
                            let venueId = venuesList[i].$.id;// venue id
                            let name = venuesList[i].venuee[0];//name
                            let latitude = Number(venuesList[i].latitude[0]);//latitude
                            let longitude = Number(venuesList[i].longitude[0]);//longitude
                            try {
                                let newVenue = new Venue({
                                    venueId: venueId, name: name, latitude: latitude, longitude: longitude,
                                });
                                newVenue.save().catch((error) => { })
                                // ignore the same id error.
                            } catch (error) {
                                console.log("error:" + error.message)
                            }
                        }
                    });
                });
            }
        })
        // initialize events
        var dataE = '';
        https.get('https://www.lcsd.gov.hk/datagovhk/event/events.xml', function (res) {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                res.on('data', function (dataE_) { dataE += dataE_.toString(); });
                res.on('end', function () {
                    parseString(dataE, { trim: true }, function (err, result) {
                        let eventsList = result.events.event;
                        for (var i in eventsList) {
                            let eventId = eventsList[i].$.id;
                            let title = eventsList[i].titlee[0];
                            let date = eventsList[i].predateE[0];
                            let description = eventsList[i].desce[0];
                            let presenter = eventsList[i].presenterorge[0];
                            let price = eventsList[i].pricee[0];
                            let venueId = Number(eventsList[i].venueid[0]);
                            try {
                                let newEvent = new Event({
                                    eventId: eventId,
                                    title: title,
                                    data: date,
                                    description: description,
                                    presenter: presenter,
                                    price: price,
                                    venueId: venueId
                                });
                                newEvent.save().catch((error)=>{})
                                // ignore the same id error.
                            } catch (error) {
                                console.log("error:" + error.message)
                            }
                        }
                    });
                });
            }
        })

    })
    .catch((error) => {
        console.log(error);
    })


const express = require('express')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()
app.use(cors()) // so that app can access

const existingBookings = JSON.parse(fs.readFileSync('./server/bookings.json')).map(
  (bookingRecord) => {
      const startTime = Date.parse(bookingRecord.time);
      return {
          startTime,
          endTime: new Date(startTime + bookingRecord.duration*60000).getTime(),
          userId: bookingRecord.user_id,
      }
  },
)

app.get('/bookings', (_, res) => {
  res.json(existingBookings)
})

const jsonParser = bodyParser.json()

app.post('/bookings', jsonParser, (req, res) => {
    const newBookings = req.body;

    const nonConflictingNewBookings = newBookings.filter((newBooking) => !newBooking.conflict)

    res.json([...existingBookings, ...nonConflictingNewBookings])
})

app.listen(3001)

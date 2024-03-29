const app = require('./app')

const port = 5000

// Catch and send error messages
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message)
    if (!err.statusCode) {
      err.statusCode = 500
    } // Set 500 server code error if statuscode not set
    return res.status(err.statusCode).send({
      statusCode: err.statusCode,
      message: err.message
    })
  }

  next()
})

// 404
app.use(function (req, res) {
  res.status(404).json({
    status: 'Page does not exist'
  });
});

app.listen(port, () => {
  console.log(`Listen in port ${port}`)
})

const express = require('express');
const app = express();
const router = require('./routes/sheetAPI')
const port = 5500;

// 記得要 bodyparser
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

// 然後打開 cors
const cors = require('cors');
app.use(cors());

app.use('/google', router )

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

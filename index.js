const express = require('express');
const app = express();
const sheetRouter = require('./routes/sheetAPI')
const loginRouter = require('./routes/login')
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
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
  next();
});
app.use('/googleSheet', sheetRouter );
app.use('/login', loginRouter );

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

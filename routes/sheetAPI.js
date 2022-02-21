var express = require('express')
var router = express.Router()
var port = 5500
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const readAuthFile = require('../auth')
require('dotenv').config();

router.post('/updateValues', function(req, res) {
  console.log(process.env.SPREAD_SHEET_ID)
  const url = `${req.protocol}://${req.hostname}:${port}${req.baseUrl}${req.path}`;
  console.log('api路徑:', url)
  console.log('傳送的資料:', req.body)
  // 接傳過來的 sheet title 還有 id
  const datas = {
    sheetTitle: req.body.updateMonth,
    sheetId: req.body.newSheetId
  }
  //從哪個網頁來的
  const referer = req.headers.referer;
  console.log('前端呼叫程式的網址:', referer)

  function addValues(auth) {
    // TODO: Add desired properties to the request body.
    const updateValuesRequest = {
      auth: auth,
      // The spreadsheet to apply the updates to.
      spreadsheetId: '19GMzzbUQpx1MZQd7K2dsmHtJmd9XeL2M3Lzb1l2yJX8', 
      resource: {
        // "USER_ENTERED" 設定表單格式內容要可以套用計算公式
        // "RAW"  設定表單格式內容不要套用計算公式，純文字
        valueInputOption: "USER_ENTERED",
        data: [
          {
            range: '202202!A1:D5',
            majorDimension: 'ROWS',
            values: [
              ["Item", "Cost", "Stocked", "Ship Date"],
              ["Wheel", "$20.50", "4", "3/1/2016"],
              ["Door", "$15", "2", "3/15/2016"],
              ["Engine", "$100", "1", "3/20/2016"],
              ["Totals", "=SUM(B2:B4)", "=SUM(C2:C4)", "=MAX(D2:D4)"]
            ]
          }
        ],
        includeValuesInResponse: false
      }
    };
    sheets.spreadsheets.values.batchUpdate(updateValuesRequest)
      .then((res) => {
        console.log('res', res.data)
      })
      .catch((err) => {
        console.error('err', err)
      })
  }
  readAuthFile(addValues);
});


router.post('/addSheet', function(req, res) {
  const url = `${req.protocol}://${req.hostname}:${port}${req.baseUrl}${req.path}`;
  // 接傳過來的 sheet title 還有 id
  console.log('api路徑:', url)
  console.log('傳送的資料:', req.body)
  const datas = {
    sheetTitle: req.body.updateMonth,
    sheetId: req.body.newSheetId
  }

  //從哪個網頁來的
  const referer = req.headers.referer;
  console.log('前端呼叫程式的網址:', referer)

  function addSheets(auth) {
    const request = {
      auth: auth,
      spreadsheetId: '19GMzzbUQpx1MZQd7K2dsmHtJmd9XeL2M3Lzb1l2yJX8',  // TODO: Update placeholder value.
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                sheetId: datas.sheetId, // 不能重複需要動態產生
                title: datas.sheetTitle, // 不能重複需要動態產生
                sheetType: 'GRID',
                gridProperties: {
                  rowCount: 50,
                  columnCount: 50,
                  frozenRowCount: 1
                  // frozenColumnCount: integer,
                  // hideGridlines: boolean,
                  // rowGroupControlAfter: boolean,
                  // columnGroupControlAfter: boolean
                },
                hidden: false,
              }
            },
          }
        ],
        includeSpreadsheetInResponse: false,
      }
    };
    sheets.spreadsheets.batchUpdate(request)
      .then((res) => {
        console.log('res', res.data)
      })
      .catch((err) => {
        console.error('err', err)
      })
  }
  readAuthFile(addSheets);
});

module.exports = router;
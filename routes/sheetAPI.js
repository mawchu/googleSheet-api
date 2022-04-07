var express = require('express')
var router = express.Router()
var port = 5500 || ''
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const readAuthFile = require('../auth')
const { actionRequest } = require('./utility/request')
require('dotenv').config();
/**
 * 新增工作表 更改字體 凍結窗格使用 sheets.spreadsheets.batchUpdate
 * 更新內容使用 sheets.spreadsheets.values.batchUpdate
 */

/**
 * 1.新增工作表(action = addSheet) 提供sheetid 月份title
 * 2.合併儲存格(action = mergeCells) 提供合併位置
 * 3.字體更改(action = repeatCells) 提供合併位置
 */
router.post('/doSheet', function(req, res) {
  const url = `${req.protocol}://${req.hostname}:${port}${req.baseUrl}${req.path}`;
  const dataRequest = {
    sheetTitle: req.body.datas.updateMonth,
    sheetId: req.body.datas.newSheetId,
    datas: req.body.datas,
    action: req.body.action,
    requestURL: req.headers.referer,
    responseURL: url
  }
  function addSheets(auth) {
    const request = {
      auth: auth,
      spreadsheetId: process.env.SPREAD_SHEET_ID,
      resource: {
        requests: [],
        includeSpreadsheetInResponse: false,
      }
    };
    request.resource.requests.push(actionRequest(dataRequest)[dataRequest.action]);
    sheets.spreadsheets.batchUpdate(request)
      .then((apiResponse) => {
        res.send({
          message: '呼叫 doSheet API 成功',
          response: apiResponse.data
        })
      })
      .catch((err) => {
        console.error(err.stack);
        throw new Error({
          message: '呼叫 doSheet API 失敗',
          response: err
        })
      })
  }
  readAuthFile(addSheets);
});

/* 覆蓋工作表內容
 * 傳入指定的表格位置:
 * 1. 第一行 => 新增工作表之後執行 
 * 2. 其他行 => 要覆蓋原始資料
 *  */
router.post('/initSheetValues', function(req, res) {
  const referer = req.headers.referer;
  const url = `${req.protocol}://${req.hostname}:${port}${req.baseUrl}${req.path}`;
  // 需要的參數：sheet title / sheet id / range
  const datas = {
    sheetTitle: req.body.updateMonth,
    sheetId: req.body.newSheetId,
    values: req.body.values
  }
  function initValues(auth) {
    const request = {
      auth: auth,
      spreadsheetId: process.env.SPREAD_SHEET_ID, 
      resource: {
        valueInputOption: "USER_ENTERED",
        data: [
          {
            range: `${datas.sheetTitle}!A1:J3`,
            majorDimension: 'ROWS',
            values: datas.values
          }
        ],
        includeValuesInResponse: false
      }
    };
    sheets.spreadsheets.values.batchUpdate(request)
      .then((apiResponse) => {
        res.send({
          message: '呼叫 initSheetValues API 成功',
          response: apiResponse.data
        })
      })
      .catch((err) => {
        throw new Error({
          message: '呼叫 initSheetValues API 失敗',
          response: err
        })
      })
  }
  readAuthFile(initValues);
});

/* 新增工作表內容在最後一行
 *
 *  */
router.post('/appendValues', function(req, res) {
  const url = `${req.protocol}://${req.hostname}:${port}${req.baseUrl}${req.path}`;
  console.log('api路徑:', url)
  console.log('傳送的資料:', req.body)
  // 接傳過來的 sheet title 還有 id
  const datas = {
    sheetTitle: req.body.updateMonth,
    sheetId: req.body.newSheetId,
    values: req.body.values
  }
  //從哪個網頁來的
  const referer = req.headers.referer;
  function appendValues(auth) {
    const request = {
      auth: auth,
      spreadsheetId: process.env.SPREAD_SHEET_ID, 
      range: `${datas.sheetTitle}!A1:E1`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: datas.values,
      }
    };

    sheets.spreadsheets.values.append(request)
      .then((apiResponse) => {
        res.send({
          message: '呼叫 appendValues API 成功',
          response: apiResponse.data
        })
      })
      .catch((err) => {
        throw new Error({
          message: '呼叫 appendValues API 失敗',
          response: err
        })
      })
  }
  readAuthFile(appendValues);
});

module.exports = router;
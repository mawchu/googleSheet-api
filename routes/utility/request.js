/**
 * doSheet API 要使用的 request body
 */

function actionRequest (dataRequest) {
  return {
    addSheet: {
      addSheet: {
        properties: {
          sheetId: dataRequest.sheetId, // 不能重複需要動態產生
          title: dataRequest.sheetTitle, // 不能重複需要動態產生
          sheetType: 'GRID',
          gridProperties: {
            rowCount: 50,
            columnCount: 50,
            // 凍結窗格
            frozenRowCount: 1
          },
          hidden: false,
        }
      },
    },
    mergeCell: {
      mergeCells: {
        range: {
          sheetId: dataRequest.sheetId,
          startRowIndex: 2, // 取得 value 之後抓位置
          endRowIndex: 6,
          startColumnIndex: 0,
          endColumnIndex: 2
        },
        mergeType: "MERGE_COLUMNS"
      }
    },
    repeatCell: {
      repeatCell: {
        range: {
          sheetId: dataRequest.sheetId,
          startRowIndex: 0,
          endRowIndex: 1
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: {
              red: 148/255,
              green: 208/255,
              blue: 201/255
            },
            horizontalAlignment : "CENTER",
            textFormat: {
              foregroundColor: {
                red: 255/255,
                green: 255/255,
                blue: 255/255
              },
              fontSize: 12,
              bold: true
            }
          }
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
      }
    }
  }
}

module.exports = {
  actionRequest
};
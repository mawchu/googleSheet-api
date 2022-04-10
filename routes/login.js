var express = require('express')
var router = express.Router()
const readAuthFile = require('../auth');
const jwt_decode = require('jwt-decode');

// 拿 grant code
router.get('/', function (req, res) {
  const referrer = req.headers.referer;;
  async function runSample(OAuth2Client) {
    return new Promise((resolve, reject) => {
      const authorizeUrl = OAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ],
      });
      // 解決 cors 不在後端使用 redirect
      // 承接 grant code
      res.send({
        status:'ok',
        url: authorizeUrl
      })
    });
    
  }
  readAuthFile(runSample);
});

// 拿 access token / refresh token 交換資料
router.post('/auth', function (req, res) {
  function getUserInfo(OAuth2Client) {
    OAuth2Client.getToken(req.body.code)
      .then((response) => {
        const { id_token } = response.tokens;
        const { name, email, picture } = jwt_decode(id_token);
        res.send({ name, email, picture });
      })
  }
  readAuthFile(getUserInfo);
})

module.exports = router;
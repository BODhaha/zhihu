const { root } = require('../config');
const Router = require('koa-router');
const router = new Router({ prefix: root });
const { index, upload } = require('../controllers/home');

router.get('/', index);

router.post('/upload', upload);

module.exports = router;
const router = require('koa-router')();
const tool = require('./admin/tool');
const login = require('./admin/login');

// router.prefix('/admin')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})
router.use('/tool',tool);
router.use('/login',login);

module.exports = router.routes();

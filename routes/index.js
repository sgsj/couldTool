const router = require('koa-router')()
const DB = require('../db/db');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello art-template!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router.routes();

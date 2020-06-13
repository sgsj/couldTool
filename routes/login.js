const router = require('koa-router')()
const DB = require('../mongodb/db');

router.prefix('/login')

router.get('/', async (ctx, next)=>{
  await ctx.render('login', {
    title: '登录!'
  })
})
router.post('/submit', async (ctx, next)=>{
  let loginData = ctx.request.body;
  console.log('执行：',loginData,ctx.request);
  let dbfin =  await DB.find('tags',loginData);
  console.log('数据库查询结果：',dbfin);
  let obj = {code: 200, msg: '登录成功！'};
  if (dbfin.length == 0){
    obj.code = 400
    obj.msg = '用户名或密码错误！'
  } 
  ctx.body = obj;
})
router.post('/register', async (ctx, next)=>{
  let regData = ctx.request.body;
  console.log('执行：',regData,ctx.request);
  let dbfin =  await DB.insert('tags',regData);
  console.log('数据插入结果：',dbfin);
  let obj = {code: 200,data:{ msg: '注册成功！'}};
  ctx.body = obj;
})

router.get('/bar', async (ctx, next)=>{
  ctx.body = 'this is a users/bar response'
})

module.exports = router

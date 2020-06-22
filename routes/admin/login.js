const router = require('koa-router')()
const DB = require('../../mongodb/db');
const token = require('../../middleware/token');

router.prefix('/login')

router.get('/', async (ctx, next)=>{
  await ctx.render('login', {
    title: '登录!'
  })
})
router.post('/submit', async (ctx, next)=>{
  let loginData = ctx.request.body;
  let dbfin =  await DB.find('admin',loginData);
  console.log('数据库查询结果：',dbfin);
  let obj = {};
  if (dbfin.length == 0){
    obj = {code: 400,msg: '用户名或密码错误！'}
  } else {
    let userkey = token({user:dbfin[0].user,id:dbfin[0].id});
    obj = {code: 200, msg: '登录成功！',userkey}
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

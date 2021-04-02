const router = require('koa-router')()
const DB = require('../../db/db');
const token = require('../../middleware/token');

// router.prefix('/login')

router.post('/', async (ctx, next)=>{
  console.log("loginData>>>",ctx.request);
  // ctx.body = 'this is a login!'

  let loginData = ctx.request.body,
      data = [loginData.name,loginData.password];
  console.log("loginData------------>>>",loginData);
  let dbfin =  await DB.findUser(data);
  console.log('数据库查询结果：',dbfin);
  let obj = {};
  if (dbfin.length == 0){
    obj = {code: 400,msg: '用户名或密码错误！'}
  } else {
    let userkey = token({user:dbfin[0].user,id:dbfin[0].id});
    obj = {code: 200, msg: '登录成功！',userkey}
    console.log('登录成功！');
  }
  ctx.response.body = obj;
  console.log('ctx.body>>>',ctx.body);
  await next();
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

module.exports = router.routes();

const router = require('koa-router')()
const DB = require('../../mongodb/db');
const untoken = require('../../middleware/untoken');

router.prefix('/admin')

router.get('/', async (ctx, next)=>{
  await ctx.render('admin/index',{});
})
router.get('/gettools', async (ctx, next)=>{
  let token = ctx.header.authorization;
  console.log('token:', token);
  if (token) {
    let decodetk = untoken(token);
    console.log('解析token', decodetk);
    if (decodetk && decodetk.exp <= new Date()/1000) {
      ctx.body = {
        code: 4,
        message: 'token过期！'
      }
    } else {
      let tools = await DB.find('tags');
      console.log('工具查询结果：', tools);
      ctx.body = {
        code: 200,
        message: '获取成功！',
        tools
      }
    }
  }
})
router.post('/tool', async (ctx, next)=>{
  let toolData = ctx.request.body;
  let dbin =  await DB.insert('tags',toolData);
  let obj = {code: 200,data:{ msg: '登录成功！'}};
  ctx.body = obj;
})
router.post('/addtool', async (ctx, next)=>{
  let toolData = ctx.request.body;
  let fileData = ctx.request.files;
  console.log('执行：',toolData);
  console.log('文件路径：',fileData);
  let logopath = fileData.logo.path;
  toolData.imgurl = logopath.substr( logopath.indexOf('public') );
  console.log(toolData.imgurl);
  //let dbfin =  await DB.insert('tags',regData);
  //console.log('数据插入结果：',dbfin);
  // let obj = {code: 200,data:{ msg: '注册成功！'}};
  //await ctx.render('tools',{});
  ctx.body = toolData;
})

router.get('/bar', async (ctx, next)=>{
  ctx.body = 'this is a users/bar response'
})

module.exports = router

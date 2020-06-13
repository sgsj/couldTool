const router = require('koa-router')()
const DB = require('../mongodb/db');

router.prefix('/admin')

router.get('/', async (ctx, next)=>{
  await ctx.render('admin/index',{});
})
router.get('/test', async (ctx, next)=>{
  await ctx.render('admin/test',{});
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

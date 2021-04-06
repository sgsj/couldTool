const router = require('koa-router')();
const DB = require('../../db/db');
const untoken = require('../../middleware/untoken');
// const db = require('../../db/db');

// router.prefix('/tool');

router.get('/', async (ctx, next)=>{
  await ctx.render('admin/index',{});
})

router.post('/test', async (ctx, next)=>{
  console.log("test>>>",ctx.request.body);
  console.log("test22>>>",ctx.request.files);
  ctx.body = {code: 2,message: 'aaaa'}
})

router.post('/get', async (ctx, next)=>{
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
      let tools = await DB.getTools([1,10]);
      console.log('工具查询结果：', tools);
      ctx.body = {
        code: 200,
        message: '获取成功！',
        tools
      }
    }
  }else{
    ctx.body = {code: 4,message: '请登录！'}
  }
})

router.post('/tool', async (ctx, next)=>{
  let toolData = ctx.request.body;
  let dbin =  await DB.insert('tags',toolData);
  let obj = {code: 200,data:{ msg: '登录成功！'}};
  ctx.body = obj;
})

router.post('/add', async (ctx, next)=>{
  let toolData = ctx.request.body;
  let fileData = ctx.request.files;
  console.log('执行：',toolData);
  console.log('文件路径：',fileData);
  let logopath = fileData.logo.path;
  toolData.logourl = logopath.substr( logopath.indexOf('upload') );
  console.log(toolData.logourl);
  let addtodb =  await DB.insert('tools',toolData);
  console.log('数据插入结果：',dbfin);
  let obj = {};
  if(addtodb){
    obj = {code: 200, message: '添加成功！'}
  }else{
    obj = {code: 400, message: '添加失败！'}
  }
  ctx.body = obj;
})

router.post('/upload', async (ctx, next)=>{
  let toolData = ctx.request.body;
  let fileData = ctx.request.files;
  // console.log('执行：',toolData);
  console.log('文件路径：',fileData);
  let old_file_name = Object.keys(fileData)[0],
      File = fileData[old_file_name];
  console.log('File>>>>>',File,typeof old_file_name,Object.keys(fileData));
  let obj = {
    code: 200,
    message: '上传成功！',
    data:{
      fileName: File.newName,
      oldName: old_file_name,
      fileUrl: "/public/" + File.path.split("public/")[1],
    }
  };
  ctx.body = obj;
})

router.get('/bar', async (ctx, next)=>{
  ctx.body = 'this is a users/bar response'
})

module.exports = router.routes();

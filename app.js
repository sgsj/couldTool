const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const render = require('koa-art-template')
const path = require('path')
const static = require('koa-static')

const index = require('./routes/index')
const admin = require('./routes/admin')

// error handler
onerror(app)

// middlewares
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  // ctx.set('Access-Control-Allow-Methods', '*');
  // ctx.set('Access-Control-Allow-Headers', 'content-type,token,id');
  // ctx.set('Access-Control-Request-Headers', 'Origin, X-Requested-With, content-Type, Accept, Authorization');
  if (ctx.method == 'OPTIONS') {
    console.log('options');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT,DELETE,OPTIONS,PATCH');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    ctx.status = 200;
    await next();
  } else {
    await next();
  }
});

var fileUrl = '';

app.use(async (ctx, next)=>{
  let url = ctx.request.url,
      toolLogoApi = /tool\/upload/;

  console.log("匹配路由>>>>>",url);
  if (toolLogoApi.test(url)) {
    console.log("匹配路由：：",url);
    fileUrl = "/images/tools";
  }
  await next();
  console.log("next>>>>>");
});

// function testFn(){
//   return path.join(__dirname,fileUrl)
// }

app.use(koaBody({
  multipart: true,
  //encoding: 'gzip',
  formidable:{
    uploadDir: path.join(__dirname,"/public"),
    keepExtensions: true,
    maxFieldsSize: 2*1024,
    onFileBegin: (name,file)=>{
      // name: 数据名，file: 数据值
      console.log("koa-body>>>>>",name,file,fileUrl);
      let dir = path.join(__dirname,"/public");
      let new_file_name = "upload_" + new Date().getTime();
      file.path = `${dir}${fileUrl}/${new_file_name}`;
      file.newName = new_file_name;
    },
  }
}))
app.use(json())
app.use(logger())
app.use(static(__dirname + '/public'))

// app.use(views(__dirname + '/views', {
//   extension: '.art'
// }))
render(app,{
  root: path.join(__dirname,'/views'),
  extname: '.html'
});

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
router.use("/index",index);
router.use("/admin",admin);

app.use(router.routes(), router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

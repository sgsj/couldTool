const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const render = require('koa-art-template')
const path = require('path')

const index = require('./routes/index')
const users = require('./routes/users')
const login = require('./routes/login')
const admin = require('./routes/admin')

// error handler
onerror(app)

// middlewares
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  if (ctx.method == 'OPTIONS') {
    
  } else {
    await next();
  }
});

app.use(koaBody({
  multipart: true,
  //encoding: 'gzip',
  formidable:{
    uploadDir: path.join(__dirname,'/public/upload/'),
    keepExtensions: true,
    maxFieldsSize: 2*1024*1024,
    onFileBegin: (name,file)=>{
      console.log('koabody_name:',name,'file:',file)
    }
  }
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

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
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(login.routes(), login.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

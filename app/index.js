const mount = require('koa-mount');
const Koa = require('koa')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const path = require('path')
const { connectionStr } = require('./config.js')
const app = new Koa()
const routing = require('./routes')
mongoose.connect(connectionStr, {useNewUrlParser: true}, () => {
  console.log('MongoDB 连接成功了！')
})
mongoose.connection.on('error', console.error)

app.use(koaStatic(path.join(__dirname, './public')))
app.use(error({
  postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true,
  }
}))
app.use(parameter(app))

routing(app)

const mounttedApp = new Koa();

mounttedApp.use(mount('/zhihu', app));
mounttedApp.listen(3000, () => {
  console.log('程序启动在 3000 端口了')
})
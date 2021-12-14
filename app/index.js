const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const {connectionStr} = require('./config.js')
const app = new Koa()
const routing = require('./routes')
mongoose.connect(connectionStr, {useNewUrlParser: true}, () => {
  console.log('MongoDB 连接成功了！')
})
mongoose.connection.on('error', console.error)

app.use(error({
  postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))

app.use(bodyparser())
app.use(parameter(app))

routing(app)

app.listen(3000, () => {
  console.log('程序启动在 3000 端口了')
})
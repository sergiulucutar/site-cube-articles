require('dotenv').config()

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

const uaParser = require('ua-parser-js')
const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}
app.use((req, res, next) => {
  // User Agent varables
  const ua = uaParser(req.headers['user-agent'])
  res.locals.device = ua.device.type || 'desktop'

  // Prismic variables
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT
  }
  res.locals.PrismicDOM = PrismicDOM
  next()
})

app.use(express.static(path.join(__dirname, 'dist')))
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'pug')

const getDataForPreloading = async api => {
  const textures = []

  return {
    textures
  }
}

app.get('/preloade', async (req, res) => {
  const api = await initApi(req)
  const data = await getDataForPreloading(api)

  res.send(data)
})

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const home = await api.getSingle('home')

  res.render('pages/home', { home })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

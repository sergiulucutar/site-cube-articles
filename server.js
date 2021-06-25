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
  const { results } = await api.query(
    Prismic.Predicates.at('document.type', 'article'),
    {
      fetch: ['article.image']
    }
  )

  const textures = []
  for (const article of results) {
    textures.push(article.data.image.url)
  }

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
  const home = await api.getSingle('home_page')
  const { results } = await api.query(
    Prismic.Predicates.at('document.type', 'article'),
    {
      fetch: ['article.uid', 'article.title', 'article.likes', 'article.shares', 'article.palette', 'article.image']
    }
  )

  res.render('pages/home', { home, articles: results })
})

app.get('/articles/:uid', async (req, res) => {
  const api = await initApi(req)
  const texts = await api.getSingle('article_page')
  const content = await api.getByUID(
    'article', req.params.uid
  )

  res.render('pages/article', { texts, content })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

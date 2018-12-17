/*
 * @Author: Rhymedys/Rhymedys@gmail.com 
 * @Date: 2018-12-17 21:27:07 
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-12-17 21:43:24
 */

'use strict'
const fs = require('fs')
const createRenderer = require('./helper').createRenderer
const response = require('./response')


const isProd = process.env.NODE_ENV === 'production'


let renderer
let readyPromise

const templatePath = resolve('./app/view/mydoctor_ssr/index.template.html')



if (isProd) {
    // In production: create server renderer using template and built server bundle.
    // The server bundle is generated by vue-ssr-webpack-plugin.
    const template = fs.readFileSync(templatePath, 'utf-8')
    const bundle = require('./app/public/vue-ssr-server-bundle.json')
    // The client manifests are optional, but it allows the renderer
    // to automatically infer preload/prefetch links and directly add <script>
    // tags for any async chunks used during render, avoiding waterfall requests.
    const clientManifest = require('./app/public/vue-ssr-client-manifest.json')
    renderer = createRenderer(bundle, {
        template,
        clientManifest
    })
} else {
    // In development: setup the dev server with watch and hot-reload,
    // and create a new renderer on bundle / index template update.
    readyPromise = require('./build/setup-dev-server')(
        app, //TODO: need to rebuild
        templatePath,
        (bundle, options) => {
            renderer = createRenderer(bundle, options)
        }
    )
}


function render(ctx) {
    const s = Date.now()

    ctx.setHeader("Content-Type", "text/html")
    ctx.setHeader("Server", serverInfo)

    const context = {
        title: 'mydoctor_ssr', // default title
        url: req.url
    }

    return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
            if (err) {
                reject(err)
            }
            resolve(html)
            if (!isProd) {
                console.log(`whole request: ${Date.now() - s}ms`)
            }
        })
    })
}
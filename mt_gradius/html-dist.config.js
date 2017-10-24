var { script, googleAnalytics } = require('html-dist');

module.exports = {
 // where to write to 
 outputFile: 'dist/gradius.html',
 // minify the HTML 
 minify: true,
 head: {
   // in the <head>, remove any elements matching the 'script' CSS selector 
//   remove: 'script'
 },
 body: {
   // append the following things to the body 
//    appends: [
//      script({
//        src: 'bundle.js'
//      }),
//      googleAnalytics('UA-1234')
//    ]
 }
}
var {link,script,googleAnalytics,args} = require('html-dist');
module.exports = {
  // where to write to
//  outputFile: 'dist/gradius.html',
  // minify the HTML 
  minify: true,
  head:{
    remove:'script,link',
    appends:[
      link({rel:'apple-touch-icon',href:'images/homeicon.jpg'}),
      link({rel:'stylesheet',href:'gradius_main.min.css'}),
      script({src:'gradius_main.min.js'})
    ]
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
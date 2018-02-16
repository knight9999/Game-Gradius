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
      link({rel:'stylesheet',href:args.cssFile})
    ]
 },
 body: {
   // append the following things to the body 
   remove:'script',
   appends: [
    script({src:args.jsFile})
   ]
 }
}
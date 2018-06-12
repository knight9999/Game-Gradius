const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

imagemin(['./src/images/*'],'./dist/images',
	{use: [imageminPngquant({'speed':10})]}).then(() => {
	console.log('Images optimized');
});

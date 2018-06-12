const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

imagemin([__dirname + '/src/images/*'], __dirname + '/dist/images',
	{use: [imageminPngquant({'speed':10})]}).then(() => {
	console.log('Images optimized');
});

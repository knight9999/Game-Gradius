const _BS_DIST = require("browser-sync").create('server_dist');

_BS_DIST.init({
    files: [
        "./dist/gradius.html",
        "./dist/*.json",
        "./dist/images/*.*",
        "./dist/audios/*.*"
    ],
    server: {baseDir:'./dist',index:'gradius.html'}    
})
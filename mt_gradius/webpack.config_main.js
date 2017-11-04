module.exports = {
    entry:{
        build1:__dirname + "/src/gradius_canvasimgs.js",
        build2:__dirname + "/src/gradius_enemies.js",
        build3:__dirname + "/src/gradius_map.js",
        build4:__dirname + "/src/gradius_main.js"
    },
    output: {
      path: __dirname +'/dist', //ビルドしたファイルを吐き出す場所
      filename: 'gradius_main.min_.js' //ビルドした後のファイル名
    },
      module: {
      loaders: [
              //loader
        ]
    }
};
const _GA = 'UA-117905768-1';

const _BS_SRC = require("browser-sync").create('server_src');

const _CI = require("cheerio");
const _UE = require("uglify-es");
const _UC = require('uglifycss');

const _FS = require('fs-extra');
const _IM = require('imagemin');
const _IMP = require('imagemin-pngquant');

_BS_SRC.init({
    files: [
        "./src/*.html",
        "./src/*.js",
        "./src/*.json",
        "./src/*.css",
        "./src/images/*.*",
        "./src/audios/*.*",
    ],
    server: {baseDir:'./src',index:'gradius.html'},
});
_BS_SRC.reload(['**/*.css','**/*.js',"**/*.html"]);


//compile&minify css
const _SET_UCS = () => {
    return _UC.processFiles(['./src/gradius_main.css']);
}

//compile&minify js
const _SET_UJS = () => {
    //pick up script tags in html in ./src dir
    let _html = _FS.readFileSync("./src/gradius.html", "utf8");
    const $ = _CI.load(_html);

    //minifying scripts that picked up.
    let _ue_jsfiles = {};
    $('script').map((_i, _e)=>{
        let _key = '_js'+_i+'.js';
        let _file = $(_e).attr('src').replace(/^.*\//,"./src/");
        _ue_jsfiles[_key] = _FS.readFileSync(_file, "utf8");
    });

    return _UE.minify(_ue_jsfiles,{toplevel: true});
}

//compile&minify json
const _SET_JSON = () => {
    _FS.readdir('./src', function (_e, _f) {
        if (_e) throw _e;
        _f.forEach((_file) => {
            if (!_FS.statSync('./src/'+_file) || !(/.*\.json$/.test(_file))) {return;}
            if (/.*_editing_.*\.json$/.test(_file)) {return;}

            console.log(_file);
            let _jc = _FS.readFileSync('./src/'+_file, "utf8");
            _jc = _jc.replace(/[\t\n]/ig, '');
            _FS.writeFileSync('./dist/'+_file, _jc);
        });
    });
}

//compile&minify html
const _SET_HTML = () => {
    let _html = _FS.readFileSync("./src/gradius.html", "utf8");
    const $ = _CI.load(_html);
    $('head link[rel="stylesheet"]').remove();
    $('head').append('<style>' + _SET_UCS() + '</style>');
    
    $('body script').remove();
    $('body').append('<script>' + _SET_UJS().code + '</script>');
    $('body').append('<script>' + makeGoogleAnalytics(_GA) + '</script>');

    _FS.writeFileSync('./dist/gradius.html', $.html().replace(/[\t\n]/g, "").replace(/^\s+/g, ""));

//    console.log($.html());
}

const makeGoogleAnalytics=(ua)=>{
    return `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga'); ga('create', '${ua}', 'auto'); ga('send', 'pageview');`;
}

//sync audio files
const _SET_AUDIOS = (_e,_f) => {
    _FS.removeSync('./dist/audios');
    _FS.copySync('./src/audios', './dist/audios');
    _SET_HTML();
}



_BS_SRC.watch('./src/*.html',{ignoreInitial: true})
    .on('all', (_e) => {
        console.log('start json:' + _e);
        _SET_JSON();
        console.log('start html:' + _e);
        _SET_HTML();
});
_BS_SRC.watch('./src/*.css',{ignoreInitial: true})
    .on('all', (_e) => {
        console.log('start css:' + _e);
        _SET_HTML();
});
_BS_SRC.watch('./src/*.js',{ignoreInitial: true})
    .on('all', (_e) => {
        console.log('start js:' + _e);
        _SET_HTML();
});
_BS_SRC.watch('./src/*.json',{ignoreInitial: true})
    .on('all', (_e) => {
        console.log('start json:' + _e);
        _SET_JSON();
});
_BS_SRC.watch('./src/audios/*.*',{ignoreInitial: true})
    .on('all', (_e) => {
        _SET_AUDIOS();
});
//minify images when modified at ./src/images/*
_BS_SRC.watch('./src/images/*.*',{ignoreInitial: true})
    .on('all', (_e) => {
        console.log('images:' + _e);
        _FS.removeSync('./dist/images');
        _IM(['./src/images/*'],'./dist/images',
            {use: [_IMP({'speed':10})]}).then(() => {
            console.log('Images optimized');
    });
});

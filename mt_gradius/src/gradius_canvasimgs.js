//=====================================================
//	gradius_canvasimgs.js
//	画像定義
//	2017.10.12 : 新規作成
//=====================================================
'use strict';

const _CANVAS_IMGS_CONTROL={
	_init_canvas_imgs(_d){
		if(_d===undefined){return;}
		for (let _v in _d) {
			_CANVAS_IMGS[_v] = {};
			_CANVAS_IMGS[_v]['src'] = _d[_v].src;
			_CANVAS_IMGS[_v]['rate'] = _d[_v].rate;
			_CANVAS_IMGS[_v]['obj'] = new Image();
		}
	},
	_init_canvas_imgs_init(_d) {
		if(_d===undefined){return;}
		for (let _v in _d) {
			_CANVAS_IMGS_INIT[_v] = {};
			_CANVAS_IMGS_INIT[_v]['src'] = _d[_v].src;
			_CANVAS_IMGS_INIT[_v]['rate'] = _d[_v].rate;
			_CANVAS_IMGS_INIT[_v]['obj'] = new Image();
		}

	},
	_init_canvas_audios(_d) {
		if(_d===undefined){return;}
		for (let _v in _d) {
			_CANVAS_AUDIOS[_v] = {};
			_CANVAS_AUDIOS[_v]['src'] = _d[_v].src;
			_CANVAS_AUDIOS[_v]['valume'] = _d[_v].volume;
			_CANVAS_AUDIOS[_v]['buf'] = new Object();
		}

	},
};


const _CANVAS_IMGS={
	// 'vicviper':{
	//	src:'images/gradius_vicviper.png',
	//	rate:1.00,
	//	obj:new Image()
	//}
};
const _CANVAS_IMGS_INIT={};

const _CANVAS_AUDIOS={
	// 'shot_laser':
	// 	{src:'audios/shot_laser.mp3',
	// 	 volume:1.0,
	// 	 buf:new Object()
	//	},
};
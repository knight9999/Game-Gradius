//=====================================================
//	gradius_common.js
//	共通変数.js
//=====================================================
'use strict';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let _ISDEBUG=false;
let _PLAYERS_POWER_METER=0;
let _PLAYERS_POWER_METER_SHIELD=0;
let _PLAYERS_SHOTS_SETINTERVAL = null;

const _ISSP=(window.ontouchstart===null)?true:false;

const _FPS=60;

const _CANVAS = document.getElementById('game')||{width:1000,height:500}; //キャンバス
let _CONTEXT;

let _POWERMETER='';
let _STAGESELECT='';

let _MAP='';

let _KEYSAFTERPAUSE=new Array();
let _DEF_KEYSAFTERPAUSE	//for full equipment
		='38,38,40,40,37,39,37,39,66,65';
		
const _IS_SQ_COL=0;
const _IS_SQ_COL_NONE=1;
const _IS_SQ_NOTCOL=2;

const _DEF_DIR={//向き
	_U:0,//上
	_D:1,//下
	_R:2,//右
	_L:3,//左
	_LU:4,//左上
	_LD:5,//左下
	_RU:6,//右上
	_RD:7//右下
};

let _DEF_DIFFICULT = []; //難易度
let _DIFFICULT_LEVEL = 0; //難易度
const _SET_DIFFICULT_LEVEL=()=>{
	//自機のショット装備、オプションの数、シールド装備に合わせて
	//敵のショット・スピードを調整させる
	_DIFFICULT_LEVEL = (_PARTS_PLAYERMAIN._option_count > 2) ? 1 : 0;
	_DIFFICULT_LEVEL += (_PARTS_PLAYERMAIN._shot_type === _PARTS_PLAYERMAIN._shot_type_def.LASER) ? 1 : 0;
	_DIFFICULT_LEVEL += (_PARTS_PLAYERMAIN._players_force_obj.isalive()) ? 1 : 0;
	_DIFFICULT_LEVEL += parseInt(_MAP.get_mapdefs_difficult());
	_DIFFICULT_LEVEL = (_DIFFICULT_LEVEL >= _DEF_DIFFICULT.length - 1) ? _DEF_DIFFICULT.length - 1 : _DIFFICULT_LEVEL;
};
const _GET_DIF_MOAI_RING_INT = () => {
	return parseInt(_DEF_DIFFICULT[_DIFFICULT_LEVEL]._MOAI_RING_INT);
}
const _GET_DIF_SHOT_RATE = () => {
	return parseFloat(_DEF_DIFFICULT[_DIFFICULT_LEVEL]._shot_rate);
}
const _GET_DIF_SHOT_SPEED = () => {
	return parseInt(_DEF_DIFFICULT[_DIFFICULT_LEVEL]._shot_speed);
}
const _GET_DIF_ENEMY_SPEED = () => {
	return parseInt(_DEF_DIFFICULT[_DIFFICULT_LEVEL]._enemy_speed);
}
const _GET_DIF_HATCH_RATE = () => {
	return parseInt(_DEF_DIFFICULT[_DIFFICULT_LEVEL]._hache_rate);
}
const _GET_DIF_VOLCANO_RATE = () => {
	return parseFloat(_DEF_DIFFICULT[_DIFFICULT_LEVEL]._volcano_rate);
}


//JSONファイル取得関数
//url:対象ファイル
//type:レスポンスのデータタイプ（json）
const _AJAX=function(_p){
	return new Promise((_res, _rej) => {
	let _r=new XMLHttpRequest();
	_r.onreadystatechange=function(){
		if(_r.readyState===4){//通信の完了時
			if(_r.status===200) {//通信の成功時
				console.log(_p.url+':OK');
				_res(_r.response);
			}else{
				//connecting
				console.log('NG');
				_rej(new Error(_r.statusText));
			}
		}
	}
	_r.open('GET',_p.url+'?date='+(new Date().getTime()));
	_r.responseType=_p.type||'json';
	_r.onerror=()=>{_rej(new Error(_r.statusText))};
	_r.send(null);
	});
}// _AJAX

const _GAME_IMG={//画像系スクリプト
	_img_loaded_count:0,
	_init_imgs(_obj, _progressfunc){
		return new Promise((_res, _rej) => {
		let _this = this;
		let _alertFlag = false;
		for (let _i in _obj) {
			let _o = _obj[_i];
			_o.obj.src = _obj[_i].src;
			_o.obj.onload = function () {
				_o.obj.width *= _o.rate;
				_o.obj.height *= _o.rate;
				_this._img_loaded_count++;
				if (_this._img_loaded_count >= Object.keys(_obj).length) {
					_res();
					return;
				}
				if (_progressfunc!==undefined){
					let _s = parseInt(_this._img_loaded_count / Object.keys(_obj).length * 100);
					_progressfunc(_s);
				}
			}
			_o.obj.onabort = () => {
				if (_alertFlag) {return;}
				_alertFlag = true;
				_rej(_o.obj.src);
				return;
			}
			_o.obj.onerror = () => {
				if (_alertFlag) {return;}
				_alertFlag = true;
				_rej(_o.obj.src);
				return;
			}
		}
	});
	}//_init_imgs
};

const _GAME_AUDIO={//オーディオ系スクリプト
	_audio_context:null,
	_audio_buffer_loader:null,
	_audio_now_obj_bg:null,//バックグラウンド現在再生用
	_audio_context_source_bg:null,//バックグラウンド再生用
	_audio_settimeout: null,
	_audio_loaded_count:0,
	_is_audio_context_source_bg: false, //バックグラウンド再生中判別フラグ
	_init(){
		let _this = this;
		_this._audio_context = new window.AudioContext();
	},
	_init_audios(_obj,_progressfunc){
		return new Promise((_res, _rej) => {
		let _this = this;
		let _alertFlag = false;
		for (let _i in _obj) {
			let _r = new XMLHttpRequest();
			_r.open('GET', _obj[_i].src, true);
			_r.responseType = 'arraybuffer'; //ArrayBufferとしてロード
			_r.onload =  ()=>{
				// contextにArrayBufferを渡し、decodeさせる
				_this._audio_context.decodeAudioData(
					_r.response,
					(_buf)=>{
						_obj[_i].buf = _buf;
						_this._audio_loaded_count++;
						if (_this._audio_loaded_count >= Object.keys(_obj).length) {
							_res();
							return;
						}
						//ローディングに進捗率を表示させる
						if (_progressfunc!==undefined){
							_progressfunc(_this._audio_loaded_count / Object.keys(_obj).length * 100);
						}
					},
					(_error)=>{
						console.log('一部音声読み込みに失敗しました。再度立ち上げなおしてください:' + _obj[_i].src);
						_rej(_obj[_i].src);
						return;
					});
			};
			_r.onabort = () => {
				if (_alertFlag) {return;}
				_alertFlag = true;
				_rej(_obj[_i].src);
				return;
			}
			_r.onerror = () => {
				if (_alertFlag) {return;}
				_alertFlag = true;
				_rej(_obj[_i].src);
				return;
			}
			_r.send();
		}
		});
	},
	_reset(){
		let _this = this;
		_this._audio_context=null;
		_this._audio_buffer_loader=null;
		_this._audio_now_obj_bg=null;
		_this._audio_context_source_bg = null;
		_this._is_audio_context_source_bg = false;
		_this._audio_settimeout = null;

		_this._audio_loaded_count = 0;
	},
	_setPlay(_obj) {
		//効果音用再生
		if(_obj===null||_obj===undefined){return;}
		let _this = this;
		var _s=_this._audio_context.createBufferSource();
		_s.buffer=_obj.buf;
		_s.loop=false;
		_s.connect(_this._audio_context.destination);
		_s.start(0);
	},
	_setOnBG(_obj){
		if(_obj===undefined){return;}
		this._audio_now_obj_bg = _obj;
	},
	_setPlayOnBG(_obj, _loop) {
		//バックグラウンド用再生
		//再生中の場合は、上書きする。
		//_obj:再生させたい音声オブジェクト
		//_loop:ループ可否
		//_time:再生完了時間（ms）
		let _this = this;

		_obj = (_obj === undefined) ? _this._audio_now_obj_bg : _obj;
		if (_obj===null){return;}
		let _time = _obj.loopOffset||0;
		_loop = (_loop || _loop === undefined) ? true : false;

		if(_this._is_audio_context_source_bg===true){
			_this._audio_context_source_bg.stop();
			_this._is_audio_context_source_bg=false;
		}
		let _t=_this._audio_context.createBufferSource();
		_t.buffer = _obj.buf;
		_this._audio_now_obj_bg = _obj; //バッファの一時保存用
		_t.connect(_this._audio_context.destination);
		_t.loop = _loop;
		_t.loopStart = _time || 0;
		_t.loopEnd = _obj.buf.duration;
		_t.start();
		
		_this._audio_context_source_bg=_t;
		_this._is_audio_context_source_bg=true;
	},
	_setStopOnBG(){
		//バックグラウンド用停止
		let _this = this;
		if(!_this._is_audio_context_source_bg){return;}
		_this._audio_context_source_bg.stop();
		_this._is_audio_context_source_bg=false;
		clearTimeout(_this._audio_settimeout);
	},
};


const _GAME={//ゲーム用スクリプト
	_url_params:new Array(),
	_txt:{//スプライトされたフォントのマッピング
		"0":"0",
		"1":"60",
		"2":"120",
		"3":"180",
		"4":"240",
		"5":"300",
		"6":"360",
		"7":"420",
		"8":"480",
		"9":"540",
		"a":"600",
		"b":"660",
		"c":"720",
		"d":"780",
		"e":"840",
		"f":"900",
		"g":"960",
		"h":"1020",
		"i":"1080",
		"j":"1140",
		"k":"1200",
		"l":"1260",
		"m":"1320",
		"n":"1380",
		"o":"1440",
		"p":"1500",
		"q":"1560",
		"r":"1620",
		"s":"1680",
		"t":"1740",
		"u":"1800",
		"v":"1860",
		"w":"1920",
		"x":"1980",
		"y":"2040",
		"z":"2100",
		":": "2160",
		"_": "2280",
		"-": "2340"
	},
	_ac:{
		//_DRAWのsetIntervalのアニメに併せ
		//アニメカウントを調整させる
		//_c:カウント
		//_a:配列
		//_p:割合
		_get:function(_c,_a,_p){//カウントの取得
			return (_c>=(_a.length*_p)-1)?0:_c+1;
		}
	},
	getRad(_o1,_o2){
		//各オブジェクトが持つx,yによるラジアン取得
		//_o1:自機
		//_o2:自機に対するオブジェクト
		//{x:000,y:000}形式
		if(_o1===undefined||_o2===undefined){return;}
		return Math.atan2((_o1.y-_o2.y),(_o1.x-_o2.x));
	},
	getDeg(_o1,_o2){
		//各オブジェクトが持つx,yからの角度取得
		if(_o1===undefined||_o2===undefined){return;}
		const _rad=Math.atan2((_o1.y-_o2.y),(_o1.x-_o2.x));
		return _rad/Math.PI*180;
	},
	getRadToDeg(_rad){
		//ラジアンから角度を取得する
		if(_rad===undefined||_rad===''){return null;}
		return _rad/Math.PI*180;
	},
	getBit(_bit,_len){
		return ('0'.repeat(_len)+_bit).slice(_len*-1);
	},
	getOrBit(_b1,_b2,_l){
		let _s=(parseInt(_b1,2)
				|parseInt(_b2,2)
			).toString(2);
		return this.getBit(_s,_l);
	},
	setUrlParams(){
		var _prm=location.search.slice(1).split(/(&|&amp;)/);
		for(var _i=0;_i<_prm.length;_i++){
				var _p=_prm[_i].replace('amp;','').split('=');
				if(_p[0]===''||_p[0]===undefined){continue;}
				if(_p[0]==='&'){continue;}
				this._url_params[_p[0]]=_p[1];
		}
	},
	isObjsLessDistance(_p){
		if(_p===undefined){return false;}
		//プレーヤーと敵オブジェクトの距離
		//_p.p:プレーヤーオブジェクト
		//_p.e:敵オブジェクト
		//_p.d:距離
		//return:
		//true:距離以内
		//false:距離以上
		if(_p.p===undefined||_p.e===undefined){return false;}
		let _op=_p.p.getPlayerCenterPosition();
		let _oe=_p.e.getEnemyCenterPosition();
		let _d=_p.d||100;
		let _d_x = Math.abs(_op._x - _oe._x);
		let _d_y = Math.abs(_op._y - _oe._y);
		let _d_l = Math.sqrt(
			Math.pow(_d_x, 2) + Math.pow(_d_y, 2)
		); //斜辺
		if(_d_l<_d){return true;}
		return false;
	},
	isShotCanvasOut(_t){
		if(_t.x<-_MAP.t
			||_t.x>_CANVAS.width+_MAP.t
			||_t.y<-_MAP.t
			||_t.y>_CANVAS.height+_MAP.t
			){
			return true;
		}
		return false;
	},
	isEnemyCanvasOut(_oe,_dir,_size){
		//_dir {up,right,down,left}
		//_size {up,right,down,left}
		//	trueまたはfalseを指定
		let _e=_oe.getEnemyCenterPosition();

		//向き判別
		let _d=_dir||{up:true,down:true,left:true,right:true}
		let _e_w=_oe.width;
		let _e_h=_oe.height;

		//サイズ判別
		let _s=_size||{up:0,down:0,left:0,right:0}
		let _up=_s.up||0;
		let _right=_s.right||0;
		let _down=_s.down||0;
		let _left=_s.left||0;
	
		if((_e._x<0-_e_w-_left&&_d.left===true)//左
			||(_e._x>_CANVAS.width+_e_w+_right&&_d.right===true)//右
			||(_e._y<0-_e_h-_up&&_d.up===true)//上
			||(_e._y>_CANVAS.height+_e_h+_down&&_d.down===true)//下
			){
				return true;
			}
		return false;
	
	},
	isSqCollision(_s1,_s1_n,_s2,_s2_n,_d){
		return (this.isSqCollision_laser(_s1,_s1_n,_s2,_s2_n,_d)).ret;
	},
	isSqCollision_laser(_s1,_s1_n,_s2,_s2_n,_d){
		//_s1四辺と、_s2(その中の複数の四辺)の衝突判定。
		//重なった場合は、衝突とする。
		//（1）_s1,_s2の中心点を取得
	
		//_s1:2座標"x1,y1,x2,y2,col"文字列
		//_s1_n:_s1の現在の座標（左上）"x,y"
		//_s2:2座標"x1,y1,x2,y2,col"文字列でかつ配列
		//_s2_n:_s2の現在の座標（左上）"x,y"
		// ※col:当たり判定にしない衝突
		//		false当たり判定にしない
		//_d:デバッグ用(true)
		//
		// return
		// _IS_SQ_COL(0):衝突している、かつ、あたり判定とする。
		// _IS_SQ_COL_NONE(1):衝突している、ただし、あたり判定はしない。
		// _IS_SQ_NOTCOL(2):衝突していない。
	
		//各点の現在の位置を取得する（座標位置は左上）
		let _s1_n_x=parseInt((_s1_n===undefined)?0:_s1_n.split(',')[0]);
		let _s1_n_y=parseInt((_s1_n===undefined)?0:_s1_n.split(',')[1]);
		let _s2_n_x=parseInt((_s2_n===undefined)?0:_s2_n.split(',')[0]);
		let _s2_n_y=parseInt((_s2_n===undefined)?0:_s2_n.split(',')[1]);
	
		let _s1_p=_s1.split(',');//s1ポイント
		let _s1_w=parseInt(_s1_p[2])-parseInt(_s1_p[0]);//幅
		let _s1_h=parseInt(_s1_p[3])-parseInt(_s1_p[1]);//高
		let _s1_l=Math.sqrt(
					Math.pow(_s1_w,2)+Math.pow(_s1_h,2)
				);//斜辺
		let _s1_c_x=(_s1_w/2)+_s1_n_x+parseInt(_s1_p[0]);//_s1の中心点x
		let _s1_c_y=(_s1_h/2)+_s1_n_y+parseInt(_s1_p[1]);//_s1の中心点y
		if(_d){
			console.log(_s1_c_x+":"+_s1_c_y);
		}
		//敵の複数衝突マップ分ループさせる
		for(let _i=0;_i<_s2.length;_i++){
			let _s2_p=_s2[_i].split(',');
			//1衝突マップの幅
			let _s2_w=parseInt(_s2_p[2])-parseInt(_s2_p[0]);
			//1衝突マップの高さ
			let _s2_h=parseInt(_s2_p[3])-parseInt(_s2_p[1]);
			//1衝突マップの当たり判定フラグ
			let _s2_col=(function(_f){
				if(_f===undefined){return true;}
				if(_f==='false'){return false;}
				return false;
			})(_s2_p[4]);
	
			//1衝突マップの斜辺
			let _s2_l=Math.sqrt(
				Math.pow(_s2_w,2)+Math.pow(_s2_h,2)
			);//斜辺
				
			let _s2_c_x=(_s2_w/2)+_s2_n_x+parseInt(_s2_p[0]);//_s2の中心点x
			let _s2_c_y=(_s2_h/2)+_s2_n_y+parseInt(_s2_p[1]);//_s2の中心点y
					
			//_s1（自機）と_s2（1衝突）中心点の距離とその斜辺
			let _d_x=Math.abs(_s2_c_x-_s1_c_x);
			let _d_y=Math.abs(_s2_c_y-_s1_c_y);
			let _d_l=Math.sqrt(
				Math.pow(_d_x,2)+Math.pow(_d_y,2)
			);//斜辺
	
			//衝突判定
			let _tmpx=_s2_n_x+parseInt(_s2_p[0]);
	//		if(_d_l<(_s1_l/2)+(_s2_l/2)){
			if((_s1_w/2)+(_s2_w/2)>_d_x
				&&(_s1_h/2)+(_s2_h/2)>_d_y){
				return (_s2_col)
					?{ret:_IS_SQ_COL,val:_tmpx}
					:{ret:_IS_SQ_COL_NONE,val:_tmpx};
			}
		}//_i
		return {ret:_IS_SQ_NOTCOL,val:_CANVAS.width};
	},
	_setDrawToText(_p){
		if(_p===undefined){return;}
		//キャンバス用にテキストからフォントに置換させる。
		//s:テキスト
		//_x:テキスト開始x座標位置
		//		数字:x座標位置
		//		left:左寄せ
		//		center:中央寄せ
		//		right:右寄せ
		//_y:テキスト開始y座標位置
		//		数字:x座標位置
		//		top:上寄せ
		//		center:中央寄せ
		//		bottom:下寄せ
		//r:文字表示比率(0.0〜1.0)
		//alpha:文字表示比率(0.0〜1.0)
		let _this=this;
		const img=_CANVAS_IMGS_INIT.font.obj;
		const imgsize=img.height;

		_p.r = _p.r || 1;
		_p.alpha = (_p.alpha === undefined || _p.alpha === null) ? 1 : _p.alpha;

 		let _x=(()=>{//x位置の調整
			if(_p.x === 'left'){return 0;}
			if(_p.x === 'center') {
				return parseInt(_CANVAS.width / 2) - parseInt(_p.s.length * (imgsize * _p.r) / 2)
			}
			if(_p.x === 'right'){
				return _CANVAS.width - parseInt(_p.s.length * imgsize * _p.r);}
			return _p.x;
		})();
		let _y=(()=>{//y位置の調整
			if(_p.y === 'top'){return 0;}
			if(_p.y === 'center'){
				return parseInt(_CANVAS.height / 2) - parseInt((imgsize * _p.r) / 2)
			}
			if(_p.y === 'bottom'){
				return _CANVAS.height - parseInt(imgsize * _p.r);}
			return _p.y;
		})();
		for(let _i=0;_i<_p.s.length;_i++){
			if(_p.s[_i]===' '){continue;}
			_GAME._setDrawImage({
				img:img,
				x: _x + (imgsize * _p.r * _i),
				y: _y,
				imgPosx:parseInt(_this._txt[_p.s[_i]]),
				width:imgsize,
				height:imgsize,
				scale:_p.r,
				basePoint:1,
				alpha:_p.alpha
			});
		}
	},//_setDrawToText
	_setTextToFont(_o,_str,_w){
		//ブラウザ用にテキストからフォントに置換させる。
		if(_o===undefined||_o===null){return;}
		let _this=this;
		_w=_w||30;
		let _s='';
		for(let _i=0;_i<_str.length;_i++){
			if(_str[_i]===' '){
				_s+='<img src="./images/gradius_spacer.png" width="'+_w+'">';
				continue;
			}
			let _pos=parseInt(_this._txt[_str[_i]])*(_w/60)*-1;
			_s+='<div style="background:url(./images/gradius_font.png) no-repeat;width:'+_w+'px;height:'+_w+'px;background-position:'+_pos+'px 0px;background-size:cover;display:inline-block;"></div>';
		}
		_o.innerHTML=_s;
	},//_setTextToFont
	_setDrawImage(_d){
		//画像表示
		//画像自体、canvasimgで定義したrateは1.0を使用すること。
		//imgPosx:画像からのx位置
		//imgPosy:画像からのy位置
		//t_width:トリミングする画像幅
		//t_height:トリミングする画像高さ
		//deg:角度
		//scale:画像中心を基点とした比率維持の拡大縮小。
		//		0の場合は表示しない。
		//basePoint:拡縮・回転時の基準点
		//alpha:透明度
		//direct:CANVASによるオブジェクト配置
		//		_DEF_DIR._D:下向き
		//		_DEF_DIR._LD:左下向き
		//		_DEF_DIR._LU:左上向き
	
		//以下は描画処理させない
		//引数未定義は終了
		if(_d===undefined
			||_d.img===undefined
			||_d.scale===0){return;}
		//引数は以下
		let _width=_d.width||_d.img.width;
		let _height=_d.height||_d.img.height;
		let _t_width=_d.t_width||_width;
		let _t_height=_d.t_height||_height;
		let _deg=_d.deg||0;
		let _imgPosx=_d.imgPosx||0;
		let _imgPosy=_d.imgPosy||0;
		let _scale=_d.scale||1;
		let _x=_d.x||0;
		let _y=_d.y||0;
		let _basePoint=_d.basePoint||5;//拡縮による基準点
		let _alpha=(_d.alpha===undefined)?1:_d.alpha;//透明度
		let _direct=(_d.direct===undefined)?_DEF_DIR._D:_d.direct;//向き
	
		if(_d.basePoint===1
			&&_d.t_width===undefined
			&&_d.t_height===undefined
			&&_d.imgPosx===undefined
			&&_d.alpha===undefined
			&&_d.scale===undefined
			&&_d.deg===undefined){
	
	//		console.log('here')
			_CONTEXT.drawImage(
				_d.img,
				_x,
				_y,
				_width,
				_height		
			);

			if (_ISDEBUG) {
				_CONTEXT.strokeStyle = 'rgba(200,200,255,0.5)';
				_CONTEXT.beginPath();
				_CONTEXT.rect(
					_x,_y,
					_width,
					_height
				);
				_CONTEXT.stroke();
			}
			return;
		}
	
		const _DEF_BASEPOINT=[//拡縮基準点ポイントの定義(0-8)
			{x:0,y:0},//0:ここはありえない
			{x:0,y:0},//1:左上
			{x:-(_width/2),y:0},//2:上真中
			{x:-_width,y:0},//3:右上
			{x:0,y:-(_height/2)},//4:左真中
			{x:-(_width/2),y:-(_height/2)},//5:真中
			{x:-_width,y:-(_height/2)},//6:右真中
			{x:0,y:-_height},//7:左下
			{x:-(_width/2),y:-_height},//8:下真中
			{x:-_width,y:-_height}//9:右下
		]
	
		_CONTEXT.save();
		_CONTEXT.translate(_x,_y);
		((_direct)=>{
			if (_direct === undefined) return;
			if (_direct === _DEF_DIR._U) {//上
				_CONTEXT.setTransform(1, 0, 0, -1, _x, _y + _height);
			}
			if (_direct === _DEF_DIR._LU) {//上の左向
				_CONTEXT.setTransform(-1, 0, 0, -1, _x + _width, _y + _height);
			}
			if (_direct === _DEF_DIR._LD) {//下の左向
				_CONTEXT.setTransform(-1, 0, 0, 1, _x + _width, _y);
			}
		})(_d.direct);
		if (_d.alpha !== undefined) _CONTEXT.globalAlpha = _alpha;
		if (_d.deg !== undefined) _CONTEXT.rotate(_deg * Math.PI / 180);
		if (_d.scale !== undefined) _CONTEXT.scale(_scale, _scale);
		_CONTEXT.drawImage(
			_d.img,
			_imgPosx,
			_imgPosy,
			_t_width,
			_t_height,
			_DEF_BASEPOINT[_basePoint].x,
			_DEF_BASEPOINT[_basePoint].y,
			_width,
			_height		
		);
	
		if (_ISDEBUG) {
			_CONTEXT.strokeStyle = 'rgba(200,200,255,0.5)';
			_CONTEXT.beginPath();
			_CONTEXT.rect(
				_DEF_BASEPOINT[_basePoint].x,
				_DEF_BASEPOINT[_basePoint].y,
				_width,
				_height
			);
			_CONTEXT.stroke();
		}

		_CONTEXT.restore();

	},
	_multilineText(context, text, width) {
		let len=text.length,
			strArray=[],
			_tmp='';
	
		if(len<1){
			//textの文字数が0だったら終わり
			return strArray;
		}
	
		for(let _i=0;_i<len;_i++){
			let _c=text.charAt(_i);  //textから１文字抽出
			if(_c==='\n'){
				/* 改行コードの場合はそれまでの文字列を配列にセット */
				strArray.push(_tmp);
				_tmp="";
				continue;
			}
	
			/* contextの現在のフォントスタイルで描画したときの長さを取得 */
			if (context.measureText(_tmp+_c).width<=width){
				/* 指定幅を超えるまでは文字列を繋げていく */
				_tmp+=_c;
			}else{
				/* 超えたら、それまでの文字列を配列にセット */
				strArray.push(_tmp);
				_tmp=_c;
			}
		}
		/* 繋げたままの分があれば回収 */
		if(_tmp.length>0){strArray.push(_tmp);}
	
		return strArray;
	}
};
	
//=====================================================
//	gradius_parts_others.js
//	他のパーツ
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

const _PARTS_OTHERS = {
	_pm:new Object(),
	_stageselect:new Object(),
	_score:new Object(),
	_background: new Object(),
	_background_star: new Object(),
	_background_defimg: {//背景オブジェクト定義
		'volcano': (_p)=>{return new GameObject_BACKGROUND_VOLCANO(_p)},
		'moai': (_p)=>{return new GameObject_BACKGROUND_MOAI(_p)},
		'cell': (_p)=>{return new GameObject_BACKGROUND_CELL(_p)},
		'frame': (_p)=>{return new GameObject_BACKGROUND_FRAME(_p)}
	},

	_powercapsell_ar:new Array(),

	_reset(){
		let _this = this;
		_this._pm = new Object();
		_this._stageselect = new Object();
		_this._background = new Object(),
		_this._background_star = new Object(),
//		_this._score= new Object();スコアは永続させる

		_this._powercapsell_ar= new Array();
	},
	_init_score(){
		this._score = new GameObject_SCORE();
	},
	_draw_score(){
		this._score.setDrawImage();
	},
	_set_score(_score){
		this._score.set(_score);
	},
	_reset_score() {
		this._score.reset();
	},
	_init_background(){
		this._background_star = new GameObject_BACKGROUND_CONTROL_STAR({
			_initx:_MAP.map_background_initx,
			_infinite: _MAP.map_infinite
		});
		if (_MAP.map_background_img==='none'){return;}
		this._background = this._background_defimg[_MAP.map_background_img]({
			_initx: _MAP.map_background_initx,
			_infinite: _MAP.map_infinite
		});
	},
	_move_background(){
		this._background_star.move();
		if (_MAP.map_background_img==='none'){return;}
		this._background.move();
	},
	_draw_background(){
		this._background_star.setDrawImage();
		if (_MAP.map_background_img==='none'){return;}
		this._background.setDrawImage();
	},

	_add_powercapsell(_p){
		if(_p===undefined){return;}
		let _this = this;
		_this._powercapsell_ar.push(new GameObject_POWERCAPSELL(_p.x, _p.y));
	},
	_move_powercapsell(){
		let _this = this;
 		for (let _i = _this._powercapsell_ar.length-1; _i >= 0; _i--) {
			let _o = _this._powercapsell_ar[_i];
			if (_o.x + _o.width < 0 || _o.gotpc) {
				_this._powercapsell_ar.splice(_i, 1);
			}
			_o.move();
		}
	},
	_draw_powercapsell() {
		let _this = this;
		_this._powercapsell_ar.map((_o) => {_o.setDrawImage();});
	},
	_set_powercapsell(){
		let _this = this;

		for(let _i=0;_i<_this._powercapsell_ar.length;_i++){
			let _pwc=_this._powercapsell_ar[_i];
			if(_pwc.gotpc){continue;}

			let _pl=_PARTS_PLAYERMAIN._players_obj.getPlayerCenterPosition();
			let _pwc_c=_pwc.getPCCenterPosition();

			let _a=Math.sqrt(
				Math.pow(_pwc_c._x-_pl._x,2)+
				Math.pow(_pwc_c._y-_pl._y,2)
				);
			let _d=Math.sqrt(
				Math.pow(_PARTS_PLAYERMAIN._players_obj.width,2)+
				Math.pow(_PARTS_PLAYERMAIN._players_obj.height,2)
			);

			if(!(_a<_d/2)){continue;}

			_pwc.getPowerCapcell();
			if(_pwc.type==='red'){
				_POWERMETER.move();
				_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['pc']);
				_PARTS_OTHERS._set_score(_pwc.getscore);
				continue;
			}
			if(_pwc.type==='blue'){
				//CANVAS内の敵を外す
				_PARTS_ENEMIES._get_enemies().forEach((_e)=>{
					if(_GAME.isEnemyCanvasOut(_e)){return;}
					if(_e.isStandBy()){return;}
					if(!_e.isAbleCollision()){return;}

					_e._status-=1;
					if(!_e.isalive()){
						_PARTS_OTHERS._set_score(_e.getscore);
						_e.showCollapes();
					}
				});
				//CANVAS内の敵のショットを全て外す
				_PARTS_ENEMY_SHOT._get_shot().forEach((_es)=>{
					if(_GAME.isEnemyCanvasOut(_es)){return;}
					_es.init();
				});
				_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['enemy_all_out']);
			}
		}
	}
};


class GameObject_PM{
	constructor(){
		let _this=this;
		_this.img=_CANVAS_IMGS['meter'].obj;
		_this.x=(_CANVAS.width/2)-
				(_this.img.width/2);
				_this.y=_CANVAS.height-30;

		_this.meterdef_status='111111';
		_this.meterdef_current='000000';

		_this.meterdef={
			'n_32':{
				func:()=>{
					if(_PARTS_PLAYERMAIN._players_obj.accel>=10){
						_this._set_meter_status();
						return;
					}
					_PARTS_PLAYERMAIN._players_obj.accel+=2;
				}
			},
			'n_16':{
				func:()=>{
					_PARTS_PLAYERMAIN._shot_missle_isalive=true;
					_this._set_meter_status();
				}
		  	},
			'n_8':{
				func:()=>{
					_PARTS_PLAYERMAIN._shot_type=_PARTS_PLAYERMAIN._shot_type_def.DOUBLE;
					_this._set_meter_status();
				}
		  	},
			'n_4':{
				func:()=>{
					_PARTS_PLAYERMAIN._shot_type=_PARTS_PLAYERMAIN._shot_type_def.LASER;
					_this._set_meter_status();
				}
		  	},
			'n_2':{
				func:()=>{
					_PARTS_PLAYERMAIN._option_obj[_PARTS_PLAYERMAIN._option_count].settruealive();
					_PARTS_PLAYERMAIN._option_count++;

					if(_PARTS_PLAYERMAIN._option_count
						<_PARTS_PLAYERMAIN._option_max){return;}
					_this._set_meter_status();
				}
		  	},
			'n_1':{
				func:()=>{
					_PARTS_PLAYERMAIN._players_force_obj.init();
					_this._set_meter_status();
				}
		  	}
		};

		//パワーメータ選択画像
		_this._c_pms=0;//カレントの位置
		_this.pms_img=_CANVAS_IMGS_INIT['gradius_powermeterselect'].obj;
		_this.pms_img_selected=_CANVAS_IMGS_INIT['gradius_powermeterselect_selected'].obj;
		//SPEEDUP〜OPTION選択済定義
		_this.pms_selected=[19,91,163,235];

		//SHIELD選択済定義
		_this._c_pmss=0;//カレントの位置
		_this.pms_img_shield_selected=_CANVAS_IMGS_INIT['gradius_powermeterselect_shield_selected'].obj;
		_this.pmss_selected=[0,100];
	}
	_set_hide(){
		let _this=this;
		_PARTS_PLAYERMAIN._shot_type = _PARTS_PLAYERMAIN._shot_type_def.NORMAL;
		_PARTS_PLAYERMAIN._shot_missle_isalive = true;
		for (let _i = 0; _i < _PARTS_PLAYERMAIN._option_max; _i++) {
			_PARTS_PLAYERMAIN._option_obj[_i].settruealive();
		}
		_PARTS_PLAYERMAIN._option_count = 4;
		_PARTS_PLAYERMAIN._players_force_obj.init();
		_KEYSAFTERPAUSE = [];

		_this._set_current_reset();
		_this.meterdef_status = '101100';
	}
	_set_current_reset(){
		this.meterdef_current='000000';
	}
	_set_meter_status(){
		//AND
		let _ms=this.meterdef_status;
		let _mc=(~parseInt(this.meterdef_current,2) >>> 0).toString(2).slice(-6);//符号なし反転し６ビットにする

		this.meterdef_status=
			this._get_bit(
					(parseInt(_ms,2)
						&parseInt(_mc,2)
					).toString(2)
			);

		//DOUBLE、LASERを装備したら、
		//いずれかを有効にする
		let _c=parseInt(this.meterdef_current,2);
		if(_c!==8&&_c!==4){return;}
		this.meterdef_status=
			this._get_bit(
					(parseInt(this.meterdef_status,2)
						|parseInt((_c===8)?'000100':'001000',2)
					).toString(2)
			);
	}
	_set_meter_on(_bit){
		//現在のステータスに強制的にフラグを立てる
		this.meterdef_status=
			this._get_bit(
				(parseInt(this.meterdef_status,2)
					|parseInt(_bit,2)
				).toString(2)
		);	}
	_get_bit(_bit){
		return ('000000'+_bit).slice(-6);
	}
	_get_meter_current(_num){
		return (parseInt(_num,2)===0
				||parseInt(_num,2)===1)
				?'100000'
				:('000000'+
					(parseInt(_num,2)>>1).toString(2)
					).slice(-6);
	}
	move(){
		this.meterdef_current=
			this._get_meter_current(
				this.meterdef_current);
	}
	playerset(){
		//停止中は無視
		if (_IS_DRAW_STOP()) {return;}

		let _mc=parseInt(this.meterdef_current,2);
		let _ms=parseInt(this.meterdef_status,2);
		//メーターにアクティブなし
		if(_mc===0){return;}
		//メーターにアクティブあるが、すでに装備ずみ
		if((_mc&_ms)===0){return;}

		//自機のパワーアップ演出
		_PARTS_PLAYERMAIN._players_obj.set_equipped();
		_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['playerset']);
		this.meterdef_status=
			this._get_bit(
					(parseInt(this.meterdef_status,2)
					|parseInt(this.meterdef_current,2)
					).toString(2)
				);
		this.meterdef['n_'+_mc].func();
		this._set_current_reset();
	}
	show(){
		let _this=this;
		//メーターを表示
		//もともと7列の画像なので、
		//表示配置xは36ピクセル右に位置させる。
		_GAME._setDrawImage({
			img: _this.img,
			x: _this.x + 36,
			y: _this.y,
			t_width: _this.img.width - 71,
			width: _this.img.width - 71,
			height: _this.img.height,
			basePoint: 1
		});

		//各ステータスでメーターを上書
		//※装備ずみ
		for(let _i=0;
			_i<this.meterdef_status.length;_i++){
			if(this.meterdef_status[_i]!=='0'){continue;}
			_GAME._setDrawImage({
				img: _this.img,
				x: _this.x + 36 + (72 * _i),
				y: _this.y,
				imgPosx: _this.img.width - 72,
				width: 72,
				height: _this.img.height,
				basePoint: 1
			});
		}

		//パワーカプセル取得時のステータス
		let _mc=parseInt(this.meterdef_current,2);
		if(_mc===0){return;}
		let _ms=parseInt(this.meterdef_status,2);

		let _img_e=_CANVAS_IMGS['meter_c'].obj;
		let _e_pos=//カレント中にて位置を取得
			((_mc&_ms)!==0)//装備ステータスで判定
			?72*_this.meterdef_current.indexOf('1')
			:_img_e.width-72;
		_GAME._setDrawImage({
			img: _img_e,
			x: _this.x + 36 + (72 * _this.meterdef_current.indexOf('1')),
			y: _this.y,
			imgPosx: _e_pos,
			width: 72,
			height: _img_e.height,
			basePoint: 1
		});
	}

	pms_disp(){
		_CONTEXT.clearRect(0,0,_CANVAS.width,_CANVAS.height);

		_GAME._setDrawToText({
			s: 'power meter select',
			x: 'center',
			y: 20,
			r: 0.6
		});

		_GAME._setDrawToText({
			s: 'shield select',
			x: 200,
			y: 400,
			r: 0.3
		})

		//センタリングに表示
		_GAME._setDrawImage({
			img: this.pms_img,
			x: (_CANVAS.width / 2) - (this.pms_img.width / 2),
			y: 70,
			width: this.pms_img.width,
			height: this.pms_img.height,
			basePoint: 1
		});

		//SHIELD表示
		_GAME._setDrawImage({
			img: _CANVAS_IMGS['meter'].obj,
			imgPosx: 360,
			imgPosy: 0,
			x: 290,
			y: 430,
			width: 72,
			height: 19,
			basePoint: 1
		});

		//SHIELD選択表示
		let _pms=_CANVAS_IMGS_INIT['gradius_powermeterselect_shield'].obj;
		_GAME._setDrawImage({
			img: _pms,
			x: 470,
			y: 390,
			width: _pms.width,
			height: _pms.height,
			basePoint: 1
		});

	}
	set_pms_status(_p){
		if(_p===undefined){return;}
		let _this=this;
		let _n = _this._c_pms + _p.num;
		_n=(_n<=0)?0:_n;
		_n=(_n>=_this.pms_selected.length-1)?_this.pms_selected.length-1:_n;
		_this._c_pms = _n;
	}
	set_pmss_status(_p) {
		if(_p===undefined){return;}
		let _this=this;
		let _n = _this._c_pmss + _p.num;
		_n=(_n<=0)?0:_n;
		_n=(_n>=_this.pmss_selected.length-1)?_this.pmss_selected.length-1:_n;
		_this._c_pmss = _n;
	}
	pms_select(){
		let _this=this;
		_this.pms_disp();
		//パワーメータ選択済み
		_GAME._setDrawImage({
			img: _this.pms_img_selected,
			imgPosx: 0,
			imgPosy: _this.pms_selected[_this._c_pms],
			x: (_CANVAS.width / 2) - (_this.pms_img.width / 2),
			y: _this.pms_selected[_this._c_pms] + 70,
			width: 420,
			height: 74,
			basePoint: 1
		});

		//SHIELDパワーメータ選択済み
		_GAME._setDrawImage({
			img: _this.pms_img_shield_selected,
			imgPosx: _this.pmss_selected[_this._c_pmss],
			imgPosy: 0,
			x: _this.pmss_selected[_this._c_pmss] + 470,
			y: 390,
			width: 85,
			height: 75,
			basePoint: 1
		});
	}

}

class GameObject_STAGESELECT{
	constructor(){
		let _this=this;
		_this.mapdef_status=0;
		_this.mapdef = (_ISDEBUG) ? (_MAPDEFS[_GAME._url_params['mp'] || _this.mapdef_status]) : _MAPDEFS[_this.mapdef_status];
	}
	init(){
		this.disp_thumb_map();
	}
	set_map_status(_p){
		if(_p===undefined){return;}
		let _this=this;
		let _n = _this.mapdef_status + _p.num;
		_n=(_n<=0)?0:_n;
		_n=(_n>=_MAPDEFS.length-1)?_MAPDEFS.length-1:_n;
		_this.mapdef=_MAPDEFS[_n];
		_this.mapdef_status=_n;
	}
	disp_thumb_map(){
		let _this=this;
//		let _map=new GameObject_MAP(0);
		//描画は横は50〜950px
		_CONTEXT.clearRect(0,0,_CANVAS.width,_CANVAS.height);
		//テキスト表示
		_GAME._setDrawToText({
				s:'stage select',
				x:'center',
				y:20,
				r:0.6
		});

		//ページングを表示
		let _pl=500-(20*(_MAPDEFS.length/2)+10);//センタリング
		for(let _i=0;_i<_MAPDEFS.length;_i++){
			_CONTEXT.beginPath();
			_CONTEXT.lineWidth=1;
			_CONTEXT.strokeStyle='rgba(255,255,255,1)';
			_CONTEXT.fillStyle='rgba(255,255,255,1)';
			if(_i===this.mapdef_status){
				_CONTEXT.fillRect(_pl+(_i*20),85,10,10);
			}else{
				_CONTEXT.strokeRect(_pl+(_i*20),85,10,10);
			}
		}

		//MAPを表示
		_MAP.mapdef=_this.mapdef._map;
		_MAP.map_theme=_this.mapdef._theme;
		_MAP.mapdef_col=[];
		_MAP.set_gamestart_mapdef_col();
		_MAP.showMapForStageselect(_this.mapdef);

		//テキスト表示
		_GAME._setDrawToText({s:'stage title',x:400,y:130,r:0.3});
		_CONTEXT.moveTo(400,160);
		_CONTEXT.lineTo(950,160);
		_CONTEXT.stroke();
		_CONTEXT.font='20px sans-serif';
		let _ar=_GAME._multilineText(_CONTEXT,this.mapdef._title,550);
		for(let _i=0;_i<((_ar.length>2)?2:_ar.length);_i++){
			_CONTEXT.fillText(_ar[_i],400,190+(_i*26));
		}

		_GAME._setDrawToText({s:('difficult:'+this.mapdef._difficult),x:400,y:230,r:0.3});
		_CONTEXT.moveTo(400,260);
		_CONTEXT.lineTo(950,260);
		_CONTEXT.stroke();

		_GAME._setDrawToText({s:'detail',x:400,y:300,r:0.3});
		_CONTEXT.moveTo(400,330);
		_CONTEXT.lineTo(950,330);
		_CONTEXT.stroke();
		_ar=_GAME._multilineText(_CONTEXT,this.mapdef._body,520);
		for(let _i=0;_i<((_ar.length>4)?4:_ar.length);_i++){
			_CONTEXT.fillText(_ar[_i],400,360+(_i*30));
		}

	}
}

class GameObject_SCORE{
	constructor(){
		this.score1p=0;
		this.score2p=0;
		this.def_scorehi=57300;
		this.scorehi=this.def_scorehi;
	}
	reset(){
		//1p,2pのスコアを初期化
		this.score1p=0;
		this.score2p=0;
	}
	set(_score){
		this.score1p+=_score;
		if(this.scorehi>=this.score1p){return;}
		this.scorehi=this.score1p;
	}
	setDrawImage(){
		let _img=_CANVAS_IMGS_INIT['font'].obj;
		let _s='1p'+('        '+this.score1p).slice(-8);
		_GAME._setDrawToText({s:_s,x:180,y:10,r:0.3});

		_s='hi'+('        '+this.scorehi).slice(-8);
		_GAME._setDrawToText({s:_s,x:400,y:10,r:0.3});

		_s='2p'+('        '+this.score2p).slice(-8);
		_GAME._setDrawToText({s:_s,x:620,y:10,r:0.3});
	}
}

//パワーカプセルの定義
//※スプライト画像使用
class GameObject_POWERCAPSELL{
	constructor(_x,_y){
		let _this=this;
		_this.x=_x||0;
		_this.y=_y||0;
		_this.getscore=200;
		_this.gotpc=false;
		_this.type=(Math.random()>0.1)
					?'red'
					:'blue';
		_this._c=0;
		//アニメーション定義
		_this.ani=[0,25,50,75];
		_this.img=_CANVAS_IMGS['gradius_pc'].obj;
		_this.width=25;
		_this.height=23;
	}
	getPCCenterPosition(){
		let _this=this;
		//スプライト画像のため1コマ（正方形）
		return {_x:_this.x+(_this.width/2),
				_y:_this.y+(_this.height/2)}
	}
	getPowerCapcell(){this.gotpc=true;}
	setDrawImage(){
		let _this=this;
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			imgPosx:_this.ani[parseInt(_this._c/5)]+((_this.type==='blue')?100:0),
			width:_this.width,
			height:_this.height,
			basePoint:1
		});
	}
	move(){
		let _this=this;
		//すでにパワーカプセル取得済みは終了
		if(_this.gotpc){return;}
		_this.x=_MAP.getX(_this.x);
		_this.y=_MAP.getY(_this.y);
		
		_this._c=(_this._c>=(_this.ani.length*5)-1)?0:_this._c+1;
	}
}


class GameObject_BACKGROUND {
	constructor(_p){
		this.x = _p.x || 0;
		this.y = _p.y || 0;
		this._c = 0;
	}
	setDrawImage() {} //描画
	move() {} //移動
}

//背景（星）コントローラー
class GameObject_BACKGROUND_CONTROL_STAR
	extends GameObject_BACKGROUND {
	constructor(_p){
		super({x:0,y:0});
		this._background_ar = new Array();
		for (let _i = 0; _i < 70; _i++) {
			this._background_ar.push(new GameObject_BACKGROUND_STAR(_p));
		}
	}
	setDrawImage() { //描画
		this._background_ar.forEach((_o)=>{_o.setDrawImage();});
	}
	move() { //移動
		this._background_ar.forEach((_o)=>{_o.move();});
	}
}
//背景（星）
class GameObject_BACKGROUND_STAR
	extends GameObject_BACKGROUND {
	constructor(_p){
		super({
			x: _CANVAS.width * Math.random(),
			y: ((_p._infinite)?2:1)*_CANVAS.height * Math.random()
		});
		this.rgb=parseInt(Math.random()*255)+","+
				parseInt(Math.random()*255)+","+
				parseInt(Math.random()*255);
		this.speed=Math.random()*5;
		this._slowx = 1.3;
		this._slowy = 2;

		this._c=parseInt(Math.random()*200);
		this._ar_alpha=[0.0,0.2,0.4,0.6,0.8,1.0,0.8,0.6,0.4,0.2];
		this._r=Math.random()+1;
	}
	setDrawImage(){
		let _this = this;
		_CONTEXT.beginPath();
		_CONTEXT.arc(_this.x, _this.y, _this._r, 0, Math.PI * 2, true);
		_CONTEXT.fillStyle = 'rgba(' + _this.rgb + ',' + _this._ar_alpha[parseInt(_this._c / 20)] + ')';
		_CONTEXT.fill();
	}
	move(){
		let _this = this;
		_this._c = (_this._c >= 200 - 1) ? 0 : _this._c + 1;
		if (_MAP.getBackGroundSpeed() === 0){return;}
		_this.x=(_this.x<0)
					?_CANVAS.width
					: _this.x - _this.speed;
		_this.y = _MAP.getBackGroundY(_this.y, this._slowy);
	}
}

//背景（親）
class GameObject_BACKGROUND_IMG extends GameObject_BACKGROUND {
	constructor(_p) {
		super({x: 0,y: 0});
		this._initx = _p._initx||0;
		this._alpha = 1;
		this._slowx = _p._slowx || 1.3;
		this._slowy = _p._slowy || 2;
		this.img = _CANVAS_IMGS['background_'+_p._img];
		//タイル上の画像
		this._ar = 
			(()=>{
				if(_p._infinite){
					//縦スクロール有
					return [{x:this._initx,y:0},
							{x:this._initx+_CANVAS.width,y:0},
							{x:this._initx,y:_CANVAS.height},
							{x:this._initx+_CANVAS.width,y:_CANVAS.height}]
				}
				return [{x:this._initx,y:0},
						{x:this._initx+_CANVAS.width,y:0}]
			})();
	}
	setDrawImage() {
		// 現在のパスをリセットする
		this._ar.forEach((_o) => {
			_CONTEXT.save();
			_CONTEXT.globalAlpha = this._alpha;
			// 塗りつぶしスタイルの設定
			_CONTEXT.fillStyle = _CONTEXT.createPattern(this.img.obj, 'repeat');
			_CONTEXT.translate(_o.x, _o.y);
			_CONTEXT.fillRect(0, 0, _CANVAS.width, _CANVAS.height);
			_CONTEXT.restore();
		});
	}
	move() {
		if(_MAP.getBackGroundSpeed() === 0){return;}
		this._ar.forEach((_o,_i) => {
			_o.x = _MAP.getBackGroundX(_o.x, this._slowx);
			_o.y = _MAP.getBackGroundY(_o.y, this._slowy);
		});
	}
}


class GameObject_BACKGROUND_VOLCANO
	extends GameObject_BACKGROUND_IMG {
	constructor(_p) {
		super({
			_initx: _p._initx,
			_infinite: _p._infinite
		});
		this._alpha = 1;
		this.img = _CANVAS_IMGS['background_volcano'];
	}
}

class GameObject_BACKGROUND_MOAI
	extends GameObject_BACKGROUND_IMG {
	constructor(_p) {
		super({
			_initx: _p._initx,
			_infinite: _p._infinite
		});
		this._alpha = 1;
		this.img = _CANVAS_IMGS['background_moai'];
	}
}

class GameObject_BACKGROUND_CELL
	extends GameObject_BACKGROUND_IMG {
	constructor(_p) {
		super({
			_initx: _p._initx,
			_infinite: _p._infinite
		});
		this._alpha = 1;
		this.img = _CANVAS_IMGS['background_cell'];
	}
}

class GameObject_BACKGROUND_FRAME
	extends GameObject_BACKGROUND_IMG {
	constructor(_p) {
		super({
			_initx: _p._initx,
			_infinite: _p._infinite
		});
		this._alpha = 1;
		this.img = _CANVAS_IMGS['background_frame'];
	}
}
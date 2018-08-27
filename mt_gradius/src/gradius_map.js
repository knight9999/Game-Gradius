//=====================================================
//	gradius_map.js
//	ステージ処理
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

let _MAPDEFS='';

let _MAP_SCROLL_POSITION_X=0;
//_MAP_SCROLL_POSITION_Y
// CANVASの初期左上が0として基点
let _MAP_SCROLL_POSITION_Y=0;


//マップ用ボス定義
//各クラスの引数は、config.jsonで定義した座標値、
//（未指定の場合は登場時の座標（初期設定））
//main.jsのBASS関数にて処理される
const _DEF_MAP_ENEMIES_BOSS={
	'enemy_cristalcore':{
		_obj:function(_p){return new ENEMY_BOSS_CRYSTALCORE({x:_p.x,y:_p.y});}
	},
	'enemy_bigcore': {
		_obj:function(_p){return new ENEMY_BOSS_BIGCORE({x:_p.x,y:_p.y});}
	},
	'enemy_bigcore2': {
		_obj:function(_p){return new ENEMY_BOSS_BIGCORE2({x:_p.x,y:_p.y});},	
	},
	'enemy_frame': {
		_obj:function(_p){return new ENEMY_BOSS_FRAME({x:_p.x,y:_p.y});},	
	},
	'enemy_cell': {
		_obj:function(_p){return new ENEMY_BOSS_CELL({x:_p.x,y:_p.y});},	
	},
	'enemy_moai': {
		_obj:function(_p){return new ENEMY_BOSS_MOAI({x:_p.x,y:_p.y});},	
	},
	'enemy_death': {
		_obj:function(_p){return new ENEMY_BOSS_DEATH({x:_p.x,y:_p.y});},	
	},
	'enemy_cube': {
		_obj:function(_p){return new ENEMY_BOSS_CUBE_CONTROL({x:_p.x,y:_p.y});},	
	},
	'enemy_aian': {
		_obj:function(_p){return new ENEMY_BOSS_AIAN_CONTROL({x:_p.x,y:_p.y});},	
	}
}

const _DEF_MAP_MAPS = {
	'MAP_CRISTAL':{
		_obj:function(_p){return new MAP_CRISTAL({x:_p.x,y:_p.y});},
	},
	'MAP_CRISTAL_UP': {
		_obj:function(_p){return new MAP_CRISTAL_UP({x:_p.x,y:_p.y});},
	},
	'MAP_CRISTAL_DOWN': {
		_obj:function(_p){return new MAP_CRISTAL_DOWN({x:_p.x,y:_p.y});},
	},


	'MAP_VOLCANO_A': {
		_obj:function(_p){return new MAP_VOLCANO_A({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_B': {
		_obj:function(_p){return new MAP_VOLCANO_B({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_C': {
		_obj:function(_p){return new MAP_VOLCANO_C({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_D': {
		_obj:function(_p){return new MAP_VOLCANO_D({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_E': {
		_obj:function(_p){return new MAP_VOLCANO_E({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_F': {
		_obj:function(_p){return new MAP_VOLCANO_F({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_G': {
		_obj:function(_p){return new MAP_VOLCANO_G({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_H': {
		_obj:function(_p){return new MAP_VOLCANO_H({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_I': {
		_obj:function(_p){return new MAP_VOLCANO_I({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_J': {
		_obj:function(_p){return new MAP_VOLCANO_J({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_K': {
		_obj:function(_p){return new MAP_VOLCANO_K({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_L': {
		_obj:function(_p){return new MAP_VOLCANO_L({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_M': {
		_obj:function(_p){return new MAP_VOLCANO_M({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_N': {
		_obj:function(_p){return new MAP_VOLCANO_N({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_O': {
		_obj:function(_p){return new MAP_VOLCANO_O({x:_p.x,y:_p.y});},
	},
	'MAP_VOLCANO_P': {
		_obj:function(_p){return new MAP_VOLCANO_P({x:_p.x,y:_p.y});},
	},


	'MAP_CUBE_A': {
		_obj:function(_p){return new MAP_CUBE_A((_p===undefined)?{}:{x:_p.x,y:_p.y});},
	},
	'MAP_CUBE_B': {
		_obj:function(_p){return new MAP_CUBE_B((_p===undefined)?{}:{x:_p.x,y:_p.y});},
	},


	'MAP_MOAI_A': {
		_obj:function(_p){return new MAP_MOAI_A({x:_p.x,y:_p.y});},
	},
	'MAP_MOAI_B': {
		_obj:function(_p){return new MAP_MOAI_B({x:_p.x,y:_p.y});},
	},


	'MAP_FRAME_A': {
		_obj:function(_p){return new MAP_FRAME_A({x:_p.x,y:_p.y});},
	},
	'MAP_FRAME_B': {
		_obj:function(_p){return new MAP_FRAME_B({x:_p.x,y:_p.y});},
	},
	'MAP_FRAME_C': {
		_obj:function(_p){return new MAP_FRAME_C({x:_p.x,y:_p.y});},
	},
	'MAP_FRAME_D': {
		_obj:function(_p){return new MAP_FRAME_D({x:_p.x,y:_p.y});},
	},
	'MAP_FRAME_E': {
		_obj:function(_p){return new MAP_FRAME_E({x:_p.x,y:_p.y});},
	},
	'MAP_FRAME_F': {
		_obj:function(_p){return new MAP_FRAME_F({x:_p.x,y:_p.y});},
	},


	'MAP_CELL_A': {
		_obj:function(_p){return new MAP_CELL_A({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_B': {
		_obj:function(_p){return new MAP_CELL_B({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_C': {
		_obj:function(_p){return new MAP_CELL_C({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_D': {
		_obj:function(_p){return new MAP_CELL_D({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_G': {
		_obj:function(_p){return new MAP_CELL_G({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_H': {
		_obj:function(_p){return new MAP_CELL_H({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_I': {
		_obj:function(_p){return new MAP_CELL_I({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_J': {
		_obj:function(_p){return new MAP_CELL_J({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_K': {
		_obj:function(_p){return new MAP_CELL_K({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_L': {
		_obj:function(_p){return new MAP_CELL_L({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_M': {
		_obj:function(_p){return new MAP_CELL_M({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_N': {
		_obj:function(_p){return new MAP_CELL_N({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_O': {
		_obj:function(_p){return new MAP_CELL_O({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_V': {
		_obj:function(_p){return new MAP_CELL_V({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_W': {
		_obj:function(_p){return new MAP_CELL_W({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_Y': {
		_obj:function(_p){return new MAP_CELL_Y({x:_p.x,y:_p.y});},
	},
	'MAP_CELL_Z': {
		_obj:function(_p){return new MAP_CELL_Z({x:_p.x,y:_p.y});},
	},


}//_DEF_MAP_MAPS


const _DEF_MAP_ENEMIES = {
	'ENEMY_a': {
		_obj:function(_x,_y,_d){return new ENEMY_a({x:_x,y:_y,direct:_d});},
		'_st': ''
	},
	'ENEMY_b': {
		_obj:function(_x,_y,_d){return new ENEMY_b({x:_x,y:_y,direct:_d});},
		'_st': ''
	},
	'ENEMY_c': {
		_obj:function(_x,_y,_md){
			let _d=(_MAP.isMapCollision(_MAP.getMapX(_x),_MAP.getMapY(_y)-1))
					?_DEF_DIR._U
					:_DEF_DIR._D;
			_d=(_MAP.isMapCollision(_MAP.getMapX(_x),_MAP.getMapY(_y)+2))
					?_DEF_DIR._D
					:_DEF_DIR._U;
			return new ENEMY_c({x:_x,y:_y,direct:_md});
		},
		'_st': ''
	},
	'ENEMY_d': {
		_obj:function(_x,_y,_d){return new ENEMY_d({x:_x,y:_y,direct:_d});},
		'_st': ''
	},
	'ENEMY_e': {
		_obj:function(_x,_y,_d){return new ENEMY_e({x:_x,y:_y,direct:_d});},
		'_st': ''
	},
	'ENEMY_f': {
		_obj:function(_x,_y,_d){
			_d=(_y<_CANVAS.height/2)
				?_DEF_DIR._U
				:_DEF_DIR._D;
			return new ENEMY_f({x:_x,y:_y,direct:_d});
		},
		'_st': ''
	},
	'ENEMY_g': {
		_obj:function(_x,_y,_d){
			_d=(_y<_CANVAS.height/2)
				?_DEF_DIR._U
				:_DEF_DIR._D;
			return new ENEMY_g({x:_x,y:_y,direct:_d});
		},
		'_st': ''
	},
	'ENEMY_m': {
		_obj:function(_x,_y,_d){return new ENEMY_m({x:_x,y:_y,direct:_d});},
		'_st': ''
	},
	'ENEMY_n': {
		_obj:function(_x,_y,_d){return new ENEMY_n({x:_x,y:_y,direct:_d});},
		'_st': ''
	},
	'ENEMY_o': {
		_obj:function(_x,_y,_d){return new ENEMY_o({x:_x,y:_y,direct:_d});},
		'_st': ''
	},
	'ENEMY_p': {
		_obj:function(_x,_y,_d){return new ENEMY_p({x:_x,y:_y,direct:_DEF_DIR._D});},
		'_st': ''
	},
	'ENEMY_FAN': {
		_obj:function(_x,_y,_d){return new ENEMY_FAN({x:_x,y:_y,direct:_d});},
		'_st': ''
	},

	'ENEMY_MOAI_Q_U':{//モアイ(立)
		_obj:function(_x,_y,_d){return new ENEMY_q({x:_x,y:_y,direct:_DEF_DIR._U});},
		'_st': 'transform:scale(1,-1);'
	},
	'ENEMY_MOAI_Q_D': { //モアイ(立)
		_obj:function(_x,_y,_d){return new ENEMY_q({x:_x,y:_y,direct:_DEF_DIR._D});},
		'_st': ''
	},
	'ENEMY_MOAI_Q_LD': { //モアイ(立)
		_obj:function(_x,_y,_d){return new ENEMY_q({x:_x,y:_y,direct:_DEF_DIR._LD});},
		'_st': 'transform:scale(-1,1);'
	},
	'ENEMY_MOAI_Q_LU': { //モアイ(立)
		_obj:function(_x,_y,_d){return new ENEMY_q({x:_x,y:_y,direct:_DEF_DIR._LU});},
		'_st': 'transform:scale(-1,-1);'
	},
	'ENEMY_MOAI_R_U': { //モアイ(横)
		_obj:function(_x,_y,_d){return new ENEMY_r({x:_x,y:_y,direct:_DEF_DIR._U});},
		'_st': 'transform:scale(1,-1);'
	},
	'ENEMY_MOAI_R_D': { //モアイ(横)
		_obj:function(_x,_y,_d){return new ENEMY_r({x:_x,y:_y,direct:_DEF_DIR._D});},
		'_st': ''
	},

	'ENEMY_FRAME_1': { //フレーム(大)
		_obj:function(_x,_y,_d){return new ENEMY_frame_1({x:_x,y:_y,direct:_d});},
		'_st': ''
	},

	'ENEMY_CELL_CORE': { //セルコア(大)
		_obj:function(_x,_y,_d){return new ENEMY_cell_core({x:_x,y:_y,direct:_d});},
		'_st': ''
	},
	'ENEMY_CELL_A': { //セルA
		_obj:function(_x,_y,_d){return new ENEMY_CELL_A({x:_x,y:_y,direct:_d});},
		'_st': ''
	},
	'ENEMY_CELL_B': { //セルB
		_obj:function(_x,_y,_d){return new ENEMY_CELL_B({x:_x,y:_y,direct:_d});},
		'_st': ''
	},

}

//ゲーム起動時にボスの設定
const _MAP_ENEMIES_BOSS = {
	// 'enemy_cristalcore':[
	// 	{
	// 		_obj:function(){return new ENEMY_BOSS_CRYSTALCORE({x:700,y:800});},
	// 		_movex: 0,
	// 		_left: false,
	// 		_bgmusic: function () {
	// 			_GAME_AUDIO._setPlayOnBG(_CANVAS_AUDIOS['bg_boss']);
	// 		}
	// 	}
	// ]
};


const _MAP_THEME={//_parts要素番号0は空文字
//形式は以下
//_gamestart()はゲーム開始時に実行するもの
// '_THEME1':{//クリスタル
// 	'_map':{
// 		'A':{
// 			'_gamestart'(_x,_y,_k) {
// 				_PARTS_MAP._init_maps(_k,new MAP_CRISTAL({x:_x,y:_y}));
// 			},
// 			'_getObj':()=>{return new MAP_CRISTAL({});}
// 		}
// 	},
// 	'_enemies':{
// 		'a':{
// 			'_gamestart':(_mx,_my,_md)=>{_ENEMIES.push(new ENEMY_a({x:_mx,y:_my,direct:_md}));},
// 			'_st':'',
// 			'_getObj':()=>{return new ENEMY_a({direct:null});}
// 		}
//	}
}//_MAP_THEME

//各種ステージ定義
// _map:配列でマップを作成
// _title:ステージセレクトで、タイトルを表示
// _body:ステージセレクトで、内容を表示
// _speed:マップのスピード表示（1〜）
// _difficult:gradius_enemies.jsより
//				_DEF_ENEMY_DIFFICULTで難易度を設定
// _initx:マップの開始表示位置（0〜）

// _this.map_backgroundY_speed:Y軸スクロールスピード
// _MAP_SCROLL_POSITION_Y（0-999）:主に衝突マップを使って当たり判定させる
class GameObject_MAP{
	constructor(_pt){
		let _this=this;
		_this.pt=_pt||0;
		_this.initx=0;
		_this.inity=0;
		_this.x=_this.initx;
		_this.y=_this.inity;
		_this.collision=new RegExp('[1A-Z]');
		_this.collision_enemies=new RegExp('[a-z]','g');
		_this.collision_map=new RegExp('[A-Z]');
		_this.collision_map_d=new RegExp('[BD]');//MAP衝突用
		_this.t=25;//単位
		_this.mapdef=new Array();//MAP表示用
		_this.mapdef_col=new Array();//MAP衝突用
		_this.map_theme=0;
		_this.map_pettern=0;
		_this.map_difficult=0;
		_this.map_background_speed=0;
		_this.map_backgroundY_speed=0;//移動単位
		_this.map_infinite=false;
		_this.map_bgmusic='';
		_this.map_boss='';
		_this.map_enemies_boss = new Object();
		_this.map_bgchange = 0;
		_this.isboss=false;
	}
	init(){
		return new Promise((_res, _rej) => {
		_AJAX({url:'./gradius_map.json'})
			.then((_d) => {
				_MAPDEFS = _d;
				_res();
			}, () => {
				_rej();
			});
		});
	}
	init_map_theme(_d){
		//ゲーム起動時にjsonから取得したマップ、敵定義を_MAP_THEMEに登録
		if(_d===undefined){return;}
		for(let _v in _d){
			_MAP_THEME[_v] = {};
			_MAP_THEME[_v]['_map'] = {};
			_MAP_THEME[_v]['_enemies'] = {};
			//MAP定義
			for (let _m in _d[_v].map){
				_MAP_THEME[_v]['_map'][_m]={
					_gamestart(_x,_y,_k){
						_PARTS_MAP._init_maps(
							_k,
							_DEF_MAP_MAPS[_d[_v].map[_m]]._obj({x:_x,y:_y})
						);
					},
					_getObj(_p){
						_p=_p||{x:0,y:0,md:0};
						return _DEF_MAP_MAPS[_d[_v].map[_m]]._obj({x:_p.x,y:_p.y});
					}
				}
			}
			//敵定義
			for (let _e in _d[_v].enemies){
				_MAP_THEME[_v]['_enemies'][_e] = {
					_gamestart(_x, _y, _md) {
						_PARTS_ENEMIES._add_enemies(
							_DEF_MAP_ENEMIES[_d[_v].enemies[_e]]._obj(_x, _y, _md)
						);
					},
					_st: _DEF_MAP_ENEMIES[_d[_v].enemies[_e]]._st,
					_getObj(_p) {
						_p=_p||{x:0,y:0,md:0};
						return _DEF_MAP_ENEMIES[_d[_v].enemies[_e]]._obj(_p.x, _p.y, _p.md);
					}
				}
			}


		}
	}
	init_map_enemies_boss(_d){
		//ゲーム起動時のボス定義設定
		//jsonから取得したボス定義を_MAP_ENEMIES_BOSSに登録
		//_obj[function]:ボスのオブジェクト
		//_moves:次のボスを登場させる前に進めるスクロール（x）
		//_left:ボス登場前に、CANVAS内にある敵とそのショット消滅可否フラグ
		//_bgmusic[function]:ボスの登場音楽
		if(_d===undefined){return;}
		for(let _v in _d){
			_MAP_ENEMIES_BOSS[_v]=[];
			_d[_v].map((_o)=>{
				_MAP_ENEMIES_BOSS[_v].push({
					_point:{x:_o.obj.x||_CANVAS.width,y:_o.obj.y||(_CANVAS.height/2)},
					_obj:function(){
						return _DEF_MAP_ENEMIES_BOSS[_o.obj.img]._obj(this._point);
					},
					_movex: _o.movex||0,
					_left: _o.left||false,
					_bgmusic: (_o.bgmusic === null || _o.bgmusic === undefined)
						?function(){}
						:function(){_GAME_AUDIO._setPlayOnBG(_CANVAS_AUDIOS[_o.bgmusic||'bg_boss']);}
				});
			})
		}

	}
	setInifinite(_f){
		this.map_infinite=_f;
	}
	set_stage_map_pattern(_n){
		this.map_pettern=_n;
	}
	get_stage_map_pattern() {
		return this.map_pettern;
	}
	get_mapdefs_difficult() {
		return _MAPDEFS[this.map_pettern]._difficult - 1;
	}
	set_mapdefs_difficult(){
		//ステージに対して、難易度を一つあげる
		let _this = this;
		_MAPDEFS[_this.map_pettern]._difficult =
			parseInt(_MAPDEFS[_this.map_pettern]._difficult) + 1;
	}
	set_gamestart(){
		//ゲーム開始処理
		let _this=this;
		_this.map_backgroundY_speed=0;
		_this.x=parseInt(_MAPDEFS[_this.map_pettern]._initx);
		_this.y=_this.inity;
		_this.initx=parseInt(_MAPDEFS[_this.map_pettern]._initx);
		_this.mapdef=_MAPDEFS[_this.map_pettern]._map;
		_this.map_difficult = _GAME._url_params['ed'] || parseInt(_MAPDEFS[_this.map_pettern]._difficult) - 1;
		_this.map_background_speed=parseInt(_MAPDEFS[_this.map_pettern]._speed);
		_this.map_theme=_MAPDEFS[_this.map_pettern]._theme;
		_this.map_infinite=(_MAPDEFS[_this.map_pettern]._map_infinite==='true')?true:false;
		_this.map_bgmusic=_MAPDEFS[_this.map_pettern]._bgmusic;
		_this.map_boss=_MAPDEFS[_this.map_pettern]._boss;

		_this.map_bgchange = parseInt(_MAPDEFS[_this.map_pettern]._bgchange) || 0;

		_this.map_enemies_boss = _MAP_ENEMIES_BOSS[_this.map_boss];
		_this.isboss=false;

		//衝突マップの設定
		_this.set_gamestart_mapdef_col();
		//マップテーマ定義より、敵・マップオブジェクトのセット
		_this.set_gamestart_map_theme_objs();
	}
	get_ememies_boss(){
		return this.map_enemies_boss;
	}
	set_gamestart_map_theme_objs(){
		let _this=this;
		for(let _i=0;_i<_this.mapdef.length;_i++){
		let _m=_this.mapdef[_i];
		for(let _j=0;_j<_m.length;_j++){
			//MAP1行分ループ
			if(_this.isEnemiesBit(_m[_j])){
				//敵のゲーム開始前初期化
				let _o = _MAP_THEME[_this.map_theme]._enemies[_m[_j]];
				let _d = _MAP.get_enemy_dir(_j, _i, _o); //向きを取得する
				_o._gamestart(_this.x+(_j*_this.t),_i*_this.t,_d);
				continue;
			}
			if(_this.isCollisionBit(_m[_j])){
				//MAPのゲーム開始前初期化
				_MAP_THEME[_this.map_theme]._map[_m[_j]]
					._gamestart(_this.x + (_j * _this.t), _i * _this.t, _j + ',' + _i);
				continue;
			}

		}
		}
	}
	set_gamestart_mapdef_col(){
		//MAP衝突用作成関数
		//MAPからMAP衝突用を複製し、
		//MAPテーマがMAPビット・敵ビットを置換させる。
		//最終的には'1'と'0'のみにする。
		let _this=this;
		//MAPからMAP衝突用を複製
		Object.assign(_this.mapdef_col,_this.mapdef);
		//MAP衝突用から敵ビットを外す
		for(let _i=0;_i<_this.mapdef_col.length;_i++){
			_this.mapdef_col[_i]=
				_this.mapdef_col[_i].replace(/[a-zA-Z]/ig,'0');
		}

		for(let _i=0;_i<_this.mapdef.length;_i++){
		let _m=_this.mapdef[_i];
		for(let _j=0;_j<_m.length;_j++){
			//MAP衝突用1行分ループ
			if((_m[_j]).match(/[A-Za-z]/)===null){continue;}
			//MAPテーマより、MAP・敵ビットを取得する
			let _p=
				(_this.isEnemiesBit(_m[_j]))
				?_MAP_THEME[_this.map_theme]._enemies[_m[_j]]._getObj()
				:_MAP_THEME[_this.map_theme]._map[_m[_j]]._getObj();
			if(_p===undefined){
				//テーマに対するMAP・敵ビットが存在しない場合
				console.log('テーマ:'+_this.map_theme+'に対して '+_m[_j]+'の定義がありません。');
				continue;
			}
			//MAP・敵ビットに定義されてる衝突ビットを取得
			let _p_s=_p._s.split(',');
			for(let _l=0;_l<_p_s.length;_l++){//p._s分ループ
				let _s_mapdef_col=_this.mapdef_col[_i+_l];
				let _s_mapdef=_this.mapdef[_i+_l];
				//マップからはみ出る(縦)場合は無視
				if (_s_mapdef_col === undefined
					|| _s_mapdef === undefined ){continue;}
				//置換箇所は文字列を分割、置換、結合処理
				_this.mapdef_col[_i+_l]=
					_s_mapdef_col.substr(0,_j)
					+(function(_s_mdc,_psl){
						return _this.setCollisionBit(_psl,_s_mdc);
					})(_s_mapdef_col.substr(_j,_p_s[_l].length),
						_p_s[_l])
					+_s_mapdef_col.substr(_j+_p_s[_l].length,_m.length);			
			}//_l
		}//_j
		//マップからはみ出る(横)後方部分を削り、
		//1行分の衝突データを完成
		_this.mapdef_col[_i]=_this.mapdef_col[_i].substr(0, _this.mapdef[_i].length);
		}//_i	
	}
	set_mapdef_col(_mx,_my,_bit){
		let _this=this;
		//MAP衝突用の一部変更
		if(_mx===undefined
			||_my===undefined
			||_bit===undefined){return;}
		let _p_s=_bit.split(',');
		for(let _l=0;_l<_p_s.length;_l++){//p._s分ループ
			let _s_mapdef_col=_this.mapdef_col[_my+_l];
			//行を超える場合は、置換させない
			if (_s_mapdef_col===undefined){continue;}
			//置換箇所は文字列を分割、置換、結合処理
			_this.mapdef_col[_my+_l]=
				_s_mapdef_col.substr(0,_mx)
				+_p_s[_l]
				+_s_mapdef_col.substr(_mx+_p_s[_l].length);			
		}//_l
	}
	get_enemy_dir(_mx,_my,_o){
		//MAP衝突の情報から、敵の上下の向きを取得

		let _this=this;
		let _t=_o._getObj().height/_this.t||1;
		if (!_this.isMapCollision(_mx, _my - 1)
			&&!_this.isMapCollision(_mx, _my + Math.ceil(_t))){
			//空中の敵は向きは下
			return _DEF_DIR._D;
		}
		//地上用の向き処理
		let _d=(_this.isMapCollision(_mx,_my-1))
				?_DEF_DIR._U
				:_DEF_DIR._D;
		_d=(_this.isMapCollision(_mx,_my+Math.ceil(_t)))
				?_DEF_DIR._D
				:_DEF_DIR._U;
		return _d;
	}
	getX(_x){
		return _x + (this.map_background_speed * -1);
	}
	getY(_y){
		//y軸スクロール時、y位置を転回する
		let _this=this;
		if(!_this.map_infinite){return _y;}

		//CANVAS表示エリアから上下250px
		//-250〜750
//		console.log('_y'+_y)
		if(_y-_this.map_backgroundY_speed<-250){
			var _d=(250+_y)-_this.map_backgroundY_speed;
//			console.log('_d'+_d)
			return 750+_d;
		}
		if(_y-_this.map_backgroundY_speed>750){
			var _d=(750-_y)+_this.map_backgroundY_speed;
//			console.log('_d'+_d)
			return -250-_d;
		}
		return (_y-_this.map_backgroundY_speed)%1000;
	}
	getShotY(_y){
		return _y-this.map_backgroundY_speed;
	}
	setCollisionBit(_pb,_mcb){
		let _this=this;
		let _s='';
		for(let _i=0;_i<_pb.length;_i++){
			if(_pb[_i]==='0'){
				_s+=_mcb[_i];
				continue;
			}
			_s+='1';
		}
		return _s;
	}
	setBackGroundSpeedY(_v){
		//Y軸の背景スピードの設定
		this.map_backgroundY_speed=_v;
	}
	getBackGroundSpeed(){
		return this.map_background_speed;
	}
	getBackGroundSpeedY(){
		return this.map_backgroundY_speed;
	}
	get_stage_map_pattern(_n){
		return this.map_pettern;
	}
	getMapX(_x){
		return Math.floor(
				(_x+_MAP_SCROLL_POSITION_X-this.initx)
				/this.t);
	}
	getMapY(_y,_debug){
		if(_debug===true){
			console.log('_y:'+_y)
			console.log('_MAP_SCROLL_POSITION_Y:'+_MAP_SCROLL_POSITION_Y)
		}
		return Math.floor(
				((_y+_MAP_SCROLL_POSITION_Y)%1000)
				/this.t);
	}
	isCollisionBit(_bit){
		//衝突ビット判定フラグ
		return (_bit.match(this.collision)!==null);
	}
	isEnemiesBit(_bit){
		//衝突ビット判定フラグ
		return (_bit.match(this.collision_enemies)!==null);
	}
	isMapBefore(_mx,_my){
		//位置がMAPの手前か判定
		//true:手前
		//false:手前でない、またはそのMAPが存在しない
		let _this=this;
		if(_mx<0){return true;}
		return false;
	}
	isMapLastSide(_mx,_my){
		//位置がMAPの末端か判定
		//true:末端
		//false:末端ではない、またはそのMAPが存在しない
		let _this=this;
		if(_this.mapdef[_my]===undefined){return false;}
		if(_this.mapdef[_my][_mx]===undefined){return true;}
		if(_mx===_this.mapdef[_my].length-1){return true;}
		return false;
	}
	isMapOver(_mx,_my){
		//位置がMAPを超えてるか判定
		//true:超えてる
		//false:超えていない、またはそのMAPが存在しない
		let _this=this;
		if(_this.mapdef[_my]===undefined){return false;}
		if(_this.mapdef[_my][_mx]===undefined){return true;}
		if(_mx>_this.mapdef[_my].length-1){return true;}
		return false;
	}
	isMapCollision(_mx,_my){
		//MAPの座標による衝突判定フラグを取得
		//true:衝突
		//false:衝突しない、またはそのMAPが存在しない
		let _this=this;
		if(_this.mapdef_col[_my]===undefined){return false;}
		if(_this.mapdef_col[_my][_mx]===undefined){return false;}
		if(_this.isCollisionBit(_this.mapdef_col[_my][_mx])){return true;}
		return false;
	}
	isMapGameClear(){
		//ゲームクリアの判定
		let _this = this;
		if(_this.map_boss===''||
			_this.map_boss === undefined ||
			_MAP_ENEMIES_BOSS[_this.map_boss] === undefined) {
				return true;
		}

	}
	isChangeBackgroundMain(){
		return _MAP_SCROLL_POSITION_X > this.map_bgchange;
	}
	setPlayersShotAbleCollision(_mx,_my,_shot){
		let _obj = _PARTS_MAP._obj[_mx + ',' + _my];
 		if(_obj===undefined){return;}
		if(_obj.is_able_collision){
			_obj.collision(_shot);
		}

	}
	isPlayersShotCollision(){
		let _this=this;
		//プレーヤーのショットあたり判定
		for(let _i=0;_i<_PARTS_PLAYERMAIN._shots.shot[_PARTS_PLAYERMAIN._shot_type].length;_i++){
		let _ps=_PARTS_PLAYERMAIN._shots.shot[_PARTS_PLAYERMAIN._shot_type][_i];
		for(let _j=0;_j<_ps.shots.length;_j++){
			let _pss=_ps.shots[_j];
			//ショット中でない場合無視
			if(!_pss._shot_alive){continue;}
			_ps.map_collition(_pss);
		}//_j
		}//_i

		//ミサイルのあたり判定
		for(let _i=0;_i<_PARTS_PLAYERMAIN._shots.missile.length;_i++){
		let _pm=_PARTS_PLAYERMAIN._shots.missile[_i];
		if(!_pm.player.isalive()){continue;}
		for(let _j=0;_j<_pm.shots.length;_j++){
			let _pms=_pm.shots[_j];
			//ショット中でない場合無視
			if(!_pms._shot_alive){continue;}
			//爆発中は無視
			if(_pms._c>0){continue;}
			_pm.map_collition(_pms);
		}//_j
		}//_i

	}//isShotCollision()
	show(){}
	showMapForStageselect(_m){
		//ステージ選択用のマップ表示
		let _this=this;
		if(_m===null||_m===undefined){return;}
		let _m_length=_m._map.length;
		for(let _i=0;_i<((_m_length>20)?20:_m_length);_i++){
		let _ml=_m._map[_i].length;
		for(let _j=0;_j<((_ml>40)?40:_ml);_j++){
			let _k=_m._map[_i][_j+100];
			if(_k===undefined){continue;}
			if(_k==='0'){continue;}
			if(_k.match(_this.collision_enemies)!==null){
				//敵
				let _o = _MAP_THEME[_m._theme]._enemies[_k];
				let _d = _MAP.get_enemy_dir(_j + 100, _i, _o);
				let _p=_o._getObj({x:0,y:0,md:_d});
				_GAME._setDrawImage({
					img: _p.img,
					x: 0 + (_j * 10),
					y: 130 + (_i * 10),
					imgPosx: _p.imgPos[0],
					width: _p.width / 2.5,
					height: _p.height / 2.5,
					t_width: _p.width,
					t_height: _p.height,
					direct: _p.direct,
					basePoint: 1
				});
			}else{
				//MAP
				let _p=_MAP_THEME[_m._theme]._map[_k]._getObj();
//				let img=_p._obj.img;
				//画像サイズは、25x25px
				//ここでは10x10pxに調整
				_GAME._setDrawImage({
					img: _p.img,
					x: 0 + (_j * 10),
					y: 130 + (_i * 10),
					imgPosx: _p.imgPos[0],
					width: _p.width / 2.5,
					height: _p.height / 2.5,
					t_width: _p.width,
					t_height: _p.height,
					basePoint: 1
				});
			}
		}//_j
		}//_i
		//はみ出た分を黒でラッピングする
		//エリアは50,130,350,330
		_CONTEXT.fillStyle="rgba(0,0,0,1)";
		_CONTEXT.fillRect(0,130,50,500);
		_CONTEXT.fillRect(350,130,500,500);
		_CONTEXT.fillRect(50,330,500,500);
//		_CONTEXT.beginPath();
		// _CONTEXT.fillStyle="rgba(0,0,0,0)";
		// _CONTEXT.clearRect(50,130,250,230);

		//MAPのフレームを表示
		_CONTEXT.beginPath();
		_CONTEXT.lineWidth=1;
		_CONTEXT.strokeStyle='rgba(255,255,255,1)';
		_CONTEXT.fillStyle='rgba(255,255,255,1)';
		_CONTEXT.strokeRect(50,130,300,200);

	}//showMapForStageselect
	set_mapdef_col_clear(){
		let _this=this;
		for(let _i=0;_i<_this.mapdef_col.length;_i++){
			let _m=_this.mapdef_col[_i];
			_this.mapdef_col[_i]=_m.replace(/1/ig,'0');
		}
	}
	set_scroll_on_x(){
		let _this=this;
		_this.map_background_speed = parseInt(_MAPDEFS[_this.map_pettern]._speed);
	}
	set_scroll_off_x(){
		let _this=this;
		_this.map_background_speed=0;
	}
	move(){
		let _this=this;

		//MAPからX軸よりCANVAS幅手前に達したらボスを表示させる
		if(_MAP_SCROLL_POSITION_X+_CANVAS.width>
			(_this.mapdef[0].length*_this.t)+_this.initx){
			_this.isboss=true;
		}

		//X軸のMAPを超えたらマップ自体はこれ以上進めない
		if(_MAP_SCROLL_POSITION_X-100>(_this.mapdef[0].length*_this.t)+_this.initx){_this.map_background_speed=0;}

 		_this.x+=_this.map_background_speed*-1;
		_MAP_SCROLL_POSITION_X+=_this.map_background_speed;

//		_this.y=_this.getY(_this.y);
//		_this.y-=_this.map_backgroundY_speed;//0<：上にスクロール
//		_this.y%=1000;
//		console.log('MAP.y++++++'+_this.y)
		_MAP_SCROLL_POSITION_Y=(function(){
			//戻す前に式評価させる。
			let _posy=_MAP_SCROLL_POSITION_Y+_this.map_backgroundY_speed;
			if(_posy<0){
				return (1000+_posy)%1000;
			}
			return _posy%1000;
		})();
//		console.log(_MAP_SCROLL_POSITION_Y)
	}
}

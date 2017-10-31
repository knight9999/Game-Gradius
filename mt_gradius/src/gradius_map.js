//=====================================================
//	gradius_map.js
//	ステージ処理
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

let _MAPDEFS='';
let _MAPDEF='';
let _MAP_PETTERN=0;
let _BACKGROUND_SPEED=0;

const _MAP_ENEMIES={
_DEF_DIR:{//向き
	_U:0,//上
	_D:1,//下
	_R:2,//右
	_L:3//左
},//_DEF_DIR
_setDir:function(_mx,_my){
	let _this=this;
	let _r=_this._DEF_DIR._D;
	return (_MAP.isMapCollision(_mx,_my-1))
			?_this._DEF_DIR._U
			:_r;
},//_setDir
_ENEMIES:{
	'a':{
		'_f':function(_mx,_my){
			let _md=_MAP_ENEMIES._setDir(_mx,_my);
			_ENEMIES.push(new ENEMY_a(_mx,_my,_md));
			},
		'_o':_CANVAS_IMGS['enemy_a_1']
	},
	'b':{
		'_f':function(_mx,_my){
			let _md=_MAP_ENEMIES._setDir(_mx,_my);
			_ENEMIES.push(new ENEMY_a(_mx,_my,_md));
			},
		'_o':_CANVAS_IMGS['enemy_b_1']
	},
	'c':{
		'_f':function(_mx,_my){
			let _md=_MAP_ENEMIES._setDir(_mx,_my);
			_ENEMIES.push(new ENEMY_c(_x,_y,_d));
			},
		'_o':_CANVAS_IMGS['enemy_c_1']
	},
	'd':{
		'_f':function(_mx,_my){
			let _md=_MAP_ENEMIES._setDir(_mx,_my);
			_ENEMIES.push(new ENEMY_d(_x,_y,_d));
			},
		'_o':_CANVAS_IMGS['enemy_d_1']
	},
	'e':{
		'_f':function(_mx,_my){
			let _md=_MAP_ENEMIES._setDir(_mx,_my);
			_ENEMIES.push(new ENEMY_e(_x,_y,_d));
			},
		'_o':_CANVAS_IMGS['enemy_e_1']
	},
	'f':{
		'_f':function(_mx,_my){
			_ENEMIES.push(new ENEMY_f(_x,_y,_d));
			},
		'_o':_CANVAS_IMGS['enemy_f_1']
	},
	'g':{
		'_f':function(_mx,_my){
			_ENEMIES.push(new ENEMY_g(_x,_y,_d));
			},
		'_o':_CANVAS_IMGS['enemy_g_1']
	},
	'm':{
		'_f':function(_mx,_my){
			_ENEMIES.push(new ENEMY_m(_x,_y,_d));
			},
		'_o':_CANVAS_IMGS['enemy_m_1']
	},
	'n':{
		'_f':function(_mx,_my){
			_ENEMIES.push(new ENEMY_n(_x,_y,_d));
			},
		'_o':_CANVAS_IMGS['enemy_o_1']
	},
	'o':{
		'_f':function(_mx,_my){
			_ENEMIES.push(new ENEMY_o(_x,_y,_d));
			},
		'_o':_CANVAS_IMGS['enemy_o_1']
	},
	'p':{
		'_f':function(_mx,_my){
			let _o=new ENEMY_p(_mx,_my);
			_ENEMIES.push(_o);
			_ENEMIES_BOUNDS.push(_o);			
		},
		'_o':_CANVAS_IMGS['enemy_p_1']
	},
	'z':{
		'_f':function(_mx,_my){
			_ENEMIES.push(new ENEMY_BOSS_BOGCORE(_x,_y,_d));
			},
		'_o':_CANVAS_IMGS['enemy_z']
	}

}//_ENEMIES
}

const _MAP_THEME={//_parts要素番号0は空文字
'_THEME1':{//なし
	'_p':{},
	'_enemies':{}
},//_THEME1
'_THEME2':{//大地
	'_p':{
		'A':{
			'_o':_CANVAS_IMGS['map_f_A'],
			'_s':'1',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'B':{
			'_o':_CANVAS_IMGS['map_f_B'],
			'_s':'1',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i-1;}
		},
		'C':{
			'_o':_CANVAS_IMGS['map_f_C'],
			'_s':'1',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'D':{
			'_o':_CANVAS_IMGS['map_f_D'],
			'_s':'1',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i-1;}
		},
		'E':{
			'_o':_CANVAS_IMGS['map_f_E'],
			'_s':'1',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'F':{
			'_o':_CANVAS_IMGS['map_f_F'],
			'_s':'000110000,'+
				'000110000,'+
				'001111000,'+
				'011111100,'+
				'011111110,'+
				'111111111',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'G':{
			'_o':_CANVAS_IMGS['map_f_G'],
			'_s':'111111110,011111110,011111100,001111000,000110000,000110000',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'H':{
			'_o':_CANVAS_IMGS['map_f_H'],
			'_s':
			'00000000000000000000,'+
			'00000111111111111110,'+
			'00000111111110000000,'+
			'00000000011110000000,'+
			'00000000001100000000,'+
			'00000000001100000000,'+
			'00000000001100000000,'+
			'11111111111111111100,'+
			'01111111111111111100,'+
			'00000000011000000000,'+
			'00000000011000000000,'+
			'00000000111000000000,'+
			'00000001111110000000',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'I':{//8
			'_o':_CANVAS_IMGS['map_f_I'],
			'_s':
			'000000010000000,'+
			'000000010000000,'+
			'000000111000000,'+
			'000001111100000,'+
			'000011111110000,'+
			'000111111111000,'+
			'001111111111100,'+
			'001111111111100,'+
			'011111111111110,'+
			'111111111111111',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'J':{
			'_o':_CANVAS_IMGS['map_f_J'],
			'_s':
			'111111111111111,'+
			'011111111111110,'+
			'001111111111100,'+
			'001111111111100,'+
			'000111111111000,'+
			'000011111110000,'+
			'000001111100000,'+
			'000000111000000,'+
			'000000010000000,'+
			'000000010000000',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'K':{
			'_o':_CANVAS_IMGS['map_f_K'],
			'_s':
			'010',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'L':{
			'_o':_CANVAS_IMGS['map_f_L'],
			'_s':
			'010',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'M':{
			'_o':_CANVAS_IMGS['map_f_M'],
			'_s':
			'0111,1111',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'N':{
			'_o':_CANVAS_IMGS['map_f_N'],
			'_s':
			'1111,0111',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'O':{
			'_o':_CANVAS_IMGS['map_f_O'],
			'_s':
			'1111,1110',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'P':{
			'_o':_CANVAS_IMGS['map_f_P'],
			'_s':
			'1110,1111',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		}
	},
	'_enemies':{}
},//_THEME2
'_THEME3':{//クリスタル
	'_p':{
		'A':{
			'_o':_CANVAS_IMGS['map_c_A'],
			'_s':'1',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'M':{
			'_o':_CANVAS_IMGS['map_f_M'],
			'_s':
			'0111,1111',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'N':{
			'_o':_CANVAS_IMGS['map_f_N'],
			'_s':
			'1111,0111',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'O':{
			'_o':_CANVAS_IMGS['map_f_O'],
			'_s':
			'1111,1110',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		},
		'P':{
			'_o':_CANVAS_IMGS['map_f_P'],
			'_s':
			'1110,1111',
			'_mx':function(_j){return _j;},
			'_my':function(_i){return _i;}
		}
	},
	'_enemies':{}
}//_THEME3
}//_MAP_THEME

//各種ステージ定義
// _map:配列でマップを作成
// _title:ステージセレクトで、タイトルを表示
// _body:ステージセレクトで、内容を表示
// _speed:マップのスピード表示（1〜）
// _difficult:gradius_enemies.jsより
//				_DEF_ENEMY_DIFFICULTで難易度を設定
// _initx:マップの開始表示位置（0〜）

class GameObject_MAP{
	constructor(_pt){
		this.pt=_pt||0;
		this.initx=0;
		this.x=this.initx;
		this.collision=new RegExp('[1A-Z]');
		this.collision_enemies=new RegExp('[a-z]','g');
		this.collision_map=new RegExp('[A-Z]');
		this.collision_map_d=new RegExp('[BD]');//MAP衝突用
		this.t=25;//単位
		this.mapdef=new Array();//MAP表示用
		this.mapdef_col=new Array();//MAP衝突用
		this.map_theme=0;
		this.map_pettern=0;
		this.map_difficult=0;
		this.map_background_speed=0;
	}
	init(_cb){
		_AJAX('./gradius_map.json','json',function(_d){
			_MAPDEFS=_d;
			_cb();
		});
	}
	set_stage_map_pattern(_n){
		this.map_pettern=_n;
	}
	init_stage_map(){
		//ステージの初期設定
		this.x=parseInt(_MAPDEFS[this.map_pettern]._initx);
		this.initx=parseInt(_MAPDEFS[this.map_pettern]._initx);
		this.mapdef=_MAPDEFS[this.map_pettern]._map;
		this.map_difficult=parseInt(_MAPDEFS[this.map_pettern]._difficult)-1;
		_ENEMY_DIFFICULT=
			(_ISDEBUG)
				?_ENEMY_DIFFICULT
				:parseInt(_MAPDEFS[this.map_pettern]._difficult)-1;
		this.map_background_speed=parseInt(_MAPDEFS[this.map_pettern]._speed);
		_BACKGROUND_SPEED=parseInt(_MAPDEFS[this.map_pettern]._speed);
		_MAP_PETTERN=this.map_pettern;
		this.map_theme=_MAPDEFS[this.map_pettern]._theme;

		this.init_mapdef_col();
	}
	init_enemies_location(){
		//MAPより敵の配置
		for(let _i=0;_i<this.mapdef.length;_i++){
		for(let _j=0;_j<this.mapdef[_i].length;_j++){
			//空、または壁はスキップ
			if(this.isCollisionBit(this.mapdef[_i][_j])){continue;}

			//上下の壁にそって、敵の向きを設定
			let _vdirec=
					(this.isMapCollision(_j,_i-1))
						?'up'
						:'down';
				_vdirec=
					(this.isMapCollision(_j,_i+1))
						?'down'
						:'up';
			let _d=(this.isMapCollision(_j,_i-1))
						?_MAP_ENEMIES._DEF_DIR._U
						:_MAP_ENEMIES._DEF_DIR._D;
				_d=(this.isMapCollision(_j,_i+1))
					?_MAP_ENEMIES._DEF_DIR._D
					:_MAP_ENEMIES._DEF_DIR._U;

			if(this.mapdef[_i][_j]==='a'){
				_ENEMIES.push(
					new ENEMY_a(this.x+(_j*this.t),
								_i*this.t,
								_d)
						);
			}
			if(this.mapdef[_i][_j]==='b'){
				_ENEMIES.push(
					new ENEMY_b(this.x+(_j*this.t),
								_i*this.t,
								_d)
						);
			}
			if(this.mapdef[_i][_j]==='c'){
				_ENEMIES.push(
					new ENEMY_c(this.x+(_j*this.t),
								_i*this.t,
								_d)
						);
			}
			if(this.mapdef[_i][_j]==='d'){
				_ENEMIES.push(
					new ENEMY_d(this.x+(_j*this.t),
								_i*this.t,
								_vdirec)
						);
			}
			if(this.mapdef[_i][_j]==='e'){
				_ENEMIES.push(
					new ENEMY_e(this.x+(_j*this.t),
								_i*this.t,
								_vdirec)
						);
			}
			if(this.mapdef[_i][_j]==='f'){
				_d=(_i*this.t<_CANVAS.height/2)
						?_MAP_ENEMIES._DEF_DIR._U
						:_MAP_ENEMIES._DEF_DIR._D;
				_ENEMIES.push(
					new ENEMY_f(this.x+(_j*this.t),
								_i*this.t,
								_d)
						);
			}
			if(this.mapdef[_i][_j]==='g'){
				_d=(_i*this.t<_CANVAS.height/2)
					?_MAP_ENEMIES._DEF_DIR._U
					:_MAP_ENEMIES._DEF_DIR._D;
				_ENEMIES.push(
					new ENEMY_g(this.x+(_j*this.t),
								_i*this.t,
								_d)
						);
			}
			if(this.mapdef[_i][_j]==='p'){
				let _o=new ENEMY_p(this.x+(_j*this.t),
							_i*this.t);
				_ENEMIES.push(_o);
				_ENEMIES_BOUNDS.push(_o);
			}
			if(this.mapdef[_i][_j]==='m'){
				_ENEMIES.push(
					new ENEMY_m(
						this.x+(_j*this.t),
						_i*this.t,
						_d)
				);
			}
			if(this.mapdef[_i][_j]==='n'){
				_ENEMIES.push(
					new ENEMY_n(
						this.x+(_j*this.t),
						_i*this.t)
				);
			}
			if(this.mapdef[_i][_j]==='o'){
				_ENEMIES.push(
					new ENEMY_o(
						this.x+(_j*this.t),
						_i*this.t)
				);
			}
			if(this.mapdef[_i][_j]==='z'){
				let _o=new ENEMY_BOSS_BOGCORE(
							this.x+(_j*this.t),
							_i*this.t);
				_ENEMIES.push(_o);
			}
		}//_j
		}//_i
	}
	init_mapdef_col(){
		//MAP衝突用作成関数
		//MAPからMAP衝突用を複製し、
		//MAPテーマがMAPビット・敵ビットを置換させる。
		//最終的には'1'と'0'のみにする。
		let _this=this;
		//MAPからMAP衝突用を複製
		Object.assign(_this.mapdef_col,_this.mapdef);
		//MAP衝突用から的ビットを外す
		for(let _i=0;_i<_this.mapdef_col.length;_i++){
			_this.mapdef_col[_i]=
				_this.mapdef_col[_i].replace(_this.collision_enemies,'0');
		}

		for(let _i=0;_i<_this.mapdef_col.length;_i++){
		let _m=_this.mapdef_col[_i];
		for(let _j=0;_j<_m.length;_j++){
			//MAP衝突用1行分ループ
			if(!_this.isCollisionBit(_m[_j])){continue;}
			if(_m[_j]==='1'){continue;}
			//MAPテーマより、MAPビットを取得する
			let _p=_MAP_THEME[_this.map_theme]._p[_m[_j]];
			let _p_s=_p._s.split(',');
			for(let _l=0;_l<_p_s.length;_l++){//p._s分ループ
				let _s=_this.mapdef_col[_i+_l];
				//置換箇所は文字列を分割、置換、結合処理
				_this.mapdef_col[_i+_l]=
					_s.substr(0,_j)
					+(function(_s_mdc,_psl){
						let _str='';
						if(_l===0){
							//MAPにあるMAPビットのみ'1'・'0'のみ処理させる
							_str=_psl.charAt(0);
								_s_mdc=_s_mdc.substring(1);
								_psl=_psl.substring(1);
						}
						return _str+_this.setCollisionBit(_s_mdc,_psl);
					})(_s.substr(_j,_p_s[_l].length),_p_s[_l])
					+_s.substr(_j+_p_s[_l].length,_m.length);			
			}//_l
		}//_j
		}//_i	
	}
	setCollisionBit(_b,_mb){
		let _this=this;
		let _s='';
		for(let _i=0;_i<_b.length;_i++){
			if(_b[_i]==='0'){
				_s+=_mb[_i];
				continue;
			}
			_s+='1';
		}
		return _s;
	}
	getCollisionFlag(){return this.collision;}
	getBackGroundSpeed(){
		return this.map_background_speed;
	}
	get_stage_map_pattern(_n){
		return this.map_pettern;
	}
	getMapXToPx(_mx){return _mx*this.t;}
	getMapYToPx(_my){return _my*this.t;}
	getMapX(_x){return parseInt(
					(_x+_SCROLL_POSITION-this.initx)
					/this.t);}
	getMapY(_y){return parseInt(_y/this.t);}
	isCollisionBit(_bit){
		//衝突ビット判定フラグ
		return (_bit.match(this.collision)!==null);
	}
	isEnemiesBit(_bit){
		//衝突ビット判定フラグ
		return (_bit.match(this.collision_enemies)!==null);
	}
	isMapDouble(_s){
		return (_s.match(this.collision_map_d)!==null);
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
	isPlayersShotCollision(){
		let _this=this;
		//プレーヤーのショットあたり判定
		for(let _i=0;_i<_PLAYERS_SHOTS[_SHOTTYPE].length;_i++){
		let _ps=_PLAYERS_SHOTS[_SHOTTYPE][_i];
		for(let _j=0;_j<_ps.shots.length;_j++){
			let _pss=_ps.shots[_j];
			//ショット中でない場合無視
			if(!_pss._shot_alive){continue;}
			//マップエリア外の場合無視
			if(_pss.x<this.initx-_SCROLL_POSITION)
								{continue;}
			if(_pss.x>(this.mapdef[0].length*this.t)
						+this.initx-_SCROLL_POSITION)
										{continue;}
			_ps.map_collition(_pss);
		}//_j
		}//_i

		//ミサイルのあたり判定
		for(let _i=0;_i<_PLAYERS_MISSILE.length;_i++){
		let _pm=_PLAYERS_MISSILE[_i];
		if(!_pm.player.isalive()){continue;}
		for(let _j=0;_j<_pm.shots.length;_j++){
			let _pms=_pm.shots[_j];
			//ショット中でない場合無視
			if(!_pms._shot_alive){continue;}
			_pm.map_collition(_pms);
		}//_j
		}//_i

	}//isShotCollision()
	show(){}
	showMapForStageselect(_m){
		let _this=this;
		if(_m===null||_m===undefined){return;}
		for(let _i=0;_i<_m._map.length;_i++){
		let _ml=_m._map[_i].length;
		for(let _j=0;_j<((_ml>30)?30:_ml);_j++){
			let _k=_m._map[_i][_j];
			if(_k==='0'){continue;}
			if(_k.match(_this.collision_enemies)!==null){
				//敵
				let _img=_CANVAS_IMGS['enemy_'+_k+'_1'].obj;
				//画像サイズは、25x25px
				//ここでは10x10pxに調整
				_CONTEXT.drawImage(
					_img,
					50+(_j*10),130+(_i*10),
					_img.width/2.5,_img.height/2.5
				);

			}else{
				//MAP
				let _p=_MAP_THEME[_m._theme]._p[_k];
				let _img=_p._o.obj;
				//画像サイズは、25x25px
				//ここでは10x10pxに調整
				_CONTEXT.drawImage(
					_img,
					50+(_j*10),
					130+(_p._my(_i)*10),
					_img.width/2.5,_img.height/2.5
				);
			}
		}//_j
		}//_i
		_CONTEXT.fillStyle="rgba(0,0,0,1)";
		_CONTEXT.fillRect(351,130,_CANVAS.width,200);

	}//showMapForStageselect
	move(){
		let _this=this;
		_this.x-=_this.map_background_speed;

		//MAPを表示
		for(let _i=0;_i<_this.mapdef.length;_i++){
		for(let _j=0;_j<_this.mapdef[_i].length;_j++){
			let _k=_this.mapdef[_i][_j];
			if(!_this.isCollisionBit(_k)){continue;}
			if(_this.x+(_j*_this.t)<-500
				||_this.x+(_j*_this.t)>_CANVAS.width+100){
				//キャンバスからある程度の距離は描画しない
				continue;
			}
			let _p=_MAP_THEME[_this.map_theme]._p[_k];
			let _img=_p._o.obj;
			_CONTEXT.drawImage(
				_img,
				_this.x+(_p._mx(_j)*_this.t),
				_p._my(_i)*_this.t,
				_img.width,
				_img.height
			);
		}//_j
		}//_i

		//MAPエリア外では衝突判定は行わない
	}
}

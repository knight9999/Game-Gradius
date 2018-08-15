//=====================================================
//	gradius_parts_playermain.js
//	プレーヤー・ショットパーツ
//	※デバッグモードはURLパラメータをつかう
//		debug:（true/false）:デバッグモード有無
//		mp:（数値）:debug有効時、デバッグしたいマップの配列要素（0スタート）
//		ed:（数値）:debug有効時、敵難易度（0スタート）
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

const _PARTS_PLAYERMAIN={
	_players_obj:'',//プレーヤーのオブジェクトを格納
	_players_force_obj:'',//フォース・シールドオブジェクト
	_players_max:5,//プレーヤーの最大表示(自機1、オプション4)	
	_players_main_isalive:true,//自機の生存
	_is_finished_player_collision:false,//自機の爆発表示完了フラグ
	
	_option_obj:new Array(),//オプションのオブジェクト
	_option_count:0,
	_option_max:4,//オプションの最大表示
	_option_ani_count:0, //オプションアニメーション（拡縮）カウント
	_option_ani_def:[ //オプションアニメーション定義
		{scale:0.80},
		{scale:0.70},
		{scale:0.60},
		{scale:0.50},
		{scale:0.60},
		{scale:0.70}
	],

	_shots:{//プレーヤーのショット、このソースにあるショットクラス一式格納
		'shot': {
			'_SHOTTYPE_NORMAL': new Array(),
			'_SHOTTYPE_DOUBLE': new Array(),
			'_SHOTTYPE_LASER': new Array()
		},
		'missile':new Array(),
	},
	_shot_type_def:{//ショットタイプ定義
		MISSILE: '_SHOTTYPE_MISSILE',
		NORMAL : '_SHOTTYPE_NORMAL',
		DOUBLE : '_SHOTTYPE_DOUBLE',
		LASER : '_SHOTTYPE_LASER',
		RIPPLE_LASER : '_SHOTTYPE_RIPPLE_LASER'
	},
	_shot_type: '',
	_shot_max:2,//一度のショットの最大値
	_shot_missle_isalive:false,//ミサイル装備有無

	_move_drawX:new Array(),
	_move_drawY:new Array(),
	_move_drawY_moves:new Array(),
	_move_draw_max:100,

	_reset(){
		//以下定義をリセット
		let _this=this;

		_this._players_obj = '';
		_this._players_force_obj = '';
		_this._is_finished_player_collision = false;

		_this._option_obj = new Array();

		_this._option_count = 0;

		_this._shots = {
			'shot': {
				'_SHOTTYPE_NORMAL': new Array(),
				'_SHOTTYPE_DOUBLE': new Array(),
				'_SHOTTYPE_LASER': new Array()
			},
			'missile':new Array(),
		};
		_this._shot_type = _this._shot_type_def.NORMAL;
		_this._shot_missle_isalive = false;

		_this._move_drawX = new Array();
		_this._move_drawY = new Array();

	},

	_draw_players(){
		let _this = this;
		//自機とフォース・シールドの表示処理
		_this._players_force_obj.setDrawImage();
		if(_this._players_obj.isalive()){_this._players_obj.setDrawImage();}
	},
	_set_move_players(_p){
		let _this = this;
		//自機とフォース・シールドの移動処理
		if(!_this._players_obj.isalive()){return;}
		_this._players_obj.set_move(_p);
	},
	_set_stop_players(){
		let _this = this;
		//自機とフォース・シールドの移動処理
		if(!_this._players_obj.isalive()){return;}
		_this._players_obj.set_stop();
	},
	_move_players(){
		let _this = this;
		//自機とフォース・シールドの移動処理
		if(_this._players_obj.isalive()){_this._players_force_obj.move();}
		_this._players_obj.move();
	},

	_draw_option(){
		//オプションの移動・表示処理
		let _this=this;
		//オプションのアニメーションカウント設定
		_this._set_option_count();
		for(let _i=0;_i<_this._option_max;_i++){
			if(_this._players_obj.isalive()){_this._option_obj[_i].move(10*(_i+1));}
			_this._option_obj[_i].setDrawImage();
		}
	},
	_get_option_scale(){
		//アニメーションカウントより、
		//オプションアニメーション定義から
		//オプションのスケールを取得
		let _this=this;
		return _this._option_ani_def[_this._get_option_count()].scale;
	},

	//ショットタイプ設定
	_set_shot_type(_t){
		this._shot_type=_t;
	},
	_is_shottype_laser() {
		//_shots.shot._SHOTTYPE_LASERを参照して
		//オブジェクトがレーザーである判定
		let _this=this;
		let _os=_this._shots.shot._SHOTTYPE_LASER[0];
		if(_os===undefined){return false;}
		//現在のショットがLASERでなければfalse
		if(_this._shot_type!==_this._shot_type_def.LASER){return false;}
		//LASERで、レーザー装備である場合はtrue
		if (GameObject_SHOTS_LASER.prototype.isPrototypeOf(_os) ||
			GameObject_SHOTS_LASER_CYCLONE.prototype.isPrototypeOf(_os)
		) {return true;}
		//上記以外はfalseを返す
		return false;
	},
	_move_shots(){
		//ショット移動
		let _this = this;
		if(!_this._players_obj.isalive()){return;}
		for(let _i=0;_i<_this._players_max;_i++){
			if(_this._shot_missle_isalive){
				_this._shots.missile[_i].move();
			}
			_this._shots.shot[_this._shot_type][_i].move();
		}	
	}, //_move_shots
	_draw_shots(){
		//ショット表示
		let _this=this;
		for(let _i=0;_i<_this._players_max;_i++){
			if(_this._shot_missle_isalive){
//				if(_this._players_obj.isalive()){_this._shots.missile[_i].move();}
				_this._shots.missile[_i].setDrawImage();
			}
//			if(_this._players_obj.isalive()){_this._shots.shot[_this._shot_type][_i].move();}
			_this._shots.shot[_this._shot_type][_i].setDrawImage();
		}
	}, //_draw_shots
	_start_shots(){
		let _this=this;
		//自機・オプションのショット
		for(var _i=0;_i<_this._shots.shot[_this._shot_type].length;_i++){
			let _ps=_this._shots.shot[_this._shot_type][_i];
			if(!_ps.player._isalive){continue;}
			//ここで同時ショットと
			//個別ショットで判別させる
			if(_this._shot_type===_this._shot_type_def.DOUBLE){
				if(_ps.shots[0]._shot_alive||
					_ps.shots[1]._shot_alive){continue;}
				_ps.shots[0]._shot=true;
				_ps.shots[1]._shot=true;
				//最初の要素（自機）のみショット音をだす
				if(_i!==0){continue;}
				_GAME_AUDIO._setPlay(_ps.shots[0]._audio);
				continue;
			}

			_ps._sq=
			(_ps._sq===_ps.shots.length-1)
				?0
				:_ps._sq+1;
			var _s=_ps.shots[_ps._sq];

			if(_s._shot_alive){continue;}
			//ショット中は、ショットを有効にしない
			_s._shot=true;

			//最初の要素（自機）のみショット音をだす
			if(_i!==0){continue;}
			_GAME_AUDIO._setPlay(_s._audio);
		}
	}, //_start_shots
	_stop_shots(){
		let _this=this;
		for(var _i=0;_i<_this._shots.shot[_this._shot_type].length;_i++){
			let _ps=_this._shots.shot[_this._shot_type][_i];
			for(let _j=0;_j<_ps.shots.length;_j++){
				_ps.shots[_j]._shot=false;
			}
		}
	}, //_move_shots_stop
	_start_missile_shots(){
		let _this=this;
		//自機・オプションのミサイルショット
		if(!_this._shot_missle_isalive){return;}
		//ミサイル
		for(var _i=0;_i<_this._shots.missile.length;_i++){
			let _pm=_this._shots.missile[_i];
			if(!_pm.player._isalive){continue;}
			//ここで同時ショット(2WAY)と
			//個別ショットで判別させる
			if(_PLAYERS_POWER_METER===3){
				if(_pm.shots[0]._shot_alive||
					_pm.shots[1]._shot_alive){continue;}
				_pm.shots[0]._shot=true;
				_pm.shots[1]._shot=true;
				//最初の要素（自機）のみショット音をだす
				if(_i!==0){continue;}
				_GAME_AUDIO._setPlay(_pm.shots[0]._audio);
				continue;
			}

			_pm._sq=
				(_pm._sq===_pm.shots.length-1)?
					0
					:_pm._sq+1;
			var _sm=_pm.shots[_pm._sq];
			//ショット中は、ショットを有効にしない
			if(_sm._shot_alive){continue;}
			_sm._shot=true;
			//最初の要素（自機）のみショット音をだす
			if(_i!==0){continue;}
			_GAME_AUDIO._setPlay(_sm._audio);
		}
	}, //_start_missile_shots
	_stop_missile_shots(){
		let _this = this;
		for(var _i=0;_i<_this._shots.missile.length;_i++){
			let _pm=_this._shots.missile[_i];
			for(let _j=0;_j<_pm.shots.length;_j++){
				_pm.shots[_j]._shot=false;
			}
		}
	}, //_stop_missile_shots

	_draw_player_collision(){
		let _this = this;
		let _o = _this._players_obj;
		//自機の爆発表示
		if (_o._col_ani_c === 1) {
			_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['vicviper_bomb']);
		}
		if (_o._col_ani_c
			>= (_o.col_ani.length * 10) - 1) {
			//アニメーションが終わったら終了
			_this._is_finished_player_collision=true;
			return;
		}
		_o._draw_collapes();
	},

	//敵衝突判定処理
	_enemy_collision(_e){
		let _this = this;

		_this._init_laser_col_max();
		//敵分をループさせる
		for (let _i = _e.length-1; _i>=0; _i--) {
			let _oe = _e[_i];
			if (!_oe.isshow() && !_oe.isalive()) {_e.splice(_i, 1);}
			//スタンバイ状態は無視する
			if (_oe.isIgnore()) {continue;}
			if (_oe.isStandBy()) {continue;}
			if (!_oe.isalive()) {continue;}

			for (let _j = 0; _j < _this._shots.shot[_this._shot_type].length; _j++) {
				let _os = _this._shots.shot[_this._shot_type][_j];
				if (!_os.player._isalive) {
					continue;
				}
				if (_this._is_shottype_laser()) {
					//レーザーの処理
					let _m = _os.enemy_collision(_oe);
					_os.set_laser_col_max(_m);
					continue;
				}
				//レーザー以外の処理
				_os.enemy_collision(_oe);
			}

			//自機衝突判定
			_this._players_obj.enemy_collision(_oe);
			_this._players_force_obj.enemy_collision(_oe);

			//ミサイルが装備されていない場合は無視する
			if (!_this._shot_missle_isalive) {
				continue;
			}
			for (let _k = 0; _k < _this._shots.missile.length; _k++) {
				let _pm = _this._shots.missile[_k];
				if (!_pm.player.isalive()) {
					continue;
				}
				for (let _j = 0; _j < _pm.shots.length; _j++) {
					let _pms = _pm.shots[_j];
					_pm.enemy_collision(_oe, _pms);
				} //_j
			} //_k

		} //_i
		//ここでレーザーに対して、
		//自機・オプション共に、衝突位置を決定させる
		_this._set_shot_laser_MaxX();
		//ショット系の当たり判定処理
		//当たった場合は、ショットを初期化させる
		_this._set_shot_collision_control();

	}, //_enemy_collision
	//敵弾衝突判定処理
	_enemy_shot_collision(_es){
		let _this=this;
		if(_es===undefined){return;}

		for (let _i = _es.length-1; _i>=0 ; _i--) {
			let _e=_es[_i];
			if (!_e.isshow()) {_es.splice(_i, 1);continue;}

			//自機衝突判定
			_this._players_obj.enemy_shot_collision(_e);
			_this._players_force_obj.enemy_shot_collision(_e);
		}
	}, //_enemy_shot_collision


	_init_laser_col_max(){
		let _this = this;
		if (!_this._is_shottype_laser()){return;}
		for (let _j = 0; _j < _this._shots.shot[_this._shot_type].length; _j++) {
			let _os = _this._shots.shot[_this._shot_type][_j];
			if (!_os.player._isalive) {
				continue;
			}
			//レーザーのx位置も調整する。
			let _t = _os.shots[0];
			_t._laser_col_max=null;
		}
	},
	_set_shot_laser_MaxX(){
		let _this=this;
		if (!_this._is_shottype_laser()){return;}

		for(let _j=0;
			_j<_this._shots.shot[_this._shot_type].length;
			_j++){
		let _os=_this._shots.shot[_this._shot_type][_j];
		if(!_os.player._isalive){continue;}
		//レーザーのx位置も調整する。
		let _t=_os.shots[0];

		if(_t._laser_col_max===0||_t._laser_col_max===null){
			//衝突がない場合。
			_os.setLaserMaxX(_t, _CANVAS.width);
			continue;
		}
		// _t._laser_col_max=
		// 	(_t._laser_col_max===0||_t._laser_col_max===null)
		// 	?_CANVAS.width
		// 	:_t._laser_col_max;
		// if(_j===1){console.log('_t.x:'+_t.x+'   ['+_shottype_lasers_col_max+']');}

		if(_t.x>=_t._laser_col_max+(_os.speed*2)){
			//すでにレーザーの先端が
			//衝突から超えた場合は、衝突なしとして照射
			_os.setLaserMaxX(_t,_CANVAS.width);
		}else{
	//			console.log(_shottype_lasers_shottype_lasers_col_max)
			//※LASERクラスのmove()は、
			//この数字より超えないようにする
			_os.setLaserMaxX(_t,_t._laser_col_max + 10);
		}

		}//_j
	},
	_set_shot_collision_control(){
		//レーザー以外にて、衝突判定したショットを初期化させる
		let _this=this;
		if (_this._is_shottype_laser()){return;}
//		if(_this._shot_type===_this._shot_type_def.LASER){return;}
		for (let _i = 0; _i < _this._shots.shot[_this._shot_type].length; _i++) {
			let _os = _this._shots.shot[_this._shot_type][_i];
			if (!_os.player._isalive) {continue;}
			for (let _j = 0; _j < _os.shots.length; _j++) {
				let _oss = _os.shots[_j];
				if(_oss.isCollision){_oss._init();}
			}//_j
		}//_i
	},

	_get_move_drawX(_elem){
		return this._move_drawX[_elem];
	}, //_get_move_drawX
	_get_move_drawY(_elem){
		return this._move_drawY[_elem];
	}, //_get_move_drawY
	_set_move_draw(){
		let _this=this;
		//移動していない場合はセットしない
		if(!_this._players_obj._ismove){return;}
		//自機移動分配列をセットする。
		//Y軸無限:配列0番目からY起点にして要素0番目からリフレッシュさせる
		//Y軸有限:配列0番目から軸を流し込む
		let _w=_this._players_obj.width;
		let _h=_this._players_obj.height;
		let _x=_this._players_obj.x+parseInt(_w/4);
		let _y=_this._players_obj.y+parseInt(_h/4);
		let _pmdy=_this._move_drawY;
	
		//配列要素数が所定より大きい場合は、
		//最後の要素を外す。
		if(_this._move_drawX.length
			===_this._move_draw_max){
				_this._move_drawX.pop();
		}
		if(_this._move_drawY.length
			===_this._move_draw_max){
				_this._move_drawY.pop();
		}
	
		_this._move_drawX.unshift(_x);
	//	console.log(_pmdy);
	//	console.log('y==============:'+_this._players_obj.y);
	//	console.log('mgs==============:'+_mgs);
	
		//Y軸の処理（縦スクロールなし）
		//Y軸では、縦スクロールが発生しない間は、
		//要素0から順に自機移動座標を追加する。
		if(!_MAP.map_infinite){
			_pmdy.unshift(_y);
			return;
		}
	
		//Y軸の処理（縦スクロール発生時）
		//ここで自機のY移動量を記憶させておく
		_this._move_drawY_moves.unshift(_this._players_obj._y * -1);

		let _mgs = _MAP.getBackGroundSpeedY()*-1;
		if (_mgs === 0) {
			//縦スクロールが発生しない場合は、
			//要素0から追加
			_pmdy.unshift(_y);
			return;
		}
	
		//この時点で自機は止まった状態。
		//Y座標の値を参照し、必要に応じて上書きする。
		//オプション1つ目：要素10
		//オプション2つ目：要素20
		//オプション3つ目：要素30
		//オプション4つ目：要素40
		for (let _i = 1; _i < _this._move_draw_max; _i++) {
			_pmdy[_i] = _pmdy[_i - 1] + _this._move_drawY_moves[_i];
		}
	}, //_set_move_draw

	//=============================
	//オブジェクト初期設定
	//=============================
	_init_players_obj(_pm){
		//自機オブジェクトの初期設定
		//_pm：PowerMeterSelectで決定した値
		let _this=this;
		_this._players_obj = (
			(_pm === 0 || _pm === 2) ?
			new GameObject_PLAYER_MAIN() :
			new GameObject_PLAYER_MAIN_RED()
		);
		const _std = _this._shot_type_def;
		_this._shots.shot[_std.NORMAL].push(
			new GameObject_SHOTS_NORMAL(_this._players_obj));
		_this._shots.shot[_std.DOUBLE].push(
			(function(_o){
				if(_pm===0
					||_pm===2){
					return new GameObject_SHOTS_DOUBLE(_o);
				}else{
					return new GameObject_SHOTS_TAILGUN(_o);
				}
			})(_this._players_obj)
		);
		_this._shots.shot[_std.LASER].push(
			(function(_o){
				if(_pm===0){
					return new GameObject_SHOTS_LASER(_o);
				}else if(_pm===1){
					return new GameObject_SHOTS_LASER_CYCLONE(_o);
				}else if(_pm===2){
					return new GameObject_SHOTS_RIPPLE_LASER(_o);
				}else if(_pm===3){
					return new GameObject_SHOTS_RIPPLE_LASER_RED(_o);
				}else{
				}
			})(_this._players_obj)
		);

		_this._shots.missile.push(
			(function(_o){
				if(_pm===0){
					return new	GameObject_SHOTS_MISSILE(_o);
				}else if(_pm===1){
					return new	GameObject_SHOTS_MISSILE_SPREADBOMB(_o);
				}else if(_pm===2){
					return new	GameObject_SHOTS_MISSILE_PHOTOM(_o);
				}else if(_pm===3){
					return new	GameObject_SHOTS_MISSILE_2WAY(_o);
				}
			})(_this._players_obj)
		);
	}, //_init_players_obj
	_init_players_force_obj(_pm){
		//フォースフィールドオブジェクトの初期設定
		let _this=this;
		_this._players_force_obj =
		(function () {
			if (_pm === 0 ||
				_pm === 2) {
				return ((_PLAYERS_POWER_METER_SHIELD === 1) ?
					new GameObject_FORCEFIELD() :
					new GameObject_SHIELD()
				);
			} else {
				return ((_PLAYERS_POWER_METER_SHIELD === 1) ?
					new GameObject_FORCEFIELD_RED() :
					new GameObject_SHIELD_RED()
				);
			}
		})();
	}, //_init_players_force_obj
	_init_option_obj(_pm){
		//オプションの初期設定
		let _this=this;
		const _std = _this._shot_type_def;
		for (let _i = 0; _i < _this._option_max; _i++) {
			_this._option_obj.push(
				new GameObject_PLAYER_OPTION(
					'option', 110, 70 * (_i + 1), false)
			);
			_this._shots.shot[_std.NORMAL].push(
				new GameObject_SHOTS_NORMAL(
					_this._option_obj[_i])
			);
			_this._shots.shot[_std.DOUBLE].push(
				(function (_o) {
					if (_pm === 0 ||
						_pm === 2) {
						return new GameObject_SHOTS_DOUBLE(_o);
					} else {
						return new GameObject_SHOTS_TAILGUN(_o);
					}
				})(_this._option_obj[_i])
			);
			_this._shots.shot[_std.LASER].push(
				(function (_o) {
					if (_pm === 0) {
						return new GameObject_SHOTS_LASER(_o);
					} else if (_pm === 1) {
						return new GameObject_SHOTS_LASER_CYCLONE(_o);
					} else if (_pm === 2) {
						return new GameObject_SHOTS_RIPPLE_LASER(_o);
					} else if (_pm === 3) {
						return new GameObject_SHOTS_RIPPLE_LASER_RED(_o);
					} else {}
				})(_this._option_obj[_i])
			);

			_this._shots.missile.push(
				(function (_o) {
					if (_pm === 0) {
						return new GameObject_SHOTS_MISSILE(_o);
					} else if (_pm === 1) {
						return new GameObject_SHOTS_MISSILE_SPREADBOMB(_o);
					} else if (_pm === 2) {
						return new GameObject_SHOTS_MISSILE_PHOTOM(_o);
					} else if (_pm === 3) {
						return new GameObject_SHOTS_MISSILE_2WAY(_o);
					}
				})(_this._option_obj[_i])
			);
		}
	},

	//=============================
	//ローカル（外部からアクセスしない）
	//=============================
	_get_option_count(){
		//オプションのアニメーションカウントを取得
		let _this=this;
		return parseInt(_this._option_ani_count/3);
	},
	_set_option_count(){
		//オプションのアニメーションカウントを設定
		let _this=this;
		if(!_this._players_obj.isalive()){return;}
		_this._option_ani_count=
			(_this._option_ani_count>=(_this._option_ani_def.length*3)-1)
			?0
			:_this._option_ani_count+1
	},

}; //_PARTS_PLAYERMAIN



//==========================================
//	以下はクラス定義
//==========================================
class GameObject_PLAYER{
	constructor(_imgfile,
				_x,
				_y,
				_isalive){
		this.img=_CANVAS_IMGS[_imgfile].obj;

		this.x=_x||100;
		this.y=_y||100;
		this._x=0;//移動量x
		this._y=0;//移動量y

		this._isalive=_isalive||false;//存在可否
		this._scalechange=true;

		this.width=0;
		this.height=0;

		this._c=0;
		this.accel=3.0;
	}
	isalive(){return this._isalive;}
	enemy_collision(){}
	getPlayerCenterPosition(){
		return {_x:this.x+(this.width/2),
				_y:this.y+(this.height/2)}
	}
	setfalsealive(){this._isalive=false;}
	settruealive(){this._isalive=true;}
}

class GameObject_PLAYER_MAIN
			extends GameObject_PLAYER{
	constructor(){
		super('vicviper',100,200,true);
		let _this=this;
		_this._isequipped=false;//装備可否
		_this._isequipped_count=0;//装備アニメカウントダウン

		_this.img=_CANVAS_IMGS['vicviper'].obj;
		_this.imgsize=_this.img.height;
		_this.width=_this.imgsize;
		_this.height=_this.imgsize;

		_this.img_vb=_CANVAS_IMGS['vicviper_back'].obj;
		_this.imgsize_vb=_this.img_vb.height;
		_this.width_vb=_this.imgsize_vb;
		_this.height_vb=_this.imgsize_vb;

		// this.vv_ani=[//アニメ定義
		_this.c_vv_ani=20;
		_this.vv_ani=[120,60,0,180,240];
		_this.vv_e_ani=[420,360,300,480,540];
		_this._img_vv='';

		// this.vb_ani=[//噴射アニメ定義
		_this.c_vb_ani=0;
		_this.vb_ani=[0,14,28];
		_this.vb_e_ani=[42,42,42];
		_this._img_vb='';

		_this._col_ani_c=0;
		_this.col_img=_CANVAS_IMGS['vicviper_bomb'].obj;
		_this.col_img_pos=[0];
		_this.col_img_width=100;
		_this.col_ani=[//衝突時のアニメ定義
			{scale:0.5},
			{scale:0.7},
			{scale:0.5},
			{scale:0.4},
			{scale:0.3}
		];

		_this.map_col_date=null;
		_this.map_col_canint=0;//衝突可否範囲(ms)

		_this._ismove=false;//イベントより自機移動フラグ
	}
	_draw_collapes(){
		let _this=this;
		const _pl=_this.getPlayerCenterPosition();
		_GAME._setDrawImage({
			img:_this.col_img,
			x:_pl._x,
			y:_pl._y,
			width: _this.col_img_width,
			imgPosx: _this.col_img_pos,
			scale:_this.col_ani[parseInt(_this._col_ani_c/10)].scale
		});
		_this._col_ani_c=(_this._col_ani_c>=(_this.col_ani.length*10)-1)?0:_this._col_ani_c+1;
		//		console.log(this._col_ani_c)
	}
	enemy_collision(_e){
		//forcefieldが生きてる間はスルー
		if(_PLAYERS_POWER_METER_SHIELD===1
			&&_PARTS_PLAYERMAIN._players_force_obj.isalive()){
			return;
		}
		if(_GAME.isSqCollision(
			"25,28,45,35",
			this.x+","+this.y,
			_e.shotColMap,
			_e.x+","+_e.y
			)===_IS_SQ_NOTCOL){return;}
		_e.collision();
		this.setfalsealive();
	}
	enemy_shot_collision(_e){
		//forcefieldが生きてる間はスルー
		if(_PLAYERS_POWER_METER_SHIELD===1
			&&_PARTS_PLAYERMAIN._players_force_obj.isalive()){
			return;
		}

		if(_GAME.isSqCollision(
			"25,28,45,35",
			this.x+","+this.y,
			_e.shotColMap,
			_e.x+","+_e.y
			)===_IS_SQ_NOTCOL){return;}
		_e.init();
		this.setfalsealive();
	}
	set_equipped(){
		this._isequipped_count=20;
	}
	map_collition(){
		let _this=this;
		//forcefieldが生きてる間はスルー
		if(_PLAYERS_POWER_METER_SHIELD===1
			&&_PARTS_PLAYERMAIN._players_force_obj.isalive()){
			return;
		}

		//自機移動分にて当たり判定を設定
		let _ret=(()=>{
			if(_MAP.isMapCollision(
				_MAP.getMapX(_this.x+(_this.width/2)),
				_MAP.getMapY(_this.y+(_this.height/2)))
				){
				_this.map_col_date=null;
				return true;
			}
			return false;
		})();
		if(!_ret){return;}
		_this.setfalsealive();

	}
	set_vv_ani(_e_key){
		//アニメーション有効範囲
//		if(this.c_vv_ani>=50-2||this.c_vv_ani<0+2){return;}
		if(_e_key==='ArrowUp'||_e_key==='Up'){
			this.c_vv_ani-=2;
		}
		if(_e_key==='ArrowDown'||_e_key==='Down'){
			this.c_vv_ani+=2;
		}
	}
	set_moveamount(){
		let _this=this;
		//移動量の設定
//		console.log('======='+_this.y)
		if(!_this._ismove){
			_MAP.setBackGroundSpeedY(0);
			return;
		}
		//キーが押された場合
		//押下直後にx,yを移動させる
		//移動量を元にx,y座標を設定
		_this.x=(function(_i){
			let _x=_i+_this._x;
			if(_x<=50){
				_this._x=0;
				return 50;
			}
			if(_x>=_CANVAS.width-100){
				_this._x=0;
				return _CANVAS.width-100;
			}
			return _x;
		})(_this.x);
		_this.y=(function(_i){
			let _y=_i+_this._y;
			let _pl=_this.getPlayerCenterPosition();
			/////////////////
//				console.log(_i)
			//Y軸ループの場合
			//_MAPのy位置を調整させる
			if(_MAP.map_infinite){
				let _y_pos=100;
				if(_y<_y_pos){
					_MAP.setBackGroundSpeedY(_this._y);
					return _y_pos;
				}
				if(_y>_CANVAS.height-_this.height-_y_pos){
					_MAP.setBackGroundSpeedY(_this._y);
					return _CANVAS.height-_this.height-_y_pos;
				}
				_MAP.setBackGroundSpeedY(0);
				return _y;
			}
			//////////////////
			let _y_pos=_this.height*1/2;
			if(_y<_y_pos){//30
				return _y_pos;
			}
			if(_y>_CANVAS.height-_this.height-_y_pos){//410
				return _CANVAS.height-_this.height-_y_pos;
			}
			return _y;
		})(_this.y);
//		console.log('mgs==============:'+_MAP.map_backgroundY_speed);		
	}
	set_move(_p){
		//イベントからの移動司令
		if(_p===undefined){return;}
		let _this=this;
		_this._x=_p.x*_this.accel||0;
		_this._y=_p.y*_this.accel||0;
		if(_this._y>0){_this.set_vv_ani('Down')}
		if(_this._y<0){_this.set_vv_ani('Up')}
 		_this._ismove = true;
	}
	set_stop(){
		//イベントからの停止司令
		let _this=this;
		_this._x=0;
		_this._y=0;
		_this._ismove = false;
	}
	setDrawImage(){
		let _this=this;
		//自機
		_GAME._setDrawImage({
			img: _this.img,
			x: _this.x,
			y: _this.y,
			imgPosx: _this._img_vv,
			width: _this.imgsize,
			height: _this.imgsize,
			basePoint: 1
		});

		//噴射
		_GAME._setDrawImage({
			img: _this.img_vb,
			x: _this.x,
			y: _this.y+22,
			imgPosx: _this._img_vb,
			width: _this.imgsize_vb,
			height: _this.imgsize_vb,
			basePoint: 1
		});

		//デバッグモードでは当たり判定を表示させる
		if(_ISDEBUG){
			_CONTEXT.save();
			_CONTEXT.fillStyle='rgba(0,0,255,0.5)';
			_CONTEXT.fillRect(
				_this.x+25,
				_this.y+28,
				20,
				7
			);
			_CONTEXT.restore();
		}

	}
	move(){
		let _this=this;

		//敵・弾に当たったら終了
		if(!_this.isalive()){return;}
		_this.map_collition();

		//移動量の設定
		_this.set_moveamount();

		//本機のアニメーション設定
		if(!_this._ismove){
			//コントローラーから離れたら
			//自機を元に戻す
			if(_this.c_vv_ani>25){
				_this.c_vv_ani-=1;
			}else if(_this.c_vv_ani<25){
				_this.c_vv_ani+=1;
			}else{
				_this.c_vv_ani=25;
			}
		}else{
			if(_this.c_vv_ani>50-4){
				_this.c_vv_ani=50-4;
			}else if(_this.c_vv_ani<0+4){
				_this.c_vv_ani=0+4;
			}else{
			}

		}
		//本機のアニメーション
		_this._img_vv=(()=>{
			let _c=parseInt(_this.c_vv_ani/10);
			if(_this._isequipped_count<=0){
				return _this.vv_ani[_c];
			}
			_this._isequipped_count--;
			if(_this._isequipped_count>0
				&&_this._isequipped_count%2===0){
				return _this.vv_e_ani[_c];
			}
			return _this.vv_ani[_c];
		})();

		//噴射アニメ
		_this._img_vb=(()=>{
			let _c=parseInt(_this.c_vb_ani/3);

			if(_this._isequipped_count>0
				&&_this._isequipped_count%2===0){
				return _this.vb_e_ani[_c];
			}
			return _this.vb_ani[_c];
		})();

		_this.c_vb_ani=
			_GAME._ac._get(_this.c_vb_ani,_this.vb_ani,3);

	}
}


class GameObject_PLAYER_MAIN_RED
			extends GameObject_PLAYER_MAIN{
	constructor(){
		super('vicviper1',100,200,true);
		this.col_img_pos = [100];
	}
}

//_PLAYERS_MAINにしたがって動く。
//（_PLAYERS_MOVE_DRAWの配列に従う）
class GameObject_PLAYER_OPTION
			extends GameObject_PLAYER{
	constructor(_imgfile,
				_x,
				_y,
				_isalive){
		super(_imgfile,
					_x,
					_y,
					_isalive);
		this.imgsize=this.img.height;
		this.width=this.imgsize;
		this.height=this.imgsize;
	}
	setDrawImage(){
		let _this=this;
		if(!_this._isalive){return;}
		//要素がない場合は飛ばす
		if(_this.x===null
			||_this.y===null
			||_this.x===undefined
			||_this.y===undefined){return;}
		let _p=_this.getPlayerCenterPosition();
		_GAME._setDrawImage({
			img:_this.img,
			x:_p._x,
			y:_p._y,
			scale:_PARTS_PLAYERMAIN._get_option_scale()
		});		
	}
	move(_pmd_elem){
		let _this=this;
		_this.x = _PARTS_PLAYERMAIN._get_move_drawX(_pmd_elem);
		_this.y = _PARTS_PLAYERMAIN._get_move_drawY(_pmd_elem) - 2;
	}
}


class GameObject_FORCEFIELD{
	constructor(){
		let _this=this;
		_this.img=_CANVAS_IMGS['forcefield'].obj;
		_this.x=0;
		_this.y=0;
		_this.width=0;
		_this.height=0;

		_this._c=0;
		_this._scale=0;//フォースのサイズ
		_this.reduce_scale_rate=0.09;//フォースの削られるサイズ
		_this.reduce_scale_min=0.55;//フォースが切れる最小サイズ

		//アニメーション定義
		_this.ani=[0,105];

		_this.col_date=null;//打たれた時間
		_this.col_canint=25;//連続打たれる間隔
	};
	init(){
		let _this=this;
		_this._scale=1;
		_this.width=_this.img.width/4;
		_this.height=_this.img.height;
	}
	reset(){
		let _this=this;
		_this._scale=0;
		_POWERMETER._set_meter_on('000001');
	}
	isalive(){return (this._scale===0)?false:true;}
	enemy_collision(_e){
		let _this=this;
		if(!_this.isalive()){return;}
		if(_GAME.isSqCollision(
//			"25,20,35,30",
			parseInt(_this._scale*_this.width/8)
			+","+parseInt(_this._scale*_this.height/8)
			+","+parseInt(_this._scale*_this.width*6/8)
			+","+parseInt(_this._scale*_this.height*6/8),
			_this.x+","+_this.y,
			_e.shotColMap,
			_e.x+","+_e.y
			)===_IS_SQ_NOTCOL){return;}

		_e.collision();
		_this.reduce();
	}
	enemy_shot_collision(_e){
		let _this=this;
		if(!_this.isalive()){return;}
		if(_GAME.isSqCollision(
//			"25,20,35,30",
			parseInt(_this._scale*_this.width/8)
			+","+parseInt(_this._scale*_this.height/8)
			+","+parseInt(_this._scale*_this.width*6/8)
			+","+parseInt(_this._scale*_this.height*6/8),
			_this.x+","+_this.y,
			_e.shotColMap,
			_e.x+","+_e.y
			)===_IS_SQ_NOTCOL){return;}
		if(_e.is_ignore_collision){
			//貫通するショットは一気にシールドを削る
			_this.reset();
			return;
		}
		_e.init();
		_this.reduce();
	}

	getPlayerCenterPosition(){
		return {_x:this.x+(this.width/2),
				_y:this.y+(this.height/2)}
	}
	map_collition(){
		//プレーヤーの中心座標取得
		let _pl=this.getPlayerCenterPosition();
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_pl._x);
		let _map_y=_MAP.getMapY(_pl._y);

		if(!_MAP.isMapCollision(_map_x,_map_y)){return;}

		this.reduce();
	}
	isCollision(){
		//衝突判定フラグ
		//_statusを下げる判定フラグ
		let _this=this;
		//150ミリ秒以内は無視する。
		if(_this.col_date===null){
			//1発目は必ず当てる
			_this.col_date=new Date();
			return true;
		}
		let _date=new Date();
		if(_date-_this.col_date>_this.col_canint){
			_this.col_date=new Date();
			return true;
		}
		return false;
	}
	reduce(){
		let _this=this;
		if(!_this.isalive()){return;}
		if(!_this.isCollision()){return;}

		_this._scale-=_this.reduce_scale_rate;
		//ある大きさになれば削除
		if(_this._scale<=_this.reduce_scale_min){
			_this.reset();
		}
		// _this.width*=_this._scale;
		// _this.height*=_this._scale;
		_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['vicviper_shield_reduce']);
		
	}
	setDrawImage(){
		let _this=this;
		//画像を中心起点とし、拡縮を中心基準点で処理させる
		let _p=_PARTS_PLAYERMAIN._players_obj;
		let _x=_p.getPlayerCenterPosition()._x;
		let _y=_p.getPlayerCenterPosition()._y;
		_GAME._setDrawImage({
			img:_this.img,
			x:_x-6,
			y:_y-2,
			imgPosx:_this.ani[parseInt(_this._c/5)],
			width:_this.width,
			height:_this.height,
			scale:_this._scale
		});
	}
	move(){
		//_PARTS_PLAYERMAIN._players_obj
		let _this=this;
		let _p=_PARTS_PLAYERMAIN._players_obj;
		if(!_this.isalive()){return;}
		_this.map_collition();
		_this.x=_p.x;
		_this.y=_p.y;

		_this._c=
			(_this._c>=(_this.ani.length*5)-1)?0:_this._c+1;
	}
}

class GameObject_FORCEFIELD_RED
				extends GameObject_FORCEFIELD{
	constructor(){
		super();
		//アニメーション定義
		this.ani=[210,315];
	};
}

class GameObject_SHIELD
	extends GameObject_FORCEFIELD{
	constructor(){
		super();
		let _this=this;
		//アニメーション定義
		_this.ani=[0,40];
		_this.reduce_scale_rate=0.04;//フォースの削られるサイズ
		_this.reduce_scale_min=0.35;//フォースが切れる最小サイズ
	}
	getPlayerCenterPosition(){
		//センタリングはプレーヤーの中心から約右に配置
		return {_x:this.x+(this.width/2*this._scale),
				_y:this.y+(this.height*this._scale)}
	}
	init(){
		let _this=this;
		_this._scale=1;
		_this.img=_CANVAS_IMGS['shield'].obj;
		_this.width=_this.img.width/4;
		_this.height=_this.img.height;
	}
	isalive(){
		return (this._scale===0)?false:true;
	}
	enemy_collision(_e){
		let _this=this;
		if(!_this.isalive()){return;}
		if(_GAME.isSqCollision(
			"0"
			+","
			+parseInt(_this._scale*_this.height*-1)
			+","
			+parseInt(_this._scale*_this.width)
			+","
			+parseInt(_this._scale*_this.height*2),
			_this.x+","+_this.y,
			_e.shotColMap,
			_e.x+","+_e.y
			)===_IS_SQ_NOTCOL){return;}
		_e.collision();
		_this.reduce();
	}
	enemy_shot_collision(_e){
		let _this=this;
		if(!_this.isalive()){return;}
		if(_GAME.isSqCollision(
			"0"
			+","
			+parseInt(_this._scale*_this.height*-1)
			+","
			+parseInt(_this._scale*_this.width)
			+","
			+parseInt(_this._scale*_this.height*2),
			_this.x+","+_this.y,
			_e.shotColMap,
			_e.x+","+_e.y
			)===_IS_SQ_NOTCOL){return;}
		if(_e.is_ignore_collision){
			//貫通するショットは一気にシールドを削る
			_this.reset();
			return;
		}
		_e.init();
		_this.reduce();
	}
	map_collition(_p){
		let _this=this;
		//MAPの位置を取得
		//シールドの上下画像の中心点からMAP判定する。
		let _map_x=_MAP.getMapX(_this.x);
		let _map_y=_MAP.getMapY(_this.y);

		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this.reduce();
			return;
		}

		//シールドの上端
		_map_y=_MAP.getMapY(_this.y-(_this.height*_this._scale)+15);
//		_map_y=parseInt(this.y/_MAP.t);
		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this.reduce();
			return;
		}

		//シールドの下端
		_map_y=_MAP.getMapY(_this.y+(_this.height*_this._scale)-15);
//		_map_y=parseInt((_pl._y-10+this.height)/_MAP.t);
		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this.reduce();
			return;
		}

	}
	setDrawImage(){
		let _this=this;
		//上画像
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			imgPosx:_this.ani[parseInt(_this._c/5)],
			width:_this.width,
			height:_this.height,
			scale:_this._scale,
			basePoint:7
		});

		//下画像 左上起点として表示
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			imgPosx:_this.ani[parseInt(_this._c/5)],
			width:_this.width,
			height:_this.height,
			scale:_this._scale,
			basePoint:1
		});

	}
	move(){
		let _this=this;
		if(!_this.isalive()){return;}
		let _p=_PARTS_PLAYERMAIN._players_obj;
		let _pl=_p.getPlayerCenterPosition();
		_this.map_collition(_p);
		_this.x=_p.x+_p.width;
		_this.y=_pl._y;
		_this._c=(_this._c>=(_this.ani.length*5)-1)?0:_this._c+1;
	}
}

class GameObject_SHIELD_RED
				extends GameObject_SHIELD{
	constructor(){
		super();
		//アニメーション定義
		this.ani=[80,120];
	};
}

class GameObject_SHOTS{
	constructor(_p){
		this.shots=new Array();
		this.player=_p;//プレーヤー
		this._sq=0;//ショット順

		// for (let _i = 0; _i < _PARTS_PLAYERMAIN._shot_max; _i++) {
		// 	this.shots.push({
		// 		sid: _PARTS_PLAYERMAIN._shot_type_def.NORMAL,
		// 		x: 0, //処理変数：照射x軸
		// 		y: 0,
		// 		isCollision: false,
		// 		img: _CANVAS_IMGS['shot1'].obj,
		// 		_audio: _CANVAS_AUDIOS['shot_normal'],
		// 		_shot: false, //処理変数：照射フラグ
		// 		_shot_alive: false, //処理変数：照射中フラグ
		// 		_init: function () { //初期化
		// 			this.x = 0,
		// 				this.y = 0,
		// 				this.isCollision = false,
		// 				this._shot = false,
		// 				this._shot_alive = false
		// 		}
		// 	});
		// }

	}
	enemy_collision(_e){}
	map_collition(_t) {}
	getshottype(){}
	setDrawImage(){}
	move(){}
}

class GameObject_SHOTS_MISSILE
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		this.col_mis=[//ミサイル衝突アニメ定義
			{fs:'rgba(255,246,72,1)',scale:8},
			{fs:'rgba(255,131,62,1)',scale:10},
			{fs:'rgba(255,131,72,1)',scale:12},
			{fs:'rgba(255,131,62,1)',scale:14},
			{fs:'rgba(133,0,4,1)',scale:14},
			{fs:'rgba(100,0,4,1)',scale:16}
		];
		//ミサイルの画像スプライトに対して、
		//ミサイルのステータスと座標位置定義
//		this.st={'_st1':0,'_st2':24,'_st3':48,'_st4':72,'_st5':96,'_st6':120,'_st7':144,'_st8':168};
		this.st={'_st1':0,'_st2':24,'_st3':48,'_st4':72,'_st5':96,'_st6':0,'_st7':96,'_st8':72,'_st9':0};
		this.imgsize=_CANVAS_IMGS['gradius_missile'].obj.height;

		let _t=this;
		for(let _i=0;_i<_PARTS_PLAYERMAIN._shot_max;_i++){
			this.shots.push({
				sid:_PARTS_PLAYERMAIN._shot_type_def.MISSILE,
				id:_i,
				x:0,//処理変数：照射x軸
				y:0,
				_t:0,//ミサイル発射後時間
				_st:'_st1',//ミサイルのステータス
				_img:_CANVAS_IMGS['gradius_missile'].obj,//ミサイルの画像
				_audio:_CANVAS_AUDIOS['missile'],
				_c_mc:0,//ミサイルのステータス切替カウント（間引き取る為）
				_c:0,//爆風アニメーションカウント
				_c_area:25,//ミサイル、爆風の当たり判定
				_enemyid:null,//ミサイルに衝突した敵のオブジェクト
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this._t=0,
					this._c=0,
					this._c_mc=0,
					this._c_area=25,
					this._st='_st1',
					this._enemyid=null,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}

		let _this=this;
		this.mis_status={
			'_st1':function(_t){
				//斜め下
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+4;
				})(_t.x);
				_t.y=(function(_i){
					return (!_t._shot_alive)?_p._y:_i+8;
				})(_t.y);
			},
			'_st2':function(_t){
				//真下
				_t.x+=0;
				_t.y+=8;
			},
			'_st3':function(_t){
				//真横
				_t.x+=8;
				_t.y+=0;
			},
			'_st4':function(_t){
				_t.x+=2;
				_t.y+=3;
			},
			'_st5':function(_t){
				//_st5→_st6
				_t.x+=3;
				_t.y+=2;
			},
			'_st6':function(_t){
				//_st6→_st7
				_t.x+=4;
				_t.y+=4;
			},
			'_st7':function(_t){
				//_st7→_st8
				_t.x+=6;
				_t.y+=4;
			},
			'_st8':function(_t){
				//_st7→_st8
				_t.x+=6;
				_t.y+=3;
			},
			'_st9': function (_t) {//_st1の落下版
				//_st9→_st10
				_t.x += 2;
				_t.y += 3;
			}
		}

	}
	enemy_collision(_e,_t){
		//非表示のプレーヤーは無視する
		if(!this.player.isalive()){return;}
		//弾が発していない場合は無視する
		if(!_t._shot_alive){return;}

		//ミサイル衝突判定
		let _s=_GAME.isSqCollision(
			(0-_t._img.height/4)+","
				+(0-_t._img.height/4)+","
				+(_t._img.height*5/4)+","
				+(_t._img.height*5/4),
			_t.x+","+_t.y,
			_e.shotColMap,
			_e.x+","+_e.y
			);
		if(_s===_IS_SQ_NOTCOL){return;}
		//爆発中は無視
		if(_t._c>0){return;}
		if(_t._c===0){_t._c=1;}
		
		if(_s===_IS_SQ_COL_NONE){return;}
		_e.collision(_PARTS_PLAYERMAIN._shot_type_def.MISSILE);

	}
	get_missile_status(_t){return _t._st;}
	set_missile_status(_t,_st){
		//ミサイルのステータス切り替え設定
		//※少し間引き(2カウント分)して切替をする。
		_t._c_mc=(_t._c_mc>=1)?0:_t._c_mc+1;
		if(_t._c_mc===1){_t._st=_st;}
	}
	map_collition(_t){
		let _this=this;
		let _map_x=_MAP.getMapX(_t.x+_this.imgsize),
			_map_y=_MAP.getMapY(_t.y);

		//MAPに入る手前は無視する
		if(_MAP.isMapBefore(_map_x,_map_y)){return;}
		//MAPから抜けた後のミサイルの状態
// 		if(_MAP.isMapOver(_map_x,_map_y)){
// //			console.log('===================');
// 			if(_this.get_missile_status(_t)==='_st3'
// 				){
// 				_this.set_missile_status(_t,'_st4');
// 				return;
// 			}
// 			if(_this.get_missile_status(_t)==='_st2'){
// 				return;
// 			}
// 		}

		//段差を滑らかに表示させるためのもの
		//ミサイル落下 _st3→_st4
		// if(_this.get_missile_status(_t)==='_st4'){
		// 	_this.set_missile_status(_t,'_st5');
		// }

		//ミサイル着地 _st1→_st6→_st7→_st8→_st3
		//着座時、_st3が必ず壁より１マス上に
		//配置する必要がある。
		if(_this.get_missile_status(_t)==='_st6'){
//			console.log('6')			
			_this.set_missile_status(_t,'_st7');
		}
		if(_this.get_missile_status(_t)==='_st7'){
//			console.log('7')
			_this.set_missile_status(_t,'_st8');
		}
		if(_this.get_missile_status(_t)==='_st8'){
//			console.log('8');
			_this.set_missile_status(_t,'_st3');
		}

		if (_this.get_missile_status(_t) === '_st9') {
			_map_x = _MAP.getMapX(_t.x + _this.imgsize);
			//真下に衝突がある場合
			if (_MAP.isMapCollision(_map_x, _map_y + 1)) {
				//→st6→st7→st3への調整のためのy位置調整
				_this.set_missile_status(_t, '_st6');
				return;
			}
			_this.set_missile_status(_t, '_st2');
		}

		//落ちかけ
		if (_this.get_missile_status(_t) === '_st4'
			||_this.get_missile_status(_t) === '_st5') {
			_map_x=_MAP.getMapX(_t.x+_this.imgsize);
			//真下に衝突がある場合
			if(_MAP.isMapCollision(_map_x,_map_y+1)){
				//→st6→st7→st3への調整のためのy位置調整
				_this.set_missile_status(_t,'_st6');
				return;
			}
			_t.x+=5;
			_t.y+=2;
			_this.set_missile_status(_t,'_st9');
		}


		if(_this.get_missile_status(_t)==='_st3'){
//			console.log('_st3');
			//真下の障害物判定により縦位置を調整させる
			_map_y=_MAP.getMapY(_t.y+_this.imgsize);
			_t.y=(_MAP.isMapCollision(_map_x,_map_y))
					?_t.y-1
					:_t.y+1
			//MAPからはみ出る
			if(_MAP.isMapOver(_map_x,_map_y)){
				_this.set_missile_status(_t,'_st4');
				return;
			}
			_map_x=_MAP.getMapX(_t.x+(_this.imgsize));
			_map_y=_MAP.getMapY(_t.y+(_this.imgsize/2));
			//壁にぶつかる(壁中)
			if(_MAP.isMapCollision(_map_x,_map_y)){
//				console.log('_st3 init() 1')
				_t._init();
				return;
			}
			//真下に壁がない場合
			if(!_MAP.isMapCollision(_map_x+1,_map_y+1)){
				_this.set_missile_status(_t,'_st4');
 				return;
 			}
		}

		if(_this.get_missile_status(_t)==='_st2'){
//			console.log('_st2');
			//MAPからはみ出る
			if(_MAP.isMapOver(_map_x,_map_y)){
				return;
			}
			_map_y=_MAP.getMapY(_t.y+_this.imgsize+25);
			//下の壁にぶつかる
			if(_MAP.isMapCollision(_map_x,_map_y)){
				_this.set_missile_status(_t,'_st6');
				return;
			}
		}

		if(_this.get_missile_status(_t)==='_st1'){
//			console.log('_st1');
			_map_y=_MAP.getMapY(_t.y+_this.imgsize+25);
			//自身、あるいはその下の壁にぶつかる
			if(_MAP.isMapCollision(_map_x+1,_map_y)){
				_this.set_missile_status(_t,'_st6');
				return;
			}
			if(_MAP.isMapCollision(_map_x,_map_y)){
				_this.set_missile_status(_t,'_st6');
				return;
			}
		}

	}
	collapse_missile(_t){
		let _this=this;
		let _x=_MAP.getX(_t.x+(_this.imgsize/2));
		let _y=_MAP.getY(_t.y+(_this.imgsize/2));
		//爆風を表示
		if(_t._c>=_this.col_mis.length*5){
			//爆風処理完了後初期化
			_t._init();
			return;
		}
		let _c=parseInt(_t._c/5);
		_t._c_area=_this.col_mis[_c].scale;

		_CONTEXT.fillStyle=_this.col_mis[_c].fs;
 	 	_CONTEXT.beginPath();
 		_CONTEXT.arc(_x,_y,
 					_this.col_mis[_c].scale,
 					0,
 					Math.PI*2,false);
 		_CONTEXT.fill();

		if(this.col_mis[_c-1]!==undefined){
			_CONTEXT.fillStyle
				=_this.col_mis[_c-1].fs;
		 	_CONTEXT.beginPath();
			_CONTEXT.arc(_x,_y,
						_this.col_mis[_c-1].scale,
						0,
						Math.PI*2,false);
			_CONTEXT.fill();
		}
		_t._c++;
	}
	setDrawImage(){
		let _this=this;
		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot_alive){continue;}
			//爆発を表示させる
			if(_t._c>0){
				_this.collapse_missile(_t);
				continue;
			}

			_GAME._setDrawImage({
				img: _t._img,
				x: _t.x,
				y: _t.y,
				imgPosx: _this.st[_this.get_missile_status(_t)],
				width: _this.imgsize,
				height: _this.imgsize,
				basePoint: 1
			});
		}
	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(_p.x===undefined){return;}
		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}
//			console.log(_j+':'+_t.y+':'+_t._st);
			_t.y=_MAP.getShotY(_t.y);
			if(_t._c>0){
				//爆発アニメ開始時はここで終了
				_t.x=_MAP.getX(_t.x);
				continue;
			}
//console.log('_j:'+_j+'   _t.x:'+_t.x+'   _t.y:'+_t.y);
//console.log('_map_x:'+_map_x);

			if(_GAME.isShotCanvasOut(_t)){
				//キャンバスから離れた場合初期化
				_t._init();
				continue;
			}

			_this.mis_status[_t._st](_t);
			_t._shot_alive=true;
		}
	}

}//GameObject_SHOTS_MISSILE

class GameObject_SHOTS_MISSILE_PHOTOM
			extends GameObject_SHOTS_MISSILE{
	constructor(_p){
		super(_p);
		let _this=this;
		//_st1のみ定義上書
		this.st._st1=48;
		_this.mis_status._st1=function(_t){
			//斜め下
			let _p=_this.player//プレーヤーの中心座標取得
					.getPlayerCenterPosition();
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				return (!_t._shot_alive)?_p._x:_i+4;
			})(_t.x);
			_t.y=(function(_i){
				return (!_t._shot_alive)?_p._y:_i+8;
			})(_t.y);
		}
	}
	enemy_collision(_e,_t){
		let _this=this;
		//非表示のプレーヤーは無視する
		if(!_this.player.isalive()){return;}
		//弾が発していない場合は無視する
		if(!_t._shot_alive){return;}

		//ミサイル衝突判定
		let _s=_GAME.isSqCollision(
			_this.imgsize/4+","
				+_this.imgsize/4+","
				+_this.imgsize*3/4+","
				+_this.imgsize*3/4,
			_t.x+","+_t.y,
			_e.shotColMap,
			_e.x+","+_e.y
			);
		if(_s===_IS_SQ_NOTCOL){return;}
		//爆発中は無視
		if(_t._c>0){return;}

		if(_s===_IS_SQ_COL_NONE){
			if(_t._c===0){_t._c=1;}
			//衝突した敵を覚える
			return;
		}
		_e.collision(_PARTS_PLAYERMAIN._shot_type_def.MISSILE);
		//敵を倒した場合は貫通させる。
		if(!_e.isalive()){return;}
		if(_t._c===0){_t._c=1;}

	}
}//GameObject_SHOTS_MISSILE_PHOTOM

class GameObject_SHOTS_MISSILE_SPREADBOMB
			extends GameObject_SHOTS_MISSILE{
	constructor(_p){
		super(_p);
		this.col_mis=[//ミサイル衝突アニメ定義
			{fs:'rgba(198,231,247,1)',scale:30},
			{fs:'rgba(71,127,228,1)',scale:40},
			{fs:'rgba(22,83,190,1)',scale:50},
			{fs:'rgba(4,9,161,1)',scale:60},
			{fs:'rgba(0,27,100,1)',scale:70}
		];
		this.st={'_st1':72,'_st2':96,'_st3':0};

	}
	enemy_collision(_e,_t){
		let _this=this;
		//非表示のプレーヤーは無視する
		if(!_this.player.isalive()){return;}
		//弾が発していない場合は無視する
		if(!_t._shot_alive){return;}

		//ミサイル衝突判定
		//ミサイルの先端と敵の中心点より判定
		let _ec=_e.getEnemyCenterPosition();
		let _s=(function(){
			//爆風判定
			if(_t._c>0){
				if(_t._c%20!==0){return _IS_SQ_NOTCOL;}
				//正方形
				let _r=_t._c_area*2;
				let _l=_r/Math.sqrt(2);//円内1辺
				return _GAME.isSqCollision(
					"0,0,"+_r+","+_r,
					parseInt(_t.x-(_r/2))+","+parseInt(_t.y-(_r/2)),
					_e.shotColMap,
					_e.x+","+_e.y
				);
			}
			//通常判定
			return _GAME.isSqCollision(
				_this.imgsize/4+","
					+_this.imgsize/4+","
					+_this.imgsize*3/4+","
					+_this.imgsize*3/4,
				_t.x+","+_t.y,
				_e.shotColMap,
				_e.x+","+_e.y
			);
		})();

		if(_s===_IS_SQ_NOTCOL){return;}		
		//前回衝突した敵と同じ場合は無視する。
		if(_t._c===0){_t._c=1;}
		if(_s===_IS_SQ_COL_NONE){return;}
		_e.collision(_PARTS_PLAYERMAIN._shot_type_def.MISSILE);
	}
	map_collition(_t){
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_t.x);
		let _map_y=_MAP.getMapY(_t.y+this.imgsize);

		if(_MAP.isMapCollision(_map_x,_map_y)
			||_MAP.isMapCollision(_map_x+1,_map_y)){
			if(_t._c===0){_t._c=1;}
			return;
		}

	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(_p.x===undefined){return;}
		let _pl=_p.getPlayerCenterPosition();

		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}

			_t.y=_MAP.getShotY(_t.y);
			if(_t._c>0){
				//爆発アニメ開始時はここで終了
				_t.x=_MAP.getX(_t.x);
				continue;
			}

			_t._t++;
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				return (!_t._shot_alive)?_pl._x:_i+4;
			})(_t.x);
			_t.y=(function(_i){
				return (!_t._shot_alive)?_pl._y-8:
					_i+(_t._t*_t._t/200);
			})(_t.y);

			_t._st=(function(){
				if(_t._t>20&&_t._t<30){
					return '_st2';
				}
				if(_t._t>30){
					return '_st3';
				}
				return '_st1';
			})();

			if(_GAME.isShotCanvasOut(_t)){
				_t._init();
				continue;
			}

			_t._shot_alive=true;
//			console.log(_t._y);
		}
	}
}//GameObject_SHOTS_MISSILE_SPREADBOMB

class GameObject_SHOTS_MISSILE_2WAY
			extends GameObject_SHOTS_MISSILE{
	constructor(_p){
		super(_p);
		this.st={'_st1':72,'_st2':96,'_st3':0,'_st4':120,'_st5':144,'_st6':168};
	}
	enemy_collision(_e,_t){
		let _this=this;
		//非表示のプレーヤーは無視する
		if(!this.player.isalive()){return;}
		//弾が発していない場合は無視する
		if(!_t._shot_alive){return;}
		//ミサイル衝突判定
		let _s=_GAME.isSqCollision(
			"-10,-10,"
				+(_this.imgsize+10)+","
				+(_this.imgsize+10),
			_t.x+","+_t.y,
			_e.shotColMap,
			_e.x+","+_e.y
			);
		if(_s===_IS_SQ_NOTCOL){return;}
		//爆発中は無視
		if(_t._c>0){return;}
		if(_t._c===0){_t._c=1;}
		
		if(_s===_IS_SQ_COL_NONE){return;}		
		_e.collision(_PARTS_PLAYERMAIN._shot_type_def.MISSILE);

	}
	map_collition(_t){
		//MAPの位置を取得
		let _this=this;
		let _map_x=_MAP.getMapX(_t.x);
		let _map_y=_MAP.getMapY(
			(_t.id===0)
			?_t.y
			:_t.y+_this.imgsize
		);
		if(_MAP.isMapCollision(_map_x,_map_y)){
			if(_t._c===0){_t._c=1;}
			return;
		}

	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(_p.x===undefined){return;}

		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();
		//ここでは各要素にショット権限を与え、
		//各弾に対して、敵に弾を当てた、
		//あるいは画面からはみ出た時に、
		//_shot_aliveをfalseにする。

		//0番目の要素は上
		//1番目の要素は下
		let _s=this.shots[0]._shot|
					this.shots[1]._shot;
		let _sa=this.shots[0]._shot_alive|
					this.shots[1]._shot_alive;
		if(!_s&&!_sa){return;}
		if(_s&&!_sa){
			//ショット打ち始め
			this.shots[0]._shot_alive=true;
			this.shots[1]._shot_alive=true;
		}
		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];

			if(!_t._shot_alive){continue;}

			_t.y=_MAP.getShotY(_t.y);			
			if(_t._c>0){
				//爆発アニメ開始時はここで終了
				_t.x=_MAP.getX(_t.x);
				continue;
			}

			_t._t+=1;
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				if(_j===0){
					return (!_sa)?_pl._x:_i+1;
				}else{
					return (!_sa)?_pl._x:_i+1;
				}
			})(_t.x);
			_t.y=(function(_i){
				if(_j===0){
					return (!_sa)?_pl._y-20:_i+(_t._t*_t._t/50)*-1;
				}else{
					return (!_sa)?_pl._y:_i+(_t._t*_t._t/50);
				}
			})(_t.y);

			if(_GAME.isShotCanvasOut(_t)){
				_t._init();
				continue;
			}
			if(_j===0){
				_t._st=(function(){
					if(_t._t>10&&_t._t<20){
						return '_st5';
					}
					if(_t._t>20){
						return '_st6';
					}
					return '_st4';
				})();
			}else{
				_t._st=(function(){
					if(_t._t>10&&_t._t<20){
						return '_st2';
					}
					if(_t._t>20){
						return '_st3';
					}
					return '_st1';
				})();
			}

			_t._shot_alive=true;
		}
	}
}//GameObject_SHOTS_MISSILE_2WAY


class GameObject_SHOTS_NORMAL
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		this.speed = 20;
		this._width = 25;
		this._height = 25;

		for(let _i=0;_i<_PARTS_PLAYERMAIN._shot_max;_i++){
			this.shots.push({
				sid:_PARTS_PLAYERMAIN._shot_type_def.NORMAL,
				x:0,//処理変数：照射x軸
				y:0,
				isCollision:false,
				img:_CANVAS_IMGS['shots'].obj,
				_audio:_CANVAS_AUDIOS['shot_normal'],				
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this.isCollision=false,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}
	}
	enemy_collision(_e) { //敵への当たり処理
		let _this = this;
		if (!_this.player.isalive()) {
			return;
		}
		for (let _k = 0; _k < _this.shots.length; _k++) {
			let _t = _this.shots[_k];
			if (!_t._shot_alive) {continue;}
			//自機より後ろは無視する。
			if (_e.x < _this.player.x) {continue;}
			let _s = _GAME.isSqCollision(
				"-10,-10," + (_t.img.width + 10) + "," + (_t.img.height + 10),
				_t.x + "," + _t.y,
				_e.shotColMap,
				_e.x + "," + _e.y
			);
			if (_s === _IS_SQ_NOTCOL) {continue;}
			if (_s === _IS_SQ_COL_NONE) {
				_t.isCollision = true;
				continue;
			}
			if (_e.isalive()) {
				_e.collision(_PARTS_PLAYERMAIN._shot_type_def.NORMAL);
				_t.isCollision = true;
			}
		} //for
	}
	map_collition(_t) {
		//MAPの位置を取得
		let _map_x = _MAP.getMapX(_t.x + (_t.img.width / 2));
		let _map_y = _MAP.getMapY(_t.y + (_t.img.height / 2));

		if (_MAP.isMapCollision(_map_x, _map_y)) {
			//ショットを初期化
			_t._init();
			//MAPの衝突処理
			_MAP.setPlayersShotAbleCollision(_map_x, _map_y);
			return;
		}
		if (_MAP.isMapCollision(_map_x + 1, _map_y)) {
			//ショットを初期化
			_t._init();
			//MAPの衝突処理
			_MAP.setPlayersShotAbleCollision(_map_x + 1, _map_y);
		}

	}
	setDrawImage(){
		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];
			if(!_t._shot_alive){continue;}
			_GAME._setDrawImage({
				img: _CANVAS_IMGS['shots'].obj,
				x: _t.x,
				y: _t.y,
				imgPosx: [0],
				width: this._width,
				height: this._height,
				basePoint: 1
			});
		}
	}
	move(){
		let _p=this.player;
		if(!_p.isalive()){return;}
		if(_p.x===undefined){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();
		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}
			let _s=this.speed;
			//撃ち始めは自機位置から放つ
			_t.x=(!_t._shot_alive)?_pl._x:_t.x+_s;
			_t.y=(!_t._shot_alive)?_pl._y-(_t.img.height/2):_t.y;
			_t.y=_MAP.getShotY(_t.y);

			if(_GAME.isShotCanvasOut(_t)){
				_t._init();
				continue;
			}
			_t._shot_alive=true;
		}
	}
}

class GameObject_SHOTS_DOUBLE
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		let _this=this;
		_this.shots=new Array();
		_this._width = 25;
		_this._height = 25;

		//ショット1とショット2の画像と、ショット時のx,yの挙動を定義
		//それらをshotsメンバーに定義させる
		//_sa:ショット中の判別（true,false）
		//_pl._x→ショット開始時は自機から発射
		//_x→ショット中で、その時点のx,yから移動させる
		_this.set = _p.set || {
			speedx: [30, 30],
			speedy: [0, 23],	
			imgPosx: [[0],[60]],
			setX: [
				((_sa, _pl, _t)=>{return (!_sa) ? _pl._x + (this._width/2) : _t.x + _t._set_speedX;}),
				((_sa, _pl, _t)=>{return (!_sa) ? _pl._x + (this._width/2) : _t.x + _t._set_speedX;})
			],
			setY: [
				((_sa, _pl, _t)=>{return (!_sa) ? _pl._y - (this._height/2) : _t.y;}),
				((_sa, _pl, _t)=>{return (!_sa) ? _pl._y - _t._set_speedY - (this._height/2): _t.y - _t._set_speedY;})
			],
			mapCol:[
				((_t)=>{
					let _gs = this.getShotCenterPosition(_t)
					for (let _i = _gs.x; _i < _gs.x + 30; _i = _i + 5) {
						//MAPの位置を取得
						if (_MAP.isMapCollision(_MAP.getMapX(_i), _MAP.getMapY(_gs.y))) {
							//ショットを初期化
							_t._init();
							//MAPの衝突処理
							_MAP.setPlayersShotAbleCollision(_MAP.getMapX(_i), _MAP.getMapY(_gs.y));
						}
					}//_i
				}),
				((_t)=>{
					let _gs = this.getShotCenterPosition(_t)
					for (let _i = _gs.x; _i < _gs.x + 30; _i = _i + 5) {
					for (let _j = _gs.y - 23; _j < _gs.y; _j = _j + 5) {
						//MAPの位置を取得
						if (_MAP.isMapCollision(_MAP.getMapX(_i), _MAP.getMapY(_j))) {
							//ショットを初期化
							_t._init();
							//MAPの衝突処理
							_MAP.setPlayersShotAbleCollision(_MAP.getMapX(_i), _MAP.getMapY(_j));
						}
					}//_j
					}//_i
				})
			]
		};

		for(let _i=0;_i<_PARTS_PLAYERMAIN._shot_max;_i++){
			_this.shots.push({
				sid:_PARTS_PLAYERMAIN._shot_type_def.DOUBLE,
				x:0,//処理変数：照射x軸
				y:0,
				imgPosx: _this.set.imgPosx[_i], //this.imgsからの画像
				isCollision: false,
				_setX:(_this.set.setX)[_i],
				_setY:(_this.set.setY)[_i],
				_set_speedX: (_this.set.speedx)[_i],
				_set_speedY: (_this.set.speedy)[_i],
				_mapCol:(_this.set.mapCol)[_i],
				_audio:_CANVAS_AUDIOS['shot_normal'],				
				_enemyid:null,//敵ID
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this.isCollision=false,
					this._enemyid=null,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}
	}
	getShotCenterPosition(_t){
		return {
			x: parseInt(_t.x + (this._width / 2)),
			y: parseInt(_t.y + (this._height / 2))
			}
	}
	enemy_collision(_e){//敵への当たり処理
		let _this=this;
		if(!_this.player.isalive()){return;}

		for(let _k=0;_k<_this.shots.length;_k++){
			let _t=_this.shots[_k];
			if (!_t._shot_alive) {continue;}
			let _s=_GAME.isSqCollision(
				"-10,-10,"+(_this._width+10)+","+(_this._height+10),
				_t.x+","+_t.y,
				_e.shotColMap,
				_e.x+","+_e.y
			);
			
			if(_s===_IS_SQ_NOTCOL){continue;}
			if(_s===_IS_SQ_COL_NONE){
				_t.isCollision = true;
				continue;
			}
			if(_e.isalive()){
				//硬い敵に対して、
				//同時ショット判定を避ける
				_e.collision(_PARTS_PLAYERMAIN._shot_type_def.DOUBLE);
				_t.isCollision = true;
			}
		}
	}
	map_collition(_t) {
		_t._mapCol(_t);
	}
	setDrawImage(){
		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];
			if(!_t._shot_alive){continue;}
			_GAME._setDrawImage({
				img: _CANVAS_IMGS['shots'].obj,
				x: _t.x,
				y: _t.y,
				imgPosx: this.set.imgPosx[_j],
				width: this._width,
				height: this._height,
				basePoint: 1
			});
		}
	}
	move(){
		let _p=this.player;
		if(!_p.isalive()){return;}
		if(_p.x===undefined){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();
		//ここでは各要素にショット権限を与え、
		//各弾に対して、敵に弾を当てた、
		//あるいは画面からはみ出た時に、
		//_shot_aliveをfalseにする。

		//0番目の要素は直線
		//1番目の要素は右上
		let _s=this.shots[0]._shot|
					this.shots[1]._shot;
		let _sa=this.shots[0]._shot_alive|
					this.shots[1]._shot_alive;
		if(!_s&&!_sa){return;}
		if(_s&&!_sa){
			//ショット打ち始め
			this.shots[0]._shot_alive=true;
			this.shots[1]._shot_alive=true;
		}
		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];

			if(!_t._shot_alive){continue;}
			_t.x = _t._setX(_sa, _pl, _t);
			_t.y = _t._setY(_sa, _pl, _t);
			_t.y=_MAP.getShotY(_t.y);			
			
			if(_GAME.isShotCanvasOut(_t)){
				_t._init();
				continue;
			}

			_t._shot_alive=true;
		}
	}
}

class GameObject_SHOTS_TAILGUN
			extends GameObject_SHOTS_DOUBLE{
	constructor(_p){
		//親クラスに渡す前に画像、ショット挙動を上書きさせる
		_p.set = {
			speedx: [30, 30],
			speedy: [0, 0],
			imgPosx: [[0],[30]],
			setX: [
				((_sa, _pl, _t)=>{return (!_sa) ? _pl._x : _t.x + _t._set_speedX;}),
				((_sa, _pl, _t)=>{return (!_sa) ? _pl._x : _t.x - _t._set_speedX;})
			],
			setY: [
				((_sa, _pl, _t)=>{return (!_sa) ? _pl._y - (this._width/2): _t.y;}),
				((_sa, _pl, _t)=>{return (!_sa) ? _pl._y - (this._height/2): _t.y;})
			],
			mapCol:[
				((_t)=>{
					let _gs = this.getShotCenterPosition(_t)
					for (let _i = _gs.x; _i < _gs.x + _t._set_speedX; _i = _i + 5) {
						//MAPの位置を取得
						if (_MAP.isMapCollision(_MAP.getMapX(_i), _MAP.getMapY(_gs.y))) {
							//ショットを初期化
							_t._init();
							//MAPの衝突処理
							_MAP.setPlayersShotAbleCollision(_MAP.getMapX(_i), _MAP.getMapY(_gs.y));
						}
					}//_i
				}),
				((_t)=>{
					let _gs = this.getShotCenterPosition(_t)
					for (let _i = _gs.x; _i < _gs.x + _t._set_speedX; _i = _i + 5) {
						//MAPの位置を取得
						if (_MAP.isMapCollision(_MAP.getMapX(_i), _MAP.getMapY(_gs.y))) {
							//ショットを初期化
							_t._init();
							//MAPの衝突処理
							_MAP.setPlayersShotAbleCollision(_MAP.getMapX(_i), _MAP.getMapY(_gs.y));
						}
					} //_i
				})
			]
		};
		super(_p);
	}
}

class GameObject_SHOTS_RIPPLE_LASER
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		this.speed=30;
		this.lineWidth_1=3;
		this.strokeStyle_1="rgba(40,70,255,1)";
		this.lineWidth_2=4;
		this.strokeStyle_2="rgba(100,180,255,0.7)";

		for(let _i=0;_i<_PARTS_PLAYERMAIN._shot_max;_i++){
			this.shots.push({
				sid:_PARTS_PLAYERMAIN._shot_type_def.LASER,
				x:0,//処理変数：X位置の中心点
				y:0,//処理変数：Y位置の中心点
				isCollision:false,
				_t:0,//アニメーション時間ripple
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_width:0,//rippleの横幅
				_height:0,//rippleの縦幅
				_audio:_CANVAS_AUDIOS['shot_ripple'],
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this.isCollision = false,
					this._t=0,
					this._shot=false,
					this._shot_alive=false,
					this._width=0,
					this._height=0
				}
			});
		}
	}
	enemy_collision(_e){
		if(!this.player.isalive()){return;}
		for(let _k=0;_k<this.shots.length;_k++){
			let _t=this.shots[_k];
//			console.log('_kk:'+_k);
			if(!_t._shot_alive){continue;}
			//衝突を無視
			if(_e.isIgnoreCollision()){continue;}

			let _s=_GAME.isSqCollision(
					"0,-20,"+(_t._width)+","+(_t._height*2+20),
					_t.x+","+(_t.y-_t._height),
					_e.shotColMap,
					_e.x+","+_e.y
				);
			if(_s===_IS_SQ_NOTCOL){continue;}
			if(_s===_IS_SQ_COL){
				_e.collision(_PARTS_PLAYERMAIN._shot_type_def.RIPPLE_LASER);
				(function(){
					//RIPPLELASERでは、当たり判定後、
					//画面内の全ての敵を参照し、
					//RIPPLE範囲内の敵も当たり判定とみなす。
					let _ens=_PARTS_ENEMIES._get_enemies();
					for(let _i=0;_i<_ens.length;_i++){
					let _en=_ens[_i];
					//スタンバイは無視
					if(_en.isStandBy()){continue;}
					//敵自体無視
					if(_en.isIgnore()){continue;}
					//既に倒した敵は無視する
					if(!_en.isalive()){continue;}
					//非表示は無視する
					if(!_en.isshow()){continue;}
					//衝突を無視
					if(_en.isIgnoreCollision()){continue;}

					let _s1=_GAME.isSqCollision(
						"0,0,"+(_t._width)+","+(_t._height*2),
						_t.x+","+(_t.y-_t._height),
						_en.shotColMap,
						_en.x+","+_en.y
					);
					if(_s1===_IS_SQ_COL){
						_en.collision(_PARTS_PLAYERMAIN._shot_type_def.RIPPLE_LASER);						
					}
		
					}//for
				})();
			}
			_t.isCollision = true;
		}
	}
	map_collition(_t){
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_t.x);
		let _map_y=_MAP.getMapY(_t.y);

		if(_MAP.isMapCollision(_map_x,_map_y)
			||_MAP.isMapCollision(_map_x+1,_map_y)){
			//ショットを初期化
			//MAPの衝突処理
			// console.log('a:'+_map_y);
			// console.log('c:'+_t._height);
			let _range=parseInt(_t._height/_MAP.t/2);
//			console.log('b:'+_map_y+parseInt(_t._height/_MAP.t));
			for(let _i=_map_y-_range;_i<=_map_y+_range;_i++){
				if(_MAP.isMapCollision(_map_x+1,_i)){
					_MAP.setPlayersShotAbleCollision(_map_x+1,_i);
				}
			}
			_t._init();
		}

	}
	setDrawImage(){
		let _this=this;
		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot_alive){continue;}
			_CONTEXT.beginPath();
			_CONTEXT.lineWidth=_this.lineWidth_2;
	        _CONTEXT.strokeStyle=_this.strokeStyle_2;
			_CONTEXT.ellipse(
				_t.x+1,
				_t.y+1,
				_t._width,
				_t._height,
				0,0,2*Math.PI);
			_CONTEXT.stroke();

			_CONTEXT.beginPath();
			_CONTEXT.lineWidth=_this.lineWidth_1;
	        _CONTEXT.strokeStyle=_this.strokeStyle_1;
			_CONTEXT.ellipse(
				_t.x,
				_t.y,
				_t._width,
				_t._height,
				0,0,2*Math.PI);
			_CONTEXT.stroke();			
		}
	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(_p.x===undefined){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();

		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}

			let _s=_this.speed;
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				return (!_t._shot_alive)?_pl._x:_i+_s;
			})(_t.x);
			_t.y=(function(_i){
				return (!_t._shot_alive)?_pl._y:_i;
			})(_t.y);
			_t.y=_MAP.getShotY(_t.y);			
			
			if(_GAME.isShotCanvasOut(_t)){
				_t._init();
				continue;
			}

			_t._t=(_t._t<20)?_t._t+1:_t._t;
			_t._width=0.4+_t._t;
			_t._height=8+(_t._t*_t._t/6);

			_t._shot_alive=true;
		}
	}
}

class GameObject_SHOTS_RIPPLE_LASER_RED
			extends GameObject_SHOTS_RIPPLE_LASER{
	constructor(_p){
		super(_p);
		this.strokeStyle_1="rgba(255,80,50,1)";
		this.strokeStyle_2="rgba(255,180,100,0.7)";
	}
}

class GameObject_SHOTS_LASER
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		let _this=this;
		_this.shots=new Array();
		_this.speed=40;
		_this.lineWidth=2;
		_this.strokeStyle="rgba(50,80,255,1)";
		_this.strokeStyle_u="rgba(120,150,255,1)";

		_this.img_col=_CANVAS_IMGS['shot_laser_col'].obj;
		_this.imgsize_col=_this.img_col.height;
		_this.width_col=_this.imgsize_col;
		_this.height_col=_this.imgsize_col;
		_this.img_col_ani=[0,25];

		for(let _i=0;_i<1;_i++){
			_this.shots.push({
				sid:_PARTS_PLAYERMAIN._shot_type_def.LASER,
				x:0,//処理変数：レーザー右端x
				sx:0,//処理変数：レーザー左端x
				y:0,
				_c_col:0,//アニメーションカウント衝突
				laser_time:600,//定義：照射時間（照射終了共通）
				_enemy:null,//レーザーに衝突した敵のオブジェクト
				_laser_t:0,//処理変数：照射時間
				_laser_ts:0,//処理変数：照射終了後時間
				_laser_MaxX:_CANVAS.width,
						//処理変数レーザー最大右端
				_laser_col_max:null,//処理変数 右端衝突位置
						//enemy_collision時に最大右端位置を設定する
				_l_x:0,//処理変数：レーザー右端移動量
				_l_sx:0,//処理変数：レーザー左端移動量
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_audio:_CANVAS_AUDIOS['shot_laser'],//ショット音LASER		
				_init:function(){//初期化
					this.x=0,
					this.sx=0,
					this.y=0,
					this._c_col=0,
					this._laser_t=0,
					this._laser_ts=0,
					this._enemy=null,
					this._l_x=0,//処理変数：レーザー右端x
					this._l_sx=0,//処理変数：レーザー左端x
					this._laser_MaxX=_CANVAS.width,
					this._laser_col_max=null,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}
	}
	set_laser_col_max(_v){
		//衝突判定にてレーザーの最大右端を設定する
		let _this=this;
		if (_v === undefined || _v === null) {
			//衝突していないのでスルー
			return;
		}
		for (let _k = 0; _k < _this.shots.length; _k++) {
			let _t = _this.shots[_k];
			_t._laser_col_max=
				(_t._laser_col_max<_v|| _t._laser_col_max === null)
					? _v
					: _t._laser_col_max
		}
	}
	laser_collision(_t,_v){
		let _this=this;
		if(_t._laser_MaxX>=_CANVAS.width){return;}
		_t._c_col=(_t._c_col>=_this.img_col_ani.length-1)?0:_t._c_col+1;

		_GAME._setDrawImage({
			img: _this.img_col,
			imgPosx: _this.img_col_ani[_t._c_col],
			x: _t._laser_MaxX - _this.width_col,
			y: _t.y - (_this.img_col.height / 2),
			width: _this.imgsize_col,
			height: _this.imgsize_col,
			basePoint: 1
		});
	}
	enemy_collision(_e){
		let _this=this;
		//敵数分ループ
		//return:衝突時→衝突時のx値
		//		:null 衝突していない
		let _s=null;
		for(let _k=0;_k<this.shots.length;_k++){
		//自機より後ろの敵は無視する。
		if(_e.x+_e.width<this.player.x){continue;}		
		let _t=this.shots[_k];
//		console.log('count');
		if(!_t._shot_alive){continue;}
		//		console.log('sx'+_t._l_sx);

		//当たり判定
		_s=_GAME.isSqCollision_laser(
			"0,-10,"+parseInt(_t.x-_t.sx)+",10",
			_t.sx+","+_t.y,
			_e.shotColMap,
			_e.x+","+_e.y
			);
		//当たり判定がなければこの段階でnullを返す
		if(_s.ret===_IS_SQ_NOTCOL){return null;}

		//移動量の取得
		let _sl=(_t.x-_t.sx<this.speed)
				?(_t.x-_t.sx):this.speed;
		if(_sl<=0){return null;}//_sl値はthis.speed以下
		//移動分以外の判定処理
		if(_e.x<_t.x-_sl){
			if(_e.is_collision_player_init){_t._init();}
			if(_s.ret===_IS_SQ_COL_NONE){return _s.val;}
			_e.collision(_PARTS_PLAYERMAIN._shot_type_def.LASER);
			if(!_e.isalive()){return _t._laser_MaxX+_this.speed;}
			return _s.val;
		}
		//移動分内、細かく当たり判定を処理させる
		for(let _i=_t.x-_sl;_i<=_t.x;_i=_i+5){
			_s=_GAME.isSqCollision_laser(
				"0,-10,"+parseInt(_i-_t.sx)+",10",
				_t.sx+","+_t.y,
				_e.shotColMap,
				_e.x+","+_e.y
				);
			if(_s.ret===_IS_SQ_NOTCOL){continue;}
			if(_e.is_collision_player_init){_t._init();}
			if(_s.ret===_IS_SQ_COL_NONE){return _s.val;}
			_e.collision(_PARTS_PLAYERMAIN._shot_type_def.LASER);
			if(!_e.isalive()){return _t._laser_MaxX+_this.speed;}
			return _s.val;
		}
		}//_k
		return null;
	}
	map_collition(_t){
		let _this=this;
		if(!_t._shot_alive){return;}

		let _map_x=_MAP.getMapX(_t.x);
		let _map_y=_MAP.getMapY(_t.y);
		//先端の衝突を表示させる判定
		for(let _i=_t.x-_this.speed;_i<=_t.x;_i=_i+5){
//			console.log(_i)
			//this.speed分ループさせて衝突した場所を決定させる。
			if(_MAP.isMapCollision(_MAP.getMapX(_i),_map_y)){
				_this.setLaserMaxX(_t,_i);
				break;
			}
		}
		//レーザー照射内にて、当たり判定のある壁は壊す処理
		let _map_sx=_MAP.getMapX(_t.sx);
		for(let _i=_map_sx+1;_i<=_map_x;_i++){
			if(_MAP.isMapCollision(_i,_map_y)){
				_MAP.setPlayersShotAbleCollision(_i,_map_y,_PARTS_PLAYERMAIN._shot_type_def.LASER);
			}
		}
	}
	setLaserLine(_t,_l_x,_l_sx){
		_t.x=_l_x;
		_t.sx=_l_sx;
	}
	setLaserMaxX(_t,_v){
		//衝突判定が発生した場合、
		//レーザーの先端位置を設定する。
		let _this=this;
		_t._laser_MaxX = (_v>_CANVAS.width)?_CANVAS.width:_v;
	}
	setDrawImage(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();
		let _px=_pl._x;

		_CONTEXT.lineWidth=_this.lineWidth;
		_CONTEXT.strokeStyle=_this.strokeStyle;
		_CONTEXT.lineCap='round';

		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot_alive){continue;}
			//小粒のレーザーは無視
			if(_t.x<_t.sx||Math.abs(_t.x-_t.sx)<20){continue;}
			
			_CONTEXT.beginPath();
			_CONTEXT.strokeStyle=_this.strokeStyle_u;
			_CONTEXT.moveTo(_t.sx,_pl._y+1);
			_CONTEXT.lineTo(_t.x,_pl._y+1);
			_CONTEXT.stroke();

			_CONTEXT.beginPath();
			_CONTEXT.strokeStyle=_this.strokeStyle;
			_CONTEXT.moveTo(_t.sx,_pl._y);
			_CONTEXT.lineTo(_t.x,_pl._y);
			_CONTEXT.stroke();

			_this.moveDrawLaser(_t.x,_t.sx,_t.y);
			_this.laser_collision(_t);

		}
	}
	moveDrawLaser(_x,_sx,_y){}//レーザーの描画からさらに追加する場合
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(_p.x===undefined){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();
		let _px=_pl._x;

		//自機のショット状態を取得
		//ショットの描画(１つのみ)
		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}

//			console.log(_t._laser_MaxX);
			//照射開始位置は、自機またはオプションの
			//中心座標からとする。
			_t._l_x=((_i)=>{
				//照射開始
				_i+=_this.speed;
				//衝突・または画面右端に達した場合
	  			if(_i>=_t._laser_MaxX-_pl._x){
					//レーザーが右端に届いた時
					_t._laser_t+=(1000/_FPS);
//					console.log('a');
					return _t._laser_MaxX-_pl._x;
				}
//				console.log('b=========:'+(_i+_this.speed));
				return _i;
			})(_t._l_x);

//			console.log(_t.x)
			_t._l_sx=((_i)=>{
				//照射終了
				if(!_t._shot){
					//ショットを離した時
					if(_i>=_t._l_x){
						//照射が終わり切った時
						_t._init();
						return 0;
					}
					return _i+=_this.speed;
				}

				if(_t._laser_t<=_t.laser_time-200){return _i;}
				//時間経過後に、照射終了カウント開始
				_t._laser_ts+=(1000/_FPS);
				//照射時間に達するまで照射を続ける
				if(_t._laser_ts>_t.laser_time-200){
					//照射が終わり切った時
					_t._init();
					return 0;
				}
				if(_i>=_t._l_x){return _t._l_x;}
				return _i+=_this.speed;
			})(_t._l_sx);
			_t.y=_pl._y;

			_this.setLaserLine(_t,_px+_t._l_x,_px+_t._l_sx);

			if(_t._l_x>0){_t._shot_alive=true;}

		}

	}
}

class GameObject_SHOTS_LASER_CYCLONE
			extends GameObject_SHOTS_LASER{
	constructor(_p){
		super(_p);
		let _this=this;
		_this.lineWidth=5;
		_this.strokeStyle="rgba(255,80,50,1)";
		_this.strokeStyle_u="rgba(255,200,150,1)";
		_this.img_col_ani=[50,75];
	}
	moveDrawLaser(_x,_sx,_y){
		let _this=this;
		for(let _i=_sx;_i<_x;_i=_i+20){
			_CONTEXT.beginPath();
			_CONTEXT.lineCap='round';
			_CONTEXT.lineWidth=3;
			_CONTEXT.strokeStyle='rgba(100,20,10,1)';
			_CONTEXT.moveTo(_i,_y-1);
			_CONTEXT.lineTo(_i-_this.lineWidth,_y+2);
			_CONTEXT.stroke();	
		}
	}
}
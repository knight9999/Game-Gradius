//=====================================================
//	gradius_parts_enemy_bosses.js
//	ボスの定義
//	2018.04.22 : 新規作成
//=====================================================
'use strict';

//========================================
//　ボス クラス
//	_o:ボス画像オブジェクト
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//
//	_c:自爆までのカウント数
//	is_able_collision:最初は衝突無効
//
//	ステータスは以下の順番で実行させる
//	move_before：ボス登場前に敵を倒すシーン
//	move_standby：ボスが登場する直前まで
//	move_Allset：ボスが登場して自機へ攻撃する直前まで
//	move：ボスが自機へ攻撃する状態
//========================================
class GameObject_ENEMY_BOSS
		extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_p.img,
			x:_p.x,
			y:_p.y,
			width:_p.width||_p.img.width,
			height:_p.height||_p.img.height,
			imgPos:_p.imgPos,
			aniItv: _p.aniItv,
		});
		let _this=this;
		_this.speed=0;
		_this.getscore=10000;
		_this._c_self_collision=4000;//アニメーションカウントを使って、自爆までのカウント
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision6'];
		_this.audio_background=_CANVAS_AUDIOS['bg_boss'];
		_this.is_able_collision=false;//衝突可能フラグ
		_this._collision_type = 't9';//爆発タイプ

		_this._count=0;

		//スタンバイ完了後ショット自機を攻撃する準備完了フラグ
		_this.is_all_set=false;
	}
	shot(){}
	setSelfCollision(){
		//アニメーションカウントを用いて自爆処理
		let _this=this;
		if(_this._count<_this._c_self_collision){return;}
		//アニ_ignore_collisionトを用いて自爆処理
		//_ENEMIESの全てのステータスを0にする。
		let _e = _PARTS_ENEMIES._get_enemies();
		for(let _i=0;_i<_e.length;_i++){
			_e[_i]._status=0;
		}
		_this.showCollapes();
		_GAME_AUDIO._setPlay(_this.audio_collision);
	}
	move_Allset() {}
	isAllset(){
		let _this=this;
		if(_this.is_all_set){return true;}
		_this.move_Allset();
		return false;
	}
	isMove(){
		let _this=this;
		//move()判定処理
		//以下false（moveしない）
		//・スタンバイ中
		//・生存しない
		if(_this.isStandBy()){
			_this.move_standby();
			return false;
		}
		if(!_this.isshow()){
			return false;
		}
		if(!_this.isalive()){
			return false;
		}
		return true;
	}
//	move_before(){return false;}
	move(){
		//敵の処理メイン
		//原則継承はしない
		let _this=this;
//		console.log(_this._status)
		_this.x=_MAP.getX(_this.x);
		_this.y=_MAP.getY(_this.y);
		_this.setSelfCollision();

		if(!_this.isMove()){return;}
		if(!_this.isAllset()){return;}
		_this.moveSet();
		_this.shot();
		_this._count++;
	}
}
//========================================
//　ボス 壁クラス
//	moveDraw()を使って表示させる
//	ボスオブジェクトを利用して、ボスの左上座標を起点に、
//	相対的に_x,_yで配置を調整できる
//	ボスオブジェクトが存在しない場合は、
//	CANVASを起点とした座標で処理する。
//	_o:ボス壁画像オブジェクト
//	_o_boss:ボスオブジェクト
//	_x:ボス壁の初期x位置
//	_y:ボス壁の初期y位置
//========================================
class ENEMY_BOSS_WALL
	extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_p.img,
			x:_p.x,
			y:_p.y,
			width:_p.width,
			height:_p.height
		});
		let _this=this;

		_this._initx=_p.x||0;//初期位置x
		_this._inity=_p.y||0;//初期位置y
		_this._boss=_p.boss;
		_this.x=_this._boss.x+_this._initx;//初期位置x
		_this.y=_this._boss.y+_this._inity;//初期位置y
		_this._status = 8;
		_this._standby = false;
		_this.getscore=500;//倒した時のスコア
		_this.is_able_collision=false;
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision5'];

		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER = 0.5;
	}
	set_able_collision(){
		this.is_able_collision = true;
	}
	move(){
		let _this=this;
		let x=(_this._boss===undefined)?0:_this._boss.x;
		let y=(_this._boss===undefined)?0:_this._boss.y;
		
		_this.x=x+parseInt(_this._initx);
		_this.y=y+parseInt(_this._inity);
	}
}


//====================
//　ボス ビックコア
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//====================
class ENEMY_BOSS_BIGCORE
			extends GameObject_ENEMY_BOSS{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_bigcore'].obj,
			x:_p.x,
			y:_p.y
		});
		let _this=this;
		_this._status=1;
		_this.speed=3;
		_this.is_able_collision=false;

		_this.wall=[];
		_this._wall_statuses='';

		_this._moveYStop=false;

		_this.shotColMap=[
			"120,0,169,40,false",
			"120,70,169,114,false"
		];

	}
	show_walls(){
		let _this=this;		
		_this.wall.map((_o, _i, _ar) => {
			if (_ar[_i - 1] === undefined || _ar[_i - 1]._status <= 0) {
				//直前の壁が破壊されない間、
				//自身のダメージは不可。
				_o.is_able_collision = true;
			}
		});
	}
	shot(){
		let _this=this;
		//ショット
		//カウント150で1周
		if (_this._count % 100 === 0) { //自機動かす
			_this._moveYStop = false;
		}
		if (_this._count % 100 > 80 && _this._count % 100 < 99) { //自機止める
			_this._moveYStop = true;
		}
		if (_this._count % 100 === 80) {
			for(let _i=0;_i<=105;_i=_i+35){
			_PARTS_ENEMY_SHOT._add_shot(
				new ENEMY_SHOT_LASER({
					x: _this.x,
					y: _this.y+_i,
					img: _CANVAS_IMGS['enemy_bullet_z'].obj,
					width: 45,
					imgPos:[0]
				}));
			}
			_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['enemy_bullet_laser']);		
		}

	}
	move_Allset(){
		let _this=this;
		_this.x-=4;

		if(_this.x<_CANVAS.width-_this.img.width-80){
			_this.is_all_set=true;
		}
	}
	move_standby(){
		//スタンバイ状態
		let _this=this;
		if(_this.wall.length===0){
			_this.wall=[
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_1'].obj,boss:_this,x:15,y:51}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_1'].obj,boss:_this,x:25,y:51}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_1'].obj,boss:_this,x:35,y:51}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_2'].obj,boss:_this,x:45,y:53}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_core'].obj,boss:_this,x:70,y:43,width:30,height:30})
			];
			//壁の初期化
			_this.wall.map((_o)=>{_PARTS_ENEMIES._add_enemies(_o);})
		}

	 	_this._standby=false;
	}
	moveSet(){
		let _this=this;
		_this.show_walls();
		_this.y+=(_this._moveYStop)?0:_this.speed;
		_this.speed=(_this.y<50
						||_this.y+_this.img.height>450)
						?_this.speed*-1
						:_this.speed;

		_this.shot();

		if(_this.wall.every((_v)=>{return !_v.isalive();})){
			//全ての壁が壊れたら敵全部のステータスを0にする。
			_this._status=0;
			_this.setAlive();
		}

		//自爆準備
		// if(_this._count>=3000){
		// 	let _ec=_this.getEnemyCenterPosition();
		// 	//ショットを無効にする
		// 	_this.is_able_collision=false;
		// 	_this.c_z4_ani=(_this.c_z4_ani>0)
		// 			?_this.c_z4_ani-1
		// 			:0;
		// 	let _img=_this.z4_ani[parseInt(_this.c_z4_ani/6)].img;
		// 	_CONTEXT.drawImage(
		// 		_img,
		// 		_ec._x-(_img.width/2),
		// 		_ec._y-(_img.height/2),
		// 		_img.width,
		// 		_img.height
		// 	);

		// }
	}
}


//========================================
//　ボス ビックコアマーク2
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//	_cで0〜150単位で動く
//	_cが4000に達したら自爆
//	  50〜99：止める
//	  51：両腕を広げる
//	  70：ショットを放つ
//	  110：両腕を閉じる
//========================================
class ENEMY_BOSS_BIGCORE2
			extends GameObject_ENEMY_BOSS{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_bigcore2'].obj,
			x:_p.x,
			y:_p.y
		});
		let _this=this;
		_this.speed=0;
		_this.speed_mount=2;
		_this.is_able_collision=false;
		_this.wall_up = [];//上の壁
		_this.wall_down = [];//下の壁
		_this.hands_up = []; //上の手
		_this.hands_down = []; //下の手

		//噴射画像定義
		_this.back=[0,85,170,255,340,425];
		//噴射画像の表示定義（上）
		//3はアニメーションインターバル
		_this.back_img_up={
			//x:x座標
			//y:y座標
			//st:噴射画像表示させる要素番号
			//flag:噴射画像要素を往復させるためのフラグ
			x:200,y:-50,st:0,flag:true,
			s1:function(){
				//移動中の噴射
				if(this.st>=5*3){this.flag=false;}
				if(this.st<=2*3){this.flag=true;}
				this.st=(this.flag)?this.st+1:this.st-1;
			},
			s2:function(){
				//停止中の噴射
				if(this.st>=2*3){this.flag=false;}
				if(this.st<=0*3){this.flag=true;}
				this.st=(this.flag)?this.st+1:this.st-1;
			},
			f:function(){
				let img=_CANVAS_IMGS['enemy_bigcore2_back'].obj;
//				let img=_this.back[parseInt(this.st/3)].img;
				let _s=img.height;//サイズ
				let _w=85;//幅
				let _h=img.height;//高さ

				_GAME._setDrawImage({
					img: img,
					x: _this.x + this.x,
					y: _this.y + this.y,
					imgPosx: parseInt(this.st / 3) * _w,
					width: _w,
					height: _h,
					basePoint: 1
				});
			}
		};
		//噴射画像の表示定義（下）
		_this.back_img_down={
			x:200,y:30,st:0,flag:true,
			s1:function(){
				if(this.st>=5*3){this.flag=false;}
				if(this.st<=2*3){this.flag=true;}
				this.st=(this.flag)?this.st+1:this.st-1;
			},
			s2:function(){
				if(this.st>=2*3){this.flag=false;}
				if(this.st<=0){this.flag=true;}
				this.st=(this.flag)?this.st+1:this.st-1;
			},
			f:function(){
				let img=_CANVAS_IMGS['enemy_bigcore2_back'].obj;
//				let img=_this.back[parseInt(this.st/3)].img;
				let _s=img.height;//サイズ
				let _w=85;//幅
				let _h=img.height;//高さ
				_GAME._setDrawImage({
					img: img,
					x: _this.x + this.x,
					y: _this.y + this.y + img.height,
					imgPosx: parseInt(this.st / 3) * _w,
					width: _w,
					height: _h,
					direct: _DEF_DIR._U,
					basePoint: 1
				});
			}
		};

		_this.tid=null;
		_this._moveYStop=false;

		_this.shotColMap=["130,0,240,156,false"];
		_this._collision_type='t9';

		_this._hands_open_flag=false;
	}
	shot(){
		//ショット
		//カウント150で1周
		let _this=this;
		let _ec=_this.getEnemyCenterPosition();
		let _pc=_PARTS_PLAYERMAIN._players_obj.getPlayerCenterPosition();

		if(_this._count%150===0){//自機動かす
			_this._moveYStop=false;		
		}
		if(_this._count%150>50&&_this._count%150<99){//自機止める
			_this._moveYStop=true;
		}
		if(_this._count%150===51){
			_this._hands_open_flag=(Math.abs(_pc._y-_ec._y)<100);
//			console.log(_this._hands_open_flag)
			if(_this._hands_open_flag){
				//腕を開く
				_this.hands_up.reverse().map((_o)=>{_o.isHandsOpen=true;});//上を表示
				_this.hands_down.reverse().map((_o)=>{_o.isHandsOpen=true;});//下を表示
			}
		}
		if(_this._count%150===70){
			//止まってショットを放つ
//			console.log(_this._hands_open_flag)
			let _ar=[];
			if(_this._hands_open_flag){
				if(_this.wall_up.some((_v)=>{return _v.isalive();})){
					_ar=_ar.concat([
						{x: 85,y: -75},
						{x: 70,y: -45},
						{x: 120,y: -20},
						{x: 100,y: 0},
						{x: 80,y: 25},
						{x: 60,y: 45},
						{x: 0,y: 55}
					]);
				}
				if(_this.wall_down.some((_v)=>{return _v.isalive();})){
					//下の壁が全て破壊されたらショットしない
					_ar=_ar.concat([{x: 0,y: 85},
						{x: 60,y: 95},
						{x: 80,y: 115},
						{x: 100,y: 135},
						{x: 120,y: 160},
						{x: 70,y: 170},
						{x: 85,y: 200}
					]);
				}
			}else{
				if(_this.wall_up.some((_v)=>{return _v.isalive();})){
					_ar=_ar.concat([
						{x: 60,y: 20},
						{x: 0,y: 55}
					]);
				}
				if(_this.wall_down.some((_v)=>{return _v.isalive();})){
					_ar=_ar.concat([
						{x: 0,y: 95},
						{x: 60,y: 130}
					]);
				}
			}

			for (let _i = 0; _i < _ar.length; _i++) {
				_PARTS_ENEMY_SHOT._add_shot(new ENEMY_SHOT_LASER({
					x: _this.x + _ar[_i].x,
					y: _this.y + _ar[_i].y
				}));
			}
			_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['enemy_bullet_laser']);
		}
		if(_this._count%150===110){
			//開いた腕を閉じる			
			_this.hands_up.reverse().map((_o)=>{_o.isHandsClose=true;});//上を表示
			_this.hands_down.reverse().map((_o)=>{_o.isHandsClose=true;});//下を表示
		}
	}
	move_Allset(){
		let _this=this;
		_this.x-=4;
		//噴射を表示
		(_this.speed>0&&!_this._moveYStop)
			?_this.back_img_up.s1()
			:_this.back_img_up.s2();
		_this.back_img_up.f();

		(_this.speed<0&&!_this._moveYStop)
			?_this.back_img_down.s1()
			:_this.back_img_down.s2();
		_this.back_img_down.f();

		if(_this.x<_CANVAS.width-_this.img.width-80){
			_this.speed = 2;
			_this.is_all_set=true;
		}
	}
	move_standby(){
		//スタンバイ状態
		let _this=this;
		if (_this.wall_up.length === 0) {
			_this.wall_up=[
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:90,y:38}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:95,y:38}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:100,y:38}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:105,y:38}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_core'].obj,boss:_this,x:110,y:36})
			];
			_this.wall_up.map((_o)=>{_PARTS_ENEMIES._add_enemies(_o);})
		}
		if (_this.wall_down.length === 0) {
			_this.wall_down=[
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:90,y:95}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:95,y:95}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:100,y:95}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:105,y:95}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_core'].obj,boss:_this,x:110,y:93})
			];
			_this.wall_down.map((_o)=>{_PARTS_ENEMIES._add_enemies(_o);})
		}

		//上の手初期化
		if (_this.hands_up.length === 0) {
			_this.hands_up=[
				new ENEMY_BOSS_BIGCORE2_HANDS({"_initx":-52,"_inity":-30,"_dir":_DEF_DIR._U,"_boss":_this})
			];
			_PARTS_ENEMIES._add_enemies(_this.hands_up[0]);
		}	
		//下の手初期化
		if (_this.hands_down.length === 0) {
			_this.hands_down=[
				new ENEMY_BOSS_BIGCORE2_HANDS({"_initx":-52,"_inity":75,"_dir":_DEF_DIR._D,"_boss":_this})
			];
			_PARTS_ENEMIES._add_enemies(_this.hands_down[0]);
		}
		_this._standby=false;
		// }
	}
	show_walls(){
		let _this=this;
		//上の壁を表示
		_this.wall_up.map((_o,_i,_ar)=>{
			if(_ar[_i-1]===undefined||_ar[_i-1]._status<=0){
				//直前の壁が破壊されない間、
				//自身のダメージは不可。
				_o.is_able_collision=true;
			}
		});
		//下の壁を表示
		_this.wall_down.map((_o,_i,_ar)=>{
			if(_ar[_i-1]===undefined||_ar[_i-1]._status<=0){
				//直前の壁が破壊されない間、
				//自身のダメージは不可。
				_o.is_able_collision=true;
			}
		});	
	}
	moveSet(){
		let _this=this;

		//噴射を表示
		(_this.speed>0&&!_this._moveYStop)
			?_this.back_img_up.s1()
			:_this.back_img_up.s2();
		_this.back_img_up.f();

		(_this.speed<0&&!_this._moveYStop)
			?_this.back_img_down.s1()
			:_this.back_img_down.s2();
		_this.back_img_down.f();

		_this.show_walls();
			
		_this.y+=(_this._moveYStop)?0:_this.speed;
		_this.speed=(()=>{
			if (_this.y < 50){return _this.speed_mount;}
			if (_this.y + _this.img.height > 450){return _this.speed_mount * -1;}
			if (_this._count % 150 !== 0) {return _this.speed;}
			let _e_y=_this.getEnemyCenterPosition()._y;
			let _p_y=_PARTS_PLAYERMAIN._players_obj.getPlayerCenterPosition()._y;
			if(_e_y<_p_y){return _this.speed_mount;}
			if(_e_y>=_p_y){return _this.speed_mount*-1;}
		})();
//		_this.shot();

//		_this.set_wall_status();

		//上を表示
		_this.hands_up.reverse().map((_o)=>{
			//上の壁を全部壊したら、腕を動かさない。
			if(_this.wall_up.every((_v)=>{return !_v.isalive();})
				&&!_o.is_hand_stop()){
				_GAME_AUDIO._setPlay(_this.audio_collision);
				_o.set_hand_stop();
			}	
		});
		//下を表示
		_this.hands_down.reverse().map((_o)=>{
			//下の壁を全部壊したら、腕を動かさない。
			if(_this.wall_down.every((_v)=>{return !_v.isalive();})
				&&!_o.is_hand_stop()){
				_GAME_AUDIO._setPlay(_this.audio_collision);
				_o.set_hand_stop();
			}
		});

		if(_this.wall_up.every((_v)=>{return !_v.isalive();})
			&&_this.wall_down.every((_v)=>{return !_v.isalive();})
		){
			//全ての壁が壊れたら敵全部のステータスを0にする。
			_this.hands_up.reverse().map((_o)=>{_o._status=0;});
			_this.hands_down.reverse().map((_o)=>{_o._status=0;});
			_this._status=0;
			_this.setAlive();
		}

		//自爆準備
		// if(_this._count>=3000){
		// 	let _ec=_this.getEnemyCenterPosition();
		// 	//ショットを無効にする
		// 	_this.is_able_collision=false;
		// 	_this.c_z4_ani=(_this.c_z4_ani>0)
		// 			?_this.c_z4_ani-1
		// 			:0;
		// 	let _img=_this.z4_ani[parseInt(_this.c_z4_ani/6)].img;
		// 	_CONTEXT.drawImage(
		// 		_img,
		// 		_ec._x-(_img.width/2),
		// 		_ec._y-(_img.height/2),
		// 		_img.width,
		// 		_img.height
		// 	);

		// }

	}
}
//ビックコアマーク2の手定義
class ENEMY_BOSS_BIGCORE2_HANDS
	extends GameObject_ENEMY{
	constructor(_d){
		super({
			img:_CANVAS_IMGS['enemy_bigcore2_hand'].obj,
			x:_d._initx,
			y:_d._inity,
			imgPos:[0,250,500],
			aniItv:6
		});
		let _this=this;
		_this._initx=_d._initx||0;//初期位置x
		_this._inity=_d._inity||0;//初期位置y
		_this._boss = _d._boss;
		_this.x=_this._initx+_d._boss.x;
		_this.y=_this._inity+_d._boss.y;
		_this._standby=false;
		_this.is_able_collision=false;
		_this.width=250;

		//ここでは先端のオブジェクトだけ、
		//ショットさせる
		_this.isshot=(_d._img===undefined)?false:true;
		_this.isHandsOpen=false;
		_this.isHandsClose=false;
		_this.isstop=false;//true時、手を動かさない

		_this.direct=_d._dir||_DEF_DIR._U;

		_this.shotColMap=[//衝突判定（下の定義を使って動的に設定）
			(function(){
				if(_this.direct===_DEF_DIR._U){//上
					return "25,70,250,110,false","90,30,250,70,false";
				}
				if(_this.direct===_DEF_DIR._D){//下
					return "25,0,250,40,false","90,40,250,100,false";
				}
			})()
		]
		_this.shotColMapTmp=
			//手の衝突判定（定義）
			//手のイメージ定義の要素に合わせて、
			//衝突エリアを設定する。
			(function(){
			if(_this.direct===_DEF_DIR._U){//上
				return [["25,70,250,110,false","90,30,250,70,false"],
						["180,30,250,90,false"],
						["50,10,225,20,false"]
					];
			}
			if(_this.direct===_DEF_DIR._D){//下
				return [["25,0,250,40,false","90,40,250,100,false"],
						["180,20,250,60,false"],
						["50,90,225,100,false"]
					];
			}
			})();
//		_this.imgPos = [0, 250, 500]; //手のイメージ定義
//		_this.imgs=[0,250,500];//手のイメージ定義
		_this.imgsPos=[//手のイメージ定義
			{x:0,y:(_this.direct===_DEF_DIR._U)?0:0},
			{x:0,y:(_this.direct===_DEF_DIR._U)?-40:40},
			{x:-5,y:(_this.direct===_DEF_DIR._U)?-30:30}
		];
		_this.imgs_x=0;
		_this.imgs_y=0;
	}
	init(){
		this._isshow=false;
		this._status=0;
	}
	shot(){}
	showCollapes(){}
	setStatus(){this._status=0;}
	is_hand_stop(){return this.isstop;}
	set_hand_stop(){this.isstop=true;}
	move_hands_open(){
		//手をオープンする。
		let _this=this;
		if(!_this.isHandsOpen){return;}
		//停止フラグで動きを固定状態
		if(_this.isstop){return;}
		let _ar = _this.imgsPos[parseInt(_this._c / _this.aniItv)];
//		_this.img=_ar.img;//画像表示
//console.log(_ar);
		_this.imgs_x=parseInt(_ar.x);
		_this.imgs_y=parseInt(_ar.y);
		//腕に合わせて衝突判定を設定する
		_this.shotColMap=[];
		let _shotColAr = _this.shotColMapTmp[parseInt(_this._c / _this.aniItv)];
		for(let _i=0;_i<_shotColAr.length;_i++){
			_this.shotColMap.push(_shotColAr[_i]);
		}
// 		console.log(_this.shotColMap)
		if(_this._c>=_this.imgPos.length*6-1){
			_this._c=_this.imgPos.length*6-1;
			_this.isHandsOpen=false;
			return;
		}
		_this._c++;
	}
//	setDrawImage(){}
	set_imgPos(){}
	move_hands_close(){
		//手をクローズする。
		let _this=this;
		if(!_this.isHandsClose){return;}
		//停止フラグで動きを固定状態
		if(_this.isstop){return;}
		let _ar = _this.imgsPos[parseInt(_this._c / _this.aniItv)];
//		_this.img=_this.imgs[parseInt(_this._c/6)].img;//画像表示
		_this.imgs_x=parseInt(_ar.x);
		_this.imgs_y=parseInt(_ar.y);
		//腕に合わせて衝突判定を設定する
		_this.shotColMap=[];
		let _shotColAr = _this.shotColMapTmp[parseInt(_this._c / _this.aniItv)];
		for(let _i=0;_i<_shotColAr.length;_i++){
			_this.shotColMap.push(_shotColAr[_i]);
		}
//		console.log(_this.shotColMap)
		//		_this.shotColMap[0]=_this.shotColMapTmp[parseInt(_this._c/6)];
		if(_this._c<=0){
			_this._c=0;
			_this.isHandsClose=false;
			return;
		}
		_this._c--;
//		_this.isHandsClose=false;
	}
	move(){
		let _this=this;
		_this.move_hands_open();
		_this.move_hands_close();
		_this.x=_this._boss.x+parseInt(_this._initx)+_this.imgs_x;
		_this.y=_this._boss.y+parseInt(_this._inity)+_this.imgs_y;
	}
}

//========================================
//　ボス クリスタルコア
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//	_countは触手と連動させている
//	  0〜200：クロスする
//	  200〜400：広げる
//	_count->800〜1200　本体レーザーの連射
//	　※連射完了後は_countを0にリセットさせ、
//	   繰り返す
//========================================
class ENEMY_BOSS_CRYSTALCORE
			extends GameObject_ENEMY_BOSS{
		constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_cristalcore'].obj,
			x:_p.x,
			y:_p.y
		});
		let _this=this;
		_this._status=1;
		_this.speed=3;

		_this.wall=[];
		_this.hands_up = [];
		_this.hands_down = [];

		//攻撃無効を表示させる画像
		_this.is_able_collision=false;

//		_this._count=0;
		_this._shot_count=0;
		_this.shotColMap=[
			"25,0,227,10,false",
			"25,242,227,250,false",
			"120,0,227,250,false"
		];

		_this.wall=[];

		_this.hands_up=[
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_ignore_collision":true,"_initx":70,"_inity":90,"_cmr":60,"_cmsr":70,"_initRad":40,"_data":"0,0,180,10","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_ignore_collision":true,"_initx":70,"_inity":90,"_cmr":70,"_cmsr":80,"_initRad":70,"_data":"0,0,185,5","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":70,"_inity":90,"_cmr":80,"_cmsr":100,"_initRad":100,"_data":"0,0,180,-10","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":70,"_inity":90,"_cmr":89,"_cmsr":125,"_initRad":130,"_data":"0,0,175,-25","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":70,"_inity":90,"_cmr":97,"_cmsr":145,"_initRad":160,"_data":"0,0,170,-40","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":70,"_inity":90,"_cmr":106,"_cmsr":160,"_initRad":190,"_data":"0,0,165,-55","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_img":_CANVAS_IMGS['enemy_cristalcore_hand2'].obj,
															"_initx":70,"_inity":90,"_cmr":115,"_cmsr":170,"_initRad":215,"_data":"0,0,160,-70","_change":true})
		];
		_this.hands_up.map((_o)=>{_PARTS_ENEMIES._add_enemies(_o)});
		_this.hands_down=[
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_ignore_collision":true,"_initx":70,"_inity":165,"_cmr":60,"_cmsr":70,"_initRad":40,"_data":"0,0,180,-10","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_ignore_collision":true,"_initx":70,"_inity":165,"_cmr":70,"_cmsr":80,"_initRad":70,"_data":"0,0,175,-5","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":70,"_inity":165,"_cmr":80,"_cmsr":100,"_initRad":100,"_data":"0,0,180,10","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":70,"_inity":165,"_cmr":89,"_cmsr":125,"_initRad":130,"_data":"0,0,185,25","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":70,"_inity":165,"_cmr":97,"_cmsr":145,"_initRad":160,"_data":"0,0,190,40","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":70,"_inity":165,"_cmr":106,"_cmsr":160,"_initRad":190,"_data":"0,0,195,55","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_img":_CANVAS_IMGS['enemy_cristalcore_hand2'].obj,
															"_initx":70,"_inity":165,"_cmr":115,"_cmsr":170,"_initRad":215,"_data":"0,0,200,70","_change":false})
		];
		_this.hands_down.map((_o)=>{_PARTS_ENEMIES._add_enemies(_o)});

	}
	show_walls(){
		let _this=this;
		_this.wall.map((_o, _i, _ar) => {
			if (_ar[_i - 1] === undefined || _ar[_i - 1]._status <= 0) {
				//直前の壁が破壊されない間、
				//自身のダメージは不可。
				_o.is_able_collision = true;
			}
		});
	}
	shot(){
		//レーザーを発射する
		let _this=this;

		_this._shot_count++;
		if(_this._count%1200>800){
			if(_this._shot_count<10){return;}			
		}else if(_this._c%1200<=800){
			if(_this._shot_count<50){return;}
		}
		_this._shot_count=0;
		_PARTS_ENEMY_SHOT._add_shot(
			new ENEMY_SHOT_LASER({x:_this.x,y:_this.y+111}));
		_PARTS_ENEMY_SHOT._add_shot(
			new ENEMY_SHOT_LASER({x:_this.x,y:_this.y+140}));
		_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['enemy_bullet_laser']);
	}
	showCollapes(){
		let _this=this;
		//敵を倒した場合
		_this._isshow=false;
		//触手の上を表示
		_this.hands_up.forEach((_o) => {
			_o.showCollapes(_o.x, _o.y);
			_o.init();
		});
		//触手の下を表示
		_this.hands_down.forEach((_o) => {
			_o.showCollapes(_o.x, _o.y);
			_o.init();
		});

		//爆発して終了
		_ENEMIES_CONTROL._add_collisions({
			x: _this.x + (_this.img.width / 2),
			y: _this.y + (_this.img.height / 2),
			ct: _this._collision_type
		});
	}
	move_Allset(){
		//準備完了状態
		let _this=this;
		_this.y-=4;
		if(_this.y<200){
			_this.is_all_set=true;
		}
	}
	move_standby(){
		//スタンバイ状態
		let _this=this;
		if(_this.wall.length===0){
			_this.wall=[
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_cristalcore_wall1'].obj,boss:_this,x:47,y:116}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,boss:_this,x:62,y:116}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,boss:_this,x:77,y:116}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,boss:_this,x:92,y:116}),
				new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_core'].obj,boss:_this,x:102,y:115,width:30,height:30})
			];
			//壁の初期化
			_this.wall.map((_o)=>{_PARTS_ENEMIES._add_enemies(_o);});
		}
		
		_this._standby = false
	}
	moveSet(){
		let _this=this;

		_this.show_walls();
		//触手の上を表示
		_this.hands_up.forEach((_o)=>{_o.moveDraw(_this);});
		//触手の下を表示
		_this.hands_down.forEach((_o)=>{_o.moveDraw(_this);});

		_this.y+=_this.speed;
		if(_this._count%1200>800){
			//連射中はバウンドタイミングを変更させる
			if(_this._count%45===0){
				_this.speed*=-1;
			}
		}
		if(_this.y+_this.img.height>_CANVAS.height
			||_this.y<0){
			_this.speed*=-1;
		}

		if(_this.wall.every((_v)=>{return !_v.isalive();})){
			//全ての壁が壊れたら敵全部のステータスを0にする。
			//触手の上
			_this.hands_up.forEach((_o)=>{_o._status=0;});
			_this.hands_down.forEach((_o)=>{_o._status=0;});
			_this._status=0;
			_this.setAlive();
		}

	}
}
//クリスタルコアの手定義
class ENEMY_BOSS_CRYSTALCORE_HANDS
	extends GameObject_ENEMY{
	constructor(_d){
		super({
			img: _d._img || _CANVAS_IMGS['enemy_cristalcore_hand1'].obj,
			x:_d._initx,
			y:_d._inity
		});
		let _this=this;
		_this._initx=_d._initx||0;//初期位置x
		_this._inity=_d._inity||0;//初期位置y
		_this._boss=_d._boss;//ボスのオブジェクト
		//移動→自転の動き
		_this._c_move_round=_d._cmr||0;//移動maxカウント
		_this._c_move_self_round=_d._cmsr||0;//自転maxカウント
		_this._initRad=_d._initRad||0;//移動半径
		_this._data=_d._data||"0,0,0,0";//動き処理データ
					//x:移動分
					//y:移動分
					//rad:中心からの角度
					//srad:自身の角度

		_this._count_turn=0;//手をふる回数
		_this._change=_d._change;//true:上向き,false:下向き
		_this._standby=false;
		_this.is_able_collision=false;
		_this.is_ignore_collision=_d._ignore_collision||false;

		//ここでは先端のオブジェクトだけ、
		//ショットさせる
		_this.isshot=(_d._img===undefined)?false:true;
		_this._shot_count=0;
		//衝突タイプ
		_this._collision_type='t1';
		_this._c=0;

		//_this._dataの初期設定
		let _sp=_this._data.split(',');
		let _deg=parseInt(_sp[2])+((_this._change)?1:-1);
		let _x=_this._initRad*Math.cos(_deg*(Math.PI/180));
		let _y=_this._initRad*Math.sin(_deg*(Math.PI/180));
		let _z=parseInt(_sp[3])+((_this._change)?1:-1);
		_this._data=_x+','+_y+','+_deg+','+_z;

	}
	collision(_s_type,_num){}
	setStatus(){this._status=0;}
	shot(){
		let _this=this;
		if(_this.isshot===false){return;}
		_this._shot_count++;
		if(_this._shot_count<20){return;}
		_this._shot_count=0;
		let _d=_this._data.split(',');
		_PARTS_ENEMY_SHOT._add_shot(
			new ENEMY_SHOT_CRYSTALCORE({
				x: _this.x, y: _this.y + ((_this._change)?-10:10), deg: parseInt(_d[3])
				})
		);
	}
	move_hands(){
		let _this=this;
		//4回手を振り払ったら親機からレーザーを
		//連射させるため、その状態を作る
		if(_this._count_turn>=4){
			//カウントが400を超えた場合
			//連射が終了された場合カウントをリセットさせる
			if(_this._c>400){
				_this._c=0;
				_this._count_turn=0;	
			}
			return;
		}

		//カウントが200に達したら手の向きを切り替える
		if(_this._c>200){
			_this._c=0;
			_this._count_turn++;
			_this._change=(_this._change)?false:true;
		}

		//手の位置を調整する。
		let _sp=_this._data.split(',');
		let _cmr=_this._c_move_round;
		let _cmsr=_this._c_move_self_round;
//		console.log(_this._data);
		//停止
		if(_this._c>_cmsr){
			return;
		}
		//自転のみ	
		if(_this._c<=_cmsr&&_this._c>_cmr){
			let _deg=parseInt(_sp[3])+((_this._change)?1:-1);
			_this._data=_sp[0]+','+_sp[1]+','+_sp[2]+','+_deg;
			return;
		}
		//動きと自転
		let _deg=parseInt(_sp[2])+((_this._change)?1:-1);
		let _x=_this._initRad*Math.cos(_deg*(Math.PI/180));
		let _y=_this._initRad*Math.sin(_deg*(Math.PI/180));
		let _z=parseInt(_sp[3])+((_this._change)?1:-1);
		_this._data=_x+','+_y+','+_deg+','+_z;
	}
	setDrawImage(){
		let _this=this;
		// 画像を中心にして回転
		let _d=_this._data.split(',');
		_this.x = _this._boss.x + parseInt(_d[0]) + _this._initx;
		_this.y = _this._boss.y + parseInt(_d[1]) + _this._inity;
		_GAME._setDrawImage({
			img: _this.img,
			x: _this.x,
			y: _this.y,
			deg: parseInt(_d[3]),
			width: _this.width,
			height: _this.height,
		});
	}
	moveDraw(_o){
		//move()によって調整された状態からCANVASに描画する。
		let _this=this;
//		console.log(_this._count_turn)
		if(!_o.is_all_set){return;}
		_this.shot();
		_this.move_hands();
		_this._c++;
	}
	//moveはmain.jsから処理させない
	move(){

	}
}


//====================
//　ボスキューブラッシュ
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//====================
class ENEMY_BOSS_CUBE_CONTROL
			extends GameObject_ENEMY_BOSS {
		constructor(_p){
		super({
			img: _CANVAS_IMGS['enemy_cube'].obj,
			x:_p.x,
			y:_p.y
		});
		let _this=this;
		_this._standby = false;
		_this._standby_count=0;
		_this._complete_cube_count=0;
		_this._map_col_reset=false;
		_this._cube_shot_max=100;
		_this._cube_count=0;
		_this.parts=[];//キューブクラスのパーツを格納

		_this.is_all_set = true;
	}
	//このパーツは自爆設定はしない
	setSelfCollision() {}
	moveSet(){
		//スタンバイ状態。
		//クリスタルを放つ
		let _this=this;

		if (_this._cube_count >= _this._cube_shot_max
			&& _this.parts.every((_o)=>{return _o._stop;})) {
			//0が一つもない（全キューブが停止状態時）
			//透明をコントロールさせる
			_this._complete_cube_count++;
		}
		//最大値になるまで一定間隔でクリスタルを放つ
		if(_this._standby_count%40===0){
			if (_this._cube_count < _this._cube_shot_max) {
				let _c=new ENEMY_BOSS_CUBE({
					x:_CANVAS.width-10,
					y:(Math.random()*(430-50))+50
				});
				_PARTS_ENEMIES._add_enemies(_c);
				_this.parts.push(_c);
				_this._cube_count++;
			}
		}
		_this._standby_count++;

		//全てのキューブがストップした後の、
		//全キューブのフェードアウト
		if(_this._complete_cube_count===0){return;}

		//キューブフェードアウトに透明度を設定する。
		_this.parts.map((_o)=>{_o.alpha = _this.alpha;})

		if(_this._complete_cube_count===50){_this.alpha=0.7;}
		if(_this._complete_cube_count===100){_this.alpha=0.3;}
		if(_this._complete_cube_count===150){
			_MAP.set_mapdef_col_clear();
			_this.alpha=0;
		}
		if(_this._complete_cube_count===200){
			_this._status = 0;
			return false;
		}
	}
}

class ENEMY_BOSS_CUBE
		extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_cube'].obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0,70,140,210],
			aniItv:10,
			width:70,
			height:70
		});
		let _this=this;
		_this._standby=false;
		_this._status=1;
		_this.speed=5;
		_this.change_speed_c=parseInt(Math.random()*(160-10))+10;
		_this._stop=false;
		_this.is_able_collision=false;
		_this.audio_collision=_CANVAS_AUDIOS['enemy_cube'];

		_this._col_c=0;
		_this._count=0;

		//自機に向かう用の変数
		_this.tx=0;
		_this.ty=0;
		_this.rad=0//自身と相手までのラジアン
		_this.deg=0//自身と相手までの角度
		_this.sx=0;//単位x
		_this.sy=0;//単位y

		_this.shotColMap = ["15,15,"+parseInt(_this.width-30)+","+parseInt(_this.height-30)];
	}
	isCanvasOut(){
		return _GAME.isEnemyCanvasOut(
			this,{up:true,down:true,left:true,right:true}
		);
	}
	shot(){}
	isMove(){
		//生存判定を外した形で
		//オーバーライド		
		let _this=this;
		if (_this.alpha === 0) {
			_this.init();
			return false;
		}
		if(_this.isStandBy()){
			_this.move_standby();
			return false;
		}
		if(_this.isCanvasOut()){
			_this._status=0;
			_this._isshow=false;			
			return false;
		}
		if(!_this.isshow()){
			return false;
		}
		return true;
	}
	move_bounds(){
		//キューブ同士の衝突判定
		let _this=this;
		let _eb=_PARTS_ENEMIES._get_enemies();
		for(let _i=0;_i<_eb.length;_i++){
			if(!ENEMY_BOSS_CUBE.prototype.isPrototypeOf(_eb[_i])){continue;}
			if(_this.id===_eb[_i].id){continue;}//自身の判定はしない
			if(!_eb[_i]._stop){continue;}

			//キューブ同士の衝突判定
			let _r=_GAME.isSqCollision(
				'20,20,50,50',
				_this.x+','+_this.y,
				['20,20,50,50'],
				_eb[_i].x+','+_eb[_i].y
			);
			if(_r!==_IS_SQ_NOTCOL){return true;}
		}
		return false;
	}
	moveSet(){
		let _this=this;
		//衝突完了済み
		if(_this._stop===true){return;}
		//衝突判定
		if(_this.x<0
			||_this.y<0
			||_this.y+_this.height>_CANVAS.height
			||_this.move_bounds()){
			let _ec=_this.getEnemyCenterPosition();
			//衝突マップに反映させる
			_MAP.set_mapdef_col(
				_MAP.getMapX(_this.x+20),
				_MAP.getMapY(_this.y+20),
				'11,11'
			);	
			_this._status=0;
			_this._stop=true;
			_GAME_AUDIO._setPlay(_this.audio_collision);
			return;
		}

		//登場時
		if (_this._count < _this.change_speed_c) {
			_this.x -= _this.speed;
		}
		//切り替えて自機へ
		if (_this._count === _this.change_speed_c) {
			//ここは自機へ向かわせる切替の準備
			let _p = _PARTS_PLAYERMAIN._players_obj;
			_this.tx = _p.x+(_p.width);
			_this.ty = _p.getPlayerCenterPosition()._y;
			_this.rad=//自身と相手までのラジアン
				Math.atan2(
					(_this.ty-_this.getEnemyCenterPosition()._y),
					(_this.tx-_this.getEnemyCenterPosition()._x));
			_this.sx=Math.cos(_this.rad);//単位x
			_this.sy=Math.sin(_this.rad);//単位y
			_this.speed=_GET_DIF_SHOT_SPEED()*5;
		}
		//自機に向けて一気に加速
		if (_this._count > _this.change_speed_c) {
			_this.x+=_this.sx*_this.speed;
			_this.y+=_this.sy*_this.speed;
		}

		_this._count++;
		_this.set_imgPos();
	}

	move(){
		let _this=this;
		if(_this.alpha===0){_this.init();return;}
		if(!_this.isMove()){return;}
		_this.moveSet();
	}
}


//========================================
//　ボス フレーム
//	このクラス自体の表示はない。
//	頭・身体に位置情報の指令を送るだけ。
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//========================================
class ENEMY_BOSS_FRAME
	extends GameObject_ENEMY_BOSS{
	// constructor(_x,_y){
	// 	super(_CANVAS_IMGS.enemy_frame_body1.obj,_x,_y);
	constructor(_p){
		super({
			img:_CANVAS_IMGS.enemy_frame_body1.obj,
			x:_p.x,
			y:_p.y
		});
		//ここではフレームの頭、身体を設定し、
		//各描画クラスに描画させる。
		let _this=this;
		_this._status=1;

		//speed,moves_intervalで、
		//フレームのスピードを調整する。
		//※回転時はspeedの半分、回転させる
		_this.speed=3;
		_this.moves_interval=15;

		_this.shotColMap=[
			parseInt(_this.img.width/2)+","+
			parseInt(_this.img.height/2)+","+
			parseInt(_this.img.width/2+1)+","+
			parseInt(_this.img.height/2+1)
			];

		_this._radX=0;//回転時の中心x
		_this._radY=0;//回転時の中心y
		_this._rad=100;//半径
		_this._deg=16;//回転

		_this._f=false;
		_this._mpt=0;
		_this._collision_type='t9';

		//爆発直前設定フラグ
		_this._collision_set=false;

		//_CANVAS内マップ（以下マップ）位置定義
		//フレームの先頭位置から判定(1-9)
		//初期値は0
		_this.movePos={
			_pos:0,//現在のマップ位置
			_pos_same_count:0,
			//=================================
			//ここは一旦ステイ
			//=================================
			// _getDeg:function(_a,_b){
			// 	let _deg=parseInt(
			// 		Math.atan2(_a.y-_b.y,_a.x-_b.x)*180/Math.PI);
			// 	return (_deg>=0)?_deg:180+(180+_deg);
			// },
// 			_isDegMatch:function(){
// 				//フレームが回転する角度が、
// 				//true:自機（中心位置）の角度と一致する場合
// 				//false:一致しない場合
// 				let _p=_PARTS_PLAYERMAIN._players_obj.getPlayerCenterPosition();
// 				let _e=_this.getEnemyCenterPosition();

// 				//自機・敵・敵の中心点間の3辺の距離を求める。
// 				//自機-敵の回転中心点
// 				let _a=Math.sqrt(parseInt(Math.pow(_p._x-_this._radX,2)
// 						+Math.pow(_p._y-_this._radY,2)));
// 				//自機-敵
// 				let _b=Math.sqrt(parseInt(Math.pow(_p._x-_e._x,2)
// 						+Math.pow(_p._y-_e._y,2)));
// 				//敵-敵の回転中心点
// 				let _c=Math.sqrt(parseInt(Math.pow(_e._x-_this._radX,2)
// 						+Math.pow(_e._y-_this._radY,2)));
// //				console.log('_a:'+_a+'   _b:'+_b+'   _c:'+_c);

// 				let _deg_ac=this._getDeg({x:_p._x,y:_p._y},{x:_this._radX,y:_this._radY});
// 				let _deg_bc=this._getDeg({x:_e._x,y:_e._y},{x:_this._radX,y:_this._radY});
// 				console.log('_deg_ac:'+_deg_ac+'   _deg_bc:'+_deg_bc);
// 				let _self=this;
// 				return (function(){
// 					if(_this._mpt===1){
// 					//左回り
// 						if(_deg_ac<_deg_bc&&_this._deg<_self._deg){
// 							return (Math.abs(_a-(_b+_c))<10);
// 						}
// 						return false;
// 					}
// 					if(_this._mpt===2){
// 					//右回り
// 						if(_deg_ac>_deg_bc&&_this._deg>_self._deg){
// 							return (Math.abs(_a-(_b+_c))<10);
// 						}
// 						return false;
// 					}
// 					return false;
// 				})();
// 				// let _rad=//自身と相手までのラジアン
// 				// 	Math.atan2(_p._y-_e._y,_p._x-_e._x);
// 				// let _deg=//自身と相手までの角度
// 				// 		parseInt(_rad*180/Math.PI);
// 				// console.log('==='+_deg)
// 				// _deg=(_deg>=0)?_deg:180+(180+_deg);
// 				// console.log(_this._deg+'==='+_deg)
// 				// return (_this._deg+105===_deg);
// 			},
			_getPos:function(){//フレームの位置からマップ位置を取得
				return this._pos;
			},
			_setPos:function(){
				//現在の座標からマップ位置を取得
				let _e=_this.getEnemyCenterPosition();				
				if(_e._x<200){
					if(_e._y<150){this._pos=1;}
					else if(_e._y>_CANVAS.height-150){this._pos=7;}
					else{this._pos=4;}
				}else if(_e._x>_CANVAS.width-200){
					if(_e._y<150){this._pos=3;}
					else if(_e._y>_CANVAS.height-150){this._pos=9;}
					else{this._pos=6;}
				}else{
					if(_e._y<150){this._pos=2;}
					else if(_e._y>_CANVAS.height-150){this._pos=8;}
					else{this._pos=5;}
				}
			},
			move:function(){
				let _p=this._getPos();
				this._setPos();

				// if(this._isDegMatch()){
				// 	_this._deg=(_this._mpt===1)
				// 				?_this.getdim(90)
				// 				:_this.setDegAdd(90);
				// 	_this._radX=_this.x+(Math.cos(_this._deg*Math.PI/180)*_this._rad*-1);//原点x
				// 	_this._radY=_this.y+(Math.sin(_this._deg*Math.PI/180)*_this._rad*-1);//原点y
				// 	_this._mpt=0;
				// 	console.log('degMatch======================================')
				// }
				// this._deg=_this._deg;

				// if(_GAME.isEnemyCanvasOut(_this)){
				// 	let _t=parseInt(Math.random()*(3-1)+1);
				// 	if(_t===1){_this._deg=setDegAdd(90);}
				// 	else if(_t===2){_this._deg=getdim(90);}
				// 	//Math.cos(),Math.sin()は1単位の向き
				// 	_this._radX=_this.x+(Math.cos(_this._deg*Math.PI/180)*_this._rad*-1);//原点x
				// 	_this._radY=_this.y+(Math.sin(_this._deg*Math.PI/180)*_this._rad*-1);//原点y
				// 	_this._mpt=_t;
				// }

				//直前の位置と現在の位置が一致する場合は、処理をしない。
				if(_p===this._pos){
					this._pos_same_count++;
					if(this._pos_same_count<70){return;}
					
					let _mpt=(function(_t){
						if(_t._pos===5){return (Math.random()>0.4)?2:1;}
						//10度分の確保
						if(_t._pos===3&&_this._mpt===1&&_this._deg<190&&_this._deg>=180){return 0;}
						if(_t._pos===3&&_this._mpt===2&&_this._deg<90&&_this._deg>=80){return 0;}
						if(_t._pos===6&&_this._mpt===1&&_this._deg<270&&_this._deg>=260){return 0;}
						if(_t._pos===6&&_this._mpt===2&&_this._deg<100&&_this._deg>=90){return 0;}
						if(_t._pos===9&&_this._mpt===1&&_this._deg<280&&_this._deg>=270){return 0;}
						if(_t._pos===9&&_this._mpt===2&&_this._deg<190&&_this._deg>=180){return 0;}

						if(_t._pos===2&&_this._mpt===1&&_this._deg<180&&_this._deg>=170){return 0;}
						if(_t._pos===2&&_this._mpt===2&&_this._deg<10&&_this._deg>=0){return 0;}
						if(_t._pos===8&&_this._mpt===1&&_this._deg<360&&_this._deg>=350){return 0;}
						if(_t._pos===8&&_this._mpt===2&&_this._deg<190&&_this._deg>=180){return 0;}

						if(_t._pos===1&&_this._mpt===1&&_this._deg<180&&_this._deg>=170){return 0;}
						if(_t._pos===1&&_this._mpt===2&&_this._deg<280&&_this._deg>=270){return 0;}
						if(_t._pos===4&&_this._mpt===1&&_this._deg<90&&_this._deg>=80){return 0;}
						if(_t._pos===4&&_this._mpt===2&&_this._deg<280&&_this._deg>=270){return 0;}
						if(_t._pos===7&&_this._mpt===1&&_this._deg<360&&_this._deg>=350){return 0;}
						if(_t._pos===7&&_this._mpt===2&&_this._deg<90&&_this._deg>=80){return 0;}

						return _this._mpt;
					})(this);
//					console.log(this._pos_same_count);
					if(_this.x<-_this._rad
						||_this.x>_CANVAS.width+_this._rad
						||_this.y<-_this._rad
						||_this.y>_CANVAS.height+_this._rad){
						//かなりはみ出る場合は強制的に反転させる
						_this.deg=_this.setDegAdd(180);
						_this.moves_pt[_this._mpt].switch(0);
						_this._mpt=0;
						return;
					}
					if(_mpt!==_this._mpt){this._pos_same_count=0;}
					_this.moves_pt[_this._mpt].switch(_mpt);
					_this._mpt=_mpt;
					return;
				}

				//直前の位置と現在の位置に準じてフレームを回転させる
				let _mpt=(function(_this){
					if(_this._pos===5){return 0;}
					if(_p===1&&_this._pos===2){return 2;}
					if(_p===1&&_this._pos===4){return 1;}
					if(_p===4&&_this._pos===1){return 2;}
					if(_p===4&&_this._pos===7){return 1;}
					if(_p===7&&_this._pos===4){return 2;}
					if(_p===7&&_this._pos===8){return 1;}

					if(_p===2&&_this._pos===1){return 1;}
					if(_p===2&&_this._pos===3){return 2;}
					if(_p===8&&_this._pos===7){return 2;}
					if(_p===8&&_this._pos===9){return 1;}

					if(_p===3&&_this._pos===2){return 1;}
					if(_p===3&&_this._pos===6){return 2;}
					if(_p===6&&_this._pos===3){return 1;}
					if(_p===6&&_this._pos===9){return 2;}
					if(_p===9&&_this._pos===6){return 1;}
					if(_p===9&&_this._pos===8){return 2;}

					return parseInt(Math.random()*(2-0)+1);
				})(this);
				_this.moves_pt[_this._mpt].switch(_mpt);
				_this._mpt=_mpt;
			}

		}

		//頭・身体の初期化
		_this.parts=[
			new ENEMY_BOSS_FRAME_HEAD({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_BODY({o:null,x:1500,y:250}),
			new ENEMY_BOSS_FRAME_HEAD({o:null,x:1500,y:250,d:_DEF_DIR._L})
		];

		//移動量
		//{x:x位置,y:y位置,deg:表示回転角度}
		_this.moves=[];

		//敵クラスに追加
		for(let _i=0;_i<_this.parts.length;_i++){
			_PARTS_ENEMIES._add_enemies(_this.parts[_i]);
		}

		//フレームの動き定義
		//0:直進、1:左回転、2:右回転
		_this.moves_pt=[
			{//直進
				'switch':function(_mpt){
					// let _t=parseInt(Math.random()*(3-1)+1);
					if(_mpt===1){_this._deg=_this.setDegAdd(90);}
					else if(_mpt===2){
//						_this._deg=_this.getdim(90);
						_this._deg=_this.setDegAdd(-90);
					}
					//Math.cos(),Math.sin()は1単位の向き
					if(_mpt!==0){
						_this._radX=_this.x+(Math.cos(_this._deg*Math.PI/180)*_this._rad*-1);//原点x
						_this._radY=_this.y+(Math.sin(_this._deg*Math.PI/180)*_this._rad*-1);//原点y
					}
					_this._mpt=_mpt;
				},
				'move':function(){
					_this.x+=_this.speed*Math.cos(_this._deg*Math.PI/180);
					_this.y+=_this.speed*Math.sin(_this._deg*Math.PI/180);
				},
				'setDeg':0
			},
			{//左回り
				'switch':function(_mpt){
					// let _t=parseInt(Math.random()*(3-1)+1);
					if(_mpt===0){
						_this._deg=_this.setDegAdd(-90);
					}
					else if(_mpt===2){
						_this._deg=_this.setDegAdd(-180);
					}
					//回転するための中心点設定
					if(_mpt!==1){
						_this._radX=_this.x+(Math.cos(_this._deg*Math.PI/180)*_this._rad*-1);//原点x
						_this._radY=_this.y+(Math.sin(_this._deg*Math.PI/180)*_this._rad*-1);//原点y
					}		
					_this._mpt=_mpt;
				},
				'move':function(){
					//左回り
					_this._deg=_this.setDegAdd(-1*_this.speed/2);

					_this.x=_this._radX+Math.cos(_this._deg*Math.PI/180)*_this._rad;
					_this.y=_this._radY+Math.sin(_this._deg*Math.PI/180)*_this._rad;	
				},
				'setDeg':-90
			},
			{//右回り
				'switch':function(_mpt){
					if(_mpt===0){_this._deg=_this.setDegAdd(90);}
					else if(_mpt===1){
						_this._deg=_this.setDegAdd(-1*180);
					}
					//回転するための中心点設定
					if(_mpt!==2){
						_this._radX=_this.x+(Math.cos(_this._deg*Math.PI/180)*_this._rad*-1);//原点x
						_this._radY=_this.y+(Math.sin(_this._deg*Math.PI/180)*_this._rad*-1);//原点y
					}		
					_this._mpt=_mpt;
				},
				'move':function(){
					//角度を調整
					_this._deg=_this.setDegAdd(_this.speed/2);

					_this.x=_this._radX+Math.cos(_this._deg*Math.PI/180)*_this._rad;
					_this.y=_this._radY+Math.sin(_this._deg*Math.PI/180)*_this._rad;		
				},
				'setDeg':90
			}
		];//_this.moves_pt
		_this.is_able_collision=false;
		_this._standby=true;

		_this._heads_statuses='';
		_this._bodies_statuses='';
//		_this._c_self_collision=200;//デバッグ用アニメーションカウントを使って、自爆までのカウント

	}
	setSelfCollision(){
		//アニメーションカウントを用いて自爆処理
		let _this=this;
		if(_this._c>_this._c_self_collision){
			//一定時間すぎたらフレームの頭ステータスを
			//全て0にして自爆させる。
			_this._heads_statuses='00';
		}
		if(_this._heads_statuses.indexOf('1')!==-1){return;}
		//アニメーションカウントを用いて自爆処理
		//_ENEMIESの全てのステータスを0にする。
		for(let _i=0;_i<_this.parts.length;_i++){
			if(ENEMY_BOSS_FRAME_HEAD.prototype.isPrototypeOf(_this.parts[_i])){
				_this.parts[_i]._status=0;
				continue;
			}
			//爆発直前に各胴体の角度を設定させる
			if(!_this._collision_set){
				_this.parts[_i]._deg=_i*15;
			}
				//身体を拡散させる
			_this.parts[_i].is_frame_heads_collision=true;
		}
		_this._collision_set=true;

		if(_this._bodies_statuses.indexOf('1')===-1){
			//拡散された身体が全てCANVASから外れた場合
			//自身もステータスを0にする。
			//※ここで_ENEMIESが全て空になり、
			// ゲームクリアになる。
			_this.init();
		}
	}
	set_heads_bodies_status(){
		//壁オブジェクトのステータスを取得して変数に設定する。
		let _this=this;
		_this._heads_statuses='';
		_this._bodies_statuses='';
		//壁
		for(let _i=0;_i<_this.parts.length;_i++){
			if(ENEMY_BOSS_FRAME_HEAD.prototype.isPrototypeOf(_this.parts[_i])){
				_this._heads_statuses+=(_this.parts[_i].isalive())?1:0;
				continue;
			}
			_this._bodies_statuses+=(_this.parts[_i].isalive())?1:0;
		}
	}
	setDegAdd(_n){
		//現在の角度から_n分加減算する。
		let _num=(this._deg+_n)%360;
		return (_num<0)?360+_num:_num;
	}
	isAllPartsCanvasOut(){
		let _this=this;
		//全てのpartsが全てCANVASOUTか
		return _this.parts.every((_tp)=>{
			return _GAME.isEnemyCanvasOut(_tp);
		});
	}
	move_standby(){
		//スタンバイ状態
		let _this=this;
		_this._deg=190;
		_this.x+=_this.speed*Math.cos(_this._deg*Math.PI/180);
		_this.y+=_this.speed*Math.sin(_this._deg*Math.PI/180);

		// _this.moves_pt[_this._mpt]();
//		if(_this.moves.length>1000){_this.moves.pop();}
		_this.moves.unshift({x:_this.x,y:_this.y,deg:_this._deg});
		if(_this.moves.length
			>_this.parts.length*_this.moves_interval){
			_this.moves.pop();
		}			

		//各顔・の移動指令・表示
		for(let _i=0;_i<_this.parts.length;_i++){
			let _m=_this.moves[_i*_this.moves_interval];
			if(_m===undefined){break;}
			_this.parts[_i].moveDraw({x:_m.x,y:_m.y,deg:_m.deg});
		}

		// console.log('standby');
//		console.log('_this.y'+_this.y);
		if(_this.x<_CANVAS.width-300){
			_this.movePos._setPos();
			_this._standby=false;
		}
	}
	setDrawImage(){
		let _this=this;
		//フレームの頭・身体への移動指令・表示
		for(let _i=0;_i<_this.parts.length;_i++){
			if(_this.moves[_i*_this.moves_interval]===undefined){break;}
			let _m=_this.moves[_i*_this.moves_interval];
			_this.parts[_i].moveDraw(
				{x:_m.x,y:_m.y,deg:_m.deg});
		}
	}
	move(){
		let _this=this;
		if(!_this.isMove()){return;}
//		console.log(_this.moves)
		// console.log('_this.movePos._pos:'+_this.movePos._pos);
		// console.log('_this._mpt:'+_this._mpt);
// 		console.log('_this.x:'+_this.x);
// 		console.log('_this.y:'+_this.y);
//		console.log('_this._deg:'+_this._deg);

		//全てのpartsがキャンバスから離れたら、
		//CANVASに入れるように立て直し
		(()=>{
			//自身の座標、角度を調整。
			if(_this._c%100!==0){return;}
			//処理は間引きさせる。
			if(_this.isAllPartsCanvasOut()){
				//出現位置の定義
				const _pos=[
					{x:_CANVAS.width/2,y:-30,deg:90},//上から
					{x:_CANVAS.width/2,y:_CANVAS.height-30,deg:270},//下から
					{x:-30,y:_CANVAS.height/2,deg:0},//左から
					{x:_CANVAS.width-30,y:_CANVAS.height/2,deg:180}//右から
				];
				const _elem=parseInt(Math.random()*4);
				_this.x=_pos[_elem].x;
				_this.y=_pos[_elem].y;
				_this._deg=_pos[_elem].deg;
				//切替直後は、直線に動くよう調整させる
				_this._mpt=0;
			}	
		})();

		//フレームの頭・身体のステータスを取得
		_this.set_heads_bodies_status();

		//移動量に対して、フレームの位置、頭・身体の向き設定
		_this.moves.unshift({
				x:_this.x,
				y:_this.y,
				deg:_this.setDegAdd(_this.moves_pt[_this._mpt].setDeg)
			});
		if(_this.moves.length
			>_this.parts.length*_this.moves_interval){
			_this.moves.pop();
		}			

		if(!_this._f&&!_this.parts[0].isalive()){
			//先頭の頭を破壊した場合は、
			//動きを全て反転させる
			_this._f=true;
			_this.parts.reverse();
			_this.moves.reverse();
			//後方の頭に対して向きを反転させる
			_this.parts[0].setDirect(_DEF_DIR._R);//切り替え後、頭の向きを変える。
			//180度加算による転回をさせる
			_this.parts=_this.parts.map((_a)=>{_a._deg=(_a._deg+180)%360;return _a;});
			_this.moves=_this.moves.map((_a)=>{_a.deg=(_a.deg+180)%360;return _a;});

			_this.parts.pop();//末尾の要素（先頭の頭要素）を削除する

			//自身の座標、角度を調整。
			_this.x=_this.moves[0].x;
			_this.y=_this.moves[0].y;
			_this._deg=_this.moves[0].deg;
			//切替直後は、直線に動くよう調整させる
			_this._mpt=0;
		}

		//マップ位置を取得
		_this.movePos.move();
		//マップ位置より方向を決定させる
		_this.moves_pt[_this._mpt].move();

//		console.log(_this.moves[0].deg);
		//自爆
		_this.setSelfCollision();
		_this._c++;

	}
}

class ENEMY_BOSS_FRAME_HEAD
	extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS.enemy_frame_head1.obj,
			x:_p.x,
			y:_p.y,
			direct:_p.d
		});
		let _this=this;
		_this.img=
			(_this.direct===_DEF_DIR._L)
				?_CANVAS_IMGS.enemy_frame_head3.obj
				:_CANVAS_IMGS.enemy_frame_head1.obj;
		_this._standby=false;
		_this._status=70;
		_this.getscore=5000;
		_this._deg=0;
		_this.shotColMap=[
			'30,30,'+(_this.img.width-60)+','+(_this.img.height-60)
		];
		_this._collision_type='t9';
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision6'];

		_this.num_col=6;//頭破壊後の爆発数

	}
	showCollapes(){
		let _this=this;
		let _e=_this.getEnemyCenterPosition();
		_this._isshow=false;
		for(let _i=0;_i<(_this.num_col||1);_i++){
			_ENEMIES_CONTROL._add_collisions({
				x: _e._x + (Math.random() * ((Math.random() > 0.5) ? 100 : -100)),
				y: _e._y + (Math.random() * ((Math.random() > 0.5) ? 100 : -100)),
				ct: _this._collision_type
			});
		}
		_GAME_AUDIO._setPlay(_this.audio_collision);
	}
	setDirect(_dir){//向きを変更する
		this.direct=_dir;
	}
	shot(){
		let _this=this;
//		let _e=_this.getEnemyCenterPosition();
		//口を開ける
		_this.img=(function(){
			let _r=(_this._c%200<150&&_this._c%200>0);
			if(_r){
			//閉じる
				return (_this.direct===_DEF_DIR._L)
						?_CANVAS_IMGS.enemy_frame_head3.obj
						:_CANVAS_IMGS.enemy_frame_head1.obj;
			}

			//開く
			return (_this.direct===_DEF_DIR._L)
				?_CANVAS_IMGS.enemy_frame_head4.obj
				:_CANVAS_IMGS.enemy_frame_head2.obj;

		})();
		//炎をはく
		if(_this._c%200===150){
			_PARTS_ENEMY_SHOT._add_shot(
				new ENEMY_SHOT_FRAME({
					x:_this.x,
					y:_this.y,
					deg:_this._deg+90,
					img:_CANVAS_IMGS['enemy_frame_small'].obj,
					imgPos:[0,35],
					width:35
				})
			);
		}
	}
	setDrawImage(){
		let _this=this;
		if(!_this.isshow()){return;}
		if(!_this.isalive()){return;}
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x+(_this.img.width/4),
			y:_this.y+(_this.img.height/4),
			deg:_this._deg
		});
	}
	moveDraw(_loc){
		let _this=this;
		if(!_this.isshow()){return;}
		if(!_this.isalive()){
			_this.showCollapes();
			return;
		}

		_this.shot();
		_this.x=_loc.x;
		_this.y=_loc.y;
		_this._deg=_loc.deg;
	}
	//moveはmain.jsから処理させない
	move(){
		let _this=this;
		_this._c=(_this._c>200)?0:_this._c+1;
	}
}
class ENEMY_BOSS_FRAME_BODY
	extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS.enemy_frame_body1.obj,
			x:_p.x,
			y:_p.y
		});
		let _this=this;
		_this._standby=false;
		_this.is_able_collision=false;
		_this.shotColMap=[
			'5,5,'+(_this.img.width-10)+','+(_this.img.height-10)
		];
		_this._deg=0;
		_this.speed=(Math.random>0.4)?-10:10;//飛び散る時のスピード
		//フレームの頭が全破壊フラグ
		//showCollapesで拡散処理させる
		_this.is_frame_heads_collision=false;

		_this.ani=[//アニメーション定義
			{scale:1},
			{scale:0.95},
			{scale:0.90},
			{scale:0.85},
			{scale:0.90},
			{scale:0.95}
		];
		_this._deg_col=0;
	}
	showCollapes(){
		let _this=this;
		//破壊されたら角度に合わせてぶっ飛ぶ
//		console.log('show')
		if(_GAME.isEnemyCanvasOut(_this)){
			_this._status=0;
			_this._isshow=false;
			return;
		}
		_this.x+=Math.cos(_this._deg*Math.PI/180)*_this.speed;
		_this.y+=Math.sin(_this._deg*Math.PI/180)*_this.speed;
		_this._deg_col+=10;

		_GAME._setDrawImage({
			img:_this.img,
			x:_this.getEnemyCenterPosition()._x,
			y:_this.getEnemyCenterPosition()._y,
			deg:_this._deg_col
		});
	}
	setDrawImage(){
		let _this=this;
		if(!_this.isshow()){return;}
		if(_this.is_frame_heads_collision){return;}
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.getEnemyCenterPosition()._x,
			y:_this.getEnemyCenterPosition()._y,
			deg:_this._deg,
			scale:_this.ani[parseInt(_this._c/20)].scale
		});
	}
	moveDraw(_loc){
		let _this=this;
		if(!_this.isshow()){return;}
		if(_this.is_frame_heads_collision){
			//ここではフレームの頭が全破壊された時に
			//アニメーションさせる
			_this._standby=true;
			//拡散中は当たり判定を無効にする。
			_this.showCollapes();
			return;
		}

		_this.x=_loc.x;
		_this.y=_loc.y;
		_this._deg=_loc.deg;
		_this._deg_col=_loc.deg;
	}
	//moveはmain.jsから処理させない
	move(){
		let _this=this;
		_this._c=(_this._c>=(_this.ani.length*20)-1)?0:_this._c+1;
	}
}


//========================================
//　ボス 細胞
//	分身用のサブクラス定義
//	サブクラスに位置情報の指令を送るだけ。
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//========================================
class ENEMY_BOSS_CELL
	extends GameObject_ENEMY_BOSS{
	// constructor(_x,_y){
	// 	super(_CANVAS_IMGS.enemy_cell_boss.obj,_x,_y);
	constructor(_p){
		super({
			img:_CANVAS_IMGS.enemy_cell_boss.obj,
			x:_p.x,
			y:_p.y
		});
		let _this=this;
		_this.rad=Math.random()*Math.PI-(Math.PI/2);
		_this._standby=false;
		_this.is_all_set=false;

		//アニメーション定義
		_this.ani=[0,180,360];
		_this.ani_c=0;
		_this.ani_c_intv=20;

		//移動量
		//{x:x位置,y:y位置}
		_this.moves=[];
		_this.speed=1;
		_this.moves_interval=50;

		//細胞の本体の初期化
		_this.parts=[
			new ENEMY_BOSS_CELL_MAIN({x:_this.x,y:_this.y,dark:false}),
			new ENEMY_BOSS_CELL_MAIN({x:_this.x,y:_this.y,dark:true}),
			new ENEMY_BOSS_CELL_MAIN({x:_this.x,y:_this.y,dark:true}),
			new ENEMY_BOSS_CELL_MAIN({x:_this.x,y:_this.y,dark:true}),
			new ENEMY_BOSS_CELL_MAIN({x:_this.x,y:_this.y,dark:true}),
			new ENEMY_BOSS_CELL_MAIN({x:_this.x,y:_this.y,dark:true}),
			new ENEMY_BOSS_CELL_MAIN({x:_this.x,y:_this.y,dark:true})
		];
		//細胞の目の初期化
		_this.parts_eye=new ENEMY_BOSS_CELL_EYE({x:_this.x,y:_this.y}),

		_this.width=200;
		_this.height=_this.img.height;
		_this.shotColMap=[
			"50,0,"+_this.width+","+_this.height
		];
		_this.is_able_collision=false;
		_this._collision_type='t9';

		_this._col_c=0;//爆発表示カウント
	}
	is_parts_eye_status(){
		//細胞の目ステータスを取得
		//true:生きてる
		//false:生きていない
		let _this=this;
		return _this.parts_eye.isalive();
	}
	setSelfCollision(){
		//アニメーション用いて自爆処理
		let _this=this;
		if(_this._c<_this._c_self_collision){return;}
		_this.parts_eye._status=0;
		_this.setCollapes();
	}
	setCollapes(){
		//破壊処理
		//爆発アニメーションをしながら
		//this.partsの要素を減らして行く。
		let _this=this;
		if(_this.parts.length===0){
			//this.partsが完全になくなった場合は、
			//自身も_statusを0にして終了
			//_ENEMIESもこのタイミングで
			//全て要素がなくなりGAME CLEAR
			_this._status=0;
			_PARTS_OTHERS._set_score(_this.getscore);
			return;
		}

		//細胞本体への表示指令
		for(let _i=_this.parts.length-1;_i>=0;_i--){
			_this.parts[_i].moveDraw();
		}

		let _o=_this.parts[_this.parts.length-1];
		if(_this._col_c===0){
			_o.showCollapes();
			_this.parts.pop();
		}else if(_this._col_c%8===0){
			//爆発表示タイミング
			_ENEMIES_CONTROL._add_collisions({
				x: _o.x + Math.random() * 100,
				y: _o.y + Math.random() * 100,
				ct: _this._collision_type
			});	
			_GAME_AUDIO._setPlay(_this.audio_collision);
		}
		//爆発表示のカウント
		_this._col_c=(_this._col_c>40)?0:_this._col_c+1;	
		return;
	}
	isAllset(){
		//準備完了判定処理
		let _this=this;
		if(_this.is_all_set){return true;}
		_this.move_Allset();
		return false;
	}
	move_Allset(){
		let _this=this;
		_this.x-=2;
		//細胞本体への移動指令
		for(let _i=0;_i<_this.parts.length;_i++){
			_this.parts[_i].moveSet({x:_this.x,y:_this.y});
		}
		if(_this.x>=_CANVAS.width-300){return;}
		_this.is_all_set=true;

		//敵クラスに追加
		for(let _i=0;_i<_this.parts.length;_i++){
			_PARTS_ENEMIES._add_enemies(_this.parts[_i]);
		}
		//細胞の目を敵クラスに追加
		_PARTS_ENEMIES._add_enemies(_this.parts_eye);
	}
	showCollapes(){}//ここでの爆発表示しない
	move_standby(){}
	setDrawImage(){
		let _this=this;
		//細胞本体への表示指令
		for(let _i=_this.parts.length-1;_i>=0;_i--){
			_this.parts[_i].moveDraw();
		}
		let _m=_this.moves[0];
		if(_m===undefined){return;}
		//目への表示司令
		_this.parts_eye.moveDraw({
			x:_m.x,
			y:_m.y+(_this.height/2)-(_this.parts_eye.height/2)
		});
	}
	move(){
		let _this=this;
		_this.ani_c=
			(_this.ani_c>=(_this.ani.length*_this.ani_c_intv)-1)?0:_this.ani_c+1;
		if(!_this.isMove()){return;}
		if(!_this.isAllset()){return;}

		//爆発処理（ここで終了）
		if(!_this.is_parts_eye_status()){
			_this.setCollapes();
			return;
		}

		//動き切り替えの条件設定
		if(_this.x<400
			||_this.x>700
			||_this.y<100
			||_this.y>300){
			_this.rad+=Math.PI/2;
		}
		_this.x+=Math.cos(_this.rad)*_this.speed;
		_this.y+=Math.sin(_this.rad)*_this.speed;
		//移動量に対して位置設定
		//※要素の少ない方が最新
		_this.moves.unshift({x:_this.x,y:_this.y});
		if(_this.moves.length>_this.parts.length*_this.moves_interval){
			_this.moves.pop();
		}
		//細胞本体への移動指令
		for(let _i=0;_i<_this.parts.length;_i++){
			let _m=_this.moves[_i*_this.moves_interval];
			if(_m===undefined){break;}
			_this.parts[_i].moveSet({x:_m.x,y:_m.y,standby:false});
		}
		//細胞目への移動指令・表示
		if(_this._c%300>100&&_this._c%300<200){
			//一定期間に達したら表示させる
			_this.parts_eye.move_eye_open();
		}
		if(_this._c%300>=200&&_this._c%300<300){
			//一定期間に達したら表示させる
			_this.parts_eye.move_eye_close();
		}

		_this.setSelfCollision();
		_this._c++;
	}
}

class ENEMY_BOSS_CELL_MAIN
	extends GameObject_ENEMY{
	constructor(_p){
		//細胞メインの設定・表示
		super({
			img:_CANVAS_IMGS.enemy_cell_boss.obj,
			x:_p.x,
			y:_p.y
		});
		let _this=this;
		_this._status=1;
		_this.alpha=1;
		_this.speed=2;
		_this._standby=false;

		//アニメーション定義
		_this.ani=(_p.dark)?[480,640,800]:[0,160,320];
		_this.ani_c=0;
		_this.ani_c_intv=20;

		_this.width=160;
		_this.height=_this.img.height;
		_this.shotColMap=[
			"50,0,"+_this.width+","+_this.height
		];

		_this.is_able_collision=false;
		_this.is_ignore_collision=false;
		_this._collision_type='t9';
	}
	showCollapes(){
		let _this=this;
		let _e=_this.getEnemyCenterPosition();
		_ENEMIES_CONTROL._add_collisions({
			x: _this.x + _this.width / 2,
			y: _e._y,
			ct: _this._collision_type
		});
		_this.init();
	}
	moveSet(_d){
		let _this=this;
		_this.x=_d.x;
		_this.y=_d.y;
		_this.ani_c=
			(_this.ani_c>=(_this.ani.length*_this.ani_c_intv)-1)?0:_this.ani_c+1;		
	}
	setDrawImage(){}
	moveDraw(){
		//描画状態
		let _this=this;
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			imgPosx:_this.ani[parseInt(_this.ani_c/_this.ani_c_intv)],
			width:_this.width,
			basePoint:1,
			alpha:_this.alpha
		});
	}
	move(){}	
}

class ENEMY_BOSS_CELL_EYE
	extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS.enemy_cell_boss_eye.obj,
			x:_p.x,
			y:_p.y
		});
		let _this=this;
		_this._status=100;
		_this._standby=false;
		_this.audio_alive=_CANVAS_AUDIOS['enemy_collision7'];
		_this.is_able_collision=false;//目を開くまでは無敵

		//アニメーション定義
		_this.ani=[0,48,96,144];
		_this.ani_c=0;
		_this.ani_c_intv=20;

		_this.setAliveHit=false;

		_this.width=48;
		_this.height=_this.img.height;
		_this.shotColMap=[
			"0,0,"+_this.width+","+_this.height
		];
		_this._collision_type='t1';
	}
	showCollapes(){
		let _this=this;
		_this.init();
	}
	shot(){
		let _this=this;
		//敵の中心から弾を発射させるための位置調整
		let _deg=_GAME.getDeg(_PARTS_PLAYERMAIN._players_obj,_this);
		for(let _i=-30;_i<=30;_i=_i+30){
			_PARTS_ENEMY_SHOT._add_shot(
				new GameObject_ENEMY_SHOT({
					x:_this.x+20,
					y:this.getEnemyCenterPosition()._y,
					img:_CANVAS_IMGS['enemy_bullet_cell'].obj,
					imgPos:[0,15],
					width:15,
					aniItv:10,
					deg:_deg+_i
				})
			);	
		}
	}
	move_eye_open(){
		//目を開く
		//スプライトで右にずらす
		let _this=this;
		if(_this.ani_c>=(_this.ani.length*_this.ani_c_intv)-1){return;}
		//目が開いたタイミングでショットを放つ
		if(_this.ani_c%10===0){_this.shot();}
		_this.ani_c++;
	}
	move_eye_close(){
		//目を閉じる
		//スプライトで左にずらす
		let _this=this;
		if(_this.ani_c<0){return;}
		//目が開いたタイミングでショットを放つ
		if(_this.ani_c%10===0){_this.shot();}
		_this.ani_c--;
	}
	setAlive(){
		let _this=this;
		//衝突中は目をずらす演出
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x+20,
			y:_this.y,
			imgPosx:_this.ani[parseInt(_this.ani_c/_this.ani_c_intv)],
			width:_this.width,
			basePoint:1
		});
		_GAME_AUDIO._setPlay(_this.audio_alive);
	}
	setDrawImage(){}
	moveDraw(_d){
		//描画状態
		let _this=this;
		if(!_this.isMove()){_this.init();return;}
		_this.x=_d.x;
		_this.y=_d.y;
		_this.is_able_collision=(_this.ani_c>0);
		if(_this.ani_c<=0){return;}
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			imgPosx:_this.ani[parseInt(_this.ani_c/_this.ani_c_intv)],
			width:_this.width,
			basePoint:1
		});
	}
	move(){}	
}


//====================
//　デス
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//====================
class ENEMY_BOSS_DEATH
		extends GameObject_ENEMY_BOSS{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_death'].obj,
			x:_p.x,
			y:_p.y,
			width:202,
			height:140
		});
		let _this=this;
		_this._status=100;
//		_this._status =1;

		//攻撃無効を表示させる画像
		_this.tid=null;

		_this.shotColMap=[
			"20,0,40,100",
			"40,0,230,140,false"
		];
		_this._collision_type='t9';
		_this.defSpeed=3;
		//前画像（スプライト）調整するための変数
		_this._front_imgPosx=0;
		//レーザをショットするまでの判別
		_this._is_laser_status=false;
		_this._shot_count = 0;
		_this._shot_count_unit = 5;

	}
	setShotCountUnit(){
		//ショット調整
		let _this=this;
		let _c = _this._count - _this._shot_count;
		if (_c % (_this._shot_count_unit * 50) === (_this._shot_count_unit * 50) - 1) {
			//弾とレーザーでショットタイミングを調整させる
			_this._shot_count_unit = 
				(_this._is_laser_status)
					?parseInt(Math.random() * (6 - 3) + 3)//レーザー
					:_this._shot_count_unit;//弾（固定）
			//発射完了後にその時の_this._cを基準値にする。
			_this._shot_count = _this._count;
		}
	}
	setAlive() {
		let _this = this;
		if (!_this.isalive()) {
			_PARTS_OTHERS._set_score(_this.getscore);
			_GAME_AUDIO._setPlay(_this.audio_collision);
			_this.showCollapes();
		} else {
			_GAME_AUDIO._setPlay(_this.audio_alive);
		}
	}
	isShooting(){
		//ショット中判定フラグ
		let _this = this;
		let _c = _this._count - _this._shot_count;
		if (_c % (_this._shot_count_unit * 50) >= (_this._shot_count_unit - 1) * 50 &&
			_c % (_this._shot_count_unit * 50) < (_this._shot_count_unit * 50)) {
			return true;
		}
		return false;
	}
	isShot(){
		//ショット判定フラグ	
		let _this=this;
		let _c = _this._count - _this._shot_count;
//			if (_this._count % 250 === 210)
		if (_c % (_this._shot_count_unit * 50) === ((_this._shot_count_unit - 1) * 50) + 10) {return true;}
		return false;
	}
	shot(){
		//特定のタイミングで発射させる
		let _this=this;
		//初回は無視する
		if(_this._count===0){return;}

		//========
		//レーザーを発射させる
		//========
		if(_this._is_laser_status){
			_this._front_imgPosx=126;
			if ( _this.isShot() ) {
				//ここではデスを最後にdrawImageするため、
				//_ENEMIES配列の先頭にレーザーを挿入させる。
				_PARTS_ENEMIES._get_enemies().unshift(
					new ENEMY_DEATH_LASER({
						x:_this.x+50,
						y:_this.y+35
					}));
				_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['enemy_bullet_laser_long']);
			}
			return;
		}

		//========
		//弾を発射させる
		//========
		//ここでは250単位でショットさせる
		//_this._shot_count_unit=5
		let _c = _this._count - _this._shot_count;
		let _uc = _this._shot_count_unit * 50;

		//前面が開くアニメーション
		//200カウントに達したら、前面の壁を開く
		if(_c%_uc>200&&_c%_uc<210){_this._front_imgPosx=42;}
		if(_c%_uc>210&&_c%_uc<230){_this._front_imgPosx=84;}		
		if(_c%_uc>230&&_c%_uc<240){_this._front_imgPosx=42;}
		if(_c%_uc>240&&_c%_uc<250){_this._front_imgPosx=0;}

		//弾を発射させる
		if (_this.isShot()) {
//			console.log('shot!');
			for(let _i=0;_i<5;_i++){
				_PARTS_ENEMY_SHOT._add_shot(
					new ENEMY_SHOT_DEATH({
						x:_this.x+50,
						y:_this.y+45+(10*_i),
						deg:([40,20,1,-20,-40])[_i]
					}));
			}
		}

	}
	move_Allset(){
		let _this=this;
		_this.x-=4;
		if(_this.x<_CANVAS.width
			-_this.img.width-80){
			_this.is_all_set=true;
			_this.is_able_collision=true;
		}
	}
	move_standby(){
		//スタンバイ状態
		let _this=this;
		_this.x-=4;
		if(_this.x<_CANVAS.width){
			_this._standby=false;
		}
	}
	setDrawImage(){
		let _this=this;
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			deg:_this.deg+180,
			basePoint:1
		});		

		_GAME._setDrawImage({
			img:_CANVAS_IMGS['enemy_death_front'].obj,
			x:_this.x,
			y:_this.y+34,
			imgPosx:_this._front_imgPosx,
			basePoint:1,
			width:42
		});
	}
	moveSet(){
		//ここでは_this._cは250サイクルでアニメーションさせる
		let _this=this;
		if(_this._is_laser_status===false
			&& (_this._count >= (_this._c_self_collision/2)
			||_this._status<=50)){
			//レーザーに切り替えるための爆発
			_this._is_laser_status=true;
			//爆発して終了
			_ENEMIES_CONTROL._add_collisions({
				x: _this.x,
				y: _this.y + 65,
				ct: 't1'
			});
			_GAME_AUDIO._setPlay(_this.audio_collision);
		}

		let _p=_PARTS_PLAYERMAIN._players_obj.getPlayerCenterPosition();

		//スピード、向き先調整
		//単位50
		_this.speed=(()=>{
			//ショット中
			if (_this.isShooting()) {return 0;}
			//止まるタイミング
			if(_this._count%50>=40&&_this._count%50<50){return 0;}
			//止まった時に自機位置に合わせて向き先を調整させる
			if(_this._count%50===0){
				return (_p._y<_this.y+_this.height)
							?_this.defSpeed*-1
							:_this.defSpeed;
			}
			//画面からはみ出ないようにする
			if(_this.y<0&&_this.speed<0){return _this.defSpeed;}	
			if(_this.y+_this.height>_CANVAS.height&&_this.speed>0){return _this.defSpeed*-1;}
			return _this.speed;
		})();
		_this.y+=_this.speed;

		//ショット完了後のステータス調整
		_this.setShotCountUnit();

	}
}

//デスのレーザー
//自機ショットの当たり判定を加味させるため、敵扱いにする。
class ENEMY_DEATH_LASER
	extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_death_shot2'].obj,
			x:_p.x,
			y:_p.y,
			width:140,
			height:70
		});
		let _this=this;
		_this.bossx=_p.x;
		//衝突時、自機のショットを初期化させる
		_this.is_collision_player_init=true;
		//無敵だが衝突を無視し、"ある程度"ショットは通過できる
		_this.is_able_collision=false;
		_this.is_ignore_collision=false;
		_this._standby=false;
	}
	isCanvasOut(){
		//敵位置がキャンバス以外に位置されてるか。
		//※main.jsで、trueの場合は、
		//_IS_ENEMIES_COLLISION、
		//_ENEMIES内、インスタンスが削除される。
		//true:外れてる
		//false:外れていない
		return _GAME.isEnemyCanvasOut(
			this,{up:false,down:false,left:false,right:false}
		);
	}
	setDrawImage(){
		let _this=this;
		//先頭(width:40)
		_GAME._setDrawImage({
			img: _this.img,
			t_width: 40,
			x: _this.x,
			y: _this.y,
			width: 40,
			height: _this.height,
			basePoint: 1
		});
		//真ん中
		_GAME._setDrawImage({
			img: _this.img,
			imgPosx: 40,
			t_width: 10,
			x: _this.x+40,
			y: _this.y,
			width: _this.bossx - _this.x - 25,
			height: _this.height,
			basePoint: 1
		});
		//後方(width:70)
		_GAME._setDrawImage({
			img: _this.img,
			imgPosx: 70,
			x: _this.bossx,
			y: _this.y,
			width: 70,
			height: _this.height,
			basePoint: 1
		});
	}
	move(){
		let _this=this;
		if(_this.bossx<=0){
			_this.init();
			return;
		}
		_this.x=(_this.x<=-1000)?-1000:_this.x-30;
		//レーザーが先頭（画面左端）に達したら、
		//レーザーの後方（ボスの左端）を徐々に左に移動させる
		_this.bossx=(_this.x>=0)?_this.bossx:_this.bossx-30;
		_this.width=_this.bossx-_this.x+25;
		_this.shotColMap=[
			"0,0,"+_this.width+","+(_this.height)+",false"
		];
	}
}


//====================
//　ボス モアイ
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//====================
class ENEMY_BOSS_MOAI
		extends GameObject_ENEMY_BOSS{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_moai_boss'].obj,
			x:_p.x,
			y:_p.y,
			width:135,
			height:150
		});
		let _this=this;
		_this._status=15;
		_this.speedx=2;
		_this.speedy=2;
		_this._standby=false;
		_this.is_all_set=false;

		//プチモアイ格納
		_this.moai_mini=[];
		//アニメーション定義
		_this.ani=[0,135,270,405,540,675,810];
		_this.imgPosx=_this.ani[6];
		_this._isopen=false;

		_this._direct=_DEF_DIR._L;//左向
		_this.shotColMapDir={
			3:["0,90,20,120","20,0,135,150,false"],
			2:["115,90,135,120","0,0,115,150,false"]
		}
	
		_this.shotColMap=_this.shotColMapDir[_this._direct];
		_this.audio_alive=_CANVAS_AUDIOS['enemy_collision8'];
		_this._collision_type='t9';

		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;
	}
	collision(_s_type,_num){
		let _this=this;
		//イオンリングを発したときに当たり判定させる
		if(!_this._isopen){return;}
		if(!_this.isCollision()){return;}
		_this.setStatus(_s_type,_num);
	}
	showCollapes(){
		let _this=this;
		let _e=_this.getEnemyCenterPosition()
		//敵を倒した場合
		_this._isshow=false;
		//爆発して終了
		_ENEMIES_CONTROL._add_collisions({
			x: _e._x,
			y: _e._y,
			ct: _this._collision_type
		});
		//他のボスをすべて爆発
		let _en = _PARTS_ENEMIES._get_enemies();
		for(let _i=0;_i<_en.length;_i++){
			let _o=_en[_i];
			if(ENEMY_BOSS_MOAI.prototype.isPrototypeOf(_o)){continue;}
			_o.init();
			_o.showCollapes();
		}
	}
	set_direct(_dir){
		let _this=this;
		if(_this._count===0){return;}
		if(_this._count%200>=170&&_this._count%200<180){
			_this.imgPosx=(_this._direct===_DEF_DIR._L)?_this.ani[4]:_this.ani[2];
			return;
		}
		if(_this._count%200>=180&&_this._count%200<190){
			_this.imgPosx=_this.ani[3];
			return;
		}
		if(_this._count%200>=190&&_this._count%200<200){
			_this.imgPosx=(_this._direct===_DEF_DIR._L)?_this.ani[2]:_this.ani[4];
			return;			
		}
		if(_this._count%200===0){
			_this._direct=(_this._direct===_DEF_DIR._L)?_DEF_DIR._R:_DEF_DIR._L;
		}
		_this.imgPosx=(_this._direct===_DEF_DIR._L)?_this.ani[5]:_this.ani[0];
	}
	shot(){
		let _this=this;

		//向き展開中はプチモアイを吐き出さない
		if(_this._count%200>=170&&_this._count%200<200){
			return;
		}
		//プチモアイを吐き出す
		let _num=0;
		let _e = _PARTS_ENEMIES._get_enemies();
		for(let _i=0;_i<_e.length;_i++){
			let _o=_e[_i];
			if(ENEMY_BOSS_MOAI_MINI.prototype.isPrototypeOf(_o)){
				_num++;
				//一定数を超えたらプチモアイを出さない。
				if(_num>_GET_DIF_ENEMY_SPEED()*5){return;}
			}
		}
		if(_this._count%50>=30&&_this._count%50<50){
			_this.imgPosx=(_this._direct===_DEF_DIR._L)?_this.ani[5]:_this.ani[0];
			_this._isopen=true;
		}else{
			_this.imgPosx=(_this._direct===_DEF_DIR._L)?_this.ani[6]:_this.ani[1];
			_this._isopen=false;
		}
		if(_this._count%30===20){
			let _e=_this.getEnemyCenterPosition();
			let _o=new ENEMY_BOSS_MOAI_MINI({x:_e._x,y:_e._y});
			_this.moai_mini.push(_o);
			_PARTS_ENEMIES._add_enemies(_o);	
		}
	}
	isAllset(){
		//準備完了判定処理
		let _this=this;
		if(_this.is_all_set){return true;}
		_this.move_Allset();
		return false;
	}
	move_Allset(){
		//スタンバイ状態
		let _this=this;
		_this.x-=4;
		if(_this.x<_CANVAS.width-300){
			_this.is_all_set=true;
		}
	}
	move_standby(){}
	setDrawImage(){
		let _this=this;
		//自身を表示
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			imgPosx:_this.imgPosx,
			width:_this.width,
			basePoint:1
		});

	}
	moveSet(){
		let _this=this;
		_this.shotColMap=_this.shotColMapDir[_this._direct];

		_this.x+=_this.speedx;
		_this.speedx=(_this.x<200
					||_this.x+_this.width>900)
				?_this.speedx*-1
				:_this.speedx;
		_this.y+=_this.speedy;
		_this.speedy=(_this.y<50
					||_this.y+_this.height>450)
						?_this.speedy*-1
						:_this.speedy;

//		console.log(_this.x);
		let _e=_this.getEnemyCenterPosition();
		//向きを切り替える
		_this.set_direct();
		//プチモアイの操作
		let _en = _PARTS_ENEMIES._get_enemies();
		for(let _i=0;_i<_en.length;_i++){
			let _o=_en[_i];
			if(ENEMY_BOSS_MOAI.prototype.isPrototypeOf(_o)){continue;}
			_o.setPos({x:_e._x,y:_e._y});
		}

	}
}
//ミニモアイの表示
class ENEMY_BOSS_MOAI_MINI
	extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_moai_mini_boss'].obj,
			x:_p.x,
			y:_p.y,
			width:27,
			height:30
		});
		let _this=this;
		_this._status=3;
		_this._radian=0;
		_this._radius=0;
		_this._standby=false;
		_this.audio_alive=_CANVAS_AUDIOS['enemy_collision3'];
		_this._collision_type='t2';
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;
		_this._count=0;

	}
	shot(){
		let _this=this;
		//イオンリングを吐き出す
//		console.log(_this._count)
		if(_this._count!==0){return;}
		_PARTS_ENEMIES._add_enemies(new ENEMY_moai_boss_ring({x:_this.x,y:_this.y}))
	}
	setPos(_d){
		let _this=this;
		_this._radian+=0.075;
		_this._radius=(_this._radius<150)?_this._radius+5:_this._radius;
		_this.x=_this._radius*Math.cos(_this._radian)+_d.x;
		_this.y=_this._radius*Math.sin(_this._radian)+_d.y;
	}
	setDrawImage(){
		//描画状態
		let _this=this;
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			basePoint:5
		});
	}
	moveSet(){
		//敵の処理メイン
		let _this=this;
//		console.log(_GET_DIF_MOAI_RING_INT())
		_this._count=(_this._count>_GET_DIF_MOAI_RING_INT()*3)?0:_this._count+1;//リング発射間隔
	}	
}

//モアイ（リング）
class ENEMY_moai_boss_ring
	extends ENEMY_moai_ring{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_moai_boss_ring'].obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0,10],
			aniItv:5,
			width:10,
			height:10
		});
        let _this=this;
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision2'];
		_this._collision_type='t2';
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=1;
		_this.getscore=100;//倒した時のスコア

	}
	setPos(){}//これは必要。
	moveSet() {
		let _this = this;
		_this.map_collition();
		_this.speed = _GET_DIF_SHOT_SPEED() * 3;

		_this.x += _this.sx * _this.speed;
		_this.y += _this.sy * _this.speed;

		_this.set_imgPos();
	}
}


//====================
//　ボス アイアンメイデン コア
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//====================
class ENEMY_BOSS_AIAN_CONTROL
	extends GameObject_ENEMY_BOSS {
	constructor(_p) {
		super({
			img: _CANVAS_IMGS['enemy_boss_aian'].obj,
			x: _p.x,
			y: _p.y,
			width: 100,
			height: 87,
			imgPos:[0,100],
			aniItv: 5
		});
		let _this = this;
		_this._standby = true;
		_this._status = 1;
		_this.audio_collision = _CANVAS_AUDIOS['enemy_collision2'];
		_this._collision_type = 't2';
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER = 0.5;
		_this.getscore = 100; //倒した時のスコア
		_this.is_ignore = true;//母体は無視する

		_this.aians_max = 50;//アイアンの最大登場数
		_this.aians_count = 0;//アイアンの登場カウント
		_this.aians_clear_count = 0;//アイアン全破壊後のカウント

		_this.parts=[];
		_this.is_all_set = true;

	}
	//このパーツは自爆設定はしない
	setSelfCollision() {}
	shot() {}
	move_standby(){
		let _this = this;
		if (_this.parts.length === 0){
			for(let _i=0; _i<_this.aians_max; _i++){
				let _o = new ENEMY_BOSS_AIAN({
					x: _CANVAS.width+10,
					y: 100
				});
				_this.parts.push(_o);
				_PARTS_ENEMIES._add_enemies(_o);
			}
		}
		_this._standby = false;
	}
	moveSet() {
		let _this = this;
		//アイアンが全て消えた場合は、自身も自爆する。
		if (_this.aians_count === _this.aians_max
			&&_this.parts.every((_o)=>{return !_o.isalive()})){
			_this.aians_clear_count++;
			if (_this.aians_clear_count>200){_this.init();}
			return;
		}

		//アイアンの動作をコントロールさせる
		_this.parts.map((_o)=>{_o.moveSet();});

		//アイアンのスタンバイを段階的に解除させる
		if (_this._count % 30 !== 0) {return;}
		if (_this.aians_count >= _this.aians_max) {return;}

		//アイアンに対してスタンバイを解除させる
		_this.parts[_this.aians_count]._standby = false;
		_this.aians_count++;

	}
}

class ENEMY_BOSS_AIAN
extends GameObject_ENEMY {
	constructor(_p) {
		super({
			img: _CANVAS_IMGS['enemy_boss_aian'].obj,
			x: _p.x,
			y: _p.y,
			width: 75,
			height: 65,
			imgPos: [0, 75],
			aniItv: 5
		});
		let _this = this;
		_this.is_all_set = true;
		_this._status = 3;
		_this._collision_type = 't3';
		_this.getscore = 500; //倒した時のスコア

		_this._move_status = 0;
		_this._rad=0;

	}
	shot() {}
	move_standby(){}
	isCanvasOut(){
		//右以外は全て画面から外れる扱いにする。
		return _GAME.isEnemyCanvasOut(
			this,{up:true,down:true,left:true,right:false}
		);
	}
	moveSet() {
		let _this = this;

		_this.x = _MAP.getX(_this.x);
		_this.y = _MAP.getY(_this.y);
		if (!_this.isMove()) {
			return;
		}

		_this.speed = _GET_DIF_ENEMY_SPEED() * 2;

		if (_this._move_status === 0) {
			if(_this.x<200){_this._move_status=1; return;}
			_this.x -= _this.speed;
			_this.y+=(Math.sin(_this._rad)*4);
			_this._rad+=0.1;
		}

		if (_this._move_status === 1) {
			if(_this.y>350){_this._move_status=2; return;}
			_this.y+=_this.speed;
		}

		if (_this._move_status === 2) {
			if(_this.x>750){_this._move_status=3; return;}
			_this.x+=_this.speed;
		}

		if (_this._move_status === 3) {
			let _pc = _PARTS_PLAYERMAIN._players_obj.getPlayerCenterPosition();
			if(_this.y>_pc._y-100&&_this.y<_pc._y+0){_this._move_status=4; return;}
			_this.y-=_this.speed;
		}

		if (_this._move_status === 4) {
			_this.x-=_this.speed;
		}

		_this.set_imgPos();
//		_this._count++;
	}
	move(){}//moveは親が管理する
}
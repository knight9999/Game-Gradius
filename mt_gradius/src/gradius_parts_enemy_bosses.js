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
	// constructor(_o,_x,_y){
	// 	super(_o,_x,_y);
	constructor(_p){
		super({
			img:_p.img,
			x:_p.x,
			y:_p.y,
			width:_p.width,
			height:_p.height
		});
		let _this=this;
		_this.speed=0;
		_this.getscore=10000;
		_this._c_self_collision=4000;//アニメーションカウントを使って、自爆までのカウント
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision6'];
		_this.is_able_collision=false;//衝突可能フラグ

		//スタンバイ完了後ショット自機を攻撃する準備完了フラグ
		_this.is_all_set=false;
	}
	init(){
		this._isshow=false;
		this._status=0;
	}
	shot(){}
	move_init(){}
	setSelfCollision(){
		//アニメーションカウントを用いて自爆処理
		let _this=this;
		if(_this._c<_this._c_self_collision){return;}
		//アニメーションカウントを用いて自爆処理
		//_ENEMIESの全てのステータスを0にする。
		for(let _i=0;_i<_ENEMIES.length;_i++){
			_ENEMIES[_i]._status=0;
		}
		_GAME._setPlay(_this.audio_collision);
	}
	setWallCollision(){
		//壁を壊す
		let _this=this;
//		console.log(_this._status)
		if(_this.wall===undefined){return;}
		for(let _i=0;_i<_this.wall.length;_i++){
			let _w=_this.wall[_i];
			if(!_w.isalive){continue;}
			let _ec=_this.getEnemyCenterPosition();
			//壁を表示
			_CONTEXT.drawImage(
				_w.img,
				_this.x+_w.x,
				_this.y+_w.y,
				_w.img.width,
				_w.img.height
			);
			//壁を壊した場合
			if(_w.cs>=_this._status){
				_ENEMIES_COLLISIONS.push(
					new GameObject_ENEMY_COLLISION
					(_this.x+_w.x,_this.y+_w.y));
				_SCORE.set(500);
				_GAME._setPlay(_CANVAS_AUDIOS['enemy_collision5']);		
				_w.isalive=false;
			}
		}
	}
	moveDraw(){
		//画像を表示
		let _this=this;
		_CONTEXT.drawImage(
			_this.img,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
		);
	}
	move_Allset(){}
	isAllset(){
		let _this=this;
		if(_this.is_all_set){
			_this.set_wall_standBy();
			return true;
		}
		_this.move_Allset();
		return false;
	}
	isMove(){
		let _this=this;
		//move()判定処理
		//以下false（moveしない）
		//・スタンバイ中
		//・キャンバス外
		//・生存しない
		if(_this.isStandBy()){
			_this.move_standby();
			return false;
		}
		// if(_this.isCanvasOut()){
		// 	_this._status=0;
		// 	_this._isshow=false;			
		// 	return false;
		// }
		if(!_this.isshow()){
			return false;
		}
		if(!_this.isalive()){
			_this.showCollapes();
			return false;
		}
		return true;
	}
	move_before(){return false;}
	move(){}
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
	// constructor(_o,_o_boss,_x,_y){
	// 	super(_o,_x,_y);
	constructor(_p){
		super({
			img:_p.img,
			x:_p.x,
			y:_p.y
		});
		let _this=this;
		_this._initx=_p.x||0;//初期位置x
		_this._inity=_p.y||0;//初期位置y
		_this._boss=_p.boss;
		_this.x=_this._boss.x+_this._initx;//初期位置x
		_this.y=_this._boss.y+_this._inity;//初期位置y
		_this._status=10;
		_this.getscore=500;//倒した時のスコア
		_this.is_able_collision=false;
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision5'];

		//レーザーのみ当たり判定を通常の半分にする。
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;
	}
	setStandByDone(){
		//スタンバイ完了
		this._standby=false;
	}
	setDrawImage(){}//表示はボスが処理させる
	moveDraw(){
		let _this=this;
		if(!_this.isalive()){return;}
		let x=(_this._boss===undefined)?0:_this._boss.x;
		let y=(_this._boss===undefined)?0:_this._boss.y;
		
		_this.x=x+parseInt(_this._initx);
		_this.y=y+parseInt(_this._inity);

		_CONTEXT.drawImage(
			_this.img,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
		);
	}
	move(){}
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

		_this.wall=[
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_1'].obj,boss:_this,x:15,y:50}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_1'].obj,boss:_this,x:25,y:50}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_1'].obj,boss:_this,x:35,y:50}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_2'].obj,boss:_this,x:45,y:53}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_3'].obj,boss:_this,x:70,y:43})
		];
		_this._wall_statuses='';

		//壁の初期化
		for(let _i=0;_i<_this.wall.length;_i++){
			_ENEMIES.push(_this.wall[_i]);			
		}

		//攻撃無効を表示させる画像
		_this.c_z4_ani=30;
		_this.z4_ani=[
			{img:_CANVAS_IMGS['enemy_bigcore_4_1'].obj,al:1},
			{img:_CANVAS_IMGS['enemy_bigcore_4_2'].obj,al:0.8},
			{img:_CANVAS_IMGS['enemy_bigcore_4_3'].obj,al:0.6},
			{img:_CANVAS_IMGS['enemy_bigcore_4_4'].obj,al:0.4},
			{img:_CANVAS_IMGS['enemy_bigcore_4_5'].obj,al:0.2}
		];
		_this.tid=null;
		_this._moveYStop=false;

		_this.shotColMap=[
			"120,0,169,40,false",
			"120,70,169,114,false"
		];
		_this._collision_type='t9';

	}
	set_wall_standBy(){
		let _this=this;
		for(let _i=0;_i<_this.wall.length;_i++){
			_this.wall[_i].setStandByDone();
		}		
	}
	set_wall_status(){
		//壁オブジェクトのステータスを取得して変数に設定する。
		let _this=this;
		_this._wall_statuses='';
		//壁
		for(let _i=0;_i<_this.wall.length;_i++){
			_this._wall_statuses+=(_this.wall[_i].isalive())?1:0;
		}
	}
	show_walls(){
		let _this=this;		
		for(let _i=0;_i<_this.wall.length;_i++){
			if(_this.wall[_i-1]===undefined
				||_this.wall[_i-1]._status<=0){
				//直前の壁が破壊されない間、
				//自身のダメージは不可。
				_this.wall[_i].is_able_collision=true;
			}
			_this.wall[_i].moveDraw();
		}
	}
	shot(){
		let _this=this;
		if(Math.random()>0.02){return;}
		_this._moveYStop=true;
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_LASER({x:_this.x,y:_this.y,img:_CANVAS_IMGS['enemy_bullet_z'].obj}));
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_LASER({x:_this.x,y:_this.y+35,img:_CANVAS_IMGS['enemy_bullet_z'].obj}));
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_LASER({x:_this.x,y:_this.y+70,img:_CANVAS_IMGS['enemy_bullet_z'].obj}));
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_LASER({x:_this.x,y:_this.y+105,img:_CANVAS_IMGS['enemy_bullet_z'].obj}));
		_GAME._setPlay(_CANVAS_AUDIOS['enemy_bullet_laser']);		
		_this.tid=setTimeout(function(){
			_this._moveYStop=false;
			clearTimeout(_this.tid);
		},100);
	}
	move_Allset(){
		let _this=this;
		_this.x-=4;

		if(_this.x<_CANVAS.width
			-_this.img.width-80){
			_this.is_all_set=true;
		}
	}
	move_before(){return false;}
	move_standby(){
		//スタンバイ状態
		let _this=this;
		if(_this.move_before()){return;}
		_this.x-=4;
		if(_this.x<_CANVAS.width){
			_this._standby=false;
		}
	}
	setDrawImage(){
		let _this=this;
		_this.moveDraw();
		_this.show_walls();		
	}
	move(){
		let _this=this;
		if(!_this.isMove()){return;}
		if(!_this.isAllset()){return;}

		_this.y+=(_this._moveYStop)?0:_this.speed;
		_this.speed=(_this.y<50
						||_this.y+_this.img.height>450)
						?_this.speed*-1
						:_this.speed;

		_this.shot();
		_this.set_wall_status();

		if(_this._wall_statuses.indexOf('1')===-1){
			//全ての壁が壊れたら敵全部のステータスを0にする。
			_this._status=0;
			_this.setAlive();
		}

		//自爆準備
		if(_this._c>=3000){
			let _ec=_this.getEnemyCenterPosition();
			//ショットを無効にする
			_this.is_able_collision=false;
			_this.c_z4_ani=(_this.c_z4_ani>0)
					?_this.c_z4_ani-1
					:0;
			let _img=_this.z4_ani[parseInt(_this.c_z4_ani/6)].img;
			_CONTEXT.drawImage(
				_img,
				_ec._x-(_img.width/2),
				_ec._y-(_img.height/2),
				_img.width,
				_img.height
			);

		}
		//自爆
		_this.setSelfCollision();

		_this._c++;

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
		_this.speed=2;
		_this.is_able_collision=false;
		_this.wall_up=[
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:90,y:38}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:95,y:38}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:100,y:38}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:105,y:38}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_core'].obj,boss:_this,x:110,y:36})
		];
		_this.wall_down=[
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:90,y:95}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:95,y:95}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:100,y:95}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_wall'].obj,boss:_this,x:105,y:95}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore2_core'].obj,boss:_this,x:110,y:93})
		];
		_this._wall_up_statuses='';
		_this._wall_down_statuses='';

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
				_CONTEXT.drawImage(
					img,
					parseInt(this.st/3)*_w,
					0,
					_w,
					_h,
					_this.x+this.x,
					_this.y+this.y,
					_w,
					_h
				);
			}
		};
		//噴射画像の表示定義（下）
		_this.back_img_down={
			x:200,y:-120,st:0,flag:true,
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
				_CONTEXT.save();
				_CONTEXT.setTransform(1,0,0,-1,0,_this.y*2+img.height);
				_CONTEXT.drawImage(
					img,
					parseInt(this.st/3)*_w,
					0,
					_w,
					_h,
					_this.x+this.x,
					_this.y+this.y,
					_w,
					_h
				);
				_CONTEXT.restore();
			}
		};

		//攻撃無効を表示させる画像
		_this.c_z4_ani=30;
		_this.z4_ani=[
			{img:_CANVAS_IMGS['enemy_bigcore_4_1'].obj,al:1},
			{img:_CANVAS_IMGS['enemy_bigcore_4_2'].obj,al:0.8},
			{img:_CANVAS_IMGS['enemy_bigcore_4_3'].obj,al:0.6},
			{img:_CANVAS_IMGS['enemy_bigcore_4_4'].obj,al:0.4},
			{img:_CANVAS_IMGS['enemy_bigcore_4_5'].obj,al:0.2}
		];
		_this.tid=null;
		_this._moveYStop=false;

		_this.shotColMap=["130,0,240,156,false"];
		_this._collision_type='t9';

		//壁の初期化（上）
		for(let _i=0;_i<_this.wall_up.length;_i++){
			_ENEMIES.push(_this.wall_up[_i]);			
		}
		//壁の初期化（下）
		for(let _i=0;_i<_this.wall_down.length;_i++){
			_ENEMIES.push(_this.wall_down[_i]);			
		}

		//上の手初期化
		_this.hands_up=[
			new ENEMY_BOSS_BIGCORE2_HANDS({"_initx":-52,"_inity":-30,"_dir":_DEF_DIR._U,"_boss":_this})
		];
		_ENEMIES.push(_this.hands_up[0]);		
		//下の手初期化
		_this.hands_down=[
			new ENEMY_BOSS_BIGCORE2_HANDS({"_initx":-52,"_inity":75,"_dir":_DEF_DIR._D,"_boss":_this})
		];
		_ENEMIES.push(_this.hands_down[0]);
		_this._hands_open_flag=false;

//		_this._c_self_collision=100;

	}
	init(){
		this._isshow=false;
		this._status=0;
	}
	set_wall_standBy(){
		let _this=this;
		for(let _i=0;_i<_this.wall_up.length;_i++){
			_this.wall_up[_i].setStandByDone();
		}		
		for(let _i=0;_i<_this.wall_down.length;_i++){
			_this.wall_down[_i].setStandByDone();
		}		
	}
	set_wall_status(){
		//壁オブジェクトのステータスを取得して変数に設定する。
		let _this=this;
		_this._wall_up_statuses='';
		_this._wall_down_statuses='';
		//上の壁
		for(let _i=0;_i<_this.wall_up.length;_i++){
			_this._wall_up_statuses+=(_this.wall_up[_i].isalive())?1:0;
		}
		//下の壁
		for(let _i=0;_i<_this.wall_down.length;_i++){
			_this._wall_down_statuses+=(_this.wall_down[_i].isalive())?1:0;
		}
	}
	shot(){
		//ショット
		//カウント150で1周
		let _this=this;
		let _ec=_this.getEnemyCenterPosition();
		let _pc=_PLAYERS_MAIN.getPlayerCenterPosition();

		if(_this._c%150===0){//自機動かす
			_this._moveYStop=false;		
		}
		if(_this._c%150>50&&_this._c%150<99){//自機止める
			_this._moveYStop=true;
		}
		if(_this._c%150===51){
			_this._hands_open_flag=(Math.abs(_pc._y-_ec._y)<100);
//			console.log(_this._hands_open_flag)
			if(_this._hands_open_flag){
				//腕を開く
				for(let _i=_this.hands_up.length-1;_i>=0;_i--){
					//上を表示
					_this.hands_up[_i].isHandsOpen=true;
				}
				for(let _i=_this.hands_down.length-1;_i>=0;_i--){
					//下を表示
					_this.hands_down[_i].isHandsOpen=true;
				}
			}
		}
		if(_this._c%150===70){
			//止まってショットを放つ
//			console.log(_this._hands_open_flag)
			if(_this._hands_open_flag){
				if(_this._wall_up_statuses.indexOf('1')!==-1){
					//上の壁が全て破壊されたらショットしない
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+85,y:_this.y-75}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+70,y:_this.y-45}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+120,y:_this.y-20}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+100,y:_this.y+0}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+80,y:_this.y+25}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+60,y:_this.y+45}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x,y:_this.y+55}));	
				}
				if(_this._wall_down_statuses.indexOf('1')!==-1){
					//下の壁が全て破壊されたらショットしない
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x,y:_this.y+85}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+60,y:_this.y+95}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+80,y:_this.y+115}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+100,y:_this.y+135}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+120,y:_this.y+160}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+70,y:_this.y+170}));
					_ENEMIES_SHOTS.push(new ENEMY_SHOT_LASER({x:_this.x+85,y:_this.y+200}));
				}
			}else{
				if(_this._wall_up_statuses.indexOf('1')!==-1){
					_ENEMIES_SHOTS.push(
						new ENEMY_SHOT_LASER({x:_this.x+60,y:_this.y+20}));
					_ENEMIES_SHOTS.push(
						new ENEMY_SHOT_LASER({x:_this.x,y:_this.y+55}));
				}
				if(_this._wall_down_statuses.indexOf('1')!==-1){
					_ENEMIES_SHOTS.push(
						new ENEMY_SHOT_LASER({x:_this.x,y:_this.y+95}));
					_ENEMIES_SHOTS.push(
						new ENEMY_SHOT_LASER({x:_this.x+60,y:_this.y+130}));
				}
			}
			_GAME._setPlay(_CANVAS_AUDIOS['enemy_bullet_laser']);
		}
		if(_this._c%150===110){
			//開いた腕を閉じる
			for(let _i=_this.hands_up.length-1;_i>=0;_i--){
				//上を表示
				_this.hands_up[_i].isHandsClose=true;
			}
			for(let _i=_this.hands_down.length-1;_i>=0;_i--){
				//下を表示
				_this.hands_down[_i].isHandsClose=true;
			}			
		}
	}
	move_Allset(){
		let _this=this;
		_this.x-=4;
		_this.moveDraw();

		_this.back_img_up.s2();
		_this.back_img_up.f();
		_this.back_img_down.s2();
		_this.back_img_down.f();

		//上の壁を表示
		for(let _i=0;_i<_this.wall_up.length;_i++){
			_this.wall_up[_i].moveDraw(_this);
		}
		//下の壁を表示
		for(let _i=0;_i<_this.wall_down.length;_i++){
			_this.wall_down[_i].moveDraw(_this);
		}
		//上を表示
		for(let _i=_this.hands_up.length-1;_i>=0;_i--){
			_this.hands_up[_i].moveDraw(_this);
		}
		//下を表示
		for(let _i=_this.hands_down.length-1;_i>=0;_i--){
			_this.hands_down[_i].moveDraw(_this);
		}

		if(_this.x<_CANVAS.width
				-_this.img.width
				-80){
			_this.is_all_set=true;
		}
	}
	move_standby(){
		//スタンバイ状態
		let _this=this;
		if(_this.move_before()){return;}
		_this.x-=4;
		if(_this.x<_CANVAS.width){
			_this._standby=false;
		}
	}
	show_walls(){
		let _this=this;
		//上の壁を表示
		for(let _i=0;_i<_this.wall_up.length;_i++){
			if(_this.wall_up[_i-1]===undefined
				||_this.wall_up[_i-1]._status<=0){
				//直前の壁が破壊されない間、
				//自身のダメージは不可。
				_this.wall_up[_i].is_able_collision=true;
			}
			_this.wall_up[_i].moveDraw(_this);
		}
		//下の壁を表示
		for(let _i=0;_i<_this.wall_down.length;_i++){
			if(_this.wall_down[_i-1]===undefined
				||_this.wall_down[_i-1]._status<=0){
				//直前の壁が破壊されない間、
				//自身のダメージは不可。
				_this.wall_down[_i].is_able_collision=true;
			}
			_this.wall_down[_i].moveDraw(_this);
		}		
	}
	setDrawImage(){
		let _this=this;
		//自身を表示
		_this.moveDraw();
		_this.show_walls();
		//上を表示
		for(let _i=_this.hands_up.length-1;_i>=0;_i--){
			_this.hands_up[_i].moveDraw(_this);
		}
		//下を表示
		for(let _i=_this.hands_down.length-1;_i>=0;_i--){
			_this.hands_down[_i].moveDraw(_this);
		}
		
	}
	move(){
		let _this=this;
		if(!_this.isMove()){return;}
		if(!_this.isAllset()){return;}
			
//		console.log(_this._moveYStop)
		_this.y+=(_this._moveYStop)?0:_this.speed;
		_this.speed=(_this.y<50
					||_this.y+_this.img.height>450)
					?_this.speed*-1
					:_this.speed;

		_this.shot();

		(_this.speed>0&&!_this._moveYStop)
			?_this.back_img_up.s1()
			:_this.back_img_up.s2();
		_this.back_img_up.f();

		(_this.speed<0&&!_this._moveYStop)
			?_this.back_img_down.s1()
			:_this.back_img_down.s2();
		_this.back_img_down.f();

		_this.set_wall_status();

		//上を表示
		for(let _i=_this.hands_up.length-1;_i>=0;_i--){
			//上の壁を全部壊したら、腕を動かさない。
			if(_this._wall_up_statuses.indexOf('1')===-1
				&&!_this.hands_up[_i].is_hand_stop()){
				_GAME._setPlay(_this.audio_collision);
				_this.hands_up[_i].set_hand_stop();
			}			
		}
		//下を表示
		for(let _i=_this.hands_down.length-1;_i>=0;_i--){
			//下の壁を全部壊したら、腕を動かさない。
			if(_this._wall_down_statuses.indexOf('1')===-1
				&&!_this.hands_down[_i].is_hand_stop()){
				_GAME._setPlay(_this.audio_collision);
				_this.hands_down[_i].set_hand_stop();
			}
		}

		if(_this._wall_up_statuses.indexOf('1')===-1
			&&_this._wall_down_statuses.indexOf('1')===-1){
			//全ての壁が壊れたら敵全部のステータスを0にする。
			for(let _i=_this.hands_up.length-1;_i>=0;_i--){
				_this.hands_up[_i]._status=0;
			}
			for(let _i=_this.hands_down.length-1;_i>=0;_i--){
				_this.hands_down[_i]._status=0;
			}
			_this._status=0;
			_this.setAlive();
		}

		//自爆準備
		// if(_this._c>=3000){
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
		//自爆
		_this.setSelfCollision();

		_this._c++;

	}
}
//ビックコアマーク2の手定義
class ENEMY_BOSS_BIGCORE2_HANDS
	extends GameObject_ENEMY{
	constructor(_d){
		super({
			img:_CANVAS_IMGS['enemy_bigcore2_hand'].obj,
			x:_d._initx,
			y:_d._inity
		});
		let _this=this;
		_this._initx=_d._initx||0;//初期位置x
		_this._inity=_d._inity||0;//初期位置y
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

		_this._boss=new Object();
		_this.direct=_d._dir||_DEF_DIR._U;

		_this.shotColMap=[//衝突判定（下の定義を使って動的に設定）
			(function(){
				if(_this.direct===_DEF_DIR._U){//上
					return "0,30,250,110,false";
				}
				if(_this.direct===_DEF_DIR._D){//下
					return "0,30,250,110,false";
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
		_this.imgs=[0,250,500];//手のイメージ定義
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
	showCollapes(){}
	setStatus(){this._status=0;}
	is_hand_stop(){return this.isstop;}
	set_hand_stop(){
		this.isstop=true;
	}
	move_hands_open(){
		//手をオープンする。
		let _this=this;
		if(!_this.isHandsOpen){return;}
		//停止フラグで動きを固定状態
		if(_this.isstop){return;}
		let _ar=_this.imgsPos[parseInt(_this._c/6)];
//		_this.img=_ar.img;//画像表示
//console.log(_ar);
		_this.imgs_x=parseInt(_ar.x);
		_this.imgs_y=parseInt(_ar.y);
		//腕に合わせて衝突判定を設定する
		_this.shotColMap=[];
		let _shotColAr=_this.shotColMapTmp[parseInt(_this._c/6)];
		for(let _i=0;_i<_shotColAr.length;_i++){
			_this.shotColMap.push(_shotColAr[_i]);
		}
// 		console.log(_this.shotColMap)
		if(_this._c>=_this.imgs.length*6-1){
			_this._c=_this.imgs.length*6-1;
			_this.isHandsOpen=false;
			return;
		}
		_this._c++;
	}
	setDrawImage(){}
	move_hands_close(){
		//手をクローズする。
		let _this=this;
		if(!_this.isHandsClose){return;}
		//停止フラグで動きを固定状態
		if(_this.isstop){return;}
		let _ar=_this.imgsPos[parseInt(_this._c/6)];
//		_this.img=_this.imgs[parseInt(_this._c/6)].img;//画像表示
		_this.imgs_x=parseInt(_ar.x);
		_this.imgs_y=parseInt(_ar.y);
		//腕に合わせて衝突判定を設定する
		_this.shotColMap=[];
		let _shotColAr=_this.shotColMapTmp[parseInt(_this._c/6)];
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
	moveDraw(_boss){
		let _this=this;
		_this._boss=_boss;
		_this.move_hands_open();
		_this.move_hands_close();
		_this.x=_this._boss.x+parseInt(_this._initx)+_this.imgs_x;
		_this.y=_this._boss.y+parseInt(_this._inity)+_this.imgs_y;

		_CONTEXT.save();
		_this.setDrawImageDirect();
		_CONTEXT.drawImage(
			_this.img,
			_this.imgs[parseInt(_this._c/6)],
			0,
			_this.width,
			_this.height,
			_this.x,
			_this.y,
			_this.width,
			_this.height
		);

		if(_ISDEBUG){
			_CONTEXT.strokeStyle='rgba(200,200,255,0.5)';
			_CONTEXT.beginPath();
			_CONTEXT.rect(
					_this.x,
					_this.y,
					_this.width,
					_this.height
			);
			_CONTEXT.stroke();	
		}
		_CONTEXT.restore();
	}
	move(){}
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
		// constructor(_x,_y){
		// 	super(_CANVAS_IMGS['enemy_cristalcore'].obj,_x,_y);	
		constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_cristalcore'].obj,
			x:_p.x,
			y:_p.y
		});
		let _this=this;
		_this._status=70;
		_this.speed=3;

		_this.wall=[
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_cristalcore_wall1'].obj,boss:_this,x:47,y:116}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,boss:_this,x:62,y:116}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,boss:_this,x:77,y:116}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,boss:_this,x:92,y:116}),
			new ENEMY_BOSS_WALL({img:_CANVAS_IMGS['enemy_bigcore_3'].obj,boss:_this,x:102,y:115})
		];
		_this._wall_statuses='';

		//攻撃無効を表示させる画像
		_this.c_z4_ani=30;
		_this.z4_ani=[
			{img:_CANVAS_IMGS['enemy_bigcore_4_1'].obj,al:1},
			{img:_CANVAS_IMGS['enemy_bigcore_4_2'].obj,al:0.8},
			{img:_CANVAS_IMGS['enemy_bigcore_4_3'].obj,al:0.6},
			{img:_CANVAS_IMGS['enemy_bigcore_4_4'].obj,al:0.4},
			{img:_CANVAS_IMGS['enemy_bigcore_4_5'].obj,al:0.2}
		];

		_this._collision_type='t9';
		_this.is_able_collision=false;

//		_this._count=0;
		_this._shot_count=0;
		_this.shotColMap=[
			"25,0,227,10,false",
			"25,242,227,250,false",
			"160,0,227,250,false"
		];

		//壁の初期化
		for(let _i=0;_i<_this.wall.length;_i++){
			_ENEMIES.push(_this.wall[_i]);			
		}

		_this.hands_up=[
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_ignore_collision":true,"_initx":50,"_inity":80,"_cmr":60,"_cmsr":70,"_initRad":40,"_data":"0,0,180,10","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_ignore_collision":true,"_initx":50,"_inity":80,"_cmr":70,"_cmsr":80,"_initRad":70,"_data":"0,0,185,5","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":50,"_inity":80,"_cmr":80,"_cmsr":100,"_initRad":100,"_data":"0,0,180,-10","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":50,"_inity":80,"_cmr":89,"_cmsr":125,"_initRad":130,"_data":"0,0,175,-25","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":50,"_inity":80,"_cmr":97,"_cmsr":145,"_initRad":160,"_data":"0,0,170,-40","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":50,"_inity":80,"_cmr":106,"_cmsr":160,"_initRad":190,"_data":"0,0,165,-55","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_img":_CANVAS_IMGS['enemy_cristalcore_hand2'].obj,
												"_initx":50,"_inity":80,"_cmr":115,"_cmsr":170,"_initRad":215,"_data":"0,0,160,-70","_change":true})
		];
		for(let _i=0;_i<_this.hands_up.length;_i++){
			_ENEMIES.push(_this.hands_up[_i]);		
		}

		_this.hands_down=[
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_ignore_collision":true,"_initx":50,"_inity":155,"_cmr":60,"_cmsr":70,"_initRad":40,"_data":"0,0,180,-10","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_ignore_collision":true,"_initx":50,"_inity":155,"_cmr":70,"_cmsr":80,"_initRad":70,"_data":"0,0,175,-5","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":50,"_inity":155,"_cmr":80,"_cmsr":100,"_initRad":100,"_data":"0,0,180,10","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":50,"_inity":155,"_cmr":89,"_cmsr":125,"_initRad":130,"_data":"0,0,185,25","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":50,"_inity":155,"_cmr":97,"_cmsr":145,"_initRad":160,"_data":"0,0,190,40","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_initx":50,"_inity":155,"_cmr":106,"_cmsr":160,"_initRad":190,"_data":"0,0,195,55","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_boss":_this,"_img":_CANVAS_IMGS['enemy_cristalcore_hand2'].obj,
												"_initx":50,"_inity":155,"_cmr":115,"_cmsr":170,"_initRad":215,"_data":"0,0,200,70","_change":false})
		];
		for(let _i=0;_i<_this.hands_down.length;_i++){
			_ENEMIES.push(_this.hands_down[_i]);		
		}

	}
	init(){}
	setDrawImageDirect(){}
	set_wall_standBy(){
		//壁へのショットを有効にする。
		let _this=this;
		for(let _i=0;_i<_this.wall.length;_i++){
			_this.wall[_i].setStandByDone();
		}		
	}
	set_wall_status(){
		//壁オブジェクトのステータスを取得して変数に設定する。
		let _this=this;
		_this._wall_statuses='';
		//壁
		for(let _i=0;_i<_this.wall.length;_i++){
			_this._wall_statuses+=(_this.wall[_i].isalive())?1:0;
		}
	}
	show_walls(_walls){
		let _this=this;		
		for(let _i=0;_i<_walls.length;_i++){
			if(_walls[_i-1]===undefined
				||_walls[_i-1]._status<=0){
				//直前の壁が破壊されない間、
				//自身のダメージは不可。
				_walls[_i].is_able_collision=true;
			}
			_walls[_i].moveDraw(_this);
		}
	}
	shot(){
		//レーザーを発射する
		let _this=this;

		_this._shot_count++;
		if(_this._c%1200>800){
			if(_this._shot_count<10){return;}			
		}else if(_this._c%1200<=800){
			if(_this._shot_count<50){return;}
		}
		_this._shot_count=0;
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_LASER({x:_this.x,y:_this.y+111}));
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_LASER({x:_this.x,y:_this.y+140}));
		_GAME._setPlay(_CANVAS_AUDIOS['enemy_bullet_laser']);
	}
	showCollapes(){
		let _this=this;
		//敵を倒した場合
		_this._isshow=false;
		//触手の上を表示
		for(let _i=_this.hands_up.length-1;_i>=0;_i--){
			_this.hands_up[_i].showCollapes(
				_this.hands_up[_i].x,
				_this.hands_up[_i].y
			);
			_this.hands_up[_i].init();
		}
		//触手の下を表示
		for(let _i=_this.hands_down.length-1;_i>=0;_i--){
			_this.hands_down[_i].showCollapes(
				_this.hands_down[_i].x,
				_this.hands_down[_i].y
			);
			_this.hands_down[_i].init();
		}

		//爆発して終了
		_ENEMIES_COLLISIONS.push(
			new GameObject_ENEMY_COLLISION
			(_this.x+(_this.img.width/2),
				_this.y+(_this.img.height/2),
				_this._collision_type));
	}
	isAllset(){
		//準備完了判定処理
		let _this=this;
		if(_this.is_all_set){
			_this.set_wall_standBy();
			return true;
		}
		_this.move_Allset();
		return false;
	}
	move_Allset(){
		//準備完了状態
		let _this=this;
		_this.y-=4;
		//触手の上を表示
		for(let _i=_this.hands_up.length-1;_i>=0;_i--){
			_this.hands_up[_i].moveDraw(_this);
		}
		//触手の下を表示
		for(let _i=_this.hands_down.length-1;_i>=0;_i--){
			_this.hands_down[_i].moveDraw(_this);
		}
		_this.moveDraw();
		_this.set_wall_status();
		_this.show_walls(_this.wall);

		if(_this.y<200){
			_this.is_all_set=true;
		}
	}
	move_standby(){
		//スタンバイ状態
		let _this=this;
		if(_this.move_before()){return;}
		_this.y-=4;
		if(_this.y<_CANVAS.height){
			_this._standby=false;
		}
	}
	setDrawImage(){
		let _this=this;
		_this.moveDraw();
		_this.show_walls(_this.wall);		
	}
	move(){
		let _this=this;
//		console.log(_this._c)
		if(!_this.isMove()){return;}
		if(!_this.isAllset()){return;}

		_this.y+=_this.speed;
		if(_this._c%1200>800){
			//連射中はバウンドタイミングを変更させる
			if(_this._c%45===0){
				_this.speed*=-1;
			}
		}
		if(_this.y+_this.img.height>_CANVAS.height
			||_this.y<0){
			_this.speed*=-1;
		}

		//触手の上を表示
		for(let _i=_this.hands_up.length-1;_i>=0;_i--){
			_this.hands_up[_i].moveDraw(_this);
		}
		//触手の下を表示
		for(let _i=_this.hands_down.length-1;_i>=0;_i--){
			_this.hands_down[_i].moveDraw(_this);
		}

		_this.shot();
		_this.set_wall_status();

		if(_this._wall_statuses.indexOf('1')===-1){
			//全ての壁が壊れたら敵全部のステータスを0にする。
			//触手の上
			for(let _i=_this.hands_up.length-1;_i>=0;_i--){
				_this.hands_up[_i]._status=0;
			}
			//触手の下
			for(let _i=_this.hands_down.length-1;_i>=0;_i--){
				_this.hands_down[_i]._status=0;
			}
			_this._status=0;
			_this.setAlive();
		}

		//自爆
		_this.setSelfCollision();
		_this._c++;
	}
}
//クリスタルコアの手定義
class ENEMY_BOSS_CRYSTALCORE_HANDS
	extends GameObject_ENEMY{
	constructor(_d){
		super({
			img:_CANVAS_IMGS['enemy_cristalcore_hand1'].obj,
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
		_this.img=_d._img||_CANVAS_IMGS['enemy_cristalcore_hand1'].obj;//手の画像

		_this._count_turn=0;//手をふる回数
		_this._change=_d._change;//true:上向き,false:下向き
		_this._standby=true;
		_this._standby_tmp=_d._standby||false;
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
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_CRYSTALCORE({
				x:_this.x+10,
				y:_this.y+10,
				deg:parseInt(_d[3])
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
		//	_CONTEXT.beginPath();
		let _d=_this._data.split(',');
		let _ix=_this._initx;
		let _iy=_this._inity;
		let rad=parseInt(_d[3])*Math.PI/180;
		let cx=_this._boss.x+parseInt(_d[0])+_ix+_this.img.width;
		let cy=_this._boss.y+parseInt(_d[1])+_iy+parseInt(_this.img.height/1.5);

		_this.x=_this._boss.x+parseInt(_d[0])+_ix;
		_this.y=_this._boss.y+parseInt(_d[1])+_iy;

		_CONTEXT.save();
		_CONTEXT.setTransform(Math.cos(rad),Math.sin(rad),
							-Math.sin(rad),Math.cos(rad),
							cx-cx*Math.cos(rad)+cy*Math.sin(rad),
							cy-cx*Math.sin(rad)-cy*Math.cos(rad));
		_CONTEXT.drawImage(
			_this.img,
			_this._boss.x+parseInt(_d[0])+_ix,
			_this._boss.y+parseInt(_d[1])+_iy,
			_this.img.width,
			_this.img.height
		);
		_CONTEXT.restore();
	}
	moveDraw(_o){
		//move()によって調整された状態からCANVASに描画する。
		let _this=this;
//		console.log(_this._count_turn)
		if(!_o.is_all_set){return;}
		_this.shot();
		_this.move_hands();
		_this._standby=false;
		_this._c++;
	}
	//moveはmain.jsから処理させない
	move(){

	}
}


//====================
//　ボスクリスタルコア パターン2
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//====================
class ENEMY_BOSS_CRYSTALCORE_PT2
			extends ENEMY_BOSS_CRYSTALCORE{
		// constructor(_x,_y){
		// 	super(_x,_y);
		constructor(_p){
		super({
			x:_p.x,
			y:_p.y
		});
		let _this=this;
		_this._showout_cube=0;
		_this._standby_count=0;
		_this._complete_cube_count=0;
		_this._map_col_reset=false;
		_this._cube_shot_max=100;
	}
	move_before(){
		//スタンバイ状態。
		//クリスタルを放つ
		let _this=this;
		let _as='';
		let _f=function(){
			//透明つき画像表示と
			//全クリスタルのステータスを取得する。
			let _e=_ENEMIES;
			for(let _i=0;_i<_e.length;_i++){
				if(!ENEMY_BOSS_CUBE.prototype.isPrototypeOf(_e[_i])){continue;}
				_e[_i].alpha=_this.alpha;
				_as+=(_e[_i]._stop===true)?'1':'0';
			}
		}

		_f(_this.alpha);
//		console.log(_as)
		if(_as.indexOf('0')!==-1){
			//0が一つもない（全て停止状態時）
			//透明をコントロールさせる
			_this._complete_cube_count=_this._standby_count;
		}
		//クリスタルを放つ
		if(_this._standby_count%40===0){
			if(_this._showout_cube<_this._cube_shot_max){
				let _c=new ENEMY_BOSS_CUBE({
					x:1000,
					y:(Math.random()*(500-100))+50
				});
				_ENEMIES.push(_c);
				_this._showout_cube++;	
			}
		}
		let _c=_this._standby_count
				-_this._complete_cube_count;
		if(_c===50){_this.alpha=0.7;}
		if(_c===100){_this.alpha=0.3;}
		if(_c===150){_this.alpha=0;}
		if(_this.alpha===0){
			_MAP.set_mapdef_col_clear();
			return false;
		}
		_this._standby_count++;
		return true;
	}
}

class ENEMY_BOSS_CUBE
		extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_cube'].obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0,45,90,135],
			aniItv:10,
			width:45,
			height:45
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

		//自機に向かう用の変数
		_this.tx=0;
		_this.ty=0;
		_this.rad=0//自身と相手までのラジアン
		_this.deg=0//自身と相手までの角度
		_this.sx=0;//単位x
		_this.sy=0;//単位y

	}
	isCanvasOut(){
		return _GAME.isEnemyCanvasOut(
			this,{up:true,down:true,left:true,right:true}
		);
	}
	isMove(){
		//生存判定を外した形で
		//オーバーライド		
		let _this=this;
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
		let _eb=_ENEMIES;
		for(let _i=0;_i<_eb.length;_i++){
			if(!ENEMY_BOSS_CUBE.prototype.isPrototypeOf(_eb[_i])){continue;}
			if(_this.id===_eb[_i].id){continue;}//自身の判定はしない
			if(!_eb[_i]._stop){continue;}

			//キューブ同士の衝突判定
			let _r=_GAME.isSqCollision(
				'10,10,35,35',
				_this.x+','+_this.y,
				['10,10,35,35'],
				_eb[_i].x+','+_eb[_i].y
			);
			if(_r!==_IS_SQ_NOTCOL){return true;}
		}
		return false;
	}
	setDrawImage(){
		let _this=this;
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			imgPosx:_this.imgPos[parseInt(_this._col_c/_this.aniItv)],
			width:_this.width,
			alpha:_this.alpha,
			basePoint:1
		});		
	}
	moveDraw(){
		let _this=this;
		//衝突完了済み
		if(_this._stop===true){return;}
		//衝突判定
		if(_this.x<0
			||_this.y<0
			||_this.y+50>_CANVAS.height
			||_this.move_bounds()){
			let _ec=_this.getEnemyCenterPosition();
			//衝突マップに反映させる
			_MAP.set_mapdef_col(
				_MAP.getMapX(_ec._x),
				_MAP.getMapY(_ec._y),
				'1'
			);	
			_this._status=0;
			_this._stop=true;
			_GAME._setPlay(_this.audio_collision);
			return;
		}

		//登場時
		if(_this._c<_this.change_speed_c){_this.x-=_this.speed;}
		//切り替えて自機へ
		if(_this._c===_this.change_speed_c){
			//ここは自機へ向かわせる切替の準備
			_this.tx=_PLAYERS_MAIN.getPlayerCenterPosition()._x;
			_this.ty=_PLAYERS_MAIN.getPlayerCenterPosition()._y;
			_this.rad=//自身と相手までのラジアン
				Math.atan2(
					(_this.ty-_this.y),
					(_this.tx-_this.x));
			_this.deg=//自身と相手までの角度
				_this.rad*180/Math.PI;
			_this.sx=Math.cos(_this.rad);//単位x
			_this.sy=Math.sin(_this.rad);//単位y
			_this.speed=10;
		}
		//自機に向けて一気に加速
		if(_this._c>_this.change_speed_c){
			_this.x+=_this.sx*_this.speed;
			_this.y+=_this.sy*_this.speed;
		}

		//スプライトのアニメーション対応
		_this._col_c=
			(_this._col_c>=(_this.imgPos.length*8)-1)?0:_this._col_c+1;
	}
	move(){
		let _this=this;
		if(_this.alpha===0){_this.init();return;}
		if(!_this.isMove()){return;}
		_this.moveDraw();
		_this._c++;
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
// 				let _p=_PLAYERS_MAIN.getPlayerCenterPosition();
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
					if(this._pos_same_count<100){return;}
					
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
			_ENEMIES.push(_this.parts[_i]);
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
			//身体を拡散させる
			_this.parts[_i].is_frame_heads_collision=true;
		}

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
	move_standby(){
		//スタンバイ状態
		let _this=this;
//		if(_this.move_before()){return;}
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
		// console.log('_this._deg:'+_this._deg);

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
		
		//マップ位置を取得
		_this.movePos.move();
		//マップ位置より方向を決定させる
		_this.moves_pt[_this._mpt].move();

		if(!_this._f&&!_this.parts[0].isalive()){
//			_this.parts[0].showCollapes();
//			_this.showCollapes(_this.moves[0].x,_this.moves[0].y);

			//先頭の頭を破壊した場合は、
			//動きを全て反転させる
			_this._f=true;
			_this.parts.reverse();
			_this.moves.reverse();
			_this.x=_this.moves[0].x;
			_this.y=_this.moves[0].y;
			_this.parts[0].setDirect(_DEF_DIR._R);
			_this._deg=_this.moves[0].deg+180;
			_this.moves_pt[_this._mpt].switch(0);
			_this._mpt=0;
		}

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
		_this._status=75;
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
			_ENEMIES_COLLISIONS.push(
				new GameObject_ENEMY_COLLISION(
					_e._x+(Math.random()*((Math.random()>0.5)?100:-100)),
					_e._y+(Math.random()*((Math.random()>0.5)?100:-100)),
					_this._collision_type)
				);	
		}
		_GAME._setPlay(_this.audio_collision);
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
			_ENEMIES_SHOTS.push(
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
	setDrawImage(){}
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
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x+(_this.img.width/4),
			y:_this.y+(_this.img.height/4),
			deg:_this._deg
		});
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

		_GAME._setDrawImage({
			img:_this.img,
			x:_this.getEnemyCenterPosition()._x,
			y:_this.getEnemyCenterPosition()._y,
			deg:_this._deg
		});
	}
	setDrawImage(){}
	moveDraw(_loc){
		let _this=this;
		let _c=parseInt(_this._c/20);

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
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.getEnemyCenterPosition()._x,
			y:_this.getEnemyCenterPosition()._y,
			deg:_this._deg,
			scale:_this.ani[_c].scale
		});

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
			_SCORE.set(_this.getscore);
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
			_ENEMIES_COLLISIONS.push(
				new GameObject_ENEMY_COLLISION(
					_o.x+Math.random()*100,
					_o.y+Math.random()*100,
					_this._collision_type)
			);		
			_GAME._setPlay(_this.audio_collision);
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
			_ENEMIES.push(_this.parts[_i]);
		}
		//細胞の目を敵クラスに追加
		_ENEMIES.push(_this.parts_eye);
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
		_ENEMIES_COLLISIONS.push(
			new GameObject_ENEMY_COLLISION(
				_this.x+_this.width/2,
				_e._y,
				_this._collision_type)
			);
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
		let _deg=_GAME.getDeg(_PLAYERS_MAIN,_this);
		for(let _i=-30;_i<=30;_i=_i+30){
			_ENEMIES_SHOTS.push(
				new GameObject_ENEMY_SHOT({
					x:_this.x+20,
					y:this.getEnemyCenterPosition()._y,
					img:_CANVAS_IMGS['enemy_bullet_cell'].obj,
					imgPos:[0,15],
					width:15,
					speed:3,
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
		_GAME._setPlay(_this.audio_alive);
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
		_this._status=150;

		//攻撃無効を表示させる画像
		_this.c_z4_ani=30;
		_this.z4_ani=[
			{img:_CANVAS_IMGS['enemy_bigcore_4_1'].obj,al:1},
			{img:_CANVAS_IMGS['enemy_bigcore_4_2'].obj,al:0.8},
			{img:_CANVAS_IMGS['enemy_bigcore_4_3'].obj,al:0.6},
			{img:_CANVAS_IMGS['enemy_bigcore_4_4'].obj,al:0.4},
			{img:_CANVAS_IMGS['enemy_bigcore_4_5'].obj,al:0.2}
		];
		_this.tid=null;

		_this.shotColMap=[
			"0,0,40,100",
			"40,0,230,140,false"
		];
		_this._collision_type='t9';
		_this.defSpeed=3;
		//前画像（スプライト）調整するための変数
		_this._front_imgPosx=0;
		//レーザをショットするまでの判別
		_this._isfirstbreak=false;

	}
	shot(){
		//特定のタイミングで発射させる
		let _this=this;
		//初回は無視する
		if(_this._c===0){return;}
		if(_this._isfirstbreak){
			//レーザーを発射させる
			_this._front_imgPosx=126;
			if(_this._c%250===210){
				//ここではデスを最後にdrawImageするため、
				//_ENEMIES配列の先頭にレーザーを挿入させる。
				_ENEMIES.unshift(
					new ENEMY_DEATH_LASER({
						x:_this.x+50,
						y:_this.y+35
					}));
				_GAME._setPlay(_CANVAS_AUDIOS['enemy_bullet_laser_long']);
			}
			return;
		}

		//前面が開くアニメーション
		if(_this._c%250>200&&_this._c%250<210){_this._front_imgPosx=42;}
		if(_this._c%250>210&&_this._c%250<230){_this._front_imgPosx=84;}		
		if(_this._c%250>230&&_this._c%250<240){_this._front_imgPosx=42;}
		if(_this._c%250>240&&_this._c%250<250){_this._front_imgPosx=0;}

		//弾を発射させる
		if(_this._c%250===210){
//			console.log('shot!');
			for(let _i=0;_i<5;_i++){
				_ENEMIES_SHOTS.push(
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

		_this.moveDraw();
		if(_this.x<_CANVAS.width
			-_this.img.width-80){
			_this.is_all_set=true;
			_this.is_able_collision=true;
		}
	}
	isAllset(){
		let _this=this;
		if(_this.is_all_set){
//			_this.set_wall_standBy();
			return true;
		}
		_this.move_Allset();
		return false;
	}
	move_before(){return false;}
	move_standby(){
		//スタンバイ状態
		let _this=this;
		if(_this.move_before()){return;}
		_this.x-=4;
		if(_this.x<_CANVAS.width){
			_this._standby=false;
		}
	}
	setDrawImage(){
		let _this=this;
		if(!_this.isMove()){return;}
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			deg:_this.deg+180,
			basePoint:1
		});		
	}
	move(){
		//ここでは_this._cは250サイクルでアニメーションさせる
		let _this=this;

		_GAME._setDrawImage({
			img:_CANVAS_IMGS['enemy_death_front'].obj,
			x:_this.x,
			y:_this.y+34,
			imgPosx:_this._front_imgPosx,
			basePoint:1,
			width:42
		});

		if(!_this.isMove()){return;}
		if(!_this.isAllset()){return;}

		if(_this._isfirstbreak===false
			&&(_this._c>=2000
			||_this._status<=75)){
			_this._isfirstbreak=true;
			//爆発して終了
			_ENEMIES_COLLISIONS.push(
				new GameObject_ENEMY_COLLISION(
					_this.x,
					_this.y+65,
					't1')
			);
			_GAME._setPlay(_this.audio_collision);
		}

		let _p=_PLAYERS_MAIN.getPlayerCenterPosition();

		_this.speed=(()=>{
			if(_this._c%250>=200&&_this._c%250<249){return 0;}
			if(_this._c%50>=40&&_this._c%50<49){return 0;}
			if(_this._c%50===0){
				return (_p._y<_this.y+_this.height)
							?_this.defSpeed*-1
							:_this.defSpeed;
			}
			if(_this.y<0&&_this.speed<0){return _this.defSpeed;}	
			if(_this.y+_this.height>_CANVAS.height&&_this.speed>0){return _this.defSpeed*-1;}
			return _this.speed;
		})();
		_this.y+=_this.speed;
		_this.shot();

		//自爆
		_this.setSelfCollision();
		_this._c++;

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
		_this._isbroken=false;
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
		_CONTEXT.drawImage(
			_this.img,
			0,
			0,
			40,
			_this.height,
			_this.x,
			_this.y,
			40,
			_this.height		
		);
		//真ん中
		_CONTEXT.drawImage(
			_this.img,
			40,
			0,
			10,
			_this.height,
			_this.x+40,
			_this.y,
			_this.bossx-_this.x-25,
			_this.height		
		);
		//後方(width:70)
		_CONTEXT.drawImage(
			_this.img,
			70,
			0,
			70,
			_this.height,
			_this.bossx,
			_this.y,
			70,
			_this.height		
		);
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
		_this._status=20;
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
		_ENEMIES_COLLISIONS.push(
			new GameObject_ENEMY_COLLISION(
				_e._x,
				_e._y,
				_this._collision_type)
		);
		//他のボスをすべて爆発
		for(let _i=0;_i<_ENEMIES.length;_i++){
			let _o=_ENEMIES[_i];
			if(ENEMY_BOSS_MOAI.prototype.isPrototypeOf(_o)){continue;}
			_o._status=0;
		}
	}
	set_direct(_dir){
		let _this=this;
		if(_this._c===0){return;}
		if(_this._c%200>=170&&_this._c%200<180){
			_this.imgPosx=(_this._direct===_DEF_DIR._L)?_this.ani[4]:_this.ani[2];
			return;
		}
		if(_this._c%200>=180&&_this._c%200<190){
			_this.imgPosx=_this.ani[3];
			return;
		}
		if(_this._c%200>=190&&_this._c%200<200){
			_this.imgPosx=(_this._direct===_DEF_DIR._L)?_this.ani[2]:_this.ani[4];
			return;			
		}
		if(_this._c%200===0){
			_this._direct=(_this._direct===_DEF_DIR._L)?_DEF_DIR._R:_DEF_DIR._L;
		}
		_this.imgPosx=(_this._direct===_DEF_DIR._L)?_this.ani[5]:_this.ani[0];
	}
	shot(){
		let _this=this;

		//向き展開中はプチモアイを吐き出さない
		if(_this._c%200>=170&&_this._c%200<200){
			return;
		}
		//プチモアイを吐き出す
		let _num=0;
		for(let _i=0;_i<_ENEMIES.length;_i++){
			let _o=_ENEMIES[_i];
			if(ENEMY_BOSS_MOAI_MINI.prototype.isPrototypeOf(_o)){
				_num++;
				if(_num>20){return;}
			}
		}
		if(_this._c%50>=30&&_this._c%50<50){
			_this.imgPosx=(_this._direct===_DEF_DIR._L)?_this.ani[5]:_this.ani[0];
			_this._isopen=true;
		}else{
			_this.imgPosx=(_this._direct===_DEF_DIR._L)?_this.ani[6]:_this.ani[1];
			_this._isopen=false;
		}
		if(_this._c%30===20){
			let _e=_this.getEnemyCenterPosition();
			let _o=new ENEMY_BOSS_MOAI_MINI({x:_e._x,y:_e._y});
			_this.moai_mini.push(_o);
			_ENEMIES.push(_o);	
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
		if(_this.move_before()){return;}
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
	move(){
		let _this=this;
		if(!_this.isMove()){return;}
		if(!_this.isAllset()){return;}

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
		//プチモアイを吐き出す
		_this.shot();
		//プチモアイの操作
		for(let _i=0;_i<_ENEMIES.length;_i++){
			let _o=_ENEMIES[_i];
			if(ENEMY_BOSS_MOAI.prototype.isPrototypeOf(_o)){continue;}
			_o.setPos({x:_e._x,y:_e._y});
		}

		//自爆
		_this.setSelfCollision();
		_this._c++;

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
		_this._status=5;
		_this._radian=0;
		_this._radius=0;
		_this._standby=false;
		_this.audio_alive=_CANVAS_AUDIOS['enemy_collision3'];
		_this._collision_type='t2';
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;

	}
	shot(){
		let _this=this;
		//イオンリングを吐き出す
		if(_this._c!==0){return;}
		_ENEMIES.push(new ENEMY_moai_boss_ring({x:_this.x,y:_this.y}))
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
	move(){
		//敵の処理メイン
		let _this=this;
		_this.x=_MAP.getX(_this.x);
		_this.y=_MAP.getY(_this.y);
		if(!_this.isMove()){return;}
		_this.shot();
		_this._c=(_this._c>50)?0:_this._c+1;
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
		_this.speed=8.0;
		_this._collision_type='t2';
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=1;
		_this.getscore=100;//倒した時のスコア

	}
	setPos(){}//これは必要。
}
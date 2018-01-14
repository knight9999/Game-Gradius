//=====================================================
//	gradius_enemies.js
//	敵の定義
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

const _DEF_DIFFICULT=[
	{_ENEMY_SHOT_RATE:0.0001,_ENEMY_SHOT_SPEED:3,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.0005,_ENEMY_SHOT_SPEED:3,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.001,_ENEMY_SHOT_SPEED:5,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.004,_ENEMY_SHOT_SPEED:5,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.1,_ENEMY_SHOT_SPEED:5,_ENEMY_SPEED:2}
];
let _ENEMY_DIFFICULT=4;//主にデバッグ用。

const _ENEMY_DEF_ANI_COL={//衝突アニメーション定義
't0':{
	'intv':5,//アニメ間隔（数字が短いほどコマ送りが速い）
	'imgs':[//アニメ画像
		{img:_CANVAS_IMGS['enemy_collapes1'].obj,scale:0.3},
		{img:_CANVAS_IMGS['enemy_collapes2'].obj,scale:0.3},
		{img:_CANVAS_IMGS['enemy_collapes2'].obj,scale:0.3},
		{img:_CANVAS_IMGS['enemy_collapes2'].obj,scale:0.2},
		{img:_CANVAS_IMGS['enemy_collapes2'].obj,scale:0.2}
	]
},//t0
't1':{
	'intv':5,
	'imgs':[
		{img:_CANVAS_IMGS['enemy_collapes12'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes13'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes13'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes12'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes11'].obj,scale:1.0}
	]
},//t1
't2':{
	'intv':5,
	'imgs':[
		{img:_CANVAS_IMGS['enemy_collapes21'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes22'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes23'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes24'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes23'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes22'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes21'].obj,scale:1.0}
	]
},//t2
't8':{
	'intv':5,
	'imgs':[
		{img:_CANVAS_IMGS['enemy_collapes81'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes82'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes83'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes84'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes83'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes82'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes81'].obj,scale:1.0}
	]
},//t8
't9':{
	'intv':5,
	'imgs':[
		{img:_CANVAS_IMGS['enemy_collapes91'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes92'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes93'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes94'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes95'].obj,scale:1.0},
		{img:_CANVAS_IMGS['enemy_collapes96'].obj,scale:1.0}
	]
}//t9
}//_ENEMY_DEF_ANI_COL;

class GameObject_ENEMY_COLLISION{
	constructor(_x,_y,_type_ENEMY_DEF_ANI_COL){
		let _this=this;
		_this._c_anime_collosion=0;
		_this.x=_x||0;
		_this.y=_y||0;
		_this.type=_type_ENEMY_DEF_ANI_COL||'t0';
		_this._status=true;

	}
	isalive(){
		return this._status;
	}
	move(){
		let _this=this;
		let _imgs=_ENEMY_DEF_ANI_COL[_this.type].imgs;
		let _intv=_ENEMY_DEF_ANI_COL[_this.type].intv;
//		let _scale=ENEMY_DEF_ANI_COL[_this.type].scale;
		if(_this._c_anime_collosion>=
			_imgs.length*_intv-1){
			//アニメーションが終わったら終了
			_this._status=false;
			return;
		}

		let _a=_imgs[parseInt(_this._c_anime_collosion/_intv)];
		_this.x=_MAP.getX(_this.x);
		_this.y=_MAP.getY(_this.y);
		_CONTEXT.drawImage(
			_a.img,
			_this.x-parseInt(_a.img.width*_a.scale/2),
			_this.y-parseInt(_a.img.height*_a.scale/2),
			_a.img.width*_a.scale,
			_a.img.height*_a.scale
		);
		_this._c_anime_collosion++;
	}
}

//===========================================
//敵クラス
//（1）main.jsよりインスタンス＋初期化
//（2）main.jsからmove()で処理実行
//（3）isMove()で表示等の可否判定
//（4）爆発処理はshowCollapes()→ani_col()
//衝突判定は
// collision()
//===========================================
class GameObject_ENEMY{
	constructor(_o,_x,_y){
		let _this=this;
		_this.id=_ENEMIES.length;//敵の当たり判定用ID
		_this.bid=_ENEMIES_BOUNDS.length;//敵同士のバウンドID
		_this.gid=0;//敵のグループID
		_this.img=_o;//画像オブジェクト
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision1'];
		_this.audio_alive=_CANVAS_AUDIOS['enemy_collision3'];
		_this.x=_x||0;//X位置
		_this.y=_y||0;//Y位置
		
		_this.isshot=false;
		_this._DEF_DIR={//向き
			_U:0,//上
			_D:1,//下
			_R:2,//右
			_L:3,//左
			_LU:4,//左上
			_LD:5,//左下
			_RU:6,//右上
			_RD:7//右下
		}

		_this.speed=1;
		_this.getscore=200;
		_this._status=1;//生存ステータス
		_this._isshow=true;
        _this.direct=_this._DEF_DIR._U;//向きの設定
		_this.standby=true;//スタンバイ状態
		
		_this.haspc=false;

		_this.col_ani_c=0;
		_this.col_imgs=_ENEMY_DEF_ANI_COL.t0.imgs;//衝突アニメ画像
		_this.col_intv=_ENEMY_DEF_ANI_COL.t0.intv;//衝突アニメ間隔

		_this._collision_type='t0';

		_this.shotColMap=[
			"0,0,"+_this.img.width+","+_this.img.height
		];
		_this.col_date=null;//打たれた時間
		_this.col_canint=150;//連続ショット許可間隔
	}
	init(){}
	collision(_s_type,_num){
		//衝突処理
		//パラメータはあるが、デフォルトでは不要
		//ショットタイプ別に処理を分ける際は、
		//このクラスから継承する。
		//_s_type:自機のショットタイプ
		//_num:一度にヒットさせる値
		let _this=this;
		if(!_this.isCollision()){return;}
		_this.setStatus(_s_type,_num);
	}
	isCollision(){
		//衝突判定フラグ
		let _this=this;
		//250ミリ秒以内は無視する。
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
	setAlive(){
		let _this=this;
		if(!_this.isalive()){
			_SCORE.set(_this.getscore);
			_GAME._setPlay(_this.audio_collision);
		}else{
			_GAME._setPlay(_this.audio_alive);			
		}
	}
	setStatus(_s_type,_num){
		let _this=this;
		_this._status-=(function(_n){
			_n=_n||1;//デフォルトは1
			if(_s_type===_SHOTTYPE_MISSILE){
				//ミサイルは通常の2倍
				return 2;
			}else if(_s_type===_SHOTTYPE_RIPPLE_LASER){
				//リップルレーザーは通常の1.5倍
				return 1.5;
			}
			return _n;
		})(_num);
		_this.setAlive();
	}
	getEnemyCenterPosition(){
		return {_x:this.x+(this.img.width/2),
				_y:this.y+(this.img.height/2)}
	}
	isalive(){return (this._status>0);}
	isshow(){return this._isshow;}
	shot(){
		//キャンバス内でショットさせる
		if(_GAME.isEnemyCanvasOut(this)){return;}

		if(Math.random()>=
		_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SHOT_RATE){
			return;
		}

//		console.log(this.getEnemyCenterPosition()._x);
		//敵の中心から弾を発射させるための位置調整
		_ENEMIES_SHOTS.push(
			new GameObject_ENEMY_SHOT(
				this.getEnemyCenterPosition()._x,
				this.getEnemyCenterPosition()._y
				)
			);
	}
	get_move_bound_val(){
		return parseInt(Math.random()*(3-1)+1)*((Math.random()>0.5)?1:-1);
	}
	move_bounds(_e){
		//バウンド定義
		//敵同士ぶつかったときに跳ね返り動作をする
		let _this=this;
		let _eb=_ENEMIES_BOUNDS;
		if(!_this.isalive()){return;}
		if(_this.x>_CANVAS.width){return;}

		for(let _i=0;_i<_eb.length;_i++){
			if(!_eb[_i].isalive()){continue;}//生きていない場合は無視
			if(_eb[_i].x>_CANVAS.width){continue;}//キャンバスに入る前は無視
			if(_this.bid===_eb[_i].bid){continue;}//自身の判定はしない

			let _a=Math.sqrt(
				Math.pow(_this.getEnemyCenterPosition()._x
					-_eb[_i].getEnemyCenterPosition()._x,2)+
				Math.pow(_this.getEnemyCenterPosition()._y
					-_eb[_i].getEnemyCenterPosition()._y,2)
			);
			let _ms=_this.img.width/2;
			let _s=(_a<_ms)?true:false;
			if(_s){
//				console.log(_a);
				_this.speedx=_this.get_move_bound_val();
				_this.speedy=_this.get_move_bound_val();
				_eb[_i].speedx=_this.get_move_bound_val();
				_eb[_i].speedy=_this.get_move_bound_val();
			}
		}
	}
	setDrawImage(){
		let _this=this;
		_CONTEXT.save();
		_this.setDrawImageDirect();
		_CONTEXT.drawImage(
			_this.img,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
		);
		_CONTEXT.restore();
	}
	//===原則以下のメソッドのみ継承クラスが
	//===カスタマイズできる関数
	setDrawImageDirect(){
		//_CONTEXTを使った向きの調整
		// let rad = -180 * Math.PI/180; 
		// var cx = _this.x + _this.img.width/2;
        // var cy = _this.y + _this.img.height/2;
        // // 画像を中心にして回転
		// _CONTEXT.setTransform(Math.cos(rad), Math.sin(rad),
		// 					-Math.sin(rad), Math.cos(rad),
		// 					cx-cx*Math.cos(rad)+cy*Math.sin(rad),
		// 					cy-cx*Math.sin(rad)-cy*Math.cos(rad));
//		_CONTEXT.setTransform(-1,0,0,1,_this.x*2+_this.img.width,0);
		let _this=this;
		if(_this.direct===_this._DEF_DIR._U){
			_CONTEXT.setTransform(1,0,0,-1,0,_this.y*2+_this.img.height);
		}
		if(_this.direct===_this._DEF_DIR._LU){
			_CONTEXT.setTransform(-1,0,0,-1,_this.x*2+_this.img.width,_this.y*2+_this.img.height);
		}
		if(_this.direct===_this._DEF_DIR._LD){
			_CONTEXT.setTransform(-1,0,0,1,_this.x*2+_this.img.width,0);
		}
		return;
	}
	ani_col(_x,_y){
		let _this=this;
		if(!_this._isshow){return;}
		_ENEMIES_COLLISIONS.push(
			new GameObject_ENEMY_COLLISION
			(_this.x+(_this.img.width/2),
				_this.y+(_this.img.height/2),
				_this._collision_type));
		_this._isshow=false;
	}
	isStandBy(){
		return this.standby;
	}
	isCanvasOut(){
		//敵位置がキャンバス以外に位置されてるか。
		//※main.jsで、trueの場合は、
		//_IS_ENEMIES_COLLISION、
		//_ENEMIES内、インスタンスが削除される。
		//true:外れてる
		//false:外れていない
		let _this=this;
		if(_this.x+_this.img.width<-100
//			||_this.x+100>_CANVAS.width
//			||_this.y+_this.img.height<0
//			||_this.y>_CANVAS.height
		){
			return true;
		}
		return false;
	}
	showCollapes(_x,_y){
		let _this=this;
		//敵を倒した場合
		//自身はクローズ
		_this._isshow=false;
		if(_this.haspc){
			//パワーカプセルを持ってる場合は、
			//パワーカプセルを表示
			_POWERCAPSELLS.push(
				(new GameObject_POWERCAPSELL(_this.x,_this.y))
			);
			return;
		}
		//爆発して終了
		_ENEMIES_COLLISIONS.push(
			new GameObject_ENEMY_COLLISION
			(_this.x+(_this.img.width/2),
				_this.y+(_this.img.height/2),
				_this._collision_type));
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
		if(_this.isCanvasOut()){
			_this._status=0;
			_this._isshow=false;			
			return false;
		}
		if(!_this.isshow()){
			return false;
		}
		if(!_this.isalive()){
			_this.showCollapes();
			return false;
		}
		return true;
	}
	moveDraw(){
		//敵の描画メイン
		let _this=this;		
		_this.setDrawImage();
		//弾の発射
		_this.shot();
	}
	move_standby(){
		let _this=this;
		if(_this.x<_CANVAS.width-20){
			_this.standby=false;
		}
	}
	move(){
		//敵の処理メイン
		//原則継承はしない
		let _this=this;
		_this.x=_MAP.getX(_this.x);
		_this.y=_MAP.getY(_this.y);
		if(!_this.isMove()){return;}
		_this.moveDraw();
	}
}

class ENEMY_a extends GameObject_ENEMY{
    constructor(_x,_y,_d){
		super(_CANVAS_IMGS['enemy_a_1'].obj,_x,_y)
        let _this=this;
		_this._status=1;
        _this.direct=_d||_this._DEF_DIR._U;
        _this.defimg=[_CANVAS_IMGS['enemy_a_1'].obj,_CANVAS_IMGS['enemy_a_2'].obj];
	}
	setDrawImageDirect(){
		let _this=this;
		//向き・表示の設定
		if(_this.direct===_this._DEF_DIR._U){
			if(_PLAYERS_MAIN.x<_this.x){
				_CONTEXT.setTransform(1,0,0,-1,0,_this.y*2+_this.img.height);
			}else{
				_CONTEXT.setTransform(-1,0,0,-1,_this.x*2+_this.img.width,_this.y*2+_this.img.height);			
			}
		}
		if(_this.direct===_this._DEF_DIR._D){
			if(_PLAYERS_MAIN.x<_this.x){
				_CONTEXT.setTransform(1,0,0,1,0,0);
			}else{
				_CONTEXT.setTransform(-1,0,0,1,_this.x*2+_this.img.width,0);
			}
		}
	}
	moveDraw(){
		let _this=this;
		//砲台の向き設定
		_this.img=(Math.abs(_PLAYERS_MAIN.y-_this.y)>100)
		?_this.defimg[0]
		:_this.defimg[1];

		_this.setDrawImage();
		//弾の発射
		_this.shot();
	}
}

class ENEMY_b extends ENEMY_a{
	constructor(_x,_y,_d){
		super(_x,_y,_d);
        let _this=this;
        _this.direct=_d||_this._DEF_DIR._U;
		_this.haspc=true;
        _this.defimg=[_CANVAS_IMGS['enemy_b_1'].obj,_CANVAS_IMGS['enemy_b_2'].obj];
	}
}


class ENEMY_c extends GameObject_ENEMY{
	constructor(_x,_y,_d){
		super(_CANVAS_IMGS['enemy_c_1'].obj,_x,_y)
		let _this=this;
		_this.x=_x;
		_this.y=(_d===_this._DEF_DIR._D)
			?_y-((_CANVAS_IMGS['enemy_c_1'].obj.height)-_MAP.t)
			:_y;
		_this._st='_st1';
		_this._shot=false;
		_this._status=2;//ライフステータス
        _this.direct=_d||_this._DEF_DIR._U;

		_this._collision_type='t1';

		_this.speed=
			_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SPEED;
		_this._c_shotstep=0;
		_this.shotstep=[// ショットのアニメ定義
				{img:_CANVAS_IMGS['enemy_c_3'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_c_4'].obj,scale:1}
			];
		_this._c_walkstep=0;
		_this.walkstep=[//歩きのアニメ定義
				{img:_CANVAS_IMGS['enemy_c_1'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_c_2'].obj,scale:1}
			];
		_this._c_walk=0;
		let _p=_PLAYERS_MAIN;
		
        _this._ene_status={
		'_st1':{
			_f:function(){//walk
				if(_this._shot===true){return;}
				_this._c_walkstep=
					(_this._c_walkstep===20-1)
					?0
					:_this._c_walkstep+1;
				_this.img=_this.walkstep[parseInt(_this._c_walkstep/10)].img;

				_this._c_walk++;
			},
			_setX:function(){
				return _this.x+(_this.speed*2);
			}
        },//_st1
		'_st2':{
			_f:function(){//shot
				if(_this.x>=_CANVAS.width){return;}
				_this._shot=true;
				if(_this._c_shotstep>=20-1){
					_this.shot();
					_this._c_shotstep=0;
					_this._shot=false;
					_this._st='_st1';
					return;
				}
				_this._c_shotstep+=1;
				_this.img=
					_this.img=_this.shotstep[parseInt(_this._c_shotstep/10)].img;
			},
			_setX:function(){
				return _this.x;
			}
		}//_st2
        }//_ene_status
	}
	map_collition(){
		let _this=this;
		//中心座標取得
		let _e=_this.getEnemyCenterPosition();

		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_e._x);
		let _map_y=_MAP.getMapY(_e._y);

		//MAP左端では向きを右にきりかえる
		if(_MAP.isMapBefore(_map_x,_map_y)){
			_this.speed=Math.abs(_this.speed);
		}
		if(_MAP.isMapLastSide(_map_x,_map_y)){
			_this.speed=_this.speed*-1;
		}
		let _s=_MAP.t;
		//段差処理
		//左右にどちらかブロックがある
		_s=(Math.abs(_this.speed)*2);
		let _f=(_MAP.isMapCollision(_map_x+1,_map_y)
			||_MAP.isMapCollision(_map_x-1,_map_y));
		_this.y=(function(_t){
			if(_t.direct===_this._DEF_DIR._U){
				if(_f){return _t.y+_s;}
				return _t.y;
			}else if(_t.direct===_this._DEF_DIR._D){
				if(_f){return _t.y-_s;}
				return _t.y;
			}
		})(_this);

		//穴パターン
		_this.y=(function(_t){
			if(_t.direct===_this._DEF_DIR._U){
				//上に穴がある場合、敵を上にあげる
				if(!_MAP.isMapCollision(_map_x,_map_y-1)){
					return _t.y-_s;
				}
				return _t.y;
			}else if(_t.direct===_this._DEF_DIR._D){
				//下に穴がある場合、敵を下に下げる
				if(!_MAP.isMapCollision(_map_x,_map_y+1)){
					return _t.y+_s;
				}
				return _t.y;
			}
		})(_this);

	}
	setDrawImageDirect(){
		let _this=this;
		if(_this.direct===_this._DEF_DIR._U){
			if(_PLAYERS_MAIN.x<_this.x){
				_CONTEXT.setTransform(1,0,0,-1,0,_this.y*2+_this.img.height);
			}else{
				_CONTEXT.setTransform(-1,0,0,-1,_this.x*2+_this.img.width,_this.y*2+_this.img.height);			
			}
		}
		if(_this.direct===_this._DEF_DIR._D){
			if(_PLAYERS_MAIN.x<_this.x){
				_CONTEXT.setTransform(1,0,0,1,0,0);
			}else{
				_CONTEXT.setTransform(-1,0,0,1,_this.x*2+_this.img.width,0);
			}
		}
		return;
	}
	set_speed(){
		let _p=
			_PLAYERS_MAIN.getPlayerCenterPosition();

		if(this._c_walk>5000*Math.random()){
			this._c_walk=0;
			this.speed=(_p._x<this.x)
				?this.speed*-1
				:Math.abs(this.speed);
		}
	}
	shot(){
		let _this=this;
		//キャンバス内でショットさせる
		if(_GAME.isEnemyCanvasOut(_this)){return;}

		let _p=_PLAYERS_MAIN.getPlayerCenterPosition();
		let _e=_this.getEnemyCenterPosition();
		let _x=(_p._x>_e._x)?1:-1;
		let _y=(_this.direct===_this._DEF_DIR._U)?1:-1;
		_ENEMIES_SHOTS.push(
			new GameObject_ENEMY_SHOT2(
				_e._x,_e._y,_x,_y));
		_ENEMIES_SHOTS.push(
			new GameObject_ENEMY_SHOT2(
				_e._x,_e._y,_x,_y/2));
	}
	moveDraw(){
		let _this=this;		
		_this.map_collition();
		_this.set_speed();

		//_st1->walk, _st2->shot
		_this._st=(
			Math.random()<_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SHOT_RATE||
			_this._shot)
			?'_st2'
			:'_st1';
		_this._ene_status[_this._st]._f();
		_this.x=_this._ene_status[_this._st]._setX();		
		// _this.x=(function(_t){
		// 	if(_t._st==='_st1'){
		// 		//walk
		// 		return _t.x+(_this.speed*2);
		// 	}else if(_t._st==='_st2'){
		// 		//shot
		// 		return _t.x;
		// 	}
		// })(_this);

		_this.setDrawImage();

	}
}


class ENEMY_d extends GameObject_ENEMY{
	constructor(_x,_y,_d){
		super(_CANVAS_IMGS['enemy_d_1'].obj,_x,_y)
        let _this=this;
		_this._status=1;

		_this._col_c=0;
		_this.col=[//アニメ定義
			{img:_CANVAS_IMGS['enemy_d_1'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_d_2'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_d_3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_d_4'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_d_3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_d_2'].obj,scale:1}
		];
	}
	moveDraw(){
		let _this=this;

		_this.x+=-2;
		let _d=_this.x;//radのスピード
		let _v=Math.cos(_d*Math.PI/180);//縦幅調整
		_this.y+=_v;

		_this.img=(function(_t){
			_t._col_c=
				(_t._col_c>=(_t.col.length*5)-1)?0:_t._col_c+1;
			return _t.col[parseInt(_t._col_c/5)].img;
		})(_this)

		_CONTEXT.drawImage(
			_this.img,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
		);
		//弾の発射
		_this.shot();
	}
}

class ENEMY_e extends ENEMY_d{
	constructor(_x,_y,_d){
		super(_x,_y,_d);
		let _this=this;
		_this.haspc=true;
		_this._col_c=0;
		_this.col=[//アニメ定義
			{img:_CANVAS_IMGS['enemy_e_1'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_e_2'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_e_3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_e_4'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_e_3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_e_2'].obj,scale:1}
		];
		_this.defimg=_this.col;		
	}
}

class ENEMY_f extends GameObject_ENEMY{
	constructor(_x,_y,_d){
		super(_CANVAS_IMGS['enemy_f_1'].obj,_x,_y)
		let _this=this;
		_this._status=1;
		_this.haspc=false;
		_this._v=0;
		_this.direct=_d||_this._DEF_DIR._U;
		_this.speed=(_d===_this._DEF_DIR._U)
					?-0.05
					:0.05;
		_this._col_c=0;
		_this.col=[//アニメ定義
				{img:_CANVAS_IMGS['enemy_f_1'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_f_2'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_f_3'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_f_4'].obj,scale:1}
			];
	}
	getDir(){
		return (this.x>_CANVAS.width/2)?-1:0.5;
	}
	isStandBy(){
		let _this=this;
		if(!_this.standby){return false;}
		if(_this.x+_this.img.width>0){
			return true;
		}
		_this.standby=false;
		return false;
	}
	isCanvasOut(){
		let _this=this;
		if(_this.y+_this.img.height<0
			||_this.y>_CANVAS.height){
			return true;
		}
		return false;
	}
	shot(){
		let _this=this;
		//キャンバス内でショットさせる
		if(_GAME.isEnemyCanvasOut(_this)){return;}
		let _e=_this.getEnemyCenterPosition();
		_ENEMIES_SHOTS.push(//左
			new GameObject_ENEMY_SHOT(
				_e._x,
				_e._y,
				1,
				_e._y));
		_ENEMIES_SHOTS.push(//左上
			new GameObject_ENEMY_SHOT(
				_e._x,
				_e._y,
				_e._x-(_CANVAS.width/4),
				1));
		_ENEMIES_SHOTS.push(//上
			new GameObject_ENEMY_SHOT(
				_e._x,
				_e._y,
				_e._x,
				1));
		_ENEMIES_SHOTS.push(//右上
			new GameObject_ENEMY_SHOT(
				_e._x,
				_e._y,
				_e._x+(_CANVAS.width/4),
				1));
		_ENEMIES_SHOTS.push(//右
			new GameObject_ENEMY_SHOT(
				_e._x,
				_e._y,
				_CANVAS.width,
				_e._y));
		_ENEMIES_SHOTS.push(//右下
			new GameObject_ENEMY_SHOT(
				_e._x,
				_e._y,
				_e._x+(_CANVAS.width/4),
				_CANVAS.height));
		_ENEMIES_SHOTS.push(//下
			new GameObject_ENEMY_SHOT(
				_e._x,
				_e._y,
				_e._x,
				_CANVAS.height));		
		_ENEMIES_SHOTS.push(//左下
			new GameObject_ENEMY_SHOT(
				_e._x,
				_e._y,
				_e._x-(_CANVAS.width/4),
				_CANVAS.height));

	}
	moveDraw(){
		let _this=this;
//		console.log(_this.x)
		_this.x+=4*_this.getDir();		
		_this.y+=_this._v;
		_this._v+=_this.speed;

		//壁衝突判定
		let _e=_this.getEnemyCenterPosition();
		let _mx=_MAP.getMapX(_e._x);
		let _my=_MAP.getMapY(_e._y);
		if(_MAP.isMapCollision(_mx,_my)){
			_this._v+=_this.speed;
			_this._v*=-1;
		}

		_this.img=(function(_t){
			_t._col_c=
				(_t._col_c>=(_t.col.length*5)-1)?0:_t._col_c+1;
			return _t.col[parseInt(_t._col_c/5)].img;
		})(_this)

		_this.setDrawImage();		

		//弾の発射
		if(_this._v>0&&_this._v<0.05){_this.shot();}
	}
}

class ENEMY_g extends ENEMY_f{
	constructor(_x,_y,_d){
		super(_x,_y,_d);
		let _this=this;
		_this._status=1;
		_this.haspc=true;
		_this.col=[//アニメ定義
			{img:_CANVAS_IMGS['enemy_g_1'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_g_2'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_g_3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_g_4'].obj,scale:1}
		];
	}
}

//ハッチ
class ENEMY_m extends GameObject_ENEMY{
    constructor(_x,_y,_d){
		super(_CANVAS_IMGS['enemy_m_1'].obj,_x,_y)
		let _this=this;
		_this._status=4;
		_this._collision_type='t1';
        _this.direct=_d||_this._DEF_DIR._U;//向きの設定		
		_this.getscore=200;
		_this._col_c=0;

		_this._isopen=false;
		_this._open_count=0;

		_this.col=[//アニメ定義
			{img:_CANVAS_IMGS['enemy_m_1'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_2'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_4'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_2'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_1'].obj,scale:1}
		];

		_this.col2=[//アニメ定義
			{img:_CANVAS_IMGS['enemy_m_5'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_6'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_7'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_8'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_7'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_6'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_5'].obj,scale:1}
		];

	}
	moveDraw(){
		let _this=this;
		if(!_this.isalive()){
			_this.showCollapes(
				0,
				(_this.direct===_this._DEF_DIR._U)?0:-_MAP.t
			);			
			return;
		}

		_this.img=(function(_t){
			//画像オブジェクト設定（残り1）
			let _t_col=(_t._status<=1)
						?_t.col2
						:_t.col;
			//閉じてる状態
			if(!_t._isopen){
				//開くタイミングを設定
				if(_this.x>=690&&_this.x<700){_this._isopen=true;}
				if(_this.x>=380&&_this.x<400){_this._isopen=true;}
				return _t_col[0].img;
			}

			//以下は開いてる状態
			_t._open_count++;
			if(parseInt(_t._col_c/5)===3&&_t._open_count<=200){
				return _t_col[parseInt(_t._col_c/5)].img;
			}			
			if(_t._open_count>200){
				// _t._col_c++;
				// return _t.col[parseInt(_t._col_c/5)].img;
				if(_t._col_c>=(_t_col.length*5)-1){
					_t._col_c=0;
					_t._open_count=0;
					_t._isopen=false;
				}	
			}
			_t._col_c=
				(_t._col_c>=(_t_col.length*5)-1)?0:_t._col_c+1;
			return _t_col[parseInt(_t._col_c/5)].img;
		})(_this);

		//オブジェクト追加
		(function(_t){
			if(!_t._isopen){return;}
			if(_t._open_count%15!==0){return;}
			let _cls=new ENEMY_m_small(_this.x+15,_this.y,_this.direct);
			_ENEMIES.push(_cls);
		})(_this);
		
		_this.setDrawImage();		
		
	}
}

//ハッチ（吐き出し）
class ENEMY_m_small extends GameObject_ENEMY{
	constructor(_x,_y,_d){
		super(_CANVAS_IMGS['enemy_m_11'].obj,_x,_y);
		let _this=this;
		_this._status=1;
        _this.direct=_d||_this._DEF_DIR._U;//向きの設定		
		_this.getscore=100;
		_this._col_c=0;
		_this.col=[//アニメ定義
			{img:_CANVAS_IMGS['enemy_m_11'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_12'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_13'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_14'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_15'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_16'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_m_17'].obj,scale:1}
		]; 
		_this._change=false;
		_this._moveX=0;
		_this._moveY=0;
		
	}
	moveDraw(){
		let _this=this;

		let _p=_PLAYERS_MAIN.getPlayerCenterPosition();
		_this._change=(function(){
			if(_this._change){return true;}
			if(_this.direct===_this._DEF_DIR._U){
				if(_p._y<_this.y){
					_this._moveX=(_p._x<_this.x)
					?_BACKGROUND_SPEED*-3
					:_BACKGROUND_SPEED*3
					return true;
				}
			}
			if(_this.direct===_this._DEF_DIR._D){
				if(_p._y>_this.y){
					_this._moveX=(_p._x<_this.x)
					?_BACKGROUND_SPEED*-3
					:_BACKGROUND_SPEED*3
					return true;
				}
			}
			return false;
		})();
		_this._moveY=(function(){
			if(_this._change){return 0;}
			if(_this.direct===_this._DEF_DIR._U){
				return 2;
			}
			if(_this.direct===_this._DEF_DIR._D){
				return -2;
			}
		})();

		_this.x+=_this._moveX;
		_this.y+=_this._moveY;

		_this.img=(function(_t){
			_t._col_c=
				(_t._col_c>=(_t.col.length*5)-1)?0:_t._col_c+1;
			return _t.col[parseInt(_t._col_c/5)].img;
		})(_this)

		_CONTEXT.drawImage(
			_this.img,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
		);
		//弾の発射
		_this.shot();
	}
}

//火山（上）
class ENEMY_n extends GameObject_ENEMY{
    constructor(_x,_y){
		super(_CANVAS_IMGS['enemy_o_1'].obj,_x,_y);
	}
	isCanvasOut(){
		//特定位置で火山を止める
		let _this=this;
		if(_this.x<200){return true;}
		return false;
	}		
	isalive(){
		//永続性にする。自身が破壊されない。
		return true;
	}
	moveDraw(){
		let _this=this;
		//オブジェクト追加
		if(Math.random()>0.1){return;}
		let _cls=new ENEMY_n_small(
					_CANVAS_IMGS[
						(['enemy_o_1','enemy_o_2'])
							[((Math.random()>0.5)?1:0)]
						].obj,_this.x,_this.y
					);
		_ENEMIES.push(_cls);
	}
}

//火山（下）
class ENEMY_o extends ENEMY_n{
    constructor(_d,_x,_y){
		super(_d,_x,_y);
	}
	moveDraw(){
		let _this=this;
		//オブジェクト追加
		if(Math.random()>0.1){return;}
		let _cls=new ENEMY_o_small(
					_CANVAS_IMGS[
						(['enemy_o_1','enemy_o_2'])
							[((Math.random()>0.5)?1:0)]
						].obj,_this.x,_this.y
					);
		_ENEMIES.push(_cls);
	}
}

//火山吐き出し（下）
class ENEMY_o_small extends GameObject_ENEMY{
    constructor(_d,_x,_y){
		super(_d,_x,_y)
		let _this=this;
		_this._status=1;
		_this.getscore=100;
		_this.speedX=Math.random()*(5-1)+1;//火山スピード（X軸）
		_this.flagX=Math.random()>0.5?1:-1;//火山X軸向き（>0:右,<0:左）
		_this.speedY=0.2;//火山スピード(Y軸)
		_this._v=-10;//火山の高さ調整

		_this._collision_type='t2';
	}
	map_collition(){
		let _this=this;
		let _e=_this.getEnemyCenterPosition();
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_e._x);
		let _map_y=_MAP.getMapY(_e._y);
		if(_MAP.isMapCollision(_map_x,_map_y-1)){
			_this._status=0;
		}
	}
	moveDraw(){
		let _this=this;
		_this.map_collition();
		_this.x-=
			_BACKGROUND_SPEED
			+(_this.speedX*_this.flagX);
		_this.y+=_this._v;
		_this._v+=_this.speedY;
		
		_CONTEXT.drawImage(
			_this.img,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
		);
	}
}

//火山吐き出し（上）
class ENEMY_n_small extends ENEMY_o_small{
    constructor(_d,_x,_y){
		super(_d,_x,_y);
		let _this=this;
		_this.speedY=-0.2;//火山スピード(Y軸)		
		_this._v=10;//火山の高さ調整
	}
	map_collition(){
		let _this=this;
		let _e=_this.getEnemyCenterPosition();
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_e._x);
		let _map_y=_MAP.getMapY(_e._y);
		if(_MAP.isMapCollision(_map_x,_map_y+1)){
			_this._status=0;
		}
	}
}

//クリスタル
class ENEMY_p extends GameObject_ENEMY{
    constructor(_x,_y,_d){
		super(
			_CANVAS_IMGS['enemy_p_1'].obj,_x,_y
		)
		this._status=4;
		this.getscore=100;
		this.speedx=_BACKGROUND_SPEED;
		this.speedy=
			(Math.random()+1)
			*((Math.random()>0.5)?1:-1);
		this._isbroken=false;
		this.isshot=false;
	}
	setAlive(){
		let _this=this;
		if(_this.isalive()){return;}
		_SCORE.set(_this.getscore);
	}
	map_collition(){
		let _this=this;
		//中心座標取得
		let _e=_this.getEnemyCenterPosition();
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_e._x);
		let _map_y=_MAP.getMapY(_e._y);

		if(_MAP.isMapCollision(_map_x,_map_y-1)
			||_MAP.isMapCollision(_map_x,_map_y+1)){
			_this.speedx=(Math.random()>0.4)
				?Math.abs(_this.speedx)
				:_this.speedx*-1;
			_this.speedy=(Math.random()>0.4)
				?Math.abs(_this.speedy)
				:_this.speedy*-1;
		}

	}
	showCollapes(){
		let _this=this;
		let _cp=_this.getEnemyCenterPosition();
		if(_this._status<=0&&!_this._isbroken){
			for(let _i=0;_i<6;_i++){
				//オブジェクト追加
				let _cls=
					new ENEMY_p_small(
						_CANVAS_IMGS[
							(['enemy_p_2',
								'enemy_p_2',
								'enemy_p_3',
								'enemy_p_4',
								'enemy_p_5',
								'enemy_p_5'])[_i]
							].obj,
						_cp._x+([-60,-30,-10,10,30,60])[_i],
						_cp._y+([-60,-30,-10,10,30,60])[_i]
						);
				_ENEMIES.push(_cls);
				_ENEMIES_BOUNDS.push(_cls);
			}
			_this._isbroken=true;
			_this._isshow=false;
			_GAME._setPlay(_CANVAS_AUDIOS['enemy_collision4']);
			return;
		}
	}
	moveDraw(){
		let _this=this;
		
		_this.map_collition();
		_this.move_bounds();
		_this.x-=(function(_t){
			if(_t.x+_t.img.width>_CANVAS.width){
				_t.speedx=Math.abs(_t.speedx);
			}
			return _t.speedx;
		})(_this);
		_this.y+=(function(_t){
			if(_t.y<0){
				_t.speedy=Math.abs(_t.speedy);
			}else if(_t.y+_t.img.height>_CANVAS.height){
				_t.speedy=-1;
//				console.log(_t.speedy);
			}
			return _t.speedy;
		})(_this);

		_CONTEXT.drawImage(
			_this.img,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
		);
	}
}
//クリスタル（分裂）
class ENEMY_p_small extends GameObject_ENEMY{
    constructor(_d,_x,_y){
		super(_d,_x,_y);
		let _this=this;
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision5'];		
		_this._status=5;
		_this.getscore=500;
		_this.speedx=_this.get_move_bound_val();
		_this.speedy=_this.get_move_bound_val();

		_this._collision_type='t1';
	}
	setAlive(){
		let _this=this;
		if(_this.isalive()){return;}
		_SCORE.set(_this.getscore);
		_GAME._setPlay(_CANVAS_AUDIOS['enemy_collision5']);
	}
	map_collition(){
		let _this=this;
		//中心座標取得
		let _e=_this.getEnemyCenterPosition();
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_e._x);
		let _map_y=_MAP.getMapY(_e._y);

		if(_MAP.isMapCollision(_map_x,_map_y-1)
			||_MAP.isMapCollision(_map_x,_map_y+1)){
			_this.speedx=(_this.speedx<=0)
				?Math.abs(_this.speedx)
				:_this.speedx*-1;
			_this.speedy=(_this.speedy<=0)
				?Math.abs(_this.speedy)
				:_this.speedy*-1;
		}

	}
	moveDraw(){
		let _this=this;

		_this.map_collition();
		_this.move_bounds();

		_this.x-=(function(_t){
			if(_t.x+_t.img.width>_CANVAS.width){
				_t.speedx=1.5;
			}
			return _t.speedx;
		})(_this);
		_this.y+=(function(_t){
			if(_t.y<0){
				_t.speedy=Math.abs(_t.speedy);
			}else if(_t.y+_t.img.height>_CANVAS.height){
				_t.speedy=-1.5;
			}
			return _t.speedy;
		})(_this);

		_CONTEXT.drawImage(
			_this.img,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
		);
	}
}

//モアイ（立）
class ENEMY_q extends GameObject_ENEMY{
	constructor(_x,_y,_d){
		super(_CANVAS_IMGS['enemy_m_a_1'].obj,_x,_y)
        let _this=this;
		_this._status=2;
        _this.direct=_d||_this._DEF_DIR._U;
		_this.getscore=500;
		
		_this._isSetMapDefCol=false;
		_this._isopen=false;
		_this._open_count=0;
		_this.imgs=[
			_CANVAS_IMGS['enemy_m_a_1'].obj,
			_CANVAS_IMGS['enemy_m_a_2'].obj
		];
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision5'];		
		_this._collision_type='t8';
		//衝突時のY座標アニメーション
		_this._collision_posy=(_this.direct===_this._DEF_DIR._D)?25:0;

		_this.shotColMap=[
			(function(){
			if(_this.direct===_this._DEF_DIR._D){return "0,50,45,85";}
			if(_this.direct===_this._DEF_DIR._U){return "0,25,45,60";}
			if(_this.direct===_this._DEF_DIR._LD){return "65,50,100,85";}
			if(_this.direct===_this._DEF_DIR._LU){return "65,25,100,60";}
			})()
		];

	}
	collision(_s_type,_num){
		let _this=this;
		//イオンリングを発したときに当たり判定させる
		if(!_this._isopen){return;}
		if(!_this.isCollision()){return;}
		_this.setStatus(_s_type,_num);
	}
	isShot(){
		let _this=this;
		if(_this._status<=0){return false;}
		if(_GAME.isEnemyCanvasOut(_this)){return false;}
		if(Math.abs(_PLAYERS_MAIN.y-_this.y)>200){return false;}
		if(_this.direct===_this._DEF_DIR._LU
			||_this.direct===_this._DEF_DIR._LD){
			if(_PLAYERS_MAIN.x<_this.x){return false;}
		 }
		return true;
	}
	shot(){
		let _this=this;

		if(!_this._open_count>0&&!_this.isShot()){
		}else{
			_this._open_count++;			
		}
		if(_this._open_count>0){
			_this.img=_this.imgs[1];
			_this._isopen=true;
		}
		if(_this._open_count>200){
			_this.img=_this.imgs[0];
			_this._isopen=false;
			_this._open_count=-100;
		}

		if(_this._open_count<=0){return;}
		if(_this._open_count%15!==0){return;}		
		_ENEMIES.push(
			new ENEMY_qr(
				_CANVAS_IMGS['enemy_m_y_1'].obj,
				_this.x+parseInt(_this.shotColMap[0].split(',')[0]),
				_this.y+parseInt(_this.shotColMap[0].split(',')[1])
				)
		);
//		console.log(_this._open_count)
	}
	showCollapes(){
		let _this=this;
		_this.img=_CANVAS_IMGS['enemy_m_z'].obj;
		_this.setDrawImage();
	
		//爆発後にMAP衝突用の内容を変更する
		if(_this._isSetMapDefCol){return;}
		_MAP.set_mapdef_col(
		_MAP.getMapX(_this.x),
		_MAP.getMapY(_this.y),
		(function(){
			if(_this.direct===_this._DEF_DIR._D){return "0000,0000,0000,1111";}
			if(_this.direct===_this._DEF_DIR._U){return "1111,0000,0000,0000";}
			if(_this.direct===_this._DEF_DIR._LD){return "0000,0000,0000,1111";}
			if(_this.direct===_this._DEF_DIR._LU){return "1111,0000,0000,0000";}
			})()
		);
		_ENEMIES_COLLISIONS.push(
			new GameObject_ENEMY_COLLISION
			(_this.x+(_this.img.width/2),
				_this.y+(_this.img.height/2)+_this._collision_posy,
				_this._collision_type));
	
		_this._isSetMapDefCol=true;
	}
	moveDraw(){
		let _this=this;
		_this.setDrawImage();
		//弾の発射
		_this.shot();
	}
}

//モアイ（横）
class ENEMY_r extends ENEMY_q{
	constructor(_x,_y,_d){
		super(_x,_y,_d)
        let _this=this;
		_this._status=2;
		_this.direct=_d||_this._DEF_DIR._U;
		_this.imgs=[
			_CANVAS_IMGS['enemy_m_b_1'].obj,
			_CANVAS_IMGS['enemy_m_b_2'].obj
		];
		_this.img=_this.imgs[0];
		
		_this.col_imgs=_ENEMY_DEF_ANI_COL.t8.imgs;//衝突アニメ画像
		_this.col_intv=_ENEMY_DEF_ANI_COL.t8.intv;//衝突アニメ間隔

		//衝突時のY座標アニメーション
		_this._collision_posy=(_this.direct===_this._DEF_DIR._D)?-10:0;

		_this.shotColMap=[
			(function(){
				if(_this.direct===_this._DEF_DIR._D){return "20,40,50,85";}
				if(_this.direct===_this._DEF_DIR._U){return "20,25,50,70";}
				})()
			];
	}
}

//モアイ（リング）
class ENEMY_qr extends GameObject_ENEMY{
	constructor(_x,_y,_d){
		super(_x,_y,_d)
        let _this=this;
		_this._status=1;
		_this.direct=_d||_this._DEF_DIR._U;
		_this.imgs_c=0;
		_this.imgs=[//アニメ定義
			_CANVAS_IMGS['enemy_m_y_1'].obj,
			_CANVAS_IMGS['enemy_m_y_2'].obj
		];
		_this.img=_this.imgs[0];
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision2'];		
		_this.tx=_PLAYERS_MAIN.getPlayerCenterPosition()._x;
		_this.ty=_PLAYERS_MAIN.getPlayerCenterPosition()._y;
		_this.rad=
			Math.atan2((_this.ty-_this.y),(_this.tx-_this.x));
		_this.sx=Math.cos(_this.rad);
		_this.sy=Math.sin(_this.rad);
		_this.speed=1;

		_this._collision_type='t2';
		((_this.direct===_this._DEF_DIR._D)?-10:0);
	}
	map_collition(){
		let _this=this;
		let _e=_this.getEnemyCenterPosition();
 		let _map_x=_MAP.getMapX(_e._x);
 		let _map_y=_MAP.getMapY(_e._y);
		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this._status=0;
		}
	}
	moveDraw(){
		let _this=this;
		_this.map_collition();
		_this.x+=_this.sx*_MAPDEFS[_MAP_PETTERN]._speed;
		_this.y+=_this.sy*_MAPDEFS[_MAP_PETTERN]._speed;
		_this.img=(function(_c){
			_this.imgs_c=(_c>=(_this.imgs.length*10)-1)?0:_c+1;
			return _this.imgs[parseInt(_this.imgs_c/10)];
		})(_this.imgs_c);
		_this.setDrawImage();
	}
}

class GameObject_ENEMY_BOSS extends GameObject_ENEMY{
	constructor(_o,_x,_y){
		super(_o,_x,_y);
		let _this=this;
		_this.speed=0;
		_this.starttime=0;
		_this._c=0;//アニメーションカウント
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision6'];

		_this.is_done_move_init=false;//初期移動フラグ
		_this.is_able_collision=false;//衝突可能フラグ
	}
	init(){
		let _this=this;
		_this.starttime=new Date().getTime();
		_this.move();
	}
	shot(){}
	move_init(){}
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
	move(){}
}


//====================
//　ボス ビックコア
//	_x:ボスの初期x位置
//	_y:ボスの初期y位置
//====================
class ENEMY_BOSS_BIGCORE
			extends GameObject_ENEMY_BOSS{
	constructor(_x,_y){
		super(_CANVAS_IMGS['enemy_bigcore'].obj,_x,_y);
		let _this=this;
		_this._status=70;
		_this.getscore=10000;
		_this.speed=3;
		_this.img=_CANVAS_IMGS['enemy_bigcore'].obj;
 		_this.wall=[
			{img:_CANVAS_IMGS['enemy_bigcore_1'].obj,cs:60,isalive:true,x:15,y:50},
			{img:_CANVAS_IMGS['enemy_bigcore_1'].obj,cs:50,isalive:true,x:25,y:50},
			{img:_CANVAS_IMGS['enemy_bigcore_1'].obj,cs:40,isalive:true,x:35,y:50},
			{img:_CANVAS_IMGS['enemy_bigcore_2'].obj,cs:30,isalive:true,x:45,y:53},
			{img:_CANVAS_IMGS['enemy_bigcore_3'].obj,cs:0,isalive:true,x:70,y:43},
		];

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
			"0,40,100,70",
			"50,0,169,40,false",
			"50,70,169,114,false"
		];
		_this._collision_type='t9';

	}
	shot(){
		let _this=this;
		if(Math.random()>0.02){return;}
		_this._moveYStop=true;
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_Z(_this.x,_this.y));
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_Z(_this.x,_this.y+35));
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_Z(_this.x,_this.y+70));
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_Z(_this.x,_this.y+105));
		_GAME._setPlay(_CANVAS_AUDIOS['enemy_bullet_laser']);		
		_this.tid=setTimeout(function(){
			_this._moveYStop=false;
			clearTimeout(_this.tid);
		},100);
	}
	move_standby(){
		//スタンバイ状態
		let _this=this;
		_this.x-=4;

		_this.moveDraw();
		_this.setWallCollision();

		if(_this.x<_CANVAS.width-_this.img.width-80){
			_this.standby=false;
			_this.is_able_collision=true;
		}
	}
	move(){
		let _this=this;
		if(!_this.isMove()){return;}

		_this.shot();
			
		_this.y+=(_this._moveYStop)?0:_this.speed;
		_this.speed=(_this.y<50
					||_this.y+_this.img.height>450)
					?_this.speed*-1
					:_this.speed;

		_this.moveDraw();
		_this.setWallCollision();

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
		if(_this._c>=4000){_this._status=0;return;}

//		console.log(_this._c);
		_this._c++;

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
	constructor(_x,_y){
		super(_CANVAS_IMGS['enemy_cristalcore'].obj,_x,_y);
		let _this=this;
		_this._status=70;
		_this.speed=2;
		_this.speed_hands=2;

		_this.getscore=10000;
		_this.wall=[
			{img:_CANVAS_IMGS['enemy_cristalcore_wall1'].obj,cs:60,isalive:true,x:47,y:116},
			{img:_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,cs:50,isalive:true,x:62,y:116},
			{img:_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,cs:40,isalive:true,x:77,y:116},
			{img:_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,cs:30,isalive:true,x:92,y:116},
			{img:_CANVAS_IMGS['enemy_bigcore_3'].obj,cs:0,isalive:true,x:102,y:115},
		];

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

		_this._count=0;
		_this._shot_count=0;
		_this.shotColMap=[
			"25,110,100,152",
			"25,0,227,110,false",
			"25,152,227,250,false",
			"135,110,227,250,false"
		];

		_this.hands_up=[
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":80,"_cmr":60,"_cmsr":70,"_initRad":40,"_data":"0,0,180,10","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":80,"_cmr":70,"_cmsr":80,"_initRad":70,"_data":"0,0,185,5","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":80,"_cmr":80,"_cmsr":100,"_initRad":100,"_data":"0,0,180,-10","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":80,"_cmr":89,"_cmsr":125,"_initRad":130,"_data":"0,0,175,-25","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":80,"_cmr":97,"_cmsr":145,"_initRad":160,"_data":"0,0,170,-40","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":80,"_cmr":106,"_cmsr":160,"_initRad":190,"_data":"0,0,165,-55","_change":true}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_img":_CANVAS_IMGS['enemy_cristalcore_hand2'].obj,
												"_initx":50,"_inity":80,"_cmr":115,"_cmsr":170,"_initRad":215,"_data":"0,0,160,-70","_change":true})
		];
		for(let _i=0;_i<_this.hands_up.length;_i++){
			_ENEMIES.push(_this.hands_up[_i]);		
		}

		_this.hands_down=[
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":155,"_cmr":60,"_cmsr":70,"_initRad":40,"_data":"0,0,180,-10","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":155,"_cmr":70,"_cmsr":80,"_initRad":70,"_data":"0,0,175,-5","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":155,"_cmr":80,"_cmsr":100,"_initRad":100,"_data":"0,0,180,10","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":155,"_cmr":89,"_cmsr":125,"_initRad":130,"_data":"0,0,185,25","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":155,"_cmr":97,"_cmsr":145,"_initRad":160,"_data":"0,0,190,40","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_initx":50,"_inity":155,"_cmr":106,"_cmsr":160,"_initRad":190,"_data":"0,0,195,55","_change":false}),
			new ENEMY_BOSS_CRYSTALCORE_HANDS({"_img":_CANVAS_IMGS['enemy_cristalcore_hand2'].obj,
												"_initx":50,"_inity":155,"_cmr":115,"_cmsr":170,"_initRad":215,"_data":"0,0,200,70","_change":false})
		];
		for(let _i=0;_i<_this.hands_down.length;_i++){
			_ENEMIES.push(_this.hands_down[_i]);		
		}

	}
	init(){
	}
	setDrawImageDirect(){
	}
	shot(){
		let _this=this;

		_this._shot_count++;
		if(_this._count>1200){_this._count=0;return;}
		if(_this._count>800){
			if(_this._shot_count<10){return;}			
		}else if(_this._count<=800){
			if(_this._shot_count<50){return;}
		}
		_this._shot_count=0;
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_Z(_this.x,_this.y+111));
		_ENEMIES_SHOTS.push(
			new ENEMY_SHOT_Z(_this.x,_this.y+140));
		_GAME._setPlay(_CANVAS_AUDIOS['enemy_bullet_laser']);
	}
	showCollapes(_x,_y){
		let _this=this;
		//敵を倒した場合
		//爆発して終了
		_this.ani_col(_x,_y);
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
	}
	move_standby(){
		//スタンバイ状態
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
		_this.setWallCollision();

		if(_this.y<200){
			_this.standby=false;
			_this.is_able_collision=true;
		}
	}
	move(){
		let _this=this;
		_this._count++;
		if(!_this.isMove()){return;}
		_this.x=700;
		_this.y+=_this.speed;
		if(_this.y+_this.img.height>_CANVAS.height
			||_this.y<0){
			_this.speed*=-1;
		}
		// _CONTEXT.strokeStyle='rgb(200,200,255)';
		// _CONTEXT.beginPath();
		// _CONTEXT.rect(
		// 	_this.x,
		// 	_this.y,
		// 	_this.img.width,
		// 	_this.img.height
		// );
		// _CONTEXT.stroke();
		//触手の上を表示
		for(let _i=_this.hands_up.length-1;_i>=0;_i--){
			_this.hands_up[_i].moveDraw(_this);
		}
		//触手の下を表示
		for(let _i=_this.hands_down.length-1;_i>=0;_i--){
			_this.hands_down[_i].moveDraw(_this);
		}

		_this.shot();
		_this.moveDraw();
		_this.setWallCollision();

		//自爆
		if(_this._c>=4000){_this._status=0;return;}
		_this._c++;
	}
}
//クリスタルコアの手定義
class ENEMY_BOSS_CRYSTALCORE_HANDS
	extends GameObject_ENEMY{
	constructor(_d){
		super(_CANVAS_IMGS['enemy_cristalcore_hand1'].obj,_d._initx,_d._inity);
		let _this=this;
		_this._initx=_d._initx||0;//初期位置x
		_this._inity=_d._inity||0;//初期位置y
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

		_this._count=0;//アニメーションカウント
		_this._count_turn=0;
		_this._change=_d._change;

		_this.standby=false;

		//ここでは先端のオブジェクトだけ、
		//ショットさせる
		_this.isshot=(_d._img===undefined)?false:true;
		_this._shot_count=0;
		//衝突タイプ
		_this._collision_type='t1';

		_this._boss=new Object();
	}
	init(){
		this._isshow=false;
		this._status=0;
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
			new ENEMY_SHOT_CRYSTALCORE(
				_this.x,
				_this.y,
				parseInt(_d[3])
			)
		);
	}
	moveDraw(_boss){
		let _this=this;
		_this._boss=_boss;
		_this._count++;
		_this.shot();

		let _d=_this._data.split(',');
		let _ix=_this._initx;
		let _iy=_this._inity;
		let rad=parseInt(_d[3])*Math.PI/180;
		var cx=_this._boss.x+parseInt(_d[0])+_ix+_this.img.width;
		var cy=_this._boss.y+parseInt(_d[1])+_iy+parseInt(_this.img.height/1.5);
		// 画像を中心にして回転
//			_CONTEXT.beginPath();
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
		_this.x=_this._boss.x+parseInt(_d[0])+_ix;
		_this.y=_this._boss.y+parseInt(_d[1])+_iy;
	}
	move(){
		let _this=this;
//		console.log(_this._count_turn)
		if(_this._count_turn>=4){
			if(_this._count>400){
				_this._count=0;
				_this._count_turn=0;	
			}
			return;
		}

		if(_this._count>200){
			_this._count=0;
			_this._count_turn++;
			_this._change=(_this._change)?false:true;
			if(_this._count_turn>=4){return;}
		}

		let _sp=_this._data.split(',');
		let _cmr=_this._c_move_round;
		let _cmsr=_this._c_move_self_round;
//		console.log(_this._data);
		//停止
		if(_this._count>_cmsr){
			return;
		}
		//自転のみ	
		if(_this._count<=_cmsr&&_this._count>_cmr){
			let _deg=parseInt(_sp[3])+((_this._change)?1:-1);
			_this._data=_sp[0]+','+_sp[1]+','+_sp[2]+','+_deg;
			return;
		}
		//動きと自転
//			console.log(_this.hands_up[0] );
//			console.log(_deg);
		let _deg=parseInt(_sp[2])+((_this._change)?1:-1);
		let _x=_this._initRad*Math.cos(_deg*(Math.PI/180));
		let _y=_this._initRad*Math.sin(_deg*(Math.PI/180));
		let _z=parseInt(_sp[3])+((_this._change)?1:-1);
		_this._data=_x+','+_y+','+_deg+','+_z;
	}
}

//====================
//　弾クラス
//	_x:_x位置弾の開始位置(DEF:500)
//	_y:_y位置弾の開始位置(DEF:300)
//	_tx:相手の_x位置弾の開始位置(DEF:プレーヤーのx位置)
//	_ty:相手の_y位置弾の開始位置(DEF:プレーヤーのy位置)
//====================
class GameObject_ENEMY_SHOT{
	constructor(_x,_y,_tx,_ty){
		let _this=this;
		_this.x=_x||500;
		_this.y=_y||300;
		_this.tx=_tx||_PLAYERS_MAIN.getPlayerCenterPosition()._x;
		_this.ty=_ty||_PLAYERS_MAIN.getPlayerCenterPosition()._y;

		_this.img=_CANVAS_IMGS['enemy_bullet1'].obj;
		_this._c=0;//アニメーションカウント
		_this.speed=_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SHOT_SPEED;//定義：発射スピード
		_this.rad=//自身と相手までのラジアン
			Math.atan2(
				(_this.ty-_this.y),
				(_this.tx-_this.x));
		_this.deg=//自身と相手までの角度
			_this.rad*180/Math.PI;
		_this.sx=Math.cos(_this.rad);//単位x
		_this.sy=Math.sin(_this.rad);//単位y

		_this._shot_alive=true;//発射中フラグ
		_this._isshow=true;//弾の状態

		_this.shotColMap=[
			"0,0,"+_this.img.width+","+_this.img.height
		];
	}
	init(){
		let _this=this;
		_this._shot_alive=false;
		_this._isshow=false;
	}
	ani_enemy_bullet(){
		this.img=
			_CANVAS_IMGS['enemy_bullet'+parseInt((this._c/4)+1)].obj;
		this._c=(this._c>=7)?0:this._c+1;
	}
	map_collition(){
		let _this=this;
		//MAPの位置を取得
 		let _map_x=_MAP.getMapX(_this.x);
 		let _map_y=_MAP.getMapY(_this.y);
		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this.init();	
		}
	}
	getEnemyCenterPosition(){
		return {_x:this.x+(this.img.width/2),
				_y:this.y+(this.img.height/2)}
	}
	isalive(){return this._shot_alive;}
	isshow(){return this._isshow;}
	setDrawImageDirect(){
		let _this=this;
		let rad=_this.rad;
//		console.log(rad);
		var cx=_this.x+_this.img.width;
        var cy=_this.y+_this.img.height;
		_CONTEXT.setTransform(Math.cos(rad),Math.sin(rad),
							-Math.sin(rad),Math.cos(rad),
							cx-cx*Math.cos(rad)+cy*Math.sin(rad),
							cy-cx*Math.sin(rad)-cy*Math.cos(rad));	

		_CONTEXT.drawImage(
			_this.img,
			_this.x+_this.img.width,
			_this.y+_this.img.height,
			_this.img.width,
			_this.img.height
		);
	}
	move(){
		let _this=this;
		_this.map_collition();
		_this.y=_MAP.getY(_this.y);		
		if(_GAME.isEnemyCanvasOut(_this)){
			_this.init();
			return;
		}
		if(!_this._shot_alive){return;}
		_this.ani_enemy_bullet();

		_this.x+=_this.speed;
		_this.y+=_this.speed;
		
		_CONTEXT.drawImage(
			_this.img,
			_this.x-(_this.img.width/2),
			_this.y-(_this.img.height/2),
			_this.img.width,
			_this.img.height
		);
		_this._shot_alive=true;
	}
}

class GameObject_ENEMY_SHOT2 extends
					GameObject_ENEMY_SHOT{
	constructor(_x,_y,_sx,_sy){
		super(_x,_y);
		this.sx=_sx||1;
		this.sy=_sy||1;
	}
}


class ENEMY_SHOT_Z
	extends GameObject_ENEMY_SHOT{
	constructor(_x,_y){
		super(_x,_y);
		this.img=_CANVAS_IMGS['enemy_bullet_z'].obj;
		this.speed=10;
	}
	move(){
		let _this=this;
		if(_GAME.isEnemyCanvasOut(_this)){
			_this.init();
			return;
		}
		if(!_this._shot_alive){return;}
		_this.map_collition();

		_this.x-=_this.speed;
		_CONTEXT.drawImage(
			_this.img,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
		);

	}
}


class ENEMY_SHOT_CRYSTALCORE
	extends GameObject_ENEMY_SHOT{
	constructor(_x,_y,_deg){
		super(_x,_y);
		let _this=this;
		_this.img=_CANVAS_IMGS['enemy_cristalcore_shot'].obj;
		_this.speed=10;
		_this.deg=_deg||0;
		_this.rad=_this.deg*Math.PI/180;
		_this.sx=Math.cos(_this.rad);//単位x
		_this.sy=Math.sin(_this.rad);//単位y
	}
	move(){
		let _this=this;
		if(_GAME.isEnemyCanvasOut(_this)){
			_this.init();
			return;
		}
		if(!_this._shot_alive){return;}
		_this.map_collition();

//		console.log(_this.rad);
		_this.x-=_this.sx*_this.speed;
		_this.y-=_this.sy*_this.speed;

		_CONTEXT.save();
		_this.setDrawImageDirect();
		_CONTEXT.restore();
	}
}
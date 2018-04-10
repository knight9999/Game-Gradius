//=====================================================
//	gradius_parts_enemies.js
//	敵の定義
//	2017.08.12 : 新規作成
//=====================================================
'use strict';
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
		};
		_this._DEF_SHOTSTATUS={
			//main.jsよりショットによる衝突判定を設定
			_SHOTTYPE_NORMAL:1,
			_SHOTTYPE_MISSILE:2,
			_SHOTTYPE_DOUBLE:1,
			_SHOTTYPE_RIPPLE_LASER:1.5,
			_SHOTTYPE_LASER:1
		};

		_this.alpha=1;//表示透明度（1〜0。1:表示、0:非表示）
		_this._c=0;//アニメーションカウント

		_this.speed=1;//敵のスピード
		_this.getscore=200;//倒した時のスコア
		_this.direct=_this._DEF_DIR._U;//向きの設定
		
		_this._standby=true;//スタンバイ状態
		_this._isshow=true;
		_this._status=1;//生存ステータス

		_this.haspc=false;//パワーカプセル所持フラグ

		_this._collision_type='t0';
		_this.is_able_collision=true;//敵衝突可能フラグ（falseは無敵）
		//衝突してるがショットを通過させる
		//true:衝突判定するが、ショットは通過
		//false:衝突するものの無視
		_this.is_ignore_collision=false;

		//衝突判定座標(x1,y1,x2,y2)
		//左上：x1,y1
		//右下：x2,y2
		_this.shotColMap=[
			"0,0,"+_this.img.width+","+_this.img.height
		];
		_this.col_date=null;//打たれた時間
		_this.col_canint=150;//連続ショット許可間隔

		_this.mapdef_col='0';//MAP衝突ビット
	}
	init(){
		let _this=this;
		_this._status=0;
		_this._isshow=false;
	}
	collision(_s_type,_num){
		//衝突処理
		//パラメータはあるが、デフォルトでは不要
		//ショットタイプ別に処理を分ける際は、
		//このクラスから継承する。
		//_s_type:自機のショットタイプ
		//_num:一度にヒットさせる値
		//戻り値
		//true:当たり判定あり
		//false:当たり判定なし
		let _this=this;
		if(!_this.isCollision()){return false;}
		//無敵は_statusを下げないが衝突させる
		if(!_this.is_able_collision){return true;}
		_this.setStatus(_s_type,_num);
		return true;
	}
	isAbleCollision(){
		return this.is_able_collision;
	}
	isIgnoreCollision(){
		return this.is_ignore_collision;
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
	setAlive(){
		let _this=this;
		if(!_this.isalive()){
			_SCORE.set(_this.getscore);
			_GAME._setPlay(_this.audio_collision);
		}else{
			_GAME._setPlay(_this.audio_alive);			
		}
	}
	setStatus(_s_type){
		let _this=this;
		//自機・ショットによって判定を識別させる
		_this._status-=
			_this._DEF_SHOTSTATUS[_s_type]||1;
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
			new GameObject_ENEMY_SHOT({
				x:this.getEnemyCenterPosition()._x,
				y:this.getEnemyCenterPosition()._y
				})
			);
	}
	get_move_bound_val(){
		return parseInt(Math.random()*(3-1)+1)*((Math.random()>0.5)?1:-1);
	}
	setDrawImageRotate(_deg){
		//透明に設定する
		let _this=this;
		_CONTEXT.save();
		_CONTEXT.translate(
			_this.getEnemyCenterPosition()._x,
			_this.getEnemyCenterPosition()._y
		);
		_CONTEXT.rotate(_deg*Math.PI/180);
		_CONTEXT.drawImage(
			_this.img,
			-(_this.img.width/2),
			-(_this.img.height/2),
			_this.img.width,
			_this.img.height			
		);

		// _CONTEXT.strokeStyle = 'rgb(200,200,255)';
		// _CONTEXT.beginPath();
		// _CONTEXT.rect(
		// 	-(_this.img.width/2),
		// 	-(_this.img.height/2),
		// 	_this.img.width,
		// 	_this.img.height
		// );
		// _CONTEXT.stroke();

		_CONTEXT.restore();
	}
	setDrawImageAlpha(_alpha){
		//透明に設定する
		let _this=this;
		_CONTEXT.save();
		_CONTEXT.globalAlpha=_alpha;
		_CONTEXT.drawImage(
			_this.img,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
			);
		_CONTEXT.restore();
		_this.alpha=_alpha;
	}
	setDrawImage(_w,_h,_s,_p){
		let _this=this;
		let _pos=_p||0;
		let _size=_s||_this.img.width;
		let _width=_w||_this.img.width;
		let _height=_h||_this.img.height;
		_CONTEXT.save();
		_this.setDrawImageDirect();
		if(_p===undefined
			||_s===undefined
			||_w===undefined
			||_h===undefined
		){
			//一枚画像用
			_CONTEXT.drawImage(
				_this.img,
				_this.x,
				_this.y,
				_this.img.width,
				_this.img.height
			);
		}else{
			//スプライト用
//			console.log('======='+_this.x);
			_CONTEXT.drawImage(
				_this.img,
				_pos,
				0,
				_width,
				_height,
				_this.x,
				_this.y,
				_width,
				_height
			);	

			// _CONTEXT.strokeStyle = 'rgb(200,200,255)';
			// _CONTEXT.beginPath();
			// _CONTEXT.rect(
			// 		_this.x,
			// 		_this.y,
			// 		_width,
			// 		_height
			// );
			// _CONTEXT.stroke();
		}
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
	isStandBy(){return this._standby;}
	isCanvasOut(){
		//敵位置がキャンバス以外に位置されてるか。
		//※main.jsで、trueの場合は、
		//_IS_ENEMIES_COLLISION、
		//_ENEMIES内、インスタンスが削除される。
		//true:外れてる
		//false:外れていない
		return _GAME.isEnemyCanvasOut(
			this,{up:false,down:false,left:true,right:false}
		);
	}
	showCollapes(_x,_y){
		let _this=this;
		//敵を倒した場合
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
			new GameObject_ENEMY_COLLISION(
				_x||_this.x+(_this.img.width/2),
				_y||_this.y+(_this.img.height/2),
				_this._collision_type)
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
			_this._standby=false;
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
		_this._status=1;//ライフステータス
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
		_this.shotColMap=
				(_d===_this._DEF_DIR._D)
					?["10,10,43,42"]
					:["0,0,43,32"];
		
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
		let _deg=_GAME.getDeg({x:_p._x,y:_p._y},{x:_e._x,y:_e._y});
		_ENEMIES_SHOTS.push(
			new GameObject_ENEMY_SHOT({x:_e._x,y:_e._y,deg:_deg-10}));
		_ENEMIES_SHOTS.push(
			new GameObject_ENEMY_SHOT({x:_e._x,y:_e._y,deg:_deg+10}));
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
		_this.speed=2;

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

		_this.x+=_this.speed*-1;
		let _d=_this.x;//radのスピード
		let _v=Math.cos(_d*Math.PI/180);//縦幅調整
		_this.y+=_v;

		_this.img=(function(_t){
			_t._col_c=
				(_t._col_c>=(_t.col.length*5)-1)?0:_t._col_c+1;
			return _t.col[parseInt(_t._col_c/5)].img;
		})(_this)

		_this.setDrawImage();
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
	isCanvasOut(){
		return _GAME.isEnemyCanvasOut(
			this,{up:true,down:true,left:false,right:false}
		);
	}
	shot(){
		//弾は敵周囲に発射させる
		let _this=this;
		let _e=_this.getEnemyCenterPosition();
		for(let _i=30;_i<=360;_i+=30){
			_ENEMIES_SHOTS.push(
				new GameObject_ENEMY_SHOT({x:_e._x,y:_e._y,deg:_i})
			);
		}
	}
	move_standby(){
		let _this=this;
		if(_this.x+_this.img.width<0){
			_this._standby=false;
		}
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
		_this.speed=2;
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
	isCanvasOut(){
		return _GAME.isEnemyCanvasOut(this);
	}
	moveDraw(){
		let _this=this;

		let _p=_PLAYERS_MAIN.getPlayerCenterPosition();
		_this._change=(function(){
			if(_this._change){return true;}
			if(_this.direct===_this._DEF_DIR._U){
				if(_p._y<_this.y){
					_this._moveX=(_p._x<_this.x)
									?_this.speed*-1
									:_this.speed
					return true;
				}
			}
			if(_this.direct===_this._DEF_DIR._D){
				if(_p._y>_this.y){
					_this._moveX=(_p._x<_this.x)
									?_this.speed*-1
									:_this.speed
					return true;
				}
			}
			return false;
		})();
		//自機と同じ高さになったら、
		//そのタイミングのY座標のまま
		_this._moveY=(function(){
			if(_this._change){return 0;}
			if(_this.direct===_this._DEF_DIR._U){
				return _this.speed;
			}
			if(_this.direct===_this._DEF_DIR._D){
				return _this.speed*-1;
			}
		})();

		_this.x+=_this._moveX;
		_this.y+=_this._moveY;

		_this.img=(function(_t){
			_t._col_c=
				(_t._col_c>=(_t.col.length*5)-1)?0:_t._col_c+1;
			return _t.col[parseInt(_t._col_c/5)].img;
		})(_this)

		_this.setDrawImage();
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
		if(Math.random()>0.2){return;}
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
		_this.x-=(_this.speedX*_this.flagX);
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

//クリスタル（大）
class ENEMY_p extends GameObject_ENEMY{
    constructor(_x,_y,_d){
		super(_CANVAS_IMGS['enemy_p_1'].obj,_x,_y)
		let _this=this;
		_this._status=4;
		_this.getscore=100;
		_this.speedx=_BACKGROUND_SPEED;
		_this.speedy=
			(Math.random()+1)
			*((Math.random()>0.5)?1:-1);
		_this._isbroken=false;
		//レーザーのみ当たり判定を通常の半分にする。
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;

		_this.mapdef_col='000,000,000';
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
	move_bounds(){
		//バウンド定義
		//敵同士ぶつかったときに跳ね返り動作をする
		let _this=this;
		let _eb=_ENEMIES;
		if(!_this.isalive()){return;}

		for(let _i=0;_i<_eb.length;_i++){
			if(!ENEMY_p.prototype.isPrototypeOf(_eb[_i])){continue;}
			if(!_eb[_i].isalive()){continue;}//生きていない場合は無視
			if(_eb[_i].x>_CANVAS.width){continue;}//キャンバスに入る前は無視
			if(_this.id===_eb[_i].id){continue;}//自身の判定はしない

			let _r=_GAME.isSqCollision(
				_this.shotColMap[0],
				_this.x+','+_this.y,
				_eb[_i].shotColMap,
				_eb[_i].x+','+_eb[_i].y
			);
			if(_r!==_IS_SQ_NOTCOL){
//				console.log(_a);
				_this.speedx=_this.get_move_bound_val();
				_this.speedy=_this.get_move_bound_val();
				_eb[_i].speedx=_this.get_move_bound_val();
				_eb[_i].speedy=_this.get_move_bound_val();
			}
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
						_cp._x+([-30,0,30,-30,0,30])[_i],
						_cp._y+([-30,-30,-30,30,30,30])[_i]
						);
				_ENEMIES.push(_cls);
			}
			_this._isbroken=true;
			_GAME._setPlay(_CANVAS_AUDIOS['enemy_collision4']);
			_this.init();
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

		_this.col_date=new Date();
		_this._collision_type='t1';
		
	}
	setAlive(){
		let _this=this;
		if(_this.isalive()){return;}
		_SCORE.set(_this.getscore);
		_GAME._setPlay(_CANVAS_AUDIOS['enemy_collision5']);
	}
	move_bounds(){
		//バウンド定義
		//敵同士ぶつかったときに跳ね返り動作をする
		let _this=this;

		let _date=new Date();
		if(_date-_this.col_date<1000){return;}

		let _eb=_ENEMIES;
		if(!_this.isalive()){return;}

		for(let _i=0;_i<_eb.length;_i++){
			if(!ENEMY_p_small.prototype.isPrototypeOf(_eb[_i])){continue;}
			if(!_eb[_i].isalive()){continue;}//生きていない場合は無視
			if(_eb[_i].x>_CANVAS.width){continue;}//キャンバスに入る前は無視
			if(_this.id===_eb[_i].id){continue;}//自身の判定はしない

			let _r=_GAME.isSqCollision(
				_this.shotColMap[0],
				_this.x+','+_this.y,
				_eb[_i].shotColMap,
				_eb[_i].x+','+_eb[_i].y
			);
			if(_r!==_IS_SQ_NOTCOL){
				_this.speedx=_this.get_move_bound_val();
				_this.speedy=_this.get_move_bound_val();
				_eb[_i].speedx=_this.get_move_bound_val();
				_eb[_i].speedy=_this.get_move_bound_val();
			}
		}
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

		//レーザーのみ当たり判定を通常の半分にする。
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;

		_this.shotColMap=[
			(function(){
			if(_this.direct===_this._DEF_DIR._D){return "0,50,35,85";}//右下
			if(_this.direct===_this._DEF_DIR._U){return "0,25,35,50";}//右上
			if(_this.direct===_this._DEF_DIR._LD){return "75,55,100,70";}//左下
			if(_this.direct===_this._DEF_DIR._LU){return "75,35,100,50";}//左上
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
		//モアイリングをショットさせる条件
		//true:発射可能
		//false:発射不可
		let _this=this;
		//モアイが破壊された場合
		if(_this._status<=0){return false;}
		//モアイがキャンバスから外れた場合
		if(_GAME.isEnemyCanvasOut(_this)){return false;}
		//自機とのY距離が100ピクセル以上の場合
		if(Math.abs(_PLAYERS_MAIN.y-_this.y)>100){return false;}
		if(_this.direct===_this._DEF_DIR._LU
			||_this.direct===_this._DEF_DIR._LD){
			if(_PLAYERS_MAIN.x<_this.x){return false;}
		 }
		return true;
	}
	shot(){
		//モアイリングをショットする。
		//-100から+1ずつ加算。
		//0〜200間口を開く
		let _this=this;

		if(!_this._open_count>0
				&&!_this.isShot()){
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
		//イオンリングを発射させる間隔調整
		if(_this._open_count%10!==0){return;}		
		_ENEMIES.push(
			new ENEMY_qr(
				_CANVAS_IMGS['enemy_m_y_1'].obj,
				_this.x+parseInt(_this.shotColMap[0].split(',')[0]),
				_this.y+parseInt(_this.shotColMap[0].split(',')[1]),
				_this.direct
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
	constructor(_o,_x,_y,_d){
		super(_o,_x,_y)
        let _this=this;
		_this._status=1;
		_this.direct=_d||_this._DEF_DIR._U;
		_this.imgs_c=0;
		_this.imgs=[//アニメ定義
			_CANVAS_IMGS['enemy_m_y_1'].obj,
			_CANVAS_IMGS['enemy_m_y_2'].obj
		];
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision2'];		
		_this.rad=_GAME.getRad(_PLAYERS_MAIN,{x:_x,y:_y});
		_this.sx=Math.cos(_this.rad);
		_this.sy=Math.sin(_this.rad);
		_this.speed=_MAPDEFS[_MAP_PETTERN]._speed*1.5;

		//レーザーのみ当たり判定を通常の半分にする。
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;

		_this._collision_type='t2';
		((_this.direct===_this._DEF_DIR._D)?-10:0);
	}
	isCanvasOut(){
		// console.log(
		// 	_GAME.isEnemyCanvasOut(
		// 		this,{up:false,down:false,left:true,right:true}
		// )
		return _GAME.isEnemyCanvasOut(
			this,{up:false,down:false,left:true,right:true}
		);
	}
	map_collition(){
		let _this=this;
		let _e=_this.getEnemyCenterPosition();
 		let _map_x=_MAP.getMapX(_e._x);
 		let _map_y=_MAP.getMapY(_e._y);
		if(_MAP.isMapCollision(_map_x,_map_y)){
			_ENEMIES_COLLISIONS.push(
				new GameObject_ENEMY_COLLISION
				(_e._x,_e._y,_this._collision_type));	
			_this.init();
		}
	}
	moveDraw(){
		let _this=this;
		_this.map_collition();
		_this.x+=_this.sx*_this.speed;
		_this.y+=_this.sy*_this.speed;
		_this.img=(function(_c){
			_this.imgs_c=(_c>=(_this.imgs.length*10)-1)?0:_c+1;
			return _this.imgs[parseInt(_this.imgs_c/10)];
		})(_this.imgs_c);
		_this.setDrawImage();
	}
}


//炎（大）
class ENEMY_frame_1 extends GameObject_ENEMY{
    constructor(_x,_y,_d){
		super(_CANVAS_IMGS['enemy_frame_1'].obj,_x,_y)
		let _this=this;
		_this._status=1;
		_this.getscore=200;

		_this.speed=(Math.random()*(6-3)+3)*-1;
		_this.rad=0;
		_this.speedx=0;
		_this.speedy=0;
		_this._isbroken=false;
		_this._c=0;
		_this.imgs=[
			_CANVAS_IMGS['enemy_frame_1'].obj,
			_CANVAS_IMGS['enemy_frame_2'].obj
		];

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

		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this.init();
		}
	}
	showCollapes(){
		let _this=this;
		let _cp=_this.getEnemyCenterPosition();
		if(_this._status>0){return;}
		if(_this._isbroken){return;}

		let _eb_l=0;
		let _eb=_ENEMIES;
		for(let _i=0;_i<_eb.length;_i++){
			if(!ENEMY_frame_2.prototype.isPrototypeOf(_eb[_i])){continue;}
			_eb_l++;
		}

		let _c=(_eb_l>20)?1:2;
		for(let _i=0;_i<_c;_i++){
			//オブジェクト追加
			let _cls=
				new ENEMY_frame_2(_cp._x,_cp._y,_this.direct);
			_ENEMIES.push(_cls);
		}
		_this._isbroken=true;
		_GAME._setPlay(_CANVAS_AUDIOS['enemy_collision1']);
		_this.init();
	}
	move_standby(){
		let _this=this;
		if(_this.x<_CANVAS.width){
			let _p=_PLAYERS_MAIN.getPlayerCenterPosition();
			_this.rad=//自身と相手までのラジアン
				Math.atan2(
					(Math.random()*700-100-_this.y),
					0-_this.x);
			_this.deg=_this.rad/Math.PI*180;
			_this.speedx=Math.cos(_this.rad);//単位x
			_this.speedy=Math.sin(_this.rad);//単位y
			_this._standby=false;
		}
	}
	moveDraw(){
		let _this=this;
		
		_this.map_collition();
		_this.x-=_this.speedx*_this.speed;
		_this.y-=_this.speedy*_this.speed;
		_this._c=(_this._c>=(_this.imgs.length*5)-1)?0:_this._c+1;
		_this.img=_this.imgs[parseInt(_this._c/5)];

		_this.setDrawImageRotate(_this.deg+180);
	}
}
//炎（中）
class ENEMY_frame_2 extends ENEMY_frame_1{
    constructor(_x,_y,_d){
		super(_x,_y,_d);
		let _this=this;
		_this._status=1;
		_this.speed=(Math.random()*(8-4)+4)*-1;
		_this.deg=Math.random()*(235-125)+125;
		_this.speedx=Math.cos(_this.deg*Math.PI/180);//単位x
		_this.speedy=Math.sin(_this.deg*Math.PI/180);//単位y
		
		_this.getscore=200;
		_this._isbroken=false;
		_this.img=_CANVAS_IMGS['enemy_frame_3'].obj;
		_this.shotColMap=[
			"0,0,"+_this.img.width+","+_this.img.height
		];
		_this.imgs=[
			_CANVAS_IMGS['enemy_frame_3'].obj,
			_CANVAS_IMGS['enemy_frame_4'].obj
		];
		_this._standby=false;
	}
	showCollapes(){
		let _this=this;
		let _cp=_this.getEnemyCenterPosition();
		if(_this._status>0){return;}
		if(_this._isbroken){return;}

		let _eb_l=0;
		let _eb=_ENEMIES;
		for(let _i=0;_i<_eb.length;_i++){
			if(!ENEMY_frame_3.prototype.isPrototypeOf(_eb[_i])){continue;}
			_eb_l++;
		}

		let _c=(_eb_l>20)?0:1;
		for(let _i=0;_i<_c;_i++){
			//オブジェクト追加
			let _cls=
				new ENEMY_frame_3(
					_cp._x,
					_cp._y,
					_this.direct
					);
			_ENEMIES.push(_cls);
		}
		_this._isbroken=true;
		_GAME._setPlay(_CANVAS_AUDIOS['enemy_collision1']);
		_this.init();
	}
}
//炎（小）
class ENEMY_frame_3 extends ENEMY_frame_1{
    constructor(_x,_y,_d){
		super(_x,_y,_d);
		let _this=this;
		_this._status=1;
		_this.speed=(Math.random()*(8-4)+4)*-1;
		_this.deg=Math.random()*(235-125)+125;
		_this.speedx=Math.cos(_this.deg*Math.PI/180);//単位x
		_this.speedy=Math.sin(_this.deg*Math.PI/180);//単位y

		_this.getscore=200;
		_this._isbroken=false;
		_this.img=_CANVAS_IMGS['enemy_frame_5'].obj;
		_this.shotColMap=[
			"0,0,"+_this.img.width+","+_this.img.height
		];
		//無敵だが衝突を無視し、"ある程度"ショットは通過できる
		_this.is_able_collision=false;
		_this.is_ignore_collision=(Math.random()>0.05);
		_this._standby=false;

		_this.imgs=[
			_CANVAS_IMGS['enemy_frame_5'].obj,
			_CANVAS_IMGS['enemy_frame_6'].obj
		];
	}
}


//細胞（中心）
//ENEMY_cell_hand_1
//ENEMY_cell_hand_2
//ENEMY_cell_hand_3
//を管理する。
class ENEMY_cell_core
	extends GameObject_ENEMY{
    constructor(_x,_y,_d){
		super(_CANVAS_IMGS['enemy_cell_core'].obj,_x,_y)
		let _this=this;
		_this._status=10;
		_this.getscore=500;
		_this.audio_alive=_CANVAS_AUDIOS['enemy_collision7'];
		_this._collision_type='t9';
		_this.rad=0;
		//レーザーのみ当たり判定を通常の半分にする。
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;

		_this.ani=[//アニメーション定義
			{scale:1},{scale:0.95},{scale:0.90},{scale:0.85},{scale:0.90},{scale:0.95}
		];

		_this.hands_up_rad=[];
		_this.hands_up=[];
		//触手の下定義
		_this.hands_down_rad=[];
		_this.hands_down=[];

		//触手間の距離
		_this.hands_distance=12;

	}
	set_hands_rad(_rads,_h1,_h2){
		//触手間の角度を求める
		let _this=this;
		let _p=_PLAYERS_MAIN.getPlayerCenterPosition();
		let _h=_h2.getEnemyCenterPosition();
		let dx=_p._x-_h._x;
		let dy=_p._y-_h._y;
		//自身と相手の角度を求めたら
		//自身が動かせる角度の有効範囲を元に、
		//角度を調整する。

		let _rad=((_r)=>{
			//atan2()より0度以下の場合は、
			//正数に切り替える
			let _s=Math.random()/50;
			if(_h2.flag){
				_r=(Math.cos(_r)>0)
				?_h2.rad+_s
				:_h2.rad-_s;
			}else{
				_r=(Math.cos(_r)>0)
				?_h2.rad-_s
				:_h2.rad+_s;
			}
			_r=(_r<0)?2*Math.PI+_r:_r;
			if(_r>=_h2.rad_min
				&&_r<=_h2.rad_max){
				//有効範囲内はそのまま角度を返す
				return _r;
			}
			return _h2.rad;
		})(Math.atan2(dy,dx));
		_h2.rad=_rad;
		_rads.unshift(_rad);
	}
	set_hands_pos(_rad,_h1,_h2,_x,_y){
		//触手間の距離・座標を求める
		let _this=this;
        _h1.x=(_x||0)+_h2.x+Math.cos(_rad)*_this.hands_distance;
        _h1.y=(_y||0)+_h2.y+Math.sin(_rad)*_this.hands_distance;		
	}
	is_hands_up_status(){
		//触手の上（黄色）をステータスを取得
		//true:生きてる
		//false:生きていない
		let _this=this;
		for(let _i=0;_i<_this.hands_up.length;_i++){
			if(ENEMY_cell_hand_2.prototype.isPrototypeOf(_this.hands_up[_i])){
				return (_this.hands_up[_i].isalive());
			}
		}
	}
	is_hands_down_status(){
		//触手の下（黄色）をステータスを取得
		//true:生きてる
		//false:生きていない
		let _this=this;
		for(let _i=0;_i<_this.hands_down.length;_i++){
			if(ENEMY_cell_hand_2.prototype.isPrototypeOf(_this.hands_down[_i])){
				return (_this.hands_down[_i].isalive());
			}
		}
	}
	showCollapes(){
		//これを破壊した場合は、それに紐づく触手も全て破壊する。
		let _this=this;
		let _e=_this.getEnemyCenterPosition();
		_this._isshow=false;
 		//触手の上を破壊させる
		for(let _i=0;_i<_this.hands_up.length;_i++){
			_this.hands_up[_i].showCollapes();		
		}
 		//触手の下を破壊させる
		for(let _i=0;_i<_this.hands_down.length;_i++){
			_this.hands_down[_i].showCollapes();		
		}
		_ENEMIES_COLLISIONS.push(
			new GameObject_ENEMY_COLLISION(
				_e._x,
				_e._y,
				_this._collision_type)
			);
		_GAME._setPlay(_this.audio_collision);
	}
	move_standby(){
		let _this=this;
		if(_this.x<_CANVAS.width-20){
			_this._standby=false;
			//触手の上定義
			_this.hands_up=[
				//最初の要素は細胞からの第1関節
				//最後の要素は手
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI*3/2,rad_min:Math.PI+1.5,rad_max:Math.PI+2,flag:true,ignore_collision:false}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI*3/2-0.2,rad_min:Math.PI+1.0,rad_max:Math.PI+2.2,flag:true,ignore_collision:false}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI*3/2-0.4,rad_min:Math.PI+0.7,rad_max:Math.PI+2.4,flag:true,ignore_collision:false}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI*3/2-0.4,rad_min:Math.PI+0.7,rad_max:Math.PI+2.4,flag:true,ignore_collision:false}),
				new ENEMY_cell_hand_2({x:_this.x,y:_this.y,rad:Math.PI*3/2-0.6,rad_min:Math.PI+0.5,rad_max:Math.PI+2.6,flag:true}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI*3/2-0.8,rad_min:Math.PI+0.5,rad_max:Math.PI+2.8,flag:true}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI*3/2-1.0,rad_min:Math.PI+0.3,rad_max:Math.PI+2.8,flag:true}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI*3/2-1.2,rad_min:Math.PI+0.3,rad_max:Math.PI+2.8,flag:true}),
				new ENEMY_cell_hand_3({x:_this.x,y:_this.y,rad:Math.PI*3/2-1.4,rad_min:Math.PI+0.3,rad_max:Math.PI+3.0,flag:true})
			];
			for(let _i=0;_i<_this.hands_up.length;_i++){
				_ENEMIES.push(_this.hands_up[_i]);		
			}
			//触手の下定義
			_this.hands_down=[
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI-1.0,rad_min:Math.PI-2.0,rad_max:Math.PI-1,flag:false,ignore_collision:false}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI-1.0,rad_min:Math.PI-2.1,rad_max:Math.PI-0.9,flag:false,ignore_collision:false}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI-0.9,rad_min:Math.PI-2.2,rad_max:Math.PI-0.9,flag:false,ignore_collision:false}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI-0.9,rad_min:Math.PI-2.3,rad_max:Math.PI-0.6,flag:false,ignore_collision:false}),
				new ENEMY_cell_hand_2({x:_this.x,y:_this.y,rad:Math.PI-0.9,rad_min:Math.PI-2.7,rad_max:Math.PI-0.6,flag:false}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI-0.8,rad_min:Math.PI-2.7,rad_max:Math.PI-0.6,flag:false}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI-0.8,rad_min:Math.PI-2.8,rad_max:Math.PI-0.1,flag:false}),
				new ENEMY_cell_hand_1({x:_this.x,y:_this.y,rad:Math.PI-0.7,rad_min:Math.PI-2.8,rad_max:Math.PI-0.1,flag:false}),
				new ENEMY_cell_hand_3({x:_this.x,y:_this.y,rad:Math.PI-0.7,rad_min:Math.PI-2.8,rad_max:Math.PI-0.1,flag:false})
			];
			for(let _i=0;_i<_this.hands_down.length;_i++){
				_ENEMIES.push(_this.hands_down[_i]);		
			}
		}
	}
	moveDraw(){
		let _this=this;
		_this._c=(_this._c>=(_this.ani.length*20)-1)?0:_this._c+1;
		let _c=parseInt(_this._c/20);

		const _e=_this.getEnemyCenterPosition();
		const _p=_PLAYERS_MAIN.getPlayerCenterPosition();

		let _rad=_GAME.getRad(
			{x:_p._x,y:_p._y},
			{x:_e._x,y:_e._y}
		);
//		_this.x+=Math.cos(_rad)*_this.speed;
		_this.y+=Math.sin(_rad)*_this.speed;


		if(!_this.is_hands_up_status()
			&&_this.hands_up.length!==0){
			//触手の上を破壊
			for(let _i=0;_i<_this.hands_up.length;_i++){
				_this.hands_up[_i].showCollapes();		
			}
			_this.hands_up=[];		
		}
		if(!_this.is_hands_down_status()
			&&_this.hands_down.length!==0){
			//触手の下を破壊
			for(let _i=0;_i<_this.hands_down.length;_i++){
				_this.hands_down[_i].showCollapes();		
			}			
			_this.hands_down=[];		
		}

		//触手の上を表示
		//角度を求める→配置させる（インバースキネマティクス法）
		//各触手・細胞間の角度を相対的に求め、
		//位置表示のために、配列に角度を入れる
		_this.hands_up_rad=[];
		for(let _i=_this.hands_up.length-1;_i>=0;_i--){
			//触手の最後の要素は
			//細胞との角度を求める
			if(_this.hands_up[_i-1]===undefined){
				_this.set_hands_rad(
					_this.hands_up_rad,
					_this,
					_this.hands_up[_i]);
				break;
			}
			_this.set_hands_rad(
				_this.hands_up_rad,
				_this.hands_up[_i-1],
				_this.hands_up[_i]);
		}
		for(let _i=0;_i<_this.hands_up.length;_i++){
			//求めた角度より、各触手の上を配置・表示させる。
			if(_i===0){
				//初期値は細胞本体と、
				//1つ目の触手位置を相対的に調整させる
				_this.set_hands_pos(
					_this.hands_up_rad[_i],
					_this.hands_up[_i],
					_this,
					(_this.img.width/2)-(_this.hands_up[_i].img.width/2),
					10
					);
//				console.log(_this.hands_up_rad)
				_this.hands_up[_i].moveDraw(_this);			
				continue;					
			}
			_this.set_hands_pos(
				_this.hands_up_rad[_i],
				_this.hands_up[_i],
				_this.hands_up[_i-1]);
			_this.hands_up[_i].moveDraw(_this);			
		}
//		console.log(_this.hands_up_rad);

		//触手の下を表示
		_this.hands_down_rad=[];
		for(let _i=_this.hands_down.length-1;_i>=0;_i--){
			if(_this.hands_down[_i-1]===undefined){
				_this.set_hands_rad(
					_this.hands_down_rad,
					_this,
					_this.hands_down[_i]);
				break;
			}
			_this.set_hands_rad(
				_this.hands_down_rad,
				_this.hands_down[_i-1],
				_this.hands_down[_i]);
		}
		for(let _i=0;_i<_this.hands_down.length;_i++){
			if(_i===0){
				_this.set_hands_pos(
					_this.hands_down_rad[_i],
					_this.hands_down[_i],
					_this,
					(_this.img.width/2)-(_this.hands_down[_i].img.width/2),
					_this.img.height-30);
				_this.hands_down[_i].moveDraw(_this);			
				continue;					
			}
			_this.set_hands_pos(
				_this.hands_down_rad[_i],
				_this.hands_down[_i],
				_this.hands_down[_i-1]);
			_this.hands_down[_i].moveDraw(_this);			
		}

		//細胞自身を表示
		_GAME._setDrawImage(
			_this.img,
			_e._x,
			_e._y,
			_this.ani[_c].scale*((_this._status/10>0.7)?_this._status/10:0.7)
		);

		//自身の衝突判定を変更
		let _sc=((_this.img.width/2)-(_this.img.width*_this.ani[_c].scale/2))
				+","
				+((_this.img.height/2)-(_this.img.height*_this.ani[_c].scale/2))			
				+","
				+_this.img.width*_this.ani[_c].scale
				+","
				+_this.img.height*_this.ani[_c].scale;
		_this.shotColMap=[_sc];

	}
}
class ENEMY_cell_hand_1
	extends GameObject_ENEMY{
	constructor(_d){
		super(_CANVAS_IMGS['enemy_cell_hand_1'].obj,_d.x,_d.y)
		let _this=this;
		_this._initx=_d.x||0;//初期位置x
		_this._inity=_d.y||0;//初期位置y

		_this.rad=_d.rad;
		_this.rad_min=_d.rad_min||-1;//回転の最小
		_this.rad_max=_d.rad_max||-2;//回転の最大
		_this.flag=_d.flag||false;
		_this.is_able_collision=false;
		_this._collision_type='t2';
		_this.is_ignore_collision=_d.ignore_collision||true;

		_this.ani=[//アニメーション定義
			{scale:1},
			{scale:0.95},
			{scale:0.9},
			{scale:0.85},
			{scale:0.9},
			{scale:0.95}
		];

		_this._c=0;
	}
	showCollapes(){
		let _this=this;
		let _e=_this.getEnemyCenterPosition();
		_ENEMIES_COLLISIONS.push(
			new GameObject_ENEMY_COLLISION(
				_e._x,
				_e._y,
				_this._collision_type)
			);
		_this.init();
	}
	shot(){}
	moveDraw(){
		let _this=this;
		_this._c=(_this._c>=(_this.ani.length*20)-1)?0:_this._c+1;
		let _c=parseInt(_this._c/20);
		const _e=_this.getEnemyCenterPosition();
		_GAME._setDrawImage(
			_this.img,
			_e._x,
			_e._y,
			_this.ani[_c].scale);
		_this.shot();
	}
}
class ENEMY_cell_hand_2
	extends ENEMY_cell_hand_1{
	constructor(_d){
		super(_d)
		let _this=this;
		_this.img=_CANVAS_IMGS['enemy_cell_hand_2'].obj;
		_this.is_able_collision=true;
		_this.audio_alive=_CANVAS_AUDIOS['enemy_collision7'];
		_this._status=10;
		_this.is_ignore_collision=false;
		_this.shotColMap=[
			"-10,-10,"+(_this.img.width+10)+","+(_this.img.height+10)
		];
	}
	shot(){}
}
class ENEMY_cell_hand_3
	extends ENEMY_cell_hand_1{
	constructor(_d){
		super(_d)
		let _this=this;
		_this.img=_CANVAS_IMGS['enemy_cell_hand_3'].obj;
	}
	shot(){
		//キャンバス内でショットさせる
		if(_GAME.isEnemyCanvasOut(this)){return;}

		if(Math.random()>=
		_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SHOT_RATE){
			return;
		}

		//敵の中心から弾を発射させるための位置調整
		_ENEMIES_SHOTS.push(
			new GameObject_ENEMY_SHOT({
				x:this.getEnemyCenterPosition()._x,
				y:this.getEnemyCenterPosition()._y,
				img:_CANVAS_IMGS['enemy_bullet_cell'].obj,
				imgPos:[0,15]
				})
			);
	}
	moveDraw(){
		let _this=this;
		let _p=_PLAYERS_MAIN.getPlayerCenterPosition();
		let _e=_this.getEnemyCenterPosition();
		let _r=Math.atan2(_e._y-_p._y,_e._x-_p._x);
		_this.setDrawImageRotate(_r/Math.PI*180);
		// _GAME._setDrawImage(
		// 	_this.img,
		// 	_e._x,
		// 	_e._y,
		// 	_this.ani[_c].scale);
		_this.shot();
	}
}

class ENEMY_CELL_A extends ENEMY_a{
	constructor(_x,_y,_d){
		super(_x,_y,_d);
        let _this=this;
        _this.direct=_d||_this._DEF_DIR._U;
		_this.haspc=false;
        _this.defimg=[_CANVAS_IMGS['enemy_cell_a_1'].obj,_CANVAS_IMGS['enemy_cell_a_2'].obj];
	}
}	
class ENEMY_CELL_B extends ENEMY_a{
	constructor(_x,_y,_d){
		super(_x,_y,_d);
        let _this=this;
        _this.direct=_d||_this._DEF_DIR._U;
		_this.haspc=true;
        _this.defimg=[_CANVAS_IMGS['enemy_cell_b_1'].obj,_CANVAS_IMGS['enemy_cell_b_2'].obj];
	}
}

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
	constructor(_o,_x,_y){
		super(_o,_x,_y);
		let _this=this;
		_this.speed=0;
		_this.getscore=10000;
		_this._c=0;//アニメーションカウント
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
	constructor(_o,_o_boss,_x,_y){
		super(_o,_x,_y);
		let _this=this;
		_this._initx=_x||0;//初期位置x
		_this._inity=_y||0;//初期位置y
		_this._boss=_o_boss;
		_this.x=_this._boss.x+_this._initx;//初期位置x
		_this.y=_this._boss.y+_this._inity;//初期位置y
		_this._status=10;
		_this.getscore=500;//倒した時のスコア
		_this._standby=true;
		_this.is_able_collision=false;
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision5'];

		//レーザーのみ当たり判定を通常の半分にする。
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;
	}
	setStandByDone(){
		//スタンバイ完了
		this._standby=false;
	}
	moveDraw(){
		let _this=this;
		if(!_this.isalive()){return;}
		let x=(_this._boss===undefined)?0:_this._boss.x;
		let y=(_this._boss===undefined)?0:_this._boss.y;
		
		_this.x=x+parseInt(_this._initx);
		_this.y=y+parseInt(_this._inity);
		_this.setDrawImage();
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
		_this._status=1;
		_this.speed=3;
		_this.is_able_collision=false;

		_this.wall=[
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore_1'].obj,_this,15,50),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore_1'].obj,_this,25,50),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore_1'].obj,_this,35,50),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore_2'].obj,_this,45,53),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore_3'].obj,_this,70,43)
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

		_this.moveDraw();
		_this.set_wall_status();
		_this.show_walls(_this.wall);

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
		_this.moveDraw();
		_this.set_wall_status();
		_this.show_walls(_this.wall);

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
	constructor(_x,_y){
		super(_CANVAS_IMGS['enemy_bigcore2'].obj,_x,_y);
		let _this=this;
		_this._status=1;
		_this.speed=2;
		_this.is_able_collision=false;
		_this.img=_CANVAS_IMGS['enemy_bigcore2'].obj;
		_this.wall_up=[
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore2_wall'].obj,_this,90,38),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore2_wall'].obj,_this,95,38),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore2_wall'].obj,_this,100,38),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore2_wall'].obj,_this,105,38),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore2_core'].obj,_this,110,36)
		];
		_this.wall_down=[
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore2_wall'].obj,_this,90,95),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore2_wall'].obj,_this,95,95),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore2_wall'].obj,_this,100,95),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore2_wall'].obj,_this,105,95),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore2_core'].obj,_this,110,93)
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
			new ENEMY_BOSS_BIGCORE2_HANDS({"_initx":-52,"_inity":-30,"_dir":_this._DEF_DIR._U,"_boss":_this})
		];
		_ENEMIES.push(_this.hands_up[0]);		
		//下の手初期化
		_this.hands_down=[
			new ENEMY_BOSS_BIGCORE2_HANDS({"_initx":-52,"_inity":75,"_dir":_this._DEF_DIR._D,"_boss":_this})
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
		_this.moveDraw();

		(_this.speed>0&&!_this._moveYStop)
			?_this.back_img_up.s1()
			:_this.back_img_up.s2();
		_this.back_img_up.f();

		(_this.speed<0&&!_this._moveYStop)
			?_this.back_img_down.s1()
			:_this.back_img_down.s2();
		_this.back_img_down.f();

		_this.set_wall_status();
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
		//上を表示
		for(let _i=_this.hands_up.length-1;_i>=0;_i--){
			//上の壁を全部壊したら、腕を動かさない。
			if(_this._wall_up_statuses.indexOf('1')===-1
				&&!_this.hands_up[_i].is_hand_stop()){
				_GAME._setPlay(_this.audio_collision);
				_this.hands_up[_i].set_hand_stop();
			}			
			_this.hands_up[_i].moveDraw(_this);
		}
		//下を表示
		for(let _i=_this.hands_down.length-1;_i>=0;_i--){
			//下の壁を全部壊したら、腕を動かさない。
			if(_this._wall_down_statuses.indexOf('1')===-1
				&&!_this.hands_down[_i].is_hand_stop()){
				_GAME._setPlay(_this.audio_collision);
				_this.hands_down[_i].set_hand_stop();
			}			
			_this.hands_down[_i].moveDraw(_this);
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
		super(_CANVAS_IMGS['enemy_bigcore2_hand'].obj,_d._initx,_d._inity);
		let _this=this;
		_this._initx=_d._initx||0;//初期位置x
		_this._inity=_d._inity||0;//初期位置y
		_this.x=_this._initx+_d._boss.x;
		_this.y=_this._inity+_d._boss.y;
		_this._standby=false;
		_this.is_able_collision=false;

		//ここでは先端のオブジェクトだけ、
		//ショットさせる
		_this.isshot=(_d._img===undefined)?false:true;
		_this.isHandsOpen=false;
		_this.isHandsClose=false;
		_this.isstop=false;//true時、手を動かさない

		_this._boss=new Object();
		_this.direct=_d._dir||_this._DEF_DIR._U;

		_this.shotColMap=[//衝突判定（下の定義を使って動的に設定）
			(function(){
				if(_this.direct===_this._DEF_DIR._U){//上
					return "0,30,250,100,false";
				}
				if(_this.direct===_this._DEF_DIR._D){//下
					return "0,30,250,100,false";
				}
			})()
		]
		_this.shotColMapTmp=
			//手の衝突判定（定義）
			//手のイメージ定義の要素に合わせて、
			//衝突エリアを設定する。
			(function(){
			if(_this.direct===_this._DEF_DIR._U){//上
				return [["90,30,250,70,false","25,70,250,100,false"],
						["180,30,250,90,false"],
						["50,10,225,20,false"]
					];
			}
			if(_this.direct===_this._DEF_DIR._D){//下
				return [["25,30,250,70,false","90,70,250,100,false"],
						["180,20,250,60,false"],
						["50,90,225,100,false"]
					];
			}
			})();
		_this.imgs=[0,250,500];//手のイメージ定義
		_this.imgsPos=[//手のイメージ定義
			{x:0,y:(_this.direct===_this._DEF_DIR._U)?0:0},
			{x:0,y:(_this.direct===_this._DEF_DIR._U)?-40:40},
			{x:-5,y:(_this.direct===_this._DEF_DIR._U)?-30:30}
		];
		_this.imgs_x=0;
		_this.imgs_y=0;

		_this._c=0;
	}
	init(){
		this._isshow=false;
		this._status=0;
	}
	collision(_s_type,_num){}
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
		_this.setDrawImage(250,110,250,_this.imgs[parseInt(_this._c/6)]);
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
	constructor(_x,_y){
		super(_CANVAS_IMGS['enemy_cristalcore'].obj,_x,_y);
		let _this=this;
		_this._status=70;
		_this.speed=3;

		_this.wall=[
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_cristalcore_wall1'].obj,_this,47,116),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,_this,62,116),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,_this,77,116),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_cristalcore_wall2'].obj,_this,92,116),
			new ENEMY_BOSS_WALL(_CANVAS_IMGS['enemy_bigcore_3'].obj,_this,102,115)
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
	init(){
	}
	setDrawImageDirect(){
	}
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
		_this.moveDraw();
		_this.set_wall_status();
		_this.show_walls(_this.wall);		

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
		super(_CANVAS_IMGS['enemy_cristalcore_hand1'].obj,_d._initx,_d._inity);
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
				x:_this.x,
				y:_this.y,
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
	moveDraw(_o){
		//move()によって調整された状態からCANVASに描画する。
		let _this=this;
//		console.log(_this._count_turn)

		let _d=_this._data.split(',');
		let _ix=_this._initx;
		let _iy=_this._inity;
		let rad=parseInt(_d[3])*Math.PI/180;
		let cx=_this._boss.x+parseInt(_d[0])+_ix+_this.img.width;
		let cy=_this._boss.y+parseInt(_d[1])+_iy+parseInt(_this.img.height/1.5);
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
	constructor(_x,_y){
		super(_x,_y);
		let _this=this;
		_this._c=0;
		_this._showout_cube=0;
		_this._standby_count=0;
		_this._complete_cube_count=0;
		_this._map_col_reset=false;
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
				_e[_i].setDrawImageAlpha(_this.alpha);
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
			if(_this._showout_cube<100){
				let _c=new ENEMY_BOSS_CUBE(
					_CANVAS_IMGS['enemy_a_1'].obj,
					1000,
					(Math.random()*(500-100))+50
				)
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
	constructor(_o,_x,_y){
		super(_o,_x,_y);
		let _this=this;
		_this._standby=false;
		_this._c=0;
		_this._status=1;
		_this.speed=5;
		_this.change_speed_c=parseInt(Math.random()*(180-10))+10;
		_this._stop=false;
		_this.is_able_collision=false;
		_this.audio_collision=_CANVAS_AUDIOS['enemy_cube'];

		_this._col_c=0;
		_this.col=[//アニメ定義
			{img:_CANVAS_IMGS['enemy_cube1'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_cube2'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_cube3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_cube4'].obj,scale:1}
		];
		_this.img=_this.col[0].img;

		_this.shotColMap=[
			'10,10,'+
			parseInt(_this.img.width-10)+','+
			parseInt(_this.img.height-10)
		];

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
		//自身と相手クリスタル間の衝突判定
		let _this=this;
		let _eb=_ENEMIES;
		for(let _i=0;_i<_eb.length;_i++){
			if(!ENEMY_BOSS_CUBE.prototype.isPrototypeOf(_eb[_i])){continue;}
			if(_this.id===_eb[_i].id){continue;}//自身の判定はしない
			if(!_eb[_i]._stop){continue;}

			let _r=_GAME.isSqCollision(
				_this.shotColMap[0],
				_this.x+','+_this.y,
				_eb[_i].shotColMap,
				_eb[_i].x+','+_eb[_i].y
			);
			if(_r!==_IS_SQ_NOTCOL){return true;}
		}
		return false;
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
		if(_this._c<_this.change_speed_c){
			_this.x-=_this.speed;
		}
		if(_this._c===_this.change_speed_c){
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
			_this.speed=8;
		}
		if(_this._c>_this.change_speed_c){
			_this.x+=_this.sx*_this.speed;
			_this.y+=_this.sy*_this.speed;
		}

		_this.img=(function(_t){
			_t._col_c=
				(_t._col_c>=(_t.col.length*8)-1)?0:_t._col_c+1;
			return _t.col[parseInt(_t._col_c/8)].img;
		})(_this)

		_this._c++;
	}
	move(){
		let _this=this;
		if(!_this.isMove()){return;}
		if(_this.alpha===0){_this.init();return;}
		_this.moveDraw();
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
	constructor(_x,_y){
		//ここではフレームの頭、身体を設定し、
		//各描画クラスに描画させる。
		super(_CANVAS_IMGS.enemy_frame_body1.obj,_x,_y);
		let _this=this;
		_this._status=1;
		_this.x=_CANVAS.width+100;
		_this.y=250;

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
					if(this._pos_same_count<200){return;}
					
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
			new ENEMY_BOSS_FRAME_HEAD({o:null,x:1500,y:250,d:_this._DEF_DIR._L})
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

		//フレームの頭・身体への移動指令・表示
		for(let _i=0;_i<_this.parts.length;_i++){
			if(_this.moves[_i*_this.moves_interval]===undefined){break;}
			let _m=_this.moves[_i*_this.moves_interval];
			_this.parts[_i].moveDraw(
				{x:_m.x,y:_m.y,deg:_m.deg});
		}

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
			_this.parts[0].setDirect(_this._DEF_DIR._R);
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
	constructor(_d){
		super(_CANVAS_IMGS.enemy_frame_head1.obj,_d.x,_d.y);
		let _this=this;
		_this.direct=_d.d||_this._DEF_DIR._R;
		_this.img=
			(_this.direct===_this._DEF_DIR._L)
				?_CANVAS_IMGS.enemy_frame_head3.obj
				:_CANVAS_IMGS.enemy_frame_head1.obj;
		_this._standby=false;
		_this._status=75;
//		_this._status=1;
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
				return (_this.direct===_this._DEF_DIR._L)
						?_CANVAS_IMGS.enemy_frame_head3.obj
						:_CANVAS_IMGS.enemy_frame_head1.obj;
			}

			//開く
			return (_this.direct===_this._DEF_DIR._L)
				?_CANVAS_IMGS.enemy_frame_head4.obj
				:_CANVAS_IMGS.enemy_frame_head2.obj;

		})();
		//炎をはく
		if(_this._c%200===150){
			_ENEMIES_SHOTS.push(new ENEMY_SHOT_FRAME({x:_this.x,y:_this.y,deg:_this._deg+90}));
		}
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
//		console.log('===============deg'+_loc.deg);
		_CONTEXT.save();
		_CONTEXT.translate(_this.x+(_this.img.width/4),_this.y+(_this.img.height/4));
		_CONTEXT.rotate(_this._deg*Math.PI/180);
		_CONTEXT.drawImage(
			_this.img,
			-(_this.img.width/2),
			-(_this.img.height/2),
			_this.img.width,
			_this.img.height			
		);

		// _CONTEXT.strokeStyle = 'rgb(200,200,255)';
		// _CONTEXT.beginPath();
		// _CONTEXT.rect(
		// 	-(_this.img.width/2),
		// 	-(_this.img.height/2),
		// 	_this.img.width,
		// 	_this.img.height
		// );
		// _CONTEXT.stroke();

		_CONTEXT.restore();

		_this._c=(_this._c>200)?0:_this._c+1;
	}
	//moveはmain.jsから処理させない
	move(){}
}
class ENEMY_BOSS_FRAME_BODY
	extends GameObject_ENEMY{
	constructor(_d){
		super(_CANVAS_IMGS.enemy_frame_body1.obj,_d.x,_d.y);
		let _this=this;
		_this.img=_CANVAS_IMGS.enemy_frame_body1.obj;
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

		_this.setDrawImageRotate(_this._deg);
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
		_this.setDrawImageRotate(_this._deg);

	}
	//moveはmain.jsから処理させない
	move(){}
}


//====================
//　弾クラス
//	_p.x:敵の弾発射開始x位置
//	_p.y:敵の弾発射開始y位置
//	_p.deg:敵の弾を発射する角度（deg）
//			※未指定の場合は自機との角度
//	_p.img:弾の画像
//	_p.imgPos:スプライト画像の位置（Array）
//====================
class GameObject_ENEMY_SHOT{
//	constructor(_x,_y,_tx,_ty){
	constructor(_p){
		let _this=this;
		_this.x=_p.x||500;
		_this.y=_p.y||300;
		_this.tx=_PLAYERS_MAIN.getPlayerCenterPosition()._x;
		_this.ty=_PLAYERS_MAIN.getPlayerCenterPosition()._y;

		_this.img=_p.img||_CANVAS_IMGS['enemy_bullet'].obj;
		_this.imgPos=_p.imgPos||[0,18];//スプライトのコマポジション
		_this._c=0;//アニメーションカウント
		_this.aniItv=5;//アニメーション間隔

		_this.speed=_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SHOT_SPEED;//定義：発射スピード
		//角度指定。
		//自身と相手までのラジアン
		_this.rad=(function(){
			if(_p.deg===undefined){
				return _GAME.getRad(
					{x:_this.tx,y:_this.ty},
					{x:_this.x,y:_this.y});
			}
			return _p.deg*Math.PI/180;
		})();
		_this.deg=_p.deg||_GAME.getDeg(
							{x:_this.tx,y:_this.ty},
							{x:_this.x,y:_this.y});
		// _this.deg=//自身と相手までの角度
		// 	_this.rad*180/Math.PI;
		_this.sx=Math.cos(_this.rad);//単位x
		_this.sy=Math.sin(_this.rad);//単位y

		_this._shot_alive=true;//発射中フラグ
		_this._isshow=true;//弾の状態

		_this.shotColMap=[
			"1,1,"+(_this.img.width-1)+","+(_this.img.height-1)
		];
	}
	init(){
		let _this=this;
		_this._shot_alive=false;
		_this._isshow=false;
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
	setDrawImageRotate(_deg){
		//透明に設定する
		let _this=this;
		_CONTEXT.save();
		_CONTEXT.translate(_this.x+(_this.img.width/2),_this.y+(_this.img.height/2));
		_CONTEXT.rotate((_deg||0)*Math.PI/180);
		_CONTEXT.drawImage(
			_this.img,
			-(_this.img.width/2),
			-(_this.img.height/2),
			_this.img.width,
			_this.img.height			
		);

		// _CONTEXT.strokeStyle = 'rgb(200,200,255)';
		// _CONTEXT.beginPath();
		// _CONTEXT.rect(
		// 	-(_this.img.width/2),
		// 	-(_this.img.height/2),
		// 	_this.img.width,
		// 	_this.img.height
		// );
		// _CONTEXT.stroke();

		_CONTEXT.restore();
	}
	setDrawImage(_d){
		//_w,_h,_s,_p,_deg
		let _this=this;
//		let _pos=_d._p||0;
		let _size=_d._s||_this.img.width;
		let _width=_d._w||_this.img.width;
		let _height=_d._h||_this.img.height;
		_CONTEXT.save();
		_CONTEXT.rotate((_d._deg||0)*Math.PI/180);
//		_this.setDrawImageDirect();
		if(_d._s===undefined){
			//一枚画像用
			_CONTEXT.drawImage(
				_this.img,
				_this.x,
				_this.y,
				_this.img.width,
				_this.img.height
			);
		}else{
			//スプライト用
//			console.log('======='+_this.x);
			_CONTEXT.drawImage(
				_this.img,
				_this.imgPos[parseInt(_this._c/_this.aniItv)],
				0,
				_width,
				_height,
				_this.x,
				_this.y,
				_width,
				_height
			);	

			// _CONTEXT.strokeStyle = 'rgb(200,200,255)';
			// _CONTEXT.beginPath();
			// _CONTEXT.rect(
			// 		_this.x,
			// 		_this.y,
			// 		_width,
			// 		_height
			// );
			// _CONTEXT.stroke();
		}
		_CONTEXT.restore();
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
		_this._c=(_this._c>=7)?0:_this._c+1;

		_this.x+=_this.sx*_this.speed;
		_this.y+=_this.sy*_this.speed;

		_this.setDrawImage({
			_s:18,
			_w:18
		});
		_this._shot_alive=true;
	}
}

class ENEMY_SHOT_LASER
	extends GameObject_ENEMY_SHOT{
	constructor(_p){
		super({x:_p.x,y:_p.y});
		this.img=_p.img||_CANVAS_IMGS['enemy_bullet_laser'].obj;
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
	constructor(_p){
		super({x:_p.x,y:_p.y,deg:_p.deg});
		let _this=this;
		_this.img=_CANVAS_IMGS['enemy_cristalcore_shot'].obj;
		_this.speed=10;
	}
	move(){
		let _this=this;
		if(_GAME.isEnemyCanvasOut(_this)){
			_this.init();
			return;
		}
		if(!_this._shot_alive){return;}
		_this.map_collition();

		_this.x-=_this.sx*_this.speed;
		_this.y-=_this.sy*_this.speed;

		_CONTEXT.save();
		_this.setDrawImageRotate(_this.deg);
		_CONTEXT.restore();
	}
}


class ENEMY_SHOT_FRAME
	extends GameObject_ENEMY_SHOT{
	constructor(_p){
		super({x:_p.x,y:_p.y,deg:_p.deg});
		let _this=this;
		_this.img=_CANVAS_IMGS['enemy_frame_3'].obj;
		_this.speed=1;
		_this._c=0;
	}
	move(){
		let _this=this;
		if(_GAME.isEnemyCanvasOut(_this)){
			_this.init();
			return;
		}
		if(!_this._shot_alive){return;}
		_this.map_collition();

		if(_this._c>100){
			let _e=_this.getEnemyCenterPosition();
			for(let _i=30;_i<=360;_i+=30){
				_ENEMIES_SHOTS.push(new ENEMY_SHOT_FRAME_SMALL({x:_e._x,y:_e._y,deg:_i}));
			}
			_this.init();
		}
		if(!_this._shot_alive){return;}
		_this.map_collition();

		_this.x-=_this.sx*_this.speed;
		_this.y-=_this.sy*_this.speed;

		_CONTEXT.save();
		_this.setDrawImageRotate(_this.deg);
		_CONTEXT.restore();

		_this._c++;
	}
}

class ENEMY_SHOT_FRAME_SMALL
	extends GameObject_ENEMY_SHOT{
	constructor(_p){
		super({x:_p.x,y:_p.y,deg:_p.deg});
		let _this=this;
		_this.img=_CANVAS_IMGS['enemy_frame_5'].obj;
		_this.speed=5;
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
		_this.setDrawImageRotate(_this.deg);
		_CONTEXT.restore();
	}
}
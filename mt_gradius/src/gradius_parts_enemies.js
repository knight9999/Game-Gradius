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
//	constructor(_o,_x,_y,_imgPos,_aniItv,_w,_h){
	constructor(_p){
		let _this=this;
		_this.id=_ENEMIES.length;
		_this.gid=0;//敵のグループID
		_this.img=_p.img;//画像オブジェクト
		_this.imgPos=_p.imgPos||[0];//スプライト時の画像
		_this.aniItv=_p.aniItv||10;//スプライトアニメによる間隔(ms)
		_this.width=_p.width||_this.img.width;
		_this.height=_p.height||_this.img.height;
		_this.x=_p.x||0;//X位置
		_this.y=_p.y||0;//Y位置
		//向きの設定 nullもあり。（ステージセレクトにて使用）
		_this.direct=(_p.direct===undefined)?_DEF_DIR._D:_p.direct;
		_this._s=_p.s||'0';//MAP衝突ビット

		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision1'];
		_this.audio_alive=_CANVAS_AUDIOS['enemy_collision3'];
		
		_this.isshot=false;
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
		
		_this._standby=true;//スタンバイ状態
		_this._isshow=true;
		_this._status=1;//生存ステータス

		_this.haspc=false;//パワーカプセル所持フラグ

		_this._collision_type='t0';

		//完全に無視する
		_this.is_ignore=_p.is_ignore||false;
		//敵衝突可能フラグ（falseは無敵）
		_this.is_able_collision=true;
		//衝突してるがショットを通過させる
		//true:衝突判定するが、ショットは通過
		//false:衝突するものの無視
		_this.is_ignore_collision=false;
		//衝突時自機の攻撃を初期化させる
		//主にレーザーに対して処理させる
		_this.is_collision_player_init=false;

		//衝突判定座標(x1,y1,x2,y2)
		//左上：x1,y1
		//右下：x2,y2
		_this.shotColMap=[
			"0,0,"+_this.width+","+_this.height
		];
		_this.col_date=null;//打たれた時間
		_this.col_canint=150;//連続ショット許可間隔(ms)
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
	isAbleCollision(){return this.is_able_collision;}
	isIgnore(){return this.is_ignore;}
	isIgnoreCollision(){return this.is_ignore_collision;}
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
		return {_x:this.x+(this.width/2),
				_y:this.y+(this.height/2)}
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
		return parseInt(Math.random() * (2 - 1) + 1) * ((Math.random() > 0.5) ? 1 : -1);
	}
	set_imgPos(){
		let _this=this;
		_this._c=
			(_this._c>=(_this.imgPos.length*_this.aniItv)-1)?0:_this._c+1;
	}
	get_imgPos(){
		let _this=this;
		return _this.imgPos[parseInt(_this._c/_this.aniItv)]
	}
	setDrawImageDirect(){
		let _this=this;
		if(_this.direct===_DEF_DIR._U){
			_CONTEXT.setTransform(1,0,0,-1,0,_this.y*2+_this.height);
		}
		if(_this.direct===_DEF_DIR._LU){
			_CONTEXT.setTransform(-1,0,0,-1,_this.x*2+_this.width,_this.y*2+_this.height);
		}
		if(_this.direct===_DEF_DIR._LD){
			_CONTEXT.setTransform(-1,0,0,1,_this.x*2+_this.width,0);
		}
		return;
	}
	setDrawImage(){
		let _this=this;
		if(!_this.isMove()){return;}
		_CONTEXT.save();
		_this.setDrawImageDirect();
		_CONTEXT.drawImage(
			_this.img,
			_this.get_imgPos(),
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
		if(_this.direct===_DEF_DIR._U){
			_CONTEXT.setTransform(1,0,0,-1,0,_this.y*2+_this.img.height);
		}
		if(_this.direct===_DEF_DIR._LU){
			_CONTEXT.setTransform(-1,0,0,-1,_this.x*2+_this.img.width,_this.y*2+_this.img.height);
		}
		if(_this.direct===_DEF_DIR._LD){
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
				_x||_this.x+(_this.width/2),
				_y||_this.y+(_this.height/2),
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
		//弾の発射
	}
	moveSet(){}
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
//		_this.moveDraw();
		_this.moveSet();
		_this.shot();
	}
}

//編隊を管理する敵クラス
//実体はFAN_MAINクラスのため、
//これ自身は当たり判定等は無視
//ただし、編隊を全て倒した時の
//パワーカプセル表示の為に
//座標位置は保持しておく。
//キャンバス内から登場させると、
//編隊の表示間隔がずれる
class ENEMY_FAN extends GameObject_ENEMY{
//    constructor(_x,_y,_d){
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_fan'].obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0,25,50,75,100,125,150,175],
			aniItv:5,
			width:25,
			height:25,
			direct:_p.direct
		});
		let _this=this;
		_this.haspc=true;
		_this.parts=[];//スタンバイ完了後に設定
		_this.is_ignore=true;
	}
	move_standby(){
		let _this=this;
		if(_this.x>_CANVAS.width){return;}
		_this._standby=false;
		_this.parts=[
			new ENEMY_FAN_MAIN({x:_this.x+_this.width*0.0,y:_this.y}),
			new ENEMY_FAN_MAIN({x:_this.x+_this.width*0.5,y:_this.y}),
			new ENEMY_FAN_MAIN({x:_this.x+_this.width*1.0,y:_this.y}),
			new ENEMY_FAN_MAIN({x:_this.x+_this.width*1.5,y:_this.y}),
			new ENEMY_FAN_MAIN({x:_this.x+_this.width*2.0,y:_this.y}),
			new ENEMY_FAN_MAIN({x:_this.x+_this.width*2.5,y:_this.y}),
		];
		//敵クラスに追加
		for(let _i=0;_i<_this.parts.length;_i++){
			_ENEMIES.push(_this.parts[_i]);
		}
	}
	setDrawImage(){}
	moveSet(){
		let _this=this;
		//表示
		for(let _i=_this.parts.length-1;_i>=0;_i--){
			let _pt=_this.parts[_i];
			_pt.moveSet();
			//敵を倒す度に要素を減らす。
			if(!_pt.isalive()){
				_this.parts.splice(_i,1);
			}
		}
		if(_this.parts.length===0){
			//キャンバスから外れたらカプセルは表示させない
			if(_this.x<_CANVAS.width){
				_this.showCollapes();
			}
			//全ての敵を倒す、あるいは自身がキャンバスから外れた場合、自身が消える
			_this.init();
			return;
		}
		//自身の座標は最後に残った敵の座標を取得する。
		//※その座標は最終的にパワーカプセルを表示させる位置とする	
		_this.x=_this.parts[_this.parts.length-1].x
		_this.y=_this.parts[_this.parts.length-1].y
//		console.log(_this.x)
	}
}

class ENEMY_FAN_MAIN extends GameObject_ENEMY{
    constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_fan'].obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0,25,50,75,100,125,150,175],
			aniItv:5,
			width:25,
			height:25
		});
		let _this=this;
		_this._status=1;
		_this.speed=2;
		_this.pos_y=(_p.y>250);//0:250より上 1:250より下
		_this.change_x=false;//xの移動切替位置
		_this.change_y=false;//yの移動切替位置
	}
	isCanvasOut(){
		let _this=this;
		//Uターンさせる動きにより、
		//スタンバイ終了後、右画面へ消えたらキャンバス外扱い
		return _GAME.isEnemyCanvasOut(
			_this,{
				up:false,
				down:false,
				left:true,
				right:(_this.change_x)
			}
		);
	}
	moveSet(){
		let _this=this;
		_this.x=_MAP.getX(_this.x);
		_this.y=_MAP.getY(_this.y);
		if(!_this.isMove()){return;}

		const _X_LEFT=500;//xの切替位置
		const _Y_TOP=(_this.pos_y)?275:200;//yの切替位置
		_this.change_x=_this.change_x||(_this.x<_X_LEFT);
		_this.x+=(_this.change_x)
			?_this.speed+_MAP.getBackGroundSpeed()
			:_this.speed*-1;
		_this.change_y=_this.change_y
				||(_this.pos_y&&_this.y<_Y_TOP||!_this.pos_y&&_this.y>_Y_TOP);
		_this.y+=(()=>{
			if(!_this.change_x){return 0;}
			if(_this.change_y){return 0;}
			return (_this.pos_y)?_this.speed*-1:_this.speed;
		})()

		_this.set_imgPos();
		//弾の発射
		_this.shot();
	}
	move(){}//親に指示させるので、ここでは無効にする
}

class ENEMY_a extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_p.img||_CANVAS_IMGS['enemy_a'].obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0],
			width:25,
			direct:_p.direct
		});
		let _this=this;
		_this._status=1;
	}
	setDrawImageDirect(){
		let _this=this;
		//向き・表示の設定
		if(_this.direct===_DEF_DIR._U){
			if(_PLAYERS_MAIN.x<_this.x){
				_CONTEXT.setTransform(1,0,0,-1,0,_this.y*2+_this.height);
			}else{
				_CONTEXT.setTransform(-1,0,0,-1,_this.x*2+_this.width,_this.y*2+_this.height);			
			}
		}
		if(_this.direct===_DEF_DIR._D){
			if(_PLAYERS_MAIN.x<_this.x){
				_CONTEXT.setTransform(1,0,0,1,0,0);
			}else{
				_CONTEXT.setTransform(-1,0,0,1,_this.x*2+_this.width,0);
			}
		}
	}
	moveSet(){
		let _this=this;
		//砲台の向き設定
		_this.imgPos=((_y)=>{
			if(_y>150){
				return [0];
			}else if(_y<=150&&_y>100){
				return [25];
			}else{
				return [50];
			}
		})(Math.abs(_PLAYERS_MAIN.y-_this.y));
	}
}

class ENEMY_b extends ENEMY_a{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_b'].obj,
			x:_p.x,
			y:_p.y,
			direct:_p.direct
		});
        let _this=this;
		_this.haspc=true;
	}
}


class ENEMY_c extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_c'].obj,
			x:_p.x,
			y:_p.y,
			width:50,
			height:50,
			imgPos:[0,50,100,150,200,250,300],
			direct:_p.direct
		});
		let _this=this;
		_this._st='_st1';
		_this._shot=false;
		_this._status=1;//ライフステータス

		_this._collision_type='t1';

		_this.speed=
			_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SPEED;
		_this.y=(_p.direct===_DEF_DIR._D)
			?_p.y-_this.height-_MAP.t
			:_p.y;

		_this.shotColMap=
				(_this.direct===_DEF_DIR._D)
					?["10,10,43,42"]
					:["0,0,43,32"];
		
        _this._ene_status={
		'_st1':{
			_f:function(){//walk
				if(_this._shot===true){return;}
				_this.imgPos=[0,50,100,150];
				_this.set_imgPos();
			},
			_setX:function(){
				return _this.x+(_this.speed*2);
			}
        },//_st1
		'_st2':{
			_f:function(){//shot
				if(_this.x>=_CANVAS.width){return;}
				_this._shot=true;
				_this.imgPos=[200,250,300];
				_this.set_imgPos();
				if(_this._c>=_this.imgPos.length*_this.aniItv-1){
					_this.shot();
					_this._shot=false;
					_this._st='_st1';
					return;
				}
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
			if(_t.direct===_DEF_DIR._U){
				if(_f){return _t.y+_s;}
				return _t.y;
			}else if(_t.direct===_DEF_DIR._D){
				if(_f){return _t.y-_s;}
				return _t.y;
			}
		})(_this);

		//穴パターン
		_this.y=(function(_t){
			if(_t.direct===_DEF_DIR._U){
				//上に穴がある場合、敵を上にあげる
				if(!_MAP.isMapCollision(_map_x,_map_y-1)){
					return _t.y-_s;
				}
				return _t.y;
			}else if(_t.direct===_DEF_DIR._D){
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
		if(_this.direct===_DEF_DIR._U){
			if(_PLAYERS_MAIN.x<_this.x){
				_CONTEXT.setTransform(1,0,0,-1,0,_this.y*2+_this.height);
			}else{
				_CONTEXT.setTransform(-1,0,0,-1,_this.x*2+_this.width,_this.y*2+_this.height);			
			}
		}
		if(_this.direct===_DEF_DIR._D){
			if(_PLAYERS_MAIN.x<_this.x){
				_CONTEXT.setTransform(1,0,0,1,0,0);
			}else{
				_CONTEXT.setTransform(-1,0,0,1,_this.x*2+_this.width,0);
			}
		}
		return;
	}
	set_speed(){
		let _p=
			_PLAYERS_MAIN.getPlayerCenterPosition();

		if(this._c>5000*Math.random()){
			this._c=0;
			this.speed=(_p._x<this.x)
				?this.speed*-1
				:Math.abs(this.speed);
		}
	}
	shot(){
		let _this=this;
		if(_this._st==='_st1'){return;}
		//キャンバス内でショットさせる
		if(_GAME.isEnemyCanvasOut(_this)){return;}
		if(Math.random()>=
		_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SHOT_RATE){
			return;
		}

		let _p=_PLAYERS_MAIN.getPlayerCenterPosition();
		let _e=_this.getEnemyCenterPosition();
		let _deg=_GAME.getDeg({x:_p._x,y:_p._y},{x:_e._x,y:_e._y});
		_ENEMIES_SHOTS.push(
			new GameObject_ENEMY_SHOT({x:_e._x,y:_e._y,deg:_deg-10}));
		_ENEMIES_SHOTS.push(
			new GameObject_ENEMY_SHOT({x:_e._x,y:_e._y,deg:_deg+10}));
	}
	moveSet(){
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
	}
}


class ENEMY_d extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_p.img||_CANVAS_IMGS['enemy_d'].obj,
			x:_p.x,
			y:_p.y,
			width:25,
			imgPos:[0,25,50,75,100,125]
		});
        let _this=this;
		_this.speed=2;
	}
	moveSet(){
		let _this=this;

		_this.x+=_this.speed*-1;
		let _d=_this.x;//radのスピード
		let _v=Math.cos(_d*Math.PI/180);//縦幅調整
		_this.y+=_v;
		_this.set_imgPos();
	}
}

class ENEMY_e extends ENEMY_d{
	// constructor(_x,_y,_d){
	// 	super(_x,_y,_d);
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_e'].obj,
			x:_p.x,
			y:_p.y,
			direct:_p.direct
		});
		let _this=this;
		_this.haspc=true;
	}
}

class ENEMY_f extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_p.img||_CANVAS_IMGS['enemy_f'].obj,
			x:_p.x,
			y:_p.y,
			width:30,
			imgPos:[0,30,60,90],
			direct:_p.direct
		});
		let _this=this;
		_this._v=0;
		_this.speed=(_p.direct===_DEF_DIR._U)
					?-0.05
					:0.05;
	}
	getDir(){
		return (this.x>_CANVAS.width/2)?-1:1;
	}
	isCanvasOut(){
		return _GAME.isEnemyCanvasOut(
			this,{up:true,down:true,left:false,right:false}
		);
	}
	shot(){
		//弾は敵周囲に発射させる
		let _this=this;
		if(_this._v>0&&_this._v<0.05){}else{return;}

		let _e=_this.getEnemyCenterPosition();
		for(let _i=30;_i<=360;_i+=30){
			_ENEMIES_SHOTS.push(
				new GameObject_ENEMY_SHOT({x:_e._x,y:_e._y,deg:_i})
			);
		}
	}
	move_standby(){
		let _this=this;
		if(_this.x+_this.width<0){
			_this._standby=false;
		}
	}
	moveSet(){
		let _this=this;
//		console.log(_this.x)
		_this.x+=3*_this.getDir();		
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
		_this.set_imgPos();
	}
}

class ENEMY_g extends ENEMY_f{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_g'].obj,
			x:_p.x,
			y:_p.y,
			direct:_p.direct
		});
		let _this=this;
		_this.haspc=true;
	}
}

//ハッチ
class ENEMY_m extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_m1'].obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0,50,100,150,100,50,0],
			width:50,
			height:24,
			aniItv:5,
			direct:_p.direct
		});

		let _this=this;
		_this._status=4;
		_this._collision_type='t1';
		_this.getscore=200;
		_this._isopen=false;
		_this._col_c=0;
		_this._open_count=0;
	}
	shot(){}
	moveSet(){
		let _this=this;
		if(!_this.isalive()){
			_this.showCollapes(
				0,
				(_this.direct===_DEF_DIR._U)?0:-_MAP.t
			);			
			return;
		}

		//残り1つのステータスになった場合、画像を切り替える
		_this.img=(_this._status<=1)
			?_CANVAS_IMGS['enemy_m2'].obj
			:_CANVAS_IMGS['enemy_m1'].obj;

		//閉じてる状態
		if(!_this._isopen){
			//開くタイミングを設定
			if(_this.x>=690&&_this.x<700){_this._isopen=true;}
			if(_this.x>=380&&_this.x<400){_this._isopen=true;}
			_this.imgPos[0];
			return;
		}

		//以下は開いてる状態
		_this._open_count++;

		//ハッチが開く、または閉じるアニメーションのみ
		//アニメーションカウントを増やす
		if(_this._open_count>0&&_this._open_count<20
			||_this._open_count>200&&_this._open_count<220){
			//ハッチのアニメーションカウントを増やす			
			_this.set_imgPos();
		}
		//クローズ開始処理
		if(_this._open_count>200){
			if(_this._c>=(_this.imgPos.length*_this.aniItv)-1){
				//アニメーションのポジションが末端に達したらリセット
				_this._open_count=0;
				_this._isopen=false;
				return;
			}	
		}
		//ザコを吐き出す
		if(!_this._isopen){return;}
		if(_this._open_count%15!==0){return;}
		let _cls=new ENEMY_m_group({
			x:_this.x+12.5,
			y:_this.y+((_this.direct===_DEF_DIR._U)?15:-10),
			direct:_this.direct
		});
		_ENEMIES.push(_cls);
		
	}
}

//ハッチ（吐き出し）
class ENEMY_m_group extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_m_group'].obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0,25,50,75,100,125,150],
			aniItv:5,
			width:25,
			height:25,
			direct:_p.direct
		});
		let _this=this;
		_this.speed=2;
		_this.getscore=100;
		_this._change=false;
		_this._moveX=0;
		_this._moveY=0;
		
	}
	isCanvasOut(){
		return _GAME.isEnemyCanvasOut(this);
	}
	moveSet(){
		let _this=this;

		let _p=_PLAYERS_MAIN.getPlayerCenterPosition();
		_this._change=(function(){
			if(_this._change){return true;}
			if(_this.direct===_DEF_DIR._U){
				if(_p._y<_this.y){
					_this._moveX=(_p._x<_this.x)
									?_this.speed*-1
									:_this.speed
					return true;
				}
			}
			if(_this.direct===_DEF_DIR._D){
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
			if(_this.direct===_DEF_DIR._U){
				return _this.speed;
			}
			if(_this.direct===_DEF_DIR._D){
				return _this.speed*-1;
			}
		})();

		_this.x+=_this._moveX;
		_this.y+=_this._moveY;

		_this.set_imgPos();
	}
}

//火山（上）本体
class ENEMY_n extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_o'].obj,
			x:_p.x,
			y:_p.y,
			width:25,
			direct:_p.direct,
			is_ignore:true
		});
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
	shot(){}
	setDrawImage(){}
	moveSet(){
		let _this=this;
		//オブジェクト追加
		if(Math.random()>0.2){return;}
		let _cls=new ENEMY_n_small({
					x:_this.x,
					y:_this.y
			});
		_ENEMIES.push(_cls);
	}
}

//火山（下）本体
class ENEMY_o extends ENEMY_n{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_o'].obj,
			x:_p.x,
			y:_p.y,
			direct:_p.direct
		});
	}
	moveSet(){
		let _this=this;
		//オブジェクト追加
		if(Math.random()>0.1){return;}
		let _cls=new ENEMY_o_small({
					x:_this.x,
					y:_this.y
				});
		_ENEMIES.push(_cls);
	}
}

//火山吐き出し（下）
class ENEMY_o_small extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_o'].obj,
			x:_p.x,
			y:_p.y,
			imgPos:((Math.random()>0.5)?[0]:[25]),
			width:25,
			height:25,
			direct:_p.direct
		});
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
	shot(){}
	moveSet(){
		let _this=this;
		_this.map_collition();
		_this.x-=(_this.speedX*_this.flagX);
		_this.y+=_this._v;
		_this._v+=_this.speedY;
	}
}

//火山吐き出し（上）
class ENEMY_n_small extends ENEMY_o_small{
	constructor(_p){
		super({
			x:_p.x,
			y:_p.y,
			direct:_p.direct
		});
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
	constructor(_p){
		super({
			img:_p.img||_CANVAS_IMGS['enemy_p_1'].obj,
			x:_p.x,
			y:_p.y,
			direct:_p.direct
		});
		let _this=this;
		_this._status=4;
		_this.getscore=100;
		_this.speedx = _BACKGROUND_SPEED;
		_this.speedy = _this.get_move_bound_val();
		//レーザーのみ当たり判定を通常の半分にする。
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;

		_this._s='0000,0000,0000,0000';
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

		let _flag=false;

		if (_MAP.isMapCollision(_map_x - 1, _map_y)) {
			_this.speedx = Math.abs(_this.speedy);
			_flag = true;
		}
		if (_MAP.isMapCollision(_map_x + 1, _map_y)) {
			_this.speedx *= -1;
			_flag = true;
		}

		if (_MAP.isMapCollision(_map_x, _map_y - 1)) {
			_this.speedy = Math.abs(_this.speedy);
			_flag = true;
		}
		if (_MAP.isMapCollision(_map_x, _map_y + 1)) {
			_this.speedy *= -1;
			_flag = true;
		}

		if(!_flag){return;}
		if ((new Date()).getTime() - _this.col_date < 500) {
			return;
		}
		_this.col_date = (new Date()).getTime();

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
			if(_r===_IS_SQ_NOTCOL){continue;}
			if ((new Date()).getTime() - _this.col_date < 200) {
				continue;
			}
			_this.speedx=_this.get_move_bound_val();
			_this.speedy=_this.get_move_bound_val();
			_eb[_i].speedx=_this.get_move_bound_val();
			_eb[_i].speedy=_this.get_move_bound_val();

			_this.col_date=(new Date()).getTime();
		}
	}
	showCollapes(){
		let _this=this;
		if(_this._status>0){return;}
		let _cp = _this.getEnemyCenterPosition();
		const set_enemies_p_parts=[
			{
				img: _CANVAS_IMGS['enemy_p_2'].obj,
				x: -30,
				y: -30
			},
			{
				img: _CANVAS_IMGS['enemy_p_3'].obj,
				x: 0,
				y: -30
			},
			{
				img: _CANVAS_IMGS['enemy_p_4'].obj,
				x: 30,
				y: -30
			},
			{
				img: _CANVAS_IMGS['enemy_p_5'].obj,
				x: -30,
				y: 30
			},
			{
				img: _CANVAS_IMGS['enemy_p_6'].obj,
				x: 0,
				y: 30
			},
			{
				img: _CANVAS_IMGS['enemy_p_3'].obj,
				x: 30,
				y: 30
			}
		];
		for (let _i = 0; _i < set_enemies_p_parts.length; _i++) {
			let _obj = set_enemies_p_parts[_i];
			_ENEMIES.push(new ENEMY_p_small({
				img: _obj.img,
				x: _cp._x+_obj.x,
				y: _cp._y+_obj.y
			}));
		}
		_GAME._setPlay(_CANVAS_AUDIOS['enemy_collision4']);
		_this.init();
	}
	shot(){}
	moveSet(){
		let _this=this;
		
		_this.map_collition();
		_this.move_bounds();
		_this.x -= ((_t)=>{
			if (_t.x + _t.img.width > _CANVAS.width) {
				_t.speedx = Math.abs(_t.speedx);
			}
			return _t.speedx;
		})(_this);
		_this.y += ((_t)=>{
			if (_t.y < 0) {
				_t.speedy = Math.abs(_t.speedy);
			} else if (_t.y + _t.img.height > _CANVAS.height) {
				_t.speedy = -1;
			}
			return _t.speedy;
		})(_this);
	}
}
//クリスタル（分裂）
class ENEMY_p_small extends ENEMY_p {
	constructor(_p){
		super({
			img:_p.img,
			x:_p.x,
			y:_p.y,
			direct:_p.direct
		});
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
	showCollapes(_x, _y) {
		let _this = this;
		//敵を倒した場合
		_this._isshow = false;
		//爆発して終了
		_ENEMIES_COLLISIONS.push(
			new GameObject_ENEMY_COLLISION(
				_x || _this.x + (_this.width / 2),
				_y || _this.y + (_this.height / 2),
				_this._collision_type)
		);
	}
}

//モアイ（立）
class ENEMY_q extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_m_a_1'].obj,
			x:_p.x,
			y:_p.y,
			direct:_p.direct
		});

        let _this=this;
		_this._status=2;
		_this.getscore=500;
		
		_this._isSetMapDefCol=false;
		_this._isopen=false;
		_this._open_count=0;
		_this.imgs=[
			_CANVAS_IMGS['enemy_m_a_1'].obj,
			_CANVAS_IMGS['enemy_m_a_2'].obj
		];
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision5'];		
		_this.audio_alive=_CANVAS_AUDIOS['enemy_collision8'];
		_this._collision_type='t8';
		//衝突時のY座標アニメーション
		_this._collision_posy=(_this.direct===_DEF_DIR._D)?25:0;

		//レーザーのみ当たり判定を通常の半分にする。
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;

		_this.shotColMap=[
			(function(){
			if(_this.direct===_DEF_DIR._D){return "0,50,35,85";}//右下
			if(_this.direct===_DEF_DIR._U){return "0,25,35,50";}//右上
			if(_this.direct===_DEF_DIR._LD){return "75,55,100,70";}//左下
			if(_this.direct===_DEF_DIR._LU){return "75,35,100,50";}//左上
			})()
		];

		//衝突座標設定
		_this._s=(()=>{
			if(_this.direct===_DEF_DIR._D){return '0000,0011,0110,1111';}//右下
			if(_this.direct===_DEF_DIR._U){return '1111,0110,0011,0000';}//右上
			if(_this.direct===_DEF_DIR._LD){return '0000,1100,1110,1111';}//左下
			if(_this.direct===_DEF_DIR._LU){return '1111,1110,1100,0000';}//左上
			})()
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
		if(_this.direct===_DEF_DIR._LU
			||_this.direct===_DEF_DIR._LD){
			if(_PLAYERS_MAIN.x<_this.x){return false;}
		 }
		return true;
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
			return true;
		}
		return true;
	}
	shot(){
		//モアイリングをショットする。
		//-100から+1ずつ加算。
		//0〜200間口を開く
		let _this=this;
		if(!_this.isalive()){return;}

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
			new ENEMY_moai_ring({
				x:_this.x+parseInt(_this.shotColMap[0].split(',')[0]),
				y:_this.y+parseInt(_this.shotColMap[0].split(',')[1]),
				direct:_this.direct
			})
		);
//		console.log(_this._open_count)
	}
	showCollapes(){
		let _this=this;
		_this.img=_CANVAS_IMGS['enemy_m_z'].obj;
		//爆発後にMAP衝突用の内容を変更する
		if(_this._isSetMapDefCol){return;}
		_MAP.set_mapdef_col(
			_MAP.getMapX(_this.x),
			_MAP.getMapY(_this.y),
			(function(){
				if(_this.direct===_DEF_DIR._D){return "0000,0000,0000,1111";}
				if(_this.direct===_DEF_DIR._U){return "1111,0000,0000,0000";}
				if(_this.direct===_DEF_DIR._LD){return "0000,0000,0000,1111";}
				if(_this.direct===_DEF_DIR._LU){return "1111,0000,0000,0000";}
				})()
		);
		_ENEMIES_COLLISIONS.push(
			new GameObject_ENEMY_COLLISION
			(_this.x+(_this.img.width/2),
				_this.y+(_this.img.height/2)+_this._collision_posy,
				_this._collision_type));
	
		_this._isSetMapDefCol=true;
	}
}

//モアイ（横）
class ENEMY_r extends ENEMY_q{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_m_b_1'].obj,
			x:_p.x,
			y:_p.y,
			direct:_p.direct
		});
        let _this=this;
		_this._status=2;
		_this.imgs=[
			_CANVAS_IMGS['enemy_m_b_1'].obj,
			_CANVAS_IMGS['enemy_m_b_2'].obj
		];
		_this.img=_this.imgs[0];

		//衝突時のY座標アニメーション
		_this._collision_posy=(_this.direct===_DEF_DIR._D)?-10:0;

		_this.shotColMap=[
			(function(){
				if(_this.direct===_DEF_DIR._D){return "20,40,50,85";}
				if(_this.direct===_DEF_DIR._U){return "20,25,50,70";}
				})()
			];
		
		_this._s=(()=>{
			if(_this.direct===_DEF_DIR._D){return '0000,0000,0010,1111';}
			if(_this.direct===_DEF_DIR._U){return '1111,0010,0000,0000';}		
		})();
	}
}

//モアイ（リング）
class ENEMY_moai_ring extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_p.img||_CANVAS_IMGS['enemy_moai_ring'].obj,
			x:_p.x,
			y:_p.y,
			imgPos:_p.imgPos||[0,25],
			aniItv:_p.aniItv||5,
			width:_p.width||25,
			height:_p.height||25
		});
        let _this=this;
		_this.audio_collision=_CANVAS_AUDIOS['enemy_collision2'];		
		_this.rad=_GAME.getRad(_PLAYERS_MAIN,{x:_p.x,y:_p.y});
		_this.sx=Math.cos(_this.rad);
		_this.sy=Math.sin(_this.rad);
		_this.speed=_MAPDEFS[_MAP_PETTERN]._speed*1.5;

		//レーザーのみ当たり判定を通常の半分にする。
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;

		_this._collision_type='t2';
		((_this.direct===_DEF_DIR._D)?-10:0);
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
	shot(){}
	moveSet(){
		let _this=this;
		_this.map_collition();
		_this.x+=_this.sx*_this.speed;
		_this.y+=_this.sy*_this.speed;
		
		_this.set_imgPos();
	}
}


//炎（大）
class ENEMY_frame_1 extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_p.img||_CANVAS_IMGS['enemy_frame_large'].obj,
			x:_p.x,
			y:_p.y,
			width:53,
			imgPos:[0,53],
			direct:_p.direct
		});
		
		let _this=this;
		_this.getscore=100;

		_this.speed=(Math.random()*(6-3)+3)*-1;
		_this.rad=0;
		_this.speedx=0;
		_this.speedy=0;
		_this._isbroken=false;
		_this._c=0;
		_this.shotColMap=[
			"5,5,"+(_this.width-5)+","+(_this.height-5)
		];
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.5;

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
			_ENEMIES.push(
				new ENEMY_frame_2({
					x:_cp._x,
					y:_cp._y,
					direct:_this.direct
				})
			);
		}
		_this._isbroken=true;
		_GAME._setPlay(_CANVAS_AUDIOS['enemy_collision1']);
		_this.init();
	}
	shot(){}
	move_standby(){
		let _this=this;
		if(_this.x>=_CANVAS.width){return;}
		_this.rad=//自身と相手までのラジアン
			Math.atan2(
				(Math.random()*700-100-_this.y),
				0-_this.x);
		_this.deg=_this.rad/Math.PI*180;
		_this.speedx=Math.cos(_this.rad);//単位x
		_this.speedy=Math.sin(_this.rad);//単位y
		_this._standby=false;
	}
	moveSet(){
		let _this=this;		
		_this.map_collition();
		_this.set_imgPos();
		_this.x-=_this.speedx*_this.speed;
		_this.y-=_this.speedy*_this.speed;
	}
}
//炎（中）
class ENEMY_frame_2 extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_p.img||_CANVAS_IMGS['enemy_frame_small'].obj,
			x:_p.x,
			y:_p.y,
			direct:_p.direct,
			width:_p.width||35,
			imgPos:_p.imgPos||[0,35]
		});
		let _this=this;
		_this.speed=(Math.random()*(8-4)+4)*-1;
		_this.deg=Math.random()*(235-125)+125;
		_this.speedx=Math.cos(_this.deg*Math.PI/180);//単位x
		_this.speedy=Math.sin(_this.deg*Math.PI/180);//単位y
		
		_this._isbroken=false;
		_this.shotColMap=[
			"5,5,"+(_this.width-5)+","+(_this.height-5)
		];
		_this._standby=false;
	}
	shot(){}
	setDrawImage(){
		let _this=this;
		if(!_this.isMove()){return;}
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			deg:_this.deg+180,
			width:_this.width,
			imgPosx:_this.get_imgPos()
		});
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

		let _c=(_eb_l>30)?0:2;
		for(let _i=0;_i<_c;_i++){
			//オブジェクト追加
			_ENEMIES.push(
				new ENEMY_frame_3({
					x:_cp._x,
					y:_cp._y,
					direct:_this.direct
				})
			);
		}
		_this._isbroken=true;
		_GAME._setPlay(_CANVAS_AUDIOS['enemy_collision1']);
		_this.init();
	}
	moveSet(){
		let _this=this;
		_this.set_imgPos();
		_this.x-=_this.speedx*_this.speed;
		_this.y-=_this.speedy*_this.speed;
	}
}
//炎（小）
class ENEMY_frame_3 extends ENEMY_frame_2{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_frame_mini'].obj,
			x:_p.x,
			y:_p.y,
			direct:_p.direct,
			width:30,
			imgPos:[0,30]
		});
		let _this=this;
		_this._isbroken=false;
		_this.shotColMap=[
			"5,5,"+(_this.width-5)+","+(_this.height-5)
		];
		//無敵だが衝突を無視し、"ある程度"ショットは通過できる
		_this.is_able_collision=false;
		_this.is_ignore_collision=(Math.random()>0.05);
//		_this.is_ignore_collision=false;
		_this._standby=false;
	}
}


//細胞（中心）
//ENEMY_cell_hand_1
//ENEMY_cell_hand_2
//ENEMY_cell_hand_3
//を管理する。
class ENEMY_cell_core
	extends GameObject_ENEMY{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['enemy_cell_core'].obj,
			x:_p.x,
			y:_p.y,
			aniItv:20
		});
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

		//触手の上定義
		_this.hands_up_rad=[];
		_this.hands_up=[];
		//触手の上、腕の切り替えタイミング調整
		//自機をめがける、または適当な位置めがける切り替え
		_this.hands_up_count={c:0,max:parseInt(Math.random()*300)+100};
		//触手の下定義
		_this.hands_down_rad=[];
		_this.hands_down=[];
		_this.hands_down_count={c:0,max:parseInt(Math.random()*300)+100};

		//触手間の距離
		_this.hands_distance=12;
	}
	set_hands_target(_c,_max){
		let _this=this;
		let _pp=_PLAYERS_MAIN.getPlayerCenterPosition();
		if(_c%_max>0&&_c%_max<parseInt(_max/2)){
			return _pp;
		}
		return {_x:_this.x+200,_y:_this.y+100}		
	}
	set_hands_rad(_rads,_h1,_h2,_target){
		//触手間の角度を求める
		let _this=this;
//		console.log(_this._c)
		let _p=_target;

		let _h=_h2.getEnemyCenterPosition();
		let _range=parseInt(Math.random()*100)-50;
//		console.log(_range)
		let dx=(_p._x+_range)-_h._x;
		let dy=(_p._y+_range)-_h._y;
		//自身と相手の角度を求めたら
		//自身が動かせる角度の有効範囲を元に、
		//角度を調整する。

		let _rad=((_r)=>{
			//atan2()より0度以下の場合は、
			//正数に切り替える
			let _s=Math.random()/50;//動きスピード
			
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
	isCanvasOut(){
		return _GAME.isEnemyCanvasOut(
			this,
			{up:false,down:false,left:true,right:false},
			{left:200}
		);
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
				new ENEMY_cell_hand_3({x:_this.x,y:_this.y,rad:Math.PI*3/2-1.4,rad_min:Math.PI+0.3,rad_max:Math.PI+2.6,flag:true})
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
	shot(){}
	set_aniPos(){
		let _this=this;
		_this._c=
			(_this._c>=(_this.ani.length*_this.aniItv)-1)?0:_this._c+1;
	}
	get_aniPos(){
		let _this=this;
		return _this.ani[parseInt(_this._c/_this.aniItv)]
	}
	setDrawImage(){
		//細胞自身を表示
		let _this=this;
		//触手の上を表示
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
				_this.hands_up[_i].moveDraw();			
				continue;					
			}
			_this.set_hands_pos(
				_this.hands_up_rad[_i],
				_this.hands_up[_i],
				_this.hands_up[_i-1]);
			_this.hands_up[_i].moveDraw();			
		}

		//触手の下を表示
		for(let _i=0;_i<_this.hands_down.length;_i++){
			if(_i===0){
				_this.set_hands_pos(
					_this.hands_down_rad[_i],
					_this.hands_down[_i],
					_this,
					(_this.img.width/2)-(_this.hands_down[_i].img.width/2),
					_this.img.height-30);
				_this.hands_down[_i].moveDraw();			
				continue;					
			}
			_this.set_hands_pos(
				_this.hands_down_rad[_i],
				_this.hands_down[_i],
				_this.hands_down[_i-1]);
			_this.hands_down[_i].moveDraw();			
		}

		const _e=_this.getEnemyCenterPosition();
		_GAME._setDrawImage({
			img:_this.img,
			x:_e._x,
			y:_e._y,
			scale:_this.get_aniPos().scale*((_this._status/10>0.7)?_this._status/10:0.7)
		});
	}
	moveSet(){
		let _this=this;
		_this.set_aniPos();

		const _e=_this.getEnemyCenterPosition();
		const _p=_PLAYERS_MAIN.getPlayerCenterPosition();

		let _rad=_GAME.getRad(
			{x:_p._x,y:_p._y},
			{x:_e._x,y:_e._y}
		);
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
		_this.hands_up_count.c=
			(_this.hands_up_count.c>_this.hands_up_count.max)
				?0
				:_this.hands_up_count.c+1;
		let _target_up=
			_this.set_hands_target(
				_this.hands_up_count.c,
				_this.hands_up_count.max);
		for(let _i=_this.hands_up.length-1;_i>=0;_i--){
			//触手の最後の要素は
			//細胞との角度を求める
			if(_this.hands_up[_i-1]===undefined){
				_this.set_hands_rad(
					_this.hands_up_rad,
					_this,
					_this.hands_up[_i],
					_target_up
					);
				break;
			}
			_this.set_hands_rad(
				_this.hands_up_rad,
				_this.hands_up[_i-1],
				_this.hands_up[_i],
				_target_up
			);
			//触手の先端から弾を発射させる
			if(ENEMY_cell_hand_3.prototype.isPrototypeOf(_this.hands_up[_i])){
				_this.hands_up[_i].shot();
			}
		}

//		console.log(_this.hands_up_rad);

		//触手の下を表示
		_this.hands_down_rad=[];
		_this.hands_down_count.c=
			(_this.hands_down_count.c>_this.hands_down_count.max)
				?0
				:_this.hands_down_count.c+1;
		let _target_down=
			_this.set_hands_target(
				_this.hands_down_count.c,
				_this.hands_down_count.max);
		for(let _i=_this.hands_down.length-1;_i>=0;_i--){
			if(_this.hands_down[_i-1]===undefined){
				_this.set_hands_rad(
					_this.hands_down_rad,
					_this,
					_this.hands_down[_i],
					_target_down
				);
				break;
			}
			_this.set_hands_rad(
				_this.hands_down_rad,
				_this.hands_down[_i-1],
				_this.hands_down[_i],
				_target_down
			);
			//触手の先端から弾を発射させる
			if(ENEMY_cell_hand_3.prototype.isPrototypeOf(_this.hands_down[_i])){
				_this.hands_down[_i].shot();
			}
		}

		//自身の衝突判定を変更
		let _c=_this.get_aniPos();
		let _sc=((_this.img.width/2)-(_this.img.width*_c.scale/2))
				+","
				+((_this.img.height/2)-(_this.img.height*_c.scale/2))			
				+","
				+_this.img.width*_c.scale
				+","
				+_this.img.height*_c.scale;
		_this.shotColMap=[_sc];
	}
}
class ENEMY_cell_hand_1
	extends GameObject_ENEMY{
	constructor(_d){
		super({
			img:_d.img||_CANVAS_IMGS['enemy_cell_hand_1'].obj,
			x:_d.x,
			y:_d.y
		});
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
	isCanvasOut(){
		return _GAME.isEnemyCanvasOut(
			this,
			{up:false,down:false,left:true,right:false},
			{left:200}
		);
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
	setDrawImage(){}
	moveDraw(){
		let _this=this;
		_this._c=(_this._c>=(_this.ani.length*20)-1)?0:_this._c+1;
		const _e=_this.getEnemyCenterPosition();
		_GAME._setDrawImage({
			img:_this.img,
			x:_e._x,
			y:_e._y,
			scale:_this.ani[parseInt(_this._c/20)].scale
		});
		_this.shot();
	}
	move(){
		//敵の処理メイン
		//原則継承はしない
		let _this=this;
		_this.x=_MAP.getX(_this.x);
		_this.y=_MAP.getY(_this.y);
		if(!_this.isMove()){return;}
	}
}
class ENEMY_cell_hand_2
	extends ENEMY_cell_hand_1{
	constructor(_d){
		_d.img=_CANVAS_IMGS['enemy_cell_hand_2'].obj;
		super(_d)
		let _this=this;
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
		_d.img=_CANVAS_IMGS['enemy_cell_hand_3'].obj;
		super(_d)
	}
	shot(){
		//キャンバス内でショットさせる
		if(_GAME.isEnemyCanvasOut(this)){return;}

		if(Math.random()>=
		_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SHOT_RATE){
			return;
		}
		
		let _e=this.getEnemyCenterPosition();
		//敵の中心から弾を発射させるための位置調整
		_ENEMIES_SHOTS.push(
			new GameObject_ENEMY_SHOT({
				x:_e._x,
				y:_e._y,
				img:_CANVAS_IMGS['enemy_bullet_cell'].obj,
				imgPos:[0,15],
				width:15
				})
			);
	}
	moveDraw(){
		let _this=this;
		let _p=_PLAYERS_MAIN.getPlayerCenterPosition();
		let _e=_this.getEnemyCenterPosition();
		let _r=Math.atan2(_e._y-_p._y,_e._x-_p._x);
		_GAME._setDrawImage({
			img:_this.img,
			x:_e._x,
			y:_e._y,
			deg:_r/Math.PI*180
		});
//		_this.shot();
	}
}

class ENEMY_CELL_A extends ENEMY_a{
	constructor(_d){
		super({
			img:_CANVAS_IMGS['enemy_cell_a'].obj,
			x:_d.x,
			y:_d.y,
			direct:_d.direct
		});
	}
}	
class ENEMY_CELL_B extends ENEMY_a{
	constructor(_d){
		super({
			img:_CANVAS_IMGS['enemy_cell_b'].obj,
			x:_d.x,
			y:_d.y,
			direct:_d.direct
		});
        let _this=this;
		_this.haspc=true;
	}
}

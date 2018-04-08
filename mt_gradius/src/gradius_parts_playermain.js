//=====================================================
//	gradius_parts_platermain.js
//	プレーヤーパーツ
//	※デバッグモードはURLパラメータをつかう
//		debug:（true/false）:デバッグモード有無
//		mp:（数値）:debug有効時、デバッグしたいマップの配列要素（0スタート）
//		ed:（数値）:debug有効時、敵難易度（0スタート）
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

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

		this.shotflag=false;//発射可否
	}
	isalive(){return this._isalive;}
	isshotflag(){return this.shotflag;}
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
		this._isequipped=false;//装備可否
		this._isequipped_count=0;//装備アニメカウントダウン

		this.img=_CANVAS_IMGS['vicviper'].obj;
		this.imgsize=this.img.height;
		this.width=this.imgsize;
		this.height=this.imgsize;

		this.img_vb=_CANVAS_IMGS['vicviper_back'].obj;
		this.imgsize_vb=this.img_vb.height;
		this.width_vb=this.imgsize_vb;
		this.height_vb=this.imgsize_vb;

		// this.vv_ani=[//アニメ定義
		this.c_vv_ani=20;
		this.vv_ani=[120,60,0,180,240];
		this.vv_e_ani=[420,360,300,480,540];

		// this.vb_ani=[//噴射アニメ定義
		this.c_vb_ani=0;
		this.vb_ani=[0,14,28];
		this.vb_e_ani=[42,42,42];

		// 	{img:_CANVAS_IMGS['vicviper_back1'].obj,
		// 	scale:1},
		// 	{img:_CANVAS_IMGS['vicviper_back2'].obj,
		// 	scale:1},
		// 	{img:_CANVAS_IMGS['vicviper_back3'].obj,
		// 	scale:1}
		// ];
		// this.vb_e_ani=[//噴射アニメ定義
		// 	{img:_CANVAS_IMGS['vicviper_back1_e'].obj,
		// 	scale:1},
		// 	{img:_CANVAS_IMGS['vicviper_back1_e'].obj,
		// 	scale:1},
		// 	{img:_CANVAS_IMGS['vicviper_back1_e'].obj,
		// 	scale:1}
		// ];

		this._col_ani_c=0;
		this.col_ani=[//衝突時のアニメ定義
			{img:_CANVAS_IMGS['vicviper_bomb'].obj,
			scale:0.5},
			{img:_CANVAS_IMGS['vicviper_bomb'].obj,
			scale:0.7},
			{img:_CANVAS_IMGS['vicviper_bomb'].obj,
			scale:0.5},
			{img:_CANVAS_IMGS['vicviper_bomb'].obj,
			scale:0.3},
			{img:_CANVAS_IMGS['vicviper_bomb'].obj,
			scale:0.1}
		];

		this.shotflag=true;//発射可否
	}
	collapes(){
		let _this=this;
		if(_DRAW_SETINTERVAL===null){return;}
		_GAME._setStopOnBG();		
		_DRAW_STOP();
		_DRAW_PLAYER_COLLAPES();
	//		console.log(this._col_ani_c)
	}
	enemy_collision(_e){
		//forcefieldが生きてる間はスルー
		if(_PLAYERS_POWER_METER_SHIELD===1
			&&_PLAYERS_MAIN_FORCE.isalive()){
			return;
		}
		if(_GAME.isSqCollision(
			"25,26,35,32",
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
			&&_PLAYERS_MAIN_FORCE.isalive()){
			return;
		}

		if(_GAME.isSqCollision(
			"25,20,35,30",
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
		//forcefieldが生きてる間はスルー
		if(_PLAYERS_POWER_METER_SHIELD===1
			&&_PLAYERS_MAIN_FORCE.isalive()){
			return;
		}
		//プレーヤーの中心座標取得
		let _pl=this.getPlayerCenterPosition();
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_pl._x);
		let _map_y=_MAP.getMapY(_pl._y);

		if(_MAP.isMapCollision(_map_x,_map_y)){
			this.setfalsealive();
		}

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
	set_moveamount_reset(){
		let _this=this;
		_MAP.setBackGroundSpeedY(0);
		_this._x=0;
		_this._y=0;
		return;
	}
	set_moveamount(){
		let _this=this;
		//移動量の設定
//		console.log('======='+_this.y)
		if(!_PLAYERS_MOVE_FLAG){
			_this.set_moveamount_reset();
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
			/////////////////
//				console.log(_i)
			//Y軸ループの場合
			if(_MAP.map_infinite){
				if(_y<100){
					_MAP.setBackGroundSpeedY(_this._y);
					return 100;
				}
				if(_y>=100&&_y<=300){
					_MAP.setBackGroundSpeedY(0);
				}
				if(_y>300){
					_MAP.setBackGroundSpeedY(_this._y);
					return 300;
				}
				return _y;
			}
			//////////////////
			if(_y<=50-(_this.img.height/4)){
				_this._y=0;
				return 50-(_this.img.height/4);
			}
			if(_y>=_CANVAS.height-75-(_this.img.height/4)){
				_this._y=0;
				return _CANVAS.height-75-(_this.img.height/4);
			}
			return _y;
		})(_this.y);
		//自機移動分配列をセット
//		console.log('mgs==============:'+_MAP.map_backgroundY_speed);		
		_GAME._setPlayerMoveDraw();
	}
	move(){
		let _this=this;
		//敵・弾に当たったら終了
		if(!_this.isalive()){_this.collapes();return;}
		_this.map_collition();

		//移動量の設定
		_this.set_moveamount();

		//本機のアニメーション設定
		if(!_PLAYERS_MOVE_FLAG){
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
		let _img_vv=(function(){
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

		_CONTEXT.drawImage(
			_this.img,
			_img_vv,
			0,
			_this.imgsize,
			_this.imgsize,
			_this.x,
			_this.y,
			_this.imgsize,
			_this.imgsize
		);

		//噴射アニメ
		let _img_vb=(function(){
			let _c=parseInt(_this.c_vb_ani/3);

			if(_this._isequipped_count>0
				&&_this._isequipped_count%2===0){
				return _this.vb_e_ani[_c];
			}
			return _this.vb_ani[_c];
		})();

		_this.c_vb_ani=
			_GAME._ac._get(_this.c_vb_ani,_this.vb_ani,3);

		_CONTEXT.drawImage(
			_this.img_vb,
			_img_vb,
			0,
			_this.imgsize_vb,
			_this.imgsize_vb,
			_this.x,
			_this.y+22,
			_this.imgsize_vb,
			_this.imgsize_vb
		);
		// _CONTEXT.drawImage(
		// 	_img_vb,_this.x,_this.y+22,
		// 		_img_vb.width,_img_vb.height
		// );
	}
}


class GameObject_PLAYER_MAIN_RED
			extends GameObject_PLAYER_MAIN{
	constructor(){
		super('vicviper1',100,200,true);
		this.col_ani=[//衝突時のアニメ定義
			{img:_CANVAS_IMGS['vicviper_bomb_red'].obj,
			scale:0.5},
			{img:_CANVAS_IMGS['vicviper_bomb_red'].obj,
			scale:0.7},
			{img:_CANVAS_IMGS['vicviper_bomb_red'].obj,
			scale:0.5},
			{img:_CANVAS_IMGS['vicviper_bomb_red'].obj,
			scale:0.3},
			{img:_CANVAS_IMGS['vicviper_bomb_red'].obj,
			scale:0.1}
		];
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
		this._ani_c=0;
		this.ani=[//アニメーション定義
			{scale:1},
			{scale:0.9},
			{scale:0.8},
			{scale:0.7},
			{scale:0.8},
			{scale:0.9}
		];
		this.imgsize=this.img.height;
		this.width=this.imgsize;
		this.height=this.imgsize;
	}
	move(_pmd_elem){
		let _this=this;
		_this.x=_GAME._getPlayerMoveDrawX(_pmd_elem);
		_this.y=_GAME._getPlayerMoveDrawY(_pmd_elem);

		if(!_this._isalive){return;}
		//装備していない場合
		if(_this.x===null
			||_this.y===null
			||_this.x===undefined
			||_this.y===undefined){return;}

		_this.shotflag=true;

		let _p=_this.getPlayerCenterPosition();
		_this._ani_c=(_this._ani_c>=(_this.ani.length*3)-1)?0:_this._ani_c+1;
		let _c=parseInt(_this._ani_c/3);
		_GAME._setDrawImage(_this.img,_p._x,_p._y,_this.ani[_c].scale);
	}
}


class GameObject_FORCEFIELD{
	constructor(){
		let _this=this;
		_this.img=_CANVAS_IMGS['forcefield'].obj;
		_this.STATUS_MAX=4;
		_this.x=0;
		_this.y=0;
		_this.width=0;
		_this.height=0;
		_this.type='forcefield';

		_this._c=0;
		_this._scale=0;//フォースのサイズ

		_this._eid=0;//敵ID
		//アニメーション定義
		_this.ani=[0,106];

		_this.col_date=null;//打たれた時間
		_this.col_canint=50;//連続ショット許可間隔
	};
	init(){
		let _this=this;
		_this._scale=1;
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

		_this._scale-=0.09;
		//ある大きさになれば削除
		if(_this._scale<=0.55){
			_this._scale=0;
			_POWERMETER._set_meter_on('000001');
		}
		// _this.width*=_this._scale;
		// _this.height*=_this._scale;
		_GAME._setPlay(_CANVAS_AUDIOS['vicviper_shield_reduce']);
		
	}
	move(_GO){
		//_PLAYERS_MAIN
		let _this=this;
		if(!_this.isalive()){return;}
		_this.map_collition();
		_this.x=_GO.x;
		_this.y=_GO.y;

		// _this.x=_GO.getPlayerCenterPosition()._x
		// 			-6;
		// _this.y=_GO.getPlayerCenterPosition()._y
		// 			-2;

		_this._c=
			(_this._c>=(_this.ani.length*5)-1)?0:_this._c+1;
//		_this.ani[parseInt(_this._c/5)];
		// _CONTEXT.drawImage(
		// 	_img,_this.x,_this.y,
		// 		_this.width,_this.height
		// );

		_CONTEXT.save();
		_CONTEXT.translate(
			_GO.getPlayerCenterPosition()._x-6,
			_GO.getPlayerCenterPosition()._y-2);
		_CONTEXT.scale(_this._scale,_this._scale);
		_CONTEXT.drawImage(
			_this.img,
			_this.ani[parseInt(_this._c/5)],
			0,
			_this.width,
			_this.height,
			-_this.width/2,
			-_this.height/2,
			_this.width,
			_this.height
		);
		_CONTEXT.restore();

		// _CONTEXT.strokeStyle = 'rgb(200,200,255)';
		// _CONTEXT.beginPath();
		// _CONTEXT.rect(
		// 	_this.x,
		// 	_this.y,
		// 	_this.width,
		// 	_this.height
		// );
		// _CONTEXT.stroke();
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
		this.STATUS_MAX=15;
		this.type='shield';

		//アニメーション定義
		this.ani=[0,40];
	}
	getPlayerCenterPosition(){
		//センタリングはプレーヤーの中心から約右に配置
		return {_x:this.x+(this.width/2),
				_y:this.y+this.height}
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
		if(_GAME.isSqCollision(
			"0,0,"
			+parseInt(_this._scale*_this.width)
			+","+parseInt(_this._scale*_this.height*2),
			_this.x+","+_this.y,
			_e.shotColMap,
			_e.x+","+_e.y
			)===_IS_SQ_NOTCOL){return;}
		_e.collision();
		_this.reduce();
	}
	enemy_shot_collision(_e){
		let _this=this;
		if(_GAME.isSqCollision(
			"0,0,"+_this.width+","+(_this.height*2),
			parseInt(_this.x)+","+parseInt(_this.y),
			_e.shotColMap,
			_e.x+","+_e.y
			)===_IS_SQ_NOTCOL){return;}
		_e.init();
		_this.reduce();
	}
	map_collition(_p){
		let _this=this;
		//プレーヤーの中心座標取得
		let _pl=_this.getPlayerCenterPosition();
		//MAPの位置を取得
		//シールドの上下画像の中心点からMAP判定する。
		let _map_x=_MAP.getMapX(_pl._x);
		let _map_y=_MAP.getMapY(_pl._y);

		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this.reduce();
			return;
		}

		//シールドの上端
		_map_y=_MAP.getMapY(_this.y);
//		_map_y=parseInt(this.y/_MAP.t);
		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this.reduce();
			return;
		}

		//シールドの下端
		_map_y=_MAP.getMapY(_pl._y-10+_this.height);
//		_map_y=parseInt((_pl._y-10+this.height)/_MAP.t);
		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this.reduce();
			return;
		}

	}
	reduce(){
		let _this=this;
		if(!_this.isalive()){return;}
		if(!_this.isCollision()){return;}

//		console.log(_this._scale)
		_this._scale-=0.04;
		//ある大きさになれば削除
		if(_this._scale<0.35){
			_this._scale=0;
			_POWERMETER._set_meter_on('000001');
		}
		_GAME._setPlay(_CANVAS_AUDIOS['vicviper_shield_reduce']);
	}
	move(_p){
		let _this=this;
		if(!_this.isalive()){return;}
		let _pl=_p.getPlayerCenterPosition();
		_this.map_collition(_p);
		_this.x=_pl.x;
		_this.y=_pl.y;

		_this._c=(_this._c>=(_this.ani.length*5)-1)?0:_this._c+1;

		// let _img=(function(){
		// 	_this._c=(_this._c>=(_this.ani.length*5)-1)?0:_this._c+1;
		// 	return _this.ani[parseInt(_this._c/5)].img;
		// })(_this);

		let _x=_p.x+_p.width;
		let _y1=_pl._y;//下
		let _y2=_pl._y-(_this.height*_this._scale);//上
		//下の画像
		_CONTEXT.save();
		_CONTEXT.translate(_x,_y1);
		_CONTEXT.scale(_this._scale,_this._scale);
		_CONTEXT.drawImage(
			_this.img,
			_this.ani[parseInt(_this._c/5)],
			0,
			_this.width,
			_this.height,
			0,
			-_this.height,
			_this.width,
			_this.height
		);
		_CONTEXT.restore();
		//上の画像
		_CONTEXT.save();
		_CONTEXT.translate(_x,_y2);
		_CONTEXT.scale(_this._scale,_this._scale);
		_CONTEXT.drawImage(
			_this.img,
			_this.ani[parseInt(_this._c/5)],
			0,
			_this.width,
			_this.height,
			0,
			_this.height,
			_this.width,
			_this.height
		);
		_CONTEXT.restore();
		this.x=_x;
		this.y=_y2;
//		this.width*=_sc;

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
	}
	enemy_collision(_e){//敵への当たり処理
		if(!this.player.isalive()){return;}
		for(let _k=0;_k<this.shots.length;_k++){
			let _t=this.shots[_k];
			if(!_t._shot_alive){continue;}
			//自機より後ろは無視する。
			if(_e.x<this.player.x){continue;}
			let _s=_GAME.isSqCollision(
				"-12,-12,12,12",
				_t.x+","+_t.y,
				_e.shotColMap,
				_e.x+","+_e.y
			);
			if(_s===_IS_SQ_NOTCOL){continue;}
			if(_s===_IS_SQ_COL){
				_e.collision(_SHOTTYPE_NORMAL);					
			}
			_t._init();
		}//for
	}
	map_collition(){}
	getshottype(){}
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
			{fs:'rgba(133,0,4,1)',scale:12},
			{fs:'rgba(133,0,4,1)',scale:14},
			{fs:'rgba(100,0,4,1)',scale:16}
		];
		//ミサイルの画像スプライトに対して、
		//ミサイルのステータスと座標位置定義
//		this.st={'_st1':0,'_st2':24,'_st3':48,'_st4':72,'_st5':96,'_st6':120,'_st7':144,'_st8':168};
		this.st={'_st1':0,'_st2':24,'_st3':48,'_st4':72,'_st5':96,'_st6':0,'_st7':96,'_st8':72};
		this.imgsize=_CANVAS_IMGS['gradius_missile'].obj.height;

		let _t=this;
		for(let _i=0;_i<_PLAYERS_SHOTS_MAX;_i++){
			this.shots.push({
				sid:_SHOTTYPE_MISSILE,
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
				_t.y+=8;
			},
			'_st3':function(_t){
				_t.x+=8;
				//真横
			},
			'_st4':function(_t){
				_t.x+=2;
				_t.y+=1;
			},
			'_st5':function(_t){
				//_st5→_st6
				_t.x+=2;
				_t.y+=2;
			},
			'_st6':function(_t){
				//_st6→_st7
				_t.x+=2;
				_t.y+=2;
			},
			'_st7':function(_t){
				//_st7→_st8
				_t.x+=4;
				_t.y+=1;
			},
			'_st8':function(_t){
				//_st7→_st8
				_t.x+=4;
				_t.y+=1;
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
		_e.collision(_SHOTTYPE_MISSILE);

	}
	get_missile_status(_t){return _t._st;}
	set_missile_status(_t,_st){
		//ミサイルのステータス切り替え設定
		//※少し間引きして切替をする。
		if(this._st==='_st1'
			||this._st==='_st2'
			||this._st==='_st3'
		){return;}
		_t._c_mc++;
		if(_t._c_mc>1){
			_t._c_mc=0;return;
		}
		_t._st=_st;
	}
	map_collition(_t){
		let _this=this;
		let _map_x=_MAP.getMapX(_t.x+_this.imgsize),
			_map_y=_MAP.getMapY(_t.y);

		const _setToSt3=function(){
			_map_y=_MAP.getMapY(_t.y+_this.imgsize);
			if(!_MAP.isMapCollision(_map_x,_map_y)){return false;}
			if(_MAP.map_infinite===false){
				//_st3に入る際、このタイミングのmap_yの位置を調整
				//_MAP.t単位で調整させる
				var _a=parseInt(_t.y/_MAP.t);
				var _b=(_t.y%_MAP.t<(_MAP.t/2))?_a:_a+1;
				_t.y=_b*_MAP.t;	

			}
//			_this.set_missile_status(_t,'_st3');
			return true;
		};

//			console.log(_t.y)
			
//console.log(_this.get_missile_status(_t))			
		//MAPに入る手前は無視する
		if(_MAP.isMapBefore(_map_x,_map_y)){return;}
		//MAPから抜けた後のミサイルの状態
		if(_MAP.isMapOver(_map_x,_map_y)){
//			console.log('===================');
			if(_this.get_missile_status(_t)==='_st3'
				){
				_this.set_missile_status(_t,'_st4');
				return;
			}
			if(_this.get_missile_status(_t)==='_st2'){
				return;
			}
		}

		//段差を滑らかに表示させるためのもの
		//ミサイル落下 _st3→_st4
		if(_this.get_missile_status(_t)==='_st4'){
			_this.set_missile_status(_t,'_st5');
		}

		//ミサイル着地 _st1→_st6→_st7→→_st8→_st3
		//着座時、_st3が必ず壁より１マス上に
		//配置する必要がある。
		if(_this.get_missile_status(_t)==='_st6'){
//			console.log('6')
//			_map_x=_MAP.getMapX(_t.x+_this.imgsize);
			//壁にぶつかる(壁中)
			// if(_MAP.isMapCollision(_map_x,_map_y)){
			// 	_t._init();
			// 	return;
			// }
//			if(_setToSt3()){return;}			
			_this.set_missile_status(_t,'_st7');
		}
		if(_this.get_missile_status(_t)==='_st7'){
//			console.log('7')
//			_map_x=_MAP.getMapX(_t.x+_this.imgsize);
			//壁にぶつかる(壁中)
 			// if(_MAP.isMapCollision(_map_x,_map_y)){
			// 	_t._init();
			// 	return;
			// }
			_t.x+=2;
//			if(_setToSt3()){return;}
			_this.set_missile_status(_t,'_st8');
		}
		if(_this.get_missile_status(_t)==='_st8'){
//			console.log('8');
			
//			_map_x=_MAP.getMapX(_t.x+_this.imgsize);
			//壁にぶつかる(壁中)
			// if(_MAP.isMapCollision(_map_x,_map_y)){
			// 	_t._init();
			// 	return;
			// }
			_t.x+=2;
//			let y=parseInt(_t.y/_MAP.t);
//			console.log(_t.y)
			// let _y=_MAP_SCROLL_POSITION_Y%_MAP.t;
//			_t.y-=(_t.y%_MAP.t)+_MAP.map_backgroundY_speed;
			// _t.y+=_y;
//			_t.y=_MAP.getMapYToPx(_t.y);
			//			_t.y=(_map_y*_MAP.t)+3;		
//			_t.y=_t.y+_MAP.t-(_t.y%_MAP.t);
//			if(_setToSt3()){return;}
			_this.set_missile_status(_t,'_st3');
		}

		//落ちかけ
		if(_this.get_missile_status(_t)==='_st5'){
			_map_x=_MAP.getMapX(_t.x+_this.imgsize);
			//真下に衝突がある場合
			if(_MAP.isMapCollision(_map_x,_map_y+1)){
				//→st6→st7→st3への調整のためのy位置調整
//				_t.y=_MAP.getMapYToPx(_t.y);			
//				_t.y=(_map_y*_MAP.t)-5;
				_this.set_missile_status(_t,'_st6');
				return;
			}

			//真横に壁がある
			if(_MAP.isMapCollision(_map_x+1,_map_y)){
				_t._init();
				return;
			}

			_this.set_missile_status(_t,'_st2');
			_t.x+=3;

		}


		if(_this.get_missile_status(_t)==='_st3'){
			_setToSt3();
//			console.log('_st3');
//			console.log('====='+(_MAP.y%25*-1));
//			console.log(_t.y);			
			_map_x=_MAP.getMapX(_t.x+(_this.imgsize/2));
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

			//壁にぶつかる
			//真横に壁がある場合、初期化
// 			if(_MAP.isMapCollision(_map_x,_map_y)){
// //				console.log('_st3 init() 2')
// 				_t._init();
// 				return;
// 			}

			//MAPからはみ出る
			if(_MAP.isMapOver(_map_x,_map_y)){
				_this.set_missile_status(_t,'_st4');
				return;
			}

		}

		if(_this.get_missile_status(_t)==='_st2'){
//			console.log('_st2');
			_map_y=_MAP.getMapY(_t.y+_this.imgsize+10);
			//下の壁にぶつかる
			if(_MAP.isMapCollision(_map_x,_map_y)
//				||_MAP.isMapCollision(_map_x,_map_y+1)
				){
//				_t.y-=(_t.y%_MAP.t);
				_this.set_missile_status(_t,'_st6');
				return;
			}
		}

		if(_this.get_missile_status(_t)==='_st1'){
			_map_y=_MAP.getMapY(_t.y+_this.imgsize+9);
			//自身、あるいはその下の壁にぶつかる
			if(_MAP.isMapCollision(_map_x+1,_map_y)){
				// let _a=parseInt((_t.y+_this.imgsize)/_MAP.t);
				// let _b=parseInt((_t.y+_this.imgsize+10)/_MAP.t);
				// if(_a===_b){
				// 	_t.y=((_a-1)*_MAP.t);
				// }
//				console.log('_st1_1');
//				console.log('_st1_2:'+_b);
				_this.set_missile_status(_t,'_st6');
				return;
			}
			if(_MAP.isMapCollision(_map_x,_map_y)){
//				_t.y=_t.y-(25-_t.y%25);
				// console.log('_st1_1:'+_MAP.getMapY(_t.y+_this.imgsize));
				// console.log('_st1_2:'+_MAP.getMapY(_t.y+_this.imgsize+10));
				//				console.log('_st1:'+_t.y+_this.imgsize)
//				_t.y=390;
//				_t.y=parseInt(_MAP.getMapY(_t.y+_this.imgsize)*_MAP.t)-10;
//				console.log('2');
//				let _a=parseInt(_t.y/_MAP.t);
//				_t.y=((_a+1)*_MAP.t)-7;
				_this.set_missile_status(_t,'_st6');
				return;
			}
		}

	}
	collapse_missile(_t,_pos){
		let _this=this;
		_t.x=_MAP.getX(_t.x);
		_pos=_pos||-5
		//爆風を表示
		if(_t._c>=_this.col_mis.length*5){
			_t._init();
			return;
		}
		let _c=parseInt(_t._c/5);
		_t._c_area=_this.col_mis[_c].scale;

		_CONTEXT.fillStyle=_this.col_mis[_c].fs;
 	 	_CONTEXT.beginPath();
 		_CONTEXT.arc(_t.x,
 					_t.y+_pos,
 					_this.col_mis[_c].scale,
 					0,
 					Math.PI*2,false);
 		_CONTEXT.fill();

		if(this.col_mis[_c-1]!==undefined){
			_CONTEXT.fillStyle
				=_this.col_mis[_c-1].fs;
		 	_CONTEXT.beginPath();
			_CONTEXT.arc(_t.x,
						_t.y+_pos,
						_this.col_mis[_c-1].scale,
						0,
						Math.PI*2,false);
			_CONTEXT.fill();
		}
		_t._c++;
	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		if(_p.x===undefined){return;}
		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}
//			console.log(_j+':'+_t.y+':'+_t._st);
			_t.y=_MAP.getShotY(_t.y);
			if(_t._c>0){
				//爆発アニメ開始時はここで終了
				_this.collapse_missile(_t,10);
				continue;
			}
//console.log('_j:'+_j+'   _t.x:'+_t.x+'   _t.y:'+_t.y);
//console.log('_map_x:'+_map_x);

			if(_GAME.isShotCanvasOut(_t)){
				_t._init();
				continue;
			}

			_this.mis_status[_t._st](_t);
			if(_this.get_missile_status(_t)==='_st1'
				&&_MAP.isMapCollision(
				_MAP.getMapX(_t.x),
				_MAP.getMapY(_t.y))){
				_t._init();				
				continue;
			}
			_CONTEXT.drawImage(
				_t._img,
				_this.st[_this.get_missile_status(_t)],
				0,
				_this.imgsize,
				_this.imgsize,
				_t.x,
				_t.y,
				_this.imgsize,
				_this.imgsize
			);
			// _CONTEXT.strokeStyle = 'rgb(200,200,255)';
			// _CONTEXT.beginPath();
			// _CONTEXT.rect(
			// 	_t.x,
			// 	_t.y,
			// 	_t._img.width,
			// 	_this.imgsize
			// );
			// _CONTEXT.stroke();

			_t._shot_alive=true;
//			console.log(_t._y);
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
		_e.collision(_SHOTTYPE_MISSILE);
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
			{fs:'rgba(54,115,255,1)',scale:40},
			{fs:'rgba(54,115,255,1)',scale:50},
			{fs:'rgba(54,115,255,1)',scale:60},
			{fs:'rgba(0,27,145,1)',scale:60},
			{fs:'rgba(0,27,145,1)',scale:60},
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
		_e.collision(_SHOTTYPE_MISSILE);
	}
	map_collition(_t){
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_t.x);
		let _map_y=_MAP.getMapY(_t.y);

		if(_MAP.isMapCollision(_map_x,_map_y)
			||_MAP.isMapCollision(_map_x+1,_map_y)){
			this.collapse_missile(_t,-25);
			return;
		}

	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		if(_p.x===undefined){return;}
		let _pl=_p.getPlayerCenterPosition();

		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}

			_t.y=_MAP.getShotY(_t.y);
			if(_t._c>0){
				//爆発アニメ開始時はここで終了
				_this.collapse_missile(_t);
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

			_CONTEXT.drawImage(
				_t._img,
				_this.st[_this.get_missile_status(_t)],
				0,
				_this.imgsize,
				_this.imgsize,
				_t.x,
				_t.y,
				_this.imgsize,
				_this.imgsize
			);
			// _this.mis_status[_t._st](_t);
			// _CONTEXT.drawImage(
			// 	_t._img,
			// 	_t.x,
			// 	_t.y,
			// 	_t._img.width,
			// 	_this.imgsize
			// );

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
		if(_t._c===0){_t._c=1;}
		
		if(_s===_IS_SQ_COL_NONE){return;}		
		_e.collision(_SHOTTYPE_MISSILE);

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
		if(!_p.isshotflag()){return;}
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
				_this.collapse_missile(_t,10);
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
					return (!_sa)?_pl._y-20:_i+(_t._t*_t._t/100)*-1;
				}else{
					return (!_sa)?_pl._y:_i+(_t._t*_t._t/100);
				}
			})(_t.y);

			if(_GAME.isShotCanvasOut(_t)){
				_t._init();
				continue;
			}
			if(_j===0){
				_t._st=(function(){
					if(_t._t>20&&_t._t<30){
						return '_st5';
					}
					if(_t._t>30){
						return '_st6';
					}
					return '_st4';
				})();
			}else{
				_t._st=(function(){
					if(_t._t>20&&_t._t<30){
						return '_st2';
					}
					if(_t._t>30){
						return '_st3';
					}
					return '_st1';
				})();
			}

			_CONTEXT.drawImage(
				_t._img,
				_this.st[_this.get_missile_status(_t)],
				0,
				_this.imgsize,
				_this.imgsize,
				_t.x,
				_t.y,
				_this.imgsize,
				_this.imgsize
			);

			_t._shot_alive=true;
		}
	}
}//GameObject_SHOTS_MISSILE_2WAY


class GameObject_SHOTS_NORMAL
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		this.speed=20;

		for(let _i=0;_i<_PLAYERS_SHOTS_MAX;_i++){
			this.shots.push({
				sid:_SHOTTYPE_NORMAL,
				x:0,//処理変数：照射x軸
				y:0,
				_img:_CANVAS_IMGS['shot1'].obj,
				_audio:_CANVAS_AUDIOS['shot_normal'],				
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}
	}
	map_collition(_t){
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_t.x);
		let _map_y=_MAP.getMapY(_t.y);

		if(_MAP.isMapCollision(_map_x,_map_y)){
			//ショットを初期化
			_t._init();
			//MAPの衝突処理
			_MAP.setPlayersShotAbleCollision(_map_x,_map_y);
			return;
		}
		if(_MAP.isMapCollision(_map_x+1,_map_y)){
			//ショットを初期化
			_t._init();
			//MAPの衝突処理
			_MAP.setPlayersShotAbleCollision(_map_x+1,_map_y);
		}
	}
	move(){
		let _p=this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();

		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}
// 			console.log(_p._x);
			let _s=this.speed;
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

			let _img=_CANVAS_IMGS['shot1'].obj;
			_CONTEXT.drawImage(
				_img,
				_t.x,
				_t.y,
				_img.width,
				_img.height
			);

			_t._shot_alive=true;
		}
	}
}

class GameObject_SHOTS_DOUBLE
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		this.speed=30;

		for(let _i=0;_i<_PLAYERS_SHOTS_MAX;_i++){
			this.shots.push({
				sid:_SHOTTYPE_DOUBLE,
				x:0,//処理変数：照射x軸
				y:0,
				_img:(_i===0)
					?_CANVAS_IMGS['shot1'].obj
					:_CANVAS_IMGS['shot2'].obj,
				_audio:_CANVAS_AUDIOS['shot_normal'],				
				_enemyid:null,//敵ID
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this._enemyid=null,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}
	}
	enemy_collision(_e){//敵への当たり処理
		let _this=this;
		if(!_this.player.isalive()){return;}
		let _str='';

		for(let _k=0;_k<_this.shots.length;_k++){
			let _t=_this.shots[_k];
			let _s=_GAME.isSqCollision(
				"-10,-10,10,10",
				_t.x+","+_t.y,
				_e.shotColMap,
				_e.x+","+_e.y
			);
			
			if(_s===_IS_SQ_NOTCOL){continue;}
			if(_s===_IS_SQ_COL_NONE){
				_t._init();
				continue;
			}
			if(_e.isalive()){
				//硬い敵に対して、
				//同時ショット判定を避ける
				_e.collision(_SHOTTYPE_DOUBLE);
				_t._init();
			}
		}
	}
	map_collition(_t){
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_t.x);
		let _map_y=_MAP.getMapY(_t.y);

		if(_MAP.isMapCollision(_map_x,_map_y)){
			//ショットを初期化
			_t._init();
			//MAPの衝突処理
			_MAP.setPlayersShotAbleCollision(_map_x,_map_y);
			return;
		}
		if(_MAP.isMapCollision(_map_x+1,_map_y)){
			//ショットを初期化
			_t._init();
			//MAPの衝突処理
			_MAP.setPlayersShotAbleCollision(_map_x+1,_map_y);
		}

	}
	move(){
		let _p=this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
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
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				if(_j===0){
					return (!_sa)?_pl._x:_i+30;
				}else{
					return (!_sa)?_pl._x:_i+30;
				}
			})(_t.x);
			_t.y=(function(_i){
				if(_j===0){
					return (!_sa)?_pl._y:_i;
				}else{
					return (!_sa)?_pl._y-23:_i-23;
				}
			})(_t.y);
			_t.y=_MAP.getShotY(_t.y);			
			
			if(_GAME.isShotCanvasOut(_t)){
				_t._init();
				continue;
			}
			_CONTEXT.drawImage(
				_t._img,
				_t.x,
				_t.y,
				_t._img.width,
				_t._img.height
			);

			_t._shot_alive=true;
		}
	}
}

class GameObject_SHOTS_TAILGUN
			extends GameObject_SHOTS_DOUBLE{
	constructor(_p){super(_p);}
	map_collition(_t){
		//MAPの位置を取得
		let _map_x=_MAP.getMapX(_t.x);
		let _map_y=_MAP.getMapY(_t.y);

		if(_MAP.isMapCollision(_map_x,_map_y)){
			//ショットを初期化
			_t._init();
			//MAPの衝突処理
			_MAP.setPlayersShotAbleCollision(_map_x,_map_y);
			return;
		}
		if(_MAP.isMapCollision(_map_x-1,_map_y)){
			//ショットを初期化
			_t._init();
			//MAPの衝突処理
			_MAP.setPlayersShotAbleCollision(_map_x-1,_map_y);
		}

	}
	move(){
		let _p=this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();
		//ここでは各要素にショット権限を与え、
		//各弾に対して、敵に弾を当てた、
		//あるいは画面からはみ出た時に、
		//_shot_aliveをfalseにする。

		//0番目の要素は前
		//1番目の要素は後
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
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				if(_j===0){
					return (!_sa)?_pl._x:_i+30;
				}else{
					return (!_sa)?_pl._x:_i-30;
				}
			})(_t.x);
			_t.y=(function(_i){
				return (!_sa)?_pl._y:_i;
			})(_t.y);
			_t.y=_MAP.getShotY(_t.y);			

			if(_GAME.isShotCanvasOut(_t)){
				_t._init();
				continue;
			}

			let _img=(_j===0)
					?_CANVAS_IMGS['shot1'].obj
					:_CANVAS_IMGS['shot3'].obj;
			_CONTEXT.drawImage(
				_img,
				_t.x,
				_t.y,
				_img.width,
				_img.height
			);

			_t._shot_alive=true;
		}
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

		for(let _i=0;_i<_PLAYERS_SHOTS_MAX;_i++){
			this.shots.push({
				sid:_SHOTTYPE_LASER,
				x:0,//処理変数：X位置の中心点
				y:0,//処理変数：Y位置の中心点
				_t:0,//アニメーション時間ripple
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_width:0,//rippleの横幅
				_height:0,//rippleの縦幅
				_audio:_CANVAS_AUDIOS['shot_ripple'],
				_init:function(){//初期化
					this.x=0,
					this.y=0,
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
				_e.collision(_SHOTTYPE_RIPPLE_LASER);
				(function(){
					//RIPPLELASERでは、当たり判定後、
					//画面内の全ての敵を参照し、
					//RIPPLE範囲内の敵も当たり判定とみなす。
					let _ens=_ENEMIES;
					for(let _i=0;_i<_ens.length;_i++){
					let _en=_ens[_i];
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
						_en.collision(_SHOTTYPE_RIPPLE_LASER);						
					}
		
					}//for
				})();
			}
			_t._init();
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
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
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
		_this.speed=50;
		_this.lineWidth=3;
		_this.strokeStyle="rgba(50,80,255,1)";
		_this.strokeStyle_u="rgba(120,150,255,1)";

		_this.img_col=_CANVAS_IMGS['shot_laser_col'].obj;
		_this.imgsize_col=_this.img_col.height;
		_this.width_col=_this.imgsize_col;
		_this.height_col=_this.imgsize_col;
		_this.img_col_ani=[0,25];

		for(let _i=0;_i<1;_i++){
			_this.shots.push({
				sid:_SHOTTYPE_LASER,
				x:0,//処理変数：照射x軸
				y:0,
				_c_col:0,//アニメーションカウント衝突
				laser_time:500,//定義：照射時間（照射終了共通）
				_sx:0,//処理変数：x軸
				_enemy:null,//レーザーに衝突した敵のオブジェクト
				_laser_t:0,//処理変数：照射時間
				_laser_ts:0,//処理変数：照射終了後時間
				_laser_MaxX:_CANVAS.width,
						//処理変数レーザー最大右端
				_l_x:0,//処理変数：レーザー右端x
				_l_sx:0,//処理変数：レーザー左端x
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_audio:_CANVAS_AUDIOS['shot_laser'],//ショット音LASER		
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this._c_col=0,
					this._laser_t=0,
					this._laser_ts=0,
					this._sx=0,
					this._enemy=null,
					this._l_x=0,//処理変数：レーザー右端x
					this._l_sx=0,//処理変数：レーザー左端x
					this._laser_MaxX=_CANVAS.width,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}
	}
	laser_collision(_t,_v){
		let _this=this;
		if(_t._laser_MaxX>=_CANVAS.width){return;}
		_t._c_col=(_t._c_col>=_this.img_col_ani.length-1)?0:_t._c_col+1;

		_CONTEXT.drawImage(
			_this.img_col,
			_this.img_col_ani[_t._c_col],
			0,
			_this.imgsize_col,
			_this.imgsize_col,
			(_v||_t._l_x)-_this.width_col,
			_t.y-(_this.img_col.height/2),
			_this.imgsize_col,
			_this.imgsize_col
		);
	}
	enemy_collision(_e){
		//敵数分ループ
		if(!this.player.isalive()){return;}
		for(let _k=0;_k<this.shots.length;_k++){
		//自機より後ろの敵は無視する。
		if(_e.x<this.player.x){continue;}		
		let _t=this.shots[_k];
//		console.log('count');
		if(!_t._shot_alive){continue;}
		//		console.log('sx'+_t._l_sx);

		let _s=_GAME.isSqCollision_laser(
			"0,-6,"+parseInt(_t._l_x-_t._l_sx)+",6",
			_t._l_sx+","+_t.y,
			_e.shotColMap,
			_e.x+","+_e.y
		);

		//_CANVAS.width->当たり判定なし、とみなす
		if(_s.ret===_IS_SQ_NOTCOL){return _s.val;}
		if(_s.ret===_IS_SQ_COL_NONE){return _s.val;}
		_e.collision(_SHOTTYPE_LASER);
 		if(!_e.isalive()){
			 return _CANVAS.width;
		}
		return _s.val;	
		}//_k
	}
	map_collition(_t){
		let _this=this;
		if(!_t._shot_alive){return;}

		//プレーヤーの中心座標取得
		let _pl=_this.player.getPlayerCenterPosition();

		let _map_x=_MAP.getMapX(_t._l_x);
		let _map_y=_MAP.getMapY(_t.y);
		//先端の衝突を表示させる判定
		if(_MAP.isMapCollision(_map_x,_map_y)
			||_MAP.isMapCollision(_map_x-1,_map_y)){
			_this.setLaserMaxX(_t,_MAP.getMapXToPx(_map_x));
		}
		//レーザー照射内にて、当たり判定のある壁は壊す処理
		let _map_sx=_MAP.getMapX(_t._l_sx);
		for(let _i=_map_sx+1;_i<=_map_x;_i++){
			if(_MAP.isMapCollision(_i,_map_y)){
				_MAP.setPlayersShotAbleCollision(_i,_map_y,_SHOTTYPE_LASER);
			}
		}
	}
	setLaserLine(_t,_l_x,_l_sx){
		_t._l_x=_l_x;
		_t._l_sx=_l_sx;
	}
	setLaserMaxX(_t,_v){
		let _this=this;
//		console.log(_v)
		_t._laser_MaxX=_v;
	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();

		//	自機のショット状態を取得
		_CONTEXT.beginPath();
		_CONTEXT.lineWidth=_this.lineWidth;
		_CONTEXT.strokeStyle=_this.strokeStyle;
		_CONTEXT.lineCap='round';

		//ショットの描画(１つのみ)
		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}

//			console.log(_t._laser_MaxX);
			//照射開始位置は、自機またはオプションの
			//中心座標からとする。
			//照射開始
			_t.x=(function(_i){
	  			if(_i>=_t._laser_MaxX-_pl._x){
					//レーザーが右端に届いた時
					_t._laser_t+=(1000/_FPS);
					return _t._laser_MaxX-_pl._x;
				}
				return _i+_this.speed;
			})(_t.x);

//			console.log(_t._sx)
			//照射終了
			_t._sx=(function(_i){
				if(!_t._shot){
					//ショットを離した時
					if(_i>=_t.x){
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
				if(_i>=_t.x){return _t.x;}
				return _i+=_this.speed;
			})(_t._sx);
			_t.y=_pl._y;

			if(_t.x<_t._sx||Math.abs(_t.x-_t._sx)<50){continue;}

//			console.log('_max:'+(_t._laser_MaxX));
//			let _px=_p.x+_p.img.width;
			let _px=_pl._x;
//			console.log('_px+_t.x:'+(_px+_t.x));
// console.log('_x:'+(_px+_t.x)+
// '    _sx:'+(_px+_t._sx)+
// '    _max:'+(_t._laser_MaxX));

			_CONTEXT.beginPath();
			_CONTEXT.strokeStyle=_this.strokeStyle_u;
			_CONTEXT.moveTo(_px+_t._sx,_pl._y+1);
			_CONTEXT.lineTo(_px+_t.x,_pl._y+1);
			_CONTEXT.stroke();

			_CONTEXT.beginPath();
			_CONTEXT.strokeStyle=_this.strokeStyle;
			_CONTEXT.moveTo(_px+_t._sx,_pl._y);
			_CONTEXT.lineTo(_px+_t.x,_pl._y);
			_CONTEXT.stroke();

			_this.setLaserLine(_t,
								_px+_t.x,
								_px+_t._sx
							);
			_this.laser_collision(_t,_px+_t.x);

//			_this.setLaserMaxX(_t,_CANVAS.width);
			if(_t.x>0){_t._shot_alive=true;}

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
}
//=====================================================
//	gradius_enemies.js
//	敵の定義
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

const _DEF_DIFFICULT=[
	{_ENEMY_SHOT_RATE:0.0001,_ENEMY_SHOT_SPEED:3,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.0005,_ENEMY_SHOT_SPEED:3,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.002,_ENEMY_SHOT_SPEED:3,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.005,_ENEMY_SHOT_SPEED:3,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.01,_ENEMY_SHOT_SPEED:3,_ENEMY_SPEED:2}
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
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
	'intv':5,
	'img':_CANVAS_IMGS['enemy_collapes0'].obj
},//t0
't1':{
	'intv':5,
	'img':_CANVAS_IMGS['enemy_collapes1'].obj
},//t1
't2':{
	'intv':5,
	'img':_CANVAS_IMGS['enemy_collapes2'].obj
},//t2
't8':{
	'intv':5,
	'img':_CANVAS_IMGS['enemy_collapes8'].obj
},//t8
't9':{
	'intv':5,
	'img':_CANVAS_IMGS['enemy_collapes9'].obj
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
		let _img=_ENEMY_DEF_ANI_COL[_this.type].img;
		let _intv=_ENEMY_DEF_ANI_COL[_this.type].intv;
		let _w=parseInt(_img.width/_img.height);
		//		let _scale=ENEMY_DEF_ANI_COL[_this.type].scale;
		if(_this._c_anime_collosion>=
			_w*_intv-1){
			//アニメーションが終わったら終了
			_this._status=false;
			return;
		}

		var _s=_img.height;
		_this.x=_MAP.getX(_this.x);
		_this.y=_MAP.getY(_this.y);
		_CONTEXT.drawImage(
			_img,
			_s*parseInt(_this._c_anime_collosion/_intv),
			0,
			_s,
			_s,
			_this.x-(_s/2),
			_this.y-(_s/2),
			_s,
			_s
		);
		_this._c_anime_collosion++;
	}
}
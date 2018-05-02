//=====================================================
//	gradius_enemies.js
//	敵の定義
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

const _ENEMY_DEF_ANI_COL={//衝突アニメーション定義
't0':{
	'intv':5,
	'imgPos':[0,30,60,90,120],
	'img':_CANVAS_IMGS['enemy_collapes0'].obj
},//t0
't1':{
	'intv':5,
	'imgPos':[0,55,110,165,220],
	'img':_CANVAS_IMGS['enemy_collapes1'].obj
},//t1
't2':{
	'intv':5,
	'imgPos':[0,30,60,90,120,150,180],
	'img':_CANVAS_IMGS['enemy_collapes2'].obj
},//t2
't8':{
	'intv':5,
	'imgPos':[0,90,180,270,360,450,540],	
	'img':_CANVAS_IMGS['enemy_collapes8'].obj
},//t8
't9':{
	'intv':5,
	'imgPos':[0,200,400,600,800],
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
		_this.img=_ENEMY_DEF_ANI_COL[_this.type].img;
		_this.imgPos=_ENEMY_DEF_ANI_COL[_this.type].imgPos;
		_this.aniItv=_ENEMY_DEF_ANI_COL[_this.type].intv;
		_this.width=_this.imgPos[1];
		_this.height=_this.img.height;
		_this._c=0;
	}
	isalive(){return this._status;}
	set_imgPos(){
		let _this=this;
		_this._c=
			(_this._c>=(_this.imgPos.length*_this.aniItv)-1)?0:_this._c+1;
	}
	get_imgPos(){
		let _this=this;
		return _this.imgPos[parseInt(_this._c/_this.aniItv)]
	}
	setDrawImage(){
		//爆発を表示
		let _this=this;
		_GAME._setDrawImage({
			img:_this.img,
			imgPosx:_this.get_imgPos(),
			x:_this.x,
			y:_this.y,
			width:_this.width,
			height:_this.height
		});
		// let _s=_this.height;
		// _CONTEXT.drawImage(
		// 	_this.img,
		// 	_s*parseInt(_this._c_anime_collosion/_this.intv),
		// 	0,
		// 	_s,
		// 	_s,
		// 	_this.x-(_s/2),
		// 	_this.y-(_s/2),
		// 	_s,
		// 	_s
		// );
	}
	move(){
		let _this=this;
		if(_this._c>=(_this.imgPos.length*_this.aniItv)-1){
			//アニメーションが終わったら終了
			_this._status=false;
			return;
		}

		_this.set_imgPos();
		_this.x=_MAP.getX(_this.x);
		_this.y=_MAP.getY(_this.y);
	}
}
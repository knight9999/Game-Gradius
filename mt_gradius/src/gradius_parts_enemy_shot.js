//=====================================================
//	gradius_parts_enemy_shot.js
//	敵の定義
//	2018.04.13 : 新規作成
//=====================================================
'use strict';
//====================
//　弾クラス
//	_p.x:敵の弾発射開始x位置
//	_p.y:敵の弾発射開始y位置
//	_p.deg:敵の弾を発射する角度（deg）
//			※未指定の場合は自機との角度
//	_p.img:弾の画像
//	_p.imgPos:スプライト画像の位置（Array）
//	_p.width:表示幅
//	_p.height:表示高
//	_p.speed:弾のスピード
//====================
class GameObject_ENEMY_SHOT{
	constructor(_p){
		let _this=this;
		_this.x=_p.x||500;
		_this.y=_p.y||300;
		_this.tx=_PARTS_PLAYERMAIN._players_obj.getPlayerCenterPosition()._x;
		_this.ty=_PARTS_PLAYERMAIN._players_obj.getPlayerCenterPosition()._y;

		_this.img=_p.img||_CANVAS_IMGS['enemy_bullet'].obj;
		_this.imgPos=_p.imgPos||[0,18];//スプライトのコマポジション
		_this._c=0;//アニメーションカウント
		_this.aniItv=_p.aniItv||5;//アニメーション間隔
		_this.basePoint=_p.basePoint||1;

		_this.width=_p.width||18;
		_this.height=_p.height||_this.img.height;
		_this.speed = _p.speed || _GET_DIF_SHOT_SPEED(); //定義：発射スピード
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

		_this.viewDeg=_p.viewDeg||false;

		_this._isshow=true;//弾の状態
		_this.is_ignore_collision=false;//自機衝突したら消えるのを無視する

		_this.shotColMap=[
			"1,1,"+(_this.width-1)+","+(_this.height-1)
		];
	}
	init(){
		let _this=this;
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
		return {_x:this.x+(this.width/2),
				_y:this.y+(this.height/2)}
	}
	isshow(){return this._isshow;}
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
		let _this=this;
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			deg:(_this.viewDeg)?_this.deg:0,
			width:_this.width,
			basePoint:_this.basePoint,
			imgPosx:_this.get_imgPos()
		});

		if (_ISDEBUG) {
			_CONTEXT.strokeStyle = 'rgba(200,200,255,0.5)';
			_CONTEXT.beginPath();
			_CONTEXT.rect(
				_this.x,
				_this.y,
				_this.width,
				_this.height
			);
			_CONTEXT.stroke();
		}

	}
	move(){
		let _this=this;
		_this.map_collition();
		_this.y=_MAP.getY(_this.y);		
		if(_GAME.isEnemyCanvasOut(_this)){
			_this.init();
			return;
		}
		_this.x+=_this.sx*_this.speed;
		_this.y+=_this.sy*_this.speed;

		_this.set_imgPos();
	}
}

class ENEMY_SHOT_LASER
	extends GameObject_ENEMY_SHOT{
	constructor(_p){
		super({
			x: _p.x,
			y: _p.y,
			img:_p.img||_CANVAS_IMGS['enemy_bullet_laser'].obj,
			width:_p.width||30
		});
		this.speed=10;
	}
	// setDrawImage(){
	// 	let _this=this;
	// 	_GAME._setDrawImage({
	// 		img:_this.img,
	// 		x:_this.x,
	// 		y:_this.y
	// 	});
	// }
	move(){
		let _this=this;
		if(_GAME.isEnemyCanvasOut(_this)){
			_this.init();
			return;
		}
		_this.map_collition();

		_this.x-=_this.speed;
	}
}

class ENEMY_SHOT_CRYSTALCORE
	extends GameObject_ENEMY_SHOT{
	constructor(_p){
		super({
			x: _p.x,
			y: _p.y,
			deg: _p.deg,
			viewDeg: true,
			img:_CANVAS_IMGS['enemy_cristalcore_shot'].obj
		});
		let _this=this;
		_this.speed=10;
	}
	// setDrawImage(){
	// 	let _this=this;
	// 	_GAME._setDrawImage({
	// 		img:_this.img,
	// 		x:_this.x,
	// 		y:_this.y,
	// 		deg:_this.deg
	// 	});
	// }
	move(){
		let _this=this;
		if(_GAME.isEnemyCanvasOut(_this)){
			_this.init();
			return;
		}
		_this.map_collition();

		_this.x-=_this.sx*_this.speed;
		_this.y-=_this.sy*_this.speed;
	}
}


class ENEMY_SHOT_FRAME
	extends GameObject_ENEMY_SHOT{
	constructor(_p){
		super({
			x:_p.x,
			y:_p.y,
			deg:_p.deg,
			viewDeg:true,
			width:_p.width,
			imgPos:_p.imgPos,
			basePoint:_p.basePoint||5,
			img:_p.img
		});
		let _this=this;
		_this.ani_c=0;
		_this.shotColMap = ["-10,-10,10,10"];
		_this.speed = _GET_DIF_SHOT_SPEED()-1;
	}
	shot(){
		let _this=this;
		if(_this.ani_c===100){
			let _e=_this.getEnemyCenterPosition();
			for(let _i=30;_i<=360;_i+=30){
				_ENEMIES_SHOTS.push(
					new ENEMY_SHOT_FRAME_SMALL({
						x:_e._x,
						y:_e._y,
						deg:_i,
						width:30,
						imgPos:[0,30],
						img:_CANVAS_IMGS['enemy_frame_mini'].obj
				}));
			}
			_this.init();
		}
	}
	move(){
		let _this=this;
		if(_GAME.isEnemyCanvasOut(_this)){
			_this.init();
			return;
		}
		_this.shot();
		_this.set_imgPos();
		_this.map_collition();
		_this.x-=_this.sx*_this.speed;
		_this.y-=_this.sy*_this.speed;
		_this.ani_c++;
	}
}

class ENEMY_SHOT_FRAME_SMALL
	extends ENEMY_SHOT_FRAME{
	constructor(_p){
		super({
			x:_p.x,
			y:_p.y,
			deg:_p.deg,
			viewDeg:true,
			img:_p.img,
			imgPos:_p.imgPos,
			basePoint:5,
			width:_p.width
		});
		let _this=this;
		_this.speed = _GET_DIF_SHOT_SPEED()*2;
		_this.shotColMap=["-7,-7,7,7"];
	}
	shot(){}
}


class ENEMY_SHOT_DEATH
	extends GameObject_ENEMY_SHOT{
	constructor(_p){
		super({
			x:_p.x,
			y:_p.y,
			width:25,
			height:10,
			deg:_p.deg,
			viewDeg:true
		});
		let _this=this;
		_this.img=_CANVAS_IMGS['enemy_death_shot'].obj;
		_this.speed=1;
	}
	// setDrawImage(){
	// 	let _this=this;
	// 	_GAME._setDrawImage({
	// 		img:_this.img,
	// 		x:_this.x,
	// 		y:_this.y,
	// 		deg:_this.deg
	// 	});
	// }
	move(){
		let _this=this;
		if(_GAME.isEnemyCanvasOut(_this)){
			_this.init();
			return;
		}
		_this.map_collition();
		_this.speed+=0.17;
		let _p=_PARTS_PLAYERMAIN._players_obj.getPlayerCenterPosition();
		if(_p._y<_this.y){_this.deg++;}
		if(_p._y>_this.y){_this.deg--;}

		_this.rad=_this.deg*Math.PI/180;
		_this.sx=Math.cos(_this.rad);//単位x
		_this.sy=Math.sin(_this.rad);//単位y
		_this.x-=parseInt(_this.sx*_this.speed);
		_this.y-=parseInt(_this.sy*_this.speed);
		_this._c++;
	}
}
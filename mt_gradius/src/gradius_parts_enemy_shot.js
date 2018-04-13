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
		_this.aniItv=_p.aniItv||5;//アニメーション間隔

		_this.width=_p.width||18;
		_this.height=_p.height||_this.img.height;
		_this.speed=_p.speed||_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SHOT_SPEED;//定義：発射スピード
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
			"1,1,"+(_this.width-1)+","+(_this.height-1)
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
		return {_x:this.x+(this.width/2),
				_y:this.y+(this.height/2)}
	}
	isalive(){return this._shot_alive;}
	isshow(){return this._isshow;}
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

		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			width:_this.width,
			imgPosx:_this.imgPos[parseInt(_this._c/_this.aniItv)]
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
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y
		});
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

		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			deg:_this.deg
		});
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
	shot(){
		let _this=this;
		if(_this._c>100){
			let _e=_this.getEnemyCenterPosition();
			for(let _i=30;_i<=360;_i+=30){
				_ENEMIES_SHOTS.push(new ENEMY_SHOT_FRAME_SMALL({x:_e._x,y:_e._y,deg:_i}));
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
		if(!_this._shot_alive){return;}
		_this.shot();
		_this.map_collition();
		_this.x-=_this.sx*_this.speed;
		_this.y-=_this.sy*_this.speed;
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			deg:_this.deg
		});
		_this._c++;
	}
}

class ENEMY_SHOT_FRAME_SMALL
	extends ENEMY_SHOT_FRAME{
	constructor(_p){
		super({x:_p.x,y:_p.y,deg:_p.deg});
		let _this=this;
		_this.img=_CANVAS_IMGS['enemy_frame_5'].obj;
		_this.speed=5;
	}
	shot(){}
}
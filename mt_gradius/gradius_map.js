//=====================================================
//	gradius_map.js
//	ステージ処理
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

let _MAPDEFS='';
let _MAPDEF='';
let _MAP_PETTERN=0;
let _BACKGROUND_SPEED=0;
//各種ステージ定義
// _map:配列でマップを作成
// _title:ステージセレクトで、タイトルを表示
// _body:ステージセレクトで、内容を表示
// _speed:マップのスピード表示（1〜）
// _difficult:gradius_enemies.jsより
//				_DEF_ENEMY_DIFFICULTで難易度を設定
// _initx:マップの開始表示位置（0〜）

class GameObject_MAP{
	constructor(_pt){
		this.pt=_pt||0;
		this.initx=0;
		this.x=this.initx;
		this.collision=new RegExp('[0a-z]');
		this.collision_map=new RegExp('[1-9]');
		this.collision_map_d=new RegExp('[68]');
		this.t=25;//単位
		this.mapdef=0;
		this.map_pettern=0;
		this.map_difficult=0;
		this.map_background_speed=0;
	}
	init(_cb){
		_AJAX('./gradius_map.json','json',function(_d){
			_MAPDEFS=_d;
			_cb();
		});
	}
	set_stage_map_pattern(_n){
		this.map_pettern=_n;
	}
	init_stage_map(){
		//ステージの初期設定
		this.x=parseInt(_MAPDEFS[this.map_pettern]._initx);
		this.initx=parseInt(_MAPDEFS[this.map_pettern]._initx);
		this.mapdef=_MAPDEFS[this.map_pettern]._map;
		this.map_difficult=parseInt(_MAPDEFS[this.map_pettern]._difficult)-1;
		_ENEMY_DIFFICULT=parseInt(_MAPDEFS[this.map_pettern]._difficult)-1;
		_BACKGROUND_SPEED=parseInt(_MAPDEFS[this.map_pettern]._speed);
		this.map_background_speed=parseInt(_MAPDEFS[this.map_pettern]._speed);
		_MAP_PETTERN=this.map_pettern;
	}
	init_enemies_location(){
		_ENEMIES=[];
		//MAPより敵の配置
		for(let _i=0;_i<this.mapdef.length;_i++){
		for(let _j=0;_j<this.mapdef[_i].length;_j++){
			//空、または壁はスキップ
			if(this.mapdef[_i][_j]==='0'){continue;}
			if(this.mapdef[_i][_j]
					.match(this.collision)===null){continue;}

			//上下の壁にそって、敵の向きを設定
			let _vdirec=(
					this.mapdef[_i-1]!==undefined
					&&this.mapdef[_i-1][_j]!==undefined
					&&this.mapdef[_i-1][_j]
							.match(this.collision_map)!==null)
						?'up'
						:'down';
				_vdirec=(
					this.mapdef[_i+1]!==undefined
					&&this.mapdef[_i+1][_j]!==undefined
					&&this.mapdef[_i+1][_j]
							.match(this.collision_map)!==null)
						?'down'
						:'up';

			if(this.mapdef[_i][_j]==='a'){
				_ENEMIES.push(
					new ENEMY_a(this.x+(_j*this.t),
								_i*this.t,
								_vdirec)
						);
			}
			if(this.mapdef[_i][_j]==='b'){
				_ENEMIES.push(
					new ENEMY_b(this.x+(_j*this.t),
								_i*this.t,
								_vdirec)
						);
			}
			if(this.mapdef[_i][_j]==='c'){
				_ENEMIES.push(
					new ENEMY_c(this.x+(_j*this.t),
								_i*this.t,
								_vdirec)
						);
			}
			if(this.mapdef[_i][_j]==='d'){
				_ENEMIES.push(
					new ENEMY_d(this.x+(_j*this.t),
								_i*this.t,
								_vdirec)
						);
			}
			if(this.mapdef[_i][_j]==='e'){
				_ENEMIES.push(
					new ENEMY_e(this.x+(_j*this.t),
								_i*this.t,
								_vdirec)
						);
			}
			if(this.mapdef[_i][_j]==='p'){
				let _o=new ENEMY_p(this.x+(_j*this.t),
							_i*this.t);
				_ENEMIES.push(_o);
				_ENEMIES_BOUNDS.push(_o);
			}
			if(this.mapdef[_i][_j]==='z'){
				let _o=new ENEMY_BOSS_BOGCORE(
							this.x+(_j*this.t),
							_i*this.t);
				_ENEMIES.push(_o);
			}
		}//_j
		}//_i
	}
	getCollisionFlag(){return this.collision;}
	getBackGroundSpeed(){
		return this.map_background_speed;
	}
	get_stage_map_pattern(_n){
		return this.map_pettern;
	}
	getMapXToPx(_mx){return _mx*this.t;}
	getMapYToPx(_my){return _my*this.t;}
	getMapX(_x){return parseInt(
					(_x+_SCROLL_POSITION-this.initx)
					/this.t);}
	getMapY(_y){return parseInt(_y/_MAP.t);}
	isMapDouble(_s){
		return (_s.match(this.collision_map_d)!==null);
	}
	isMapBefore(_mx,_my){
		//位置がMAPの手前か判定
		//true:手前
		//false:手前でない、またはそのMAPが存在しない
		let _this=this;
		if(_mx<0){return true;}
		return false;
	}
	isMapLastSide(_mx,_my){
		//位置がMAPの末端か判定
		//true:末端
		//false:末端ではない、またはそのMAPが存在しない
		let _this=this;
		if(_this.mapdef[_my]===undefined){return false;}
		if(_this.mapdef[_my][_mx]===undefined){return true;}
		if(_mx===_this.mapdef[_my].length-1){return true;}
		return false;
	}
	isMapOver(_mx,_my){
		//位置がMAPを超えてるか判定
		//true:超えてる
		//false:超えていない、またはそのMAPが存在しない
		let _this=this;
		if(_this.mapdef[_my]===undefined){return false;}
		if(_this.mapdef[_my][_mx]===undefined){return true;}
		if(_mx>_this.mapdef[_my].length-1){return true;}
		return false;
	}
	isMapCollision(_mx,_my){
		//MAPの座標による衝突判定フラグを取得
		//true:衝突
		//false:衝突しない、またはそのMAPが存在しない
		let _this=this;
		if(_this.mapdef[_my]===undefined){return false;}
		if(_this.mapdef[_my][_mx]===undefined){return false;}
		if(_this.mapdef[_my][_mx].match(this.getCollisionFlag())!==null){return false;}
		return true;
	}
	isShotCollision(){
		let _this=this;
		//ショットのあたり判定
		for(let _i=0;_i<_PLAYERS_SHOTS[_SHOTTYPE].length;_i++){
		let _ps=_PLAYERS_SHOTS[_SHOTTYPE][_i];
		for(let _j=0;_j<_ps.shots.length;_j++){
			let _pss=_ps.shots[_j];
			//ショット中でない場合無視
			if(!_pss._shot_alive){continue;}
			//マップエリア外の場合無視
			if(_pss.x<this.initx-_SCROLL_POSITION)
								{continue;}
			if(_pss.x>(this.mapdef[0].length*this.t)
						+this.initx-_SCROLL_POSITION)
										{continue;}
			_ps.map_collition(_pss);
		}//_j
		}//_i

		//ミサイルのあたり判定
		for(let _i=0;_i<_PLAYERS_MISSILE.length;_i++){
		let _pm=_PLAYERS_MISSILE[_i];
		if(!_pm.player.isalive()){continue;}
		for(let _j=0;_j<_pm.shots.length;_j++){
			let _pms=_pm.shots[_j];
			//ショット中でない場合無視
			if(!_pms._shot_alive){continue;}
			//マップエリア外の場合無視
			if(_pms.x<=this.initx-_SCROLL_POSITION)
								{continue;}

			_pm.map_collition(_pms);
		}//_j
		}//_i

	}//isShotCollision()
	show(){}
	move(){
		this.x-=this.map_background_speed;

		//MAPを表示
		for(let _i=0;_i<this.mapdef.length;_i++){
		for(let _j=0;_j<this.mapdef[_i].length;_j++){
			if(this.mapdef[_i][_j].match(this.collision)!==null){continue;}
//			if(this.x<0){continue;}
//			if(_i===0&&_j===0){console.log('0:'+parseInt(this.x+(_j*this.t)));}
//			if(_i===0&&_j===1){console.log('1:'+parseInt(this.x+(_j*this.t)));}
			if(this.x+(_j*this.t)<-100
				||this.x+(_j*this.t)>_CANVAS.width+100){
				//通り過ぎたら描画しない
				continue;
			}
			let _img=
				_CANVAS_IMGS['map'+this.mapdef[_i][_j]];
			_CONTEXT.drawImage(
				_img.obj,
				this.x+(_j*this.t),
				(this.mapdef[_i][_j]==='8'||this.mapdef[_i][_j]==='6')?(_i-1)*this.t:_i*this.t,
				_img.obj.width,
				_img.obj.height
			);
		}//_j
		}//_i

		//MAPエリア外では衝突判定は行わない
	}
}

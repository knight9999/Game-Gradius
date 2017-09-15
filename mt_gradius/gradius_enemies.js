//=====================================================
//	gradius_enemies.js
//	敵の定義
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

const _DEF_DIFFICULT=[
	{_ENEMY_SHOT_RATE:0.0001,_ENEMY_SHOT_SPEED:1,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.0005,_ENEMY_SHOT_SPEED:2,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.001,_ENEMY_SHOT_SPEED:2,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.004,_ENEMY_SHOT_SPEED:3,_ENEMY_SPEED:1},
	{_ENEMY_SHOT_RATE:0.02,_ENEMY_SHOT_SPEED:4,_ENEMY_SPEED:2}
]
let _ENEMY_DIFFICULT=0;//主にデバッグ用。

class GameObject_ENEMY_BOSS{
	constructor(){
		this.x=0;
		this.y=0;
		this.speed=0;
		this.getscore=10000;
	}
	init(){

	}
	shot(){

	}
	move(){
		let _img=_CANVAS_IMGS['enemy_z'].obj;
		drawImage(_img,_img.width,_img.height,this.x,this.y);
	}
}


class GameObject_ENEMY_BOSS_BOGCORE
			extends GameObject_ENEMY_BOSS{
	constructor(){
		super();
		this._status=10;
		this.speed=10;
	}
	init(){

	}
	shot(){

	}
	move(){
		let _this=this;
		let _img=_CANVAS_IMGS['enemy_z'].obj;
		_this.y+=(_this.y<100)
					?_this.speed*-1
					:_this.speed;
		drawImage(_img,_img.width,_img.height,this.x,this.y);
	}
}

class GameObject_ENEMY{
	constructor(_o,_x,_y){
		this.id=_ENEMIES.length;//敵の当たり判定用ID
		this.bid=_ENEMIES_BOUNDS.length;//敵同士のバウンドID
		this.gid=0;//敵のグループID
		this.img=_o;
		this.x=_x;
		this.y=_y;

		this.isshot=true;

		this.speed=1;
		this.getscore=200;
		this._status=2;
		this.direct='up';//向きの設定

		this.haspc=false;
		this.showedpc=false;//パワーカプセル表示完了

		this._col_ani_c=0;
		this.col_ani=[//衝突時のアニメ定義
			{img:_CANVAS_IMGS['enemy_collapes1'].obj,
			scale:0.3},
			{img:_CANVAS_IMGS['enemy_collapes2'].obj,
			scale:0.3},
			{img:_CANVAS_IMGS['enemy_collapes2'].obj,
			scale:0.3},
			{img:_CANVAS_IMGS['enemy_collapes2'].obj,
			scale:0.2},
			{img:_CANVAS_IMGS['enemy_collapes2'].obj,
			scale:0.2}
		];

		this._col_ani2_c=0;
		this.col_ani2=[//衝突時のアニメ定義
			{img:_CANVAS_IMGS['enemy_collapes12'].obj,
			scale:1.0},
			{img:_CANVAS_IMGS['enemy_collapes13'].obj,
			scale:1.0},
			{img:_CANVAS_IMGS['enemy_collapes13'].obj,
			scale:1.0},
			{img:_CANVAS_IMGS['enemy_collapes12'].obj,
			scale:1.0},
			{img:_CANVAS_IMGS['enemy_collapes11'].obj,
			scale:1.0}
		];

		this._col_pc_c=0;
		this.col_pc=[//パワーカプセルのアニメ定義
			{img:_CANVAS_IMGS['pc1'].obj,scale:0.6},
			{img:_CANVAS_IMGS['pc2'].obj,scale:0.6},
			{img:_CANVAS_IMGS['pc3'].obj,scale:0.5},
			{img:_CANVAS_IMGS['pc4'].obj,scale:0.3},
			{img:_CANVAS_IMGS['pc5'].obj,scale:0.1}
		];

		this.col_type=this.col_ani;//上記衝突表示フラグ
	}
	init(){
        _ENEMIES=new Array();
	}
	ani_col(){
		let _this=this;
		_this.x-=_BACKGROUND_SPEED;
		//大きめな爆発
		if(_this._col_ani_c
				>=_this.col_type.length*3-1){
			//アニメーションが終わったら終了
			return;
		}

		let _c=parseInt(_this._col_ani_c/3);
		let _a=_this.col_type[_c];
		_CONTEXT.drawImage(
			_a.img,
			_this.x,
			_this.y,
			_a.img.width*_a.scale,
			_a.img.height*_a.scale
		);
		this._col_ani_c++;
	}
	collision(){
		this._status-=1;
		if(!this.isalive()){_SCORE.set(this.getscore);}
	}
	getEnemyCenterPosition(){
		return {_x:this.x+(this.img.width/2),
				_y:this.y+(this.img.height/2)}
	}
	getstatus(){return this._status;}
	isalive(){return (this._status>0)?true:false;}
	shot(){
		//キャンバス内でショットさせる
		if(this.x>-100&&this.x>_CANVAS.width+100||
			this.y>0&&this.y>_CANVAS.height){
			return;
		}

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
				_this.speedx=Math.random()*(Math.random()>0.05)?1:-1;
				_this.speedy=Math.random()*(Math.random()>0.5)?1:-1;
				_eb[_i].speedx=Math.random()*(Math.random()>0.05)?1:-1;
				_eb[_i].speedy=Math.random()*(Math.random()>0.5)?1:-1;
			}
		}
	}
	showCollapes(){
		let _this=this;
		//敵を倒した場合
		if(_this.haspc&&!_this.showedpc){
			//パワーカプセルを持ってる場合は、
			//パワーカプセルを表示
			_POWERCAPSELLS.push(
				(new GameObject_POWERCAPSELL(_this.x,_this.y))
			);
			//表示済みにする
			_this.showedpc=true;
			return;
		}
		//爆発して終了
		_this.ani_col();
		return;

	}
	move(){
		if(this.x+this.img.width<0){this.init();return;}
		if(_this._status<=0){
			_this.showCollapes();
			return;
		}

		this.x-=_BACKGROUND_SPEED;
		_CONTEXT.drawImage(
			this.img,
			this.x,
			this.y,
			this.img.width,
			this.img.height
		);
		//弾の発射
		this.shot();

	}
}

class ENEMY_a extends GameObject_ENEMY{
    constructor(_x,_y,_d){
		super(
			_CANVAS_IMGS['enemy_a_1'].obj,_x,_y
		)
		this._status=1;
        this.direct=_d;
        let _t=this;
        this.defimg={
            'up':function(){
                if(_PLAYERS_MAIN.x<_t.x){
                    if(Math.abs(_PLAYERS_MAIN.y-_t.y)>100){
                        return _CANVAS_IMGS['enemy_a_5'].obj;
                    }else{
                        return _CANVAS_IMGS['enemy_a_6'].obj;
                    }
                }else{
                    if(Math.abs(_PLAYERS_MAIN.y-_t.y)>100){
                        return _CANVAS_IMGS['enemy_a_7'].obj;
                    }else{
                        return _CANVAS_IMGS['enemy_a_8'].obj;
                    }
                }
            },
            'down':function(){
                if(_PLAYERS_MAIN.x<_t.x){
                    if(Math.abs(_PLAYERS_MAIN.y-_t.y)>100){
                        return _CANVAS_IMGS['enemy_a_1'].obj;
                    }else{
                        return _CANVAS_IMGS['enemy_a_2'].obj;
                    }
                }else{
                    if(Math.abs(_PLAYERS_MAIN.y-_t.y)>100){
                        return _CANVAS_IMGS['enemy_a_3'].obj;
                    }else{
                        return _CANVAS_IMGS['enemy_a_4'].obj;
                    }
                }
            }
        }
	}
	move(){
		let _this=this;
		if(_this.x+_this.img.width<0){
			_this._status=0;
			return;
		}
		if(_this._status<=0){
			_this.showCollapes();
			return;
		}

		_this.x-=_BACKGROUND_SPEED;
        _this.img=_this.defimg[this.direct]();

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

class ENEMY_b extends GameObject_ENEMY{
	constructor(_x,_y,_d){
		super(
			_CANVAS_IMGS['enemy_b_1'].obj,_x,_y
		)
		this._status=1;
		this.haspc=true;
        this.direct=_d;
        let _t=this;
        this.defimg={
            'up':function(){
                if(_PLAYERS_MAIN.x<_t.x){
                    if(Math.abs(_PLAYERS_MAIN.y-_t.y)>100){
                        return _CANVAS_IMGS['enemy_b_5'].obj;
                    }else{
                        return _CANVAS_IMGS['enemy_b_6'].obj;
                    }
                }else{
                    if(Math.abs(_PLAYERS_MAIN.y-_t.y)>100){
                        return _CANVAS_IMGS['enemy_b_7'].obj;
                    }else{
                        return _CANVAS_IMGS['enemy_b_8'].obj;
                    }
                }
            },
            'down':function(){
                if(_PLAYERS_MAIN.x<_t.x){
                    if(Math.abs(_PLAYERS_MAIN.y-_t.y)>100){
                        return _CANVAS_IMGS['enemy_b_1'].obj;
                    }else{
                        return _CANVAS_IMGS['enemy_b_2'].obj;
                    }
                }else{
                    if(Math.abs(_PLAYERS_MAIN.y-_t.y)>100){
                        return _CANVAS_IMGS['enemy_b_3'].obj;
                    }else{
                        return _CANVAS_IMGS['enemy_b_4'].obj;
                    }
                }
            }
        }
	}
	move(){
		let _this=this;
		if(_this.x+_this.img.width<0){
			_this._status=0;
			return;
		}
		if(_this._status<=0){
			_this.showCollapes();
			return;
		}

		_this.x-=_BACKGROUND_SPEED;
		_this.img=_this.defimg[this.direct]();

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


class ENEMY_c extends GameObject_ENEMY{
	constructor(_x,_y,_d){
		super(
			_CANVAS_IMGS['enemy_c_1'].obj,_x,_y
		)
		this.x=_x;
		this.y=(_d==='down')
			?_y-(_CANVAS_IMGS['enemy_c_1'].obj.height)-_MAP.t
			:_y;
		this._st='_st1';
		this._shot=false;
		this._status=2;//ライフステータス
        this.direct=_d;
		this.col_type=this.col_ani2;//上記衝突表示フラグ
		this.speed=
			_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SPEED;
		this._c_shotstep=0;
		this.shotstep={// ショットのアニメ定義
			'_d_img1':[
				{img:_CANVAS_IMGS['enemy_c_3'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_c_4'].obj,scale:1}
			],
			'_d_img2':[
				{img:_CANVAS_IMGS['enemy_c_7'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_c_8'].obj,scale:1}
			],
			'_d_img3':[
				{img:_CANVAS_IMGS['enemy_c_13'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_c_14'].obj,scale:1}
			],
			'_d_img4':[
				{img:_CANVAS_IMGS['enemy_c_17'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_c_18'].obj,scale:1}
			]
		};
		this._c_walkstep=0;
		this.walkstep={//歩きのアニメ定義
			'_d_img1':[
				{img:_CANVAS_IMGS['enemy_c_1'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_c_2'].obj,scale:1}
			],
			'_d_img2':[
				{img:_CANVAS_IMGS['enemy_c_5'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_c_6'].obj,scale:1}
			],
			'_d_img3':[
				{img:_CANVAS_IMGS['enemy_c_11'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_c_12'].obj,scale:1}
			],
			'_d_img4':[
				{img:_CANVAS_IMGS['enemy_c_15'].obj,scale:1},
				{img:_CANVAS_IMGS['enemy_c_16'].obj,scale:1}
			],
		};
		this._c_walk=0;
		let _this=this;
		let _p=_PLAYERS_MAIN;

        this.ene_status={
        'up':{
			'_st1':function(){
				if(_this._shot===true){return;}
				_this._c_walkstep=
					(_this._c_walkstep===20-1)
					?0
					:_this._c_walkstep+1;
				//自機に合わせて向きを調整
				let _i=(_this.x>_p.getPlayerCenterPosition()._x)
						?'_d_img3'
						:'_d_img4';
				_this.img=_this.walkstep[_i][parseInt(_this._c_walkstep/10)].img;

				_this._c_walk++;
            },
			'_st2':function(){
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

				//自機に合わせて向きを調整
				let _i=(_this.x>_p.getPlayerCenterPosition()._x)
						?'_d_img3'
						:'_d_img4'
				_this.img=
					_this.img=_this.shotstep[_i][parseInt(_this._c_shotstep/10)].img;
            }
		},
        'down':{
			'_st1':function(){
				if(_this._shot===true){return;}
				_this._c_walkstep=
					(_this._c_walkstep===20-1)
					?0
					:_this._c_walkstep+1;
				//自機に合わせて向きを調整
				let _i=(_this.x>_p.getPlayerCenterPosition()._x)
						?'_d_img1'
						:'_d_img2';
				_this.img=_this.walkstep[_i][parseInt(_this._c_walkstep/10)].img;

				_this._c_walk++;
            },
			'_st2':function(){
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

				//自機に合わせて向きを調整
				let _i=(_this.x>_p.getPlayerCenterPosition()._x)
						?'_d_img1'
						:'_d_img2'
				_this.img=
					_this.img=_this.shotstep[_i][parseInt(_this._c_shotstep/10)].img;
            }
		}
        }
	}
	map_collition(){
		let _this=this;
		//中心座標取得
		let _e=_this.getEnemyCenterPosition();

		//MAPの位置を取得
		let _map_x=
			parseInt((_e._x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=
			parseInt(_e._y/_MAP.t);

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
			if(_t.direct==='up'){
				if(_f){return _t.y+_s;}
				return _t.y;
			}else if(_t.direct==='down'){
				if(_f){return _t.y-_s;}
				return _t.y;
			}
		})(_this);

		//穴パターン
		_this.y=(function(_t){
			if(_t.direct==='up'){
				//上に穴がある場合、敵を上にあげる
				if(!_MAP.isMapCollision(_map_x,_map_y-1)){
					return _t.y-_s;
				}
				return _t.y;
			}else if(_t.direct==='down'){
				//下に穴がある場合、敵を下に下げる
				if(!_MAP.isMapCollision(_map_x,_map_y+1)){
					return _t.y+_s;
				}
				return _t.y;
			}
		})(_this);

	}
	set_speed(){
		let _p=
			_PLAYERS_MAIN.getPlayerCenterPosition();

		if(this._c_walk>5000*Math.random()){
			this._c_walk=0;
			this.speed=(_p._x<this.x)
				?(this.speed+_BACKGROUND_SPEED)*-1
				:Math.abs(this.speed);
		}
	}
	shot(){
		//キャンバス内でショットさせる
		if(this.x>-100&&this.x>_CANVAS.width+100||
			this.y>0&&this.y>_CANVAS.height){
			return;
		}
		let _p=_PLAYERS_MAIN.getPlayerCenterPosition();
		let _x=(function(_t){
			return (_p._x>_t.x)
				?1
				:-1;
		})(this);
		let _y=(function(_t){
			return (_t.direct==='up')
			?1
			:-1;
		})(this);
		_ENEMIES_SHOTS.push(
			new GameObject_ENEMY_SHOT2(
				this.x,this.y,_x,_y));
		_ENEMIES_SHOTS.push(
			new GameObject_ENEMY_SHOT2(
				this.x,this.y,_x,_y/2));
	}
	move(){
		let _this=this;
		//表示エリア内に入るまでの待機。
		if(_this.x>_CANVAS.width){
			_this.x-=_MAPDEFS[_MAP_PETTERN]._speed;
			return;
		}
		//表示エリアから一定距離超えた場合終了。
		if(_this.x<-200){
			_this._status=0;
			return;
		}
		if(_this._status<=0){
			_this.showCollapes();
			return;
		}

		_this.map_collition();
		_this.set_speed();

		//_st1->walk, _st2->shot
		_this._st=(
			Math.random()<_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SHOT_RATE||
			_this._shot)
			?'_st2'
			:'_st1';
		_this.ene_status[_this.direct][_this._st]();

		_this.x=(function(_t){
			if(_t._st==='_st1'){
				return _t.x+_this.speed-_BACKGROUND_SPEED;
			}else if(_t._st==='_st2'){
				return _t.x-_BACKGROUND_SPEED;
			}
		})(_this);

//		console.log(_this.x)
		_CONTEXT.drawImage(
			_this.img,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
		);
	}
}


class ENEMY_d extends GameObject_ENEMY{
	constructor(_x,_y,_d){
		super(
			_CANVAS_IMGS['enemy_d_1'].obj,_x,_y
		)
		this._status=1;
        let _t=this;

		this._col_c=0;
		this.col=[//アニメ定義
			{img:_CANVAS_IMGS['enemy_d_1'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_d_2'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_d_3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_d_4'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_d_3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_d_2'].obj,scale:1}
		];
		this.col_type=this.col_ani;

	}
	move(){
		let _this=this;
		if(_this.x+_this.img.width<0){
			_this._status=0;
			return;
		}
		if(_this._status<=0){
			_this.showCollapes();
			return;
		}

		_this.x-=(function(_t){
			return (_t.x>_CANVAS.width)
				?_MAPDEFS[_MAP_PETTERN]._speed
				:_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SPEED*5;
		}(_this));

		let _d=_SCROLL_POSITION*0.5;//radのスピード
		let _v=2*Math.cos(_d*Math.PI/180);//縦幅調整
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

class ENEMY_e extends GameObject_ENEMY{
	constructor(_x,_y,_d){
		super(
			_CANVAS_IMGS['enemy_e_1'].obj,_x,_y
		)
		this._status=1;
		this.haspc=true;
        let _t=this;

		this._col_c=0;
		this.col=[//アニメ定義
			{img:_CANVAS_IMGS['enemy_e_1'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_e_2'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_e_3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_e_4'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_e_3'].obj,scale:1},
			{img:_CANVAS_IMGS['enemy_e_2'].obj,scale:1}
		];
		this.col_type=this.col_ani;

	}
	move(){
		let _this=this;

		if(_this.x+_this.img.width<0){
			_this._status=0;
			return;
		}
		if(_this._status<=0){
			_this.showCollapes();
			return;
		}

		_this.x-=(function(_t){
			return (_t.x>_CANVAS.width)
				?_MAPDEFS[_MAP_PETTERN]._speed
				:_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SPEED*5;
		}(_this));
		if(_this.x+_this.img.width<0){
			_this._status=0;
			return;
		}

		let _d=_SCROLL_POSITION*0.5;//radのスピード
		let _v=2*Math.cos(_d*Math.PI/180);//縦幅調整
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

class ENEMY_p extends GameObject_ENEMY{
    constructor(_x,_y,_d){
		super(
			_CANVAS_IMGS['enemy_p_1'].obj,_x,_y
		)
		this._status=15;
		this.getscore=100;
		this.speedx=_BACKGROUND_SPEED;
		this.speedy=
			(Math.random()+1)
			*((Math.random()>0.5)?1:-1);
		this._isbroken=false;
		this.isshot=false;
	}
	collision(){
		//衝突レーザー、リップルレーザーの判定設定
		this._status=(function(_st){
			if(_SHOTTYPE===_SHOTTYPE_LASER){
				if(_PLAYERS_POWER_METER===0
					||_PLAYERS_POWER_METER===1){
					return _st-0.2;
				}
				return _st-2;
			}
			return _st-1;
		})(this._status);

		if(!this.isalive()){_SCORE.set(this.getscore);}
	}
	map_collition(){
		let _this=this;
		//中心座標取得
		let _e=_this.getEnemyCenterPosition();
		//MAPの位置を取得
		let _map_x=
			parseInt((_e._x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=
			parseInt(_e._y/_MAP.t);

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
	move(){
		let _this=this;
		//表示エリア内に入るまでの待機。

		_this.map_collition();
		_this.move_bounds();
		let _cp=_this.getEnemyCenterPosition();
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
				_t.speedy*=-1;
			}
			return _t.speedy;
		})(_this);
		if(_this.x+_this.img.width<0){
			_this._status=0;
			return;
		}

		if(this._status<=0&&!this._isbroken){
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
						_cp._x+([-30,-15.-10,10,15,30])[_i],
						_cp._y+([-30,-30.-30,30,30,30])[_i]
						);
				_ENEMIES.push(_cls);
				_ENEMIES_BOUNDS.push(_cls);
			}
			this._isbroken=true;
			return;
		}

		if(this._status>0){
			_CONTEXT.drawImage(
				this.img,
				this.x,
				this.y,
				this.img.width,
				this.img.height
			);
		}
	}
}
class ENEMY_p_small extends GameObject_ENEMY{
    constructor(_d,_x,_y){
		super(_d,_x,_y);
		this._status=10;
		this.getscore=500;
		this.speedx=
			_MAPDEFS[_MAP_PETTERN]._speed
			*((Math.random()>0.5)?1:-1);
		this.speedy=
			parseInt(Math.random()+1)
			*((Math.random()>0.5)?1:-1);
		this.col_type=this.col_ani2;
	}
	collision(){
		//衝突レーザー、リップルレーザーの判定設定
		this._status=(function(_st){
			if(_SHOTTYPE===_SHOTTYPE_LASER){
				if(_PLAYERS_POWER_METER===0
					||_PLAYERS_POWER_METER===1){
					return _st-0.2;
				}
				return _st-2.5;
			}
			return _st-1;
		})(this._status);
		if(!this.isalive()){_SCORE.set(this.getscore);}
	}
	map_collition(){
		let _this=this;
		//中心座標取得
		let _e=_this.getEnemyCenterPosition();
		//MAPの位置を取得
		let _map_x=
			parseInt((_e._x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=
			parseInt(_e._y/_MAP.t);

		if(_MAP.isMapCollision(_map_x,_map_y-1)
			||_MAP.isMapCollision(_map_x,_map_y+4)){
			_this.speedx=(_this.speedx<=0)
				?Math.abs(_this.speedx)
				:_this.speedx*-1;
			_this.speedy=(_this.speedy<=0)
				?Math.abs(_this.speedy)
				:_this.speedy*-1;
		}

	}
	move(){
		let _this=this;
		if(_this.x+_this.img.width<0){
			_this._status=0;
			return;
		}
		if(_this._status<=0){
			_this.showCollapes();
			return;
		}

		_this.map_collition();
		_this.move_bounds();

		let _cp=_this.getEnemyCenterPosition();
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


class GameObject_ENEMY_SHOT{
	constructor(_x,_y){
		this.img=new Image();
		this.x=_x||500;
		this.y=_y||300;
		this._c=0;//アニメーションカウント
		this.speed=_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SHOT_SPEED;//定義：発射スピード

		this.px=
			_PLAYERS_MAIN.getPlayerCenterPosition()._x;
		this.py=
			_PLAYERS_MAIN.getPlayerCenterPosition()._y;
		this.deg=
			Math.atan2((this.py-this.y),(this.px-this.x))
			*180/Math.PI;
		this.rad=
			Math.atan2((this.py-this.y),(this.px-this.x));
		this.sx=Math.cos(this.rad);
		this.sy=Math.sin(this.rad);
		this._shot_alive=true;//発射中フラグ

	}
	init(){
		this._shot_alive=false;
	}
	ani_enemy_bullet(){
		this.img=
			_CANVAS_IMGS['enemy_bullet'+parseInt((this._c/4)+1)].obj;
		this._c=(this._c>=7)?0:this._c+1;
	}
	map_collition(){
		//MAPの位置を取得
 		let _map_x=
 			parseInt((this.x
 					+_SCROLL_POSITION
 					-_MAP.initx)
 					/_MAP.t);
 		let _map_y=
 			parseInt(this.y/_MAP.t);
//        console.log('_map_x:'+_map_x);
 		//MAP右端からはみ出る場合は無視する
 		if(_map_y>=_MAP.mapdef.length-1
			||_map_y<0
			||_map_x<0){return;}
 		if(_map_x>=_MAP.mapdef[_map_y].length-1){return;}
        if(_MAP.mapdef[_map_y][_map_x]===undefined){
 			this.init();
 		}
 		if(_MAP.mapdef[_map_y][_map_x].match(_MAP.collision_map)!==null){
 			this.init();
 		}
	}
	getEnemyCenterPosition(){
		return {_x:this.x+(this.img.width/2),
				_y:this.y+(this.img.height/2)}
	}
	isalive(){
		return this._shot_alive;
	}
	shot(){
	}
	move(){
		this.map_collition();
		if(!this._shot_alive){return;}

		this.ani_enemy_bullet();

		if(this.x+this.img.width<0||
			this.x>_CANVAS.width||
			this.y+this.img.height<0||
			this.y>_CANVAS.height){this.init();return;}

		this.x+=this.sx*this.speed;
		this.y+=this.sy*this.speed;

		_CONTEXT.drawImage(
			this.img,
			this.x-(this.img.width/2),
			this.y-(this.img.height/2),
			this.img.width,
			this.img.height
		);
		this._shot_alive=true;
	}
}

class GameObject_ENEMY_SHOT2 extends
					GameObject_ENEMY_SHOT{
	constructor(_x,_y,_sx,_sy){
		super(_x,_y);
		this.sx=_sx||1;
		this.sy=_sy||1;
	}
	move(){
		this.map_collition();
		if(!this._shot_alive){return;}

		this.ani_enemy_bullet();

		//弾がキャンバス外の場合は初期化
		if(this.x+this.img.width<0||
			this.x>_CANVAS.width||
			this.y+this.img.height<0||
			this.y>_CANVAS.height){this.init();return;}

		this.x+=this.sx*this.speed;
		this.y+=this.sy*this.speed;

		_CONTEXT.drawImage(
			this.img,
			this.x-(this.img.width/2),
			this.y-(this.img.height/2),
			this.img.width,
			this.img.height
		);
		this._shot_alive=true;
	}
}

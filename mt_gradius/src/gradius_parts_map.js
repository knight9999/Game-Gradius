//=====================================================
//	gradius_parts_map.js
//	ステージ処理
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

const _PARTS_MAP = {
	_obj:new Object(),
	//key:"x,y"←マップの座標
	//value:マップパーツのオブジェクト
	_init(){
		let _this = this;
		_this._obj = new Object();
	},
	_reset(){
		let _this = this;
		_this._obj = new Object();
	},
	_optimized_maps() {
		let _this = this;
		for (let _k in _this._obj) {
			if (!_this._obj[_k].isshow() && !_this._obj[_k].isalive()) {
				delete _this._obj[_k];
			}
		}
	},
	_init_maps(_k,_o) {
		//マップオブジェクトの初期設定
		//_k：マップ座標値
		//_o：マップオブジェクト
		let _this = this;
		if(_k===undefined||_o===undefined){return;}
		_this._obj[_k]=_o;
	},
	_move_maps() {
		let _this = this;
		Object.keys(_this._obj).map(_k => _this._obj[_k].move());
	},
	_draw_maps() {
		let _this = this;
		Object.keys(_this._obj).map(_k => _this._obj[_k].setDrawImage());
	}
};

//========================================
// 	MAPオブジェクト定義
//	アニメーションさせたい場合は、
//	スプライト画像で用意する。
//	ただし横配置させること
//	img:画像ファイル
//	imgPos:スプライト画像に対するコマ送り定義(array)
//	aniItv:スプライト画像に対するコマ送り間隔
//	width:横幅
//	height:高さ
//========================================
class MAP_OBJECT{
	constructor(_p){
		let _this=this;
		if(_p===undefined){return;}
		_this.img=_p.img;
		_this.imgPos=_p.imgPos||[0];//スプライトのコマポジション
		_this.aniItv=_p.aniItv||1;//アニメーションの間隔
		_this.width=_p.width||_this.img.width;//画像width
		_this.height=_p.height||_this.img.height;//画像height
		_this.dir=_p.dir||1;
		_this.x=_p.x||0;
		_this.y=_p.y||0;
		_this._s=_p.s||'1';

		_this._c=0;
		_this._status = 1;
		_this._isshow = true;
		_this.is_able_collision=false;//破壊可否フラグ
		_this.is_ignore = false;

		_this._standby=true;
		//衝突判定座標(x1,y1,x2,y2)
		//左上：x1,y1
		//右下：x2,y2
		_this.shotColMap = [
			"0,0," + _this.width + "," + _this.height
		];

		_this._DEF_SHOTSTATUS={
			//main.jsよりショットによる衝突判定を設定
			_SHOTTYPE_NORMAL:1,
			_SHOTTYPE_MISSILE:2,
			_SHOTTYPE_DOUBLE:1,
			_SHOTTYPE_RIPPLE_LASER:1.5,
			_SHOTTYPE_LASER:1
		};

		_this._c=0;
	}
	getImg(){
		let _this=this;
		return _this.img.obj;
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
	collision(){}
	showCollapes(){}
	shot(){}
	isIgnore(){return this.is_ignore;}
	isStandBy(){return this._standby;}
	isshow(){return this._isshow;}
	isalive(){return this._status>0;}
	isCanvasOut(){return (this.width + this.x < 0);}
	isMove() {
		let _this = this;
		//move()判定処理
		//以下false（moveしない）
		//・スタンバイ中
		//・キャンバス外
		//・生存しない
		if (_this.isStandBy()) {
			_this.move_standby();
			return false;
		}
		if (_this.isCanvasOut()) {
			_this._status = 0;
			_this._isshow = false;
			return false;
		}
		if (!_this.isshow()) {
			return false;
		}
		if (!_this.isalive()) {
			_this.showCollapes();
			return false;
		}
		return true;
	}
	moveSet(){}
	move_standby(){
		let _this = this;
		if(_this.x > _CANVAS.width){return;}
		this._standby=false;
	}
	setDrawImage(){
		let _this = this;
		if(_this.x>_CANVAS.width){return;}
		if(_this._status===0){return;}
//		console.log(_this._status)
		_GAME._setDrawImage({
			img: _this.img,
			imgPosx: _this.get_imgPos(),
			x: _this.x,
			y: _this.y,
			width: _this.width,
			height: _this.height,
			basePoint: 1
		});
	}
	moveDraw(){}
	move() {
		//原則継承はしない
		let _this = this;
		_this.x = _MAP.getX(_this.x);
		_this.y = _MAP.getY(_this.y);
		_this.speed = _GET_DIF_ENEMY_SPEED();
		if (!_this.isMove()) {
			return;
		}
		_this.set_imgPos();
		_this.moveSet();
		_this.moveDraw();
		_this.shot();
	}
}
//=====================
//cube
//=====================
class MAP_CUBE_A extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_cube_A'].obj,
			width:25,
			height: 25,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='1';
	}
}
class MAP_CUBE_B extends MAP_OBJECT {
	constructor(_p) {
		super({
			img: _CANVAS_IMGS['map_cube_B'].obj,
			width: 500,
			height: 50,
			x: _p.x,
			y: _p.y
		});
		let _this = this;
		_this._s = '11111111111111111111,11111111111111111111';
	}
}
//=====================
//cristal
//=====================
class MAP_CRISTAL extends MAP_OBJECT{
	constructor(_p){
		super({
			img: _CANVAS_IMGS['enemy_p_1'].obj,
			width: 100,
			height: 100,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='0111,1111,0111,0111';
	}
}
class MAP_CRISTAL_UP extends MAP_OBJECT {
	constructor(_p) {
		super({
			img: _CANVAS_IMGS['map_cristal_up'].obj,
			width: 100,
			height: 50,
			x: _p.x,
			y: _p.y
		});
		let _this = this;
		_this._s = '1111,1111';
	}
}
class MAP_CRISTAL_DOWN extends MAP_OBJECT {
	constructor(_p) {
		super({
			img: _CANVAS_IMGS['map_cristal_down'].obj,
			width: 100,
			height: 50,
			x: _p.x,
			y: _p.y
		});
		let _this = this;
		_this._s = '1111,1111';
	}
}


//=====================
//moai
//=====================
class MAP_MOAI_A extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_moai_A'].obj,width:250,height:100,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='0000000000,0111111111,0111111111,0000000000';
	}
}
class MAP_MOAI_B extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_moai_B'].obj,width:250,height:100,x:_p.x,y:_p.y});
		let _this=this;
 		_this._s='0000000000,1111111110,1111111110,0000000000';
	}
}
//=====================
//volcano
//=====================
class MAP_VOLCANO_A extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_A'].obj,width:225,height:75,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='111111111,111111111,000000000';
	}
}
class MAP_VOLCANO_B extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_B'].obj,width:225,height:75,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='111111111,111111111,000000000';
	}
}
class MAP_VOLCANO_C extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_C'].obj,width:225,height:75,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='000000000,111111111,111111111';
	}
}
class MAP_VOLCANO_D extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_D'].obj,width:225,height:75,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='000000000,111111111,111111111';
	}
}
class MAP_VOLCANO_F extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_F'].obj,width:225,height:150,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='000110000,'+
				'000110000,'+
				'001111000,'+
				'011111100,'+
				'011111110,'+
				'111111111';
	}
}
class MAP_VOLCANO_G extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_G'].obj,width:225,height:150,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='111111110,011111110,011111100,001111000,000110000,000110000';
	}
}
class MAP_VOLCANO_H extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_H'].obj,width:500,height:325,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='00000000000000000000,'+
				'00000111111111111110,'+
				'00000111111110000000,'+
				'00000000011110000000,'+
				'00000000001100000000,'+
				'00000000001100000000,'+
				'00000000001100000000,'+
				'11111111111111111100,'+
				'01111111111111111100,'+
				'00000000011000000000,'+
				'00000000011000000000,'+
				'00000000111000000000,'+
				'00000001111110000000';
	}
}
class MAP_VOLCANO_I extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_I'].obj,width:375,height:250,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='000000010000000,'+
				'000000010000000,'+
				'000000111000000,'+
				'000001111100000,'+
				'000011111110000,'+
				'000111111111000,'+
				'001111111111100,'+
				'001111111111100,'+
				'011111111111110,'+
				'111111111111111';
	}
}
class MAP_VOLCANO_J extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_J'].obj,width:375,height:250,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='111111111111111,'+
				'011111111111110,'+
				'001111111111100,'+
				'001111111111100,'+
				'000111111111000,'+
				'000011111110000,'+
				'000001111100000,'+
				'000000111000000,'+
				'000000010000000,'+
				'000000010000000';
	}
}
class MAP_VOLCANO_K extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_K'].obj,width:75,height:25,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='010';
	}
}
class MAP_VOLCANO_L extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_L'].obj,width:75,height:25,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='010';
	}
}
class MAP_VOLCANO_M extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_M'].obj,width:100,height:50,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='0111,1111';
	}
}
class MAP_VOLCANO_N extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_N'].obj,width:100,height:50,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='1111,0111';
	}
}
class MAP_VOLCANO_O extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_O'].obj,width:100,height:50,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='1111,1110';
	}
}
class MAP_VOLCANO_P extends MAP_OBJECT{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_volcano_P'].obj,width:100,height:50,x:_p.x,y:_p.y});
		let _this=this;
		_this._s='1110,1111';
	}
}
//=====================
//frame
//=====================
class MAP_FRAME_A extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_frame_A'].obj,
			imgPos:[0,200,400,600,800],
			aniItv:10,
			width:200,
			height:75,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='000000000,11111111,11111111';
	}
}
class MAP_FRAME_B extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_frame_B'].obj,
			imgPos:[0,200,400,600,800],
			aniItv:10,
			width:200,
			height:75,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='11111111,11111111,00000000';
	}
}
class MAP_FRAME_C extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_frame_C'].obj,
			imgPos:[0,50,100,150],
			aniItv:10,
			width:50,
			height:75,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='00,01,11';
		_this.direct=_DEF_DIR._LD
	}
}
class MAP_FRAME_D extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_frame_D'].obj,
			imgPos:[0,50,100,150],
			aniItv:10,
			width:50,
			height:75,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='11,01,00';
		_this.direct=_DEF_DIR._LU;
	}
}
class MAP_FRAME_E extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_frame_E'].obj,
			imgPos:[0,50,100,150],
			aniItv:10,
			width:50,
			height:75,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='00,10,11';
		_this.direct=_DEF_DIR._LU;
	}
}
class MAP_FRAME_F extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_frame_F'].obj,
			imgPos:[0,50,100,150],
			aniItv:10,
			width:50,
			height:75,
			x: _p.x,
			y: _p.y		
		});
		let _this=this;
		_this._s='11,10,00';
		_this.direct=_DEF_DIR._LU;
	}
}


//=====================
//cell
//=====================
class MAP_CELL_A extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_cell_A'].obj,
			imgPos:[0,475,950],
			aniItv:20,
			width:475,
			height:100,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='0000000000000000000,'
				+'0001111111111111000,'
				+'0011111111111111100,'
				+'1111111111111111111';
	}
}
class MAP_CELL_B extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_cell_B'].obj,
			imgPos:[0,475,950],
			aniItv:20,
			width:475,
			height:100,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='1111111111111111111,'
				+'0011111111111111100,'
				+'0001111111111111000,'
				+'0000000000000000000';
	}
}
class MAP_CELL_C extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_cell_C'].obj,
			imgPos:[0,125,250],
			aniItv:20,
			width:125,
			height:100,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='00100,'
				+'01110,'
				+'01110,'
				+'11111';
	}
}
class MAP_CELL_D extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_cell_D'].obj,
			imgPos:[0,125,250],
			aniItv:20,
			width:125,
			height:100,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='11111,'
				+'01110,'
				+'01110,'
				+'00100';
	}
}

class MAP_CELL_VWYZ extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_p.img,
			imgPos:[0,300,600],
			aniItv:20,
			width:300,
			height:50,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s=_p._s;
	}
}
class MAP_CELL_V extends MAP_CELL_VWYZ{
	constructor(_p){
		super({img:_CANVAS_IMGS['map_cell_V'].obj,
			x: _p.x,
			y: _p.y,
			_s:'001111111100,'
				+'111111111111'
		});
	}
}
class MAP_CELL_W extends MAP_CELL_VWYZ{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_cell_W'].obj,
			x: _p.x,
			y: _p.y,
			_s:'111111111111,'
				+'001111111100'
		});
	}
}
class MAP_CELL_Y extends MAP_CELL_VWYZ{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_cell_Y'].obj,
			x: _p.x,
			y: _p.y,
			_s:'111111111111,'
				+'111111111111'
		});
	}
}
class MAP_CELL_Z extends MAP_CELL_VWYZ{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_cell_Z'].obj,
			x: _p.x,
			y: _p.y,
			_s:'111111111111,'
				+'111111111111'
		});
	}
}


class MAP_CELL_WALL extends MAP_OBJECT{
	constructor(_p){
		super({
			img:_CANVAS_IMGS['map_cell_wall'].obj,
			imgPos:_p.imgPos||[0],
			width:25,
			height:25,
			x: _p.x,
			y: _p.y
		});
		let _this=this;
		_this._s='1';
		_this.is_able_collision=true;
		_this._status=1;
		_this._status_count=0;
		_this.audio_collision=_CANVAS_AUDIOS['map_cell_wall'];
		_this._DEF_SHOTSTATUS._SHOTTYPE_LASER=0.2;
	}
	collision(_s_type){
		let _this=this;	
//		console.log('a')
		_this._status-=
			_this._DEF_SHOTSTATUS[_s_type]||1;
	}
	isMove() {
		let _this = this;
		//move()判定処理
		//以下false（moveしない）
		//・スタンバイ中
		//・キャンバス外
		//・生存しない
		if (_this.isStandBy()) {
			_this.move_standby();
			return false;
		}
		if (_this.isCanvasOut()) {
			_this._status = 0;
			_this._isshow = false;
			return false;
		}
		if (!_this.isshow()) {
			return false;
		}
		if (!_this.isalive()) {
			_this.showCollapes();
			return true;
		}
		return true;
	}
	moveDraw(){
		let _this=this;
//		console.log(_this._status_count)
		if(_this._status_count>=200){
			_this._status_count=0;
			_this._status=1;
			_MAP.set_mapdef_col(
				_MAP.getMapX(_this.x)+1,
				_MAP.getMapY(_this.y),
				'1');
		}
		if(_this._status<=0){
			_this._status=0;
			if(_this._status_count===0){
				_GAME_AUDIO._setPlay(_this.audio_collision);
				_MAP.set_mapdef_col(
					_MAP.getMapX(_this.x) + 1,
					_MAP.getMapY(_this.y),
					'0');
			}
//			console.log('collision:::'+_MAP.getMapX(_this.x))
			_this._status_count++;
		}
		// _GAME._setDrawImage({
		// 	img:_this.img,
		// 	x:_x,
		// 	y:_y,
		// 	width:_this.width,
		// 	imgPosx:_this.imgPos[0],
		// 	basePoint:1
		// })
	}
}
class MAP_CELL_G extends MAP_CELL_WALL{
	constructor(_p){super({imgPos:[0],x:_p.x,y:_p.y});}
}
class MAP_CELL_H extends MAP_CELL_WALL{
	constructor(_p){super({imgPos:[25],x:_p.x,y:_p.y});}
}
class MAP_CELL_I extends MAP_CELL_WALL{
	constructor(_p){super({imgPos:[50],x:_p.x,y:_p.y});}
}
class MAP_CELL_J extends MAP_CELL_WALL{
	constructor(_p){super({imgPos:[75],x:_p.x,y:_p.y});}
}
class MAP_CELL_K extends MAP_CELL_WALL{
	constructor(_p){super({imgPos:[100],x:_p.x,y:_p.y});}
}
class MAP_CELL_L extends MAP_CELL_WALL{
	constructor(_p){super({imgPos:[125],x:_p.x,y:_p.y});}
}
class MAP_CELL_M extends MAP_CELL_WALL{
	constructor(_p){super({imgPos:[150],x:_p.x,y:_p.y});}
}
class MAP_CELL_N extends MAP_CELL_WALL{
	constructor(_p){super({imgPos:[175],x:_p.x,y:_p.y});}
}
class MAP_CELL_O extends MAP_CELL_WALL{
	constructor(_p){super({imgPos:[200],x:_p.x,y:_p.y});}
}
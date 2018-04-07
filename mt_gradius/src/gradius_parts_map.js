//=====================================================
//	gradius_parts_map.js
//	ステージ処理
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

//========================================
// 	MAPオブジェクト定義
//	アニメーションさせたい場合は、
//	スプライト画像で用意する。
//	ただし横配置させること
//========================================
class MAP_OBJECT{
	constructor(_p){
		let _this=this;
		_this._s='1';
		_this._c=0;
		_this._DEF_DIR={//向き
			_U:0,//上
			_D:1,//下
			_R:2,//右
			_L:3,//左
			_LU:4,//左上
			_LD:5,//左下
			_RU:6,//右上
			_RD:7//右下
		};
		_this.img=_p.img;
		_this.imgPos=_p.imgPos||[0];//スプライトのコマポジション
		_this.aniItv=_p.aniItv||1;//アニメーションの間隔
		_this.width=_p.width||_this.img.obj.width;//画像width
		_this.height=_p.height||_this.img.obj.height;//画像height

		_this._c=0;
	}
	getImg(){
		let _this=this;
		return _this.img.obj;
	}
	moveDraw(_x,_y){
		let _this=this;
		_this._c=
			(_this._c>=(_this.imgPos.length*_this.aniItv)-1)?0:_this._c+1;
		_CONTEXT.drawImage(
			_this.img.obj,
			_this.imgPos[parseInt(_this._c/_this.aniItv)],
			0,
			_this.width,
			_this.height,
			_x,
			_y,
			_this.width,
			_this.height
		);
	}
}
//=====================
//cube
//=====================
class MAP_CUBE_A extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_cube_A'],width:25,height:25});
		let _this=this;
		_this._s='1';
		_this.width=50;
	}
}
//=====================
//cristal
//=====================
class MAP_CRISTAL extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['enemy_p_1'],width:84,height:83});
		let _this=this;
		_this._s='011,111,110';
	}
}

//=====================
//moai
//=====================
class MAP_MOAI_A extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_moai_A'],width:250,height:100});
		let _this=this;
		_this._s='0000000000,1111111111,1111111111,0000000000';
	}
}
class MAP_MOAI_B extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_moai_B'],width:250,height:100});
		let _this=this;
 		_this._s='0000000000,1111111111,1111111111,0000000000';
	}
}
//=====================
//volcano
//=====================
class MAP_VOLCANO_A extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_A'],width:225,height:75});
		let _this=this;
		_this._s='111111111,111111111,000000000';
	}
}
class MAP_VOLCANO_B extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_B'],width:225,height:75});
	}
}
class MAP_VOLCANO_C extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_C'],width:225,height:75});
		let _this=this;
		_this._s='000000000,111111111,111111111';
	}
}
class MAP_VOLCANO_D extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_D'],width:225,height:75});
		let _this=this;
		_this._s='000000000,111111111,111111111';
	}
}
class MAP_VOLCANO_F extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_F'],width:225,height:150});
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
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_G'],width:225,height:150});
		let _this=this;
		_this._s='111111110,011111110,011111100,001111000,000110000,000110000';
	}
}
class MAP_VOLCANO_H extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_H'],width:500,height:325});
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
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_I'],width:375,height:250});
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
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_J'],width:375,height:250});
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
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_K'],width:75,height:25});
		let _this=this;
		_this._s='010';
	}
}
class MAP_VOLCANO_L extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_L'],width:75,height:25});
		let _this=this;
		_this._s='010';
	}
}
class MAP_VOLCANO_M extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_M'],width:100,height:50});
		let _this=this;
		_this._s='0111,1111';
	}
}
class MAP_VOLCANO_N extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_N'],width:100,height:50});
		let _this=this;
		_this._s='1111,0111';
	}
}
class MAP_VOLCANO_O extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_O'],width:100,height:50});
		let _this=this;
		_this._s='1111,1110';
	}
}
class MAP_VOLCANO_P extends MAP_OBJECT{
	constructor(){
		super({img:_CANVAS_IMGS['map_volcano_P'],width:100,height:50});
		let _this=this;
		_this._s='1110,1111';
	}
}
//=====================
//frame
//=====================
class MAP_FRAME_A extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_frame_A'],
			imgPos:[0,200,400,600,800],
			aniItv:10,
			width:200,
			height:75
		});
		let _this=this;
		_this._s='000000000,11111111,11111111';
	}
}
class MAP_FRAME_B extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_frame_B'],
			imgPos:[0,200,400,600,800],
			aniItv:10,
			width:200,
			height:75
		});
		let _this=this;
		_this._s='11111111,11111111,00000000';
	}
}
class MAP_FRAME_C extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_frame_C'],
			imgPos:[0,50,100,150],
			aniItv:10,
			width:50,
			height:75
		});
		let _this=this;
		_this._s='00,01,11';
		_this.direct=_this._DEF_DIR._LD
	}
}
class MAP_FRAME_D extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_frame_D'],
			imgPos:[0,50,100,150],
			aniItv:10,
			width:50,
			height:75
		});
		let _this=this;
		_this._s='11,01,00';
		_this.direct=_this._DEF_DIR._LU;
	}
}
class MAP_FRAME_E extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_frame_E'],
			imgPos:[0,50,100,150],
			aniItv:10,
			width:50,
			height:75
		});
		let _this=this;
		_this._s='00,10,11';
		_this.direct=_this._DEF_DIR._LU;
	}
}
class MAP_FRAME_F extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_frame_F'],
			imgPos:[0,50,100,150],
			aniItv:10,
			width:50,
			height:75			
		});
		let _this=this;
		_this._s='11,10,00';
		_this.direct=_this._DEF_DIR._LU;
	}
}


//=====================
//cell
//=====================
class MAP_CELL_A extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_cell_A'],
			imgPos:[0,475,950],
			aniItv:20,
			width:475,
			height:100
		});
		let _this=this;
		_this._s='000000000000000000,'
				+'001111111111111100,'
				+'011111111111111110,'
				+'111111111111111111';
	}
}
class MAP_CELL_B extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_cell_B'],
			imgPos:[0,475,950],
			aniItv:20,
			width:475,
			height:100
		});
		let _this=this;
		_this._s='111111111111111111,'
				+'011111111111111110,'
				+'001111111111111100,'
				+'000000000000000000';
	}
}
class MAP_CELL_C extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_cell_C'],
			imgPos:[0,375,750],
			aniItv:20,
			width:375,
			height:100
		});
		let _this=this;
		_this._s='01111111111111,'
				+'00111111111111,'
				+'00011111111111,'
				+'00000000000000';
		_this.direct=_this._DEF_DIR._LD
	}
}
class MAP_CELL_D extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_cell_D'],
			imgPos:[0,375,750],
			aniItv:20,
			width:375,
			height:100
		});
		let _this=this;
		_this._s='11111111111110,'
				+'11111111111100,'
				+'11111111111000,'
				+'00000000000000';
		_this.direct=_this._DEF_DIR._LU;
	}
}

class MAP_CELL_E extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_cell_E'],
			imgPos:[0,300,600],
			aniItv:20,
			width:300,
			height:50
		});
		let _this=this;
		_this._s='001111111100,'
				+'111111111111';
	}
}

class MAP_CELL_F extends MAP_OBJECT{
	constructor(){
		super({
			img:_CANVAS_IMGS['map_cell_F'],
			imgPos:[0,300,600],
			aniItv:20,
			width:300,
			height:50
		});
		let _this=this;
		_this._s='111111111111,'
				+'001111111100';
	}
}

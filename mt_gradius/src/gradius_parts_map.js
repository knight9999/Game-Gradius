//=====================================================
//	gradius_parts_map.js
//	ステージ処理
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

//========================================
//MAPオブジェクト定義
//
//
//
//========================================
class MAP_OBJECT{
	constructor(){
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
		_this.img=new Image();
		_this.imgs=[];
	}
	getImg(){
		let _this=this;
		return _this.img.obj;
	}
}
//=====================
//cube
//=====================
class MAP_CUBE_A extends MAP_OBJECT{
	constructor(){
		super();
		let _this=this;
		_this._s='1';
		_this.img=_CANVAS_IMGS['map_cube_A'];
	}
}
//=====================
//cristal
//=====================
class MAP_CRISTAL extends MAP_OBJECT{
	constructor(){
		super();
		let _this=this;
		_this._s='011,111,110';
		_this.img=_CANVAS_IMGS['enemy_p_1'];
	}
}

//=====================
//moai
//=====================
class MAP_MOAI_A extends MAP_OBJECT{
	constructor(){
		super();
		let _this=this;
		_this._s='0000000000,1111111111,1111111111,0000000000';
		_this.img=_CANVAS_IMGS['map_moai_A'];
	}
}
class MAP_MOAI_B extends MAP_MOAI_A{
	constructor(){
		super();
		let _this=this;
		_this.img=_CANVAS_IMGS['map_moai_B'];
	}
}
//=====================
//volcano
//=====================
class MAP_VOLCANO_A extends MAP_OBJECT{
	constructor(){
		super();
		let _this=this;
		_this._s='111111111,111111111,000000000';
		_this.img=_CANVAS_IMGS['map_volcano_A'];
	}
}
class MAP_VOLCANO_B extends MAP_VOLCANO_A{
	constructor(){
		super();
		let _this=this;
		_this.img=_CANVAS_IMGS['map_volcano_B'];
	}
}
class MAP_VOLCANO_C extends MAP_VOLCANO_A{
	constructor(){
		super();
		let _this=this;
		_this._s='000000000,111111111,111111111';
		_this.img=_CANVAS_IMGS['map_volcano_C'];
	}
}
class MAP_VOLCANO_D extends MAP_VOLCANO_A{
	constructor(){
		super();
		let _this=this;
		_this._s='000000000,111111111,111111111';
		_this.img=_CANVAS_IMGS['map_volcano_D'];
	}
}
class MAP_VOLCANO_F extends MAP_VOLCANO_A{
	constructor(){
		super();
		let _this=this;
		_this._s='000110000,'+
				'000110000,'+
				'001111000,'+
				'011111100,'+
				'011111110,'+
				'111111111';
		_this.img=_CANVAS_IMGS['map_volcano_F'];
	}
}
class MAP_VOLCANO_G extends MAP_VOLCANO_A{
	constructor(){
		super();
		let _this=this;
		_this._s='111111110,011111110,011111100,001111000,000110000,000110000';
		_this.img=_CANVAS_IMGS['map_volcano_G'];
	}
}
class MAP_VOLCANO_H extends MAP_VOLCANO_A{
	constructor(){
		super();
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
		_this.img=_CANVAS_IMGS['map_volcano_H'];
	}
}
class MAP_VOLCANO_I extends MAP_VOLCANO_A{
	constructor(){
		super();
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
		_this.img=_CANVAS_IMGS['map_volcano_I'];
	}
}
class MAP_VOLCANO_J extends MAP_VOLCANO_A{
	constructor(){
		super();
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
		_this.img=_CANVAS_IMGS['map_volcano_J'];
	}
}
class MAP_VOLCANO_K extends MAP_VOLCANO_A{
	constructor(){
		super();
		let _this=this;
		_this._s='010';
		_this.img=_CANVAS_IMGS['map_volcano_K'];
	}
}
class MAP_VOLCANO_L extends MAP_VOLCANO_A{
	constructor(){
		super();
		let _this=this;
		_this._s='010';
		_this.img=_CANVAS_IMGS['map_volcano_L'];
	}
}
class MAP_VOLCANO_M extends MAP_VOLCANO_A{
	constructor(){
		super();
		let _this=this;
		_this._s='0111,1111';
		_this.img=_CANVAS_IMGS['map_volcano_M'];
	}
}
class MAP_VOLCANO_N extends MAP_VOLCANO_A{
	constructor(){
		super();
		let _this=this;
		_this._s='1111,0111';
		_this.img=_CANVAS_IMGS['map_volcano_N'];
	}
}
class MAP_VOLCANO_O extends MAP_VOLCANO_A{
	constructor(){
		super();
		let _this=this;
		_this._s='1111,1110';
		_this.img=_CANVAS_IMGS['map_volcano_O'];
	}
}
class MAP_VOLCANO_P extends MAP_VOLCANO_A{
	constructor(){
		super();
		let _this=this;
		_this._s='1110,1111';
		_this.img=_CANVAS_IMGS['map_volcano_P'];
	}
}
//=====================
//frame
//=====================
class MAP_FRAME_A extends MAP_OBJECT{
	constructor(){
		super();
		let _this=this;
		_this._s='000000000,11111111,11111111';
		_this._c=0;
		_this.img=_CANVAS_IMGS['map_frame_A_1'];
		_this.imgs=[
			_CANVAS_IMGS['map_frame_A_1'],
			_CANVAS_IMGS['map_frame_A_2'],
			_CANVAS_IMGS['map_frame_A_3'],
			_CANVAS_IMGS['map_frame_A_4'],
			_CANVAS_IMGS['map_frame_A_5']
		];
	}
	getImg(){
		let _this=this;
		_this._c=(_this._c>=(_this.imgs.length*10)-1)
					?0
					:_this._c+1;
		return _this.imgs[parseInt(_this._c/10)].obj;
	}
}
class MAP_FRAME_B extends MAP_FRAME_A{
	constructor(){
		super();
		let _this=this;
		_this._s='11111111,11111111,00000000';
		_this.img=_CANVAS_IMGS['map_frame_B_1'];
		_this.imgs=[
			_CANVAS_IMGS['map_frame_B_1'],
			_CANVAS_IMGS['map_frame_B_2'],
			_CANVAS_IMGS['map_frame_B_3'],
			_CANVAS_IMGS['map_frame_B_4'],
			_CANVAS_IMGS['map_frame_B_5']
		];
	}
}
class MAP_FRAME_C extends MAP_FRAME_A{
	constructor(){
		super();
		let _this=this;
		_this._s='00,01,11';
		_this.img=_CANVAS_IMGS['map_frame_C_1'];
		_this.direct=_this._DEF_DIR._LD
		_this.imgs=[
			_CANVAS_IMGS['map_frame_C_1'],
			_CANVAS_IMGS['map_frame_C_2'],
			_CANVAS_IMGS['map_frame_C_3'],
			_CANVAS_IMGS['map_frame_C_4'],
			_CANVAS_IMGS['map_frame_C_5']
		];
	}
}
class MAP_FRAME_D extends MAP_FRAME_A{
	constructor(){
		super();
		let _this=this;
		_this._s='11,01,00';
		_this.img=_CANVAS_IMGS['map_frame_D_1'];
		_this.direct=_this._DEF_DIR._LU
		_this.imgs=[
			_CANVAS_IMGS['map_frame_D_1'],
			_CANVAS_IMGS['map_frame_D_2'],
			_CANVAS_IMGS['map_frame_D_3'],
			_CANVAS_IMGS['map_frame_D_4'],
			_CANVAS_IMGS['map_frame_D_5']
		];
	}
}
class MAP_FRAME_E extends MAP_FRAME_A{
	constructor(){
		super();
		let _this=this;
		_this._s='00,10,11';
		_this.img=_CANVAS_IMGS['map_frame_E_1'];
		_this.direct=_this._DEF_DIR._LU
		_this.imgs=[
			_CANVAS_IMGS['map_frame_E_1'],
			_CANVAS_IMGS['map_frame_E_2'],
			_CANVAS_IMGS['map_frame_E_3'],
			_CANVAS_IMGS['map_frame_E_4'],
			_CANVAS_IMGS['map_frame_E_5']
		];
	}
}
class MAP_FRAME_F extends MAP_FRAME_A{
	constructor(){
		super();
		let _this=this;
		_this._s='11,10,00';
		_this.img=_CANVAS_IMGS['map_frame_F_1'];
		_this.direct=_this._DEF_DIR._LU
		_this.imgs=[
			_CANVAS_IMGS['map_frame_F_1'],
			_CANVAS_IMGS['map_frame_F_2'],
			_CANVAS_IMGS['map_frame_F_3'],
			_CANVAS_IMGS['map_frame_F_4'],
			_CANVAS_IMGS['map_frame_F_5']
		];
	}
}

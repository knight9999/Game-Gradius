//=====================================================
//	gradius_map.js
//	ステージ処理
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

let _MAPDEFS='';
let _MAPDEF='';
let _MAP_PETTERN=3;
let _BACKGROUND_SPEED=0;

let _MAP_SCROLL_POSITION_X=0;
//_MAP_SCROLL_POSITION_Y
// CANVASの初期左上が0として基点
let _MAP_SCROLL_POSITION_Y=0;

const _MAP_ENEMIES={
_DEF_DIR:{//向き
	_U:0,//上
	_D:1,//下
	_R:2,//右
	_L:3,//左
	_LU:4,//左上
	_LD:5,//左下
	_RU:6,//右上
	_RD:7//右下
},//_DEF_DIR
_setDir:function(_mx,_my){
	let _this=this;
	let _d=(_MAP.isMapCollision(_mx,_my-1))
			?_this._DEF_DIR._U
			:_this._DEF_DIR._D;
	_d=(_MAP.isMapCollision(_mx,_my+1))
			?_this._DEF_DIR._D
			:_this._DEF_DIR._U;
	return _d;
},//_setDir
_ENEMIES:{
	'a':{
		'_f':function(_mx,_my,_md){
			_ENEMIES.push(new ENEMY_a(_mx,_my,_md));
			},
		'_st':'',
		'_s':'0',//MAP衝突用ビット
		'_o':_CANVAS_IMGS['enemy_a_1']//画像オブジェクト
	},
	'b':{
		'_f':function(_mx,_my,_md){
			_ENEMIES.push(new ENEMY_b(_mx,_my,_md));
			},
		'_st':'',
		'_s':'0',
		'_o':_CANVAS_IMGS['enemy_b_1']
	},
	'c':{
		'_f':function(_mx,_my,_md){
			_ENEMIES.push(new ENEMY_c(_mx,_my,_md));
			},
		'_st':'',
		'_s':'0',
		'_o':_CANVAS_IMGS['enemy_c_1']
	},
	'd':{
		'_f':function(_mx,_my,_md){
			_ENEMIES.push(new ENEMY_d(_mx,_my,_md));
			},
		'_st':'',
		'_s':'0',
		'_o':_CANVAS_IMGS['enemy_d_1']
	},
	'e':{
		'_f':function(_mx,_my,_md){
			_ENEMIES.push(new ENEMY_e(_mx,_my,_md));
			},
		'_st':'',
		'_s':'0',
		'_o':_CANVAS_IMGS['enemy_e_1']
	},
	'f':{
		'_f':function(_mx,_my,_md){
			_md=(_my<_CANVAS.height/2)
				?_MAP_ENEMIES._DEF_DIR._U
				:_MAP_ENEMIES._DEF_DIR._D;
			_ENEMIES.push(new ENEMY_f(_mx,_my,_md));
			},
		'_st':'',
		'_s':'0',	
		'_o':_CANVAS_IMGS['enemy_f_1']
	},
	'g':{
		'_f':function(_mx,_my,_md){
			_md=(_my<_CANVAS.height/2)
				?_MAP_ENEMIES._DEF_DIR._U
				:_MAP_ENEMIES._DEF_DIR._D;

			_ENEMIES.push(new ENEMY_g(_mx,_my,_md));
			},
		'_st':'',
		'_s':'0',	
		'_o':_CANVAS_IMGS['enemy_g_1']
	},
	'm':{
		'_f':function(_mx,_my,_md){
			_ENEMIES.push(new ENEMY_m(_mx,_my,_md));
			},
		'_st':'',
		'_s':'0',	
		'_o':_CANVAS_IMGS['enemy_m_1']
	},
	'n':{
		'_f':function(_mx,_my,_md){
			_ENEMIES.push(new ENEMY_n(_mx,_my));
			},
		'_st':'',
		'_s':'0',		
		'_o':_CANVAS_IMGS['enemy_o_1']
	},
	'o':{
		'_f':function(_mx,_my,_md){
			_ENEMIES.push(new ENEMY_o(_mx,_my));
			},
		'_st':'',
		'_s':'0',		
		'_o':_CANVAS_IMGS['enemy_o_1']
	},
	'p':{
		'_f':function(_mx,_my,_md){
			let _o=new ENEMY_p(_mx,_my);
			_ENEMIES.push(_o);
			},
		'_st':'',
		'_s':'000,000,000',		
		'_o':_CANVAS_IMGS['enemy_p_1']
	},
	'z':{
		'_f':function(_mx,_my,_md){
			_ENEMIES.push(new ENEMY_FAN(_mx,_my,_md));
			},
		'_st':'',
		'_s':'0',
		'_o':_CANVAS_IMGS['enemy_fan']
	}

}//_ENEMIES
}

//マップ用ボス定義
const _MAP_ENEMIES_BOSS={
	'enemy_cristalcore':{
		_f:function(){return new ENEMY_BOSS_CRYSTALCORE(700,800)}
	},
	'enemy_bigcore':{
		_f:function(){return new ENEMY_BOSS_BIGCORE(_CANVAS.width+200,200)}
	},
	'enemy_cristalcore_pt2':{
		_f:function(){return new ENEMY_BOSS_CRYSTALCORE_PT2(700,800)}
	},
	'enemy_bigcore2':{
		_f:function(){return new ENEMY_BOSS_BIGCORE2(_CANVAS.width+200,200)}
	},
	'enemy_frame':{
		_f:function(){return new ENEMY_BOSS_FRAME(1000,200)}
	},
	'enemy_cell':{
		_f:function(){return new ENEMY_BOSS_CELL(_CANVAS.width+200,200)}
	}
};


const _MAP_THEME={//_parts要素番号0は空文字
'_THEME1':{//クリスタル
	'_map':{
		'A':{
			'_o':(new MAP_CRISTAL()).img,//画像
			'_s':(new MAP_CRISTAL())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_CRISTAL();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},//_MAP.moveDraw()で処理させる
						//'A'からオブジェクト群を、x、y座標をキーに個別に保持させる
			'_obj':new MAP_CRISTAL()
		}
	},
	'_enemies':_MAP_ENEMIES._ENEMIES
},//_THEME1
'_THEME2':{//火山
	'_map':{
		'A':{
			'_o':(new MAP_VOLCANO_A()).img,//画像
			'_s':(new MAP_VOLCANO_A())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_A();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_A()
		},
		'B':{
			'_o':(new MAP_VOLCANO_B()).img,//画像
			'_s':(new MAP_VOLCANO_B())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_B();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_B()
		},
		'C':{
			'_o':(new MAP_VOLCANO_C()).img,//画像
			'_s':(new MAP_VOLCANO_C())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_C();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_C()
		},
		'D':{
			'_o':(new MAP_VOLCANO_D()).img,//画像
			'_s':(new MAP_VOLCANO_D())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_D();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_D()
		},
		'F':{
			'_o':(new MAP_VOLCANO_F()).img,//画像
			'_s':(new MAP_VOLCANO_F())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_F();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_F()
		},
		'G':{
			'_o':(new MAP_VOLCANO_G()).img,//画像
			'_s':(new MAP_VOLCANO_G())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_G();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_G()
		},
		'H':{
			'_o':(new MAP_VOLCANO_H()).img,//画像
			'_s':(new MAP_VOLCANO_H())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_H();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_H()
		},
		'I':{//8
			'_o':(new MAP_VOLCANO_I()).img,//画像
			'_s':(new MAP_VOLCANO_I())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_I();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_I()
		},
		'J':{
			'_o':(new MAP_VOLCANO_J()).img,//画像
			'_s':(new MAP_VOLCANO_J())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_J();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_J()
		},
		'K':{
			'_o':(new MAP_VOLCANO_K()).img,//画像
			'_s':(new MAP_VOLCANO_K())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_K();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_K()
		},
		'L':{
			'_o':(new MAP_VOLCANO_L()).img,//画像
			'_s':(new MAP_VOLCANO_L())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_L();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_L()
		},
		'M':{
			'_o':(new MAP_VOLCANO_M()).img,//画像
			'_s':(new MAP_VOLCANO_M())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_M();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_M()
		},
		'N':{
			'_o':(new MAP_VOLCANO_N()).img,//画像
			'_s':(new MAP_VOLCANO_N())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_N();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_N()
		},
		'O':{
			'_o':(new MAP_VOLCANO_O()).img,//画像
			'_s':(new MAP_VOLCANO_O())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_O();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_O()
		},
		'P':{
			'_o':(new MAP_VOLCANO_P()).img,//画像
			'_s':(new MAP_VOLCANO_P())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_VOLCANO_P();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':new MAP_VOLCANO_P()
		}

	},
	'_enemies':_MAP_ENEMIES._ENEMIES
},//_THEME2
'_THEME3':{//キューブ
	'_map':{
		'A':{
			'_o':(new MAP_CUBE_A()).img,//画像
			'_s':(new MAP_CUBE_A())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_CUBE_A();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},//'A'からオブジェクト群を、x、y座標をキーに個別に保持させる
			'_obj':(new MAP_CUBE_A())
		}
	},
	'_enemies':_MAP_ENEMIES._ENEMIES
},//_THEME3
'_THEME5':{//なし
	'_map':{
		'B':{
			'_o':(new MAP_MOAI_A()).img,//画像
			'_s':(new MAP_MOAI_A())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_MOAI_A();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':(new MAP_MOAI_A())
		},
		'C':{
			'_o':(new MAP_MOAI_B()).img,//画像
			'_s':(new MAP_MOAI_B())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_MOAI_B();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},
			'_obj':(new MAP_MOAI_B())
		}
	},
	'_enemies':{
		'a':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_a(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',//MAP衝突用ビット
			'_o':_CANVAS_IMGS['enemy_a_1']//画像オブジェクト
		},
		'b':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_b(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_b_1']
		},
		'c':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_c(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_c_1']
		},
		'd':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_d(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_d_1']
		},
		'e':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_e(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_e_1']
		},
		'f':{
			'_f':function(_mx,_my,_md){
				_md=(_my<_CANVAS.height/2)
					?_MAP_ENEMIES._DEF_DIR._U
					:_MAP_ENEMIES._DEF_DIR._D;
				_ENEMIES.push(new ENEMY_f(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',	
			'_o':_CANVAS_IMGS['enemy_f_1']
		},
		'g':{
			'_f':function(_mx,_my,_md){
				_md=(_my<_CANVAS.height/2)
					?_MAP_ENEMIES._DEF_DIR._U
					:_MAP_ENEMIES._DEF_DIR._D;
	
				_ENEMIES.push(new ENEMY_g(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',	
			'_o':_CANVAS_IMGS['enemy_g_1']
		},
		'm':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_m(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',	
			'_o':_CANVAS_IMGS['enemy_m_1']
		},
		'l':{
			'_f':function(_mx,_my,_md){
				let _o=new ENEMY_q(_mx,_my,_MAP_ENEMIES._DEF_DIR._U);
				_ENEMIES.push(_o);
			},
			'_st':'transform:scale(1,-1);',
			'_s':'1111,0110,0011,0000',
			'_o':_CANVAS_IMGS['enemy_m_a_1']
		},
		'n':{
			'_f':function(_mx,_my,_md){
				let _o=new ENEMY_q(_mx,_my,_MAP_ENEMIES._DEF_DIR._D);
				_ENEMIES.push(_o);
			},
			'_st':'',
			'_s':'0000,0011,0110,1111',		
			'_o':_CANVAS_IMGS['enemy_m_a_1']
		},
		'o':{
			'_f':function(_mx,_my,_md){
				let _o=new ENEMY_r(_mx,_my,_MAP_ENEMIES._DEF_DIR._U);
				_ENEMIES.push(_o);
			},
			'_st':'transform:scale(1,-1);',
			'_s':'1111,0010,0000,0000',		
			'_o':_CANVAS_IMGS['enemy_m_b_1']
		},
		'p':{
			'_f':function(_mx,_my,_md){
				let _o=new ENEMY_r(_mx,_my,_MAP_ENEMIES._DEF_DIR._D);
				_ENEMIES.push(_o);
			},
			'_st':'',
			'_s':'0000,0000,0010,1111',		
			'_o':_CANVAS_IMGS['enemy_m_b_2']
		},
		'q':{
			'_f':function(_mx,_my,_md){
				let _o=new ENEMY_q(_mx,_my,_MAP_ENEMIES._DEF_DIR._LD);
				_ENEMIES.push(_o);
			},
			'_st':'transform:scale(-1,1);',
			'_s':'0000,1100,1110,1111',
			'_o':_CANVAS_IMGS['enemy_m_a_1']
		},
		'r':{
			'_f':function(_mx,_my,_md){
				let _o=new ENEMY_q(_mx,_my,_MAP_ENEMIES._DEF_DIR._LU);
				_ENEMIES.push(_o);
			},
			'_st':'transform:scale(-1,-1);',
			'_s':'1111,1110,1100,0000',		
			'_o':_CANVAS_IMGS['enemy_m_a_1']
		},
		'z':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_FAN(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_fan']
		}
	}
},//_THEME5
'_THEME6':{//炎
	'_map':{
		'A':{
			'_o':(new MAP_FRAME_A()).img,//画像
			'_s':(new MAP_FRAME_A())._s,//衝突座標
			'_f':function(_key){this.objs[_key]=new MAP_FRAME_A();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},//'A'からオブジェクト群を、x、y座標をキーに個別に保持させる
			'_obj':(new MAP_FRAME_A())
		},
		'B':{
			'_o':(new MAP_FRAME_B()).img,
			'_s':(new MAP_FRAME_B())._s,
			'_f':function(_key){this.objs[_key]=new MAP_FRAME_B();},
			'objs':{},
			'_obj':(new MAP_FRAME_B())
		},
		'C':{
			'_o':(new MAP_FRAME_C()).img,
			'_s':(new MAP_FRAME_C())._s,
			'_f':function(_key){this.objs[_key]=new MAP_FRAME_C();},
			'objs':{},
			'_obj':(new MAP_FRAME_C())
		},
		'D':{
			'_o':(new MAP_FRAME_D()).img,
			'_s':(new MAP_FRAME_D())._s,
			'_f':function(_key){this.objs[_key]=new MAP_FRAME_D();},
			'objs':{},
			'_obj':(new MAP_FRAME_D())
		},
		'E':{
			'_o':(new MAP_FRAME_E()).img,
			'_s':(new MAP_FRAME_E())._s,
			'_f':function(_key){this.objs[_key]=new MAP_FRAME_E();},
			'objs':{},
			'_obj':(new MAP_FRAME_E())
		},
		'F':{
			'_o':(new MAP_FRAME_F()).img,
			'_s':(new MAP_FRAME_F())._s,
			'_f':function(_key){this.objs[_key]=new MAP_FRAME_F();},
			'objs':{},
			'_obj':(new MAP_FRAME_F())
		}

	},
	'_enemies':{
		'a':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_frame_1(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',//MAP衝突用ビット
			'_o':_CANVAS_IMGS['enemy_frame_1']//画像オブジェクト
		},
		'd':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_d(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_d_1']
		},
		'e':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_e(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_e_1']
		},
		'z':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_FAN(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_fan']
		}
	}

},//_THEME6
'_THEME7':{//細胞
	'_map':{
		'A':{
			'_o':(new MAP_CELL_A()).img,//画像
			'_s':(new MAP_CELL_A())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_A();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},//'A'からオブジェクト群を、x、y座標をキーに個別に保持させる
			'_obj':(new MAP_CELL_A())
		},
		'B':{
			'_o':(new MAP_CELL_B()).img,//画像
			'_s':(new MAP_CELL_B())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_B();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},//'A'からオブジェクト群を、x、y座標をキーに個別に保持させる
			'_obj':(new MAP_CELL_B())
		},
		'C':{
			'_o':(new MAP_CELL_C()).img,//画像
			'_s':(new MAP_CELL_C())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_C();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},//'A'からオブジェクト群を、x、y座標をキーに個別に保持させる
			'_obj':(new MAP_CELL_C())
		},
		'D':{
			'_o':(new MAP_CELL_D()).img,//画像
			'_s':(new MAP_CELL_D())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_D();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},//'A'からオブジェクト群を、x、y座標をキーに個別に保持させる
			'_obj':(new MAP_CELL_D())
		},
		'G':{
			'_o':(new MAP_CELL_G()).img,
			'_s':(new MAP_CELL_G())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_G();},
			'objs':{},
			'_obj':(new MAP_CELL_G())
		},
		'H':{
			'_o':(new MAP_CELL_H()).img,
			'_s':(new MAP_CELL_H())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_H();},
			'objs':{},
			'_obj':(new MAP_CELL_H())
		},
		'I':{
			'_o':(new MAP_CELL_I()).img,
			'_s':(new MAP_CELL_I())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_I();},
			'objs':{},
			'_obj':(new MAP_CELL_I())
		},
		'J':{
			'_o':(new MAP_CELL_J()).img,
			'_s':(new MAP_CELL_J())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_J();},
			'objs':{},
			'_obj':(new MAP_CELL_J())
		},
		'K':{
			'_o':(new MAP_CELL_K()).img,
			'_s':(new MAP_CELL_K())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_K();},
			'objs':{},
			'_obj':(new MAP_CELL_K())
		},
		'L':{
			'_o':(new MAP_CELL_L()).img,
			'_s':(new MAP_CELL_L())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_L();},
			'objs':{},
			'_obj':(new MAP_CELL_L())
		},
		'M':{
			'_o':(new MAP_CELL_M()).img,
			'_s':(new MAP_CELL_M())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_M();},
			'objs':{},
			'_obj':(new MAP_CELL_M())
		},
		'N':{
			'_o':(new MAP_CELL_N()).img,
			'_s':(new MAP_CELL_N())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_N();},
			'objs':{},
			'_obj':(new MAP_CELL_N())
		},
		'O':{
			'_o':(new MAP_CELL_O()).img,
			'_s':(new MAP_CELL_O())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_O();},
			'objs':{},
			'_obj':(new MAP_CELL_O())
		},
		'V':{
			'_o':(new MAP_CELL_V()).img,//画像
			'_s':(new MAP_CELL_V())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_V();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},//'A'からオブジェクト群を、x、y座標をキーに個別に保持させる
			'_obj':(new MAP_CELL_V())
		},
		'W':{
			'_o':(new MAP_CELL_W()).img,//画像
			'_s':(new MAP_CELL_W())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_W();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},//'A'からオブジェクト群を、x、y座標をキーに個別に保持させる
			'_obj':(new MAP_CELL_W())
		},
		'Y':{
			'_o':(new MAP_CELL_Y()).img,//画像
			'_s':(new MAP_CELL_Y())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_Y();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},//'A'からオブジェクト群を、x、y座標をキーに個別に保持させる
			'_obj':(new MAP_CELL_Y())
		},
		'Z':{
			'_o':(new MAP_CELL_Z()).img,//画像
			'_s':(new MAP_CELL_Z())._s,
			'_f':function(_key){this.objs[_key]=new MAP_CELL_Z();},//初期設定時、マップ座標をキーにobjsにクラスを格納させる
			'objs':{},//'A'からオブジェクト群を、x、y座標をキーに個別に保持させる
			'_obj':(new MAP_CELL_Z())
		},
	},
	'_enemies':{
		'a':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_cell_core(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',//MAP衝突用ビット
			'_o':_CANVAS_IMGS['enemy_cell_core']//画像オブジェクト
		},
		'b':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_CELL_A(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_cell_a_1']
		},
		'c':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_CELL_B(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_cell_b_1']
		},
		'd':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_d(_mx,_my,_md));
					},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_d_1']
		},
		'e':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_e(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_e_1']
		},
		'z':{
			'_f':function(_mx,_my,_md){
				_ENEMIES.push(new ENEMY_FAN(_mx,_my,_md));
				},
			'_st':'',
			'_s':'0',
			'_o':_CANVAS_IMGS['enemy_fan']
		}
	}

}//_THEME7
}//_MAP_THEME

//各種ステージ定義
// _map:配列でマップを作成
// _title:ステージセレクトで、タイトルを表示
// _body:ステージセレクトで、内容を表示
// _speed:マップのスピード表示（1〜）
// _difficult:gradius_enemies.jsより
//				_DEF_ENEMY_DIFFICULTで難易度を設定
// _initx:マップの開始表示位置（0〜）

// _this.map_backgroundY_speed:Y軸スクロールスピード
// _MAP_SCROLL_POSITION_Y（0-999）:主に衝突マップを使って当たり判定させる
class GameObject_MAP{
	constructor(_pt){
		let _this=this;
		_this.pt=_pt||0;
		_this.initx=0;
		_this.inity=0;
		_this.x=_this.initx;
		_this.y=_this.inity;
		_this.collision=new RegExp('[1A-Z]');
		_this.collision_enemies=new RegExp('[a-z]','g');
		_this.collision_map=new RegExp('[A-Z]');
		_this.collision_map_d=new RegExp('[BD]');//MAP衝突用
		_this.t=25;//単位
		_this.mapdef=new Array();//MAP表示用
		_this.mapdef_col=new Array();//MAP衝突用
		_this.map_theme=0;
		_this.map_pettern=0;
		_this.map_difficult=0;
		_this.map_background_speed=0;
		_this.map_backgroundY_speed=0;
		_this.map_infinite=false;
		_this.map_bgmusic='';
		_this.map_boss='';
		_this.isboss=false;
	}
	init(_cb){
		_AJAX('./gradius_map.json','json',function(_d){
			_MAPDEFS=_d;
			_cb();
		});
	}
	setInifinite(_f){
		this.map_infinite=_f;
	}
	set_stage_map_pattern(_n){
		this.map_pettern=_n;
	}
	init_stage_map(){
		//ステージの初期設定
		let _this=this;
		_this.map_backgroundY_speed=0;
		_this.x=parseInt(_MAPDEFS[_this.map_pettern]._initx);
		_this.y=_this.inity;
		_this.initx=parseInt(_MAPDEFS[_this.map_pettern]._initx);
		_this.mapdef=_MAPDEFS[_this.map_pettern]._map;
		_this.map_difficult=parseInt(_MAPDEFS[_this.map_pettern]._difficult)-1;
		_ENEMY_DIFFICULT=
			(_ISDEBUG)
				?_ENEMY_DIFFICULT
				:parseInt(_MAPDEFS[_this.map_pettern]._difficult)-1;
		_this.map_background_speed=parseInt(_MAPDEFS[_this.map_pettern]._speed);
		_BACKGROUND_SPEED=parseInt(_MAPDEFS[_this.map_pettern]._speed);
		_MAP_PETTERN=_this.map_pettern;
		_this.map_theme=_MAPDEFS[_this.map_pettern]._theme;
		_this.map_infinite=(_MAPDEFS[_this.map_pettern]._map_infinite==='true')?true:false;
		_this.map_bgmusic=_MAPDEFS[_this.map_pettern]._bgmusic;
		_this.map_boss=_MAPDEFS[_this.map_pettern]._boss;
		_this.isboss=false;

		_this.init_map_anime();
		_this.init_mapdef_col();
		_this.init_enemies_location();
	}
	init_map_anime(){
		let _this=this;
		for(let _i=0;_i<_this.mapdef.length;_i++){
		let _m=_this.mapdef[_i];
		for(let _j=0;_j<_m.length;_j++){
			//MAP衝突用1行分ループ
			if((_m[_j]).match(/[A-Z]/)===null){continue;}
			_MAP_THEME[_this.map_theme]._map[_m[_j]]._f(_j+','+_i);
//			_MAP_ANIME[_j+','+_i]=_c;
		}
		}
	}
	init_enemies_location(){
		let _this=this;
		//MAPより敵の配置
		for(let _i=0;_i<_this.mapdef.length;_i++){
		for(let _j=0;_j<_this.mapdef[_i].length;_j++){
			//空、または壁はスキップ
			let _md=_this.mapdef[_i][_j];
			if(_this.isCollisionBit(_md)){continue;}
			if(_md==='0'){continue;}

			let _d=_MAP_ENEMIES._setDir(_j,_i);//向きを取得する
			_MAP_THEME[_this.map_theme]._enemies[_md]
				._f(_this.x+(_j*_this.t),_i*_this.t,_d);

		}//_j
		}//_i
	}
	init_mapdef_col(){
		//MAP衝突用作成関数
		//MAPからMAP衝突用を複製し、
		//MAPテーマがMAPビット・敵ビットを置換させる。
		//最終的には'1'と'0'のみにする。
		let _this=this;
		//MAPからMAP衝突用を複製
		Object.assign(_this.mapdef_col,_this.mapdef);
		//MAP衝突用から敵ビットを外す
		for(let _i=0;_i<_this.mapdef_col.length;_i++){
			_this.mapdef_col[_i]=
				_this.mapdef_col[_i].replace(/[a-zA-Z]/ig,'0');
		}

		for(let _i=0;_i<_this.mapdef.length;_i++){
		let _m=_this.mapdef[_i];
		for(let _j=0;_j<_m.length;_j++){
			//MAP衝突用1行分ループ
			if((_m[_j]).match(/[A-Za-z]/)===null){continue;}
			//MAPテーマより、MAPビットを取得する
			let _p=
				(_this.isEnemiesBit(_m[_j]))
				?_MAP_THEME[_this.map_theme]._enemies[_m[_j]]
				:_MAP_THEME[_this.map_theme]._map[_m[_j]];
			if(_p===undefined){
				console.log('テーマ:'+_this.map_theme+'に対して '+_m[_j]+'の定義がありません。');
			}
			let _p_s=_p._s.split(',');
			for(let _l=0;_l<_p_s.length;_l++){//p._s分ループ
				let _s_mapdef_col=_this.mapdef_col[_i+_l];
				let _s_mapdef=_this.mapdef[_i+_l];
				//置換箇所は文字列を分割、置換、結合処理
				_this.mapdef_col[_i+_l]=
					_s_mapdef_col.substr(0,_j)
					+(function(_s_md,_s_mdc,_psl){
						return _this.setCollisionBit(_psl,_s_mdc);
					})(_s_mapdef.substr(_j,_p_s[_l].length),
						_s_mapdef_col.substr(_j,_p_s[_l].length),
						_p_s[_l])
					+_s_mapdef_col.substr(_j+_p_s[_l].length,_m.length);			
			}//_l
		}//_j
		}//_i	
	}
	set_mapdef_col(_mx,_my,_bit){
		let _this=this;
		//MAP衝突用の一部変更
		if(_mx===undefined
			||_my===undefined
			||_bit===undefined){return;}
		let _p_s=_bit.split(',');
		for(let _l=0;_l<_p_s.length;_l++){//p._s分ループ
			let _s_mapdef_col=_this.mapdef_col[_my+_l];
			//置換箇所は文字列を分割、置換、結合処理
			_this.mapdef_col[_my+_l]=
				_s_mapdef_col.substr(0,_mx)
				+_p_s[_l]
				+_s_mapdef_col.substr(_mx+_p_s[_l].length);			
		}//_l
	}
	getX(_x){
		return _x+(_BACKGROUND_SPEED*-1);
	}
	getY(_y){
		//y軸スクロール時、y位置を転回する
		let _this=this;
		if(!_this.map_infinite){return _y;}

		//CANVAS表示エリアから上下250px
		//-250〜750
//		console.log('_y'+_y)
		if(_y-_MAP.map_backgroundY_speed<-250){
			var _d=(250+_y)-_MAP.map_backgroundY_speed;
//			console.log('_d'+_d)
			return 750+_d;
		}
		if(_y-_MAP.map_backgroundY_speed>750){
			var _d=(750-_y)+_MAP.map_backgroundY_speed;
//			console.log('_d'+_d)
			return -250-_d;
		}
		return (_y-_MAP.map_backgroundY_speed)%1000;
	}
	getShotY(_y){
		return _y-_MAP.map_backgroundY_speed;
	}
	setCollisionBit(_pb,_mcb){
		let _this=this;
		let _s='';
		for(let _i=0;_i<_pb.length;_i++){
			if(_pb[_i]==='0'){
				_s+=_mcb[_i];
				continue;
			}
			_s+='1';
		}
		return _s;
	}
	getCollisionFlag(){return this.collision;}
	setBackGroundSpeedY(_v){
		//Y軸の背景スピードの設定
		this.map_backgroundY_speed=_v;
	}
	getBackGroundSpeed(){
		return this.map_background_speed;
	}
	getBackGroundSpeedY(){
		return this.map_backgroundY_speed;
	}
	get_stage_map_pattern(_n){
		return this.map_pettern;
	}
	getMapXToPx(_mx){
		return (_mx*this.t)+this.initx-_MAP_SCROLL_POSITION_X;
	}
	getMapYToPx(_y){
		return _y;
	}
	getMapX(_x){
		return Math.floor(
					(_x+_MAP_SCROLL_POSITION_X-this.initx)
					/this.t);
	}
	getMapY(_y,_debug){
		if(_debug===true){
			console.log('_y:'+_y)
			console.log('_MAP_SCROLL_POSITION_Y:'+_MAP_SCROLL_POSITION_Y)
		}
		return Math.floor(
				((_y+_MAP_SCROLL_POSITION_Y)%1000)
				/this.t);
	}
	isCollisionBit(_bit){
		//衝突ビット判定フラグ
		return (_bit.match(this.collision)!==null);
	}
	isEnemiesBit(_bit){
		//衝突ビット判定フラグ
		return (_bit.match(this.collision_enemies)!==null);
	}
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
		if(_this.mapdef_col[_my]===undefined){return false;}
		if(_this.mapdef_col[_my][_mx]===undefined){return false;}
		if(_this.isCollisionBit(_this.mapdef_col[_my][_mx])){return true;}
		return false;
	}
	setPlayersShotAbleCollision(_mx,_my,_shot){
		let _this=this;
		let _mp=_MAP_THEME[_this.map_theme]._map;
		if(_mp===undefined){return;}
		let _md=_this.mapdef[_my][_mx];
		//_MAP_THEMEで定義したMAPにない場合は終了
		if(_mp[_md]===undefined){return;}
		let _obj=_mp[_md].objs[_mx+','+_my];
		if(_obj===undefined){return;}
		if(_obj.is_able_collision){
			_obj.collision(_shot);
		}

	}
	isPlayersShotCollision(){
		let _this=this;
		//プレーヤーのショットあたり判定
		for(let _i=0;_i<_PLAYERS_SHOTS[_SHOTTYPE].length;_i++){
		let _ps=_PLAYERS_SHOTS[_SHOTTYPE][_i];
		for(let _j=0;_j<_ps.shots.length;_j++){
			let _pss=_ps.shots[_j];
			//ショット中でない場合無視
			if(!_pss._shot_alive){continue;}
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
			//爆発中は無視
			if(_pms._c>0){continue;}
			_pm.map_collition(_pms);
		}//_j
		}//_i

	}//isShotCollision()
	show(){}
	showMapForStageselect(_m){
		//ステージ選択用のマップ表示
		let _this=this;
		if(_m===null||_m===undefined){return;}
		let _m_length=_m._map.length;
		for(let _i=0;_i<((_m_length>20)?20:_m_length);_i++){
		let _ml=_m._map[_i].length;
		for(let _j=0;_j<((_ml>30)?30:_ml);_j++){
			let _k=_m._map[_i][_j+100];
			if(_k===undefined){continue;}
			if(_k==='0'){continue;}
			if(_k.match(_this.collision_enemies)!==null){
				//敵
				let _p=_MAP_THEME[_m._theme]._enemies[_k];
				let img=_p._o.obj;
				//画像サイズは、25x25px
				//ここでは10x10pxに調整
				_CONTEXT.drawImage(
					img,
					50+(_j*10),
					130+(_i*10),
					img.width/2.5,img.height/2.5
				);

			}else{
				//MAP
				let _p=_MAP_THEME[_m._theme]._map[_k];
				let img=_p._o.obj;
				//画像サイズは、25x25px
				//ここでは10x10pxに調整
				_CONTEXT.save();
				_CONTEXT.translate(50+(_j*10),130+(_i*10));
				_CONTEXT.scale(0.25,0.25);
				_CONTEXT.drawImage(
					_p._obj.img,
					_p._obj.imgPos[0],
					0,
					_p._obj.width,
					_p._obj.height,			
					0,
					0,
					_p._obj.width*1.60,//偶然の一致
					_p._obj.height*1.60
				);
				_CONTEXT.restore();
			}
		}//_j
		}//_i
		//はみ出た分を黒でラッピングする
		//エリアは50,130,350,330
		_CONTEXT.fillStyle="rgba(0,0,0,1)";
		_CONTEXT.fillRect(350,130,500,500);
		_CONTEXT.fillRect(50,330,500,500);
//		_CONTEXT.beginPath();
//		_CONTEXT.clearRect(50,130,250,230);
		
	}//showMapForStageselect
	map_draw(){
		//MAPの表示
		let _this=this;
		for(let _i=0;_i<_this.mapdef.length;_i++){
		for(let _j=0;_j<_this.mapdef[_i].length;_j++){
			let _k=_this.mapdef[_i][_j];
			if(!_this.isCollisionBit(_k)){continue;}
			if(_this.x+(_j*_this.t)<-500
				||_this.x+(_j*_this.t)>_CANVAS.width+100){
				//キャンバスからある程度の距離は描画しない
				continue;
			}
			let _p=_MAP_THEME[_this.map_theme]._map[_k];
			_p.objs[_j+','+_i].moveDraw(
				_this.x+(_j*_this.t),
				_this.y+(_i*_this.t));

			if(!_this.map_infinite){continue;}

			//縦スクロールする場合は、スクロールをスムーズに表示させる為、
			//マップを2倍に表示させる。
			_p.objs[_j+','+_i].moveDraw(
				_this.x+(_j*_this.t),
				_this.y+(_i*_this.t)+((_this.y>0)?-1000:1000));

		}//_j
		}//_i
	}
	set_mapdef_col_clear(){
		let _this=this;
		for(let _i=0;_i<_this.mapdef_col.length;_i++){
			let _m=_this.mapdef_col[_i];
			_this.mapdef_col[_i]=_m.replace(/1/ig,'0');
		}
	}
	set_scroll_on_x(){
		let _this=this;
		_BACKGROUND_SPEED=_this.map_background_speed;
	}
	set_scroll_off_x(){
		let _this=this;
		_BACKGROUND_SPEED=0;
	}
	move(){
		let _this=this;

		//MAPからX軸よりCANVAS幅手前に達したらボスを表示させる
		if(_MAP_SCROLL_POSITION_X+_CANVAS.width>
			(_this.mapdef[0].length*_this.t)+_this.initx){
			_this.isboss=true;
		}

		//X軸のMAPを超えたらマップ自体はこれ以上進めない
		if(_MAP_SCROLL_POSITION_X-100>(_this.mapdef[0].length*_this.t)+_this.initx){_BACKGROUND_SPEED=0;}

 		_this.x+=_BACKGROUND_SPEED*-1;
		_MAP_SCROLL_POSITION_X+=_BACKGROUND_SPEED;

		_this.y=_this.getY(_this.y);
//		_this.y-=_this.map_backgroundY_speed;//0<：上にスクロール
//		_this.y%=1000;
//		console.log('MAP.y++++++'+_this.y)
		_MAP_SCROLL_POSITION_Y=(function(){
			//戻す前に式評価させる。
			let _posy=_MAP_SCROLL_POSITION_Y+_this.map_backgroundY_speed;
			if(_posy<0){
				return (1000+_posy)%1000;
			}
			return _posy%1000;
		})();
//		console.log(_MAP_SCROLL_POSITION_Y)
	}
}

//=====================================================
//	gradius_parts_others.js
//	他のパーツ
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

const _PARTS_OTHERS = {
	_pm:new Object(),
	_stageselect:new Object(),
	_score:new Object(),

	_background_ar:new Array(),
	_background_star_max:70,
	_powercapsell_ar:new Array(),

	_reset(){
		let _this = this;
		_this._pm= new Object();
		_this._stageselect= new Object();
//		_this._score= new Object();スコアは永続させる

		_this._background_ar=new Array();
		_this._powercapsell_ar= new Array();
	},
	_init_score(){
		this._score = new GameObject_SCORE();
	},
	_draw_score(){
		this._score.setDrawImage();
	},
	_set_score(_score){
		this._score.set(_score);
	},
	_reset_score() {
		this._score.reset();
	},
	_init_background(){
		let _this = this;
		for (let _i = 0; _i < _this._background_star_max; _i++) {
			_this._background_ar.push(new GameObject_BACKGROUND());
		}
	},
	_move_background(){
		let _this = this;
		_this._background_ar.map((_o)=>{_o.move();});
	},
	_draw_background(){
		let _this = this;
		_this._background_ar.map((_o)=>{_o.setDrawImage();});
	},

	_add_powercapsell(_p){
		if(_p===undefined){return;}
		let _this = this;
		_this._powercapsell_ar.push(new GameObject_POWERCAPSELL(_p.x, _p.y));
	},
	_optimized_powercapsell(){
		let _this = this;
		//パワーカプセル取得済み、またはCANVASからすぎた場合は配列を外す
		_this._powercapsell_ar.map((_o,_i,_ar)=>{
			if(_o.x+_o.width<0||_o.gotpc){_ar.splice(_i,1);}
		});
	},
	_move_powercapsell(){
		let _this = this;
		_this._powercapsell_ar.map((_o)=>{_o.move();});
	},
	_draw_powercapsell() {
		let _this = this;
		_this._powercapsell_ar.map((_o) => {_o.setDrawImage();});
	},
	_set_powercapsell(){
		let _this = this;

		for(let _i=0;_i<_this._powercapsell_ar.length;_i++){
			let _pwc=_this._powercapsell_ar[_i];
			if(_pwc.gotpc){continue;}

			let _pl=_PARTS_PLAYERMAIN._players_obj.getPlayerCenterPosition();
			let _pwc_c=_pwc.getPCCenterPosition();

			let _a=Math.sqrt(
				Math.pow(_pwc_c._x-_pl._x,2)+
				Math.pow(_pwc_c._y-_pl._y,2)
				);
			let _d=Math.sqrt(
				Math.pow(_PARTS_PLAYERMAIN._players_obj.width,2)+
				Math.pow(_PARTS_PLAYERMAIN._players_obj.height,2)
			);

			let _s=(_a<_d/2)?true:false;
			if(!_s){continue;}

			_pwc.getPowerCapcell();
			if(_pwc.type==='red'){
				_POWERMETER.move();
				_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['pc']);
				_PARTS_OTHERS._set_score(_pwc.getscore);
				continue;
			}
			if(_pwc.type==='blue'){
				//CANVAS内の敵を外す
				var _ar=_ENEMIES.concat();
				for(let _i=0;_i<_ar.length;_i++){
					let _e=_ar[_i];
					if(_GAME.isEnemyCanvasOut(_e)){continue;}
					if(_e.isStandBy()){continue;}
					if(!_e.isAbleCollision()){continue;}

					_e._status-=1;
					if(!_e.isalive()){
						_PARTS_OTHERS._set_score(_e.getscore);
						_e.showCollapes();
					}
				}
				//CANVAS内の敵のショットを全て外す
				_ar=_ENEMIES_SHOTS.concat();
				for(let _i=0;_i<_ar.length;_i++){
					let _es=_ar[_i];
					if(_GAME.isEnemyCanvasOut(_es)){continue;}
					_es.init();
				}
				_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['enemy_all_out']);
				continue;
			}
		}
	}
};


class GameObject_PM{
	constructor(){
		let _this=this;
		_this.img=_CANVAS_IMGS['meter'].obj;
		_this.x=(_CANVAS.width/2)-
				(_this.img.width/2);
				_this.y=_CANVAS.height-30;

		_this.meterdef_status='111111';
		_this.meterdef_current='000000';

		_this.meterdef={
			'n_32':{
				func:()=>{
					if(_PARTS_PLAYERMAIN._players_obj.accel>=10){
						_this._set_meter_status();
						return;
					}
					_PARTS_PLAYERMAIN._players_obj.accel+=2;
				}
			},
			'n_16':{
				func:()=>{
					_PARTS_PLAYERMAIN._shot_missle_isalive=true;
					_this._set_meter_status();
				}
		  	},
			'n_8':{
				func:()=>{
					_PARTS_PLAYERMAIN._shot_type=_PARTS_PLAYERMAIN._shot_type_def.DOUBLE;
					_this._set_meter_status();
				}
		  	},
			'n_4':{
				func:()=>{
					_PARTS_PLAYERMAIN._shot_type=_PARTS_PLAYERMAIN._shot_type_def.LASER;
					_this._set_meter_status();
				}
		  	},
			'n_2':{
				func:()=>{
					_PARTS_PLAYERMAIN._option_obj[_PARTS_PLAYERMAIN._option_count].settruealive();
					_PARTS_PLAYERMAIN._option_count++;

					if(_PARTS_PLAYERMAIN._option_count
						<_PARTS_PLAYERMAIN._option_max){return;}
					_this._set_meter_status();
				}
		  	},
			'n_1':{
				func:()=>{
					_PARTS_PLAYERMAIN._players_force_obj.init();
					_this._set_meter_status();
				}
		  	}
		};

		//パワーメータ選択画像
		_this._c_pms=0;//カレントの位置
		_this.pms_img=_CANVAS_IMGS_INIT['gradius_powermeterselect'].obj;
		_this.pms_img_selected=_CANVAS_IMGS_INIT['gradius_powermeterselect_selected'].obj;
		//SPEEDUP〜OPTION選択済定義
		_this.pms_selected=[19,91,163,235];

		//SHIELD選択済定義
		_this._c_pmss=0;//カレントの位置
		_this.pms_img_shield_selected=_CANVAS_IMGS_INIT['gradius_powermeterselect_shield_selected'].obj;
		_this.pmss_selected=[0,100];
	}
	_set_current_reset(){
		this.meterdef_current='000000';
	}
	_set_meter_status(){
		//AND
		let _ms=this.meterdef_status;
		let _mc=(~parseInt(this.meterdef_current,2) >>> 0).toString(2).slice(-6);//符号なし反転し６ビットにする

		this.meterdef_status=
			this._get_bit(
					(parseInt(_ms,2)
						&parseInt(_mc,2)
					).toString(2)
			);

		//DOUBLE、LASERを装備したら、
		//いずれかを有効にする
		let _c=parseInt(this.meterdef_current,2);
		if(_c!==8&&_c!==4){return;}
		this.meterdef_status=
			this._get_bit(
					(parseInt(this.meterdef_status,2)
						|parseInt((_c===8)?'000100':'001000',2)
					).toString(2)
			);
	}
	_set_meter_on(_bit){
		//現在のステータスに強制的にフラグを立てる
		this.meterdef_status=
			this._get_bit(
				(parseInt(this.meterdef_status,2)
					|parseInt(_bit,2)
				).toString(2)
		);	}
	_get_bit(_bit){
		return ('000000'+_bit).slice(-6);
	}
	_get_meter_current(_num){
		return (parseInt(_num,2)===0
				||parseInt(_num,2)===1)
				?'100000'
				:('000000'+
					(parseInt(_num,2)>>1).toString(2)
					).slice(-6);
	}
	move(){
		this.meterdef_current=
			this._get_meter_current(
				this.meterdef_current);
	}
	playerset(){
		//停止中は無視
		if(_DRAW_SETINTERVAL===null){return;}

		let _mc=parseInt(this.meterdef_current,2);
		let _ms=parseInt(this.meterdef_status,2);
		//メーターにアクティブなし
		if(_mc===0){return;}
		//メーターにアクティブあるが、すでに装備ずみ
		if((_mc&_ms)===0){return;}

		//自機のパワーアップ演出
		_PARTS_PLAYERMAIN._players_obj.set_equipped();
		_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['playerset']);
		this.meterdef_status=
			this._get_bit(
					(parseInt(this.meterdef_status,2)
					|parseInt(this.meterdef_current,2)
					).toString(2)
				);
		this.meterdef['n_'+_mc].func();
		this._set_current_reset();
	}
	show(){
		let _this=this;
		//メーターを表示
		//もともと7列の画像なので、
		//表示配置xは36ピクセル右に位置させる。
		_CONTEXT.drawImage(
			_this.img,
			0,0,_this.img.width-71,_this.img.height,
			_this.x+36,
			_this.y,
			_this.img.width-71,
			_this.img.height
		);

		//各ステータスでメーターを上書
		//※装備ずみ
		for(let _i=0;
			_i<this.meterdef_status.length;_i++){
			if(this.meterdef_status[_i]!=='0'){continue;}
			_CONTEXT.drawImage(
				_this.img,
				_this.img.width-72,
				0,
				72,
				_this.img.height,
				_this.x+36+(72*_i),
				_this.y,
				72,
				_this.img.height
			);
		}

		//パワーカプセル取得時のステータス
		let _mc=parseInt(this.meterdef_current,2);
		if(_mc===0){return;}
		let _ms=parseInt(this.meterdef_status,2);

		let _img_e=_CANVAS_IMGS['meter_c'].obj;
		let _e_pos=//カレント中にて位置を取得
			((_mc&_ms)!==0)//装備ステータスで判定
			?72*_this.meterdef_current.indexOf('1')
			:_img_e.width-72;
		_CONTEXT.drawImage(
			_img_e,
			_e_pos,
			0,
			72,
			_img_e.height,
			_this.x+36+(72*_this.meterdef_current.indexOf('1')),
			_this.y,
			72,
			_img_e.height
		);
	}

	pms_disp(){
		_CONTEXT.clearRect(0,0,
			_CANVAS.width,
			_CANVAS.height);

		_GAME._setDrawText(
				'power meter select',
				(_CANVAS.width/2)
					-(36*('power meter select').length/2),
				20,
				0.6
			);

		_GAME._setDrawText(
				'shield select',
				200,
				400,
				0.3
			);

		//センタリングに表示
		_CONTEXT.drawImage(
			this.pms_img,
			(_CANVAS.width/2)-(this.pms_img.width/2),
			70,
			this.pms_img.width,
			this.pms_img.height
		);

		//SHIELD表示
		let _pmss=_CANVAS_IMGS['meter'].obj;
		_CONTEXT.drawImage(
			_pmss,
			360,
			0,
			72,
			19,
			290,
			430,
			72,
			19
		);

		//SHIELD選択表示
		let _pms=_CANVAS_IMGS_INIT['gradius_powermeterselect_shield'].obj;
		_CONTEXT.drawImage(
			_pms,
			470,
			390,
			_pms.width,
			_pms.height
		);

	}
	set_pms_status(_p){
		if(_p===undefined){return;}
		let _this=this;
		let _n = _this._c_pms + _p.num;
		_n=(_n<=0)?0:_n;
		_n=(_n>=_this.pms_selected.length-1)?_this.pms_selected.length-1:_n;
		_this._c_pms = _n;
	}
	set_pmss_status(_p) {
		if(_p===undefined){return;}
		let _this=this;
		let _n = _this._c_pmss + _p.num;
		_n=(_n<=0)?0:_n;
		_n=(_n>=_this.pmss_selected.length-1)?_this.pmss_selected.length-1:_n;
		_this._c_pmss = _n;
	}
	pms_select(){
		let _this=this;
		_this.pms_disp();
		//パワーメータ選択済み
		_CONTEXT.drawImage(
			_this.pms_img_selected,
			0,
			_this.pms_selected[_this._c_pms],
			420,
			74,
			(_CANVAS.width/2)-(_this.pms_img.width/2),
			_this.pms_selected[_this._c_pms]+70,
			420,
			74
		);
		//SHIELDパワーメータ選択済み
		_CONTEXT.drawImage(
			_this.pms_img_shield_selected,
			_this.pmss_selected[_this._c_pmss],
			0,
			85,
			75,
			_this.pmss_selected[_this._c_pmss]+470,
			390,
			85,
			75
		);
	}

}

class GameObject_STAGESELECT{
	constructor(){
		let _this=this;
		_this.mapdef_status=0;
		_this.mapdef=_MAPDEFS[_this.mapdef_status];
	}
	init(){
		this.mapdef=_MAPDEFS[0];
		if(_ISDEBUG){
			//デバッグでは_MAP_PETTERNで終了
			this.mapdef=_MAPDEFS[_MAP_PETTERN];
			return;
		}
		this.disp_thumb_map();
	}
	set_map_status(_p){
		if(_p===undefined){return;}
		let _this=this;
		let _n = _this.mapdef_status + _p.num;
		_n=(_n<=0)?0:_n;
		_n=(_n>=_MAPDEFS.length-1)?_MAPDEFS.length-1:_n;
		_this.mapdef=_MAPDEFS[_n];
		_this.mapdef_status=_n;
	}
	disp_thumb_map(){
		let _this=this;
//		let _map=new GameObject_MAP(0);
		//描画は横は50〜950px
		_CONTEXT.clearRect(0,0,
					_CANVAS.width,
					_CANVAS.height);
		//テキスト表示
		_GAME._setDrawText(
				'stage select',
				(_CANVAS.width/2)
					-(70*0.5*('stage select').length/2),
				20,
				0.6
			);

		//ページングを表示
		let _pl=500-(20*(_MAPDEFS.length/2)+10);//センタリング
		for(let _i=0;_i<_MAPDEFS.length;_i++){
			_CONTEXT.beginPath();
			_CONTEXT.lineWidth=1;
			_CONTEXT.strokeStyle='rgba(255,255,255,1)';
			_CONTEXT.fillStyle='rgba(255,255,255,1)';
			if(_i===this.mapdef_status){
				_CONTEXT.fillRect(_pl+(_i*20),85,10,10);
			}else{
				_CONTEXT.strokeRect(_pl+(_i*20),85,10,10);
			}
		}

		//MAPを表示
		_MAP.mapdef=_this.mapdef._map;
		_MAP.map_theme=_this.mapdef._theme;
		_MAP.mapdef_col=[];
		_MAP.set_gamestart_mapdef_col();
		_MAP.showMapForStageselect(_this.mapdef);

		//テキスト表示
		_GAME._setDrawText('stage title',400,130,0.3);
		_CONTEXT.moveTo(400,160);
		_CONTEXT.lineTo(950,160);
		_CONTEXT.stroke();
		_CONTEXT.font='20px sans-serif';
		let _ar=_GAME._multilineText(_CONTEXT,this.mapdef._title,550);
		for(let _i=0;_i<((_ar.length>2)?2:_ar.length);_i++){
			_CONTEXT.fillText(_ar[_i],400,190+(_i*26));
		}

		_GAME._setDrawText(('difficult:'+this.mapdef._difficult),400,230,0.3);
		_CONTEXT.moveTo(400,260);
		_CONTEXT.lineTo(950,260);
		_CONTEXT.stroke();

		_GAME._setDrawText('detail',400,300,0.3);
		_CONTEXT.moveTo(400,330);
		_CONTEXT.lineTo(950,330);
		_CONTEXT.stroke();
		_ar=_GAME._multilineText(_CONTEXT,this.mapdef._body,520);
		for(let _i=0;_i<((_ar.length>4)?4:_ar.length);_i++){
			_CONTEXT.fillText(_ar[_i],400,360+(_i*30));
		}

	}
}

class GameObject_SCORE{
	constructor(){
		this.score1p=0;
		this.score2p=0;
		this.def_scorehi=57300;
		this.scorehi=this.def_scorehi;
	}
	reset(){
		//1p,2pのスコアを初期化
		this.score1p=0;
		this.score2p=0;
	}
	set(_score){
		this.score1p+=_score;
		if(this.scorehi>=this.score1p){return;}
		this.scorehi=this.score1p;
	}
	setDrawImage(){
		let _img=_CANVAS_IMGS_INIT['font'].obj;
		let _s='1p'+('        '+this.score1p).slice(-8);
		_GAME._setDrawText(_s,180,10,0.3);

		_s='hi'+('        '+this.scorehi).slice(-8);
		_GAME._setDrawText(_s,400,10,0.3);

		_s='2p'+('        '+this.score2p).slice(-8);
		_GAME._setDrawText(_s,620,10,0.3);
	}
}

//パワーカプセルの定義
//※スプライト画像使用
class GameObject_POWERCAPSELL{
	constructor(_x,_y){
		let _this=this;
		_this.x=_x||0;
		_this.y=_y||0;
		_this.getscore=200;
		_this.gotpc=false;
		_this.type=(Math.random()>0.1)
					?'red'
					:'blue';
		_this._c=0;
		//アニメーション定義
		_this.ani=[0,25,50,75];
		_this.img=_CANVAS_IMGS['gradius_pc'].obj;
		_this.width=25;
		_this.height=23;
	}
	getPCCenterPosition(){
		let _this=this;
		//スプライト画像のため1コマ（正方形）
		return {_x:_this.x+(_this.width/2),
				_y:_this.y+(_this.height/2)}
	}
	getPowerCapcell(){this.gotpc=true;}
	setDrawImage(){
		let _this=this;
		_GAME._setDrawImage({
			img:_this.img,
			x:_this.x,
			y:_this.y,
			imgPosx:_this.ani[parseInt(_this._c/5)]+((_this.type==='blue')?100:0),
			width:_this.width,
			height:_this.height,
			basePoint:1
		});
	}
	move(){
		let _this=this;
		//すでにパワーカプセル取得済みは終了
		if(_this.gotpc){return;}
		_this.x=_MAP.getX(_this.x);
		_this.y=_MAP.getY(_this.y);
		
		_this._c=(_this._c>=(_this.ani.length*5)-1)?0:_this._c+1;
	}
}


class GameObject_BACKGROUND{
	constructor(){
		this.x=_CANVAS.width*Math.random();
		this.y=_CANVAS.height*Math.random();
		this.rgb=parseInt(Math.random()*255)+","+
				parseInt(Math.random()*255)+","+
				parseInt(Math.random()*255);
		this.speed=Math.random()*5;

		this._c=parseInt(Math.random()*200);
		this._ar_alpha=[0.0,0.2,0.4,0.6,0.8,1.0,0.8,0.6,0.4,0.2];
		this._r=Math.random()+1;
	}
	setDrawImage(){
		let _this = this;
		_CONTEXT.beginPath();
		_CONTEXT.arc(_this.x, _this.y, _this._r, 0, Math.PI * 2, true);
		_CONTEXT.fillStyle = 'rgba(' + _this.rgb + ',' + _this._ar_alpha[parseInt(_this._c / 20)] + ')';
		_CONTEXT.fill();
	}
	move(){
		let _this = this;
		_this.x=(_this.x<0)
					?_CANVAS.width
					:_this.x;
		_this.x-=(_BACKGROUND_SPEED===0)
					?0
					:_this.speed;

		_this._c=(_this._c>=200-1)?0:_this._c+1;
	}
}
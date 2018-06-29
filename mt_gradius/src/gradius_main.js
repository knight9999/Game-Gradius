//=====================================================
//	gradius_main.js
//	全体処理
//	※デバッグモードはURLパラメータをつかう
//		debug:（true/false）:デバッグモード有無
//		mp:（数値）:debug有効時、デバッグしたいマップの配列要素（0スタート）
//		ed:（数値）:debug有効時、敵難易度（0スタート）
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

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
		_GAME._setPlay(_CANVAS_AUDIOS['playerset']);
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
	init(){
		//1p,2pのスコアを初期化
		this.score1p=0;
		this.score2p=0;
	}
	set(_score){
		this.score1p+=_score;
		if(this.scorehi>=this.score1p){return;}
		this.scorehi=this.score1p;
	}
	show(){
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
	move(){
		let _this=this;
		_this.x=(_this.x<0)
					?_CANVAS.width
					:_this.x;
		_this.x-=(_BACKGROUND_SPEED===0)
					?0
					:_this.speed;

		const alpha=_this._ar_alpha[parseInt(_this._c/20)];
		_CONTEXT.beginPath();
        _CONTEXT.arc(_this.x,_this.y,_this._r,0,Math.PI*2,true);
		_CONTEXT.fillStyle='rgba('+_this.rgb+','+alpha+')';
		_CONTEXT.fill();

		_this._c=(_this._c>=200-1)?0:_this._c+1;
	}
}

//自機とパワーカプセルの取得
const _IS_GET_POWERCAPSELL=()=>{
//	if(!_PARTS_PLAYERMAIN._players_obj.isalive()){return;}
	for(let _i=0;_i<_POWERCAPSELLS.length;_i++){
		if(_POWERCAPSELLS[_i].gotpc){
			_POWERCAPSELLS.splice(_i,1);
		}
	}

	for(let _i=0;_i<_POWERCAPSELLS.length;_i++){
		let _pwc=_POWERCAPSELLS[_i];
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
			_GAME._setPlay(_CANVAS_AUDIOS['pc']);
			_SCORE.set(_pwc.getscore);
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
					_SCORE.set(_e.getscore);
					_e.showCollapes();
				}
//				_e.collision();
			}
			//CANVAS内の敵のショットを全て外す
			_ar=_ENEMIES_SHOTS.concat();
			for(let _i=0;_i<_ar.length;_i++){
				let _es=_ar[_i];
				if(_GAME.isEnemyCanvasOut(_es)){continue;}
				_es.init();
			}
			_GAME._setPlay(_CANVAS_AUDIOS['enemy_all_out']);
			continue;
		}
	}
}

//自機ショット、また自機と敵による衝突判定
const _IS_ENEMIES_COLLISION=()=>{
	for(let _i=0;_i<_ENEMIES.length;_i++){
		//非表示・かつ生存してない場合は、要素から外す
		if(!_ENEMIES[_i].isshow()
			&&!_ENEMIES[_i].isalive()){
			_ENEMIES.splice(_i,1);
		}
	}

	//レーザーで自機、オプションにて、
	//最大の衝突位置を取得させる
//	let _shottype_lasers_col_max=[];
	_PARTS_PLAYERMAIN._enemy_collision(_ENEMIES);
}

//敵ショットによる衝突判定
const _IS_ENEMIES_SHOT_COLLISION=()=>{
	for(let _i=0;_i<_ENEMIES_SHOTS.length;_i++){
		//非表示・かつ生存してない場合は、要素から外す
		if(!_ENEMIES_SHOTS[_i].isshow()){
			_ENEMIES_SHOTS.splice(_i,1);
		}
	}

	_PARTS_PLAYERMAIN._enemy_shot_collision(_ENEMIES_SHOTS);
}

//===========================================
//	_DRAW系の処理
//	以下の処理に統一させる
//	・イベントリスナのクリア
//	・requestAnimationFrameの管理
//===========================================
const _DRAW=()=>{
	_KEYEVENT_MASTER.addKeydownGame();
	_KEYEVENT_MASTER.addKeyupGame();

	const _loop=()=>{
		_DRAW_SETINTERVAL=window.requestAnimationFrame(_loop);		
		_CONTEXT.clearRect(0,0,
					_CANVAS.width,
					_CANVAS.height);

		//以下は大体のシーケンス
		//・移動設定
		//・衝突判定
		//・表示

		//BACKGROUNDを表示
		for(let _i=0;_i<_BACKGROUND_STAR_MAX;_i++){
			_BACKGROUND[_i].move();
		}
		// console.log('2:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
		//敵の弾を表示
		for(let _i=0;_i<_ENEMIES_SHOTS.length;_i++){
			if(_PARTS_PLAYERMAIN._players_obj.isalive()){_ENEMIES_SHOTS[_i].move();}
			_ENEMIES_SHOTS[_i].setDrawImage();
		}
		// console.log('3:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)

		//MAP位置と敵の表示はこのシーケンス
		//※モアイ破壊後のMAP衝突がうまく調整できなくなる
		//MAP位置設定
		if(_PARTS_PLAYERMAIN._players_obj.isalive()){_MAP.move();}
		//敵を表示
		for(let _i=0;_i<_ENEMIES.length;_i++){
			if(_ENEMIES[_i]===undefined){continue;}
			if(_PARTS_PLAYERMAIN._players_obj.isalive()){_ENEMIES[_i].move();}
			_ENEMIES[_i].setDrawImage();
		}
		// console.log('4:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
		// console.log('5:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
 
//		console.log('t')
		//パワーカプセルを表示
		for(let _i=0;_i<_POWERCAPSELLS.length;_i++){
			if(_PARTS_PLAYERMAIN._players_obj.isalive()){_POWERCAPSELLS[_i].move();}
			_POWERCAPSELLS[_i].setDrawImage();
		}

		//敵衝突表示の移動・表示調整
		for(let _i=0;_i<_ENEMIES_COLLISIONS.length;_i++){
			if(_PARTS_PLAYERMAIN._players_obj.isalive()){_ENEMIES_COLLISIONS[_i].move();}
			_ENEMIES_COLLISIONS[_i].setDrawImage();
		}

		if(_PARTS_PLAYERMAIN._players_obj.isalive()){
			_IS_GET_POWERCAPSELL();
			// console.log('6:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
			//敵、衝突判定
			_IS_ENEMIES_SHOT_COLLISION();
			// console.log('7:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
			_IS_ENEMIES_COLLISION();
			// console.log('8:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
			//MAP（自機ショット衝突判定）
			_MAP.isPlayersShotCollision();
			// console.log('9:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
			//敵、衝突表示
			_DRAW_ENEMIES_COLLISIONS();
			// console.log('10:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
		}

		//ショットの移動調整
		_PARTS_PLAYERMAIN._move_shots();
		//ショットを表示
		_PARTS_PLAYERMAIN._draw_shots();
		// console.log('11:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)

		//自機からひもづくオプションを移動・表示
		_PARTS_PLAYERMAIN._draw_option();
		// console.log('12:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
		//自機移動
		_PARTS_PLAYERMAIN._move_players();
		//自機移動分配列をセット
		_PARTS_PLAYERMAIN._set_move_draw();
		//自機表示
		_PARTS_PLAYERMAIN._draw_players();
		// console.log('13:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
		//MAP表示設定
		_MAP.map_draw();

		//DRAW POWER METERを表示
		_POWERMETER.show();
		//SCOREを表示
//		console.log('score show');
		_SCORE.show();

		//自機のステータスが0になった時
		if(!_PARTS_PLAYERMAIN._players_obj.isalive()){
			//その後_DRAW_GAMEOVER();
			//により_DRAW()から抜ける
			_DRAW_PLAYER_COLLAPES();
			return;			
		}
		
		// if(_MAP_SCROLL_POSITION_X-100<=
		// 	(_MAP.mapdef[0].length*_MAP.t)+_MAP.initx){return;}
		//一定距離を達するまでボスを登場させない
		if(!_MAP.isboss){return;}
		//MATCH_BOSS
		_DRAW_MATCH_BOSS();

	};

	_DRAW_SETINTERVAL=window.requestAnimationFrame(_loop);
}

const _DRAW_MATCH_BOSS=()=>{
	//ボスの登場→表示→終了処理
	if(!_DRAW_IS_MATCH_BOSS){
		if(_MAP.map_boss===''
			||_MAP.map_boss===undefined
			||_MAP_ENEMIES_BOSS[_MAP.map_boss]===undefined){
			_DRAW_GAMECLEAR();
		}
		//ここでY軸の動作を無効にさせる
		_MAP.setBackGroundSpeedY(0);
		_MAP.setInifinite(false);
		//ボス登場後の1回処理
		_DRAW_SCROLL_STOP();
		_ENEMIES=[];
		_ENEMIES_SHOTS=[];
		_ENEMIES.push(
			_MAP_ENEMIES_BOSS[_MAP.map_boss]._f()
		);
		_DRAW_IS_MATCH_BOSS=true;
		_GAME._setPlayOnBG(_CANVAS_AUDIOS['bg_boss']);
		
		return;
	}

	//================================
	//ボスがもつ_statusが全て0だった場合に
	//ゲームクリアとなる。
	//================================
	let _bit='';
	for(let _i=0;_i<_ENEMIES.length;_i++){
		_bit+=((_ENEMIES[_i].isalive())?'0':'1');
	}
	if(_bit.indexOf('0')!==-1){return;}
	if(_DRAW_IS_MATCH_BOSS_COUNT>100){
		//GAMECLEAR
		_DRAW_GAMECLEAR();
		_DRAW_SCROLL_RESUME();
	}else{
		_DRAW_IS_MATCH_BOSS_COUNT++;
	}
}
const _DRAW_PLAYER_COLLAPES=()=>{
	//クラッシュした瞬間にキーを無効にする
	_KEYEVENT_MASTER.removeKeydownGame();
	_KEYEVENT_MASTER.removeKeyupGame();

	_GAME._setStopOnBG();
	_DRAW_STOP_PLAYERS_SHOTS();
	_DRAW_SCROLL_STOP();

	if (_PARTS_PLAYERMAIN._is_finished_player_collision){
		//アニメーションが終わったら終了
		_DRAW_STOP();
		_DRAW_GAMEOVER();
		return;
	}

	_PARTS_PLAYERMAIN._draw_player_collision();
}

//長押判定用変数
let _DRAW_PLAYERS_SHOTS_TIMES=0;
//自機ショット処理の本体
//自機ショットのコントロール
//ボタン押下による、長押判定とショット処理を開始させる
const _DRAW_PLAYERS_SHOTS=()=>{
	if(_DRAW_SETINTERVAL===null){return;}
	if(_PLAYERS_SHOTS_SETINTERVAL!==null){return;}

	let _date=new Date();
	_DRAW_PLAYERS_SHOTS_TIMES=0;
	const _loop=()=>{
		_PLAYERS_SHOTS_SETINTERVAL=window.requestAnimationFrame(_loop);
		_DRAW_PLAYERS_SHOTS_TIMES=
			(_DRAW_PLAYERS_SHOTS_TIMES>10)
				?_DRAW_PLAYERS_SHOTS_TIMES
				:_DRAW_PLAYERS_SHOTS_TIMES+1;
//		console.log(_DRAW_PLAYERS_SHOTS_TIMES);
		//スペースキーによる押しボタンの調整
		//指定数字はおおよその値
		if(_DRAW_PLAYERS_SHOTS_TIMES>=10){
			//長押しは時間間隔で連射調整させる
//			console.log('long!');
			let _d=new Date();
			if(_d-_date<50){return;}
			_date=new Date();
			//ショット
		}else{
			//短押しは最初のタイミングのみ発射させる
			if(_DRAW_PLAYERS_SHOTS_TIMES!==1){return;}
//			console.log('shot!');
		}
		//ショットさせる
		_PARTS_PLAYERMAIN._start_shots();
		_PARTS_PLAYERMAIN._start_missile_shots();
	}//_loop
	_PLAYERS_SHOTS_SETINTERVAL=window.requestAnimationFrame(_loop);	
}

//自機ショットのコントロール
//ボタンを離して、ショット処理をクリアさせる。
const _DRAW_STOP_PLAYERS_SHOTS=()=>{
	window.cancelAnimationFrame(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;
	_PARTS_PLAYERMAIN._stop_shots();
	_PARTS_PLAYERMAIN._stop_missile_shots();
}

const _DRAW_STOP=()=>{
	window.cancelAnimationFrame(_DRAW_SETINTERVAL);
	_DRAW_SETINTERVAL=null;
}
const _DRAW_STOP_GAMESTART=()=>{
	window.cancelAnimationFrame(_DRAW_GAMESTART_SETINTERVAL);
	_DRAW_GAMESTART_SETINTERVAL=null;
}

const _DRAW_SELECT_POWERMETER=()=>{
	_DRAW_STOP_PLAYERS_SHOTS();
	_KEYEVENT_MASTER.removeKeydownSelectPowermeter();
	let _c=0;
	let _si=null;
	const _loop=()=>{
		_si=window.requestAnimationFrame(_loop);		
		_CONTEXT.clearRect(0,0,
			_CANVAS.width,
			_CANVAS.height);
		_POWERMETER.pms_disp();
		if(_c%5===0){
			_POWERMETER.pms_select();
		}
		if(_c>40){
			_PLAYERS_POWER_METER=_POWERMETER._c_pms;
			_PLAYERS_POWER_METER_SHIELD=_POWERMETER._c_pmss;
			window.cancelAnimationFrame(_si);			
			_DRAW_INIT_OBJECT();
		}
		_c++;
	};
	_si=window.requestAnimationFrame(_loop);
}

const _DRAW_GAMESTART=()=>{
	_KEYEVENT_MASTER.removeKeydownGame();
	_KEYEVENT_MASTER.removeKeyupGame();

	//BACKGROUND
	for (let _i = 0; _i < _BACKGROUND_STAR_MAX; _i++) {
		_BACKGROUND[_i] = new GameObject_BACKGROUND();
	}
	//MAP
	_MAP.set_gamestart();


	if(_ISDEBUG){_DRAW();return;}
	let _c=0;
	const _loop=()=>{
		_DRAW_GAMESTART_SETINTERVAL=window.requestAnimationFrame(_loop);
		//	_DRAW_GAMESTART_SETINTERVAL=setInterval(function(){
		if(_c>250){
			_DRAW_STOP_GAMESTART();
			_GAME._setPlayOnBG(_CANVAS_AUDIOS['bg_'+_MAP.map_bgmusic]);			
			_DRAW();
			return;
		}
		_CONTEXT.clearRect(0,0,
					_CANVAS.width,
					_CANVAS.height);

		//BACKGROUND
		for(let _i=0;_i<_BACKGROUND_STAR_MAX;_i++){
			_BACKGROUND[_i].move();
		}

		//DRAW POWER METER
		_POWERMETER.show();
		//SCORE
		_SCORE.show();

		if(parseInt(_c/50)%2!==0){

		}else{
			let _txt='start';
			_GAME._setDrawText(
				_txt,
				(_CANVAS.width/2)-(60*_txt.length/2),
				(_CANVAS.height/2)-(60/2)-20,
				1.0);
		}
		_c++;
	};
	_DRAW_GAMESTART_SETINTERVAL=window.requestAnimationFrame(_loop);
	_GAME._setStopOnBG();
}

const _DRAW_GAMECLEAR=()=>{
	var _img=_CANVAS_IMGS_INIT['font'].obj;
	//クリアしたら敵を全て消す
	let _s='gameclear';
	_GAME._setDrawText(
		_s,
		(_CANVAS.width/2)-(60*_s.length/2),
		(_CANVAS.height/2)-(60/2)-40,
		1.0);

	_s='press r to restart';
	_GAME._setDrawText(
			_s,
			(_CANVAS.width/2)
	 			-(18*_s.length/2),
			(_CANVAS.height/2)+30,
			0.3
		);
	_s='press s to change to another stage';
	_GAME._setDrawText(
			_s,
			(_CANVAS.width/2)
	 			-(18*_s.length/2),
			(_CANVAS.height/2)+60,
			0.3
		);
	_DRAW_IS_GAMECLEAR=true;

}

const _DRAW_GAMEOVER=()=>{
	_KEYEVENT_MASTER.removeKeydownGame();
	_KEYEVENT_MASTER.removeKeyupGame();

	_DRAW_STOP();

	_KEYEVENT_MASTER.addKeydownGameover();
	_CONTEXT.clearRect(0,0,
				_CANVAS.width,
				_CANVAS.height);

	//BACKGROUNDを表示
	for(let _i=0;_i<_BACKGROUND_STAR_MAX;_i++){
		_BACKGROUND[_i].move();
	}
	//DRAW POWER METERを表示
	_POWERMETER.show();
	//SCOREを表示
//		console.log('score show');
	_SCORE.show();

//	console.log('gameover');
	let _s='gameover';
	_GAME._setDrawText(
		_s,
		(_CANVAS.width/2)-(60*_s.length/2),
		(_CANVAS.height/2)-(60/2)-40,
		1.0);

	_s='press r to restart';
	_GAME._setDrawText(
			_s,
			(_CANVAS.width/2)
				-(18*_s.length/2),
			(_CANVAS.height/2)+30,
			0.3
		);
	_s='press s to change to another stage';
	_GAME._setDrawText(
			_s,
			(_CANVAS.width/2)
				-(18*_s.length/2),
			(_CANVAS.height/2)+60,
			0.3
		);

}// _DRAW_GAMEOVER

//敵衝突表示
const _DRAW_ENEMIES_COLLISIONS=()=>{
	for(let _i=0;_i<_ENEMIES_COLLISIONS.length;_i++){
		if(!_ENEMIES_COLLISIONS[_i].isalive()){
			_ENEMIES_COLLISIONS.splice(_i,1);
		}
	}

}//_DRAW_ENEMIES_COLLISIONS

const _DRAW_SCROLL_STOP=()=>{
	_MAP.set_scroll_off_x();
}
const _DRAW_SCROLL_RESUME=()=>{
	_MAP.set_scroll_on_x();
}

const _DRAW_RESET_OBJECT=()=>{
	//ゲームリセット
	_KEYEVENT_MASTER.removeKeydownGame();
	_KEYEVENT_MASTER.removeKeyupGame();
	_KEYEVENT_MASTER.removeKeydownGameover();

	window.cancelAnimationFrame(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;
	_DRAW_STOP();

	_CONTEXT.clearRect(0,0,
				_CANVAS.width,
				_CANVAS.height);

	_PARTS_PLAYERMAIN._reset();

	_ENEMIES=[];
	_ENEMIES_SHOTS=[];
	_ENEMIES_COLLISIONS=[];
	_POWERMETER='';

	_POWERCAPSELLS=[];

	_MAP_SCROLL_POSITION_X=0;
	_MAP_SCROLL_POSITION_Y=0;

	_DRAW_IS_MATCH_BOSS=false;
	_DRAW_IS_MATCH_BOSS_COUNT=0;
}

const _DRAW_INIT_OBJECT=()=>{
	//パワーメータイベント削除
	_KEYEVENT_MASTER.removeKeydownSelectPowermeter();

	//自機の初期設定
	_PARTS_PLAYERMAIN._init_players_obj(_PLAYERS_POWER_METER);
	//フォースフィールドの初期設定
	_PARTS_PLAYERMAIN._init_players_force_obj(_PLAYERS_POWER_METER);
	//OPTIONの初期設定
	_PARTS_PLAYERMAIN._init_option_obj(_PLAYERS_POWER_METER);
 
	//METER
	_POWERMETER=new GameObject_PM();
	//SCORE
	if(!_DRAW_IS_GAMECLEAR){
		//クリアしていなければスコアをリセット
		_SCORE.init();
	}
	_DRAW_IS_GAMECLEAR=false;

	_DRAW_GAMESTART();
}

const _DRAW_POWER_METER_SELECT=()=>{
	cancelAnimationFrame(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;

	_CONTEXT.clearRect(0,0,
				_CANVAS.width,
				_CANVAS.height);

	_KEYEVENT_MASTER.removeKeydownSelectStage();
	_KEYEVENT_MASTER.addKeydownSelectPowermeter();

	_POWERMETER=new	GameObject_PM();
	_POWERMETER.pms_disp();
	_POWERMETER.pms_select();
}

const _DRAW_STAGE_SELECT=()=>{
	cancelAnimationFrame(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;

	_CONTEXT.clearRect(0,0,
				_CANVAS.width,
				_CANVAS.height);

	let _gsw=document
	  		.querySelector('#game_start_wrapper');
 	let _gw=document
			.querySelector('#game_wrapper');
	_gsw.classList.remove('on');
	_gw.classList.add('on');
	_KEYEVENT_MASTER.removeKeydownStart();
	_KEYEVENT_MASTER.removeKeydownGame();
	_KEYEVENT_MASTER.removeKeyupGame();
	_KEYEVENT_MASTER.removeKeydownGameover();

	_STAGESELECT=new GameObject_STAGESELECT();
	_STAGESELECT.init();
	_KEYEVENT_MASTER.addKeydownSelectStage();
	_GAME._setPlayOnBG(_CANVAS_AUDIOS['bg_powermeterselect']);
}

const _DRAW_AUDIO_INIT=(_obj)=>{
	return new Promise((_res, _rej)=>{
	let _audioLoadedCount=0;
	let _gsl_r=document.querySelector('#game_start_loading .rate');
	
	for(let _i in _obj){
		let _r=new XMLHttpRequest();
		_r.open('GET',_obj[_i].src,true);
		_r.responseType='arraybuffer'; //ArrayBufferとしてロード
		_r.onload=function(){
			// contextにArrayBufferを渡し、decodeさせる
			_AUDIO_CONTEXT.decodeAudioData(
				_r.response,
				function(_buf){
					_obj[_i].buf=_buf;
					_audioLoadedCount++;
					if(_audioLoadedCount>=Object.keys(_obj).length){
						_res();
						return;
					}
					//ローディングに進捗率を表示させる
					_gsl_r.innerHTML=parseInt(_audioLoadedCount/Object.keys(_obj).length*100)+'%';
				},
				function(_error){
					alert('一部音声読み込みに失敗しました。再度立ち上げなおしてください:'+_error);
					_rej();
					return;
				});
		};
		_r.send();
	}
	});//promise
}
const _DRAW_INIT=(_obj)=>{
	return new Promise((_res,_rej)=>{
	let _imgLoadedCount=0;
	let _alertFlag=false;
	for(let _i in _obj){
		let _o=_obj[_i];
		_o.obj.src=_obj[_i].src;
		_o.obj.onload=function(){
			_o.obj.width*=_o.rate;
			_o.obj.height*=_o.rate;
			_imgLoadedCount++;
			if(_imgLoadedCount>=Object.keys(_obj).length){
				_res();
				return;
			}
			let _s=parseInt(_imgLoadedCount/Object.keys(_obj).length*100);
			//ローディングに進捗率を表示させる
			_GAME._setTextToFont(
				document.querySelector('#game_start>.text_loading'),
				 'now loading '+_s+' per',30);
		}
		_o.obj.onabort=function(){
			_rej();
			return;
		}
		_o.obj.onerror=function(){
			if(_alertFlag){return;}
			_alertFlag=true;
			alert('一部画像読み込みに失敗しました。再度立ち上げなおしてください');
			_rej();
			return;
		}
	}
	});//promise
}


//===================================================
//	JAVASCRIPT START
//===================================================
window.addEventListener('load',()=>{
	_CANVAS=document.getElementById('game');
	_CONTEXT=_CANVAS.getContext('2d');
	_AUDIO_CONTEXT=new(window.AudioContext||window.webkitAudioContext)();

	//URLからパラメータを取得
	_GAME.setUrlParams();
	//以下パラメータからデバッグモードを設定
	_ISDEBUG=(_GAME._url_params['debug']==='true')?true:false;
	_MAP_PETTERN=_GAME._url_params['mp']||0;
	_ENEMY_DIFFICULT=_GAME._url_params['ed']||0;

	if(_ISSP){
		document.querySelector('body').classList.add('sp');
	}
	_DRAW_AUDIO_INIT(_CANVAS_AUDIOS)
	.then(()=>{
		_DRAW_INIT(_CANVAS_IMGS_INIT);
	}).then(()=>{
		_PARTS_PLAYERMAIN._set_shot_type('_SHOTTYPE_NORMAL');
		_SCORE = new GameObject_SCORE();
		_MAP = new GameObject_MAP();
		_MAP.init();
	}).then(()=>{
		let _gsl = document.querySelector('#game_start_loading');
		_gsl.classList.remove('on');

		//SPのみコントローラーのオブジェクトを取得
		if (_ISSP) {
			let _spc = document.querySelector('#sp_controller');
			_spc.classList.add('on');
			_SP_CONTROLLER._set_obj();
		}

		if (_ISDEBUG) {
			let _gw = document.querySelector('#game_wrapper');
			_gw.classList.add('on');

			_STAGESELECT = new GameObject_STAGESELECT();
			_STAGESELECT.init();

			_MAP.set_stage_map_pattern(_MAP_PETTERN);

			_DRAW_INIT(_CANVAS_IMGS).then(() => {
				_DRAW_POWER_METER_SELECT();
			});

			return;
		}

		//スタート画面表示
		_KEYEVENT_MASTER.addKeydownStart();
		let _gsw = document.querySelector('#game_start_wrapper');
		_gsw.classList.add('on');

		_GAME._setTextToFont(
			document.querySelector('#game_start>.title'),
			'no pakuri', 50);
		_GAME._setTextToFont(
			document.querySelector('#game_start>.text'),
			'press s to start', 30);
		_GAME._setTextToFont(
			document.querySelector('#game_start>.text_loading'),
			'now loading', 30);

	});
//	_DRAW_AUDIO_INIT(_CANVAS_AUDIOS);

});

//touchmoveブラウザのスクロールを停止
window.addEventListener('touchmove',function(e){
    e.preventDefault();
},{passive: false});

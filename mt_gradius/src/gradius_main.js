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

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
	_GAME_AUDIO._setPlayOnBG(_GAME_AUDIO._audio_now_obj_bg);

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
		_PARTS_OTHERS._move_background();
		_PARTS_OTHERS._draw_background();

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
		_PARTS_OTHERS._optimized_powercapsell();
		_PARTS_OTHERS._set_powercapsell();
		if(_PARTS_PLAYERMAIN._players_obj.isalive()){
			_PARTS_OTHERS._move_powercapsell();
		}
		_PARTS_OTHERS._draw_powercapsell();


		//敵衝突表示の移動・表示調整
		for(let _i=0;_i<_ENEMIES_COLLISIONS.length;_i++){
			if(_PARTS_PLAYERMAIN._players_obj.isalive()){_ENEMIES_COLLISIONS[_i].move();}
			_ENEMIES_COLLISIONS[_i].setDrawImage();
		}

		if(_PARTS_PLAYERMAIN._players_obj.isalive()){
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
		_PARTS_OTHERS._draw_score();

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
		_GAME_AUDIO._setPlayOnBG(_CANVAS_AUDIOS['bg_boss']);
		
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

	_GAME_AUDIO._setStopOnBG();
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
	_GAME_AUDIO._setStopOnBG();
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
	_PARTS_OTHERS._init_background();
	//MAP
	_MAP.set_gamestart();

	if(_ISDEBUG){_DRAW();return;}
	let _c=0;
	const _loop=()=>{
		_DRAW_GAMESTART_SETINTERVAL=window.requestAnimationFrame(_loop);
		//	_DRAW_GAMESTART_SETINTERVAL=setInterval(function(){
		if(_c>250){
			_DRAW_STOP_GAMESTART();
			_GAME_AUDIO._setPlayOnBG(_CANVAS_AUDIOS['bg_'+_MAP.map_bgmusic]);			
			_DRAW();
			return;
		}
		_CONTEXT.clearRect(0,0,
					_CANVAS.width,
					_CANVAS.height);

		//BACKGROUND
		_PARTS_OTHERS._move_background();
		_PARTS_OTHERS._draw_background();

		//DRAW POWER METER
		_POWERMETER.show();
		//SCORE
		_PARTS_OTHERS._draw_score();

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
	_GAME_AUDIO._setStopOnBG();
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
	_PARTS_OTHERS._draw_background();

	//DRAW POWER METERを表示
	_POWERMETER.show();
	//SCOREを表示
	_PARTS_OTHERS._draw_score();

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

	_PARTS_OTHERS._reset();

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
		_PARTS_OTHERS._reset_score();
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
	_GAME_AUDIO._setPlayOnBG(_CANVAS_AUDIOS['bg_powermeterselect']);
}

const _DRAW_AUDIO_INIT=(_obj)=>{
	return new Promise((_res, _rej)=>{	
	_GAME_AUDIO._init_audios(
		_obj,(_n)=>{
			//進捗中処理
			document.querySelector('#game_start_loading .rate').innerHTML = parseInt(_n) + '%';
		})
		.then(()=>{_res();},()=>{_rej();});
	});
}
const _DRAW_IMG_INIT=(_obj)=>{
	return new Promise((_res,_rej)=>{
	_GAME_IMG._init_imgs(
		_obj,(_n)=>{
			//進捗中処理
			_GAME._setTextToFont(
				document.querySelector('#game_start>.text_loading'),
				'now loading ' + _n + ' per', 30);
		})
		.then(()=>{_res();},()=>{_rej();});
	});
}


//===================================================
//	JAVASCRIPT START
//===================================================
window.addEventListener('load',()=>{
	_CANVAS=document.getElementById('game');
	_CONTEXT=_CANVAS.getContext('2d');
	_GAME_AUDIO._init();

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
		_DRAW_IMG_INIT(_CANVAS_IMGS_INIT);
	}).then(()=>{
		_PARTS_PLAYERMAIN._set_shot_type('_SHOTTYPE_NORMAL');
		_PARTS_OTHERS._init_score();
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

			_DRAW_IMG_INIT(_CANVAS_IMGS).then(() => {
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

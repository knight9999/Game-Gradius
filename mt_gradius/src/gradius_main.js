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

let _DRAW_SETINTERVAL = null;

let _DRAW_OPENING_SETINTERVAL = null;
let _DRAW_GAMESTART_SETINTERVAL = null;

let _DRAW_IS_GAMECLEAR = false; //GameClearフラグ


const _IS_DRAW_STOP=()=>{
	return (_DRAW_SETINTERVAL === null);
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

		//MAPオブジェクトの最適化、移動
		if (_PARTS_PLAYERMAIN._players_obj.isalive()) {
			_PARTS_MAP._move_maps();
		}

		//MAP位置と敵の表示はこのシーケンス
		//※モアイ破壊後のMAP衝突がうまく調整できなくなる
		//MAP位置設定
		if(_PARTS_PLAYERMAIN._players_obj.isalive()){_MAP.move();}

		//パワーカプセル設定
		_PARTS_OTHERS._set_powercapsell();

		//敵を表示
		for(let _i=0;_i<_ENEMIES.length;_i++){
			if(_ENEMIES[_i]===undefined){continue;}
			if(_PARTS_PLAYERMAIN._players_obj.isalive()){_ENEMIES[_i].move();}
			_ENEMIES[_i].setDrawImage();
		}
		// console.log('4:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
		// console.log('5:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
 
//		console.log('t')

		if(_PARTS_PLAYERMAIN._players_obj.isalive()){
			_GET_DIFFICULT_LEVEL();
			//パワーカプセルの移動
			_PARTS_OTHERS._move_powercapsell();
			//敵、衝突判定
			_PARTS_PLAYERMAIN._enemy_shot_collision(_ENEMIES_SHOTS);
			_PARTS_PLAYERMAIN._enemy_collision(_ENEMIES);
			// console.log('7:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
			// console.log('8:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
			//MAP（自機ショット衝突判定）
			_MAP.isPlayersShotCollision();
			// console.log('9:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
			//敵、衝突移動
			_ENEMIES_CONTROL._move_collisions();
			// console.log('10:'+_PARTS_PLAYERMAIN._shots.shot._PARTS_PLAYERMAIN._shot_type_def.LASER[0].shots[0]._laser_MaxX)
		}
		//ショットの移動調整
		_PARTS_PLAYERMAIN._move_shots();
		//パワーカプセルを表示
		_PARTS_OTHERS._draw_powercapsell();
		//敵衝突表示の表示調整
		_ENEMIES_CONTROL._draw_collisions();
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
		_PARTS_MAP._draw_maps();

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
		
		//所定条件に達したらボス戦を表示させる
		_DRAW_MATCH_BOSS();
	};

	_DRAW_SETINTERVAL=window.requestAnimationFrame(_loop);
}

let _DRAW_IS_MATCH_BOSS_SET = false;
let _DRAW_IS_MATCH_BOSS_COUNT = 0;
let _DRAW_IS_MATCH_BOSS_MOVEX = false;
let _DRAW_MATCH_BOSS_CLEAR_COUNT = 0;//クリアしたカウント
let _DRAW_MATCH_BOSS_COUNT = 0;//対戦中のカウント
let _DRAW_MATCH_BOSS_MOVEX_COUNT = 0;//移動カウント
let _DRAW_MATCH_BOSS_OBJ = new Object();//オブジェクト
const _DRAW_MATCH_BOSS=()=>{
	//一定距離を達するまでボスを登場させない
	if (!_MAP.isboss) {return;}

	//全てのボスを倒したらゲームクリア
	if (_MAP.isMapGameClear()) {
		_DRAW_GAMECLEAR();
		return;
	}

	if (_DRAW_MATCH_BOSS_CLEAR_COUNT >= _MAP.get_ememies_boss().length) {
		_DRAW_GAMECLEAR();
		return;
	}

	//ボス登場時のセット
	if (!_DRAW_IS_MATCH_BOSS_SET){
		_DRAW_IS_MATCH_BOSS_SET = true;
		//初期処理
		let _o = _MAP.get_ememies_boss()[_DRAW_MATCH_BOSS_CLEAR_COUNT];
		if(!_o._left){
			//既存の敵を残さない場合は、
			//敵・敵ショットのオブジェクトを全てリセットする。
			_ENEMIES = [];
			_ENEMIES_SHOTS = [];
		}
		//スクロールを止める
		_DRAW_SCROLL_STOP();
		_DRAW_MATCH_BOSS_OBJ = _o._obj();
		_ENEMIES.push(_DRAW_MATCH_BOSS_OBJ);
		_o._bgmusic();
	}

	_MAP.setBackGroundSpeedY(0);
	_MAP.setInifinite(false);

	//ボス倒した後のスクロール
	if (_DRAW_IS_MATCH_BOSS_MOVEX) {
		//スクロールを止める（1回目だけ）
		if ( _DRAW_MATCH_BOSS_MOVEX_COUNT === 0 ){
			_DRAW_SCROLL_RESUME();
		}
		
		//所定のスクロール量に達した場合
		//スクロールを止める
		let _o = _MAP.get_ememies_boss()[_DRAW_MATCH_BOSS_CLEAR_COUNT - 1];
		if (_o._movex <= _DRAW_MATCH_BOSS_MOVEX_COUNT) {
			_DRAW_MATCH_BOSS_MOVEX_COUNT = 0;
			_DRAW_IS_MATCH_BOSS_MOVEX = false;
			_DRAW_IS_MATCH_BOSS_SET = false;
			return;
		}
		_DRAW_MATCH_BOSS_MOVEX_COUNT++;
		return;
	}

	//ボスを倒した場合
	if (!_DRAW_MATCH_BOSS_OBJ.isalive()) {
//		_ENEMIES = [];
		_DRAW_IS_MATCH_BOSS_MOVEX=true;
		_DRAW_MATCH_BOSS_CLEAR_COUNT++;
		_DRAW_MATCH_BOSS_COUNT=0;
		return;
	}

	_DRAW_MATCH_BOSS_COUNT++;

	return;
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
const _DRAW_STOP_PLAYERS_SHOTS = () => {
	window.cancelAnimationFrame(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;
	_PARTS_PLAYERMAIN._stop_shots();
	_PARTS_PLAYERMAIN._stop_missile_shots();
}

const _DRAW_STOP = () => {
	_GAME_AUDIO._setStopOnBG();
	window.cancelAnimationFrame(_DRAW_SETINTERVAL);
	_DRAW_SETINTERVAL=null;
}
const _DRAW_STOP_GAMESTART = () => {
	window.cancelAnimationFrame(_DRAW_GAMESTART_SETINTERVAL);
	_DRAW_GAMESTART_SETINTERVAL=null;
}
const _DRAW_STOP_OPENING = () => {
	window.cancelAnimationFrame(_DRAW_OPENING_SETINTERVAL);
	_DRAW_OPENING_SETINTERVAL = null;
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
			_GAME._setDrawToText({
				s:'start',
				x:'center',
				y:(_CANVAS.height / 2) - (60 / 2) - 20
			});
		}
		_c++;
	};
	_DRAW_GAMESTART_SETINTERVAL=window.requestAnimationFrame(_loop);
	_GAME_AUDIO._setStopOnBG();
}

const _DRAW_GAMECLEAR=()=>{
	if (_DRAW_IS_MATCH_BOSS_COUNT > 100) {
		_DRAW_SCROLL_RESUME();
	} else {
		_DRAW_IS_MATCH_BOSS_COUNT++;
		return;
	}
	//クリアしたら敵を全て消す
	_GAME._setDrawToText({
		s:'gameclear',
		x:'center',
		y:(_CANVAS.height / 2) - (60 / 2) - 40
	});
	_GAME._setDrawToText({
		s: 'press r to restart',
		x: 'center',
		y: (_CANVAS.height / 2) + 30,
		r: 0.3
	});
	_GAME._setDrawToText({
		s: 'press s to change to another stage',
		x: 'center',
		y: (_CANVAS.height / 2) + 60,
		r: 0.3
	});
	_DRAW_IS_GAMECLEAR=true;

}

const _DRAW_GAMEOVER=()=>{
	_KEYEVENT_MASTER.removeKeydownGame();
	_KEYEVENT_MASTER.removeKeyupGame();

	_DRAW_STOP();

	_KEYEVENT_MASTER.addKeydownGameover();
	_CONTEXT.clearRect(0,0,_CANVAS.width,_CANVAS.height);

	//BACKGROUNDを表示
	_PARTS_OTHERS._draw_background();

	//DRAW POWER METERを表示
	_POWERMETER.show();
	//SCOREを表示
	_PARTS_OTHERS._draw_score();

//	console.log('gameover');
	_GAME._setDrawToText({
		s: 'gameover',
		x: 'center',
		y: (_CANVAS.height / 2) - (60 / 2) - 40
	});
	_GAME._setDrawToText({
		s: 'press r to restart',
		x: 'center',
		y: (_CANVAS.height / 2) + 30,
		r: 0.3
	});
	_GAME._setDrawToText({
		s: 'press s to change to another stage',
		x: 'center',
		y: (_CANVAS.height / 2) + 60,
		r: 0.3
	});

}// _DRAW_GAMEOVER

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

	_DRAW_STOP_PLAYERS_SHOTS();
	_DRAW_STOP();

	_CONTEXT.clearRect(0,0,_CANVAS.width,_CANVAS.height);

	_PARTS_MAP._init();

	_PARTS_PLAYERMAIN._reset();

	_ENEMIES=[];
	_ENEMIES_SHOTS=[];
	_POWERMETER='';

	_ENEMIES_CONTROL._reset();

	_DIFFICULT_LEVEL = 0;

	_PARTS_OTHERS._reset();

	_MAP_SCROLL_POSITION_X=0;
	_MAP_SCROLL_POSITION_Y=0;

	_DRAW_IS_MATCH_BOSS_SET = false;
	_DRAW_IS_MATCH_BOSS_COUNT=0;
	_DRAW_IS_MATCH_BOSS_MOVEX = false;
	_DRAW_MATCH_BOSS_CLEAR_COUNT = 0;
	_DRAW_MATCH_BOSS_COUNT = 0;
	_DRAW_MATCH_BOSS_MOVEX_COUNT = 0;
	_DRAW_MATCH_BOSS_OBJ = new Object();

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
	_DRAW_STOP_PLAYERS_SHOTS();
	_CONTEXT.clearRect(0,0,_CANVAS.width,_CANVAS.height);

	_KEYEVENT_MASTER.removeKeydownSelectStage();
	_KEYEVENT_MASTER.addKeydownSelectPowermeter();

	_POWERMETER=new	GameObject_PM();
	_POWERMETER.pms_disp();
	_POWERMETER.pms_select();
}

const _DRAW_STAGE_SELECT=()=>{
	_DRAW_STOP_PLAYERS_SHOTS();
	_DRAW_STOP_OPENING();
	_CONTEXT.clearRect(0,0,_CANVAS.width,_CANVAS.height);

	_KEYEVENT_MASTER.removeKeydownStart();
	_KEYEVENT_MASTER.removeKeydownGame();
	_KEYEVENT_MASTER.removeKeyupGame();
	_KEYEVENT_MASTER.removeKeydownGameover();

	_STAGESELECT=new GameObject_STAGESELECT();
	_STAGESELECT.init();
	_KEYEVENT_MASTER.addKeydownSelectStage();
	_GAME_AUDIO._setPlayOnBG(_CANVAS_AUDIOS['bg_powermeterselect']);
}


let _DRAW_OPENING_IMGLOAD_RATE=0;
const _DRAW_OPENING_START=()=>{
	_GAME_IMG._init_imgs(_CANVAS_IMGS, (_n) => {
			//進捗中処理
			_DRAW_OPENING_IMGLOAD_RATE=_n;
		}).then(()=>{_DRAW_STAGE_SELECT();});
	_GAME_AUDIO._setPlay(_CANVAS_AUDIOS['playerset']);		
}
const _DRAW_OPENING=()=>{
	let _c = 0;
	const _loop = () => {
		_DRAW_OPENING_SETINTERVAL = window.requestAnimationFrame(_loop);
		_CONTEXT.clearRect(0, 0, _CANVAS.width, _CANVAS.height);

		//背景
		_CONTEXT.save();
		_CONTEXT.globalAlpha = 0.5;
		_CONTEXT.drawImage(
			_CANVAS_IMGS_INIT.gradius_background.obj,0,0,1000,500);
		_CONTEXT.restore();

		//ロゴ
		_GAME._setDrawImage({
			img: _CANVAS_IMGS_INIT.gradius_logo.obj,
			x:150,
			y:80,
			width:700,
			height:130,
			basePoint:1
		});

		let _s = 'no pakuri';
		_GAME._setDrawToText({
			s:_s,
			x:(_CANVAS.width / 2) - (42 * _s.length / 2),
			y:(_CANVAS.height / 2) - 20,
			r:0.7
		});

		_s = 'press s to start';
		_GAME._setDrawToText({
			s:_s,
			x: 'center',
			y:(_CANVAS.height / 2) + 60,
			r:0.5,
			alpha:parseFloat(_c/100)
		});

		_c = (_c >= 100) ? 0 : _c + 1;
		if(_DRAW_OPENING_IMGLOAD_RATE===0){return;}
		_s = 'now loading ' + _DRAW_OPENING_IMGLOAD_RATE;
		_GAME._setDrawToText({
			s:_s,
			x: 'center',
			y:(_CANVAS.height / 2) + 130,
			r:0.4,
			alpha:(_c%2===0)?1:0
		});

	};
	_DRAW_OPENING_SETINTERVAL = window.requestAnimationFrame(_loop);

} //_DRAW_OPENING


//===================================================
//	JAVASCRIPT START
//===================================================
window.addEventListener('load',()=>{
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
	_AJAX({url:'./gradius_config.json'})
	.then((_d)=>{
		//設定情報取得した値を各オブジェクトにセット
		_DEF_DIFFICULT = _d.common.difficult;
		_SP_CONTROLLER._set_main_dist_within({num:parseInt(_d.controller_event.sp_controller_main_dist_within)});

		_CANVAS_IMGS_CONTROL._init_canvas_imgs(_d.canvasimgs.imgs);
		_CANVAS_IMGS_CONTROL._init_canvas_imgs_init(_d.canvasimgs.imgs_init);
		_CANVAS_IMGS_CONTROL._init_canvas_audios(_d.canvasimgs.audios);

		_MAP = new GameObject_MAP();
		_MAP.init();
		//マップ用テーマ設定
		_MAP.init_map_theme(_d.map.theme);
		//マップ用ボス定義設定
		_MAP.init_map_enemies_boss(_d.map.enemies_boss);
	})
	.then(() => {	
		//オーディオ読み込み	
		return _GAME_AUDIO._init_audios(
			_CANVAS_AUDIOS, (_n) => {
				//進捗中処理
				document.querySelector('#game_start_loading .rate').innerHTML = parseInt(_n) + '%';
			});
	})
	.then(() => {
		return _GAME_IMG._init_imgs(_CANVAS_IMGS_INIT);
	})
	.then(() => {
		_PARTS_PLAYERMAIN._set_shot_type('_SHOTTYPE_NORMAL');
		_PARTS_OTHERS._init_score();
		let _gsl = document.querySelector('#game_start_loading');
		_gsl.classList.remove('on');
		let _gw = document.querySelector('#game_wrapper');
		_gw.classList.add('on');

		//SPのみコントローラーのオブジェクトを取得
		if (_ISSP) {
			let _spc = document.querySelector('#sp_controller');
			_spc.classList.add('on');
			_SP_CONTROLLER._set_obj();
		}

		if (_ISDEBUG) {
			_STAGESELECT = new GameObject_STAGESELECT();
			_STAGESELECT.init();

			_MAP.set_stage_map_pattern(_MAP_PETTERN);

			_GAME_IMG._init_imgs(_CANVAS_IMGS).then(() => {
				_DRAW_POWER_METER_SELECT();
			});

			return;
		}

		//スタート画面表示
		_KEYEVENT_MASTER.addKeydownStart();
		_DRAW_OPENING();
	}).catch(()=>{
		console.log('json:error');
		alert('エラーが発生しました。もう一度このアプリ再起動をお願いします。\nブラウザでキャッシュクリアの必要性があります');
	});

});

//touchmoveブラウザのスクロールを停止
window.addEventListener('touchmove',function(e){
    e.preventDefault();
},{passive: false});

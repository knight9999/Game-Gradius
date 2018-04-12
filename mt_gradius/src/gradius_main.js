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

let _ISDEBUG=false;
let _PLAYERS_POWER_METER=0;
let _PLAYERS_POWER_METER_SHIELD=0;

let _DRAW_SETINTERVAL=null;
let _DRAW_GAMESTART_SETINTERVAL=null;
let _PLAYERS_SHOTS_SETINTERVAL=null;

let _EVENT_POWERMETER_FLAG=false;
let _EVENT_SELECT_STAGE_FLAG=false;

let _DRAW_IS_MATCH_BOSS=false;
let _DRAW_IS_MATCH_BOSS_COUNT=0;


const _ISSP=(window.ontouchstart===null)?true:false;
const _EVENT_KEYDOWN=(window.ontouchstart===null)?'touchstart':'keydown';
const _EVENT_KEYUP=(window.ontouchstart===null)?'touchend':'keyup';

const _FPS=60;


let _CANVAS;	//キャンバス
let _CONTEXT;

let _DRAW_IS_GAMECLEAR=false;//GameClearフラグ

const _SHOTTYPE_MISSILE='_SHOTTYPE_MISSILE';
const _SHOTTYPE_NORMAL='_SHOTTYPE_NORMAL';
const _SHOTTYPE_DOUBLE='_SHOTTYPE_DOUBLE';
const _SHOTTYPE_LASER='_SHOTTYPE_LASER';

const _SHOTTYPE_RIPPLE_LASER='_SHOTTYPE_RIPPLE_LASER';
let _SHOTTYPE=_SHOTTYPE_NORMAL;

let _SCORE='';

let _PLAYERS_MAIN='';
let _PLAYERS_MAIN_FORCE='';

let _PLAYERS_OPTION=new Array();
let _PLAYERS_OPTION_ISALIVE=0;//オプション表示数
const _PLAYERS_OPTION_MAX=4;

const _PLAYERS_MOVE_DRAW_MAX=100;
let _PLAYERS_MOVE_FLAG=false;
let _PLAYERS_MOVE_DRAW_X=new Array();//自機移動分Xの配列
let _PLAYERS_MOVE_DRAW_Y=new Array();//自機移動分Yの配列

const _PLAYERS_MAX=5;
const _PLAYERS_SHOTS_MAX=2;

let _PLAYERS_SHOTS={
	'_SHOTTYPE_NORMAL':new Array(),
	'_SHOTTYPE_DOUBLE':new Array(),
	'_SHOTTYPE_LASER':new Array()
}
let _PLAYERS_MISSILE=new Array();
let _PLAYERS_MISSILE_ISALIVE=false;

let _ENEMIES=new Array();
let _ENEMIES_SHOTS=new Array();
let _ENEMIES_COLLISIONS=new Array();//敵衝突の表示

let _POWERCAPSELLS=new Array();//パワーカプセルの表示

let _POWERMETER='';
let _STAGESELECT='';

let _MAP='';

let _BACKGROUND=new Array();
const _BACKGROUND_STAR_MAX=70;

let _KEYSAFTERPAUSE=new Array();
let _DEF_KEYSAFTERPAUSE	//for full equipment
		='38,38,40,40,37,39,37,39,66,65';

const _IS_SQ_COL=0;
const _IS_SQ_COL_NONE=1;
const _IS_SQ_NOTCOL=2;

const _AUDIO_CONTEXT=new(
	window.AudioContext
	||window.webkitAudioContext
)();
	
const _AJAX=function(_url,_type,_f,_t){
let _r=new XMLHttpRequest();
_r.onreadystatechange=function(){
    if(_r.readyState===4){//通信の完了時
        if(_r.status===200) {//通信の成功時
            console.log('OK');
            _f(_r.response,_t);
        }else{
            //connecting
            console.log('NG');
        }
    }
}
_r.open('GET',_url+'?date='+(new Date().getTime()));
_r.responseType=_type||'json';
_r.send(null);
}// _AJAX

const _KEYEVENT_MASTER={
'addKeydownStart':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_s
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_start);
	}else{
		document
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT.keydown_start);
	}
},//addKeydownStart
'removeKeydownStart':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_s
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_start);
	}else{
		document
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT.keydown_start);
	}

},//removeKeydownStart
'addKeydownSelectStage':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
			'touchmove',
			_KEYEVENT_SP.keymove_select_stage);
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyend_select_stage);
		_SP_CONTROLLER._sp_bt_a
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_select_stage_a);

	}else{
		document.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT.keydown_select_stage);
	}

},//addKeydownSelectStage
'removeKeydownSelectStage':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
			'touchmove',
			_KEYEVENT_SP.keymove_select_stage);
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyend_select_stage);
		_SP_CONTROLLER._sp_bt_a
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_select_stage_a);

		_SP_CONTROLLER._set_reset();
	}else{
		//ステージ選択のクリックイベント設定
		document.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT.keydown_select_stage);
	}

},//removeKeydownSelectStage
'addKeydownSelectPowermeter':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
			'touchmove',
			_KEYEVENT_SP.keymove_select_powermeter);
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyend_select_powermeter);
		_SP_CONTROLLER._sp_bt_a
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_select_powermeter_a);

	}else{
		document.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT.keydown_select_powermeter
		);
	}
},//addKeydownSelectPowermeter
'removeKeydownSelectPowermeter':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
			'touchmove',
			_KEYEVENT_SP.keymove_select_powermeter);
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyend_select_powermeter);
		_SP_CONTROLLER._sp_bt_a
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_select_powermeter_a);

		_SP_CONTROLLER._set_reset();
	}else{
		document.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT.keydown_select_powermeter
		);
	}
},//removeKeydownSelectPowermeter
'addKeydownGame':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_hide
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_hide);
		_SP_CONTROLLER._sp_bt_r
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_r);
		_SP_CONTROLLER._sp_bt_p
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_p);
		_SP_CONTROLLER._sp_bt_s
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_s);
		_SP_CONTROLLER._sp_bt_b
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_b);
		_SP_CONTROLLER._sp_bt_a
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_a);
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
			'touchstart',
			_KEYEVENT_SP.keymove_game_controller);
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
			'touchmove',
			_KEYEVENT_SP.keymove_game_controller);
	}else{
		document.addEventListener(
			_EVENT_KEYDOWN,_KEYEVENT.keydown_game);
	}
},//addKeydownGame
'addKeyupGame':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_a
			.addEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyup_game_a);
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
			'touchend',
			_KEYEVENT_SP.keyend_game_controller);

		_SP_CONTROLLER._set_reset();

	}else{
		document.addEventListener(
			_EVENT_KEYUP,_KEYEVENT.keyup_game);
	}
},//addKeyupGame
'removeKeydownGame':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_hide
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_hide);
		_SP_CONTROLLER._sp_bt_r
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_r);
		_SP_CONTROLLER._sp_bt_p
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_p);
		_SP_CONTROLLER._sp_bt_s
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_s);
		_SP_CONTROLLER._sp_bt_b
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_b);
		_SP_CONTROLLER._sp_bt_a
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_a);
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
			'touchstart',
			_KEYEVENT_SP.keymove_game_controller);
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
			'touchmove',
			_KEYEVENT_SP.keymove_game_controller);

	}else{
		document.removeEventListener(
			_EVENT_KEYDOWN,_KEYEVENT.keydown_game);
	}
},//removeKeydownGame
'removeKeyupGame':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_a
			.removeEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyup_game_a);
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
			'touchend',
			_KEYEVENT_SP.keyend_game_controller);
		//コントローラーをリセット
		_SP_CONTROLLER._set_reset();
	}else{
		document.removeEventListener(
			_EVENT_KEYUP,_KEYEVENT.keyup_game);
	}

},//removeKeyupGame

'addKeydownGameclear':function(){
   if(_ISSP){
	   _SP_CONTROLLER._sp_bt_r
		   .addEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_r);
	   _SP_CONTROLLER._sp_bt_s
		   .addEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_s);
	   _SP_CONTROLLER._sp_bt_p
		   .addEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_p);
   }else{
	   document.addEventListener(
		   _EVENT_KEYDOWN,_KEYEVENT.keydown_gameclear);
   }

},//addKeydownGameclear

'removeKeydownGameclear':function(){
   if(_ISSP){
	   _SP_CONTROLLER._sp_bt_r
		   .removeEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_r);
	   _SP_CONTROLLER._sp_bt_s
		   .removeEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_s);
		_SP_CONTROLLER._sp_bt_p
		   .removeEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_p);

	}else{
	   document.removeEventListener(
		   _EVENT_KEYDOWN,_KEYEVENT.keydown_gameclear);
   }

},//removeKeydownGameclear

'addKeydownGameover':function(){
   if(_ISSP){
	   _SP_CONTROLLER._sp_bt_r
		   .addEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameover_r);
	   _SP_CONTROLLER._sp_bt_s
		   .addEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameover_s);
   }else{
	   document.addEventListener(
		   _EVENT_KEYDOWN,_KEYEVENT.keydown_gameover);
   }

},//addKeydownGameover

'removeKeydownGameover':function(){
   if(_ISSP){
	   _SP_CONTROLLER._sp_bt_r
		   .removeEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameover_r);
	   _SP_CONTROLLER._sp_bt_s
		   .removeEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameover_s);
   }else{
	   document.removeEventListener(
		   _EVENT_KEYDOWN,_KEYEVENT.keydown_gameover);
   }

}//removeKeydownGameover
}//_KEYEVENT_MASTER

//	キーイベントの定義
//	イベントの追加は、各シーンに設定
//	イベントの削除は、この関数内に設定
const _KEYEVENT={
'keydown_start':function(e){
	if(e.key==='S'||e.key==='s'){
		document
			.querySelector('#game_start_wrapper .text')
			.classList.add('on');
		document
			.querySelector('#game_start_wrapper .text_loading')
			.classList.add('on');

		//メイン画像を読み込んでステージセレクトに遷移
		_DRAW_INIT(_CANVAS_IMGS,_DRAW_STAGE_SELECT);
		_GAME._setPlay(_CANVAS_AUDIOS['playerset']);		
	}
},//keydown_start

//パワーメーター選択イベント
'keydown_select_powermeter':function(e){
	clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;

	if(e.key==="Enter"||e.key==="enter"){
		_DRAW_SELECT_POWERMETER();
		_GAME._setPlay(_CANVAS_AUDIOS['playerset']);
		return false;
	}

	if(e.key==='ArrowUp'||e.key==='Up'){
		_POWERMETER._c_pms=
			(_POWERMETER._c_pms<=0)
			?0:_POWERMETER._c_pms-1;
		}
	if(e.key==='ArrowDown'||e.key==='Down'){
		_POWERMETER._c_pms=
			(_POWERMETER._c_pms>=_POWERMETER.pms_selected.length-1)
			?_POWERMETER._c_pms
			:_POWERMETER._c_pms+1;
		}
	if(e.key==='ArrowLeft'||e.key==='Left'){
		_POWERMETER._c_pmss=
			(_POWERMETER._c_pmss<=0)
			?0
			:_POWERMETER._c_pmss-1;
		}
	if(e.key==='ArrowRight'||e.key==='Right'){
		_POWERMETER._c_pmss=
			(_POWERMETER._c_pmss
				>=_POWERMETER.pmss_selected.length-1)
			?_POWERMETER._c_pmss
			:_POWERMETER._c_pmss+1;
		}

	_POWERMETER.pms_disp();
	_POWERMETER.pms_select();
	_GAME._setPlay(_CANVAS_AUDIOS['pms_select']);
	
},
//ステージ選択イベント
'keydown_select_stage':function(e){
	if(e.key==="Enter"||e.key==="enter"){
		_MAP.set_stage_map_pattern(_STAGESELECT.mapdef_status);
		_DRAW_POWER_METER_SELECT();
		_GAME._setPlay(_CANVAS_AUDIOS['playerset']);		
		return false;
	}
	if(e.key==='ArrowLeft'||e.key==='Left'){
		_STAGESELECT.mapdef_status=
			(_STAGESELECT.mapdef_status<=0)
			?0
			:_STAGESELECT.mapdef_status-1;

	}
	if(e.key==='ArrowRight'||e.key==='Right'){
		_STAGESELECT.mapdef_status=
			(_STAGESELECT.mapdef_status
				>=_MAPDEFS.length-1)
			?_STAGESELECT.mapdef_status
			:_STAGESELECT.mapdef_status+1;
	}
	_STAGESELECT.set_map_status();
	_STAGESELECT.disp_thumb_map();
	_GAME._setPlay(_CANVAS_AUDIOS['pms_select']);	
},
'keydown_gameclear':function(e){
	if(e.key==='R'||e.key==='r'){
		_DRAW_STOP_PLAYERS_SHOTS();
		_DRAW_RESET_OBJECT();
		_DRAW_INIT_OBJECT();
		return false;
	}

	if(e.key==='S'||e.key==='s'){
		_DRAW_STOP_PLAYERS_SHOTS();
		_DRAW_RESET_OBJECT();
		_DRAW_STAGE_SELECT();
		return false;
	}

	if(e.key==='P'||e.key==='p'){
		if(_DRAW_SETINTERVAL!==null){
			_DRAW_STOP();
		}else{
			_KEYSAFTERPAUSE=[];
			_DRAW();
		}
		return false;
	}

	if(e.key===' '||e.key==='Spacebar'){
		if(_PLAYERS_SHOTS_SETINTERVAL!==null){return;}
		_DRAW_PLAYERS_SHOTS();
	}

	if(e.key==='ArrowLeft'||e.key==='Left'){
		_PLAYERS_MOVE_FLAG=true;
		_PLAYERS_MAIN._x
			=_PLAYERS_MAIN.accel*-1;
	}
	if(e.key==='ArrowRight'||e.key==='Right'){
		_PLAYERS_MOVE_FLAG=true;
		_PLAYERS_MAIN._x
			=_PLAYERS_MAIN.accel;
	}
	if(e.key==='ArrowUp'||e.key==='Up'){
		_PLAYERS_MOVE_FLAG=true;
		_PLAYERS_MAIN._y
			=_PLAYERS_MAIN.accel*-1;
	}
	if(e.key==='ArrowDown'||e.key==='Down'){
		_PLAYERS_MOVE_FLAG=true;
		_PLAYERS_MAIN._y
			=_PLAYERS_MAIN.accel;
	}
	//装備
	if(e.key==='B'||e.key==='b'){
		_POWERMETER.playerset();
	}

},
'keydown_gameover':function(e){
	if(e.key==='R'||e.key==='r'){
		_DRAW_STOP_PLAYERS_SHOTS();
		_DRAW_RESET_OBJECT();
		_DRAW_INIT_OBJECT();
		return false;
	}

	if(e.key==='S'||e.key==='s'){
		_DRAW_STOP_PLAYERS_SHOTS();
		_DRAW_RESET_OBJECT();
		_DRAW_STAGE_SELECT();
		return false;
	}

},
//ゲーム開始時
'keydown_game':function(e){
	//撃たれたら機種操作不可
	if(!_PLAYERS_MAIN.isalive()){return false;}
//	console.log(_MAP.map_backgroundY_speed);	
	if(e.key==='R'||e.key==='r'){
		_DRAW_STOP_PLAYERS_SHOTS();
		_DRAW_RESET_OBJECT();
		_DRAW_INIT_OBJECT();
		return false;
	}

	if(e.key==='S'||e.key==='s'){
		_DRAW_STOP_PLAYERS_SHOTS();
		_DRAW_RESET_OBJECT();
		_DRAW_STAGE_SELECT();
		return false;
	}

	if(e.key==='P'||e.key==='p'){
		if(_DRAW_SETINTERVAL!==null){
			_DRAW_STOP();
			_GAME._setStopOnBG();
		}else{
			_KEYSAFTERPAUSE=[];
			_DRAW();
			_GAME._setPlayOnBG(_GAME._audio_now_obj_bg);			
		}
		return false;
	}

	//コナミコマンド
	if(_DRAW_SETINTERVAL===null){
		_KEYSAFTERPAUSE.push(e.keyCode);
		if(_DEF_KEYSAFTERPAUSE===
				_KEYSAFTERPAUSE.toString()){
//			console.log('match');
			_SHOTTYPE=_SHOTTYPE_NORMAL;
			_PLAYERS_MISSILE_ISALIVE=true;
			for(let _i=0;_i<_PLAYERS_OPTION_MAX;_i++){
				_PLAYERS_OPTION[_i].settruealive();
			}
			_PLAYERS_MAIN_FORCE.init();
			_KEYSAFTERPAUSE=[];

			_POWERMETER._set_current_reset();
			_POWERMETER.meterdef_status='101100';
		}
		return false;
	}

	if(e.key===' '||e.key==='Spacebar'){
		if(_PLAYERS_SHOTS_SETINTERVAL!==null){return;}
		_DRAW_PLAYERS_SHOTS();
	}

	if(e.key==='ArrowLeft'||e.key==='Left'){
		_PLAYERS_MOVE_FLAG=true;
		_PLAYERS_MAIN._x
			=_PLAYERS_MAIN.accel*-1;
	}
	if(e.key==='ArrowRight'||e.key==='Right'){
		_PLAYERS_MOVE_FLAG=true;
		_PLAYERS_MAIN._x
			=_PLAYERS_MAIN.accel;
	}
	if(e.key==='ArrowUp'||e.key==='Up'){
		_PLAYERS_MOVE_FLAG=true;
		_PLAYERS_MAIN._y
			=_PLAYERS_MAIN.accel*-1;
		_PLAYERS_MAIN.set_vv_ani(e.key);
	}
	if(e.key==='ArrowDown'||e.key==='Down'){
		_PLAYERS_MOVE_FLAG=true;
		_PLAYERS_MAIN._y
			=_PLAYERS_MAIN.accel;
		_PLAYERS_MAIN.set_vv_ani(e.key);
	}
	//装備
	if(e.key==='B'||e.key==='b'){
		_POWERMETER.playerset();
	}

	//試験版
	if(!_ISDEBUG){return false;}
	if(e.key==='M'||e.key==='m'){
		_DRAW_SCROLL_STOP();
	}
	if(e.key==='N'||e.key==='n'){
		_DRAW_SCROLL_RESUME();
	}
	if(e.key==='V'||e.key==='v'){
	 	_POWERMETER.move();
	}


},//keydown_game

'keyup_game':function(e){
	if(!_PLAYERS_MAIN.isalive()){return false;}//撃たれたら操作不可

	if(e.key==='ArrowLeft'||e.key==='Left'){
		_PLAYERS_MOVE_FLAG=false;
	}
	if(e.key==='ArrowRight'||e.key==='Right'){
		_PLAYERS_MOVE_FLAG=false;
	}
	if(e.key==='ArrowUp'||e.key==='Up'){
		_PLAYERS_MOVE_FLAG=false;
	}
	if(e.key==='ArrowDown'||e.key==='Down'){
		_PLAYERS_MOVE_FLAG=false;
	}
	if(e.key===' '||e.key==='Spacebar'){
		_DRAW_STOP_PLAYERS_SHOTS();
	}
}//keyup_game

}//_KEYEVENT


//	キーイベントの定義(SP)
//	イベントの追加は、各シーンに設定
//	イベントの削除は、この関数内に設定
const _KEYEVENT_SP={
'keydown_start':function(e){
	document
		.querySelector('#game_start_wrapper .text')
		.classList.add('on');
	document
		.querySelector('#game_start_wrapper .text_loading')
		.classList.add('on');
	//メイン画像を読み込んでステージセレクトに遷移
	_DRAW_INIT(_CANVAS_IMGS,_DRAW_STAGE_SELECT);
	_GAME._setPlay(_CANVAS_AUDIOS['playerset']);
},//keydown_start

//パワーメーター選択イベント
'keydown_select_powermeter_a':function(e){
	_DRAW_SELECT_POWERMETER();
	_GAME._setPlay(_CANVAS_AUDIOS['playerset']);
	return false;
},


'keymove_select_powermeter':function(e){
	clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;

//	let _rad=_SP_CONTROLLER._get_st(e)._rad;
	e.preventDefault(); // タッチによる画面スクロールを止める

	let _r=_SP_CONTROLLER._get_st(e);
//	console.log(_EVENT_POWERMETER_FLAG);

	if(_EVENT_POWERMETER_FLAG===true){return false;}
	_EVENT_POWERMETER_FLAG=true;


	if(_r===_SP_CONTROLLER._DEF_DIR._L){
//	if(_rad>-45&&_rad<=45){
//		 	console.log('left');
		_POWERMETER._c_pmss=
			(_POWERMETER._c_pmss<=0)
			?0
			:_POWERMETER._c_pmss-1;
		_POWERMETER.pms_disp();
		_POWERMETER.pms_select();
		_GAME._setPlay(_CANVAS_AUDIOS['pms_select']);
		return false;
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._U){
//	if(_rad>45&&_rad<=135){
//		 	console.log('top');
		_POWERMETER._c_pms=
			(_POWERMETER._c_pms<=0)
			?0:_POWERMETER._c_pms-1;
		_POWERMETER.pms_disp();
		_POWERMETER.pms_select();
		_GAME._setPlay(_CANVAS_AUDIOS['pms_select']);
		return false;
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._R){
	 // if((_rad>135&&_rad<=180)
	// 	||(_rad<-135&&_rad>=-180)){
//		 console.log('right');
		_POWERMETER._c_pmss=
			(_POWERMETER._c_pmss
				>=_POWERMETER.pmss_selected.length-1)
			?_POWERMETER._c_pmss
			:_POWERMETER._c_pmss+1;
		_POWERMETER.pms_disp();
		_POWERMETER.pms_select();
		_GAME._setPlay(_CANVAS_AUDIOS['pms_select']);
		return false;
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._D){	
//	if(_rad<-45&&_rad>=-135){
//		 console.log('bottom');
		_POWERMETER._c_pms=
			(_POWERMETER._c_pms>=_POWERMETER.pms_selected.length-1)
			?_POWERMETER._c_pms
			:_POWERMETER._c_pms+1;
		_POWERMETER.pms_disp();
		_POWERMETER.pms_select();
		_GAME._setPlay(_CANVAS_AUDIOS['pms_select']);
		return false;
 	}

	// console.log(_rad);
},//keymove_select_powermeter

'keyend_select_powermeter':function(e){
	_SP_CONTROLLER._set_reset();
	_EVENT_POWERMETER_FLAG=false;
},//keyend_select_powermeter

//ステージ選択イベント
'keymove_select_stage':function(e){
	e.preventDefault(); // タッチによる画面スクロールを止める
	// let _rad=_SP_CONTROLLER._get_st(e)._rad;
	// let _dis=_SP_CONTROLLER._get_st(e)._dis;

	if(_EVENT_SELECT_STAGE_FLAG){return;}
	_EVENT_SELECT_STAGE_FLAG=true;

	let _r=_SP_CONTROLLER._get_st(e);
	//所定の距離に達しない場合は無効
	if(!_r){return;}

	if(_r===_SP_CONTROLLER._DEF_DIR._L){		
//	if(_rad>-45&&_rad<=45){
		// 	console.log('left');
		_STAGESELECT.mapdef_status=
			(_STAGESELECT.mapdef_status<=0)
			?0
			:_STAGESELECT.mapdef_status-1;
		_GAME._setPlay(_CANVAS_AUDIOS['pms_select']);
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._U){		
//	if(_rad>45&&_rad<=135){
		// 	console.log('top');
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._R){		
	// if((_rad>135&&_rad<=180)
	// 	||(_rad<-135&&_rad>=-180)){
		// console.log('right');
		_STAGESELECT.mapdef_status=
			(_STAGESELECT.mapdef_status
				>=_MAPDEFS.length-1)
			?_STAGESELECT.mapdef_status
			:_STAGESELECT.mapdef_status+1;
		_GAME._setPlay(_CANVAS_AUDIOS['pms_select']);
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._U){
//	if(_rad<-45&&_rad>=-135){
		// console.log('bottom');
	}

	_STAGESELECT.set_map_status();
	_STAGESELECT.disp_thumb_map();
	return false;

},//keymove_select_stage
'keyend_select_stage':function(e){
	let _c1=_SP_CONTROLLER._sp_main_center
	_c1.style.top="";
	_c1.style.left="";
	_EVENT_SELECT_STAGE_FLAG=false;
},//keyend_select_stage
'keydown_select_stage_a':function(e){
	_MAP.set_stage_map_pattern(_STAGESELECT.mapdef_status);
	_DRAW_POWER_METER_SELECT();
	_GAME._setPlay(_CANVAS_AUDIOS['playerset']);	
	return false;
},//keydown_select_stage_a

'keydown_gameclear_r':function(e){
	_DRAW_STOP_PLAYERS_SHOTS();
	_DRAW_RESET_OBJECT();
	_DRAW_INIT_OBJECT();
	return false;
},//keydown_gameclear_r
'keydown_gameclear_s':function(e){
	_DRAW_STOP_PLAYERS_SHOTS();
	_DRAW_RESET_OBJECT();
	_DRAW_INIT_OBJECT();
	return false;
},//keydown_gameclear_s
'keydown_gameclear_p':function(e){
	if(_DRAW_SETINTERVAL!==null){
		_DRAW_STOP();
	}else{
		_KEYSAFTERPAUSE=[];
		_DRAW();
	}
	return false;
},//keydown_gameclear_p

'keydown_gameover_r':function(e){
	_DRAW_STOP_PLAYERS_SHOTS();
	_DRAW_RESET_OBJECT();
	_DRAW_INIT_OBJECT();
	return false;
},
'keydown_gameover_s':function(e){
	_DRAW_STOP_PLAYERS_SHOTS();
	_DRAW_RESET_OBJECT();
	_DRAW_STAGE_SELECT();
	return false;
},//keydown_gameover_s
'keymove_game_controller':function(e){
	e.preventDefault(); // タッチによる画面スクロールを止める
	// let _rad=_SP_CONTROLLER._get_st(e)._rad;
	// let _dis=_SP_CONTROLLER._get_st(e)._dis;
	// if(_dis<5){return false;}
	_PLAYERS_MOVE_FLAG=true;	
	let _r=_SP_CONTROLLER._get_st(e);
	if(_r===false){return;}
	_PLAYERS_MAIN._x=0;
	_PLAYERS_MAIN._y=0;

	if(_r===_SP_CONTROLLER._DEF_DIR._L){
//	if(_rad>-40&&_rad<=40){
			// 	console.log('left');
 		_PLAYERS_MAIN._x
			 =_PLAYERS_MAIN.accel*-1;
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._LU){
//	if(_rad>40&&_rad<=50){
		// 	console.log('left-top');
 		_PLAYERS_MAIN._x
 			=_PLAYERS_MAIN.accel*-1;
		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel*-1;
		_PLAYERS_MAIN.set_vv_ani('Up');
	 }
	if(_r===_SP_CONTROLLER._DEF_DIR._U){
//	if(_rad>50&&_rad<=130){
		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel*-1;
		_PLAYERS_MAIN.set_vv_ani('Up');
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._RU){
//	if(_rad>130&&_rad<=140){
		// 	console.log('right-top');
		_PLAYERS_MAIN._x
 			=_PLAYERS_MAIN.accel*1;
		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel*-1;
		_PLAYERS_MAIN.set_vv_ani('Up');
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._R){
		// if((_rad>140&&_rad<=180)
		// ||(_rad<-140&&_rad>=-180)){
		// console.log('right');
 		_PLAYERS_MAIN._x
 			=_PLAYERS_MAIN.accel;
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._RD){
//		if(_rad<-130&&_rad>=-140){
		// console.log('right-bottom');
		_PLAYERS_MAIN._x
 			=_PLAYERS_MAIN.accel*1;
 		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel*1;
		_PLAYERS_MAIN.set_vv_ani('Down');
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._D){
//	if(_rad<-50&&_rad>=-130){
		// console.log('bottom');
 		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel;
		_PLAYERS_MAIN.set_vv_ani('Down');
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._LD){
//	if(_rad<-40&&_rad>=-50){
		// console.log('left-bottom');
		_PLAYERS_MAIN._x
 			=_PLAYERS_MAIN.accel*-1;
 		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel*1;
		_PLAYERS_MAIN.set_vv_ani('Down');
 	}

	return false;
	// console.log(_rad);
},//keymove_game_controller
'keyend_game_controller':function(e){
	_SP_CONTROLLER._set_reset();
	_PLAYERS_MAIN.set_moveamount_reset();
	_PLAYERS_MOVE_FLAG=false;
},//keyend_game_controller

'keydown_game_hide':function(e){
	_SHOTTYPE=_SHOTTYPE_NORMAL;
	_PLAYERS_MISSILE_ISALIVE=true;
	for(let _i=0;_i<_PLAYERS_OPTION_MAX;_i++){
		_PLAYERS_OPTION[_i].settruealive();
	}
	_PLAYERS_MAIN_FORCE.init();
	_KEYSAFTERPAUSE=[];

	_POWERMETER._set_current_reset();
	_POWERMETER.meterdef_status='101100';
	return false;
},//keydown_game_hide

'keydown_game_r':function(e){
	_DRAW_RESET_OBJECT();
	_DRAW_INIT_OBJECT();
	return false;
},//keydown_game_r
'keydown_game_s':function(e){
	_DRAW_RESET_OBJECT();
	_DRAW_STAGE_SELECT();
	return false;
},//keydown_game_s
'keydown_game_p':function(e){
	if(_DRAW_SETINTERVAL!==null){
		_DRAW_STOP();
		_GAME._setStopOnBG();		
	}else{
		_KEYSAFTERPAUSE=[];
		_DRAW();
		_GAME._setPlayOnBG(_GAME._audio_now_obj_bg);		
	}
	return false;
},//keydown_game_p

'keydown_game_a':function(e){
	if(_DRAW_SETINTERVAL===null){return;}
	if(_PLAYERS_SHOTS_SETINTERVAL!==null){return;}
	_DRAW_PLAYERS_SHOTS();
	return false;
},//keydown_game_a
'keydown_game_b':function(e){
	//装備
	if(_DRAW_SETINTERVAL===null){return;}
	_POWERMETER.playerset();
	return false;
},//keydown_game_b
'keyup_game_a':function(e){
	_DRAW_STOP_PLAYERS_SHOTS();
	return false;
}//keyup_game_a
}//_KEYEVENT_SP

//スマホ用コントローラー定義
const _SP_CONTROLLER={
	_x:0,
	_y:0,
	_sp_main_center:new Object(),
	_sp_main:new Object(),
	_sp_bt_hide:new Object(),
	_sp_bt_r:new Object(),
	_sp_bt_p:new Object(),
	_sp_bt_s:new Object(),
	_sp_bt_b:new Object(),
	_sp_bt_a:new Object(),
	_DEF_DIR:{//向き定義
		_U:0,//上
		_D:1,//下
		_R:2,//右
		_L:3,//左
		_LU:4,//左上
		_LD:5,//左下
		_RU:6,//右上
		_RD:7//右下
	},
	_get_st:function(e){
		let _c1=this._sp_main_center;
		let _c0=this._sp_main;
		//親要素に対してイベントを定義し、
		//子要素はタッチ位置に併せて調整

		//相対座標を取得
		let _tr=_c0.getBoundingClientRect();
		for(var _i=0;_i<e.touches.length;_i++){
			//マルチタップから
			//自身のタッチ箇所のみ設定
			if(_c1===e.touches[_i].target){
				this._x=e.touches[_i].clientX-_tr.left;
				this._y=e.touches[_i].clientY-_tr.top;
			}
		}
//		console.log(this._x)
		//子要素の中心点設定
		let _c1_x=this._x-(parseInt(window.getComputedStyle(_c1).width)/2),
			_c1_y=this._y-(parseInt(window.getComputedStyle(_c1).height)/2)
		_c1.style.left=parseInt(_c1_x)+'px';
		_c1.style.top=parseInt(_c1_y)+'px';

		//親要素の中心点から角度を算出
		let _w=parseInt(window.getComputedStyle(_c0).width);
		let _h=parseInt(window.getComputedStyle(_c0).height);
		let _dx=(_w/2)-this._x,
			 _dy=(_h/2)-this._y;

		let _d=Math.sqrt(
			Math.pow(_dx,2)+Math.pow(_dy,2)
		);
		if(_d<10){return false;}
//		console.log('_d:::'+_d);
		let _a=parseInt(Math.atan2(_dy,_dx)*180/Math.PI);
//		console.log('_a:::'+_a);
		

		if(_a>-40&&_a<=40){return this._DEF_DIR._L;}
		if(_a>40&&_a<=50){return this._DEF_DIR._LU;}
		if(_a>50&&_a<=130){return this._DEF_DIR._U;}
		if(_a>130&&_a<=140){return this._DEF_DIR._RU;}
		if((_a>140&&_a<=180)||(_a<-140&&_a>=-180)){return this._DEF_DIR._R;}
		if(_a<-130&&_a>=-140){return this._DEF_DIR._RD;}
		if(_a<-50&&_a>=-130){return this._DEF_DIR._D;}
		if(_a<-40&&_a>=-50){return this._DEF_DIR._LD;}
		//		return {'_rad':_a,'_dis':_d};
	},//_get_st
	_set_reset(){
		//コントローラーの位置を元に戻す
		let _c1=
			document
				.querySelector('.sp_controller_main_center');
		_c1.style.left='';
		_c1.style.top='';
	},//_set_reset
	_set_obj(){
		this._sp_main_center=
			document.querySelector('.sp_controller_main_center');
		this._sp_main=
			document.querySelector('.sp_controller_main');
		this._sp_bt_hide=
			document.querySelector('.sp_controller_bt.hide');
		this._sp_bt_r=
			document.querySelector('.sp_controller_bt.r');
		this._sp_bt_p=
			document.querySelector('.sp_controller_bt.p');
		this._sp_bt_s=
			document.querySelector('.sp_controller_bt.s');
		this._sp_bt_b=
			document.querySelector('.sp_controller_bt.b');
		this._sp_bt_a=
			document.querySelector('.sp_controller_bt.a');
	}
}

class GameObject_PM{
	constructor(_src,_sx,_sy){
		let _this=this;
		_this.img=_CANVAS_IMGS[_src].obj;
		_this.x=(_CANVAS.width/2)-
				(_this.img.width/2);
				_this.y=_CANVAS.height-30;

		_this.meterdef_status='111111';
		_this.meterdef_current='000000';

		_this.meterdef={
			'n_32':{
				imgobj:new Image(),
				name:'meter_c_speedup',
				func:function(){
					if(_PLAYERS_MAIN.accel>=18){
						_this._set_meter_status();
						return;
					}
					_PLAYERS_MAIN.accel+=2;
				}
			},
			'n_16':{
				imgobj:new Image(),
				name:'meter_c_missile',
		  		func:function(){
					_PLAYERS_MISSILE_ISALIVE=true;
					_this._set_meter_status();
				}
		  	},
			'n_8':{
				imgobj:new Image(),
				name:'meter_c_double',
		  		func:function(){
					_SHOTTYPE=_SHOTTYPE_DOUBLE;
					_this._set_meter_status();
				}
		  	},
			'n_4':{
				imgobj:new Image(),
				name:'meter_c_laser',
		  		func:function(){
					_SHOTTYPE=_SHOTTYPE_LASER;
					_this._set_meter_status();
				}
		  	},
			'n_2':{
				imgobj:new Image(),
				name:'meter_c_option',
		  		func:function(){
					_PLAYERS_OPTION[_PLAYERS_OPTION_ISALIVE].settruealive();
					_PLAYERS_OPTION_ISALIVE++;

					if(_PLAYERS_OPTION_ISALIVE
						<_PLAYERS_OPTION_MAX){return;}
					_this._set_meter_status();
				}
		  	},
			'n_1':{
				imgobj:new Image(),
				name:'meter_c_shield',
		  		func:function(){
					_PLAYERS_MAIN_FORCE.init();
					_this._set_meter_status();
				}
		  	}
		};

		//パワーメータ選択画像
		_this._c_pms=0;//カレントの位置
		_this.pms_img=_CANVAS_IMGS_INIT['gradius_powermeterselect'].obj;
		//SPEEDUP〜OPTION選択済定義
		_this.pms_selected=[
			{_y:89,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_0.obj},
			{_y:162,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_1.obj},
			{_y:233,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_2.obj},
			{_y:306,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_3.obj}
		];
		//SHIELD選択済定義
		_this._c_pmss=0;//カレントの位置
		_this.pmss_selected=[
			{_x:470,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_shield_0.obj},
			{_x:570,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_shield_1.obj}
		];

	}
	init(){}
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
		let _mc=parseInt(this.meterdef_current,2);
		let _ms=parseInt(this.meterdef_status,2);
		//メーターにアクティブなし
		if(_mc===0){return;}
		//メーターにアクティブあるが、すでに装備ずみ
		if((_mc&_ms)===0){return;}

		//自機のパワーアップ演出
		_PLAYERS_MAIN.set_equipped();
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

		_GAME._setDrawTextToFont(
				'power meter select',
				(_CANVAS.width/2)
					-(36*('power meter select').length/2),
				20,
				0.6
			);

		_GAME._setDrawTextToFont(
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
	pms_select(){
		//パワーメータ選択済み
		let _c_img=this.pms_selected[this._c_pms]._img;
		_CONTEXT.drawImage(
			_c_img,
			(_CANVAS.width/2)-(this.pms_img.width/2),
			this.pms_selected[this._c_pms]._y,
			_c_img.width,
			_c_img.height
		);
		//SHIELDパワーメータ選択済み
		_c_img=this.pmss_selected[this._c_pmss]._img;
		_CONTEXT.drawImage(
			_c_img,
			this.pmss_selected[this._c_pmss]._x,
			390,
			_c_img.width,
			_c_img.height
		);
	}

}

class GameObject_STAGESELECT{
	constructor(){
		this.x=0;
		this.y=0;
		this.speed=100;

		this.mapdef_status=0;
		this.mapdef=_MAPDEFS[this.mapdef_status];
	}
	get_ajaxdata(_d,_t){
		_t.mapdef=_d[_t.mapdef_status];
		if(_ISDEBUG){return;}
		_t.disp_thumb_map();
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
	set_map_status(){
		this.mapdef=_MAPDEFS[this.mapdef_status];
	}
	disp_thumb_map(){
		let _this=this;
//		let _map=new GameObject_MAP(0);
		//描画は横は50〜950px
		_CONTEXT.clearRect(0,0,
					_CANVAS.width,
					_CANVAS.height);
		//テキスト表示
		_GAME._setDrawTextToFont(
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
		let _md=_this.mapdef;		
		_MAP.showMapForStageselect(_md);

		//左カラム表示
		_CONTEXT.beginPath();
		_CONTEXT.lineWidth=1;
		_CONTEXT.strokeStyle='rgba(255,255,255,1)';
		_CONTEXT.fillStyle='rgba(255,255,255,1)';
		_CONTEXT.strokeRect(50,130,300,200);

		//テキスト表示
		_GAME._setDrawTextToFont('stage title',400,130,0.3);
		_CONTEXT.moveTo(400,160);
		_CONTEXT.lineTo(950,160);
		_CONTEXT.stroke();
		_CONTEXT.font='20px sans-serif';
		let _ar=_GAME._multilineText(_CONTEXT,this.mapdef._title,550);
		for(let _i=0;_i<((_ar.length>2)?2:_ar.length);_i++){
			_CONTEXT.fillText(_ar[_i],400,190+(_i*26));
		}

		_GAME._setDrawTextToFont(('difficult:'+this.mapdef._difficult),400,230,0.3);
		_CONTEXT.moveTo(400,260);
		_CONTEXT.lineTo(950,260);
		_CONTEXT.stroke();

		_GAME._setDrawTextToFont('detail',400,300,0.3);
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
		_GAME._setDrawTextToFont(_s,180,10,0.3);

		_s='hi'+('        '+this.scorehi).slice(-8);
		_GAME._setDrawTextToFont(_s,400,10,0.3);

		_s='2p'+('        '+this.score2p).slice(-8);
		_GAME._setDrawTextToFont(_s,620,10,0.3);
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
		_this._c_pc_ani=0;
		_this.img=
			(_this.type==='red')
				?_CANVAS_IMGS['pc_red'].obj
				:_CANVAS_IMGS['pc_blue'].obj;
	}
	getPCCenterPosition(){
		let _this=this;
		//スプライト画像のため1コマ（正方形）
		return {_x:_this.x+(_this.img.height/2),
				_y:_this.y+(_this.img.height/2)}
	}
	getPowerCapcell(){this.gotpc=true;}
	move(){
		let _this=this;
		//すでにパワーカプセル取得済みは終了
		if(_this.gotpc){return;}
		_this.x=_MAP.getX(_this.x);
		_this.y=_MAP.getY(_this.y);

		//パワーカプセル所持の場合
		let _w=parseInt(_this.img.width/_this.img.height);
		let _s=_this.img.height;

		_this._c_pc_ani=
			(_this._c_pc_ani>=(_w*5)-1)
				?0:_this._c_pc_ani+1;
		_CONTEXT.drawImage(
			_this.img,
			_s*parseInt(_this._c_pc_ani/5),
			0,
			_s,
			_s,
			_this.x,
			_this.y,
			_s,
			_s
		);
	}
}


class GameObject_BACKGROUND{
	constructor(){
		this.x=_CANVAS.width*Math.random();
		this.y=_CANVAS.height*Math.random();
		this.rgba=
				"rgba("+
				parseInt(Math.random()*255)+","+
				parseInt(Math.random()*255)+","+
				parseInt(Math.random()*255)+","+
				Math.random()+")";
		this.speed=Math.random()*5;

		this.move_flash_count=0;
		this._r=1;
	}
	init(){
		this._r=Math.random()+this._r;
	}
	move_flash(){
		
	}
	move(){
		let _this=this;
//		_this.x=_MAP.getX(_this.x);
		_this.x=(_this.x<0)
					?_CANVAS.width
					:_this.x;
		_this.x-=(_BACKGROUND_SPEED===0)
					?0
					:_this.speed;

		_CONTEXT.beginPath();
        _CONTEXT.arc(_this.x,_this.y,_this._r,0,Math.PI*2,true);
        _CONTEXT.fillStyle=this.rgba;
        _CONTEXT.fill();
	}
}

//自機とパワーカプセルの取得
const _IS_GET_POWERCAPSELL=()=>{
//	if(!_PLAYERS_MAIN.isalive()){return;}
	for(let _i=0;_i<_POWERCAPSELLS.length;_i++){
		if(_POWERCAPSELLS[_i].gotpc){
			_POWERCAPSELLS.splice(_i,1);
		}
	}

	for(let _i=0;_i<_POWERCAPSELLS.length;_i++){
		let _pwc=_POWERCAPSELLS[_i];
		if(_pwc.gotpc){continue;}

		let _pl=_PLAYERS_MAIN.getPlayerCenterPosition();
		let _pwc_c=_pwc.getPCCenterPosition();

		let _a=Math.sqrt(
			Math.pow(_pwc_c._x-_pl._x,2)+
			Math.pow(_pwc_c._y-_pl._y,2)
			);
		let _d=Math.sqrt(
			Math.pow(_PLAYERS_MAIN.width,2)+
			Math.pow(_PLAYERS_MAIN.height,2)
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
	if(!_PLAYERS_MAIN.isalive()){return;}

	for(let _i=0;_i<_ENEMIES.length;_i++){
		//非表示・かつ生存してない場合は、要素から外す
		if(!_ENEMIES[_i].isshow()
			&&!_ENEMIES[_i].isalive()){
			_ENEMIES.splice(_i,1);
		}
	}

	let _e=_ENEMIES;

	if(_SHOTTYPE===_SHOTTYPE_LASER){
	//	console.log('100:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)
		for(let _j=0;
			_j<_PLAYERS_SHOTS[_SHOTTYPE].length;
			_j++){
		let _os=_PLAYERS_SHOTS[_SHOTTYPE][_j];
		let _ma=_CANVAS.width;
		let _now_laser_MaxX=_os.shots[0]._laser_MaxX;
		// レーザーでは敵全部を回して、
		// 自機から一番近い耐久性がある敵まで
		// レーザーを表示させる。
		for(let _i=0;_i<_e.length;_i++){
			//スタンバイ状態は無視する
			if(_e[_i].isStandBy()){continue;}
			if(!_e[_i].isalive()){continue;}
			let _oe=_e[_i];
			let _m=_os.enemy_collision(_oe);
			_ma=(_ma>_m)?_m:_ma;
	//		console.log(_ma);
		}//_i
		//衝突はあったが、すでにレーザーが進んでる場合は、
		//そのまま突き進む
		_os.shots[0]._laser_MaxX=
			(_os.shots[0].x<_ma)
				?_ma
				:_os.shots[0]._laser_MaxX;
		}//_j
	}else if(_SHOTTYPE!==_SHOTTYPE_LASER){
		for(let _j=0;
			_j<_PLAYERS_SHOTS[_SHOTTYPE].length;
			_j++){
		let _os=_PLAYERS_SHOTS[_SHOTTYPE][_j];
		for(let _i=0;_i<_e.length;_i++){
			//スタンバイ状態は無視する
			if(_e[_i].isStandBy()){continue;}		
			if(!_e[_i].isalive()){continue;}
			let _oe=_e[_i];
			_os.enemy_collision(_oe);
	//		console.log(_ma);
		}//_i
		}//_j
	}
	
//	console.log('101:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)
	for(let _i=0;_i<_e.length;_i++){
	let _oe=_e[_i];
	//スタンバイ状態は無視する
	if(_oe.isStandBy()){continue;}
	if(!_oe.isalive()){continue;}

	//自機衝突判定
	_PLAYERS_MAIN.enemy_collision(_oe);
	_PLAYERS_MAIN_FORCE.enemy_collision(_oe);

	//ミサイルが装備されていない場合は無視する
	if(!_PLAYERS_MISSILE_ISALIVE){continue;}
	for(let _k=0;_k<_PLAYERS_MISSILE.length;_k++){
		let _pm=_PLAYERS_MISSILE[_k];
		if(!_pm.player.isalive()){continue;}
		for(let _j=0;_j<_pm.shots.length;_j++){
			let _pms=_pm.shots[_j];
			_pm.enemy_collision(_oe,_pms);
		}//_j
	}//_k

	}//_i
//	console.log('102:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)

}

//敵ショットによる衝突判定
const _IS_ENEMIES_SHOT_COLLISION=()=>{
	if(!_PLAYERS_MAIN.isalive()){return;}

	for(let _i=0;_i<_ENEMIES_SHOTS.length;_i++){
		//非表示・かつ生存してない場合は、要素から外す
		if(!_ENEMIES_SHOTS[_i].isshow()
			&&!_ENEMIES_SHOTS[_i].isalive()){
			_ENEMIES_SHOTS.splice(_i,1);
		}
	}

	for(let _i=0;_i<_ENEMIES_SHOTS.length;_i++){
		let _e=_ENEMIES_SHOTS[_i];
		if(!_e._shot_alive){continue;}
		//自機衝突判定
		_PLAYERS_MAIN.enemy_shot_collision(_e);
		_PLAYERS_MAIN_FORCE.enemy_shot_collision(_e);
	}
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

	let _c=0;
	const _loop=function(){
		_DRAW_SETINTERVAL=window.requestAnimationFrame(_loop);		
		_CONTEXT.clearRect(0,0,
					_CANVAS.width,
					_CANVAS.height);
//		console.log('t')
		// console.log('0:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)
			
		//BACKGROUNDを表示
		for(let _i=0;_i<_BACKGROUND_STAR_MAX;_i++){
			_BACKGROUND[_i].move();
		}
		// console.log('2:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)
		//敵の弾を表示
		for(let _i=0;_i<_ENEMIES_SHOTS.length;_i++){
			_ENEMIES_SHOTS[_i].move();
		}
		// console.log('3:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)
		//敵を表示
		for(let _i=0;_i<_ENEMIES.length;_i++){
			if(_ENEMIES[_i]===undefined){continue;}
			_ENEMIES[_i].move();
		}
		// console.log('4:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)
		//MAP位置設定
		_MAP.move();
		// console.log('5:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)

		_IS_GET_POWERCAPSELL();
		// console.log('6:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)
 		//敵、衝突判定
		_IS_ENEMIES_SHOT_COLLISION();
		// console.log('7:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)
		_IS_ENEMIES_COLLISION();
		// console.log('8:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)
		//MAP（衝突判定）
		_MAP.isPlayersShotCollision();
		// console.log('9:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)
		//敵、衝突表示
		_DRAW_ENEMIES_COLLISIONS();
		// console.log('10:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)
 
//		console.log('t')
		//パワーカプセルを表示
		for(let _i=0;_i<_POWERCAPSELLS.length;_i++){
			_POWERCAPSELLS[_i].move();			
		}

		//ショットを表示
		for(let _i=0;_i<_PLAYERS_MAX;_i++){
			if(_PLAYERS_MISSILE_ISALIVE){
				_PLAYERS_MISSILE[_i].move();
			}
			_PLAYERS_SHOTS[_SHOTTYPE][_i].move();
		}
		// console.log('11:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)

		//自機からひもづくオプションを表示
		for(let _i=0;_i<_PLAYERS_OPTION_MAX;_i++){
			_PLAYERS_OPTION[_i].move(10*(_i+1));
		}
		// console.log('12:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)

		//自機を表示
		_PLAYERS_MAIN_FORCE.move(_PLAYERS_MAIN);
		_PLAYERS_MAIN.move();
		// console.log('13:'+_PLAYERS_SHOTS._SHOTTYPE_LASER[0].shots[0]._laser_MaxX)

		//MAP表示設定
		_MAP.map_draw();
		//DRAW POWER METERを表示
		_POWERMETER.show();
		//SCOREを表示
		_SCORE.show();

		
		// if(_MAP_SCROLL_POSITION_X-100<=
		// 	(_MAP.mapdef[0].length*_MAP.t)+_MAP.initx){return;}
		if(!_MAP.isboss){return;}

		//MATCH_BOSS
		_DRAW_MATCH_BOSS();

	};

	_DRAW_SETINTERVAL=window.requestAnimationFrame(_loop);
}

const _DRAW_MATCH_BOSS=()=>{
	_MAP.setBackGroundSpeedY(0);
	_MAP.setInifinite(false);
	if(!_DRAW_IS_MATCH_BOSS){
		if(_MAP.map_boss===''
			||_MAP.map_boss===undefined
			||_MAP_ENEMIES_BOSS[_MAP.map_boss]===undefined){
			_DRAW_GAMECLEAR();
		}
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

	const _this=_PLAYERS_MAIN;
	if(_this===undefined){return;}
	//自機の爆発表示
	let _si=null;
	let _pl=_this.getPlayerCenterPosition();
	_GAME._setPlay(_CANVAS_AUDIOS['vicviper_bomb']);

	const _loop=function(){
		_si=window.requestAnimationFrame(_loop);		
		if(_this._col_ani_c
			>=(_this.col_ani.length*10)-1){
			//アニメーションが終わったら終了
			cancelAnimationFrame(_si);
			_DRAW_GAMEOVER();
			return;
		}

		let _c=parseInt(_this._col_ani_c/10);
		let _w=_this.col_ani[_c].img.width;
		let _h=_this.col_ani[_c].img.height;
		let _sw=_w*_this.col_ani[_c].scale;
		let _sh=_h*_this.col_ani[_c].scale;
		_CONTEXT.drawImage(
			_this.col_ani[_c].img,
			_pl._x-(_sw/2),
			_pl._y-(_sh/2),
			_sw,
			_sh
		);
		_this._col_ani_c++;

	};
	_si=window.requestAnimationFrame(_loop);		
}	
const _DRAW_PLAYERS_SHOTS=()=>{
	let _date=new Date();
	const _loop=function(){
		_PLAYERS_SHOTS_SETINTERVAL=window.requestAnimationFrame(_loop);	
		let _d=new Date();
		if(_d-_date<50){return;}
		_date=new Date();
		//ショット
		for(var _i=0;_i<_PLAYERS_SHOTS[_SHOTTYPE].length;_i++){
			let _ps=_PLAYERS_SHOTS[_SHOTTYPE][_i];
			if(!_ps.player._isalive){continue;}
			//ここで同時ショットと
			//個別ショットで判別させる
			if(_SHOTTYPE===_SHOTTYPE_DOUBLE){
				if(_ps.shots[0]._shot_alive||
					_ps.shots[1]._shot_alive){continue;}
				_ps.shots[0]._shot=true;
				_ps.shots[1]._shot=true;
				//最初の要素（自機）のみショット音をだす
				if(_i!==0){continue;}
				_GAME._setPlay(_ps.shots[0]._audio);
				continue;
			}

			_ps._sq=
			(_ps._sq===_ps.shots.length-1)
				?0
				:_ps._sq+1;
			var _s=_ps.shots[_ps._sq];

			if(_s._shot_alive){continue;}
			//ショット中は、ショットを有効にしない
			_s._shot=true;

			//最初の要素（自機）のみショット音をだす
			if(_i!==0){continue;}
			_GAME._setPlay(_s._audio);
		}

		if(!_PLAYERS_MISSILE_ISALIVE){return;}
		//ミサイル
		for(var _i=0;_i<_PLAYERS_MISSILE.length;_i++){
			let _pm=_PLAYERS_MISSILE[_i];
			if(!_pm.player._isalive){continue;}
			//ここで同時ショット(2WAY)と
			//個別ショットで判別させる
			if(_PLAYERS_POWER_METER===3){
				if(_pm.shots[0]._shot_alive||
					_pm.shots[1]._shot_alive){continue;}
				_pm.shots[0]._shot=true;
				_pm.shots[1]._shot=true;
				//最初の要素（自機）のみショット音をだす
				if(_i!==0){continue;}
				_GAME._setPlay(_pm.shots[0]._audio);
				continue;
			}

			_pm._sq=
				(_pm._sq===_pm.shots.length-1)?
					0
					:_pm._sq+1;
			var _sm=_pm.shots[_pm._sq];
			//ショット中は、ショットを有効にしない
			if(_sm._shot_alive){continue;}
			_sm._shot=true;
			//最初の要素（自機）のみショット音をだす
			if(_i!==0){continue;}
			_GAME._setPlay(_sm._audio);
		}
	}
	_PLAYERS_SHOTS_SETINTERVAL=window.requestAnimationFrame(_loop);	
}

const _DRAW_STOP=()=>{
//	clearInterval(_DRAW_SETINTERVAL);
	cancelAnimationFrame(_DRAW_SETINTERVAL);
	_DRAW_SETINTERVAL=null;
}
const _DRAW_STOP_GAMESTART=()=>{
	cancelAnimationFrame(_DRAW_GAMESTART_SETINTERVAL);
	_DRAW_GAMESTART_SETINTERVAL=null;
}
const _DRAW_STOP_PLAYERS_SHOTS=()=>{
	cancelAnimationFrame(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;
	for(var _i=0;_i<_PLAYERS_SHOTS[_SHOTTYPE].length;_i++){
		let _ps=_PLAYERS_SHOTS[_SHOTTYPE][_i];
		for(let _j=0;_j<_ps.shots.length;_j++){
			_ps.shots[_j]._shot=false;
		}
	}
	for(var _i=0;_i<_PLAYERS_MISSILE.length;_i++){
		let _pm=_PLAYERS_MISSILE[_i];
		for(let _j=0;_j<_pm.shots.length;_j++){
			_pm.shots[_j]._shot=false;
		}
	}
}

const _DRAW_SELECT_POWERMETER=()=>{
	_DRAW_STOP_PLAYERS_SHOTS();
	_KEYEVENT_MASTER.removeKeydownSelectPowermeter();
	let _c=0;
	let _si=null;
	const _loop=function(){
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
			cancelAnimationFrame(_si);			
			_DRAW_INIT_OBJECT();
		}
		_c++;
	};
	_si=window.requestAnimationFrame(_loop);
}

const _DRAW_GAMESTART=()=>{
	_KEYEVENT_MASTER.removeKeydownGame();
	_KEYEVENT_MASTER.removeKeyupGame();

	if(_ISDEBUG){_DRAW();return;}
	let _c=0;
	const _loop=function(){
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
			_GAME._setDrawTextToFont(
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
	_GAME._setDrawTextToFont(
		_s,
		(_CANVAS.width/2)-(60*_s.length/2),
		(_CANVAS.height/2)-(60/2)-40,
		1.0);

	_s='press r to restart';
	_GAME._setDrawTextToFont(
			_s,
			(_CANVAS.width/2)
	 			-(18*_s.length/2),
			(_CANVAS.height/2)+30,
			0.3
		);
	_s='press s to change to another stage';
	_GAME._setDrawTextToFont(
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

	_DRAW_STOP_PLAYERS_SHOTS();

	_KEYEVENT_MASTER.addKeydownGameover();
	_CONTEXT.clearRect(0,0,
				_CANVAS.width,
				_CANVAS.height);

	//BACKGROUND
	for(let _i=0;_i<_BACKGROUND_STAR_MAX;_i++){
		_BACKGROUND[_i].move();
	}

	//SCORE
	_SCORE.show();

	var _img=_CANVAS_IMGS_INIT['font'].obj;
	let _s='gameover';
	_GAME._setDrawTextToFont(
		_s,
		(_CANVAS.width/2)-(60*_s.length/2),
		(_CANVAS.height/2)-(60/2)-40,
		1.0);

	_s='press r to restart';
	_GAME._setDrawTextToFont(
			_s,
			(_CANVAS.width/2)
				-(18*_s.length/2),
			(_CANVAS.height/2)+30,
			0.3
		);
	_s='press s to change to another stage';
	_GAME._setDrawTextToFont(
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

	for(let _i=0;_i<_ENEMIES_COLLISIONS.length;_i++){
		_ENEMIES_COLLISIONS[_i].move();
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

	clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;
	_DRAW_STOP();

	_CONTEXT.clearRect(0,0,
				_CANVAS.width,
				_CANVAS.height);

	_PLAYERS_MAIN='';
	_PLAYERS_MAIN_FORCE='';
	_PLAYERS_MOVE_FLAG=false;
	_PLAYERS_OPTION=[];
	_PLAYERS_OPTION_ISALIVE=0;
	_PLAYERS_SHOTS={
		'_SHOTTYPE_NORMAL':[],
		'_SHOTTYPE_DOUBLE':[],
		'_SHOTTYPE_LASER':[]
	};
	_PLAYERS_MISSILE=[];
	_PLAYERS_MISSILE_ISALIVE=false;
	_PLAYERS_MOVE_DRAW_X=[];
	_PLAYERS_MOVE_DRAW_Y=[];
	_ENEMIES=[];
	_ENEMIES_SHOTS=[];
	_ENEMIES_COLLISIONS=[];
	_POWERMETER='';
	_SHOTTYPE=_SHOTTYPE_NORMAL;

	_POWERCAPSELLS=[];

	_MAP_SCROLL_POSITION_X=0;
	_MAP_SCROLL_POSITION_Y=0;

	_DRAW_IS_MATCH_BOSS=false;
	_DRAW_IS_MATCH_BOSS_COUNT=0;
}

const _DRAW_INIT_OBJECT=()=>{
	_KEYEVENT_MASTER	//パワーメータイベント削除
		.removeKeydownSelectPowermeter();

	//自機の設定
	_PLAYERS_MAIN=(
			(_PLAYERS_POWER_METER===0
				||_PLAYERS_POWER_METER===2)
			?new GameObject_PLAYER_MAIN()
			:new GameObject_PLAYER_MAIN_RED()
		);
	_PLAYERS_SHOTS._SHOTTYPE_NORMAL.push(
		new GameObject_SHOTS_NORMAL(_PLAYERS_MAIN));
	_PLAYERS_SHOTS._SHOTTYPE_DOUBLE.push(
		(function(_o){
			if(_PLAYERS_POWER_METER===0
				||_PLAYERS_POWER_METER===2){
				return new GameObject_SHOTS_DOUBLE(_o);
			}else{
				return new GameObject_SHOTS_TAILGUN(_o);
			}
		})(_PLAYERS_MAIN)
	);
	_PLAYERS_SHOTS._SHOTTYPE_LASER.push(
		(function(_o){
			if(_PLAYERS_POWER_METER===0){
				return new GameObject_SHOTS_LASER(_o);
			}else if(_PLAYERS_POWER_METER===1){
				return new GameObject_SHOTS_LASER_CYCLONE(_o);
			}else if(_PLAYERS_POWER_METER===2){
				return new GameObject_SHOTS_RIPPLE_LASER(_o);
			}else if(_PLAYERS_POWER_METER===3){
				return new GameObject_SHOTS_RIPPLE_LASER_RED(_o);
			}else{
			}
		})(_PLAYERS_MAIN)
	);

	_PLAYERS_MISSILE.push(
		(function(_o){
			if(_PLAYERS_POWER_METER===0){
				return new	GameObject_SHOTS_MISSILE(_o);
			}else if(_PLAYERS_POWER_METER===1){
				return new	GameObject_SHOTS_MISSILE_SPREADBOMB(_o);
			}else if(_PLAYERS_POWER_METER===2){
				return new	GameObject_SHOTS_MISSILE_PHOTOM(_o);
			}else if(_PLAYERS_POWER_METER===3){
				return new	GameObject_SHOTS_MISSILE_2WAY(_o);
			}
		})(_PLAYERS_MAIN)
	);

	_PLAYERS_MAIN_FORCE=
		(function(){
			if(_PLAYERS_POWER_METER===0
				||_PLAYERS_POWER_METER===2){
				return ((_PLAYERS_POWER_METER_SHIELD===1)
					?new GameObject_FORCEFIELD()
					:new GameObject_SHIELD()
				);
			}else{
				return ((_PLAYERS_POWER_METER_SHIELD===1)
					?new GameObject_FORCEFIELD_RED()
					:new GameObject_SHIELD_RED()
				);
			}
		})();

	//OPTIONの設定
	for(let _i=0;_i<_PLAYERS_OPTION_MAX;_i++){
		_PLAYERS_OPTION.push(
			new GameObject_PLAYER_OPTION(
				'option',110,70*(_i+1),false)
			);
		_PLAYERS_SHOTS._SHOTTYPE_NORMAL.push(
			new GameObject_SHOTS_NORMAL(
							_PLAYERS_OPTION[_i])
			);
		_PLAYERS_SHOTS._SHOTTYPE_DOUBLE.push(
			(function(_o){
				if(_PLAYERS_POWER_METER===0
					||_PLAYERS_POWER_METER===2){
					return new GameObject_SHOTS_DOUBLE(_o);
				}else{
					return new GameObject_SHOTS_TAILGUN(_o);
				}
			})(_PLAYERS_OPTION[_i])
		);
		_PLAYERS_SHOTS._SHOTTYPE_LASER.push(
			(function(_o){
				if(_PLAYERS_POWER_METER===0){
					return new GameObject_SHOTS_LASER(_o);
				}else if(_PLAYERS_POWER_METER===1){
					return new GameObject_SHOTS_LASER_CYCLONE(_o);
				}else if(_PLAYERS_POWER_METER===2){
					return new GameObject_SHOTS_RIPPLE_LASER(_o);
				}else if(_PLAYERS_POWER_METER===3){
					return new GameObject_SHOTS_RIPPLE_LASER_RED(_o);
				}else{
				}
			})(_PLAYERS_OPTION[_i])
		);

		_PLAYERS_MISSILE.push(
			(function(_o){
				if(_PLAYERS_POWER_METER===0){
					return new	GameObject_SHOTS_MISSILE(_o);
				}else if(_PLAYERS_POWER_METER===1){
					return new	GameObject_SHOTS_MISSILE_SPREADBOMB(_o);
				}else if(_PLAYERS_POWER_METER===2){
					return new	GameObject_SHOTS_MISSILE_PHOTOM(_o);
				}else if(_PLAYERS_POWER_METER===3){
					return new	GameObject_SHOTS_MISSILE_2WAY(_o);
				}
			})(_PLAYERS_OPTION[_i])
		);
	}

	//METER
	_POWERMETER=
		new	GameObject_PM('meter');
	_POWERMETER.init();

	//SCORE
	if(!_DRAW_IS_GAMECLEAR){
		//クリアしていなければスコアをリセット
		_SCORE.init();
	}
	_DRAW_IS_GAMECLEAR=false;

	//BACKGROUND
	for(let _i=0;_i<_BACKGROUND_STAR_MAX;_i++){
		_BACKGROUND[_i]=new GameObject_BACKGROUND();
		_BACKGROUND[_i].init();
	}

	//MAP
	_MAP.init_stage_map();

	_DRAW_GAMESTART();
}

const _DRAW_POWER_METER_SELECT=()=>{
	clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;

	_CONTEXT.clearRect(0,0,
				_CANVAS.width,
				_CANVAS.height);

	_KEYEVENT_MASTER.removeKeydownSelectStage();
	_KEYEVENT_MASTER.addKeydownSelectPowermeter();

	_POWERMETER=new	GameObject_PM('meter');
	_POWERMETER.pms_disp();
	_POWERMETER.pms_select();
}

const _DRAW_STAGE_SELECT=()=>{
	clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
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
	_KEYEVENT_MASTER.addKeydownSelectStage();

	_MAP.init(function(){
		_STAGESELECT=new GameObject_STAGESELECT();
		_STAGESELECT.init();
	});
	_GAME._setPlayOnBG(_CANVAS_AUDIOS['bg_powermeterselect']);
}

const _DRAW_AUDIO_INIT=(_obj,_func)=>{
	let _audioLoadedCount=0;
	let _alertFlag=false;
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
					if(_audioLoadedCount>=
						Object.keys(_obj).length){
							_DRAW_INIT(_CANVAS_IMGS_INIT,_GAME._init);
					}
					//ローディングに進捗率を表示させる
					_gsl_r.innerHTML=parseInt(_audioLoadedCount/Object.keys(_obj).length*100)+'%';
				},
				function(_error){
					alert('一部音声読み込みに失敗しました。再度立ち上げなおしてください:'+_error);
					return;
				});
		};
		_r.send();
	}
}
const _DRAW_INIT=(_obj,_func)=>{
//	return new Promise(function(_res,_rej){
	let _imgLoadedCount=0;
	let _alertFlag=false;
	for(let _i in _obj){
		let _o=_obj[_i];
		_o.obj.src=_obj[_i].src;
		_o.obj.onload=function(){
			_o.obj.width*=_o.rate;
			_o.obj.height*=_o.rate;
			_imgLoadedCount++;
			if(_imgLoadedCount>=
				Object.keys(_obj).length){
				_func();
//				alert(_imgLoadedCount);
//				_res();
//				return;
			}
			let _s=parseInt(_imgLoadedCount/Object.keys(_obj).length*100);
			//ローディングに進捗率を表示させる
			_GAME._setTextToFont(
				document.querySelector('#game_start>.text_loading'),
				 'now loading '+_s+' per',30);
		}
		_o.obj.onabort=function(){
		}
		_o.obj.onerror=function(){
			if(_alertFlag){return;}
			_alertFlag=true;
			alert('一部画像読み込みに失敗しました。再度立ち上げなおしてください');
			return;
		}
	}
//	});//promise
}


const _GAME={//ゲーム用スクリプト
_url_params:new Array(),
_init(){
	//マップ用jsonを取得したあとに、
	//スタート画面をコールバックで表示させる
	//SCORE
	_SCORE=new GameObject_SCORE();
	_MAP=new GameObject_MAP();
	_MAP.init(_GAME._showGameStart);
},
_txt:{//スプライトされたフォントのマッピング
	"0":"0",
	"1":"60",
	"2":"120",
	"3":"180",
	"4":"240",
	"5":"300",
	"6":"360",
	"7":"420",
	"8":"480",
	"9":"540",
	"a":"600",
	"b":"660",
	"c":"720",
	"d":"780",
	"e":"840",
	"f":"900",
	"g":"960",
	"h":"1020",
	"i":"1080",
	"j":"1140",
	"k":"1200",
	"l":"1260",
	"m":"1320",
	"n":"1380",
	"o":"1440",
	"p":"1500",
	"q":"1560",
	"r":"1620",
	"s":"1680",
	"t":"1740",
	"u":"1800",
	"v":"1860",
	"w":"1920",
	"x":"1980",
	"y":"2040",
	"z":"2100",
	":":"2160"
},
_audio_buffer_loader:null,
_audio_now_obj_bg:null,//バックグラウンド現在再生用
_audio_context_source_bg:null,//バックグラウンド再生用
_is_audio_context_source_bg:false,//バックグラウンド再生中判別フラグ
_ac:{
	//_DRAWのsetIntervalのアニメに併せ
	//アニメカウントを調整させる
	//_c:カウント
	//_a:配列
	//_p:割合
	_get:function(_c,_a,_p){//カウントの取得
		return (_c>=(_a.length*_p)-1)?0:_c+1;
	}
},
getRad(_o1,_o2){
	//各オブジェクトが持つx,yによるラジアン取得
	//_o1:自機
	//_o2:自機に対するオブジェクト
	//{x:000,y:000}形式
	if(_o1===undefined||_o2===undefined){return;}
	return Math.atan2((_o1.y-_o2.y),(_o1.x-_o2.x));
},
getDeg(_o1,_o2){
	//各オブジェクトが持つx,yからの角度取得
	if(_o1===undefined||_o2===undefined){return;}
	const _rad=Math.atan2((_o1.y-_o2.y),(_o1.x-_o2.x));
	return _rad/Math.PI*180;
},
getRadToDeg(_rad){
	//ラジアンから角度を取得する
	if(_rad===undefined||_rad===''){return null;}
	return _rad/Math.PI*180;
},
getBit(_bit,_len){
	return ('0'.repeat(_len)+_bit).slice(_len*-1);
},
getOrBit(_b1,_b2,_l){
	let _s=(parseInt(_b1,2)
			|parseInt(_b2,2)
		).toString(2);
	return this.getBit(_s,_l);
},
setUrlParams(){
	var _prm=location.search.slice(1).split(/(&|&amp;)/);
	for(var _i=0;_i<_prm.length;_i++){
			var _p=_prm[_i].replace('amp;','').split('=');
			if(_p[0]===''||_p[0]===undefined){continue;}
			if(_p[0]==='&'){continue;}
			this._url_params[_p[0]]=_p[1];
	}
},
isShotCanvasOut(_t){
	if(_t.x<-50
		||_t.x>_CANVAS.width+50
		||_t.y<-50
		||_t.y>_CANVAS.height+50
		){
		return true;
	}
	return false;
},
isEnemyCanvasOut(_oe,_dir){
	//_dir {up,right,down,left}
	//	trueまたはfalseを指定
	let _e=_oe.getEnemyCenterPosition();
	let _d=_dir||{up:true,down:true,left:true,right:true}
	let _e_w=_oe.img.width;
	let _e_h=_oe.img.height;

	if((_e._x<0-_e_w&&_d.left===true)
		||(_e._x>_CANVAS.width+_e_w&&_d.right===true)
		||(_e._y<0-_e_h&&_d.up===true)
		||(_e._y>_CANVAS.height+_e_h&&_d.down===true)
		){
			return true;
		}
	return false;

},
isSqCollision(_s1,_s1_n,_s2,_s2_n,_d){
	return (this.isSqCollision_laser(_s1,_s1_n,_s2,_s2_n,_d)).ret;
},
isSqCollision_laser(_s1,_s1_n,_s2,_s2_n,_d){
	//_s1四辺と、_s2(その中の複数の四辺)の衝突判定。
	//重なった場合は、衝突とする。
	//（1）_s1,_s2の中心点を取得

	//_s1:2座標"x1,y1,x2,y2,col"文字列
	//_s1_n:_s1の現在の座標（左上）"x,y"
	//_s2:2座標"x1,y1,x2,y2,col"文字列でかつ配列
	//_s2_n:_s2の現在の座標（左上）"x,y"
	// ※col:当たり判定にしない衝突
	//		false当たり判定にしない
	//_d:デバッグ用(true)
	//
	// return
	// _IS_SQ_COL(0):衝突している、かつ、あたり判定とする。
	// _IS_SQ_COL_NONE(1):衝突している、ただし、あたり判定はしない。
	// _IS_SQ_NOTCOL(2):衝突していない。
	let _s1_n_x=parseInt((_s1_n===undefined)?0:_s1_n.split(',')[0]);
	let _s1_n_y=parseInt((_s1_n===undefined)?0:_s1_n.split(',')[1]);
	let _s2_n_x=parseInt((_s2_n===undefined)?0:_s2_n.split(',')[0]);
	let _s2_n_y=parseInt((_s2_n===undefined)?0:_s2_n.split(',')[1]);

	let _s1_p=_s1.split(',');//s1ポイント
	let _s1_w=parseInt(_s1_p[2])-parseInt(_s1_p[0]);//幅
	let _s1_h=parseInt(_s1_p[3])-parseInt(_s1_p[1]);//高
	let _s1_l=Math.sqrt(
				Math.pow(_s1_w,2)+Math.pow(_s1_h,2)
			);//斜辺
	let _s1_c_x=(_s1_w/2)+_s1_n_x+parseInt(_s1_p[0]);//_s1の中心点x
	let _s1_c_y=(_s1_h/2)+_s1_n_y+parseInt(_s1_p[1]);//_s1の中心点y
	if(_d){
		console.log(_s1_c_x+":"+_s1_c_y);
	}
	//敵の複数衝突マップ分ループさせる
	for(let _i=0;_i<_s2.length;_i++){
		let _s2_p=_s2[_i].split(',');
		//1衝突マップの幅
		let _s2_w=parseInt(_s2_p[2])-parseInt(_s2_p[0]);
		//1衝突マップの高さ
		let _s2_h=parseInt(_s2_p[3])-parseInt(_s2_p[1]);
		//1衝突マップの当たり判定フラグ
		let _s2_col=(function(_f){
			if(_f===undefined){return true;}
			if(_f==='false'){return false;}
			return false;
		})(_s2_p[4]);

		//1衝突マップの斜辺
		let _s2_l=Math.sqrt(
			Math.pow(_s2_w,2)+Math.pow(_s2_h,2)
		);//斜辺
			
		let _s2_c_x=(_s2_w/2)+_s2_n_x+parseInt(_s2_p[0]);//_s2の中心点x
		let _s2_c_y=(_s2_h/2)+_s2_n_y+parseInt(_s2_p[1]);//_s2の中心点y
				
		//_s1（自機）と_s2（1衝突）中心点の距離とその斜辺
		let _d_x=Math.abs(_s2_c_x-_s1_c_x);
		let _d_y=Math.abs(_s2_c_y-_s1_c_y);
		let _d_l=Math.sqrt(
			Math.pow(_d_x,2)+Math.pow(_d_y,2)
		);//斜辺

		//衝突判定
		let _tmpx=_s2_n_x+parseInt(_s2_p[0]);
//		if(_d_l<(_s1_l/2)+(_s2_l/2)){
		if((_s1_w/2)+(_s2_w/2)>_d_x
			&&(_s1_h/2)+(_s2_h/2)>_d_y){
			return (_s2_col)
				?{ret:_IS_SQ_COL,val:_tmpx+10}
				:{ret:_IS_SQ_COL_NONE,val:_tmpx+10};
		}
	}//_i
	return {ret:_IS_SQ_NOTCOL,val:_CANVAS.width};
},
_showGameStart(){
	let _gsl=document
	.querySelector('#game_start_loading');
	_gsl.classList.remove('on');

	//SPのみコントローラーのオブジェクトを取得
	if(_ISSP){
		let _spc=document
		.querySelector('#sp_controller');
		_spc.classList.add('on');
			_SP_CONTROLLER._set_obj();
	}

	if(_ISDEBUG){
		let _gw=document
				.querySelector('#game_wrapper');
		_gw.classList.add('on');

		_STAGESELECT=new GameObject_STAGESELECT();
		_STAGESELECT.init();

		_MAP.set_stage_map_pattern(_MAP_PETTERN);

		_DRAW_INIT(_CANVAS_IMGS,_DRAW_POWER_METER_SELECT);

		return;
	}

	//スタート画面表示
	_KEYEVENT_MASTER.addKeydownStart();
	let _gsw=document
	  		.querySelector('#game_start_wrapper');
	_gsw.classList.add('on');

	_GAME._setTextToFont(
 		document.querySelector('#game_start>.title'),
 		'no pakuri',50);
	_GAME._setTextToFont(
		document.querySelector('#game_start>.text'),
 		'press s to start',30);
	_GAME._setTextToFont(
		document.querySelector('#game_start>.text_loading'),
 		'now loading',30);
},
_setDrawTextToFont(_s,_x,_y,_r){
	//キャンバス用にテキストからフォントに置換させる。
	//_s:テキスト
	//_x:テキスト開始x座標位置
	//_y:テキスト開始y座標位置
	//_r:文字表示比率(0.0〜1.0)
	let _this=this;
	const img=_CANVAS_IMGS_INIT['font'].obj;
	const imgsize=img.height;
	_r=_r||1;
	for(let _i=0;_i<_s.length;_i++){
		if(_s[_i]===' '){continue;}
		//センタリングに表示
		_GAME._setDrawImage({
			img:img,
			x:_x+(imgsize*_r*_i),
			y:_y,
			imgPosx:parseInt(_this._txt[_s[_i]]),
			width:imgsize,
			height:imgsize,
			scale:_r,
			basePoint:1
		});
	}
},//_setDrawTextToFont
_setTextToFont(_o,_str,_w){
	//ブラウザ用にテキストからフォントに置換させる。
	if(_o===undefined||_o===null){return;}
	let _this=this;
	_w=_w||30;
	let _s='';
	for(let _i=0;_i<_str.length;_i++){
		if(_str[_i]===' '){
			_s+='<img src="./images/gradius_spacer.png" width="'+_w+'">';
			continue;
		}
		let _pos=parseInt(_this._txt[_str[_i]])*(_w/60)*-1;
		_s+='<div style="background:url(./images/gradius_font.png) no-repeat;width:'+_w+'px;height:'+_w+'px;background-position:'+_pos+'px 0px;background-size:cover;display:inline-block;"></div>';
	}
	_o.innerHTML=_s;
},//_setTextToFont
_getPlayerMoveDrawX(_elem){
	if(_PLAYERS_MOVE_DRAW_X[_elem]
			===undefined){return null;}
	return _PLAYERS_MOVE_DRAW_X[_elem];
},
_getPlayerMoveDrawY(_elem){
	if(_PLAYERS_MOVE_DRAW_Y[_elem]
			===undefined){return null;}
	return _PLAYERS_MOVE_DRAW_Y[_elem];
},
_setPlayerMoveDraw(){
	//自機移動分配列をセットする。
	//Y軸無限:配列0番目からY起点にして要素0番目からリフレッシュさせる
	//Y軸有限:配列0番目から軸を流し込む
	let _w=_PLAYERS_MAIN.width;
	let _h=_PLAYERS_MAIN.height;
	let _x=_PLAYERS_MAIN.x+parseInt(_w/4);
	let _y=_PLAYERS_MAIN.y+parseInt(_h/4);
	let _mgs=_MAP.getBackGroundSpeedY()*-1;
	let _pmdy=_PLAYERS_MOVE_DRAW_Y;

	//配列要素数が所定より大きい場合は、
	//最後の要素を外す。
	if(_PLAYERS_MOVE_DRAW_X.length
		===_PLAYERS_MOVE_DRAW_MAX){
			_PLAYERS_MOVE_DRAW_X.pop();
	}
	if(_PLAYERS_MOVE_DRAW_Y.length
		===_PLAYERS_MOVE_DRAW_MAX){
			_PLAYERS_MOVE_DRAW_Y.pop();
	}

	_PLAYERS_MOVE_DRAW_X.unshift(_x);
//	console.log(_pmdy);
//	console.log('y==============:'+_PLAYERS_MAIN.y);
//	console.log('mgs==============:'+_mgs);

	//Y軸の処理（縦スクロールなし）
	//Y軸では、縦スクロールが発生しない間は、
	//要素0から順に自機移動座標を追加する。
	if(!_MAP.map_infinite){
		_pmdy.unshift(_y);
		return;
	}

	//Y軸の処理（縦スクロール発生時）
	if(_mgs===0){
		//縦スクロールが発生しない場合は、
		//要素0から追加
		_pmdy.unshift(_y);
		return;		
	}

	//この時点での、自機移動分配列を要素0から
	//Y座標の値を参照し、必要に応じて上書きする。
	//オプション1つ目：要素10
	//オプション2つ目：要素20
	//オプション3つ目：要素30
	//オプション4つ目：要素40
	for(let _i=0;_i<_PLAYERS_MOVE_DRAW_MAX;_i++){
		if(_pmdy[_i]===undefined){
			//要素内未定義の場合は、
			//自機座標Yと移動分を加算させる
			_pmdy.push(_y+(_mgs*_i));
			continue;
		}
		if(_mgs>0){
			//下スクロール時
			_pmdy[_i]=(_pmdy[_i]>=_y+(_mgs*_i))
						?_y+(_mgs*_i)
						:_pmdy[_i]+_mgs;
			continue;
		}
		if(_mgs<0){
			//上スクロール時
			_pmdy[_i]=(_pmdy[_i]<=_y+(_mgs*_i))
						?_y+(_mgs*_i)
						:_pmdy[_i]+_mgs;
			continue;				
		}
	}
//	console.log(_pmdy);
},
_setPlay(_obj){
	if(_obj===null||_obj===undefined){return;}

	var _s=_AUDIO_CONTEXT.createBufferSource();
	_s.buffer=_obj.buf;
	_s.loop=false;
    _s.connect(_AUDIO_CONTEXT.destination);
    _s.start(0);
	
},
_setPlayOnBG(_obj){
	//バックグラウンド用再生
	if(_obj===null||_obj===undefined){return;}
	
	if(this._is_audio_context_source_bg===true){
		this._audio_context_source_bg.stop();
		this._is_audio_context_source_bg=false;
	}
    let _t=_AUDIO_CONTEXT.createBufferSource();
	_t.buffer=_obj.buf;
	this._audio_now_obj_bg=_obj;//バッファの一時保存用
	_t.loop=true;
	_t.loopStart=0;
    _t.connect(_AUDIO_CONTEXT.destination);
	_t.start(0);
	
	this._audio_context_source_bg=_t;
	this._is_audio_context_source_bg=true;
},
_setStopOnBG(){
	//バックグラウンド用停止
	if(!this._is_audio_context_source_bg){return;}
	this._audio_context_source_bg.stop();
	this._is_audio_context_source_bg=false;
},
_setDrawImage(_d){
	//画像表示
	//画像自体、canvasimgで定義したrateは1.0を使用すること。
	//deg:角度
	//scale:画像中心を基点とした比率維持の拡大縮小。
	//		0の場合は表示しない。
	//basePoint:拡縮・回転時の基準点
	if(_d===undefined
		||_d.img===undefined
		||_d.scale===0){return;}
	//引数は以下
	let _width=_d.width||_d.img.width;
	let _height=_d.height||_d.img.height;
	let _deg=_d.deg||0;
	let _imgPosx=_d.imgPosx||0;
	let _imgPosy=_d.imgPosy||0;
	let _scale=_d.scale||1;
	let _x=_d.x||0;
	let _y=_d.y||0;
	let _basePoint=_d.basePoint||5;//拡縮による基準点
	let _alpha=_d.alpha||1;//透明度

	const _DEF_BASEPOINT=[//拡縮基準点ポイントの定義(0-8)
		{x:0,y:0},//0:ここはありえない
		{x:0,y:0},//1:左上
		{x:-(_width/2),y:0},//2:上真中
		{x:-_width,y:0},//3:右上
		{x:0,y:-(_height/2)},//4:左真中
		{x:-(_width/2),y:-(_height/2)},//5:真中
		{x:-_width,y:-(_height/2)},//6:右真中
		{x:0,y:-_height},//7:左下
		{x:-(_width/2),y:-_height},//8:下真中
		{x:-_width,y:-_height}//9:右下
	]

	_CONTEXT.save();
	_CONTEXT.globalAlpha=_alpha;
	_CONTEXT.translate(_x,_y);
	_CONTEXT.rotate(_deg*Math.PI/180);
//	console.log(_scale)
	_CONTEXT.scale(_scale,_scale);
	// _CONTEXT.drawImage(
	// 	_d.img,
	// 	-(_d.img.width/2),
	// 	-(_d.img.height/2),
	// 	_d.img.width,
	// 	_d.img.height
	// );
	_CONTEXT.drawImage(
		_d.img,
		_imgPosx,
		_imgPosy,
		_width,
		_height,
		_DEF_BASEPOINT[_basePoint].x,
		_DEF_BASEPOINT[_basePoint].y,
		_width,
		_height		
	);
	_CONTEXT.restore();
	
},
// _setDrawImage(_d){
// 	//画像表示
// 	//img:画像オブジェクト
// 	//x:画像のx座標
// 	//y:画像のy座標
// 	//deg:角度（0〜360.反時計回り）
// 	//scale:画像スケール
// 	let img=_d.img;
// 	let _s=_d.scale||1;
// 	let _deg=_d.deg||0;
// 	let _sw=_d.img.width*_s;
// 	let _sh=_d.img.height*_s;
// 	_CONTEXT.save();

// 	_CONTEXT.drawImage(
// 		_img,_x-(_sw/2),_y-(_sh/2),_sw,_sh
// 	);
// 	_CONTEXT.restore();

// 	// _CONTEXT.strokeStyle = 'rgb(200,200,255)';
// 	// _CONTEXT.beginPath();
// 	// _CONTEXT.rect(_x-(_sw/2),_y-(_sh/2),_sw,_sh);
// 	// _CONTEXT.stroke();

// },//_setDrawImage
_multilineText(context, text, width) {
    let len=text.length,
    	strArray=[],
    	_tmp='';

    if(len<1){
        //textの文字数が0だったら終わり
        return strArray;
    }

    for(let _i=0;_i<len;_i++){
        let _c=text.charAt(_i);  //textから１文字抽出
        if(_c==='\n'){
            /* 改行コードの場合はそれまでの文字列を配列にセット */
            strArray.push(_tmp);
            _tmp="";
            continue;
        }

        /* contextの現在のフォントスタイルで描画したときの長さを取得 */
        if (context.measureText(_tmp+_c).width<=width){
            /* 指定幅を超えるまでは文字列を繋げていく */
            _tmp+=_c;
        }else{
            /* 超えたら、それまでの文字列を配列にセット */
            strArray.push(_tmp);
            _tmp=_c;
        }
    }
    /* 繋げたままの分があれば回収 */
    if(_tmp.length>0){strArray.push(_tmp);}

    return strArray;
}
};


//===================================================
//	JAVASCRIPT START
//===================================================
window.addEventListener('load',function(){
	_CANVAS=document.getElementById('game');
	_CONTEXT=_CANVAS.getContext('2d');

	//URLからパラメータを取得
	_GAME.setUrlParams();
	//以下パラメータからデバッグモードを設定
	_ISDEBUG=(_GAME._url_params['debug']==='true')?true:false;
	_MAP_PETTERN=_GAME._url_params['mp']||0;
	_ENEMY_DIFFICULT=_GAME._url_params['ed']||0;

	if(_ISSP){
		document
			.querySelector('body')
			.classList.add('sp');
	}
	_DRAW_AUDIO_INIT(_CANVAS_AUDIOS);

});

//touchmoveブラウザのスクロールを停止
window.addEventListener('touchmove',function(e){
    e.preventDefault();
},{passive: false});

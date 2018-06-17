//=====================================================
//	gradius_controller_event
//	コントローラー系処理
//=====================================================
'use strict';
const _EVENT_KEYDOWN=(window.ontouchstart===null)?'touchstart':'keydown';
const _EVENT_KEYMOVE=(window.ontouchstart===null)?'touchmove':'keydown';
const _EVENT_KEYUP=(window.ontouchstart===null)?'touchend':'keyup';

let _EVENT_POWERMETER_FLAG=false;
let _EVENT_SELECT_STAGE_FLAG=false;

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
			_EVENT_KEYMOVE,
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
			_EVENT_KEYMOVE,
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
			_EVENT_KEYMOVE,
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
			_EVENT_KEYMOVE,
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
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keymove_game_controller);
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
			_EVENT_KEYMOVE,
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
			_EVENT_KEYUP,
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
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keymove_game_controller);
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
			_EVENT_KEYMOVE,
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
			_EVENT_KEYUP,
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

//==============================================================
//==============================================================
//	キーイベントの定義(PC)
//	イベントの追加は、各シーンに設定
//	イベントの削除は、この関数内に設定
//==============================================================
//==============================================================
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
	cancelAnimationFrame(_PLAYERS_SHOTS_SETINTERVAL);
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
		_PARTS_PLAYERMAIN._move_ismove=true;
		_PARTS_PLAYERMAIN._players_obj._x
			=_PARTS_PLAYERMAIN._players_obj.accel*-1;
	}
	if(e.key==='ArrowRight'||e.key==='Right'){
		_PARTS_PLAYERMAIN._move_ismove=true;
		_PARTS_PLAYERMAIN._players_obj._x
			=_PARTS_PLAYERMAIN._players_obj.accel;
	}
	if(e.key==='ArrowUp'||e.key==='Up'){
		_PARTS_PLAYERMAIN._move_ismove=true;
		_PARTS_PLAYERMAIN._players_obj._y
			=_PARTS_PLAYERMAIN._players_obj.accel*-1;
	}
	if(e.key==='ArrowDown'||e.key==='Down'){
		_PARTS_PLAYERMAIN._move_ismove=true;
		_PARTS_PLAYERMAIN._players_obj._y
			=_PARTS_PLAYERMAIN._players_obj.accel;
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
	if(!_PARTS_PLAYERMAIN._players_obj.isalive()){return false;}
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
			_PARTS_PLAYERMAIN._shot_type=_PARTS_PLAYERMAIN._shot_type_def.NORMAL;
			_PARTS_PLAYERMAIN._shot_missle_isalive=true;
			for(let _i=0;_i<_PARTS_PLAYERMAIN._option_max;_i++){
				_PARTS_PLAYERMAIN._option_obj[_i].settruealive();
			}
			_PARTS_PLAYERMAIN._players_force_obj.init();
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
		_PARTS_PLAYERMAIN._move_ismove=true;
		_PARTS_PLAYERMAIN._players_obj._x
			=_PARTS_PLAYERMAIN._players_obj.accel*-1;
	}
	if(e.key==='ArrowRight'||e.key==='Right'){
		_PARTS_PLAYERMAIN._move_ismove=true;
		_PARTS_PLAYERMAIN._players_obj._x
			=_PARTS_PLAYERMAIN._players_obj.accel;
	}
	if(e.key==='ArrowUp'||e.key==='Up'){
		_PARTS_PLAYERMAIN._move_ismove=true;
		_PARTS_PLAYERMAIN._players_obj._y
			=_PARTS_PLAYERMAIN._players_obj.accel*-1;
		_PARTS_PLAYERMAIN._players_obj.set_vv_ani(e.key);
	}
	if(e.key==='ArrowDown'||e.key==='Down'){
		_PARTS_PLAYERMAIN._move_ismove=true;
		_PARTS_PLAYERMAIN._players_obj._y
			=_PARTS_PLAYERMAIN._players_obj.accel;
		_PARTS_PLAYERMAIN._players_obj.set_vv_ani(e.key);
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
	if(!_PARTS_PLAYERMAIN._players_obj.isalive()){return false;}//撃たれたら操作不可

	if(e.key==='ArrowLeft'||e.key==='Left'){
		_PARTS_PLAYERMAIN._move_ismove=false;
	}
	if(e.key==='ArrowRight'||e.key==='Right'){
		_PARTS_PLAYERMAIN._move_ismove=false;
	}
	if(e.key==='ArrowUp'||e.key==='Up'){
		_PARTS_PLAYERMAIN._move_ismove=false;
	}
	if(e.key==='ArrowDown'||e.key==='Down'){
		_PARTS_PLAYERMAIN._move_ismove=false;
	}
	if(e.key===' '||e.key==='Spacebar'){
		_DRAW_STOP_PLAYERS_SHOTS();
	}
}//keyup_game
}//_KEYEVENT

//==============================================================
//==============================================================
//	キーイベントの定義(SP)
//	イベントの追加は、各シーンに設定
//	イベントの削除は、この関数内に設定
//==============================================================
//==============================================================
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
	cancelAnimationFrame(_PLAYERS_SHOTS_SETINTERVAL);
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

//=========================
// ステージ選択イベント
//=========================
'keymove_select_stage':function(e){
	e.preventDefault(); // タッチによる画面スクロールを止める
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
	// let _c1=_SP_CONTROLLER._sp_main_center
	// _c1.style.top="";
	// _c1.style.left="";
	_EVENT_SELECT_STAGE_FLAG=false;
},//keyend_select_stage
'keydown_select_stage_a':function(e){
	_MAP.set_stage_map_pattern(_STAGESELECT.mapdef_status);
	_DRAW_POWER_METER_SELECT();
	_GAME._setPlay(_CANVAS_AUDIOS['playerset']);	
	return false;
},//keydown_select_stage_a

//=========================
// KEYDOWN GAME CLEAR
//=========================
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

//=========================
// KEYDOWN GAME OVER
//=========================
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
	_PARTS_PLAYERMAIN._move_ismove=true;	
	let _r=_SP_CONTROLLER._get_st(e);
	if(_r===false){return;}
	_PARTS_PLAYERMAIN._players_obj._x=0;
	_PARTS_PLAYERMAIN._players_obj._y=0;

	if(_r===_SP_CONTROLLER._DEF_DIR._L){
//	if(_rad>-40&&_rad<=40){
			// 	console.log('left');
 		_PARTS_PLAYERMAIN._players_obj._x
			 =_PARTS_PLAYERMAIN._players_obj.accel*-1;
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._LU){
//	if(_rad>40&&_rad<=50){
		// 	console.log('left-top');
 		_PARTS_PLAYERMAIN._players_obj._x
 			=_PARTS_PLAYERMAIN._players_obj.accel*-1;
		_PARTS_PLAYERMAIN._players_obj._y
 			=_PARTS_PLAYERMAIN._players_obj.accel*-1;
		_PARTS_PLAYERMAIN._players_obj.set_vv_ani('Up');
	 }
	if(_r===_SP_CONTROLLER._DEF_DIR._U){
//	if(_rad>50&&_rad<=130){
		_PARTS_PLAYERMAIN._players_obj._y
 			=_PARTS_PLAYERMAIN._players_obj.accel*-1;
		_PARTS_PLAYERMAIN._players_obj.set_vv_ani('Up');
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._RU){
//	if(_rad>130&&_rad<=140){
		// 	console.log('right-top');
		_PARTS_PLAYERMAIN._players_obj._x
 			=_PARTS_PLAYERMAIN._players_obj.accel*1;
		_PARTS_PLAYERMAIN._players_obj._y
 			=_PARTS_PLAYERMAIN._players_obj.accel*-1;
		_PARTS_PLAYERMAIN._players_obj.set_vv_ani('Up');
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._R){
		// if((_rad>140&&_rad<=180)
		// ||(_rad<-140&&_rad>=-180)){
		// console.log('right');
 		_PARTS_PLAYERMAIN._players_obj._x
 			=_PARTS_PLAYERMAIN._players_obj.accel;
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._RD){
//		if(_rad<-130&&_rad>=-140){
		// console.log('right-bottom');
		_PARTS_PLAYERMAIN._players_obj._x
 			=_PARTS_PLAYERMAIN._players_obj.accel*1;
 		_PARTS_PLAYERMAIN._players_obj._y
 			=_PARTS_PLAYERMAIN._players_obj.accel*1;
		_PARTS_PLAYERMAIN._players_obj.set_vv_ani('Down');
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._D){
//	if(_rad<-50&&_rad>=-130){
		// console.log('bottom');
 		_PARTS_PLAYERMAIN._players_obj._y
 			=_PARTS_PLAYERMAIN._players_obj.accel;
		_PARTS_PLAYERMAIN._players_obj.set_vv_ani('Down');
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._LD){
//	if(_rad<-40&&_rad>=-50){
		// console.log('left-bottom');
		_PARTS_PLAYERMAIN._players_obj._x
 			=_PARTS_PLAYERMAIN._players_obj.accel*-1;
 		_PARTS_PLAYERMAIN._players_obj._y
 			=_PARTS_PLAYERMAIN._players_obj.accel*1;
		_PARTS_PLAYERMAIN._players_obj.set_vv_ani('Down');
 	}

	return false;
	// console.log(_rad);
},//keymove_game_controller
'keyend_game_controller':function(e){
	_SP_CONTROLLER._set_reset();
	_PARTS_PLAYERMAIN._players_obj.set_moveamount_reset();
	_PARTS_PLAYERMAIN._move_ismove=false;
},//keyend_game_controller

'keydown_game_hide':function(e){
	_PARTS_PLAYERMAIN._shot_type=_PARTS_PLAYERMAIN._shot_type_def.NORMAL;
	_PARTS_PLAYERMAIN._shot_missle_isalive=true;
	for(let _i=0;_i<_PARTS_PLAYERMAIN._option_max;_i++){
		_PARTS_PLAYERMAIN._option_obj[_i].settruealive();
	}
	_PARTS_PLAYERMAIN._players_force_obj.init();
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



//==============================================================
//==============================================================
//SP用コントローラー定義
//==============================================================
//==============================================================
const _SP_CONTROLLER={
	x:0,
	y:0,
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
	_SP_CONTROLLER_SETINTERVAL:false,
	_set_sp_main_movePoint(e){
		//_sp_main、タッチ時の相対座標をセットする
		let _tr=_SP_CONTROLLER._sp_main.getBoundingClientRect();

		for(let _i=0;_i<e.touches.length;_i++){
			//マルチタップから
			//自身のタッチ箇所のみ設定
			if(_SP_CONTROLLER._sp_main_center===e.touches[_i].target){
				this.x=e.touches[_i].clientX-_tr.left;
				this.y=e.touches[_i].clientY-_tr.top;
			}
		}
	},
	_draw_sp_main(_p){
		//タッチに合わせてコントローラを描画させる
		//obj:イベントオブジェクト
		//x:x位置
		//y:y位置
		if(!this._SP_CONTROLLER_SETINTERVAL){return;}
		_p.obj.target.style.left=parseInt(_p.x)+'px';
		_p.obj.target.style.top=parseInt(_p.y)+'px';
	},
	//=========================
	//コントローラーの表示処理
	//=========================
	_keymove_sp_main(e){
		let _this=_SP_CONTROLLER;
		//コントローラ、touchmove表示定義
		_this._SP_CONTROLLER_SETINTERVAL=true;
		let _x,_y;

		//sp_mainの相対座標をセット
		_this._set_sp_main_movePoint(e);
		// let _tr=_SP_CONTROLLER._sp_main.getBoundingClientRect();

		// for(let _i=0;_i<e.touches.length;_i++){
		// 	//マルチタップから
		// 	//自身のタッチ箇所のみ設定
		// 	if(_SP_CONTROLLER._sp_main_center===e.touches[_i].target){
		// 		_x=e.touches[_i].clientX-_tr.left;
		// 		_y=e.touches[_i].clientY-_tr.top;
		// 	}
		// }

		//子要素の中心点設定
		let _c1_x=_this.x-(parseInt(window.getComputedStyle(_this._sp_main_center).width)/2),
			_c1_y=_this.y-(parseInt(window.getComputedStyle(_this._sp_main_center).height)/2)
		_SP_CONTROLLER._draw_sp_main({obj:e,x:_c1_x,y:_c1_y});

		e.stopPropagation();
		e.preventDefault();
	},
	_keyup_sp_main(e){
		let _this=_SP_CONTROLLER;
		//コントローラ、touchend表示定義
		_this._SP_CONTROLLER_SETINTERVAL=false;
		e.target.style.top="";
		e.target.style.left="";
		e.stopPropagation();
		e.preventDefault();
	},
	_keydown_sp_bts(e){
		//ボタン用、touchdown表示定義
		e.currentTarget.classList.add('on');
		e.stopPropagation();
		e.preventDefault();
	},
	_keyup_sp_bts(e){
		//ボタン用、touchend表示定義
		e.currentTarget.classList.remove('on');
		e.stopPropagation();
		e.preventDefault();
	},
	//=========================
	//自機操作制御
	//=========================
	_get_st:function(e){
		let _c1=this._sp_main_center;
		let _c0=this._sp_main;
		//親要素に対してイベントを定義し、
		//子要素はタッチ位置に併せて調整

		//sp_mainの相対座標をセット
		this._set_sp_main_movePoint(e);

		//親要素の中心点から角度を算出
		let _w=parseInt(window.getComputedStyle(_c0).width);
		let _h=parseInt(window.getComputedStyle(_c0).height);
		let _dx=(_w/2)-this.x,
			 _dy=(_h/2)-this.y;

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
		// let _c1=
		// 	document
		// 		.querySelector('.sp_controller_main_center');
		// _c1.style.left='';
		// _c1.style.top='';
	},//_set_reset
	//以下は初期処理
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
		
		//イベント定義
		this._sp_main_center.addEventListener(_EVENT_KEYMOVE,this._keymove_sp_main);
		this._sp_main_center.addEventListener(_EVENT_KEYUP,this._keyup_sp_main);

		const _spc_bt=document.querySelectorAll('.sp_controller_bt');
		for(let _i=0;_i<_spc_bt.length;_i++){
			_spc_bt[_i].addEventListener(_EVENT_KEYDOWN,this._keydown_sp_bts);	
			_spc_bt[_i].addEventListener(_EVENT_KEYUP,this._keyup_sp_bts);
		}	
	}
}
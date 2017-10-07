//=====================================================
//	gradius_main.js
//	全体処理
//	2017.08.12 : 新規作成
//=====================================================
'use strict';

const _ISDEBUG=false;
let _PLAYERS_POWER_METER=0;
let _PLAYERS_POWER_METER_SHIELD=0;
let _PLAYERS_SHOTS_SETINTERVAL=null;

let _DRAW_SETINTERVAL=null;
let _DRAW_GAMESTART_SETINTERVAL=null;
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

const _CANVAS_IMGS={
	'vicviper1':
		{src:'images/gradius_vicviper1.png',
		 rate:0.26,
		 obj:new Image()},
	'vicviper2':
 		{src:'images/gradius_vicviper2.png',
 		 rate:0.26,
 		 obj:new Image()},
	'vicviper3':
 		{src:'images/gradius_vicviper3.png',
 		 rate:0.26,
 		 obj:new Image()},
	'vicviper4':
  		{src:'images/gradius_vicviper4.png',
  		 rate:0.26,
  		 obj:new Image()},
	'vicviper5':
   		{src:'images/gradius_vicviper5.png',
   		 rate:0.26,
   		 obj:new Image()},

	'vicviper1_e':
 		{src:'images/gradius_vicviper1_e.png',
 		 rate:0.26,
 		 obj:new Image()},
 	'vicviper2_e':
  		{src:'images/gradius_vicviper2_e.png',
  		 rate:0.26,
  		 obj:new Image()},
 	'vicviper3_e':
  		{src:'images/gradius_vicviper3_e.png',
  		 rate:0.26,
  		 obj:new Image()},
 	'vicviper4_e':
   		{src:'images/gradius_vicviper4_e.png',
   		 rate:0.26,
   		 obj:new Image()},
 	'vicviper5_e':
		{src:'images/gradius_vicviper5_e.png',
		 rate:0.26,
		 obj:new Image()},

	'vicviper_back1':
		{src:'images/gradius_vicviper_back1.png',
		 rate:0.26,
		 obj:new Image()},
	'vicviper_back2':
		{src:'images/gradius_vicviper_back2.png',
		 rate:0.26,
		 obj:new Image()},
	'vicviper_back3':
		{src:'images/gradius_vicviper_back3.png',
		 rate:0.26,
		 obj:new Image()},

	'vicviper_back1_e':
 		{src:'images/gradius_vicviper_back1_e.png',
 		 rate:0.26,
 		 obj:new Image()},


	'vicviper_bomb':
   		{src:'images/gradius_vicviper_bomb.png',
   		 rate:1,
   		 obj:new Image()},
	'vicviper_bomb_red':
		{src:'images/gradius_vicviper_bomb_red.png',
		 rate:1,
		 obj:new Image()},
	'option':
 		{src:'images/option.png',
 		 rate:0.3,
 		 obj:new Image()},
	'missile1':
		{src:'images/missile1.png',
		 rate:0.48,
		 obj:new Image()},
	'missile2':
		{src:'images/missile2.png',
		 rate:0.48,
		 obj:new Image()},
	'missile3':
 		{src:'images/missile3.png',
 		 rate:0.48,
 		 obj:new Image()},
	'missile4':
		{src:'images/missile4.png',
		 rate:0.48,
		 obj:new Image()},
	'missile5':
 		{src:'images/missile5.png',
 		 rate:0.48,
 		 obj:new Image()},
	'missile6':
  		{src:'images/missile6.png',
  		 rate:0.48,
  		 obj:new Image()},
	'missile7':
   		{src:'images/missile7.png',
   		 rate:0.48,
   		 obj:new Image()},
	'missile8':
   		{src:'images/missile8.png',
   		 rate:0.48,
   		 obj:new Image()},

	'shot1':
		{src:'images/gradius_shot1.png',
		 rate:0.4,
		 obj:new Image()},
	'shot2':
		{src:'images/gradius_shot2.png',
		 rate:0.4,
		 obj:new Image()},
	'shot3':
 		{src:'images/gradius_shot3.png',
 		 rate:0.4,
 		 obj:new Image()},
	'meter':
		{src:'images/gradius_meter.png',
		 rate:0.5,
		 obj:new Image()},
	'meter_c_speedup':
		{src:'images/gradius_meter_c_speedup.png',
		 rate:0.5,
		 obj:new Image()},
	'meter_c_missile':
		{src:'images/gradius_meter_c_missile.png',
		 rate:0.5,
		 obj:new Image()},
	'meter_c_double':
		{src:'images/gradius_meter_c_double.png',
		 rate:0.5,
		 obj:new Image()},
	'meter_c_laser':
		{src:'images/gradius_meter_c_laser.png',
		 rate:0.5,
		 obj:new Image()},
	'meter_c_option':
		{src:'images/gradius_meter_c_option.png',
		 rate:0.5,
		 obj:new Image()},
	'meter_c_shield':
		{src:'images/gradius_meter_c_shield.png',
		 rate:0.5,
		 obj:new Image()},
	'meter_blank':
		{src:'images/gradius_meter_blank.png',
		 rate:0.5,
		 obj:new Image()},
	'meter_c_blank':
		{src:'images/gradius_meter_c_blank.png',
		 rate:0.5,
		 obj:new Image()},

	'forcefield1':
		{src:'images/gradius_forcefield1.png',
		 rate:1,
		 obj:new Image()},
	'forcefield2':
 		{src:'images/gradius_forcefield2.png',
 		 rate:1,
 		 obj:new Image()},
	'forcefield_red1':
 		{src:'images/gradius_forcefield_red1.png',
 		 rate:1,
 		 obj:new Image()},
 	'forcefield_red2':
  		{src:'images/gradius_forcefield_red2.png',
  		 rate:1,
  		 obj:new Image()},

	'shield1':
 		{src:'images/gradius_shield1.png',
 		 rate:0.4,
 		 obj:new Image()},
 	'shield2':
  		{src:'images/gradius_shield2.png',
  		 rate:0.4,
  		 obj:new Image()},
 	'shield_red1':
  		{src:'images/gradius_shield_red1.png',
  		 rate:0.4,
  		 obj:new Image()},
  	'shield_red2':
   		{src:'images/gradius_shield_red2.png',
   		 rate:0.4,
   		 obj:new Image()},

	'enemy_a_1':{src:'images/gradius_enemy_a_1.png',rate:0.52,obj:new Image()},
	'enemy_a_2':{src:'images/gradius_enemy_a_2.png',rate:0.52,obj:new Image()},
	'enemy_a_3':{src:'images/gradius_enemy_a_3.png',rate:0.52,obj:new Image()},
	'enemy_a_4':{src:'images/gradius_enemy_a_4.png',rate:0.52,obj:new Image()},
	'enemy_a_5':{src:'images/gradius_enemy_a_5.png',rate:0.52,obj:new Image()},
	'enemy_a_6':{src:'images/gradius_enemy_a_6.png',rate:0.52,obj:new Image()},
	'enemy_a_7':{src:'images/gradius_enemy_a_7.png',rate:0.52,obj:new Image()},
	'enemy_a_8':{src:'images/gradius_enemy_a_8.png',rate:0.52,obj:new Image()},

	'enemy_b_1':{src:'images/gradius_enemy_b_1.png',rate:0.52,obj:new Image()},
	'enemy_b_2':{src:'images/gradius_enemy_b_2.png',rate:0.52,obj:new Image()},
	'enemy_b_3':{src:'images/gradius_enemy_b_3.png',rate:0.52,obj:new Image()},
	'enemy_b_4':{src:'images/gradius_enemy_b_4.png',rate:0.52,obj:new Image()},
	'enemy_b_5':{src:'images/gradius_enemy_b_5.png',rate:0.52,obj:new Image()},
	'enemy_b_6':{src:'images/gradius_enemy_b_6.png',rate:0.52,obj:new Image()},
	'enemy_b_7':{src:'images/gradius_enemy_b_7.png',rate:0.52,obj:new Image()},
	'enemy_b_8':{src:'images/gradius_enemy_b_8.png',rate:0.52,obj:new Image()},

	'enemy_c_1':{src:'images/gradius_enemy_c_1.png',rate:0.4,obj:new Image()},
	'enemy_c_2':{src:'images/gradius_enemy_c_2.png',rate:0.4,obj:new Image()},
	'enemy_c_3':{src:'images/gradius_enemy_c_3.png',rate:0.4,obj:new Image()},
	'enemy_c_4':{src:'images/gradius_enemy_c_4.png',rate:0.4,obj:new Image()},
	'enemy_c_5':{src:'images/gradius_enemy_c_5.png',rate:0.4,obj:new Image()},
	'enemy_c_6':{src:'images/gradius_enemy_c_6.png',rate:0.4,obj:new Image()},
	'enemy_c_7':{src:'images/gradius_enemy_c_7.png',rate:0.4,obj:new Image()},
	'enemy_c_8':{src:'images/gradius_enemy_c_8.png',rate:0.4,obj:new Image()},
	'enemy_c_11':{src:'images/gradius_enemy_c_11.png',rate:0.4,obj:new Image()},
	'enemy_c_12':{src:'images/gradius_enemy_c_12.png',rate:0.4,obj:new Image()},
	'enemy_c_13':{src:'images/gradius_enemy_c_13.png',rate:0.4,obj:new Image()},
	'enemy_c_14':{src:'images/gradius_enemy_c_14.png',rate:0.4,obj:new Image()},
	'enemy_c_15':{src:'images/gradius_enemy_c_15.png',rate:0.4,obj:new Image()},
	'enemy_c_16':{src:'images/gradius_enemy_c_16.png',rate:0.4,obj:new Image()},
	'enemy_c_17':{src:'images/gradius_enemy_c_17.png',rate:0.4,obj:new Image()},
	'enemy_c_18':{src:'images/gradius_enemy_c_18.png',rate:0.4,obj:new Image()},

	'enemy_d_1':{src:'images/gradius_enemy_d_1.png',rate:0.2,obj:new Image()},
	'enemy_d_2':{src:'images/gradius_enemy_d_2.png',rate:0.2,obj:new Image()},
	'enemy_d_3':{src:'images/gradius_enemy_d_3.png',rate:0.2,obj:new Image()},
	'enemy_d_4':{src:'images/gradius_enemy_d_4.png',rate:0.2,obj:new Image()},

	'enemy_e_1':{src:'images/gradius_enemy_e_1.png',rate:0.2,obj:new Image()},
	'enemy_e_2':{src:'images/gradius_enemy_e_2.png',rate:0.2,obj:new Image()},
	'enemy_e_3':{src:'images/gradius_enemy_e_3.png',rate:0.2,obj:new Image()},
	'enemy_e_4':{src:'images/gradius_enemy_e_4.png',rate:0.2,obj:new Image()},

	'enemy_p_1':{src:'images/gradius_enemy_p_1.png',rate:0.26,obj:new Image()},
	'enemy_p_2':{src:'images/gradius_enemy_p_2.png',rate:0.30,obj:new Image()},
	'enemy_p_3':{src:'images/gradius_enemy_p_3.png',rate:0.30,obj:new Image()},
	'enemy_p_4':{src:'images/gradius_enemy_p_4.png',rate:0.30,obj:new Image()},
	'enemy_p_5':{src:'images/gradius_enemy_p_5.png',rate:0.30,obj:new Image()},

	'enemy_z':{src:'images/gradius_enemy_z_core.png',rate:0.60,obj:new Image()},
	'enemy_z_1':{src:'images/gradius_enemy_z_core_1.png',rate:0.60,obj:new Image()},
	'enemy_z_2':{src:'images/gradius_enemy_z_core_2.png',rate:0.60,obj:new Image()},
	'enemy_z_3':{src:'images/gradius_enemy_z_core_3.png',rate:0.60,obj:new Image()},
	'enemy_z_4_1':{src:'images/gradius_enemy_z_core_4_1.png',rate:0.60,obj:new Image()},
	'enemy_z_4_2':{src:'images/gradius_enemy_z_core_4_2.png',rate:0.60,obj:new Image()},
	'enemy_z_4_3':{src:'images/gradius_enemy_z_core_4_3.png',rate:0.60,obj:new Image()},
	'enemy_z_4_4':{src:'images/gradius_enemy_z_core_4_4.png',rate:0.60,obj:new Image()},
	'enemy_z_4_5':{src:'images/gradius_enemy_z_core_4_5.png',rate:0.60,obj:new Image()},

	'enemy_collapes1':
 		{src:'images/gradius_enemy_collapes1.png',rate:1,obj:new Image()},
	'enemy_collapes2':
  		{src:'images/gradius_enemy_collapes2.png',rate:1,obj:new Image()},
	'enemy_collapes11':
 		{src:'images/gradius_enemy_collapes11.png',rate:0.2,obj:new Image()},
	'enemy_collapes12':
  		{src:'images/gradius_enemy_collapes12.png',rate:0.2,obj:new Image()},
	'enemy_collapes13':
  		{src:'images/gradius_enemy_collapes13.png',rate:0.2,obj:new Image()},
	'enemy_collapes91':
 		{src:'images/gradius_enemy_collapes91.png',rate:0.2,obj:new Image()},
	'enemy_collapes92':
  		{src:'images/gradius_enemy_collapes92.png',rate:0.2,obj:new Image()},
	'enemy_collapes93':
  		{src:'images/gradius_enemy_collapes93.png',rate:0.2,obj:new Image()},
	'enemy_collapes94':
  		{src:'images/gradius_enemy_collapes94.png',rate:0.2,obj:new Image()},
	'enemy_collapes95':
  		{src:'images/gradius_enemy_collapes95.png',rate:0.2,obj:new Image()},
	'enemy_collapes96':
  		{src:'images/gradius_enemy_collapes96.png',rate:0.2,obj:new Image()},

	'enemy_bullet1':
 		{src:'images/gradius_enemy_bullet1.png',rate:0.8,obj:new Image()},
	'enemy_bullet2':
  		{src:'images/gradius_enemy_bullet2.png',rate:0.8,obj:new Image()},
	'enemy_bullet_z':
  		{src:'images/gradius_enemy_bullet_z.png',rate:0.2,obj:new Image()},

	//パワーカプセル
	'pc1':
  		{src:'images/gradius_pc1.png',rate:0.5,obj:new Image()},
	'pc2':
  		{src:'images/gradius_pc2.png',rate:0.5,obj:new Image()},
	'pc3':
  		{src:'images/gradius_pc3.png',rate:0.5,obj:new Image()},
	'pc4':
  		{src:'images/gradius_pc4.png',rate:0.5,obj:new Image()},
	'pc5':
  		{src:'images/gradius_pc5.png',rate:0.5,obj:new Image()},

	//MAP
	'map1':
  		{src:'images/gradius_map1.png',rate:1,obj:new Image()},
	'map5':
  		{src:'images/gradius_map5.png',rate:1,obj:new Image()},
	'map6':
  		{src:'images/gradius_map6.png',rate:1,obj:new Image()},
	'map7':
  		{src:'images/gradius_map7.png',rate:1,obj:new Image()},
	'map8':
  		{src:'images/gradius_map8.png',rate:1,obj:new Image()},
	'map9':
  		{src:'images/gradius_map9.png',rate:1,obj:new Image()},

//	'enemy_z':{src:'images/gradius_enemy_z_bigcore.png',rate:1.0,obj:new Image()},

};

const _CANVAS_IMGS_INIT={
	//FONT
	'font_0':{src:'images/gradius_font_0.png',rate:1,obj:new Image()},
	'font_1':{src:'images/gradius_font_1.png',rate:1,obj:new Image()},
	'font_2':{src:'images/gradius_font_2.png',rate:1,obj:new Image()},
	'font_3':{src:'images/gradius_font_3.png',rate:1,obj:new Image()},
	'font_4':{src:'images/gradius_font_4.png',rate:1,obj:new Image()},
	'font_5':{src:'images/gradius_font_5.png',rate:1,obj:new Image()},
	'font_6':{src:'images/gradius_font_6.png',rate:1,obj:new Image()},
	'font_7':{src:'images/gradius_font_7.png',rate:1,obj:new Image()},
	'font_8':{src:'images/gradius_font_8.png',rate:1,obj:new Image()},
	'font_9':{src:'images/gradius_font_9.png',rate:1,obj:new Image()},
	'font_a':{src:'images/gradius_font_a.png',rate:1,obj:new Image()},
	'font_b':{src:'images/gradius_font_b.png',rate:1,obj:new Image()},
	'font_c':{src:'images/gradius_font_c.png',rate:1,obj:new Image()},
	'font_d':{src:'images/gradius_font_d.png',rate:1,obj:new Image()},
	'font_e':{src:'images/gradius_font_e.png',rate:1,obj:new Image()},
	'font_f':{src:'images/gradius_font_f.png',rate:1,obj:new Image()},
	'font_g':{src:'images/gradius_font_g.png',rate:1,obj:new Image()},
	'font_h':{src:'images/gradius_font_h.png',rate:1,obj:new Image()},
	'font_i':{src:'images/gradius_font_i.png',rate:1,obj:new Image()},
	'font_j':{src:'images/gradius_font_j.png',rate:1,obj:new Image()},
	'font_k':{src:'images/gradius_font_k.png',rate:1,obj:new Image()},
	'font_l':{src:'images/gradius_font_l.png',rate:1,obj:new Image()},
	'font_m':{src:'images/gradius_font_m.png',rate:1,obj:new Image()},
	'font_n':{src:'images/gradius_font_n.png',rate:1,obj:new Image()},
	'font_o':{src:'images/gradius_font_o.png',rate:1,obj:new Image()},
	'font_p':{src:'images/gradius_font_p.png',rate:1,obj:new Image()},
	'font_q':{src:'images/gradius_font_q.png',rate:1,obj:new Image()},
	'font_r':{src:'images/gradius_font_r.png',rate:1,obj:new Image()},
	'font_s':{src:'images/gradius_font_s.png',rate:1,obj:new Image()},
	'font_t':{src:'images/gradius_font_t.png',rate:1,obj:new Image()},
	'font_u':{src:'images/gradius_font_u.png',rate:1,obj:new Image()},
	'font_v':{src:'images/gradius_font_v.png',rate:1,obj:new Image()},
	'font_w':{src:'images/gradius_font_w.png',rate:1,obj:new Image()},
	'font_x':{src:'images/gradius_font_x.png',rate:1,obj:new Image()},
	'font_y':{src:'images/gradius_font_y.png',rate:1,obj:new Image()},
	'font_z':{src:'images/gradius_font_z.png',rate:1,obj:new Image()},
	'font_:':{src:'images/gradius_font_27.png',rate:1,obj:new Image()},

	//POWER METER SELECT
	'gradius_powermeterselect':
  		{src:'images/gradius_powermeterselect.png',rate:0.28,obj:new Image()},
	'gradius_powermeterselect_shield':
  		{src:'images/gradius_powermeterselect_shield.png',rate:0.28,obj:new Image()},
	'gradius_powermeterselect_shield_':
  		{src:'images/gradius_powermeterselect_shield_.png',rate:0.28,obj:new Image()},
	'gradius_powermeterselect_0':
  		{src:'images/gradius_powermeterselect_0.png',rate:0.28,obj:new Image()},
	'gradius_powermeterselect_1':
  		{src:'images/gradius_powermeterselect_1.png',rate:0.28,obj:new Image()},
	'gradius_powermeterselect_2':
  		{src:'images/gradius_powermeterselect_2.png',rate:0.28,obj:new Image()},
	'gradius_powermeterselect_3':
  		{src:'images/gradius_powermeterselect_3.png',rate:0.28,obj:new Image()},
	'gradius_powermeterselect_shield_0':
  		{src:'images/gradius_powermeterselect_shield_0.png',rate:0.28,obj:new Image()},
	'gradius_powermeterselect_shield_1':
  		{src:'images/gradius_powermeterselect_shield_1.png',rate:0.28,obj:new Image()},
};

let _DRAW_IS_GAMECLEAR=false;//GameClearフラグ

let _SCROLL_POSITION=1;

const _SHOTTYPE_MISSILE='_SHOTTYPE_MISSILE';
const _SHOTTYPE_NORMAL='_SHOTTYPE_NORMAL';
const _SHOTTYPE_DOUBLE='_SHOTTYPE_DOUBLE';
const _SHOTTYPE_LASER='_SHOTTYPE_LASER';
let _SHOTTYPE=_SHOTTYPE_NORMAL;

let _SCORE='';

let _PLAYERS_MAIN='';
let _PLAYERS_MAIN_FORCE='';

let _PLAYERS_OPTION=new Array();
let _PLAYERS_OPTION_ISALIVE=0;//オプション表示数
const _PLAYERS_OPTION_MAX=4;

let _PLAYERS_MOVE_FLAG=false;
let _PLAYERS_MOVE_DRAW=new Array();//自機移動分の配列

const _PLAYERS_MAX=5;
const _PLAYERS_SHOTS_MAX=2;
const _PLAYERS_MOVE_DRAW_MAX=500;

let _PLAYERS_SHOTS={
	'_SHOTTYPE_NORMAL':new Array(),
	'_SHOTTYPE_DOUBLE':new Array(),
	'_SHOTTYPE_LASER':new Array()
}
let _PLAYERS_MISSILE=new Array();
let _PLAYERS_MISSILE_ISALIVE=false;

let _ENEMIES=new Array();
let _ENEMIES_SHOTS=new Array();
let _ENEMIES_BOUNDS=new Array();

let _POWERCAPSELLS=new Array();

let _POWERMETER='';
let _STAGESELECT='';

let _MAP='';

let _BACKGROUND=new Array();
const _BACKGROUND_STAR_MAX=70;

let _KEYSAFTERPAUSE=new Array();
let _DEF_KEYSAFTERPAUSE	//for full equipment
		='38,38,40,40,37,39,37,39,66,65';


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
_r.open('GET',_url);
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
	}
},//keydown_start

//パワーメーター選択イベント
'keydown_select_powermeter':function(e){
	clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;

	if(e.key==="Enter"||e.key==="enter"){
		_KEYEVENT_MASTER.removeKeydownSelectPowermeter();
		let _c=0;
		let _i=setInterval(function(){
			_POWERMETER.pms_disp();
			if(_c%5===0){
				_POWERMETER.pms_select();
			}
			if(_c>40){
				_PLAYERS_POWER_METER=_POWERMETER._c_pms;
				_PLAYERS_POWER_METER_SHIELD=_POWERMETER._c_pmss;
				clearInterval(_i);
				_DRAW_INIT_OBJECT();
			}
			_c++;
		},1000/_FPS);
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

},
//ステージ選択イベント
'keydown_select_stage':function(e){
	clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;

	if(e.key==="Enter"||e.key==="enter"){
		_MAP.set_stage_map_pattern(_STAGESELECT.mapdef_status);
		_DRAW_POWER_METER_SELECT();
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
},
'keydown_gameclear':function(e){
	if(e.key==='R'||e.key==='r'){
		_DRAW_RESET_OBJECT();
		_DRAW_INIT_OBJECT();
		return false;
	}

	if(e.key==='S'||e.key==='s'){
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
		_PLAYERS_SHOTS_SETINTERVAL=setInterval(function(){
			//ショット
			for(var _i=0;_i<_PLAYERS_SHOTS[_SHOTTYPE].length;_i++){
				let _ps=_PLAYERS_SHOTS[_SHOTTYPE][_i];
				if(!_ps.player._isalive){continue;}
				_ps._sq=
					(_ps._sq===_ps.shots.length-1)
						?0
						:_ps._sq+1;
				var _s=_ps.shots[_ps._sq];
//				console.log(_i+':'+_s._shot_alive);
				//ショット中は、ショットを有効にしない
				if(!_s._shot_alive){_s._shot=true;}
			}
			//ミサイル
			for(var _i=0;_i<_PLAYERS_MISSILE.length;_i++){
				let _pm=_PLAYERS_MISSILE[_i];
				_pm._sq=
					(_pm._sq===_pm.shots.length-1)?
						0
						:_pm._sq+1;
				var _sm=_pm.shots[_pm._sq];
				//ショット中は、ショットを有効にしない
				if(!_sm._shot_alive){_sm._shot=true;}
			}
		},50);
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
		_DRAW_RESET_OBJECT();
		_DRAW_INIT_OBJECT();
		return false;
	}

	if(e.key==='S'||e.key==='s'){
		_DRAW_RESET_OBJECT();
		_DRAW_STAGE_SELECT();
		return false;
	}

},
'keydown_game':function(e){
	if(!_PLAYERS_MAIN.isalive()){return false;}//撃たれたら機種操作不可

	if(e.key==='R'||e.key==='r'){
		_DRAW_RESET_OBJECT();
		_DRAW_INIT_OBJECT();
		return false;
	}

	if(e.key==='S'||e.key==='s'){
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
		_PLAYERS_SHOTS_SETINTERVAL=setInterval(function(){
			//ショット
			for(var _i=0;_i<_PLAYERS_SHOTS[_SHOTTYPE].length;_i++){
				let _ps=_PLAYERS_SHOTS[_SHOTTYPE][_i];
				if(!_ps.player._isalive){continue;}
				_ps._sq=
					(_ps._sq===_ps.shots.length-1)
						?0
						:_ps._sq+1;
				var _s=_ps.shots[_ps._sq];
//				console.log(_i+':'+_s._shot_alive);
				//ショット中は、ショットを有効にしない
				if(!_s._shot_alive){_s._shot=true;}
			}
			//ミサイル
			for(var _i=0;_i<_PLAYERS_MISSILE.length;_i++){
				let _pm=_PLAYERS_MISSILE[_i];
				_pm._sq=
					(_pm._sq===_pm.shots.length-1)?
						0
						:_pm._sq+1;
				var _sm=_pm.shots[_pm._sq];
				//ショット中は、ショットを有効にしない
				if(!_sm._shot_alive){_sm._shot=true;}
			}
		},50);
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
		clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
		_PLAYERS_SHOTS_SETINTERVAL=null;
//		console.log('clear')
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
},//keydown_start

//パワーメーター選択イベント
'keydown_select_powermeter_a':function(e){
	_KEYEVENT_MASTER.removeKeydownSelectPowermeter();

	let _c=0;
	let _i=setInterval(function(){
		_POWERMETER.pms_disp();
		if(_c%5===0){
			_POWERMETER.pms_select();
		}
		if(_c>40){
			_PLAYERS_POWER_METER=_POWERMETER._c_pms;
			_PLAYERS_POWER_METER_SHIELD=_POWERMETER._c_pmss;
			clearInterval(_i);
			_DRAW_INIT_OBJECT();
		}
		_c++;
	},1000/_FPS);
	return false;
},


'keymove_select_powermeter':function(e){
	clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;

	let _rad=_SP_CONTROLLER._get_st(e)._rad;
	e.preventDefault(); // タッチによる画面スクロールを止める

	if(_EVENT_POWERMETER_FLAG===true){return false;}
	_EVENT_POWERMETER_FLAG=true;
	if(_rad>-45&&_rad<=45){
//		 	console.log('left');
		_POWERMETER._c_pmss=
			(_POWERMETER._c_pmss<=0)
			?0
			:_POWERMETER._c_pmss-1;
		_POWERMETER.pms_disp();
		_POWERMETER.pms_select();
		return false;
 	}
	if(_rad>45&&_rad<=135){
//		 	console.log('top');
		_POWERMETER._c_pms=
			(_POWERMETER._c_pms<=0)
			?0:_POWERMETER._c_pms-1;
		_POWERMETER.pms_disp();
		_POWERMETER.pms_select();
		return false;
 	}
	if((_rad>135&&_rad<=180)
		||(_rad<-135&&_rad>=-180)){
//		 console.log('right');
		_POWERMETER._c_pmss=
			(_POWERMETER._c_pmss
				>=_POWERMETER.pmss_selected.length-1)
			?_POWERMETER._c_pmss
			:_POWERMETER._c_pmss+1;
		_POWERMETER.pms_disp();
		_POWERMETER.pms_select();
		return false;
 	}
	if(_rad<-45&&_rad>=-135){
//		 console.log('bottom');
		_POWERMETER._c_pms=
			(_POWERMETER._c_pms>=_POWERMETER.pms_selected.length-1)
			?_POWERMETER._c_pms
			:_POWERMETER._c_pms+1;
		_POWERMETER.pms_disp();
		_POWERMETER.pms_select();
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
	let _rad=_SP_CONTROLLER._get_st(e)._rad;
	let _dis=_SP_CONTROLLER._get_st(e)._dis;

	if(_EVENT_SELECT_STAGE_FLAG){return;}
	_EVENT_SELECT_STAGE_FLAG=true;
	if(_rad>-45&&_rad<=45){
		// 	console.log('left');
		_STAGESELECT.mapdef_status=
			(_STAGESELECT.mapdef_status<=0)
			?0
			:_STAGESELECT.mapdef_status-1;
	}
	if(_rad>45&&_rad<=135){
		// 	console.log('top');
	}
	if((_rad>135&&_rad<=180)
		||(_rad<-135&&_rad>=-180)){
		// console.log('right');
		_STAGESELECT.mapdef_status=
			(_STAGESELECT.mapdef_status
				>=_MAPDEFS.length-1)
			?_STAGESELECT.mapdef_status
			:_STAGESELECT.mapdef_status+1;

	}
	if(_rad<-45&&_rad>=-135){
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
	return false;
},//keydown_select_stage_a
'keydown_gameclear_r':function(e){
	_DRAW_RESET_OBJECT();
	_DRAW_INIT_OBJECT();
	return false;
},//keydown_gameclear_r
'keydown_gameclear_s':function(e){
	_DRAW_RESET_OBJECT();
	_DRAW_INIT_OBJECT();
	return false;
},//keydown_gameclear_s
'keydown_gameover_r':function(e){
	_DRAW_RESET_OBJECT();
	_DRAW_INIT_OBJECT();
	return false;
},
'keydown_gameover_s':function(e){
	_DRAW_RESET_OBJECT();
	_DRAW_STAGE_SELECT();
	return false;
},

'keymove_game_controller':function(e){
	e.preventDefault(); // タッチによる画面スクロールを止める

	_PLAYERS_MOVE_FLAG=true;
	_PLAYERS_MAIN._x=0;
	_PLAYERS_MAIN._y=0;

	let _rad=_SP_CONTROLLER._get_st(e)._rad;
	let _dis=_SP_CONTROLLER._get_st(e)._dis;
	if(_dis<5){return false;}

	if(_rad>-40&&_rad<=40){
		// 	console.log('left');
 		_PLAYERS_MAIN._x
 			=_PLAYERS_MAIN.accel*-1;
 	}
	if(_rad>40&&_rad<=50){
		// 	console.log('left-top');
 		_PLAYERS_MAIN._x
 			=_PLAYERS_MAIN.accel*-0.75;
		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel*-0.75;
		_PLAYERS_MAIN.set_vv_ani('Up');
 	}
	if(_rad>50&&_rad<=130){
		// 	console.log('top');
		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel*-1;
		_PLAYERS_MAIN.set_vv_ani('Up');
 	}
	if(_rad>130&&_rad<=140){
		// 	console.log('right-top');
		_PLAYERS_MAIN._x
 			=_PLAYERS_MAIN.accel*0.75;
		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel*-0.75;
		_PLAYERS_MAIN.set_vv_ani('Up');
 	}
	if((_rad>140&&_rad<=180)
		||(_rad<-140&&_rad>=-180)){
		// console.log('right');
 		_PLAYERS_MAIN._x
 			=_PLAYERS_MAIN.accel;
 	}
	if(_rad<-130&&_rad>=-140){
		// console.log('right-bottom');
		_PLAYERS_MAIN._x
 			=_PLAYERS_MAIN.accel*0.75;
 		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel*0.75;
		_PLAYERS_MAIN.set_vv_ani('Down');
 	}
	if(_rad<-50&&_rad>=-130){
		// console.log('bottom');
 		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel;
		_PLAYERS_MAIN.set_vv_ani('Down');
 	}
	if(_rad<-40&&_rad>=-50){
		// console.log('left-bottom');
		_PLAYERS_MAIN._x
 			=_PLAYERS_MAIN.accel*-0.75;
 		_PLAYERS_MAIN._y
 			=_PLAYERS_MAIN.accel*0.75;
		_PLAYERS_MAIN.set_vv_ani('Down');
 	}

	return false;
	// console.log(_rad);
},//keymove_game_controller
'keyend_game_controller':function(e){
	_SP_CONTROLLER._set_reset();
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
	}else{
		_KEYSAFTERPAUSE=[];
		_DRAW();
	}
	return false;
},//keydown_game_p

'keydown_game_a':function(e){
	if(_PLAYERS_SHOTS_SETINTERVAL!==null){return;}
	_PLAYERS_SHOTS_SETINTERVAL=setInterval(function(){
		//ショット
		for(var _i=0;_i<_PLAYERS_SHOTS[_SHOTTYPE].length;_i++){
			let _ps=_PLAYERS_SHOTS[_SHOTTYPE][_i];
			if(!_ps.player._isalive){continue;}
			_ps._sq=
				(_ps._sq===_ps.shots.length-1)
					?0
					:_ps._sq+1;
			var _s=_ps.shots[_ps._sq];
//				console.log(_i+':'+_s._shot_alive);
			//ショット中は、ショットを有効にしない
			if(!_s._shot_alive){_s._shot=true;}
		}
		//ミサイル
		for(var _i=0;_i<_PLAYERS_MISSILE.length;_i++){
			let _pm=_PLAYERS_MISSILE[_i];
			_pm._sq=
				(_pm._sq===_pm.shots.length-1)?
					0
					:_pm._sq+1;
			var _sm=_pm.shots[_pm._sq];
			//ショット中は、ショットを有効にしない
			if(!_sm._shot_alive){_sm._shot=true;}
		}
	},80);
	return false;
},//keydown_game_a
'keydown_game_b':function(e){
	//装備
	_POWERMETER.playerset();
	return false;
},//keydown_game_b
'keyup_game_a':function(e){
	clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;
//		console.log('clear')
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
//		console.log(_d);
		let _a=parseInt(Math.atan2(_dy,_dx)*180/Math.PI);
		return {'_rad':_a,'_dis':_d};
	},//_get_st
	_set_reset(){
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


class GameObject_PLAYER{
	constructor(_imgfile,
				_x,
				_y,
				_isalive){
		this.img=_CANVAS_IMGS[_imgfile].obj;

		this.x=_x||100;
		this.y=_y||100;
		this._x=0;//移動量x
		this._y=0;//移動量y

		this._isalive=_isalive||false;//存在可否
		this._scalechange=true;

		this.width=0;
		this.height=0;

		this._c=0;
		this.accel=2.0;

		this.shotflag=false;//発射可否
	}
	isalive(){return this._isalive;}
	isshotflag(){return this.shotflag;}
	enemy_collision(){}
	getPlayerCenterPosition(){
		return {_x:this.x+(this.img.width/2),
				_y:this.y+(this.img.height/2)}
	}
	setfalsealive(){this._isalive=false;}
	settruealive(){this._isalive=true;}
}

class GameObject_PLAYER_MAIN
			extends GameObject_PLAYER{
	constructor(){
		super('vicviper1',100,200,true);
		this._isequipped=false;//装備可否
		this._isequipped_count=0;//装備アニメカウントダウン

		this.c_vv_ani=20;
		this.vv_ani=[//アニメ定義
			{img:_CANVAS_IMGS['vicviper3'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper2'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper1'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper4'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper5'].obj,
			scale:1}
		];
		this.vv_e_ani=[//アニメ定義
			{img:_CANVAS_IMGS['vicviper3_e'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper2_e'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper1_e'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper4_e'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper5_e'].obj,
			scale:1}
		];

		this.c_vb_ani=0;
		this.vb_ani=[//噴射アニメ定義
			{img:_CANVAS_IMGS['vicviper_back1'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper_back2'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper_back3'].obj,
			scale:1}
		];
		this.vb_e_ani=[//噴射アニメ定義
			{img:_CANVAS_IMGS['vicviper_back1_e'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper_back1_e'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper_back1_e'].obj,
			scale:1}
		];

		this._eq_ani_c=0;
		this.eq_ani=[//装備時アニメ定義
			{img:_CANVAS_IMGS['vicviper4'].obj,
			scale:1},
			{img:_CANVAS_IMGS['vicviper1'].obj,
			scale:1}
		];

		this._col_ani_c=0;
		this.col_ani=[//衝突時のアニメ定義
			{img:_CANVAS_IMGS['vicviper_bomb'].obj,
			scale:0.5},
			{img:_CANVAS_IMGS['vicviper_bomb'].obj,
			scale:0.7},
			{img:_CANVAS_IMGS['vicviper_bomb'].obj,
			scale:0.5},
			{img:_CANVAS_IMGS['vicviper_bomb'].obj,
			scale:0.3},
			{img:_CANVAS_IMGS['vicviper_bomb'].obj,
			scale:0.1}
		];

		this.shotflag=true;//発射可否
	}
	collapes(){
		//クラッシュした瞬間にキーを無効にする
		_KEYEVENT_MASTER.removeKeydownGame();
		_KEYEVENT_MASTER.removeKeyupGame();

		let _this=this;
		let _si=null;
		let _pl=_this.getPlayerCenterPosition();
		_DRAW_STOP();

		_si=setInterval(function(){
			if(_this._col_ani_c
				>=(_this.col_ani.length*10)-1){
				//アニメーションが終わったら終了
				clearInterval(_si);
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

		},1000/_FPS);
	//		console.log(this._col_ani_c)
	}
	enemy_collision(_e){
		//forcefieldが生きてる間はスルー
		if(_PLAYERS_POWER_METER_SHIELD===1
			&&_PLAYERS_MAIN_FORCE.isalive()){
			return;
		}
		if(!_GAME.isCollision(this,_e)){return;}
		_e.collision();
		this.setfalsealive();
	}
	enemy_shot_collision(_e){
		//forcefieldが生きてる間はスルー
		if(_PLAYERS_POWER_METER_SHIELD===1
			&&_PLAYERS_MAIN_FORCE.isalive()){
			return;
		}
//		console.log(_GAME.isCollision(this,_e));
		if(!_GAME.isCollision(this,_e)){return;}
		_e.init();
		this.setfalsealive();
	}
	set_equipped(){
		this._isequipped_count=20;
	}
	map_collition(){
		//forcefieldが生きてる間はスルー
		if(_PLAYERS_POWER_METER_SHIELD===1
			&&_PLAYERS_MAIN_FORCE.isalive()){
			return;
		}
		//プレーヤーの中心座標取得
		let _pl=this.getPlayerCenterPosition();
		//MAPの位置を取得
		let _map_x=
			parseInt((_pl._x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=
			parseInt(_pl._y/_MAP.t);

		if(_MAP.isMapCollision(_map_x,_map_y)){
			this.setfalsealive();
		}

	}
	set_vv_ani(_e_key){
		//アニメーション有効範囲
//		if(this.c_vv_ani>=50-2||this.c_vv_ani<0+2){return;}
		if(_e_key==='ArrowUp'||_e_key==='Up'){
			this.c_vv_ani-=2;
		}
		if(_e_key==='ArrowDown'||_e_key==='Down'){
			this.c_vv_ani+=2;
		}
	}
	move(){
		let _this=this;

		//敵・弾に当たったら終了
		if(!_this.isalive()){_this.collapes();return;}
		_this.map_collition();

		//移動量の設定
		if(_PLAYERS_MOVE_FLAG){
			//キーが押された場合
			_this.x+=_this._x;
			_this.y+=_this._y;
			_this.x=(function(_i){
				if(_i<50){
					_this._x=0;
					return 50;
				}
				if(_i>_CANVAS.width-100){
					_this._x=0;
					return _CANVAS.width-100;
				}
				return _i+_this._x;
			})(_this.x);
			_this.y=(function(_i){
				if(_i<50-(_this.img.height/4)){
					_this._y=0;
					return 50-(_this.img.height/4);
				}
				if(_i>_CANVAS.height-100-(_this.img.height/4)){
					_this._y=0;
					return _CANVAS.height-100-(_this.img.height/4);
				}
				return _i+_this._y;
			})(_this.y);
		}else{
			_this._x=0;
			_this._y=0;
		}

		//本機のアニメーション設定
		if(!_PLAYERS_MOVE_FLAG){
			//コントローラーから離れたら
			//自機を元に戻す
			if(_this.c_vv_ani>25){
				_this.c_vv_ani-=1;
			}else if(_this.c_vv_ani<25){
				_this.c_vv_ani+=1;
			}else{
				_this.c_vv_ani=25;
			}
		}else{
			if(_this.c_vv_ani>50-4){
				_this.c_vv_ani=50-4;
			}else if(_this.c_vv_ani<0+4){
				_this.c_vv_ani=0+4;
			}else{
			}

		}
		//本機のアニメーション
		let _img_vv=(function(){
			let _c=parseInt(_this.c_vv_ani/10);
			if(_this._isequipped_count<=0){
				return _this.vv_ani[_c].img;
			}
			_this._isequipped_count--;
			if(_this._isequipped_count>0
				&&_this._isequipped_count%2===0){
				return _this.vv_e_ani[_c].img;
			}
			return _this.vv_ani[_c].img;
		})();

		_CONTEXT.drawImage(
			_img_vv,_this.x,_this.y,
				_img_vv.width,_img_vv.height
		);

		//噴射アニメ
		let _img_vb=(function(){
			let _c=parseInt(_this.c_vb_ani/3);

			if(_this._isequipped_count>0
				&&_this._isequipped_count%2===0){
				return _this.vb_e_ani[_c].img;
			}
			return _this.vb_ani[_c].img;
		})();

		_this.width=_img_vb.width;
		_this.height=_img_vb.height;

		_this.c_vb_ani=
			_GAME._ac._get(_this.c_vb_ani,_this.vb_ani,3);

		_CONTEXT.drawImage(
			_img_vb,_this.x,_this.y+22,
				_img_vb.width,_img_vb.height
		);


		//位置を覚える
		//多少の位置調整あり
		if(_PLAYERS_MOVE_DRAW.length
			===_PLAYERS_MOVE_DRAW_MAX){
				_PLAYERS_MOVE_DRAW.pop();}
		if(_PLAYERS_MOVE_FLAG){
			_PLAYERS_MOVE_DRAW.unshift({
				_x:parseInt(_this.x+(_this.img.width/10)),
				_y:parseInt(_this.y+(_this.img.height/4))
			});
		}
	}
}


class GameObject_PLAYER_MAIN_RED
			extends GameObject_PLAYER_MAIN{
	constructor(){
		super('vicviper1',100,200,true);
		this.col_ani=[//衝突時のアニメ定義
			{img:_CANVAS_IMGS['vicviper_bomb_red'].obj,
			scale:0.5},
			{img:_CANVAS_IMGS['vicviper_bomb_red'].obj,
			scale:0.7},
			{img:_CANVAS_IMGS['vicviper_bomb_red'].obj,
			scale:0.5},
			{img:_CANVAS_IMGS['vicviper_bomb_red'].obj,
			scale:0.3},
			{img:_CANVAS_IMGS['vicviper_bomb_red'].obj,
			scale:0.1}
		];
	}
}

//_PLAYERS_MAINにしたがって動く。
//（_PLAYERS_MOVE_DRAWの配列に従う）
class GameObject_PLAYER_OPTION
			extends GameObject_PLAYER{
	constructor(_imgfile,
				_x,
				_y,
				_isalive){
		super(_imgfile,
					_x,
					_y,
					_isalive);
		this.scalemax=1.3;//拡大値
		this.scalemin=1.0;//縮小値

		this._ani_c=0;
		this.ani=[//アニメーション定義
			{img:_CANVAS_IMGS['option'].obj,
			scale:1},
			{img:_CANVAS_IMGS['option'].obj,
			scale:0.9},
			{img:_CANVAS_IMGS['option'].obj,
			scale:0.8},
			{img:_CANVAS_IMGS['option'].obj,
			scale:0.7},
			{img:_CANVAS_IMGS['option'].obj,
			scale:0.8},
			{img:_CANVAS_IMGS['option'].obj,
			scale:0.9}
		];
	}
	move(_pmd_elem){
		let _this=this;
		if(_PLAYERS_MOVE_DRAW[_pmd_elem]
					===undefined){return;}
		_this.x=_PLAYERS_MOVE_DRAW[_pmd_elem]._x;
		_this.y=_PLAYERS_MOVE_DRAW[_pmd_elem]._y;

		if(!_this._isalive){return;}
		if(_this.x===undefined||
			_this.y===undefined){return;}

		_this.shotflag=true;

		let _pl=_this.getPlayerCenterPosition();
		_this.img=(function(_t){
			_this._ani_c=
				(_this._ani_c>=(_this.ani.length*3)-1)?0:_this._ani_c+1;
			return _this.ani[parseInt(_this._ani_c/3)].img;
		})(_this);
		let _c=parseInt(_this._ani_c/3);
		let _w=_this.img.width;
		let _h=_this.img.height;
		let _sw=_w*_this.ani[_c].scale;
		let _sh=_h*_this.ani[_c].scale;
		_CONTEXT.drawImage(
			_this.img,
			_pl._x-(_sw/2),
			_pl._y-(_sh/2),
			_sw,
			_sh
		);

	}
}


class GameObject_FORCEFIELD{
	constructor(){
		this.img='';
		this.STATUS_MAX=4;
		this.x=0;
		this.y=0;
		this.width=0;
		this.height=0;
		this.type='forcefield';

		this._c=0;
		this._scale=0;

		this._eid=0;//敵ID

		this.ani=[//アニメーション定義
			{img:_CANVAS_IMGS['forcefield1'].obj,
			scale:1.0},
			{img:_CANVAS_IMGS['forcefield2'].obj,
			scale:1.0}
		];
	};
	init(){
		this._scale=1;
		this.img=this.ani[0].img;
		this.width=this.img.width;
		this.height=this.img.height;
	}
	isalive(){
		return (this._scale===0)?false:true;
	}
	enemy_collision(_e){
		if(_GAME.isCollision(this,_e)){
			_e.collision();
			this.reduce();
		}
	}
	enemy_shot_collision(_e){
		if(_GAME.isCollision(this,_e)){
			_e.init();
			this.reduce();
		}
	}

	getPlayerCenterPosition(){
		return {_x:this.x+(this.width/2),
				_y:this.y+(this.height/2)}
	}
	map_collition(){
		//プレーヤーの中心座標取得
		let _pl=this.getPlayerCenterPosition();
		//MAPの位置を取得
		let _map_x=
			parseInt((_pl._x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=parseInt(_pl._y/_MAP.t);

		if(_MAP.isMapCollision(_map_x,_map_y)){
			this.reduce();
		}

	}
	reduce(){
		this._scale-=0.15;
		//ある大きさになれば削除
		if(this._scale<0.7){
			this._scale=0;
			_POWERMETER._set_meter_on('000001');
		}
		this.width*=this._scale;
		this.height*=this._scale;
	}
	move(_GO){
		let _this=this;
		_this.map_collition();
		if(_this._scale===0){return;}

		_this.x=_GO.getPlayerCenterPosition()._x
					-(_this.width/2)
					-6;
		_this.y=_GO.getPlayerCenterPosition()._y
					-(_this.height/2)
					-2;

		let _img=(function(_t){
			_this._c=
				(_this._c>=(_this.ani.length*5)-1)?0:_this._c+1;
			return _this.ani[parseInt(_this._c/5)].img;
		})(_this);
		_CONTEXT.drawImage(
			_img,_this.x,_this.y,
				_this.width,_this.height
		);
	}
}

class GameObject_FORCEFIELD_RED
				extends GameObject_FORCEFIELD{
	constructor(){
		super();
		this.ani=[//アニメーション定義
			{img:_CANVAS_IMGS['forcefield_red1'].obj,
			scale:1.0},
			{img:_CANVAS_IMGS['forcefield_red2'].obj,
			scale:1.0}
		];
	};
}

class GameObject_SHIELD
				extends GameObject_FORCEFIELD{
	constructor(){
		super();
		this.STATUS_MAX=15;
		this.type='shield';

		this.ani=[//アニメーション定義
			{img:_CANVAS_IMGS['shield1'].obj,
			scale:1},
			{img:_CANVAS_IMGS['shield2'].obj,
			scale:1}
		];
	}
	getPlayerCenterPosition(){
		//センタリングはプレーヤーの中心から約右に配置
		return {_x:this.x+(this.width/2),
				_y:this.y+this.height}
	}
	init(){
		this._scale=1;
		this.img=this.ani[0].img;
		this.width=this.img.width;
		this.height=this.img.height;
	}
	isalive(){
		return (this._scale===0)?false:true;
	}
	enemy_collision(_e){
		if(_GAME.isShieldCollision(this,_e)){
			_e.collision();
			this.reduce();
		}
	}
	enemy_shot_collision(_e){
		if(_GAME.isShieldCollision(this,_e)){
			_e.init();
			this.reduce();
		}
	}
	map_collition(_p){
		let _this=this;
		//プレーヤーの中心座標取得
		let _pl=_this.getPlayerCenterPosition();
		//MAPの位置を取得
		//シールドの上下画像の中心点からMAP判定する。
		let _map_x=
			parseInt((_pl._x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=parseInt(_pl._y/_MAP.t);

		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this.reduce();
			return;
		}

		//シールドの上端
		_map_y=parseInt(this.y/_MAP.t);
		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this.reduce();
			return;
		}

		//シールドの下端
		_map_y=parseInt((_pl._y-10+this.height)/_MAP.t);
		if(_MAP.isMapCollision(_map_x,_map_y)){
			_this.reduce();
			return;
		}

	}
	reduce(){
		this._scale-=0.01;
		//ある大きさになれば削除
		if(this._scale<0.86){
			this._scale=0;
			_POWERMETER._set_meter_on('000001');
		}
		this.width*=this._scale;
		this.height*=this._scale;
	}
	move(_p){
		let _this=this;
		if(_this._scale===0){return;}

		let _pl=_p.getPlayerCenterPosition();

		_this.map_collition(_p);

		let _img=(function(){
			_this._c=(_this._c>=(_this.ani.length*5)-1)?0:_this._c+1;
			return _this.ani[parseInt(_this._c/5)].img;
		})(_this);

		let _x=_p.x+_p.img.width;
		let _y1=_pl._y;//下
		let _y2=_pl._y-(_this.height*_this._scale);//上
		_CONTEXT.drawImage(
			_img,_x,_y1,_this.width,_this.height
		);
		_CONTEXT.drawImage(
			_img,_x,_y2,_this.width,_this.height
		);
		this.x=_x;
		this.y=_y2;
//		this.width*=_sc;

	}
}

class GameObject_SHIELD_RED
				extends GameObject_SHIELD{
	constructor(){
		super();
		this.ani=[//アニメーション定義
			{img:_CANVAS_IMGS['shield_red1'].obj,
			scale:0.4},
			{img:_CANVAS_IMGS['shield_red2'].obj,
			scale:0.4}
		];
	};
}

class GameObject_SHOTS{
	constructor(_p){
		this.shots=new Array();
		this.player=_p;//プレーヤー
		this._sq=0;//ショット順
	}
	enemy_collision(_e){//敵への当たり処理
		if(!this.player.isalive()){return;}
		for(let _k=0;_k<this.shots.length;_k++){
			let _t=this.shots[_k];
			if(!_t._shot_alive){continue;}
			//自機より後ろは無視する。
			if(_e.x<this.player.x){continue;}
			let _ec=_e.getEnemyCenterPosition();

			let _a=Math.sqrt(
				Math.pow(_ec._x-_t.x,2)+
				Math.pow(_ec._y-_t.y,2)
			);
			let _s=(_a<_e.img.height)?true:false;
			if(_s&&_e.isalive()){
				_e.collision(_t);
				_t._init();
			}
		}
	}
	map_collition(){}
	getshottype(){}
	move(){}
}

class GameObject_SHOTS_MISSILE
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		this.col_mis=[//ミサイル衝突アニメ定義
			{fs:'rgba(255,246,72,1)',scale:8},
			{fs:'rgba(255,131,62,1)',scale:10},
			{fs:'rgba(255,131,62,1)',scale:12},
			{fs:'rgba(255,131,62,1)',scale:14},
			{fs:'rgba(133,0,4,1)',scale:14},
			{fs:'rgba(133,0,4,1)',scale:14}
		];

		let _t=this;
		for(let _i=0;_i<_PLAYERS_SHOTS_MAX;_i++){
			this.shots.push({
				sid:_SHOTTYPE_MISSILE,
				id:_i,
				x:0,//処理変数：照射x軸
				y:0,
				_t:0,//ミサイル発射後時間
				_st:'_st1',//ミサイルのステータス
				_img:new Image(),//ミサイルの画像
				_c:0,//爆風アニメーションカウント
				_c_area:25,//ミサイル、爆風の当たり判定
				_enemy:null,//ミサイルに衝突した敵のオブジェクト
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this._t=0,
					this._c=0,
					this._c_area=25,
					this._st='_st1',
					this._img=new Image(),
					this._enemy=null,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}

		let _this=this;
		this.mis_status={
			'_st1':function(_t){
				//斜め下
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+4;
				})(_t.x);
				_t.y=(function(_i){
					return (!_t._shot_alive)?_p._y:_i+8;
				})(_t.y);
				_t._img=_CANVAS_IMGS['missile1'].obj;
			},
			'_st2':function(_t){
				//真下
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i;
				})(_t.x);
				_t.y=(function(_i){
					return (!_t._shot_alive)?_p._y:_i+8;
				})(_t.y);
				_t._img=_CANVAS_IMGS['missile2'].obj;
			},
			'_st3':function(_t){
				//真横
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+8;
				})(_t.x);
				_t.y=(function(_i){
					return (!_t._shot_alive)?_p._y:_i;
				})(_t.y);
				_t._img=_CANVAS_IMGS['missile3'].obj;
			},
			'_st4':function(_t){
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+3;
 				})(_t.x);
				_t.y=(function(_i){
 					return (!_t._shot_alive)?_p._y:_i+3;
 				})(_t.y);
				_t._img=_CANVAS_IMGS['missile4'].obj;
			},
			'_st5':function(_t){
				//_st5→_st6
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+3;
 				})(_t.x);
				_t.y=(function(_i){
 					return (!_t._shot_alive)?_p._y:_i+3;
 				})(_t.y);
				_t._img=_CANVAS_IMGS['missile5'].obj;
			},
			'_st6':function(_t){
				//_st6→_st7
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+2;
 				})(_t.x);
				_t.y=(function(_i){
 					return (!_t._shot_alive)?_p._y:_i+6;
 				})(_t.y);
				_t._img=_CANVAS_IMGS['missile1'].obj;
			},
			'_st7':function(_t){
				//_st7→_st8
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+4;
 				})(_t.x);
				_t.y=(function(_i){
 					return (!_t._shot_alive)?_p._y:_i+5;
 				})(_t.y);
				_t._img=_CANVAS_IMGS['missile5'].obj;
			},
			'_st8':function(_t){
				//_st7→_st8
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+4;
 				})(_t.x);
				_t.y=(function(_i){
 					return (!_t._shot_alive)?_p._y:_i+3;
 				})(_t.y);
				_t._img=_CANVAS_IMGS['missile4'].obj;
			}
		}

	}
	enemy_collision(_e,_t){
		//非表示のプレーヤーは無視する
		if(!this.player.isalive()){return;}
		//弾が発していない場合は無視する
		if(!_t._shot_alive){return;}
		if(_t._c>0){return}//爆風中は無視

		//ミサイル衝突判定
		if(_GAME.isMisShotCollision(_t,_e)){
			//前回衝突した敵と同じ場合は無視する。
			if(_t._enemy===_e.id){return;}
			_e.collision(_t);
			if(_t._c===0){
				_t._c=1;
			}
			//衝突した敵を覚える
			_t._enemy=_e.id;
		}

	}
	get_missile_status(_t){return _t._st;}
	set_missile_status(_t,_st){_t._st=_st;}
	map_collition(_t){
		let _map_x=
			parseInt((_t.x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=parseInt(_t.y/_MAP.t);

		//段差を滑らかに表示させるためのもの
		//ミサイル落下 _st3→_st4
		if(this.get_missile_status(_t)==='_st4'){
			this.set_missile_status(_t,'_st5');
		}

		//ミサイル着地 _st1→_st6→_st7→_st3
		//着座時、_st3が必ず壁より１マス上に
		//配置する必要がある。
		if(this.get_missile_status(_t)==='_st6'){
//			console.log('_st6');
			this.set_missile_status(_t,'_st7');
		}
		if(this.get_missile_status(_t)==='_st7'){
//			console.log('_st7');
			_t.x+=3;
			this.set_missile_status(_t,'_st8');
		}
		if(this.get_missile_status(_t)==='_st8'){
//			console.log('_st8');
			_t.y=((_map_y+1)*_MAP.t)-17;
			this.set_missile_status(_t,'_st3');
		}

		//MAPに入る手前は無視する
		if(_MAP.isMapBefore(_map_x,_map_y)){return;}
		//MAPから抜けた後のミサイルの状態
		if(_MAP.isMapOver(_map_x,_map_y)){
//			console.log('===================');
			if(this.get_missile_status(_t)!=='_st1'){
				this.set_missile_status(_t,'_st2');
				return;
			}
			if(this.get_missile_status(_t)==='_st2'){
				return;
			}
		}

		//落ちかけ
		if(this.get_missile_status(_t)==='_st5'){
			_map_x=
				parseInt((_t.x+_t._img.width
						+_SCROLL_POSITION
						-_MAP.initx)
						/_MAP.t);
			//MAPを超えた場合は、再落下させる
			//_st4→_st5
			if(_MAP.isMapOver(_map_x,_map_y)){
				this.set_missile_status(_t,'_st4');
				return;
			}
			//真下に衝突がある場合
			if(_MAP.isMapCollision(_map_x,_map_y+1)){
				//→st6→st7→st3への調整のためのy位置調整
				_t.y=(_map_y*_MAP.t)-5;
				this.set_missile_status(_t,'_st6');
				return;
			}

			//真下に壁がない場合は落下
			if(!_MAP.isMapCollision(_map_x,_map_y+1)){
				this.set_missile_status(_t,'_st2');
				_t.x+=(_t._img.width/2);
				return;
			}

			//真横に壁がある
			if(_MAP.isMapCollision(_map_x+1,_map_y)){
				_t._init();
				return;
			}
		}


		if(this.get_missile_status(_t)==='_st3'){
//			console.log('_st3');
			_map_x=
				parseInt((_t.x+_t._img.width
						+_SCROLL_POSITION
						-_MAP.initx)
						/_MAP.t);
			//壁にぶつかる(壁中)
			if(_MAP.isMapCollision(_map_x,_map_y)){
				_t._init();
				return;
			}

			//壁にぶつかる
			_map_x=
				parseInt((_t.x+(_t._img.width/2)
						+_SCROLL_POSITION
						-_MAP.initx)
						/_MAP.t);
			//真横に壁がある場合、初期化
			if(_MAP.isMapCollision(_map_x,_map_y)){
				_t._init();
				return;
			}

			//MAPからはみ出る
			if(_MAP.isMapOver(_map_x,_map_y)){
				this.set_missile_status(_t,'_st4');
				return;
			}
			//真下に壁がない場合
			if(!_MAP.isMapCollision(_map_x,_map_y+1)){
				this.set_missile_status(_t,'_st4');
				return;
			}

		}

		if(this.get_missile_status(_t)==='_st2'){
//			console.log('_st2');
			_map_y=parseInt((_t.y+_t._img.height/2)/_MAP.t);
			//下の壁にぶつかる
			if(_MAP.isMapCollision(_map_x,_map_y+1)){
				_t.y=(_map_y*_MAP.t)-5;
				this.set_missile_status(_t,'_st6');
				return;
			}
		}

		if(this.get_missile_status(_t)==='_st1'){
			_map_y=parseInt((_t.y+_t._img.height/2)/_MAP.t);
			//自身、あるいはその下の壁にぶつかる
			if(_MAP.isMapCollision(_map_x,_map_y)
				||_MAP.isMapCollision(_map_x,_map_y+1)
				){
				//→st6→st7→st3への調整のためのy位置調整
				_t.y=(_map_y*_MAP.t)-5;
				this.set_missile_status(_t,'_st7');
				return;
			}
		}

	}
	collapse_missile(_t){
		let _this=this;
		//爆風を表示
		if(_t._c>=_this.col_mis.length*5){
			_t._init();
			return;
		}
		var _c=parseInt(_t._c/5);
		_t._c_area=_this.col_mis[_c].scale;

		_CONTEXT.fillStyle=_this.col_mis[_c].fs;
 	 	_CONTEXT.beginPath();
 		_CONTEXT.arc(_t.x,
 					_t.y+4,
 					_this.col_mis[_c].scale,
 					0,
 					Math.PI*2,false);
 		_CONTEXT.fill();

		if(this.col_mis[_c-1]!==undefined){
			_CONTEXT.fillStyle
				=_this.col_mis[_c-1].fs;
		 	_CONTEXT.beginPath();
			_CONTEXT.arc(_t.x,
						_t.y+4,
						_this.col_mis[_c-1].scale,
						0,
						Math.PI*2,false);
			_CONTEXT.fill();
		}
		_t._c++;
	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		if(_p.x===undefined){return;}
		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}
//			console.log(_t._c);
			if(_t._c>0){
				//爆発アニメ開始時はここで終了
				_this.collapse_missile(_t);
				continue;
			}
//console.log('_j:'+_j+'   _t.x:'+_t.x+'   _t.y:'+_t.y);
//console.log('_map_x:'+_map_x);

			if (_t.y>_CANVAS.height
				||_t.x>_CANVAS.width){
				_t._init();
//				console.log('init')
				continue;
			}
			_this.mis_status[_t._st](_t);
			_CONTEXT.drawImage(
				_t._img,
				_t.x,
				_t.y,
				_t._img.width,
				_t._img.height
			);

			_t._shot_alive=true;
//			console.log(_t._y);
		}
	}

}//GameObject_SHOTS_MISSILE

class GameObject_SHOTS_MISSILE_PHOTOM
			extends GameObject_SHOTS_MISSILE{
	constructor(_p){
		super(_p);
		let _this=this;
		this.mis_status={
			'_st1':function(_t){
				//斜め下
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+4;
				})(_t.x);
				_t.y=(function(_i){
					return (!_t._shot_alive)?_p._y:_i+8;
				})(_t.y);
				_t._img=_CANVAS_IMGS['missile3'].obj;
			},
			'_st2':function(_t){
				//真下
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i;
				})(_t.x);
				_t.y=(function(_i){
					return (!_t._shot_alive)?_p._y:_i+8;
				})(_t.y);
				_t._img=_CANVAS_IMGS['missile2'].obj;
			},
			'_st3':function(_t){
				//真横
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+8;
				})(_t.x);
				_t.y=(function(_i){
					return (!_t._shot_alive)?_p._y:_i;
				})(_t.y);
				_t._img=_CANVAS_IMGS['missile3'].obj;
			},
			'_st4':function(_t){
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+3;
 				})(_t.x);
				_t.y=(function(_i){
 					return (!_t._shot_alive)?_p._y:_i+3;
 				})(_t.y);
				_t._img=_CANVAS_IMGS['missile4'].obj;
			},
			'_st5':function(_t){
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+3;
 				})(_t.x);
				_t.y=(function(_i){
 					return (!_t._shot_alive)?_p._y:_i+3;
 				})(_t.y);
				_t._img=_CANVAS_IMGS['missile5'].obj;
			},
			'_st6':function(_t){
				//_st6→_st7
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+2;
 				})(_t.x);
				_t.y=(function(_i){
 					return (!_t._shot_alive)?_p._y:_i+6;
 				})(_t.y);
				_t._img=_CANVAS_IMGS['missile1'].obj;
			},
			'_st7':function(_t){
				//_st7→_st8
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+4;
 				})(_t.x);
				_t.y=(function(_i){
 					return (!_t._shot_alive)?_p._y:_i+5;
 				})(_t.y);
				_t._img=_CANVAS_IMGS['missile5'].obj;
			},
			'_st8':function(_t){
				//_st7→_st8
				let _p=_this.player//プレーヤーの中心座標取得
						.getPlayerCenterPosition();
				_t.x=(function(_i){
					//撃ち始めは自機位置から放つ
					return (!_t._shot_alive)?_p._x:_i+4;
 				})(_t.x);
				_t.y=(function(_i){
 					return (!_t._shot_alive)?_p._y:_i+3;
 				})(_t.y);
				_t._img=_CANVAS_IMGS['missile4'].obj;
			}
		}
	}
	enemy_collision(_e,_t){
		//非表示のプレーヤーは無視する
		if(!this.player.isalive()){return;}
		//弾が発していない場合は無視する
		if(!_t._shot_alive){return;}

		//ミサイル衝突判定
		if(_GAME.isMisShotCollision(_t,_e)){
			//前回衝突した敵と同じ場合は無視する。
			if(_t._enemy===_e.id){return;}
			_e.collision(_t);
			//敵を倒した場合は貫通させる。
			if(!_e.isalive()){return;}
			if(_t._c===0){
				_t._c=1;
			}
			//衝突した敵を覚える
			_t._enemy=_e.id;
		}

	}
}//GameObject_SHOTS_MISSILE_PHOTOM

class GameObject_SHOTS_MISSILE_SPREADBOMB
			extends GameObject_SHOTS_MISSILE{
	constructor(_p){
		super(_p);
		this.col_mis=[//ミサイル衝突アニメ定義
			{fs:'rgba(198,231,247,1)',scale:30},
			{fs:'rgba(54,115,255,1)',scale:40},
			{fs:'rgba(54,115,255,1)',scale:50},
			{fs:'rgba(54,115,255,1)',scale:60},
			{fs:'rgba(0,27,145,1)',scale:60},
			{fs:'rgba(0,27,145,1)',scale:60},
			{fs:'rgba(0,27,145,1)',scale:70}
		];
		this.mis_status={
			'_st1':function(_t){
				_t._img=_CANVAS_IMGS['missile4'].obj;
			},
			'_st2':function(_t){
				_t._img=_CANVAS_IMGS['missile5'].obj;
			},
			'_st3':function(_t){
				_t._img=_CANVAS_IMGS['missile1'].obj;
			}
		}
	}
	enemy_collision(_e,_t){
		//非表示のプレーヤーは無視する
		if(!this.player.isalive()){return;}
		//弾が発していない場合は無視する
		if(!_t._shot_alive){return;}

		//ミサイル衝突判定
		//ミサイルの先端と敵の中心点より判定
		let _ec=_e.getEnemyCenterPosition();
		let _s=(function(){
			//爆風判定
			if(_t._c>0){
				return (Math.abs(_ec._x-_t.x)
					<(_e.img.width/2)+_t._c_area)
					&&
					(Math.abs(_ec._y-_t.y)
					<(_e.img.height/2)+_t._c_area);
			}
			//通常判定
			return _GAME.isMisShotCollision(_t,_e);
		})();

		if(_s){
			//前回衝突した敵と同じ場合は無視する。
			if(_t._enemy===_e.id){return;}
			_e.collision(_t);
			if(_t._c===0){
				_t._c=1;
			}
			//衝突した敵を覚える
			_t._enemy=_e.id;
		}

	}
	map_collition(_t){
		//MAPの位置を取得
		let _map_x=
			parseInt((_t.x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=parseInt(_t.y/_MAP.t);

		if(_MAP.isMapCollision(_map_x,_map_y)
			||_MAP.isMapCollision(_map_x+1,_map_y)){
			this.collapse_missile(_t);
			return;
		}

	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		if(_p.x===undefined){return;}
		let _pl=_p.getPlayerCenterPosition();

		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}
//			console.log(_t._c);
			if(_t._c>0){
				//爆発アニメ開始時はここで終了
				_this.collapse_missile(_t);
				continue;
			}

			_t._t++;
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				return (!_t._shot_alive)?_pl._x:_i+4;
			})(_t.x);
			_t.y=(function(_i){
				return (!_t._shot_alive)?_pl._y-8:
					_i+(_t._t*_t._t/200);
			})(_t.y);

			_t._st=(function(){
				if(_t._t>20&&_t._t<30){
					return '_st2';
				}
				if(_t._t>30){
					return '_st3';
				}
				return '_st1';
			})();

			if (_t.y>_CANVAS.height
				||_t.x>_CANVAS.width){
				_t._init();
				continue;
			}
			_this.mis_status[_t._st](_t);
			_CONTEXT.drawImage(
				_t._img,
				_t.x,
				_t.y,
				_t._img.width,
				_t._img.height
			);

			_t._shot_alive=true;
//			console.log(_t._y);
		}
	}
}//GameObject_SHOTS_MISSILE_SPREADBOMB

class GameObject_SHOTS_MISSILE_2WAY
			extends GameObject_SHOTS_MISSILE{
	constructor(_p){
		super(_p);
		this.mis_status={
			'_st1':function(_t){
				_t._img=_CANVAS_IMGS['missile4'].obj;
			},
			'_st2':function(_t){
				_t._img=_CANVAS_IMGS['missile5'].obj;
			},
			'_st3':function(_t){
				_t._img=_CANVAS_IMGS['missile1'].obj;
			},
			'_st4':function(_t){
				_t._img=_CANVAS_IMGS['missile6'].obj;
			},
			'_st5':function(_t){
				_t._img=_CANVAS_IMGS['missile7'].obj;
			},
			'_st6':function(_t){
				_t._img=_CANVAS_IMGS['missile8'].obj;
			}
		}
	}
	enemy_collision(_e,_t){
		//非表示のプレーヤーは無視する
		if(!this.player.isalive()){return;}
		//弾が発していない場合は無視する
		if(!_t._shot_alive){return;}
		//ミサイル衝突判定
		if(_GAME.isMisShotCollision(_t,_e)){
			//前回衝突した敵と同じ場合は無視する。
			if(_t._enemy===_e.id){return;}
			_e.collision(_t);
			if(_t._c===0){
				_t._c=1;
			}
			//衝突した敵を覚える
			_t._enemy=_e.id;
		}

	}
	map_collition(_t){
		//MAPの位置を取得
		let _map_x=
			parseInt((_t.x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _tmp=(_t.id===0)
					?_t.y
					//?_t.y+(_t._img.height/2*-1)
					:_t.y+_t._img.height
		let _map_y=
			parseInt(_tmp/_MAP.t);

		if(_MAP.isMapCollision(_map_x,_map_y)){
			this.collapse_missile(_t);
			return;
		}

	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		if(_p.x===undefined){return;}

		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();
		//ここでは各要素にショット権限を与え、
		//各弾に対して、敵に弾を当てた、
		//あるいは画面からはみ出た時に、
		//_shot_aliveをfalseにする。

		//0番目の要素は上
		//1番目の要素は下
		let _s=this.shots[0]._shot|
					this.shots[1]._shot;
		let _sa=this.shots[0]._shot_alive|
					this.shots[1]._shot_alive;
		if(!_s&&!_sa){return;}
		if(_s&&!_sa){
			//ショット打ち始め
			this.shots[0]._shot_alive=true;
			this.shots[1]._shot_alive=true;
		}
		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];

			if(!_t._shot_alive){continue;}

			if(_t._c>0){
				//爆発アニメ開始時はここで終了
				_this.collapse_missile(_t);
				continue;
			}

			_t._t+=1;
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				if(_j===0){
					return (!_sa)?_pl._x:_i+1;
				}else{
					return (!_sa)?_pl._x:_i+1;
				}
			})(_t.x);
			_t.y=(function(_i){
				if(_j===0){
					return (!_sa)?_pl._y-20:_i+(_t._t*_t._t/100)*-1;
				}else{
					return (!_sa)?_pl._y:_i+(_t._t*_t._t/100);
				}
			})(_t.y);

			if(_j===0){
				if (_t.x>_CANVAS.width
					||_t.y<0){
					_t._init();
					continue;
				}

				_t._st=(function(){
					if(_t._t>20&&_t._t<30){
						return '_st5';
					}
					if(_t._t>30){
						return '_st6';
					}
					return '_st4';
				})();
			}else{
				if (_t.x>_CANVAS.width
					||_t.y>_CANVAS.height){
					_t._init();
					continue;
				}

				_t._st=(function(){
					if(_t._t>20&&_t._t<30){
						return '_st2';
					}
					if(_t._t>30){
						return '_st3';
					}
					return '_st1';
				})();
			}

			_this.mis_status[_t._st](_t);
			_CONTEXT.drawImage(
				_t._img,
				_t.x,
				_t.y,
				_t._img.width,
				_t._img.height
			);

			_t._shot_alive=true;
		}
	}
}//GameObject_SHOTS_MISSILE_2WAY


class GameObject_SHOTS_NORMAL
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		this.speed=20;

		for(let _i=0;_i<_PLAYERS_SHOTS_MAX;_i++){
			this.shots.push({
				sid:_SHOTTYPE_NORMAL,
				x:0,//処理変数：照射x軸
				y:0,
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}
	}
	map_collition(_t){
		//MAPの位置を取得
		let _map_x=
			parseInt((_t.x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=parseInt(_t.y/_MAP.t);

		if(_MAP.isMapCollision(_map_x,_map_y)
			||_MAP.isMapCollision(_map_x+1,_map_y)){
			_t._init();
		}

	}
	move(){
		let _p=this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();

		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}
// 			console.log(_p._x);

			let _s=this.speed;
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				return (!_t._shot_alive)?_pl._x:_i+_s;
			})(_t.x);
			_t.y=(function(_i){
				return (!_t._shot_alive)?_pl._y:_i;
			})(_t.y);

			if (_t.x>_CANVAS.width){
				_t._init();
				continue;
			}

			let _img=_CANVAS_IMGS['shot1'].obj;
			_CONTEXT.drawImage(
				_img,
				_t.x,
				_t.y,
				_img.width,
				_img.height
			);

			_t._shot_alive=true;
		}
	}
}

class GameObject_SHOTS_DOUBLE
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		this.speed=30;

		for(let _i=0;_i<_PLAYERS_SHOTS_MAX;_i++){
			this.shots.push({
				sid:_SHOTTYPE_DOUBLE,
				x:0,//処理変数：照射x軸
				y:0,
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this._shot_alive=false
				}
			});
		}
	}
	map_collition(_t){
		//MAPの位置を取得
		let _map_x=
			parseInt((_t.x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=parseInt(_t.y/_MAP.t);

		if(_MAP.isMapCollision(_map_x,_map_y)
			||_MAP.isMapCollision(_map_x+1,_map_y)){
			_t._init();
		}

	}
	move(){
		let _p=this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();
		//ここでは各要素にショット権限を与え、
		//各弾に対して、敵に弾を当てた、
		//あるいは画面からはみ出た時に、
		//_shot_aliveをfalseにする。

		//0番目の要素は直線
		//1番目の要素は右上
		let _s=this.shots[0]._shot|
					this.shots[1]._shot;
		let _sa=this.shots[0]._shot_alive|
					this.shots[1]._shot_alive;
		if(!_s&&!_sa){return;}
		if(_s&&!_sa){
			//ショット打ち始め
			this.shots[0]._shot_alive=true;
			this.shots[1]._shot_alive=true;
		}
		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];

			if(!_t._shot_alive){continue;}
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				if(_j===0){
					return (!_sa)?_pl._x:_i+30;
				}else{
					return (!_sa)?_pl._x+20:_i+30;
				}
			})(_t.x);
			_t.y=(function(_i){
				if(_j===0){
					return (!_sa)?_pl._y:_i;
				}else{
					return (!_sa)?_pl._y-23:_i-23;
				}
			})(_t.y);


			if (this.shots[0].x>_CANVAS.width){
				this.shots[0]._init();
				continue;
			}
			if (this.shots[1].y<0||
				this.shots[1].x>_CANVAS.width){
				this.shots[1]._init();
				continue;
			}

			let _img=(_j===0)
					?_CANVAS_IMGS['shot1'].obj
					:_CANVAS_IMGS['shot2'].obj;
			_CONTEXT.drawImage(
				_img,
				_t.x,
				_t.y,
				_img.width,
				_img.height
			);

			_t._shot_alive=true;
		}
	}
}

class GameObject_SHOTS_TAILGUN
			extends GameObject_SHOTS_DOUBLE{
	constructor(_p){super(_p);}
	enemy_collision(_e){//敵への当たり処理
		if(!this.player.isalive()){return;}
		for(let _k=0;_k<this.shots.length;_k++){
			let _t=this.shots[_k];
			if(!_t._shot_alive){continue;}
			let _ec=_e.getEnemyCenterPosition();

			let _a=Math.sqrt(
				Math.pow(_ec._x-_t.x,2)+
				Math.pow(_ec._y-_t.y,2)
			);
			let _s=(_a<_e.img.height)?true:false;
			if(_s&&_e.isalive()){
				_e.collision(_t);
				_t._init();
			}
		}
	}
	move(){
		let _p=this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();
		//ここでは各要素にショット権限を与え、
		//各弾に対して、敵に弾を当てた、
		//あるいは画面からはみ出た時に、
		//_shot_aliveをfalseにする。

		//0番目の要素は前
		//1番目の要素は後
		let _s=this.shots[0]._shot|
					this.shots[1]._shot;
		let _sa=this.shots[0]._shot_alive|
					this.shots[1]._shot_alive;
		if(!_s&&!_sa){return;}
		if(_s&&!_sa){
			//ショット打ち始め
			this.shots[0]._shot_alive=true;
			this.shots[1]._shot_alive=true;
		}
		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];

			if(!_t._shot_alive){continue;}
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				if(_j===0){
					return (!_sa)?_pl._x:_i+30;
				}else{
					return (!_sa)?_pl._x:_i-30;
				}
			})(_t.x);
			_t.y=(function(_i){
				return (!_sa)?_pl._y:_i;
			})(_t.y);


			if (this.shots[0].x>_CANVAS.width){
				this.shots[0]._init();
				continue;
			}
			if (this.shots[1].x<0){
				this.shots[1]._init();
				continue;
			}

			let _img=(_j===0)
					?_CANVAS_IMGS['shot1'].obj
					:_CANVAS_IMGS['shot3'].obj;
			_CONTEXT.drawImage(
				_img,
				_t.x,
				_t.y,
				_img.width,
				_img.height
			);

			_t._shot_alive=true;
		}
	}

}

class GameObject_SHOTS_RIPPLE_LASER
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		this.speed=30;
		this.lineWidth=5;
		this.strokeStyle="rgba(50,80,255,1)";

		for(let _i=0;_i<_PLAYERS_SHOTS_MAX;_i++){
			this.shots.push({
				sid:_SHOTTYPE_LASER,
				x:0,//処理変数：照射x軸
				y:0,
				_t:0,//アニメーション時間ripple
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_width:0,//rippleの横幅
				_height:0,//rippleの縦幅
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this._t=0,
					this._shot=false,
					this._shot_alive=false,
					this._width=0,
					this._height=0
				}
			});
		}
	}
	enemy_collision(_e){
		if(!this.player.isalive()){return;}
		for(let _k=0;_k<this.shots.length;_k++){
			let _t=this.shots[_k];
//			console.log('_kk:'+_k);
			if(!_t._shot_alive){continue;}
			let _ec=_e.getEnemyCenterPosition();

			let _s=
				(Math.abs(_ec._x-_t.x)
					<(_e.img.width/2)+(_t._width/2)+_MAP.t)
				&&
				(Math.abs(_ec._y-_t.y)
					<(_e.img.height/2)+(_t._height/2)+_MAP.t);

			if(_s&&_e.isalive()){
				_e.collision(_t);
				_t._init();
			}
		}
	}
	map_collition(_t){
		//MAPの位置を取得
		let _map_x=
			parseInt((_t.x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=parseInt(_t.y/_MAP.t);

		if(_MAP.isMapCollision(_map_x,_map_y)
			||_MAP.isMapCollision(_map_x+1,_map_y)){
			_t._init();
		}

	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();

		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}

			let _s=_this.speed;
			_t.x=(function(_i){
				//撃ち始めは自機位置から放つ
				return (!_t._shot_alive)?_pl._x:_i+_s;
			})(_t.x);
			_t.y=(function(_i){
				return (!_t._shot_alive)?_pl._y:_i;
			})(_t.y);

			if (_t.x>_CANVAS.width){
				_t._init();
				continue;
			}

			_t._t=(_t._t<20)?_t._t+1:_t._t;
			_t._width=0.5+_t._t;
			_t._height=8+(_t._t*_t._t/6);
			_CONTEXT.beginPath();
			_CONTEXT.lineWidth=_this.lineWidth;
	        _CONTEXT.strokeStyle=_this.strokeStyle;
			_CONTEXT.ellipse(
				_t.x,
				_t.y,
				_t._width,
				_t._height,
				0,0,2*Math.PI);
			_CONTEXT.stroke();

			_t._shot_alive=true;
		}
	}
}

class GameObject_SHOTS_RIPPLE_LASER_RED
			extends GameObject_SHOTS_RIPPLE_LASER{
	constructor(_p){
		super(_p);
		this.strokeStyle="rgba(255,80,50,1)";
	}
}

class GameObject_SHOTS_LASER
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		this.speed=50;
		this.lineWidth=3;
		this.strokeStyle="rgba(50,80,255,1)";
		this.strokeStyle_u="rgba(120,150,255,1)";

		for(let _i=0;_i<1;_i++){
			this.shots.push({
				sid:_SHOTTYPE_LASER,
				x:0,//処理変数：照射x軸
				y:0,
				_c:0,//アニメーションカウント
				laser_time:500,//定義：照射時間（照射終了共通）
				_sx:0,//処理変数：x軸
				_enemy:null,//レーザーに衝突した敵のオブジェクト
				_laser_t:0,//処理変数：照射時間
				_laser_ts:0,//処理変数：照射終了後時間
				_laser_MaxX:_CANVAS.width,
						//処理変数レーザー最大右端
				_l_x:0,//処理変数：レーザー右端x
				_l_y:0,//処理変数：レーザー右端y
				_l_sx:0,//処理変数：レーザー左端x
				_l_sy:0,//処理変数：レーザー左端y
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this._c=0,
					this._laser_t=0,
					this._laser_ts=0,
					this._sx=0,
					this._enemy=null,
					this._l_x=0,//処理変数：レーザー右端x
					this._l_y=0,//処理変数：レーザー右端y
					this._l_sx=0,//処理変数：レーザー左端x
					this._l_sy=0,//処理変数：レーザー左端y
					this._laser_MaxX=_CANVAS.width,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}
	}
	enemy_collision(_e){
		if(!this.player.isalive()){return;}
		for(let _k=0;_k<this.shots.length;_k++){
		if(_e.x<this.player.x){continue;}

		let _t=this.shots[_k];
		let _t_1={x:_t._l_sx,
					y:_t._l_y},
			_t_2={x:_t._l_x,
					y:_t._l_y},
			_t_3={x:_t._l_sx,
					y:_t._l_y+1},
			_t_4={x:_t._l_x,
					y:_t._l_y+1};

		let _e_1={x:_e.x,y:_e.y},
			_e_2={x:_e.x+_e.img.width,y:_e.y},
			_e_3={x:_e.x,y:_e.y+_e.img.height},
			_e_4={x:_e.x+_e.img.width,y:_e.y+_e.img.height};

		//敵とレーザーによる当たり判定
		//Y軸→敵の左辺範囲内にレーザーが含まれているか
		//X軸→敵の上辺または可変範囲内にレーザーが含まれているか
		let jy1=(_t_1.y>=_e_1.y-10
					&&_t_3.y<=_e_3.y+10),
			jx1=(_t_1.x<=_e_2.x-5),
			jx2=(_t_2.x>=_e_1.x+5);
		let _s=jy1&jx1&jx2;

		if(_s){
			_e.collision(_t);
			if(_e.isalive()){
				this.setLaserMaxX(_e_1.x+(_e.img.width/2));
				_t._enemy=_e.id;
			}else{
				this.setLaserMaxX(_CANVAS.width);
			}
		}else{
			if(_t._enemy===null){
			}else if(_t._enemy===_e.id){
				this.setLaserMaxX(_CANVAS.width);
			}else{

			}
		}

		}//_k
	}
	map_collition(_t){
		if(!_t._shot_alive){return;}

		//プレーヤーの中心座標取得
		let _pl=this.player.getPlayerCenterPosition();

		let _map_x=
			parseInt((_t.x+_pl._x
					+_SCROLL_POSITION
					-_MAP.initx)
					/_MAP.t);
		let _map_y=parseInt(_t.y/_MAP.t);

		if(_MAP.isMapCollision(_map_x-1,_map_y)){
			if(_t.x<_MAP.t){
//				console.log('_t.x:'+_t.x);
				//オプションが壁に入り込んだ時のショットは、
				//xをリセットさせ、オプションの位置から再発射
				_t.x=0;
				this.setLaserMaxX(_pl._x);
				return;
			}
			this.setLaserMaxX(_t.x+_pl._x-_MAP.t);
			return;
		}

		if(_MAP.isMapCollision(_map_x,_map_y)){
			if(_t.x<_MAP.t){
//				console.log('_t.x:'+_t.x);
				//オプションが壁に入り込んだ時のショットは、
				//xをリセットさせ、オプションの位置から再発射
				_t.x=0;
				this.setLaserMaxX(_pl._x);
				return;
			}
			this.setLaserMaxX(_t.x+_pl._x-_MAP.t);
			return;
		}

		this.setLaserMaxX(_CANVAS.width);

	}
	setLaserLine(_s,_l_x,_l_y,_l_sx,_l_sy){
		_s._l_x=_l_x;
		_s._l_y=_l_y;
		_s._l_sx=_l_sx;
		_s._l_sy=_l_sy;
	}
	setLaserMaxX(_v){
//		console.log(this.shots.length);
		for(let _i=0;_i<this.shots.length;_i++){
			this.shots[_i]._laser_MaxX=_v;
		}
	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(!_p.isalive()){return;}
		if(!_p.isshotflag()){return;}
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();

		//	自機のショット状態を取得
		_CONTEXT.beginPath();
		_CONTEXT.lineWidth=this.lineWidth;
		_CONTEXT.strokeStyle=this.strokeStyle;
		_CONTEXT.lineCap='round';

		//ショットの描画(１つのみ)
		for(let _j=0;_j<this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}

//			console.log(_t._laser_MaxX);
			_t.x=(function(_i){
	  			if(_i>=_t._laser_MaxX-_pl._x){
					//レーザーがキャンバスの右端に届いた時
					_t._laser_t+=(1000/_FPS);
					return _t._laser_MaxX-_pl._x;
				}
				return _i+_this.speed;
			})(_t.x);

			_t._sx=(function(_i){
				if(!_t._shot){
					//ショットを離した時
					if(_i>=_t.x){
						//照射が終わり切った時
						_t._init();
						return 0;
					}
					return _i+=_this.speed;
				}

				if(_t._laser_t<=_t.laser_time-200){return _i;}
				//時間時間経過後に、照射終了カウント開始
				_t._laser_ts+=(1000/_FPS);
				//照射時間に達するまで照射を続ける
				if(_t._laser_ts>_t.laser_time-200){
					//照射が終わり切った時
					_t._init();
					return 0;
				}
				if(_i>=_t.x){return _t.x;}
				return _i+=_this.speed;
			})(_t._sx);
			_t.y=_pl._y;

	//		console.log('_x+_t._sx:'+(_t._sx));
	//		console.log('_x+_t._x:'+(_t.x));
			_CONTEXT.beginPath();
			_CONTEXT.strokeStyle=this.strokeStyle_u;
			_CONTEXT.moveTo(_pl._x+_t._sx,_pl._y+1);
			_CONTEXT.lineTo(_pl._x+_t.x,_pl._y+1);
			_CONTEXT.stroke();

			_CONTEXT.beginPath();
			_CONTEXT.strokeStyle=this.strokeStyle;
			_CONTEXT.moveTo(_pl._x+_t._sx,_pl._y);
			_CONTEXT.lineTo(_pl._x+_t.x,_pl._y);
			_CONTEXT.stroke();

			this.setLaserLine(_t,
								_pl._x+_t.x,
								_pl._y,
								_pl._x+_t._sx,
								_pl._y);

			if(_t.x>0){_t._shot_alive=true;}

		}

	}
}

class GameObject_SHOTS_LASER_CYCLONE
			extends GameObject_SHOTS_LASER{
	constructor(_p){
		super(_p);
		this.lineWidth=5;
		this.strokeStyle="rgba(255,80,50,1)";
		this.strokeStyle_u="rgba(255,200,150,1)";
	}
}

class GameObject_PM{
	constructor(_src,_sx,_sy){
		let _this=this;
		this.img=_CANVAS_IMGS[_src].obj;
		this.x=(_CANVAS.width/2)-
				(this.img.width/2);
		this.y=_CANVAS.height-50;

		this.meterdef_status='111111';
		this.meterdef_current='000000';

		this.meterdef={
			'n_32':{
				imgobj:new Image(),
				name:'meter_c_speedup',
				func:function(){
					if(_PLAYERS_MAIN.accel>=6){
						_this._set_meter_status();
						return;
					}
					_PLAYERS_MAIN.accel++;
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
		this._c_pms=0;//カレントの位置
		this.pms_img=_CANVAS_IMGS_INIT['gradius_powermeterselect'].obj;
		//SPEEDUP〜OPTION選択済定義
		this.pms_selected=[
			{_y:89,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_0.obj},
			{_y:162,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_1.obj},
			{_y:233,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_2.obj},
			{_y:306,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_3.obj}
		];
		//SHIELD選択済定義
		this._c_pmss=0;//カレントの位置
		this.pmss_selected=[
			{_x:470,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_shield_0.obj},
			{_x:570,_img:_CANVAS_IMGS_INIT.gradius_powermeterselect_shield_1.obj}
		];


	}
	init(){
		for(let _i in this.meterdef){
			this.meterdef[_i].imgobj=
			_CANVAS_IMGS[this.meterdef[_i].name].obj;
		}
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
		let _mc=parseInt(this.meterdef_current,2);
		let _ms=parseInt(this.meterdef_status,2);
		//メーターにアクティブなし
		if(_mc===0){return;}
		//メーターにアクティブあるが、すでに装備ずみ
		if((_mc&_ms)===0){return;}

		//自機のパワーアップ演出
		_PLAYERS_MAIN.set_equipped();

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
		//メーターを表示
		_CONTEXT.drawImage(
			this.img,
			this.x,
			this.y,
			this.img.width,
			this.img.height
		);

		//各ステータスでメーターを上書
		for(let _i=0;
			_i<this.meterdef_status.length;_i++){
			if(this.meterdef_status[_i]!=='0'){continue;}
			let _omb=_CANVAS_IMGS['meter_blank'].obj;
			_CONTEXT.drawImage(
				_omb,
				this.x+(_omb.width*_i),
				this.y,
				_omb.width,
				_omb.height
			);
		}

		//パワーカプセル取得時のステータス
		let _mc=parseInt(this.meterdef_current,2);
		if(_mc===0){return;}
		let _ms=parseInt(this.meterdef_status,2);

		let _oimg=
			((_mc&_ms)!==0)
			?this.meterdef['n_'+_mc].imgobj
			:_CANVAS_IMGS['meter_c_blank'].obj;
		_CONTEXT.drawImage(
			_oimg,
			this.x+(_oimg.width
					*this.meterdef_current.indexOf('1')),
			this.y,
			_oimg.width,
			_oimg.height
		);
	}

	pms_disp(){
		let _s='power meter select';
		let _s2='shield select';

		_CONTEXT.clearRect(0,0,
					_CANVAS.width,
					_CANVAS.height);
		_DRAW_DISP_TXT(
				_s,
				(_CANVAS.width/2)
					-(70*0.5*_s.length/2),
				20,
				0.3
			);

		_DRAW_DISP_TXT(
				_s2,
				(_CANVAS.width/2)
					-(70*0.5*_s.length/2),
				400,
				0.15
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
		let _pmss=_CANVAS_IMGS_INIT['gradius_powermeterselect_shield_'].obj;
		_CONTEXT.drawImage(
			_pmss,
			(_CANVAS.width/2)-(this.pms_img.width/2),
			430,
			_pmss.width,
			_pmss.height
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
		let _md=this.mapdef._map;
//		let _map=new GameObject_MAP(0);
		//描画は横は50〜950px
		_CONTEXT.clearRect(0,0,
					_CANVAS.width,
					_CANVAS.height);
		//テキスト表示
		_DRAW_DISP_TXT(
				'stage select',
				(_CANVAS.width/2)
					-(70*0.5*('stage select').length/2),
				20,
				0.3
			);

		//ページングを表示
		let _pl=500-(20*(_MAPDEFS.length-1));//センタリング
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
		for(let _i=0;_i<_md.length;_i++){
		let _ml=_md[_i].length;
		for(let _j=0;_j<((_ml>30)?30:_ml);_j++){
			if(_md[_i][_j]==='0'){continue;}
			let _img=(function(_k){
				if(_k.match(new RegExp('[a-z]'))!==null){
					return _CANVAS_IMGS['enemy_'+_k+'_1'];
				}
				return _CANVAS_IMGS['map'+_k];
			})(_md[_i][_j]);

			//画像サイズは、25x25px
			//ここでは10x10pxに調整
			_CONTEXT.drawImage(
				_img.obj,
				50+(_j*10),
				130+((_md[_i][_j]==='8'||_md[_i][_j]==='6')?(_i-1)*10:_i*10),
				_img.obj.width/2.5,
				_img.obj.height/2.5
			);
		}//_j
		}//_i

		//左カラム表示
		_CONTEXT.beginPath();
		_CONTEXT.lineWidth=1;
		_CONTEXT.strokeStyle='rgba(255,255,255,1)';
		_CONTEXT.fillStyle='rgba(255,255,255,1)';
		_CONTEXT.strokeRect(50,130,300,200);

		//テキスト表示
		_DRAW_DISP_TXT('stage title',400,130,0.2);
		_CONTEXT.moveTo(400,160);
		_CONTEXT.lineTo(950,160);
		_CONTEXT.stroke();
		_CONTEXT.font='20px sans-serif';
		let _ar=_GAME._multilineText(_CONTEXT,this.mapdef._title,550);
		for(let _i=0;_i<((_ar.length>2)?2:_ar.length);_i++){
			_CONTEXT.fillText(_ar[_i],400,190+(_i*26));
		}

		_DRAW_DISP_TXT(('difficult:'+this.mapdef._difficult),400,250,0.2);
		_CONTEXT.moveTo(400,290);
		_CONTEXT.lineTo(950,290);
		_CONTEXT.stroke();

		_DRAW_DISP_TXT('detail',400,320,0.2);
		_CONTEXT.moveTo(400,360);
		_CONTEXT.lineTo(950,360);
		_CONTEXT.stroke();
		_ar=_GAME._multilineText(_CONTEXT,this.mapdef._body,550);
		for(let _i=0;_i<((_ar.length>4)?4:_ar.length);_i++){
			_CONTEXT.fillText(_ar[_i],400,390+(_i*30));
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
		let _s='1p'+('        '+this.score1p).slice(-8);
		for(let _i=0;_i<_s.length;_i++){
			if(_s[_i]===' '){continue;}
			let _img=
				_CANVAS_IMGS_INIT['font_'+_s[_i]].obj;
			_CONTEXT.drawImage(
				_img,
				180+(_img.width*0.15*_i),
				10,
				_img.width*0.15,
				_img.height*0.15
			);
		}

		_s='hi'+('        '+this.scorehi).slice(-8);
		for(let _i=0;_i<_s.length;_i++){
			if(_s[_i]===' '){continue;}
			let _img=
				_CANVAS_IMGS_INIT['font_'+_s[_i]].obj;
			_CONTEXT.drawImage(
				_img,
				400+(_img.width*0.15*_i),
				10,
				_img.width*0.15,
				_img.height*0.15
			);
		}

		_s='2p'+('        '+this.score2p).slice(-8);
		for(let _i=0;_i<_s.length;_i++){
			if(_s[_i]===' '){continue;}
			let _img=
				_CANVAS_IMGS_INIT['font_'+_s[_i]].obj;
			_CONTEXT.drawImage(
				_img,
				620+(_img.width*0.15*_i),
				10,
				_img.width*0.15,
				_img.height*0.15
			);
		}
	}
}


class GameObject_POWERCAPSELL{
	constructor(_x,_y){
		this.x=_x||0;
		this.y=_y||0;
		this.getscore=300;
		this.gotpc=false;

		this._c_pc_ani=0;
		this.pc_ani=[//パワーカプセルのアニメ定義
			{img:_CANVAS_IMGS['pc1'].obj,scale:0.6},
			{img:_CANVAS_IMGS['pc2'].obj,scale:0.6},
			{img:_CANVAS_IMGS['pc3'].obj,scale:0.6},
			{img:_CANVAS_IMGS['pc4'].obj,scale:0.6},
			{img:_CANVAS_IMGS['pc5'].obj,scale:0.6}
		];
		this.img=this.pc_ani[0].img;
	}
	getPCCenterPosition(){
		return {_x:this.x+(this.img.width/2),
				_y:this.y+(this.img.height/2)}
	}
	getPowerCapcell(){this.gotpc=true;}
	move(){
		let _this=this;
		//すでにパワーカプセル取得済みは終了
		if(_this.gotpc){return;}
		_this.x-=_BACKGROUND_SPEED;

		//パワーカプセル所持の場合
		let _img=(function(_t){
			_this._c_pc_ani=
				(_this._c_pc_ani>=(_this.pc_ani.length*5)-1)
				?0:_this._c_pc_ani+1;
			return _this.pc_ani[parseInt(_this._c_pc_ani/5)].img;
		})(_this);
		_CONTEXT.drawImage(
			_img,_this.x,_this.y,
			_img.width,_img.height
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
	}
	init(){
		let _r=Math.random()+0.5;
		this.width=_r;
		this.height=_r;
	}
	move(){
		let _t=this;
		this.x=(function(_i){
			if(_BACKGROUND_SPEED===0){return _i;}
			return (_i<0)
					?_CANVAS.width
					:_i-_t.speed;
		})(this.x);

		_CONTEXT.beginPath();
        _CONTEXT.arc(this.x,this.y,2,0,Math.PI*2,true);
        _CONTEXT.fillStyle=this.rgba;
        _CONTEXT.fill();
	}
}

//自機とパワーカプセルの取得
const _IS_GET_POWERCAPSELL=function(){
//	if(!_PLAYERS_MAIN.isalive()){return;}

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
			Math.pow(_PLAYERS_MAIN.img.width,2)+
			Math.pow(_PLAYERS_MAIN.img.height,2)
		);

		let _s=(_a<_d/2)?true:false;
		if(_s){
			_POWERMETER.move();
			_pwc.getPowerCapcell();
			_SCORE.set(300);
			continue;
		}

		_pwc.move();

	}
}

//自機ショット、また自機と敵による衝突判定
const _IS_ENEMIES_COLLISION=function(){
	if(!_PLAYERS_MAIN.isalive()){return;}
	let _s=false;//衝突判定
	let _e=_ENEMIES;

	_e.sort(function(a,b){
	    if(a.x<b.x) return -1;
	    if(a.x>b.x) return 1;
	    return 0;
	});

	for(let _i=0;_i<_e.length;_i++){
	//既に倒した敵は無視する
	if(!_e[_i].isalive()){continue;}
	if(_e[_i].x>_CANVAS.width-50){continue;}
	let _oe=_e[_i];
	for(let _j=0;
		_j<_PLAYERS_SHOTS[_SHOTTYPE].length;
		_j++){
		let _os=_PLAYERS_SHOTS[_SHOTTYPE][_j];
		_os.enemy_collision(_oe);
	}//_j

	//自機衝突判定
	_PLAYERS_MAIN.enemy_collision(_oe);
	_PLAYERS_MAIN_FORCE.enemy_collision(_oe);

	//ミサイルが装備されていない場合は無視する
	if(!_PLAYERS_MISSILE_ISALIVE){continue;}
	for(let _i=0;_i<_PLAYERS_MISSILE.length;_i++){
		let _pm=_PLAYERS_MISSILE[_i];
		if(!_pm.player.isalive()){continue;}
		for(let _j=0;_j<_pm.shots.length;_j++){
			let _pms=_pm.shots[_j];
			_pm.enemy_collision(_oe,_pms);
		}//_j
	}//_i

	}//_i

}

//敵ショットによる衝突判定
const _IS_ENEMIES_SHOT_COLLISION=function(){
	if(!_PLAYERS_MAIN.isalive()){return;}

	let _s=false;//衝突判定
	for(let _i=0;_i<_ENEMIES_SHOTS.length;_i++){
		let _e=_ENEMIES_SHOTS[_i];
		if(!_e._shot_alive){continue;}
		//自機衝突判定
		_PLAYERS_MAIN.enemy_shot_collision(_e);
		_PLAYERS_MAIN_FORCE.enemy_shot_collision(_e);
	}
}



const _DRAW=function(){
	_KEYEVENT_MASTER.addKeydownGame();
	_KEYEVENT_MASTER.addKeyupGame();

	let _c=0;

	_DRAW_SETINTERVAL=setInterval(function(){
		_CONTEXT.clearRect(0,0,
					_CANVAS.width,
					_CANVAS.height);

		//BACKGROUND
		for(let _i=0;_i<_BACKGROUND_STAR_MAX;_i++){
			_BACKGROUND[_i].move();
		}

		//敵の弾を表示
		for(let _i=0;_i<_ENEMIES_SHOTS.length;_i++){
			_ENEMIES_SHOTS[_i].move();
		}
		//敵を表示
		for(let _i=0;_i<_ENEMIES.length;_i++){
			if(_ENEMIES[_i]===undefined){continue;}
			_ENEMIES[_i].move();
		}

		_IS_GET_POWERCAPSELL();

		//ショットを表示
		for(let _i=0;_i<_PLAYERS_MAX;_i++){
			if(_PLAYERS_MISSILE_ISALIVE){
				_PLAYERS_MISSILE[_i].move();
			}
			_PLAYERS_SHOTS[_SHOTTYPE][_i].move();
		}

		//MAP（衝突判定）
		_MAP.isShotCollision();

		//自機からひもづくオプションを表示
		for(let _i=0;_i<_PLAYERS_OPTION_MAX;_i++){
			_PLAYERS_OPTION[_i].move(10*(_i+1));
		}

		//自機を表示
		_PLAYERS_MAIN_FORCE.move(_PLAYERS_MAIN);
		_PLAYERS_MAIN.move();

		//MAP（表示）
		_MAP.move();

		//敵、衝突判定
		_IS_ENEMIES_SHOT_COLLISION();
		_IS_ENEMIES_COLLISION();

		//DRAW POWER METER
		_POWERMETER.show();
		//SCORE
		_SCORE.show();

		_SCROLL_POSITION+=_BACKGROUND_SPEED;

		if(_SCROLL_POSITION-100<=
			(_MAP.mapdef[0].length*_MAP.t)+_MAP.initx){return;}

		//MATCH_BOSS
		_DRAW_MATCH_BOSS();

	},1000/_FPS);
}

const _DRAW_MATCH_BOSS=function(){
	if(!_DRAW_IS_MATCH_BOSS){
		let _e=new ENEMY_BOSS_BOGCORE(1300,200);
		_ENEMIES=[];
		_ENEMIES.push(_e);
		_ENEMIES_SHOTS=[];
		_ENEMIES_BOUNDS=[];
		_DRAW_SCROLL_STOP();
		_DRAW_IS_MATCH_BOSS=true;
		return;
	}

	let _bit='';
	for(let _i=0;_i<_ENEMIES.length;_i++){
		_bit+=((_ENEMIES[_i].isalive())?'0':'1');
	}
	if(_bit.indexOf('0')!==-1){return;}
	_DRAW_SCROLL_RESUME();
	if(_DRAW_IS_MATCH_BOSS_COUNT>100){
		//GAMECLEAR
		_DRAW_GAMECLEAR();
	}else{
		_DRAW_IS_MATCH_BOSS_COUNT++;
	}
}

const _DRAW_STOP=function(){
	clearInterval(_DRAW_SETINTERVAL);
	_DRAW_SETINTERVAL=null;
}

const _DRAW_GAMESTART=function(){
	_KEYEVENT_MASTER.removeKeydownGame();
	_KEYEVENT_MASTER.removeKeyupGame();

	if(_ISDEBUG){_DRAW();return;}
	let _c=0;
	_DRAW_GAMESTART_SETINTERVAL=setInterval(function(){
		if(_c>250){
			clearInterval(_DRAW_GAMESTART_SETINTERVAL);
			_DRAW_GAMESTART_SETINTERVAL=null
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
			for(let _i=0;_i<_txt.length;_i++){
				var _img=_CANVAS_IMGS_INIT['font_'+_txt[_i]].obj;
				var _x=
					(_CANVAS.width/2)
					-(_img.width*0.5*_txt.length/2);
				var _y=
					(_CANVAS.height/2)
					-(_img.height/2);
				//センタリングに表示
				_CONTEXT.drawImage(
					_img,
					_x+(_img.width*0.5*_i),
					_y,
					_img.width*0.5,
					_img.height*0.5
				);
			}
		}
		_c++;

	},1000/_FPS);
}

const _DRAW_GAMECLEAR=function(){
	var _img=_CANVAS_IMGS_INIT['font_0'].obj;
	//クリアしたら敵を全て消す
//	_ENEMIES=new Array();
//	_ENEMIES_BOUNDS=new Array();

	let _s='gameclear';
	_DRAW_DISP_TXT(
			_s,
			(_CANVAS.width/2)
			-(_img.width*0.5*_s.length/2),
			(_CANVAS.height/2)
			-(_img.height/2),
			0.5
		);

	_s='press r to restart';
	_DRAW_DISP_TXT(
			_s,
			(_CANVAS.width/2)
	 			-(_img.width*0.15*_s.length/2),
			(_CANVAS.height/2)+30,
			0.15
		);
	_s='press s to change another stage';
	_DRAW_DISP_TXT(
			_s,
			(_CANVAS.width/2)
	 			-(_img.width*0.15*_s.length/2),
			(_CANVAS.height/2)+60,
			0.15
		);
	_DRAW_IS_GAMECLEAR=true;

}

const _DRAW_GAMEOVER=function(){
	_KEYEVENT_MASTER.removeKeydownGame();
	_KEYEVENT_MASTER.removeKeyupGame();

	clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;

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

	var _img=_CANVAS_IMGS_INIT['font_0'].obj;
	let _s='gameover';
	_DRAW_DISP_TXT(
			_s,
			(_CANVAS.width/2)
			-(_img.width*0.5*_s.length/2),
			(_CANVAS.height/2)
			-(_img.height/2),
			0.5
		);

	_s='press r to restart';
	_DRAW_DISP_TXT(
			_s,
			(_CANVAS.width/2)
	 			-(_img.width*0.15*_s.length/2),
			(_CANVAS.height/2)+30,
			0.15
		);
	_s='press s to change another stage';
	_DRAW_DISP_TXT(
			_s,
			(_CANVAS.width/2)
	 			-(_img.width*0.15*_s.length/2),
			(_CANVAS.height/2)+60,
			0.15
		);
}

const _DRAW_DISP_TXT=function(_s,_x,_y,_r){
	//_s:テキスト
	//_x:テキスト開始x座標位置
	//_y:テキスト開始y座標位置
	//_r:文字表示比率(0.0〜1.0)
	_r=_r||1;
	for(let _i=0;_i<_s.length;_i++){
		if(_s[_i]===' '){continue;}
		var _img=(function(){
			return _CANVAS_IMGS_INIT['font_'+_s[_i]].obj;
		})();
		//センタリングに表示
		_CONTEXT.drawImage(
			_img,
			_x+(_img.width*_r*_i),
			_y,
			_img.width*_r,
			_img.height*_r
		);
	}
}
const _DRAW_SCROLL_STOP=function(){_BACKGROUND_SPEED=0;}
const _DRAW_SCROLL_RESUME=function(){
	_BACKGROUND_SPEED=_MAP.getBackGroundSpeed();
}

const _DRAW_RESET_OBJECT=function(){
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
	_PLAYERS_OPTION=[];
	_PLAYERS_OPTION_ISALIVE=0;
	_PLAYERS_SHOTS={
		'_SHOTTYPE_NORMAL':[],
		'_SHOTTYPE_DOUBLE':[],
		'_SHOTTYPE_LASER':[]
	};
	_PLAYERS_MISSILE=[];
	_PLAYERS_MISSILE_ISALIVE=false;
	_PLAYERS_MOVE_DRAW=[];
	_ENEMIES=[];
	_ENEMIES_BOUNDS=[];
	_ENEMIES_SHOTS=[];
	_POWERMETER='';
	_SHOTTYPE=_SHOTTYPE_NORMAL;

	_POWERCAPSELLS=[];

	_SCROLL_POSITION=0;
	_BACKGROUND_SPEED=1;

	_DRAW_IS_MATCH_BOSS=false;
	_DRAW_IS_MATCH_BOSS_COUNT=0;
}

const _DRAW_INIT_OBJECT=function(){
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

	//ENEMY
//	for(let _i=0;_i<_ENEMIES_MAX;_i++){
//		let _s=0.3;
//		_ENEMIES[_i]=
//			new GameObject_ENEMY('enemies',_i,_s,_s);
//	}

	//METER
	_POWERMETER=
		new	GameObject_PM('meter');
	_POWERMETER.init();

	//SCORE
//	_SCORE=new GameObject_SCORE();
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
	_MAP.init_enemies_location();

	_DRAW_GAMESTART();
}

const _DRAW_POWER_METER_SELECT=function(){
	clearInterval(_PLAYERS_SHOTS_SETINTERVAL);
	_PLAYERS_SHOTS_SETINTERVAL=null;

	_CONTEXT.clearRect(0,0,
				_CANVAS.width,
				_CANVAS.height);

	_KEYEVENT_MASTER.removeKeydownSelectStage();
	_KEYEVENT_MASTER.addKeydownSelectPowermeter();

	_POWERMETER=
		new	GameObject_PM('meter');
	_POWERMETER.pms_disp();
	_POWERMETER.pms_select();
}

const _DRAW_STAGE_SELECT=function(){
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

}

const _DRAW_INIT=function(_obj,_func){
	let _imgLoadedCount=0;
	for(let _i in _obj){
		let _o=_obj[_i];
		_o.obj.src=_obj[_i].src;
		_o.obj.onload=function(){
			_o.obj.width*=_o.rate;
			_o.obj.height*=_o.rate;
			_imgLoadedCount++;
			if(_imgLoadedCount>=
				Object.keys(_obj).length){
//				alert(_imgLoadedCount);
				//読み込み完了後にオブジェクト初期化
				_func();
			}
		}
	}
}


const _GAME={//ゲーム用スクリプト
_init:function(){
	//マップ用jsonを取得したあとに、
	//スタート画面をコールバックで表示させる
	//SCORE
	_SCORE=new GameObject_SCORE();
	_MAP=new GameObject_MAP();
	_MAP.init(_GAME._showGameStart);
},
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
isCollision:function(_t,_e){
	//ピタゴラス定義による衝突判定
	if(!_t.isalive()){return false;}
	if(!_e.isalive()){return false;}

	let _pl=_t.getPlayerCenterPosition();
	let _ec=_e.getEnemyCenterPosition();

	let _pd=Math.sqrt(//敵と自機の距離
		Math.pow(_ec._x-_pl._x,2)+
		Math.pow(_ec._y-_pl._y,2)
	);
//	console.log((_pd<(_e.img.height/2)+(_t.height/2)));
	return (_pd<(_e.img.height/2)+(_t.height/2));
},
isShieldCollision:function(_t,_e){
	//ピタゴラス定義による衝突判定
	if(!_t.isalive()){return false;}
	if(!_e.isalive()){return false;}

	let _pl=_t.getPlayerCenterPosition();
	let _ec=_e.getEnemyCenterPosition();

	let _pd=Math.sqrt(//敵と自機の距離
		Math.pow(_ec._x-_pl._x,2)+
		Math.pow(_ec._y-_pl._y,2)
	);
	return (_pd<(_e.img.height/2)+(_t.height));
},
isMisShotCollision:function(_t,_e){
	//ミサイルショット衝突判定
	let _ec=_e.getEnemyCenterPosition();
	return (Math.abs(_ec._x-_t.x)
			<(_e.img.width/2)+(_t._img.width/2))
		&&
		(Math.abs(_ec._y-_t.y)
			<(_e.img.height/2)+(_t._img.height/2));
},
_showGameStart:function(){
	//SPのみコントローラーのオブジェクトを取得
	if(_ISSP){_SP_CONTROLLER._set_obj();}

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
_setTextToFont:function(_o,_str,_w){
	if(_o===undefined||_o===null){return;}
	_w=_w||30;
	let _s='';
	for(let _i=0;_i<_str.length;_i++){
		if(_str[_i]===' '){
			_s+='<img src="./images/gradius_spacer.png" width="'+_w+'">';
			continue;
		}
		_s+='<img src="./images/gradius_font_'+_str[_i]+'.png" width="'+_w+'">';
	}
	_o.innerHTML=_s;
},//_setTextToFont
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

	if(_ISSP){
		document
			.querySelector('body')
			.classList.add('sp');
	}

	_DRAW_INIT(_CANVAS_IMGS_INIT,_GAME._init);
});

//touchmoveブラウザのスクロールを停止
window.addEventListener('touchmove',function(e){
    e.preventDefault();
},{passive: false});

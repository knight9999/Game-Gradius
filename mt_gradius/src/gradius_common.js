//=====================================================
//	gradius_common.js
//	共通変数.js
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
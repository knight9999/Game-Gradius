'use strict';

_MAP=new GameObject_MAP();
let $_pb=null;
let $_ab=null;
let $_mp=null;
let $_mn=null;
let $_bm=null;

let _MAP_PETTERN=0;

const _DATAAPI={
_data_api:'',
_blog_id:0,
_contentdata_id:0,
_url:'',
_init_config:()=>{
	return _AJAX({
		'url':'./gradius_editing_stage_config.json'
	});
},
_init(_d){
	let _this=_DATAAPI;
	_this._blog_id=parseInt(_d.blog_id);
	_this._url=_d.url;
	_this._contentdata_id = parseInt(_d.contentdata_id);

	_this._data_api=new MT.DataAPI({
		baseUrl:_this._url,
		clientId:"api11entries"
	});

	_this._data_api.getToken((res)=>{
		if(res.error){
			if(res.error.code===401) {
				console.log('reload after 401 error occuered in updating.');
				location.href=
					_this._data_api.getAuthorizationUrl(location.href);
			}
			return false;
		}
		if(!res.accessToken) {
			alert('An accessToken error occurred.');
			location.href=
				_this._data_api.getAuthorizationUrl(location.href);
			return;
		}

		_GAME_STAGEEDIT._init();
	});
},//_init
_set_entryupdate(_ed){
	//	_d.title
	//	_d.status
	let _this=this;
	_this._data_api.updateContentData(
		_this._blog_id,
		_this._contentdata_id,
		_ed._eid,
		_ed,
		function(_r) {
		if(_r.error){
			alert('エントリ更新に失敗しました。');
			if(_r.error.code===401){
				location.href=
					_this._data_api.getAuthorizationUrl(location.href);
			}
			return;
		}
		alert('エントリ更新しました。');
		_GAME_STAGEEDIT_EVENTS._edits = false;

		//jsonファイルを取得して再表示させる
		_MAP.init(function(){
			_MAP_PETTERN=(function(){
				//エントリした記事を記事更新後初期表示させる
				for(let _i=0;_i<_MAPDEFS.length;_i++){
					if(_MAPDEFS[_i]._eid===_ed._eid){return _i;}
				}
			})();
			_GAME_STAGEEDIT._setData(_MAP_PETTERN);

			//area_parts内、parts_blockイベント設定
			const $_ap_pb=document.querySelectorAll('#area_parts .parts_block');
			for(let _i=0;_i<$_ap_pb.length;_i++){
			    $_ap_pb[_i].setAttribute('draggable',true);
			    $_ap_pb[_i].addEventListener('dragstart',_GAME_STAGEEDIT_EVENTS._f_ap_dragstart,false);
				$_ap_pb[_i].addEventListener('dragend',_GAME_STAGEEDIT_EVENTS._f_ap_dragend,false);
			}

			//入力フォームのイベント設定
			const $_fg_range=document.querySelectorAll('.form_group .col_r input[type="range"]');
			for(let _i=0;_i<$_fg_range.length;_i++){
			    $_fg_range[_i].addEventListener('input',_GAME_STAGEEDIT_EVENTS._f_fg_range,false);
			    $_fg_range[_i].addEventListener('change',_GAME_STAGEEDIT_EVENTS._f_fg_range,false);
			}

			//BG MUSICによる音再生イベント設定
			const $_fg_bg_play=document.querySelector('a.bgmusic_play');
			$_fg_bg_play.addEventListener('click',_GAME_STAGEEDIT_EVENTS._f_bgmusic_play);
			const $_fg_bg_stop=document.querySelector('a.bgmusic_stop');
			$_fg_bg_stop.addEventListener('click',_GAME_STAGEEDIT_EVENTS._f_bgmusic_stop);

			//設定が全て終わったらページを表示させる
			document.body.classList.add('on');
			document.body.classList.add('ismenu');

			_GAME_STAGEEDIT._setEntryLink();

			//gradiusフォントにセット
			const $_qsa=document.querySelectorAll(
				'.parts_block_wrapper .text'
			);
			for(let _i=0;_i<$_qsa.length;_i++){
				_GAME_STAGEEDIT._setTextToFont($_qsa[_i],$_qsa[_i].innerText,14);
			}

	    });//_MAP.init()

	});//updateentry

}//_set_entryupdate
}//_DATAAPI

const _GAME_STAGEEDIT={
_ac:new window.AudioContext(),
_as:null,
_theme:0,
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
_setInitMap:function(_m){
	//初期表示
	this._theme=_m._theme;
	let _mo=_m._map;

	//ルーラーの表示
	let _r_str='';
    for (let _i = 0; _i < _mo[0].length; _i++) {
		_r_str+='<span>'+((_i*25%100===0)?_i*25:'')+'</span>';
	};
	document.querySelector('form #map #ruler #ruler_inner').innerHTML = _r_str;

	//マップの表示
    let _str='';
    for(let _i=0;_i<_mo.length;_i++){
    _str+='<div class="area_blocks_rows">';
    for(let _j=0;_j<_mo[_i].length;_j++){
        _str+='<div class="area_block" data-val="'+_mo[_i][_j]+'" '+
			'ondragleave="_GAME_STAGEEDIT_EVENTS._f_as_dragleave(event);" '+
			'ondragenter="_GAME_STAGEEDIT_EVENTS._f_as_dragenter(event);" '+
			'ondrop="_GAME_STAGEEDIT_EVENTS._f_as_drop(event);"'+
			'>'+
        ((_k)=>{
            if(_k==='0'){return '';}
			//パーツがある場合はイベントを追加する
			let _s='';
			if(_k.match(_MAP.collision_enemies)!==null){
				//敵の表示
//				console.log(_k)
				let _st=_MAP_THEME[_m._theme]._enemies[_k]._st;
				let _o=_MAP_THEME[_m._theme]._enemies[_k]._getObj();
				_s='<div class="parts_block" '
						+'data-width="' + parseInt(_o.width * 0.8) + '" '
						+'data-height="' + parseInt(_o.height * 0.8) + '" '
						+'style="width:'+parseInt(_o.width*0.8)+'px;height:'+parseInt(_o.height*0.8)+'px;'
						+'background:url('+_o.img.src+') no-repeat;'
						+'background-size:cover;'
						+((_st!=='')?_st:'')
						+'background-position:'+(20/25*_o.imgPos[0]*-1)+'px 0px;'
						+'" '
						+'ondragstart="_GAME_STAGEEDIT_EVENTS._f_pb_dragstart(event);" '
						+'draggable="true">';
				_s+='</div>';
			}else if(_k.match(_MAP.collision_map)!==null){
				//マップの表示
				let _o=_MAP_THEME[_m._theme]._map[_k]._getObj();
				_s='<div class="parts_block" '
						+'data-width="' + parseInt(_o.width * 0.8) + '" '
						+'data-height="' + parseInt(_o.height * 0.8) + '" '
						+'style="width:'+parseInt(_o.width*0.8)+'px;height:'+parseInt(_o.height*0.8)+'px;'
						+'background:url('+_o.img.src+') no-repeat;'
						+'background-size:cover;'
						+'background-position:'+(20/25*_o.imgPos[0]*-1)+'px 0px;'
						+'" '
						+'ondragstart="_GAME_STAGEEDIT_EVENTS._f_pb_dragstart(event);" '
						+'draggable="true">';
				_s+='</div>';
			}
			return _s;
		})(_mo[_i][_j])+
        '</div><!-- /.area_block -->';
    }//_j
    _str+='</div><!-- /.area_blocks_rows -->';
    }//_i
    //MAPを表示
    document.querySelector('.area_blocks.drop').innerHTML = _str;
	// $_ab.addEventListener('dragleave',_GAME_STAGEEDIT_EVENTS._f_as_dragleave);
	// $_ab.addEventListener('dragenter', _GAME_STAGEEDIT_EVENTS._f_as_dragenter);
	// $_ab.addEventListener('drop', _GAME_STAGEEDIT_EVENTS._f_as_drop);

},//_setInitMap

_setInitPartsBlocksWrapper:function(_m){
	//パーツ一覧に表示する
	let _mo=_m._map;
	let _str='';
	//ENEMY
	for(let [_k,_v] of Object.entries(_MAP_THEME[_m._theme]._enemies)){
		let _o=_v._getObj();
		let _st=_v._st;
//		475:100=100:x
//		x=100*h/w
		let _w = (_o.width > _o.height) ? 100 : parseInt(100 * _o.width / _o.height);
		let _h = (_o.width > _o.height) ? parseInt(100 * _o.height / _o.width) : 100;
		_str+=
			'<div class="parts_block_wrapper" data-val="'+_k+'">'+
			'<div class="text">enemy '+_k+'</div>'+
			'<div class="parts_block" '+
			'data-width="' + parseInt(_o.width * 0.8) + '" '+
			'data-height="' + parseInt(_o.height * 0.8) + '" ' +
			'style="'+
			'width:'+_w+'px;height:'+_h+'px;'+
			'background:url('+_o.img.src+') no-repeat;'+
			'background-size:cover;'+
			((_st!=='')?_st:'')+
			'background-position:'+(100/_o.width*_o.imgPos[0]*-1)+'px 0px;'+
			'">'+
			'</div>'+
			'</div><!-- /.parts_block_wrapper -->'
	}
    document
		.querySelector('.parts_blocks_wrapper.enemy .parts_blocks')
		.innerHTML=_str;
	//MAP
	_str='';
	for(let [_k,_v] of Object.entries(_MAP_THEME[_m._theme]._map)){
		let _o=_v._getObj();
//		475:100=100:x
//		x=100*h/w
		let _w = (_o.width > _o.height) ? 100 : parseInt(100 * _o.width / _o.height);
		let _h = (_o.width > _o.height) ? parseInt(100 * _o.height / _o.width) : 100;
//		console.log(_o.imgPos[0]);
		_str+=
			'<div class="parts_block_wrapper" data-val="'+_k+'">'+
			'<div class="text">MAP '+_k+'</div>'+
			'<div class="parts_block" '+
			'data-width="' + parseInt(_o.width * 0.8) + '" ' +
			'data-height="' + parseInt(_o.height * 0.8) + '" ' +
			'style="'+
			'width:'+_w+'px;height:'+_h+'px;'+
			'background:url('+_o.img.src+') no-repeat;'+
			'background-size:cover;'+
			'background-position:'+(100/_o.width*_o.imgPos[0]*-1)+'px 0px;'+
			'">'+
			'</div>'+
			'</div><!-- /.parts_block_wrapper -->'
	}
	//MAP
	document
		.querySelector('.parts_blocks_wrapper.map .parts_blocks')
		.innerHTML=_str;

},//_setPartsBlocksWrapper

_clearMap:function(){
	//MAPを削除
    document
		.querySelector('.area_blocks.drop')
		.textContent=null;
},//_clearMap

_getTextToFont:function($_obj){
	let _str='';
	let $_o=$_obj.children;
	for(let _i=0;_i<$_o.length;_i++){
		_str+=$_o[_i]
	}
	return _str;
},
_setTextToFont:function(_o,_str,_w){
	if(_o===undefined||_o===null){return;}
	_w=_w||60;
	let _s='';
	for(let _i=0;_i<_str.length;_i++){
        if(_str[_i]===':'){continue;}
		if(_str[_i]===' '){
			_s+='<img src="./images/gradius_spacer.png" width="'+_w+'">';
			continue;
		}
//		console.log(_str[_i]+':');
		let _pos=parseInt(this._txt[_str[_i].toLowerCase()])*(_w/60)*-1;
		_s+='<div style="'
			+'background:url(./images/gradius_font.png) no-repeat;'
			+'background-size:cover;'
			+'background-position:'+_pos+'px 0px;'
			+'display:inline-block;'
			+'width:'+_w+'px;'
			+'height:'+_w+'px;'
			+'"></div>';
//		_s+='<img src="./images/gradius_font_'+_str[_i]+'.png" width="'+_w+'">';
	}
	_o.innerHTML=_s;
},//_setTextToFont

_clearData:function(){

},//_clearData()
_setData:function(_pt){
	let _this=this;
	let _data=_MAPDEFS[_pt];
	_this._setInitMap(_data);
	_this._setInitPartsBlocksWrapper(_data);

	//タイトルを表示
	const $_title=document.querySelector('#title input[name="title"]');
	$_title.value=_data._title;
	//bodyを表示
	const $_body=document.querySelector('#body textarea[name="body"]');
	$_body.value=_data._body;
	//BGM MUSICを表示
	const $_bgmusic=document.querySelector('#bgmusic select');
	for(let _i=0;_i<$_bgmusic.length;_i++){
		if($_bgmusic[_i].value===_data._bgmusic){
			$_bgmusic[_i].selected=true;
			break;
		}
	}
	$_bgmusic.addEventListener('click', function () {
		_GAME_STAGEEDIT_EVENTS._f_bgmusic_stop();
	});

	//BGM CHANGEを表示
	const $_bgchange = document.querySelector('#bgchange input[name="bgchange"]'),
		$_bgchange_v = document.querySelector('#bgchange .col_r .val');
	_data._bgchange = _data._bgchange || 0;
	$_bgchange.value = _data._bgchange;
	$_bgchange_v.setAttribute('data-val', _data._bgchange);
	_this._setTextToFont($_bgchange_v, _data._bgchange, 20);

	//BOSSを表示
	const $_boss=document.querySelector('#boss select');
	for(let _i=0;_i<$_boss.length;_i++){
		if($_boss[_i].value===_data._boss){
			$_boss[_i].selected=true;
			break;
		}
	}
	//initを表示
	const $_init=document.querySelector('#init input[name="init"]'),
		$_init_v=document.querySelector('#init .col_r .val');
	$_init.value=_data._initx;
	$_init_v.setAttribute('data-val',_data._initx);
	_this._setTextToFont($_init_v,_data._initx,20);
	//speedを表示
	const $_speed=document.querySelector('#speed input[name="speed"]'),
		$_speed_v=document.querySelector('#speed .col_r .val');
	$_speed.value=_data._speed;
	$_speed_v.setAttribute('data-val',_data._speed);
	_this._setTextToFont($_speed_v,_data._speed,20);
	//difficultを表示
	const $_difficult=document.querySelector('#difficult input[name="difficult"]'),
		$_difficult_v=document.querySelector('#difficult .col_r .val');
	$_difficult.value=_data._difficult;
	$_difficult_v.setAttribute('data-val',_data._difficult);
	_this._setTextToFont($_difficult_v,_data._difficult,20);
	//map_infiniteを表示
	const $_map_infinite=document.querySelector('#map_infinite input[name="map_infinite"]'),
	$_map_infinite_v=document.querySelector('#map_infinite .col_r .val');
	$_map_infinite.value=(_data._map_infinite==="true")?"1":"0";
	$_map_infinite_v.setAttribute('data-val',_data._map_infinite);
	_this._setTextToFont($_map_infinite_v,_data._map_infinite,20);

},//_setData

setDataForDataApi:function(){
	let _d=(function(_m){
		let _str='';

		//	MAPの取得
		_str+='"_map":[';
		let $_abr=document.querySelectorAll('.area_blocks_rows');
		for(let _i=0;_i<$_abr.length;_i++){
		let $_ab=$_abr[_i].children;
		_str+='"';
		for(let _j=0;_j<$_ab.length;_j++){
			_str+=$_ab[_j].getAttribute('data-val');
		}//_j
		_str+=((_i===$_abr.length-1)?'"':'",');
		}//_i
		_str+='],';
		_str+='"_theme":"'+_m._theme+'",';
		_str+='"_body":"'+document.querySelector('#body textarea[name="body"]').value+'",';
		_str+='"_initx":"'+document.querySelector('#init .col_r .val').getAttribute('data-val')+'",';
		_str+='"_bgmusic":"'+document.querySelector('#bgmusic select').value+'",';
		_str += '"_bgchange":"' + document.querySelector('#bgchange .col_r .val').getAttribute('data-val') + '",';
		_str+='"_boss":"'+document.querySelector('#boss select').value+'",';
		_str+='"_speed":"'+document.querySelector('#speed .col_r .val').getAttribute('data-val')+'",';
		_str+='"_difficult":"'+document.querySelector('#difficult .col_r .val').getAttribute('data-val')+'",';
		_str+='"_map_infinite":"'+document.querySelector('#map_infinite .col_r .val').getAttribute('data-val')+'"';
		
		return _str;
	})(_MAPDEFS[_MAP_PETTERN]);

	let _ed={
		'label':document.querySelector('#title input[name="title"]').value,
		'status':'Publish',
		'_eid':_MAPDEFS[_MAP_PETTERN]._eid,
		'data':[{data:_d,id:18}]
	};
	_DATAAPI._set_entryupdate(_ed);
},
_setEntryLink:function(){
	//前後エントリボタンステータス
	$_mp.classList.remove('off');
	$_mn.classList.remove('off');

	if(_MAP_PETTERN===0){
		$_mp.classList.add('off');
	}
	if(_MAP_PETTERN>=_MAPDEFS.length-1){
		$_mn.classList.add('off');
	}

},//setEntryLink
_setPartsBlockEvent:function(){
	//area_parts内、parts_blockイベント設定
	const $_ap_pb=document.querySelectorAll('#area_parts .parts_block');
	for(let _i=0;_i<$_ap_pb.length;_i++){
		$_ap_pb[_i].setAttribute('draggable',true);
		$_ap_pb[_i].addEventListener('dragstart',_GAME_STAGEEDIT_EVENTS._f_ap_dragstart,false);
		$_ap_pb[_i].addEventListener('dragend',_GAME_STAGEEDIT_EVENTS._f_ap_dragend,false);
	}
},//_setPartsBlockEvent
_init:()=>{
	//DataAPI読み込み完了後に実行
    const _this=_GAME_STAGEEDIT;
	//入力画面 BG MUSICの選択ボックス作成
	const $bgm=document.querySelector('#bgmusic select');
	Object.keys(_CANVAS_AUDIOS).forEach(function(_k){
		if(_k.indexOf('bg_type')===-1){return;}
		let _op=document.createElement('option');
		_op.setAttribute('value',_k.replace('bg_',''));
		_op.innerHTML=_k.replace('bg_','');
		$bgm.appendChild(_op);
		
	});

	const $boss=document.querySelector('#boss select');
	Object.keys(_MAP_ENEMIES_BOSS).forEach(function(_k){
		let _op=document.createElement('option');
		_op.setAttribute('value',_k);
		_op.innerHTML=_k;
		$boss.appendChild(_op);
		
	});

    //入力値をセット
    _MAP.init().then(()=>{
        console.log('success');
		_this._setData(_MAP_PETTERN);

		//area_parts内、parts_blockイベント設定
		_GAME_STAGEEDIT._setPartsBlockEvent();
		
		//入力フォームのイベント設定
		const $_fg_range=document.querySelectorAll('.form_group .col_r input[type="range"]');
		for(let _i=0;_i<$_fg_range.length;_i++){
		    $_fg_range[_i].addEventListener('input',_GAME_STAGEEDIT_EVENTS._f_fg_range,false);
		    $_fg_range[_i].addEventListener('change',_GAME_STAGEEDIT_EVENTS._f_fg_range,false);
		}

		//BG MUSICによる音再生イベント設定
		const $_fg_bg_play=document.querySelector('a.bgmusic_play');
		$_fg_bg_play.addEventListener('click',_GAME_STAGEEDIT_EVENTS._f_bgmusic_play);
		const $_fg_bg_stop=document.querySelector('a.bgmusic_stop');
		$_fg_bg_stop.addEventListener('click',_GAME_STAGEEDIT_EVENTS._f_bgmusic_stop);

		//設定が全て終わったらページを表示させる
		document.body.classList.add('on');
		document.body.classList.add('ismenu');

		//前後エントリーステータス設定
		_GAME_STAGEEDIT._setEntryLink();

		//gradiusフォントにセット
		let $_qsa=document.querySelectorAll('h1');
		for(let _i=0;_i<$_qsa.length;_i++){
			_this._setTextToFont($_qsa[_i],$_qsa[_i].innerText,40);
		}

		$_qsa=document.querySelectorAll(
			'h2,h3,#map_bts a,#entrylink a,label.col_l,div.col_r label span, #menu_inner a'
		);
		for(let _i=0;_i<$_qsa.length;_i++){
			_this._setTextToFont($_qsa[_i],$_qsa[_i].innerText,20);
		}

		$_qsa=document.querySelectorAll('.parts_block_wrapper .text');
		for(let _i=0;_i<$_qsa.length;_i++){
			_this._setTextToFont($_qsa[_i],$_qsa[_i].innerText,14);
		}

	});

}//_init
};//_GAME_STAGEEDIT


//イベント処理
const _GAME_STAGEEDIT_EVENTS={
_edits: false, //1ステージでの編集フラグ
$_do_area_parts_obj: null, //area_parts内ドラッグ中のオブジェクト
$_start_area_parts_obj: null, //area_parts内ドラッグ開始のオブジェクト
$_mouseover_area_parts_obj: null, //area_parts内マウスオーバー時のオブジェクト
//前のエントリ
_e_entrylink_prev:function(e){
	if(this._edits&&!window.confirm('編集ずみがあります。続けますか?')){return;}
	if(_MAP_PETTERN===0){return;}
	_MAP_PETTERN--;
	_GAME_STAGEEDIT._clearMap();
	_GAME_STAGEEDIT._setData(_MAP_PETTERN);
	_GAME_STAGEEDIT._setEntryLink();

	//area_parts内、parts_blockイベント設定
	_GAME_STAGEEDIT._setPartsBlockEvent();	
	
	//gradiusフォントにセット
	const $_qsa=document.querySelectorAll(
		'.parts_block_wrapper .text'
	);
	for(let _i=0;_i<$_qsa.length;_i++){
		_GAME_STAGEEDIT._setTextToFont($_qsa[_i],$_qsa[_i].innerText,14);
	}
	this._f_bgmusic_stop();
	this._edits = false;
	return false;
},//_e_entrylink_prev

//次のエントリ
_e_entrylink_next:function(e){
	if(this._edits&&!window.confirm('編集ずみがあります。続けますか?')){return;}
	if(_MAP_PETTERN>=_MAPDEFS.length-1){return;}
	_MAP_PETTERN++;
	_GAME_STAGEEDIT._clearMap();
	_GAME_STAGEEDIT._setData(_MAP_PETTERN);
	_GAME_STAGEEDIT._setEntryLink();

	//area_parts内、parts_blockイベント設定
	_GAME_STAGEEDIT._setPartsBlockEvent();	

	//gradiusフォントにセット
	const $_qsa=document.querySelectorAll(
		'.parts_block_wrapper .text'
	);
	for(let _i=0;_i<$_qsa.length;_i++){
		_GAME_STAGEEDIT._setTextToFont($_qsa[_i],$_qsa[_i].innerText,14);
	}
	this._f_bgmusic_stop();
	this._edits = false;
	return false;
},//_e_entrylink_next

//UPDATEボタン押下時
_e_update:function(){
	(window.confirm('更新しますか?'))
		?_GAME_STAGEEDIT.setDataForDataApi()
		:console.log('false');
	return false;
},//_e_update

//レンジ設定
_f_fg_range:function(e){
    let $_t_val=e.target.parentNode.previousElementSibling;
	let _val=(function(){
		if(e.target.name!=="map_infinite"){return e.target.value;}
		return (e.target.value==="1")?"true":"false";
	})();
	$_t_val.setAttribute('data-val',_val);
    $_t_val.innerText=_val;
    _GAME_STAGEEDIT._setTextToFont($_t_val,_val,20);

},//_f_fg_range

//====================
//	map bts events
//	for add, remove at back of blocks
//====================
_f_map_add:function(e){
	const $_abr=document.querySelectorAll('.area_blocks_rows');
	for(let _i=0;_i<$_abr.length;_i++){
		let $_ab=$_abr[_i].lastElementChild.cloneNode(true);
		$_abr[_i].appendChild($_ab);
		if($_ab.children.length===0){continue;}
	}
	e.stopPropagation();
    e.preventDefault();
	return false;
},
_f_map_remove:function(e){
	const $_abr=document.querySelectorAll('.area_blocks_rows');
	for(let _i=0;_i<$_abr.length;_i++){
		$_abr[_i].lastElementChild.remove();
	}
	e.stopPropagation();
    e.preventDefault();
	return false;
},

//====================
//	area_block events
//	parts for copy,move
//====================
_f_as_dragleave:function(e){
	//dragout at the area_block
//	console.log('_f_as_dragleave')
	if(_GAME_STAGEEDIT_EVENTS.$_mouseover_area_parts_obj===null
		||_GAME_STAGEEDIT_EVENTS.$_mouseover_area_parts_obj===undefined)
		{return;}
	_GAME_STAGEEDIT_EVENTS.$_mouseover_area_parts_obj.classList.remove('over');
	e.stopPropagation();
	e.preventDefault();
	return false;
}, //_f_as_dragleave
_f_as_dragenter:function(e){
	//dragin at the area_block to control not out of .area_blocks
//	console.log('_f_as_dragenter')
	if(this.$_do_area_parts_obj!==null){
		this.$_do_area_parts_obj.classList.remove('over');
	}

	//マップエリアのサイズを取得
	const _p_w = document.querySelector('.area_blocks').offsetWidth,
		_p_h = document.querySelector('.area_blocks').offsetHeight,
		//ドラッグオブジェクトのサイズを取得
		_c_w = this.$_start_area_parts_obj.getAttribute('data-width'),
		_c_h = this.$_start_area_parts_obj.getAttribute('data-height'),
		//area_partsの座標を取得
		_c_l = e.currentTarget.offsetLeft,
		_c_t = e.currentTarget.offsetTop;

	const _rows = document.querySelector('.area_blocks_rows');

	let _posX = parseInt((_c_l) / 20);
	let _posY = parseInt((_c_t) / 20);
	//ドラッグオブジェクトが、マップエリアを超えないように処理をする。
	if (_p_w - _c_l <= _c_w) {
		//横幅
//		console.log('left');
		_posX = parseInt((_p_w - _c_w) / 20);
	}
	if (_p_h - _c_t <= _c_h) {
		//縦幅
//		console.log('top');
		_posY = parseInt((_p_h - _c_h) / 20);
	}
	//マップエリア内にある全area_partsから、上記算出によるarea_partsを採取
	this.$_do_area_parts_obj = $_ab[_rows.children.length * (_posY) + _posX];
	this.$_do_area_parts_obj.classList.add('over');
	
    e.stopPropagation();
    e.preventDefault();
	return false;
},//_f_as_dragenter
_f_as_drop:function(e){
    console.log('f_as_drop');
    let _o=e.dataTransfer.getData("text");//data-val
	let $_ect = document.querySelector('.area_block.over'); //ドロップ先.area_block
	let $_e=this.$_start_area_parts_obj;//元.area_block
	$_e.style.zIndex = null;
	$_e.style.visibility = null;

	$_ect.classList.remove('over');
	//drag元の親要素のクラス名で、コピー・移動を決定
	//コピー・移動先にオブジェクトを配置
	let _parent_class = $_e.parentElement.getAttribute('class');
	if (_parent_class === 'area_block') {
		//移動
		$_ect.appendChild($_e);
	}else{
		//コピー
		let $_cn=$_e.cloneNode(true);
		$_ect.appendChild($_cn);
		if(_o.match(_MAP.collision_enemies)!==null){
			//敵の表示
			let _st=_MAP_THEME[_GAME_STAGEEDIT._theme]._enemies[_o]._st;
			let _obj=_MAP_THEME[_GAME_STAGEEDIT._theme]._enemies[_o]._getObj();
			$_cn.setAttribute('style',
				'width:'+parseInt(_obj.width*0.8)+'px;'+
				'height:'+parseInt(_obj.height*0.8)+'px;'+
				'background:url('+_obj.img.src+') no-repeat;'+
				'background-size:cover;'+
				((_st!=='')?_st:'')+
				'background-position:'+(20/_obj.width*_obj.imgPos[0]*-1)+'px 0px;'
			);
			$_cn.setAttribute('data-width', parseInt(_obj.width * 0.8));
			$_cn.setAttribute('data-height', parseInt(_obj.height * 0.8));
		}
		if(_o.match(_MAP.collision_map)!==null){
			//MAPの表示
			let _obj=_MAP_THEME[_GAME_STAGEEDIT._theme]._map[_o]._getObj();
			$_cn.setAttribute('style',
				'width:'+parseInt(_obj.width*0.8)+'px;'+
				'height:'+parseInt(_obj.height*0.8)+'px;'+
				'background:url('+_obj.img.src+') no-repeat;'+
				'background-size:cover;'+
				'background-position:'+(20/_obj.width*_obj.imgPos[0]*-1)+'px 0px;'
			);
			$_cn.setAttribute('data-width', parseInt(_obj.width * 0.8));
			$_cn.setAttribute('data-height', parseInt(_obj.height * 0.8));
		}
		$_ect.children[0].addEventListener('dragstart',this._f_pb_dragstart,false);
	}

	this._edits=true;
	//area_blockの設定
	$_ect.setAttribute('data-val',_o);

    e.stopPropagation();
    e.preventDefault();
    return false;
},//_f_as_drop

//====================
//	form_inner events
//	parts to delete
//====================
_f_i_dragover:function(e){
	e.stopPropagation();
    e.preventDefault();
	return false;
},//_f_i_dragover
_f_i_drop:function(e){
	console.log('form_inner drop');
	this._edits = true;
	for (let _i = 0; _i < $_ab.length; _i++) {
		$_ab[_i].classList.remove('over');
	}
	if(e.dataTransfer.effectAllowed!=='move'){return false;}
	this.$_start_area_parts_obj.parentNode.textContent=null;

	return false;
},//_f_i_drop


//====================
//	area_parts
//	dragover
//====================
_f_ap_dragstart:function(e){
	_GAME_STAGEEDIT_EVENTS.$_start_area_parts_obj=e.currentTarget;
	e.dataTransfer.setData("text",e.currentTarget.parentNode.getAttribute('data-val'));
    console.log('_f_ap_start');
},//_f_ap_dragstart
_f_ap_dragend:function(e){
	e.target.parentNode.classList.remove('drag');
    e.stopPropagation();
    e.preventDefault();
	return false;
},//_f_ap_dragend


//====================
//	parts_block
//	drag events over the area
//====================
_f_pb_dragstart:function(e){
	e.target.style.zIndex = 100; //手前に移動。
	e.target.style.visibility = 'hidden'; //非表示。
	console.log('_f_pb_dragstart');
	e.dataTransfer.effectAllowed='move';
	_GAME_STAGEEDIT_EVENTS.$_start_area_parts_obj=e.currentTarget;
	e.dataTransfer.setData("text",e.currentTarget.parentNode.getAttribute('data-val'));
	e.currentTarget.parentNode.setAttribute('data-val',0);
},//_f_pb_dragstart

//====================
//	audio playing events
//====================
_f_bgmusic_play:function(e){
	let _b=document.querySelector('#bgmusic select').value;
	_GAME_AUDIO._setPlayOnBG(_CANVAS_AUDIOS['bg_' + _b]);
},//_f_bgmusic_play
_f_bgmusic_stop:function(e){
	_GAME_AUDIO._setStopOnBG();
}//_f_bgmusic_stop

};//_GAME_STAGEEDIT_EVENTS



document.querySelector('form #map #area').addEventListener('scroll', (e) => {
	//#map
	let $area_blocks=document.querySelector('form #map #area .area_blocks').getBoundingClientRect().width;
	//スクロールが両端に届いた時の調整
	if (e.currentTarget.scrollLeft === 0) {
		//左端
		document.querySelector('form #map #ruler').scrollLeft=0;
		return;
	}
	if (e.currentTarget.scrollLeft >= $area_blocks) {
		//右端
		document.querySelector('form #map #ruler').scrollLeft = $area_blocks;
		return;
	}
	document.querySelector('form #map #ruler').scrollLeft = e.currentTarget.scrollLeft;
});
window.addEventListener('load', () => {
	$_pb=document.getElementsByClassName('parts_block');
	$_ab=document.getElementsByClassName('area_block');
	$_mp=document.querySelector('#menu .prev');
	$_mn=document.querySelector('#menu .next'); 
	$_bm=document.querySelector('#bgmusic');

	_GAME_AUDIO._audio_context = new AudioContext();
	_AJAX({url:'./gradius_config.json'})
	.then((_d)=>{
		//設定情報取得した値を各オブジェクトにセット
		_DEF_DIFFICULT = _d.common.difficult;

		_CANVAS_IMGS_CONTROL._init_canvas_imgs(_d.canvasimgs.imgs);
		_CANVAS_IMGS_CONTROL._init_canvas_imgs_init(_d.canvasimgs.imgs_init);
		_CANVAS_IMGS_CONTROL._init_canvas_audios(_d.canvasimgs.audios);

		//マップ用テーマ設定
		_MAP.init_map_theme(_d.map.theme);
		//マップ用ボス定義設定
		_MAP.init_map_enemies_boss(_d.map.enemies_boss);

		return _GAME_AUDIO._init_audios(_CANVAS_AUDIOS,()=>{})
	}).then(()=>{
		return _GAME_IMG._init_imgs(_CANVAS_IMGS);
	}).then(()=>{
		return _DATAAPI._init_config();
	}).then((_d)=>{
		_DATAAPI._init(_d);
	});
});
//_GAME_STAGEEDIT._init();

// const _area=document.querySelector('#area');
// const $_as=document.querySelector('#area_selectable');
// const $_ai=document.querySelector('#area_inner');
// let _as_s=0;
// let _as_e=0;
// let _fl=false;
// let _x,_y,_w,_h;
// _area.addEventListener('mousedown',function(e){
//     _fl=true;
//     console.log('mousedown');
//     _as_s=new Date().getTime();
//     _x=e.layerX;
//     _y=e.layerY;
// });
// _area.addEventListener('mousemove',function(e){
//     //マウスダウンが前提
//     if(!_fl){return false;}
//     _as_e=new Date().getTime();
//     if(_as_e-_as_s<1000){return false;}
//     _w=Math.abs(e.layerX-_x);
//     _h=Math.abs(e.layerY-_y);
//     $_as.style.left=((e.layerX>_x)?_x:e.layerX)+'px';
//     $_as.style.top=((e.layerY>_y)?_y:e.layerY)+'px';
//     $_as.style.width=_w+'px';
//     $_as.style.height=_h+'px';
// //    e.toElement.classList.add('on');
//     $_as.classList.add('on');
// //    console.log('e.layerY:'+e.layerY);
// //  console.log('_y:'+_y);
//     console.log(e);
//     e.stopPropagation();
//     e.preventDefault();
//     return false;
// });
// _area.addEventListener('mouseup',function(e){
//     //マウスアップは全てリセット
//     _fl=false;
//     console.log('mouseup');
//     $_as.classList.remove('on');
//     $_as.removeAttribute('style');
//     e.stopPropagation();
//     e.preventDefault();
//     return false;
// });
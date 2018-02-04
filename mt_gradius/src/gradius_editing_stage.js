'use strict';

const _MAP=new GameObject_MAP();
let $_pb=null;
let $_ab=null;
let $_mp=null;
let $_mn=null;

_MAP_PETTERN=0;

const _AJAX=function(_url,_type,_f){
    let _r=new XMLHttpRequest();
    _r.onreadystatechange=function(){
        if(_r.readyState===4){//通信の完了時
            if(_r.status===200) {//通信の成功時
                console.log('OK');
                _f(_r.response);
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

const _DATAAPI={
_data_api:'',
_blog_id:3,
_init:function(){
	let _this=this;
	_this._data_api=new MT.DataAPI({
		baseUrl:"http://localhost/mt/mt-data-api.cgi",
		clientId:"api11entries"
	});

	_this._data_api.getToken(function(res){
		if (res.error) {
			if(res.error.code===401) {
				console.log('reload after 401 error occuered in updating.');
				location.href=
					_this._data_api.getAuthorizationUrl(location.href);
			}
			return false;
		}
		_GAME_STAGEEDIT._init_images(
			_CANVAS_IMGS,
			_GAME_STAGEEDIT._init);
	});
},//_init
_set_entryupdate:function(_ed){
	//	_d.title
	//	_d.status
	let _this=this;
	_this._data_api.updateEntry(
		_this._blog_id,
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

		//jsonファイルを取得して再表示させる
		_MAP.init(function(){
			_MAP_PETTERN=0;
			_GAME_STAGEEDIT._setData(_MAP_PETTERN);

			//area_parts内、parts_blockイベント設定
			const $_ap_pb=document.querySelectorAll('#area_parts .parts_block');
			for(var _i=0;_i<$_ap_pb.length;_i++){
			    $_ap_pb[_i].setAttribute('draggable',true);
			    $_ap_pb[_i].addEventListener('dragstart',_GAME_STAGEEDIT_EVENTS._f_ap_dragstart,false);
				$_ap_pb[_i].addEventListener('dragend',_GAME_STAGEEDIT_EVENTS._f_ap_dragend,false);
			}

			//入力フォームのイベント設定
			const $_fg_range=document.querySelectorAll('.form_group .col_r input[type="range"]');
			for(var _i=0;_i<$_fg_range.length;_i++){
			    $_fg_range[_i].addEventListener('input',_GAME_STAGEEDIT_EVENTS._f_fg_range,false);
			    $_fg_range[_i].addEventListener('change',_GAME_STAGEEDIT_EVENTS._f_fg_range,false);
			}

			//設定が全て終わったらページを表示させる
			document.body.classList.add('on');
			document.body.classList.add('ismenu');

			_GAME_STAGEEDIT._setEntryLink();

			//gradiusフォントにセット
			const $_qsa=document.querySelectorAll(
				'.parts_block_wrapper .text'
			);
			for(let _i=0;_i<$_qsa.length;_i++){
				_GAME_STAGEEDIT._setTextToFont($_qsa[_i],$_qsa[_i].innerText,20);
			}

	    });//_MAP.init()

	});//updateentry

}//_set_entryupdate
}//_DATAAPI

const _GAME_STAGEEDIT={
_theme:0,
_setInitMap:function(_m){
	//初期表示
	this._theme=_m._theme;
	let _mo=_m._map;
    let _str='';
    for(let _i=0;_i<_mo.length;_i++){
    _str+='<div class="area_blocks_rows">';
    for(let _j=0;_j<_mo[_i].length;_j++){
        _str+='<div class="area_block" data-val="'+_mo[_i][_j]+'" '+
			'onmouseover="_GAME_STAGEEDIT_EVENTS._f_as_mouseover(event);" '+
			'onmouseout="_GAME_STAGEEDIT_EVENTS._f_as_mouseout(event);" '+
			'ondragenter="_GAME_STAGEEDIT_EVENTS._f_as_dragenter(event);" '+
			'ondrop="_GAME_STAGEEDIT_EVENTS._f_as_drop(event);">'+
        (function(_k){
            if(_k==='0'){return '';}
			//パーツがある場合はイベントを追加する
            let _s='<div class="parts_block" '
					+'ondragstart="_GAME_STAGEEDIT_EVENTS._f_pb_dragstart(event);" '
					+'draggable="true">';
			if(_k.match(_MAP.collision_enemies)!==null){
				//敵の表示
//				console.log(_k)
				let _o=_MAP_THEME[_m._theme]._enemies[_k]._o.obj;
				let _st=_MAP_THEME[_m._theme]._enemies[_k]._st;
				_s+='<img'+((_st==='')?'':' style="'+_st+'"')+' width="'+parseInt(_o.width*0.8)+'" height="'+parseInt(_o.height*0.8)+'" src="'+_o.src+'">';
			}else if(_k.match(_MAP.collision_map)!==null){
				//マップの表示
				let _o=_MAP_THEME[_m._theme]._p[_k]._o.obj;
				_s+='<img width="'+parseInt(_o.width*0.8)+'" height="'+parseInt(_o.height*0.8)+'" src="'+_o.src+'">';
//                _s+='<img width="'+parseInt(20*_wh._w)+'" height="'+parseInt(20*_wh._h)+'" src="'+_MAP_THEME[_m._theme]._p[_k]._o.src+'">';
			}
			return _s+'</div>';
		})(_mo[_i][_j])+
        '</div><!-- /.area_block -->';
    }//_j
    _str+='</div><!-- /.area_blocks_rows -->';
    }//_i
    //MAPを表示
    document
		.querySelector('.area_blocks.drop')
		.innerHTML=_str;

},//_setInitMap

_setInitPartsBlocksWrapper:function(_m){
	let _mo=_m._map;
	let _str='';
	//ENEMY
	for(let [_k,_v] of Object.entries(_MAP_THEME[_m._theme]._enemies)){
		_str+=
			'<div class="parts_block_wrapper" data-val="'+_k+'">'+
			'<div class="text">enemy '+_k+'</div>'+
			'<div class="parts_block"><img'+((_v._st==='')?'':' style="'+_v._st+'"')+' src="'+_v._o.src+'"></div>'+
			'</div><!-- /.parts_block_wrapper -->'
	}
    document
		.querySelector('.parts_blocks_wrapper.enemy .parts_blocks')
		.innerHTML=_str;

	_str='';
	for(let [_k,_v] of Object.entries(_MAP_THEME[_m._theme]._p)){
		_str+=
			'<div class="parts_block_wrapper" data-val="'+_k+'">'+
			'<div class="text">MAP '+_k+'</div>'+
			'<div class="parts_block"><img src="'+_v._o.src+'"></div>'+
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
	_w=_w||30;
	let _s='';
	for(let _i=0;_i<_str.length;_i++){
		if(_str[_i]===' '){
			_s+='<img src="./images/gradius_spacer.png" width="'+_w+'">';
			continue;
		}
        if(_str[_i]===':'){continue;}
		_s+='<img src="./images/gradius_font_'+_str[_i]+'.png" width="'+_w+'">';
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
		_str+='"_title":"'+document.querySelector('#title input[name="title"]').value+'",';
		_str+='"_eid":"'+_m._eid+'",';
		_str+='"_theme":"'+_m._theme+'",';
		_str+='"_body":"'+document.querySelector('#body textarea[name="body"]').value+'",';
		_str+='"_initx":"'+document.querySelector('#init .col_r .val').getAttribute('data-val')+'",';
		_str+='"_bgmusic":"'+document.querySelector('#bgmusic select').value+'",';
		_str+='"_boss":"'+document.querySelector('#boss select').value+'",';
		_str+='"_speed":"'+document.querySelector('#speed .col_r .val').getAttribute('data-val')+'",';
		_str+='"_difficult":"'+document.querySelector('#difficult .col_r .val').getAttribute('data-val')+'",';
		_str+='"_map_infinite":"'+document.querySelector('#map_infinite .col_r .val').getAttribute('data-val')+'"';
		
		return _str;
	})(_MAPDEFS[_MAP_PETTERN]);

	let _ed={
		'title':document.querySelector('#title input[name="title"]').value,
		'status':'Publish',
		'_eid':_MAPDEFS[_MAP_PETTERN]._eid,
		'body':_d
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
	for(var _i=0;_i<$_ap_pb.length;_i++){
		$_ap_pb[_i].setAttribute('draggable',true);
		$_ap_pb[_i].addEventListener('dragstart',_GAME_STAGEEDIT_EVENTS._f_ap_dragstart,false);
		$_ap_pb[_i].addEventListener('dragend',_GAME_STAGEEDIT_EVENTS._f_ap_dragend,false);
	}
},//_setPartsBlockEvent
_init_images:function(_obj,_func){
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
				_func();
			}
		}
	}
},
_init:function(){
	//DataAPI読み込み完了後に実行
    const _this=_GAME_STAGEEDIT;
	//入力画面 BG MUSICの選択ボックス作成
	const $bgm=document.querySelector('#bgmusic select');
	Object.keys(_CANVAS_AUDIOS).forEach(function(_k){
		if(_k.indexOf('bg_type')===-1){return;}
		var _op=document.createElement('option');
		_op.setAttribute('value',_k.replace('bg_',''));
		_op.innerHTML=_k.replace('bg_','');
		$bgm.appendChild(_op);
		
	});

	const $boss=document.querySelector('#boss select');
	Object.keys(_MAP_ENEMIES_BOSS).forEach(function(_k){
		var _op=document.createElement('option');
		_op.setAttribute('value',_k);
		_op.innerHTML=_k;
		$boss.appendChild(_op);
		
	});

    //入力値をセット
    _MAP.init(function(){
        console.log('success');
		_this._setData(_MAP_PETTERN);

		//area_parts内、parts_blockイベント設定
		_GAME_STAGEEDIT._setPartsBlockEvent();
		
		//入力フォームのイベント設定
		const $_fg_range=document.querySelectorAll('.form_group .col_r input[type="range"]');
		for(var _i=0;_i<$_fg_range.length;_i++){
		    $_fg_range[_i].addEventListener('input',_GAME_STAGEEDIT_EVENTS._f_fg_range,false);
		    $_fg_range[_i].addEventListener('change',_GAME_STAGEEDIT_EVENTS._f_fg_range,false);
		}

		//設定が全て終わったらページを表示させる
		document.body.classList.add('on');
		document.body.classList.add('ismenu');

		//前後エントリーステータス設定
		_GAME_STAGEEDIT._setEntryLink();

		//gradiusフォントにセット
		const $_qsa=document.querySelectorAll(
		'h1,h2,h3,#map_bts a,#entrylink a,label.col_l,div.col_r label span, .parts_block_wrapper .text, #menu_inner a'
		);
		for(let _i=0;_i<$_qsa.length;_i++){
		_this._setTextToFont($_qsa[_i],$_qsa[_i].innerText,20);
		}
	});

}//_init
};//_GAME_STAGEEDIT


//イベント処理
const _GAME_STAGEEDIT_EVENTS={
$_do_area_parts_obj:null,//area_parts内ドラッグ中のオブジェクト
$_start_area_parts_obj:null,//area_parts内ドラッグ開始のオブジェクト
$_mouseover_area_parts_obj:null,//area_parts内マウスオーバー時のオブジェクト
//前のエントリ
_e_entrylink_prev:function(e){
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
		_GAME_STAGEEDIT._setTextToFont($_qsa[_i],$_qsa[_i].innerText,20);
	}
	return false;
},//_e_entrylink_prev

//次のエントリ
_e_entrylink_next:function(e){
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
		_GAME_STAGEEDIT._setTextToFont($_qsa[_i],$_qsa[_i].innerText,20);
	}
	return false;
},//_e_entrylink_next

//UPDATEボタン押下時
_e_update:function(){
	(confirm('更新しますか?'))
		?_GAME_STAGEEDIT.setDataForDataApi()
		:console.log('false');
	return false;
},//_e_update

//ページスクロール時
_e_scroll:function(e){
    const $_b=document.body;
//    const _boh=$_b.offsetHeight;
    const _wih=document.body.clientHeight;
    const $_m=document.getElementById('menu');
    const _mh=$_m.offsetHeight;
//    console.log($_b.scrollTop+window.innerHeight);
//	console.log('mh:'+_mh);
    ($_b.scrollTop+window.innerHeight>_wih-(_mh/2))
        ?$_b.classList.remove('ismenu')
        :$_b.classList.add('ismenu');
},//_e_scroll

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
//	area_selectable events
//	parts for copy,move
//====================
_f_as_mouseover:function(e){
//	console.log(e.target);
	let _this=this;
	if(e.target.tagName==="IMG"){
		_GAME_STAGEEDIT_EVENTS.$_mouseover_area_parts_obj=e.target;
		e.target.classList.add('over');
	}
	e.stopPropagation();
    e.preventDefault();
	return false;
},//_f_as_mouseover
_f_as_mouseout:function(e){
	if(_GAME_STAGEEDIT_EVENTS.$_mouseover_area_parts_obj===null
		||_GAME_STAGEEDIT_EVENTS.$_mouseover_area_parts_obj===undefined)
		{return;}
	_GAME_STAGEEDIT_EVENTS.$_mouseover_area_parts_obj.classList.remove('over');
	e.stopPropagation();
    e.preventDefault();
	return false;
},//_f_as_mouseout
_f_as_dragenter:function(e){
	//マップのブロック内ドラッグオーバー処理
//	console.log(this.$_do_area_parts_obj);
	if(this.$_do_area_parts_obj!==null){
		this.$_do_area_parts_obj.classList.remove('over');
	}
	this.$_do_area_parts_obj=e.target;
	this.$_do_area_parts_obj.classList.add('over');
    e.stopPropagation();
    e.preventDefault();
	return false;
},//_f_as_dragenter


_f_as_drop:function(e){
    console.log('as_drop');
    let _o=e.dataTransfer.getData("text");//data-val
	let $_ect=e.currentTarget;//ドロップ先.area_block
    let $_e=this.$_start_area_parts_obj;//元.area_block

	$_ect.classList.remove('over');
	if($_ect.childNodes.length!==0){
		//画像タグの場合（すでにarea_block内に画像がある場合）
		//area_block内を全て空にする
		$_ect.textContent=null;
	}
    //コピー・移動先にオブジェクトを配置
	if(e.dataTransfer.effectAllowed==='move'){
		//移動
		$_ect.appendChild(this.$_start_area_parts_obj);
	}else{
		//コピー
		let $_cn=$_e.cloneNode(true);
		$_ect.appendChild($_cn);
		if(_o.match(_MAP.collision_enemies)!==null){
			//敵の表示
			let _obj=_MAP_THEME[_GAME_STAGEEDIT._theme]._enemies[_o]._o.obj;
			$_cn.children[0].width=parseInt(_obj.width*0.8);
			$_cn.children[0].height=parseInt(_obj.height*0.8);
		}
		if(_o.match(_MAP.collision_map)!==null){
			//MAPの表示
			let _obj=_MAP_THEME[_GAME_STAGEEDIT._theme]._p[_o]._o.obj;
			$_cn.children[0].width=parseInt(_obj.width*0.8);
			$_cn.children[0].height=parseInt(_obj.height*0.8);
		}
		$_ect.children[0].addEventListener('dragstart',this._f_pb_dragstart,false);
	}

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
//	drag events
//====================
_f_pb_dragstart:function(e){
	console.log('_f_pb_dragstart');
	e.dataTransfer.effectAllowed='move';
    e.dataTransfer.dropEffect='move';
	_GAME_STAGEEDIT_EVENTS.$_start_area_parts_obj=e.currentTarget;
	e.dataTransfer.setData("text",e.currentTarget.parentNode.getAttribute('data-val'));
	e.currentTarget.parentNode.setAttribute('data-val',0);
}//_f_pb_dragstart
};//_GAME_STAGEEDIT_EVENTS



window.onload=function(){
    $_pb=document.getElementsByClassName('parts_block');
    $_ab=document.getElementsByClassName('area_block');
    $_mp=document.querySelector('#menu .prev');
    $_mn=document.querySelector('#menu .next');    
    _DATAAPI._init();    
};
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
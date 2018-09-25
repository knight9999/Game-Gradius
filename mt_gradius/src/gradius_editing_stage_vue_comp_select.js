'use strict';

const _VUE_COMPONENT_SELECT={
template:`<div class="col_r_group">
<div class="vue_component_select">
<div class="selected" ref="span_select" v-on:click="open">aaa</div>
<ul><li ref="li" v-on:click="set" v-for="list in lists" :data-val="list">{{list}}</li></ul>
</div><!-- /.vue_component_select -->
</div>
`,
style:`
/*  component
=====================*/
div.vue_component_select {
	position: relative;
}

div.vue_component_select div.selected {
	background-color: rgba(0, 0, 0, 1);
	border: 1px solid rgba(255, 255, 255, 0.7);
	border-radius: 3px;
	cursor: pointer;
	display: block;
	height: 3em;
	line-height: 3em;
	min-width: 400px;
	padding: 0px 20px;
	position: relative;
}

div.vue_component_select div.selected:after {
	content: '';
	position: absolute;
	width: 0px;
	height: 0px;
	right: 10px;
	top: calc(50% - 5px);
	border-left: 8px solid rgba(255, 255, 255, 0.8);
	border-top: 5px solid transparent;
	border-right: 5px solid transparent;
	border-bottom: 5px solid transparent;
	transform-origin: 2.5px;
	transition: 0.2s;
}
div.vue_component_select div.selected.on.top:after  {transform: rotate(90deg);}
div.vue_component_select div.selected.on.bottom:after  {transform: rotate(-90deg);}

div.vue_component_select ul  {
	border: 1px solid rgba(255, 255, 255, 0.7);
	border-radius: 0px 0px 5px 5px;
	border-top: none;
	height: 0px;
	position: absolute;
	opacity: 0;
	overflow-x: hidden;
	overflow-y: auto;
	width: 100%;
	transition: 0.2s all;
	z-index: 10;
}
div.vue_component_select ul.on  {
	box-shadow: 0px 1px 3px rgba(255, 255, 255, 1.0);
	height: 200px;
	opacity: 1;
}
div.vue_component_select ul.top  {
	top: 100%;
}
div.vue_component_select ul.bottom  {
	border-top:1px solid rgba(255, 255, 255, 1.0);
	border-radius: 5px 5px 0px 0px;
	bottom:100%;
}
div.vue_component_select ul li  {
	background-color: rgba(0, 0, 0, 1);
	cursor: pointer;
	transition: 0.2s all;
	height: 0px;
	display: block;
	overflow: hidden;
	padding: 20px;
	width: 100%;
}
div.vue_component_select ul li>div  {line-height: 0;}
div.vue_component_select ul li:not(:last-of-type)  {border-bottom: 1px solid rgba(255, 255, 255, 0.7);}

div.vue_component_select ul.on li  {
	display: flex;
	box-sizing: content-box;
	height: 15px;
	padding: 20px;
}

div.vue_component_select ul.on li:hover  {
	background-color: rgba(60, 60, 60, 1);
}

div.vue_component_select ul.on li.on  {
	background-color: rgba(90, 90, 90, 1);
}

`,
set_style() {
	const _newstyle = document.createElement('style');
	_newstyle.innerHTML = this.style;
	document.getElementById('set_style').appendChild(_newstyle);
},//set_style()
set_parts(){
	return {
	props:{'name':{type:String},'ar':{type:Array}},
	template: _VUE_COMPONENT_SELECT.template,
	data(){
		return {
			lists: this.ar,
			name:name
		};
	},
	created(){
	},
	mounted(){
		console.log(this.name)
		_GAME_STAGEEDIT._setTextToFont(this.$refs.span_select, this.$refs.span_select.innerText, 15);
		this.$refs.li.forEach((_o)=>{
			_GAME_STAGEEDIT._setTextToFont(_o, _o.innerText, 15);
		})
	},
	methods:{
		set(e){
			const $_li = e.target;//li
			const $_ul = $_li.parentElement; //ul
			$_ul.previousElementSibling.classList.remove('on') //span
			$_ul.classList.remove('on'); //ul
			$_ul.parentElement.setAttribute('data-val', $_li.getAttribute('data-val')) //.component_select
			$_ul.previousElementSibling.innerHTML = $_li.innerHTML //span

			Array.from($_ul.children).forEach((_o) => { //li s
				_o.classList.remove('on');
			})
			$_li.classList.add('on'); //li current
		},//set
		open(e){
			const $_span = e.target;//span
			const $_ul = $_span.nextElementSibling; //ul
			if ($_span.classList.contains('on')) {
				$_span.classList.remove('on');
				$_ul.classList.remove('on');
			} else {
				document.querySelectorAll('.vue_component_select div').forEach((_o) => {
					_o.classList.remove('on', 'top', 'bottom');
				}); //span
				document.querySelectorAll('.vue_component_select ul').forEach((_o) => {
					_o.classList.remove('on', 'top', 'bottom');
				}); //ul
				$_span.classList.add('on'); //span
				$_ul.classList.add('on'); //ul

				if ($_span.getBoundingClientRect().y > 350) {
					$_span.classList.add('bottom'); //span
					$_ul.classList.add('bottom');
				} else {
					$_span.classList.add('top'); //span
					$_ul.classList.add('top');
				}
			}
		}//open
	}//methods
	}
}//set_parts();
};

_VUE_COMPONENT_SELECT.set_style();
Vue.component('component-select', _VUE_COMPONENT_SELECT.set_parts());

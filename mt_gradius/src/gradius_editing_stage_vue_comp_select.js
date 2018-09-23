'use strict';

const _VUE_COMPONENT_SELECT_TEMP = `
<div class="vue_component_select">
<span ref="span" v-on:click="open">aaa</span>
<ul><li ref="li" v-on:click="set" v-for="list in lists" :data-val="list">{{list}}</li></ul>
</div><!-- /.vue_component_select -->
`;

const _VUE_COMPONENT_SELECT_STYLE = `
/*  component
=====================*/
div.vue_component_select {
	position: relative;
}

div.vue_component_select span  {
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

div.vue_component_select span:after  {
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
div.vue_component_select span.on.top:after  {transform: rotate(90deg);}
div.vue_component_select span.on.bottom:after  {transform: rotate(-90deg);}

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

`;

const _VUE_COMPONENT_SELECT_PARTS = {
	props:{'ar':{type:Array}},
	template: _VUE_COMPONENT_SELECT_TEMP,
	data(){
		return {
			lists: this.ar
		};
	},
	created(){
	},
	mounted(){
		_GAME_STAGEEDIT._setTextToFont(this.$refs.span, this.$refs.span.innerText, 15);
		this.$refs.li.forEach((_o)=>{
			_GAME_STAGEEDIT._setTextToFont(_o, _o.innerText, 15);
		})
	},
	methods:{
		set:(e)=>{
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
		open:(e)=>{
			const $_span = e.target;//span
			const $_ul = $_span.nextElementSibling; //ul
			if ($_span.classList.contains('on')) {
				$_span.classList.remove('on');
				$_ul.classList.remove('on');
			} else {
				document.querySelectorAll('.component_select span').forEach((_o) => {
					_o.classList.remove('on', 'top', 'bottom');
				}); //span
				document.querySelectorAll('.component_select ul').forEach((_o) => {
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
};


const _VUE_COMPONENT_SELECT = new Vue({
	el: 'form #form_groups',
	data:{isshow:false},
	components:{
		'component-select-a': _VUE_COMPONENT_SELECT_PARTS
	},
	created() {
		console.log('created===');
	},
	mounted(){
		var newelm = document.createElement('style');
		newelm.innerHTML = _VUE_COMPONENT_SELECT_STYLE;
		document.getElementById('set_style').appendChild(newelm);
	},
	methods:{
		open(){
			this.$refs.comp.open();
		}
	}
});

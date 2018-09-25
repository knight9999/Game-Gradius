'use strict';

const _VUE_COMPONENT_RANGE = {
template:`
<div class="col_r_group">
<div ref="val" class="val"></div>
<label><div ref="div_min">{{min}}</div><input ref="range" :name="name" type="range" :min="min" :max="max" :step="step"><div ref="div_max">{{max}}</div></label>
</div><!-- /.col_r_group -->
`,
style: `
form .form_group .col_r{float:left;width:77%;}
form .form_group .col_r .val{
    background-color:rgba(0,0,0,1);
    border:1px solid rgba(255,255,255,0.7);
	border-radius:3px;
    display:inline-block;
    margin-right:20px;
	padding:10px;
	text-align:center;
    width:140px;
}
form .form_group .col_r.range{margin-right:5%;width:10%;}

form .form_group .col_r .col_r_group{display:flex;width:100%;align-items: center;}
form .form_group .col_r .col_r_group:not(:last-child){margin-bottom:10px;}

form .form_group .col_r .col_r_group label > div{display:inline-block;}

`,
set_style(){
	const _newstyle = document.createElement('style');
	_newstyle.innerHTML = this.style;
	document.getElementById('set_style').appendChild(_newstyle);
},
set_parts(){
	return {
		props:{'name':String,'min':Number,'max':Number,'step':Number},
		template: _VUE_COMPONENT_RANGE.template,
		data(){
			return {
				value:1,
				name:name
			};
		},
		created(){
		},
		mounted(){
			console.log(this.name)
			this.$refs.val.innerText = this.value;
			this.$refs.range.value = this.value;

			_GAME_STAGEEDIT._setTextToFont(this.$refs.val, this.$refs.val.innerText, 15);
			_GAME_STAGEEDIT._setTextToFont(this.$refs.div_min, this.$refs.div_min.innerText, 20);
			_GAME_STAGEEDIT._setTextToFont(this.$refs.div_max, this.$refs.div_max.innerText, 20);
		}
	};
}
}

const _VUE_COMPONENT_RANGE_BOOLEAN = {
template: `
<div class="col_r_group">
<div ref="val" class="val">true</div>
<label><div ref="div_min">false</div><input ref="range" :name="name" type="range" min="0" max="1"><div ref="div_max">true</div></label>
</div><!-- /.col_r_group -->
`,
set_parts(){
	return {
		props:{'name':String},
		template: this.template,
		data(){
			return {
				value:true,
				name:name
			};
		},		
		mounted() {
			console.log(this.name)
			this.$refs.val.innerText = this.value;
			this.$refs.range.value = this.value;

			_GAME_STAGEEDIT._setTextToFont(this.$refs.val, this.$refs.val.innerText, 15);
			_GAME_STAGEEDIT._setTextToFont(this.$refs.div_min, this.$refs.div_min.innerText, 20);
			_GAME_STAGEEDIT._setTextToFont(this.$refs.div_max, this.$refs.div_max.innerText, 20);
		}

	}
}
} //_VUE_COMPONENT_RANGE_BOOLEAN


_VUE_COMPONENT_RANGE.set_style();
Vue.component('component-range', _VUE_COMPONENT_RANGE.set_parts());
Vue.component('component-range-boolean', _VUE_COMPONENT_RANGE_BOOLEAN.set_parts());



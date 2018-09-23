'use strict';

const _VUE_COMPONENT_MODAL_TEMP = `
<section v-if="isshow" class="component_modal">
<section class="component_modal_dialog on">
    <div class="message_area">このステージを更新しますか?</div>
    <div class="footer_area"><button class="yes">YES</button><button v-on:click="close" class="no">NO</button></div>
</section>
<section id="g_loading">
    <div id="loading_icon">
        <div id="loading_rotate" class="out"></div>
        <div id="loading_rotate" class="in"></div>
    </div><!-- #loading_icon -->
</section><!-- #g_loading -->
</section>
`;

const _VUE_COMPONENT_MODAL_STYLE = `
.component_modal {
	background-color:rgba(255,255,255,0.8);
	overflow: hidden;
	position:fixed;
	left:0px;
	top:0px;
	height:100%;
	transition: 0.2s ease;
	width:100%;
	z-index:100;
}
.component_modal .component_modal_dialog{
	background-color: rgba(255,255,255,1);
	border-radius: 3px;
	display: block;
	box-shadow: 0 0 5px rgba(0,0,0,0.5);
	padding:20px;
	position: absolute;
	margin: auto;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.component_modal .component_modal_dialog.on {display:block;}

.component_modal .component_modal_dialog .message_area {
	padding-bottom: 20px;
}
.component_modal .component_modal_dialog .footer_area button {
	padding: 10px;
	border-radius: 3px;
	background-color: rgba(0, 0, 0, 0.05);
	margin: 0px 5px;
}

.component_dialog{
	bottom: 0px;
	position: fixed;
	width: 100%;
	z-index: 101;
}
.component_dialog div{
	background-color: rgba(255, 255, 255, 1);
	border-radius: 5px;
	display: block;
	box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
	top: 0px;
	opacity: 0;
	padding: 10px 30px;
	position: absolute;
	left: calc(50% - 45%);
	transform: translateY(0);
	width:90%;
	animation: component_dialog_anim 4s ease 0s 1 alternate none running;
}
.component_dialog div span{margin-left:1em;}

@keyframes component_dialog_anim {
	0% {opacity: 0;transform: translateY(0);}
	10% {opacity: 1;transform: translateY(-80px);}
	90% {opacity: 1;transform: translateY(-80px);}
	100% {opacity: 0;transform: translateY(0);}
}


/*  Loading
=====================*/
#g_loading {
	display: none;
}

#g_loading.on {display: block;}
#g_loading.on #loading_icon {
	animation: ani_loading_opacity 0.1s linear infinite;
	bottom: 0px;
	display: block;
	height: 200px;
	left: 0px;
	margin: auto;
	position: absolute;
	right: 0px;
	top: 0px;
	width: 200px;
	z-index: 110;
}

#g_loading.on #loading_rotate {
	border: 5px solid #0066ff;
	border-radius: 50%;
	border-right-color: transparent;
	height: 30px;
	margin: auto;
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	width: 30px;
}

#g_loading.on #loading_rotate.out {
	animation: ani_loading_rotate_out 1s linear infinite;
	height: 50px;
	width: 50px;
}

#g_loading.on #loading_rotate.in {
	animation: ani_loading_rotate_in 1s linear infinite;
}

#g_loading.on #loading_icon:after {
	bottom: 40px;
	content: 'Processing...';
	color: #0066ff;
	letter-spacing: 3px;
	font-weight: bold;
	position: absolute;
	text-align: center;
	width: 200px;
}

@keyframes ani_loading_rotate_out {
	0% {transform: rotate(0deg);}
	50% {transform: rotate(180deg);}
	100% {transform: rotate(360deg);}
}

@keyframes ani_loading_rotate_in {
	0% {transform: rotate(0deg);}
	50% {transform: rotate(-180deg);}
	100% {transform: rotate(-360deg);}
}

@keyframes ani_loading_opacity {
	0% {opacity: 1;}
	50% {opacity: 0.5;}
	100% {opacity: 1;}
}
`;

const _VUE_COMPONENT_MODAL_PARTS = {
	props:{isshow:Boolean},
	template: _VUE_COMPONENT_MODAL_TEMP,
	data(){
		return {str:'abf',isshow:false}
	},
	methods: {
		open() {this.isshow = !this.isshow;},
		close(){this.isshow = false;}
	}
};


const _VUE_COMPONENT_MODAL = new Vue({
	el: '#vue-component-modal',
	data:{isshow:false},
	components:{
		'component-modal': _VUE_COMPONENT_MODAL_PARTS
	},
	mounted(){
		var newelm = document.createElement('style');
		newelm.innerHTML = _VUE_COMPONENT_MODAL_STYLE;
		document.getElementById('set_style').appendChild(newelm);
	},
	methods:{
		open(){
			this.$refs.comp.open();
		}
	}
});

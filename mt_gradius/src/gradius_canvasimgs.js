//=====================================================
//	gradius_canvasimgs.js
//	画像定義
//	2017.10.12 : 新規作成
//=====================================================
'use strict';

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
		 rate:0.50,
		 obj:new Image()},
	'missile2':
		{src:'images/missile2.png',
		 rate:0.50,
		 obj:new Image()},
	'missile3':
 		{src:'images/missile3.png',
 		 rate:0.50,
 		 obj:new Image()},
	'missile4':
		{src:'images/missile4.png',
		 rate:0.50,
		 obj:new Image()},
	'missile5':
 		{src:'images/missile5.png',
 		 rate:0.50,
 		 obj:new Image()},
	'missile6':
  		{src:'images/missile6.png',
  		 rate:0.50,
  		 obj:new Image()},
	'missile7':
   		{src:'images/missile7.png',
   		 rate:0.50,
   		 obj:new Image()},
	'missile8':
   		{src:'images/missile8.png',
   		 rate:0.50,
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
	'shot_laser_col1':
		{src:'images/gradius_shot_laser_col1.png',
		 rate:0.4,
		 obj:new Image()},
	'shot_laser_col2':
		{src:'images/gradius_shot_laser_col2.png',
		rate:0.4,
		obj:new Image()},
	'shot_laser_col3':
		{src:'images/gradius_shot_laser_col3.png',
		rate:0.4,
		obj:new Image()},
	'shot_laser_col4':
		{src:'images/gradius_shot_laser_col4.png',
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

	'enemy_a_1':{src:'images/gradius_enemy_a_1.png',rate:0.55,obj:new Image()},
	'enemy_a_2':{src:'images/gradius_enemy_a_2.png',rate:0.55,obj:new Image()},
	'enemy_b_1':{src:'images/gradius_enemy_b_1.png',rate:0.55,obj:new Image()},
	'enemy_b_2':{src:'images/gradius_enemy_b_2.png',rate:0.55,obj:new Image()},

	'enemy_c_1':{src:'images/gradius_enemy_c_1.png',rate:0.4,obj:new Image()},
	'enemy_c_2':{src:'images/gradius_enemy_c_2.png',rate:0.4,obj:new Image()},
	'enemy_c_3':{src:'images/gradius_enemy_c_3.png',rate:0.4,obj:new Image()},
	'enemy_c_4':{src:'images/gradius_enemy_c_4.png',rate:0.4,obj:new Image()},

	'enemy_d_1':{src:'images/gradius_enemy_d_1.png',rate:0.2,obj:new Image()},
	'enemy_d_2':{src:'images/gradius_enemy_d_2.png',rate:0.2,obj:new Image()},
	'enemy_d_3':{src:'images/gradius_enemy_d_3.png',rate:0.2,obj:new Image()},
	'enemy_d_4':{src:'images/gradius_enemy_d_4.png',rate:0.2,obj:new Image()},

	'enemy_e_1':{src:'images/gradius_enemy_e_1.png',rate:0.2,obj:new Image()},
	'enemy_e_2':{src:'images/gradius_enemy_e_2.png',rate:0.2,obj:new Image()},
	'enemy_e_3':{src:'images/gradius_enemy_e_3.png',rate:0.2,obj:new Image()},
	'enemy_e_4':{src:'images/gradius_enemy_e_4.png',rate:0.2,obj:new Image()},

	'enemy_f_1':{src:'images/gradius_enemy_f_1.png',rate:0.4,obj:new Image()},
	'enemy_f_2':{src:'images/gradius_enemy_f_2.png',rate:0.4,obj:new Image()},
	'enemy_f_3':{src:'images/gradius_enemy_f_3.png',rate:0.4,obj:new Image()},
	'enemy_f_4':{src:'images/gradius_enemy_f_4.png',rate:0.4,obj:new Image()},

	'enemy_g_1':{src:'images/gradius_enemy_g_1.png',rate:0.4,obj:new Image()},
	'enemy_g_2':{src:'images/gradius_enemy_g_2.png',rate:0.4,obj:new Image()},
	'enemy_g_3':{src:'images/gradius_enemy_g_3.png',rate:0.4,obj:new Image()},
	'enemy_g_4':{src:'images/gradius_enemy_g_4.png',rate:0.4,obj:new Image()},

	'enemy_m_1':{src:'images/gradius_enemy_m_1.png',rate:0.24,obj:new Image()},
	'enemy_m_2':{src:'images/gradius_enemy_m_2.png',rate:0.24,obj:new Image()},
	'enemy_m_3':{src:'images/gradius_enemy_m_3.png',rate:0.24,obj:new Image()},
	'enemy_m_4':{src:'images/gradius_enemy_m_4.png',rate:0.24,obj:new Image()},
	'enemy_m_5':{src:'images/gradius_enemy_m_5.png',rate:0.24,obj:new Image()},
	'enemy_m_6':{src:'images/gradius_enemy_m_6.png',rate:0.24,obj:new Image()},
	'enemy_m_7':{src:'images/gradius_enemy_m_7.png',rate:0.24,obj:new Image()},
	'enemy_m_8':{src:'images/gradius_enemy_m_8.png',rate:0.24,obj:new Image()},

	'enemy_m_11':{src:'images/gradius_enemy_m_11.png',rate:0.22,obj:new Image()},
	'enemy_m_12':{src:'images/gradius_enemy_m_12.png',rate:0.22,obj:new Image()},
	'enemy_m_13':{src:'images/gradius_enemy_m_13.png',rate:0.22,obj:new Image()},
	'enemy_m_14':{src:'images/gradius_enemy_m_14.png',rate:0.22,obj:new Image()},
	'enemy_m_15':{src:'images/gradius_enemy_m_15.png',rate:0.22,obj:new Image()},
	'enemy_m_16':{src:'images/gradius_enemy_m_16.png',rate:0.22,obj:new Image()},
	'enemy_m_17':{src:'images/gradius_enemy_m_17.png',rate:0.22,obj:new Image()},
	
	'enemy_o_1':{src:'images/gradius_enemy_o_1.png',rate:0.3,obj:new Image()},
	'enemy_o_2':{src:'images/gradius_enemy_o_2.png',rate:0.3,obj:new Image()},

	'enemy_p_1':{src:'images/gradius_enemy_p_1.png',rate:0.23,obj:new Image()},
	'enemy_p_2':{src:'images/gradius_enemy_p_2.png',rate:0.30,obj:new Image()},
	'enemy_p_3':{src:'images/gradius_enemy_p_3.png',rate:0.30,obj:new Image()},
	'enemy_p_4':{src:'images/gradius_enemy_p_4.png',rate:0.30,obj:new Image()},
	'enemy_p_5':{src:'images/gradius_enemy_p_5.png',rate:0.30,obj:new Image()},

	'enemy_m_a_1':{src:'images/gradius_enemy_m_a_1.png',rate:0.25,obj:new Image()},
	'enemy_m_a_2':{src:'images/gradius_enemy_m_a_2.png',rate:0.25,obj:new Image()},
	'enemy_m_b_1':{src:'images/gradius_enemy_m_b_1.png',rate:0.25,obj:new Image()},
	'enemy_m_b_2':{src:'images/gradius_enemy_m_b_2.png',rate:0.25,obj:new Image()},
	'enemy_m_z':{src:'images/gradius_enemy_m_z.png',rate:0.25,obj:new Image()},

	'enemy_m_y_1':{src:'images/gradius_enemy_m_y_1.png',rate:0.5,obj:new Image()},
	'enemy_m_y_2':{src:'images/gradius_enemy_m_y_2.png',rate:0.5,obj:new Image()},

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

	'enemy_collapes21':
  		{src:'images/gradius_enemy_collapes21.png',rate:0.22,obj:new Image()},
	'enemy_collapes22':
  		{src:'images/gradius_enemy_collapes22.png',rate:0.22,obj:new Image()},
	'enemy_collapes23':
  		{src:'images/gradius_enemy_collapes23.png',rate:0.22,obj:new Image()},
	'enemy_collapes24':
  		{src:'images/gradius_enemy_collapes24.png',rate:0.22,obj:new Image()},

	'enemy_collapes81':
  		{src:'images/gradius_enemy_collapes81.png',rate:0.2,obj:new Image()},
	'enemy_collapes82':
  		{src:'images/gradius_enemy_collapes82.png',rate:0.2,obj:new Image()},
	'enemy_collapes83':
  		{src:'images/gradius_enemy_collapes83.png',rate:0.2,obj:new Image()},
	'enemy_collapes84':
  		{src:'images/gradius_enemy_collapes84.png',rate:0.2,obj:new Image()},


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
	'map_c_A':
  		{src:'images/gradius_map_c_A.png',rate:1,obj:new Image()},

	'map_m_A':
		{src:'images/gradius_map_m_A.png',rate:0.5,obj:new Image()},
	'map_m_B':
		{src:'images/gradius_map_m_B.png',rate:0.5,obj:new Image()},

	'map_f_A':
  		{src:'images/gradius_map_f_A.png',rate:1,obj:new Image()},
	'map_f_B':
  		{src:'images/gradius_map_f_B.png',rate:1,obj:new Image()},
	'map_f_C':
  		{src:'images/gradius_map_f_C.png',rate:1,obj:new Image()},
	'map_f_D':
  		{src:'images/gradius_map_f_D.png',rate:1,obj:new Image()},
	'map_f_E':
  		{src:'images/gradius_map_f_E.png',rate:1,obj:new Image()},
	'map_f_F':
		{src:'images/gradius_map_f_F.png',rate:1,obj:new Image()},
	'map_f_G':
		{src:'images/gradius_map_f_G.png',rate:1,obj:new Image()},
	'map_f_H':
		{src:'images/gradius_map_f_H.png',rate:1,obj:new Image()},
	'map_f_I':
		{src:'images/gradius_map_f_I.png',rate:1,obj:new Image()},
	'map_f_J':
		{src:'images/gradius_map_f_J.png',rate:1,obj:new Image()},
	'map_f_K':
		{src:'images/gradius_map_f_K.png',rate:1,obj:new Image()},
	'map_f_L':
		{src:'images/gradius_map_f_L.png',rate:1,obj:new Image()},
	'map_f_M':
		{src:'images/gradius_map_f_M.png',rate:1,obj:new Image()},
	'map_f_N':
		{src:'images/gradius_map_f_N.png',rate:1,obj:new Image()},
	'map_f_O':
		{src:'images/gradius_map_f_O.png',rate:1,obj:new Image()},
	'map_f_P':
		{src:'images/gradius_map_f_P.png',rate:1,obj:new Image()}
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
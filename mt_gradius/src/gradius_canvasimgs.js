//=====================================================
//	gradius_canvasimgs.js
//	画像定義
//	2017.10.12 : 新規作成
//=====================================================
'use strict';

const _CANVAS_IMGS={
	'vicviper':{src:'images/gradius_vicviper.png',rate:1.00,obj:new Image()},
	'vicviper_back':{src:'images/gradius_vicviper_back.png',rate:1.00,obj:new Image()},
	'vicviper_bomb':{src:'images/gradius_vicviper_bomb.png',rate:1.0,obj:new Image()},
	'vicviper_bomb_red':{src:'images/gradius_vicviper_bomb_red.png',rate:1.0,obj:new Image()},
	'option':{src:'images/option.png',rate:1.0,obj:new Image()},
	'forcefield':{src:'images/gradius_forcefield.png',rate:1.00,obj:new Image()},
	'shield':{src:'images/gradius_shield.png',rate:1.00,obj:new Image()},
 
	'gradius_missile':{src:'images/gradius_missile.png',rate:1.00,obj:new Image()},

	'shot1':{src:'images/gradius_shot1.png',rate:1.0,obj:new Image()},
	'shot2':{src:'images/gradius_shot2.png',rate:1.0,obj:new Image()},
	'shot3':{src:'images/gradius_shot3.png',rate:1.0,obj:new Image()},
	'shot_laser_col':{src:'images/gradius_shot_laser_col.png',rate:1.00,obj:new Image()},

	//パワーカプセル
	'gradius_pc':{src:'images/gradius_pc.png',rate:1.0,obj:new Image()},

	'meter':{src:'images/gradius_meter.png',rate:1.0,obj:new Image()}, 
	'meter_c':{src:'images/gradius_meter_c.png',rate:1.0,obj:new Image()}, 

	//===================================
	//以下は敵画像
	//===================================
	'enemy_fan':{src:'images/gradius_enemy_fan.png',rate:1.00,obj:new Image()},

	'enemy_a':{src:'images/gradius_enemy_a.png',rate:1.0,obj:new Image()},
	'enemy_b':{src:'images/gradius_enemy_b.png',rate:1.0,obj:new Image()},

	'enemy_c':{src:'images/gradius_enemy_c.png',rate:1.0,obj:new Image()},
	'enemy_d':{src:'images/gradius_enemy_d.png',rate:1.0,obj:new Image()},
	'enemy_e':{src:'images/gradius_enemy_e.png',rate:1.0,obj:new Image()},
	'enemy_f':{src:'images/gradius_enemy_f.png',rate:1.0,obj:new Image()},
	'enemy_g':{src:'images/gradius_enemy_g.png',rate:1.0,obj:new Image()},

	'enemy_m1':{src:'images/gradius_enemy_m1.png',rate:1.0,obj:new Image()},
	'enemy_m2':{src:'images/gradius_enemy_m2.png',rate:1.0,obj:new Image()},
	'enemy_m_group':{src:'images/gradius_enemy_m_group.png',rate:1.00,obj:new Image()},
	//火山噴火
	'enemy_o':{src:'images/gradius_enemy_o.png',rate:1.0,obj:new Image()},

	'enemy_p_1':{src:'images/gradius_enemy_p_1.png',rate:1.00,obj:new Image()},
	'enemy_p_2':{src:'images/gradius_enemy_p_2.png',rate:1.00,obj:new Image()},
	'enemy_p_3':{src:'images/gradius_enemy_p_3.png',rate:1.00,obj:new Image()},
	'enemy_p_4':{src:'images/gradius_enemy_p_4.png',rate:1.00,obj:new Image()},
	'enemy_p_5':{src:'images/gradius_enemy_p_5.png',rate:1.00,obj:new Image()},
	'enemy_p_6': {
		src: 'images/gradius_enemy_p_6.png',
		rate: 1.00,
		obj: new Image()
	},

	'enemy_moai_boss':{src:'images/gradius_enemy_moai_boss.png',rate:1.00,obj:new Image()},
	'enemy_moai_mini_boss':{src:'images/gradius_enemy_moai_mini_boss.png',rate:1.00,obj:new Image()},
	'enemy_moai_boss_ring':{src:'images/gradius_enemy_moai_boss_ring.png',rate:1.00,obj:new Image()},

	'enemy_m_a_1':{src:'images/gradius_enemy_m_a_1.png',rate:1.00,obj:new Image()},
	'enemy_m_a_2':{src:'images/gradius_enemy_m_a_2.png',rate:1.00,obj:new Image()},
	'enemy_m_b_1':{src:'images/gradius_enemy_m_b_1.png',rate:1.00,obj:new Image()},
	'enemy_m_b_2':{src:'images/gradius_enemy_m_b_2.png',rate:1.00,obj:new Image()},
	'enemy_m_z':{src:'images/gradius_enemy_m_z.png',rate:1.00,obj:new Image()},

	'enemy_moai_ring':{src:'images/gradius_enemy_moai_ring.png',rate:1.00,obj:new Image()},

	'enemy_cell_boss':{src:'images/gradius_enemy_cell_boss.png',rate:1.00,obj:new Image()},
	'enemy_cell_boss_eye':{src:'images/gradius_enemy_cell_boss_eye.png',rate:1.00,obj:new Image()},

	'enemy_cell_core':{src:'images/gradius_enemy_cell_core.png',rate:1.00,obj:new Image()},
	'enemy_cell_hand_1':{src:'images/gradius_enemy_cell_hand_1.png',rate:1.00,obj:new Image()},
	'enemy_cell_hand_2':{src:'images/gradius_enemy_cell_hand_2.png',rate:1.00,obj:new Image()},
	'enemy_cell_hand_3':{src:'images/gradius_enemy_cell_hand_3.png',rate:1.00,obj:new Image()},

	'enemy_cell_a':{src:'images/gradius_enemy_cell_a.png',rate:1.00,obj:new Image()},
	'enemy_cell_b':{src:'images/gradius_enemy_cell_b.png',rate:1.00,obj:new Image()},

	'enemy_frame_large':{src:'images/gradius_enemy_frame_large.png',rate:1.00,obj:new Image()},
	'enemy_frame_small':{src:'images/gradius_enemy_frame_small.png',rate:1.00,obj:new Image()},
	'enemy_frame_mini':{src:'images/gradius_enemy_frame_mini.png',rate:1.00,obj:new Image()},

	'enemy_frame_head1':{src:'images/gradius_enemy_frame_head_1.png',rate:1.00,obj:new Image()},
	'enemy_frame_head2':{src:'images/gradius_enemy_frame_head_2.png',rate:1.00,obj:new Image()},
	'enemy_frame_head3':{src:'images/gradius_enemy_frame_head_3.png',rate:1.00,obj:new Image()},
	'enemy_frame_head4':{src:'images/gradius_enemy_frame_head_4.png',rate:1.00,obj:new Image()},
	'enemy_frame_body1':{src:'images/gradius_enemy_frame_body_1.png',rate:1.00,obj:new Image()},

	'enemy_bigcore':{src:'images/gradius_enemy_bigcore.png',rate:1.00,obj:new Image()},
	'enemy_bigcore_1':{src:'images/gradius_enemy_bigcore_1.png',rate:1.00,obj:new Image()},
	'enemy_bigcore_2':{src:'images/gradius_enemy_bigcore_2.png',rate:1.00,obj:new Image()},
	'enemy_bigcore_core':{src:'images/gradius_enemy_bigcore_core.png',rate:1.00,obj:new Image()},

	'enemy_cristalcore':{src:'images/gradius_enemy_cristalcore.png',rate:1.0,obj:new Image()},
	'enemy_cristalcore_hand1':{src:'images/gradius_enemy_cristalcore_hand1.png',rate:0.30,obj:new Image()},
	'enemy_cristalcore_hand2':{src:'images/gradius_enemy_cristalcore_hand2.png',rate:0.40,obj:new Image()},
	'enemy_cristalcore_wall1':{src:'images/gradius_enemy_cristalcore_wall1.png',rate:1.00,obj:new Image()},
	'enemy_cristalcore_wall2':{src:'images/gradius_enemy_cristalcore_wall2.png',rate:1.00,obj:new Image()},
	'enemy_cristalcore_shot':{src:'images/gradius_enemy_cristalcore_shot.png',rate:1.00,obj:new Image()},

	'enemy_cube':{src:'images/gradius_enemy_cube.png',rate:1.00,obj:new Image()},

	'enemy_bigcore2':{src:'images/gradius_enemy_bigcore2.png',rate:1.0,obj:new Image()},
	'enemy_bigcore2_hand':{src:'images/gradius_enemy_bigcore2_hand.png',rate:1.00,obj:new Image()},
	'enemy_bigcore2_wall':{src:'images/gradius_enemy_bigcore2_wall.png',rate:1.00,obj:new Image()},
	'enemy_bigcore2_core':{src:'images/gradius_enemy_bigcore2_core.png',rate:1.00,obj:new Image()},
	'enemy_bigcore2_back':{src:'images/gradius_enemy_bigcore2_back.png',rate:1.00,obj:new Image()},

	'enemy_death':{src:'images/gradius_enemy_death.png',rate:1.0,obj:new Image()},
	'enemy_death_front':{src:'images/gradius_enemy_death_front.png',rate:1.0,obj:new Image()},
	'enemy_death_shot':{src:'images/gradius_enemy_death_shot.png',rate:1.0,obj:new Image()},
	'enemy_death_shot2':{src:'images/gradius_enemy_death_shot2.png',rate:1.0,obj:new Image()},

	'enemy_boss_aian':{src:'images/gradius_enemy_boss_aian.png',rate:1.0,obj:new Image()},

	//===================================
	//以下は敵の衝突用画像
	//===================================
	'enemy_collapes0':{src:'images/gradius_enemy_collapes0.png',rate:1.0,obj:new Image()},
	'enemy_collapes1':{src:'images/gradius_enemy_collapes1.png',rate:1.0,obj:new Image()},
	'enemy_collapes2':{src:'images/gradius_enemy_collapes2.png',rate:1.0,obj:new Image()},
	'enemy_collapes3':{src:'images/gradius_enemy_collapes3.png',rate:1.0,obj:new Image()},
	'enemy_collapes8':{src:'images/gradius_enemy_collapes8.png',rate:1.0,obj:new Image()},
	'enemy_collapes9':{src:'images/gradius_enemy_collapes9.png',rate:1.0,obj:new Image()},

	//===================================
	//以下は敵のショット画像
	//===================================
	'enemy_bullet':{src:'images/gradius_enemy_bullet.png',rate:1.0,obj:new Image()},
	'enemy_bullet_cell':{src:'images/gradius_enemy_bullet_cell.png',rate:1.0,obj:new Image()},
	'enemy_bullet_z':{src:'images/gradius_enemy_bullet_z.png',rate:1.0,obj:new Image()},
	'enemy_bullet_laser':{src:'images/gradius_enemy_bullet_laser.png',rate:1.0,obj:new Image()},

  	//===================================
	//以下はマップ画像
	//===================================
 	//cubeステージ用
	'map_cube_A':{src:'images/gradius_map_cube_A.png',rate:1,obj:new Image()},
	//クリスタルステージ用
	'map_cristal_up': {
		src: 'images/gradius_map_cristal_up.png',
		rate: 1.00,
		obj: new Image()
	},
	'map_cristal_down': {
		src: 'images/gradius_map_cristal_down.png',
		rate: 1.00,
		obj: new Image()
	},
	//モアイステージ用画像
	'map_moai_A':{src:'images/gradius_map_moai_A.png',rate:1.00,obj:new Image()},
	'map_moai_B':{src:'images/gradius_map_moai_B.png',rate:1.00,obj:new Image()},
	//火山ステージ用画像
	'map_volcano_A':{src:'images/gradius_map_volcano_A.png',rate:1,obj:new Image()},
	'map_volcano_B':{src:'images/gradius_map_volcano_B.png',rate:1,obj:new Image()},
	'map_volcano_C':{src:'images/gradius_map_volcano_C.png',rate:1,obj:new Image()},
	'map_volcano_D':{src:'images/gradius_map_volcano_D.png',rate:1,obj:new Image()},
	'map_volcano_E':{src:'images/gradius_map_volcano_E.png',rate:1,obj:new Image()},
	'map_volcano_F':{src:'images/gradius_map_volcano_F.png',rate:1,obj:new Image()},
	'map_volcano_G':{src:'images/gradius_map_volcano_G.png',rate:1,obj:new Image()},
	'map_volcano_H':{src:'images/gradius_map_volcano_H.png',rate:1,obj:new Image()},
	'map_volcano_I':{src:'images/gradius_map_volcano_I.png',rate:1,obj:new Image()},
	'map_volcano_J':{src:'images/gradius_map_volcano_J.png',rate:1,obj:new Image()},
	'map_volcano_K':{src:'images/gradius_map_volcano_K.png',rate:1,obj:new Image()},
	'map_volcano_L':{src:'images/gradius_map_volcano_L.png',rate:1,obj:new Image()},
	'map_volcano_M':{src:'images/gradius_map_volcano_M.png',rate:1,obj:new Image()},
	'map_volcano_N':{src:'images/gradius_map_volcano_N.png',rate:1,obj:new Image()},
	'map_volcano_O':{src:'images/gradius_map_volcano_O.png',rate:1,obj:new Image()},
	'map_volcano_P':{src:'images/gradius_map_volcano_P.png',rate:1,obj:new Image()},
	//炎ステージ
	'map_frame_A':{src:'images/gradius_map_frame_A.png',rate:1.00,obj:new Image()},
	'map_frame_B':{src:'images/gradius_map_frame_B.png',rate:1.00,obj:new Image()},
	'map_frame_C':{src:'images/gradius_map_frame_C.png',rate:1.00,obj:new Image()},
	'map_frame_D':{src:'images/gradius_map_frame_D.png',rate:1.00,obj:new Image()},
	'map_frame_E':{src:'images/gradius_map_frame_E.png',rate:1.00,obj:new Image()},
	'map_frame_F':{src:'images/gradius_map_frame_F.png',rate:1.00,obj:new Image()},
	//細胞ステージ
	'map_cell_A':{src:'images/gradius_map_cell_A.png',rate:1.00,obj:new Image()},
	'map_cell_B':{src:'images/gradius_map_cell_B.png',rate:1.00,obj:new Image()},
	'map_cell_C':{src:'images/gradius_map_cell_C.png',rate:1.00,obj:new Image()},
	'map_cell_D':{src:'images/gradius_map_cell_D.png',rate:1.00,obj:new Image()},
	'map_cell_V':{src:'images/gradius_map_cell_V.png',rate:1.00,obj:new Image()},
	'map_cell_W':{src:'images/gradius_map_cell_W.png',rate:1.00,obj:new Image()},
	'map_cell_Y':{src:'images/gradius_map_cell_Y.png',rate:1.00,obj:new Image()},
	'map_cell_Z':{src:'images/gradius_map_cell_Z.png',rate:1.00,obj:new Image()},
	'map_cell_wall':{src:'images/gradius_map_cell_wall.png',rate:1.00,obj:new Image()},

};

const _CANVAS_IMGS_INIT={
	//BACKGROUND
	'gradius_background':{src:'images/gradius_background.jpg',rate:1.00,obj:new Image()},

	//LOGO
	'gradius_logo':{src:'images/gradius_logo.png',rate:1.00,obj:new Image()},

	//FONT
	'font':{src:'images/gradius_font.png',rate:1.00,obj:new Image()},

	//POWER METER SELECT
	'gradius_powermeterselect':
  		{src:'images/gradius_powermeterselect.png',rate:1.00,obj:new Image()},
	'gradius_powermeterselect_selected':
  		{src:'images/gradius_powermeterselect_selected.png',rate:1.00,obj:new Image()},

	'gradius_powermeterselect_shield':
  		{src:'images/gradius_powermeterselect_shield.png',rate:1.00,obj:new Image()},
	'gradius_powermeterselect_shield_selected':
  		{src:'images/gradius_powermeterselect_shield_selected.png',rate:1.00,obj:new Image()},

};


const _CANVAS_AUDIOS={
	'shot_laser':
		{src:'audios/shot_laser.mp3',
		 volume:1.0,
		 obj:null,
		 buf:new Object()},
	'missile':
		 {src:'audios/missile.mp3',
		 volume:1.0,
		 obj:null,
		 buf:new Object()},
	'shot_normal':
		{src:'audios/shot_normal.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'shot_ripple':
		{src:'audios/shot_ripple.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},

	'vicviper_bomb':
		{src:'audios/vicviper_bomb.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'vicviper_shield_reduce':
		{src:'audios/vicviper_shield_reduce.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},


	'pc':
		{src:'audios/pc.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'playerset':
		{src:'audios/playerset.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},

	'pms_select':
		{src:'audios/pms_select.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},


	'enemy_bullet_laser':
		{src:'audios/enemy_bullet_laser.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'enemy_bullet_laser_long':
		{src:'audios/enemy_bullet_laser_long.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},

	'enemy_collision1':
		{src:'audios/enemy_collision1.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'enemy_collision2':
		{src:'audios/enemy_collision2.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'enemy_collision3':
		{src:'audios/enemy_collision3.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'enemy_collision4':
		{src:'audios/enemy_collision4.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'enemy_collision5':
		{src:'audios/enemy_collision5.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'enemy_collision6':
		{src:'audios/enemy_collision6.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'enemy_collision7':
		{src:'audios/enemy_collision7.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'enemy_collision8':
		{src:'audios/enemy_collision8.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},

	'enemy_all_out':
		{src:'audios/enemy_all_out.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'enemy_cube':
		{src:'audios/enemy_cube.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},

	'map_cell_wall':
		{src:'audios/map_cell_wall.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},

	'bg_powermeterselect':
		{src:'audios/bg_powermeterselect.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'bg_boss':
		{src:'audios/bg_boss.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},

	'bg_type1':
		{src:'audios/bg_moai.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'bg_type2':
		{src:'audios/bg_volcano.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'bg_type3':
		{src:'audios/bg_crystal.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'bg_type4':
		{src:'audios/bg_frame.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'bg_type5':
		{src:'audios/bg_thunderbolt.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()},
	'bg_type6':
		{src:'audios/bg_cell.mp3',
		volume:1.0,
		obj:null,
		buf:new Object()}

};
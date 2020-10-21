#include "command.h"
#include "notif.h"

/* set up stack frame */
addiu   $sp, $sp, -0x0040
sw      $ra, 0x0030($sp)
sw      $s0, 0x0034($sp)
sw      $s1, 0x0038($sp)
sw      $a0, 0x0040($sp)

/* process commands */
move    $s0, $zero
la      $s1, command_buf
cmd_loop_head:
lw      $v0, 0x0000($s1)
lw      $v1, 0x0004($s1)

/* check command type */
li      $t0, COMMAND_SPAWN_ACTOR
beq     $v0, $t0, cmd_spawn_actor
li      $t0, COMMAND_UPDATE_BUTTON
beq     $v0, $t0, cmd_update_button
li      $t0, COMMAND_PLAY_SOUND
beq     $v0, $t0, cmd_play_sound
li      $t0, COMMAND_LOAD_OBJECT
beq     $v0, $t0, cmd_load_object
li      $t0, COMMAND_WARP
beq     $v0, $t0, cmd_warp
li      $t0, COMMAND_PLAY_MUSIC
beq     $v0, $t0, cmd_play_music
li      $t0, COMMAND_RELOCATE
beq     $v0, $t0, cmd_relocate
li      $t0, COMMAND_INIT_ACTOR
beq     $v0, $t0, cmd_init_actor
b       cmd_loop_latch

/* spawn actor */
cmd_spawn_actor:
la      $t0, notif_ctxt
li      $t1, NOTIF_CTXT_NONOTIF
sw      $t1, 0x0000($t0) /* disable notifications */
lw      $a2, 0x0040($sp)
addiu   $a0, $a2, 0x1C24
move    $a1, $v1
jal     z64_SpawnActorIndirect
sw      $v0, 0x0004($s1)
la      $t0, notif_ctxt
sw      $zero, 0x0000($t0) /* enable notifications */
b       cmd_loop_latch

/* update button */
cmd_update_button:
lw      $a0, 0x0040($sp)
move    $a1, $v1
jal     z64_UpdateButtonIcon
sw      $zero, 0x0004($s1)
b       cmd_loop_latch

/* play sound */
cmd_play_sound:
addiu   $a1, $sp, 0x0020
addiu   $a3, $sp, 0x0024
li      $t0, 0x3F800000
sw      $zero, 0x0000($a1)
sw      $t0, 0x0000($a3)
sw      $a3, 0x0010($sp)
sw      $a1, 0x0014($sp)
li      $a2, 0x04
lw      $a0, 0x0004($s1)
jal     z64_PlaySound
sw      $zero, 0x0004($s1)
b       cmd_loop_latch

/* load object */
cmd_load_object:
la      $t0, z64_obj_ctxt
la      $t1, z64_object_table
/* check that the object is not loaded already, or marked for loading */
subu    $t2, $zero, $v1
li      $t3, 0x0000
lbu     $t4, 0x0008($t0)
addiu   $t5, $t0, 0x000C
0:
  beq     $t3, $t4, 0f
  lh      $t6, 0x0000($t5)
  beq     $t6, $v1, 1f
  beq     $t6, $t2, 1f
  addiu   $t3, $t3, 0x0001
  addiu   $t5, $t5, 0x0044
  b       0b
0:
/* look up the object size */
sll     $t6, $v1, 0x0003
addu    $t6, $t1, $t6
lw      $t7, 0x0000($t6)
lw      $t8, 0x0004($t6)
subu    $t6, $t8, $t7
/* mark object for loading */
sh      $t2, 0x0000($t5)
sw      $zero, 0x0008($t5)
lw      $t3, 0x0004($t5)
addu    $t3, $t3, $t6
sw      $t3, 0x0048($t5)
/* increment object count */
addiu   $t4, $t4, 0x0001
sb      $t4, 0x0008($t0)
1:
b       cmd_loop_latch

/* warp */
cmd_warp:
la      $t0, z64_ctxt
la      $t1, z64_file
la      $t2, z64_state_ovl_tab
sra     $t3, $v1, 0x0010
andi    $t4, $v1, 0xFFFF
sw      $t3, 0x0000($t1)
sh      $t4, 0x000A($t1)
lw      $t3, (0x0030 * 3 + 0x0018)($t2)
lw      $t4, (0x0030 * 3 + 0x002C)($t2)
sw      $t3, 0x000C($t0)
sw      $t4, 0x0010($t0)
sw      $zero, 0x0098($t0)
b       cmd_loop_latch

/* play music sequence on sequencer 0 */
cmd_play_music:
la      $t0, z64_afx_cmd_write_pos
la      $t1, z64_afx_cmd_buf
lbu     $t2, 0x0000($t0)
sll     $t3, $t2, 0x0003
addu    $t3, $t1, $t3
li      $t4, 0x82000000
andi    $t5, $v1, 0x00FF
sll     $t5, $t5, 0x0008
or      $t4, $t4, $t5
sw      $t4, 0x0000($t3)
sw      $zero, 0x0004($t3)
addiu   $t2, $t2, 0x0001
sb      $t2, 0x0000($t0)
b       cmd_loop_latch

cmd_relocate:
lw      $a0, 0x0000($v1)
lw      $a1, 0x0004($v1)
lw      $a2, 0x0008($v1)
jal     z64_DoRelocation
b       cmd_loop_latch

/* init actor */
cmd_init_actor:
lw      $a0, 0x0000($v1)
lw      $a1, 0x0004($v1)
jal     z64_InitActor
sw      $v0, 0x0004($s1)
b       cmd_loop_latch

/* loop */
cmd_loop_latch:
li      $t0, COMMAND_BUF_LENGTH
sw      $zero, 0x0000($s1)
addiu   $s0, $s0, 0x0001
addiu   $s1, $s1, 0x0008
bne     $s0, $t0, cmd_loop_head

/* execute context main */
lw      $a0, 0x0040($sp)
lw      $t9, 0x0004($a0)
jalr    $t9

/* return */
lw      $ra, 0x0030($sp)
lw      $s0, 0x0034($sp)
lw      $s1, 0x0038($sp)
addiu   $sp, $sp, 0x0040
jr      $ra

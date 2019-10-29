.include  "z64defs.inc"
.include  "notif.inc"

.section  .text

.ent      tnsn_actor_func
.type     tnsn_actor_func, @function
tnsn_actor_func:

/* set up stack frame */
addiu     $sp, $sp, -0x0038
sw        $ra, 0x0034($sp)
sw        $a2, 0x0040($sp)

/* disable regular actor spawn notifications */
la        $t0, notif_ctxt
la        $t1, NOTIF_CTXT_NONOTIF
sw        $t1, 0x0000($t0)

/* forward arguments to z64_SpawnActor */
lw        $t0, 0x0048($sp)
lw        $t1, 0x004C($sp)
lw        $t2, 0x0050($sp)
lw        $t3, 0x0054($sp)
lw        $t4, 0x0058($sp)
lw        $t5, 0x005C($sp)
lw        $t6, 0x0060($sp)
lw        $t7, 0x0064($sp)
lw        $t8, 0x0068($sp)
sw        $t0, 0x0010($sp)
sw        $t1, 0x0014($sp)
sw        $t2, 0x0018($sp)
sw        $t3, 0x001C($sp)
sw        $t4, 0x0020($sp)
sw        $t5, 0x0024($sp)
sw        $t6, 0x0028($sp)
sw        $t7, 0x002C($sp)
sw        $t8, 0x0030($sp)
jal       z64_SpawnActor
/* notify even on failure i guess, don't bother checking */

/* enable regular actor spawn notifications */
la        $t0, notif_ctxt
sw        $zero, 0x0000($t0)

/* look up vrom address of transition actor table entry */
la        $t0, z64_scene_table
la        $t1, z64_scene_index
la        $t2, z64_scene_ptr
lhu       $t1, 0x0000($t1)
lw        $t2, 0x0000($t2)
sll       $t3, $t1, 0x0002  /* } */
addu      $t3, $t3, $t1     /* } */
sll       $t3, $t3, 0x0002  /* } multiply by 0x0014 */
addu      $t0, $t0, $t3
lw        $t0, 0x0000($t0)
/* the calling function keeps the table entry pointer in $s0 */
/* bit of a hack relying on this but whatever, it works */
subu      $t7, $s0, $t2
addu      $t7, $t7, $t0

/* compute notification address */
la        $t0, notif_pos
la        $t1, notif_buf
lbu       $t2, 0x0000($t0)
sll       $t3, $t2, 0x0004 /* multiply by 0x0010 */
addu      $t1, $t1, $t3

/* increment notification pos */
addiu     $t2, $t2, 0x0001
sb        $t2, 0x0000($t0)

/* set notification */
la        $t0, NOTIF_TNSN_ACTOR
lw        $t2, 0x0040($sp)
lw        $t3, 0x005C($sp)
sw        $v0, 0x0004($t1)
sw        $t7, 0x0008($t1)
sh        $t2, 0x000C($t1)
sh        $t3, 0x000E($t1)
sw        $t0, 0x0000($t1)

/* return */
lw        $ra, 0x0034($sp)
addiu     $sp, $sp, 0x0038
jr        $ra

.end      tnsn_actor_func

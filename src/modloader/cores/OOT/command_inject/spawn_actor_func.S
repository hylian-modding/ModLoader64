.include  "z64defs.inc"
.include  "notif.inc"

.section  .text

.ent      spawn_actor_func
.type     spawn_actor_func, @function
spawn_actor_func:

/* set up stack frame */
addiu     $sp, $sp, -0x0030
sw        $t9, 0x0028($sp)
move      $t9, $ra
sw        $a2, 0x0038($sp)

/* forward arguments to z64_SpawnActor */
lw        $t0, 0x0040($sp)
lw        $t1, 0x0044($sp)
lw        $t2, 0x0048($sp)
lw        $t3, 0x004C($sp)
lw        $t4, 0x0050($sp)
lw        $t5, 0x0054($sp)
sw        $t0, 0x0010($sp)
sw        $t1, 0x0014($sp)
sw        $t2, 0x0018($sp)
sw        $t3, 0x001C($sp)
sw        $t4, 0x0020($sp)
sw        $t5, 0x0024($sp)
/* continue hooked function */
addiu     $sp, $sp, -0x0058 /* } */
sw        $a2, 0x0060($sp)  /* } */
sll       $a2, $a2, 0x10    /* } copy of overwritten function prologue */
jalr      $t9

/* check if notifications are enabled */
la        $t0, notif_ctxt
lw        $t0, 0x0000($t0)
la        $t1, NOTIF_CTXT_NONOTIF
beq       $t0, $t1, no_notif

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
la        $t0, NOTIF_SPAWN_ACTOR
la        $t2, notif_ctxt
lw        $t2, 0x0000($t2)
lw        $t3, 0x0038($sp)
lw        $t4, 0x0054($sp)
sw        $v0, 0x0004($t1)
sw        $t2, 0x0008($t1)
sh        $t3, 0x000C($t1)
sh        $t4, 0x000E($t1)
sw        $t0, 0x0000($t1)

no_notif:

/* return */
lw        $ra, 0x0028($sp)
addiu     $sp, $sp, 0x0030
jr        $ra

.end      spawn_actor_func

.include  "z64defs.inc"
.include  "notif.inc"

.section  .text

.ent      actor_ctor_func
.type     actor_ctor_func, @function
actor_ctor_func:

/* set up stack frame */
addiu     $sp, $sp, -0x0018
sw        $ra, 0x0010($sp)

/* save and update notification context */
la        $t0, notif_ctxt
lw        $t1, 0x0000($t0)
sw        $a0, 0x0000($t0)
sw        $t1, 0x0014($sp)
/* forward function call */
jalr      $t9
/* restore notification context */
la        $t0, notif_ctxt
lw        $t1, 0x0014($sp)
sw        $t1, 0x0000($t0)

/* return */
lw        $ra, 0x0010($sp)
addiu     $sp, $sp, 0x0018
jr        $ra

.end      actor_ctor_func

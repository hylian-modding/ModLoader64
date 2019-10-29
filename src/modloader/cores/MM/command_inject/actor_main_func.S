.include  "z64defs.inc"
.include  "notif.inc"

.section  .text

.ent      actor_main_func
.type     actor_main_func, @function
actor_main_func:

/* set up stack frame */
addiu     $sp, $sp, -0x0018
sw        $ra, 0x0010($sp)

/* set notification context */
la        $t0, notif_ctxt
sw        $a0, 0x0000($t0)

/* call actor update function, forward arguments */
jalr      $t9

/* restore notification context */
la        $t0, notif_ctxt
sw        $zero, 0x0000($t0)

/* return */
lw        $ra, 0x0010($sp)
addiu     $sp, $sp, 0x0018
jr        $ra

.end      actor_main_func

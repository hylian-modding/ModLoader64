.set      spawn_actor_func, SPAWN_ACTOR_FUNC_ADDR

.section  .text

.ent      spawn_actor_hook
.type     spawn_actor_hook, @function
spawn_actor_hook:

/* jump to hook function */
.set      noreorder
move      $t8, $ra
la        $t9, spawn_actor_func
jalr      $t9
nop

.end      spawn_actor_hook

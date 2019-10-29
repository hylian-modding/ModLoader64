.set      spawn_actor_func, SPAWN_ACTOR_FUNC_ADDR

.section  .text

.ent      spawn_actor_hook
.type     spawn_actor_hook, @function
spawn_actor_hook:

/* jump to hook function */
.set      noreorder
move      $t9, $ra
jal       spawn_actor_func
nop

.end      spawn_actor_hook

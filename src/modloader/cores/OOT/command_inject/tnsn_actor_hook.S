.set      tnsn_actor_func, TNSN_ACTOR_FUNC_ADDR

.section  .text

.ent      tnsn_actor_hook
.type     tnsn_actor_hook, @function
tnsn_actor_hook:

/* call hook function */
.set      noreorder
jal       tnsn_actor_func

.end      tnsn_actor_hook

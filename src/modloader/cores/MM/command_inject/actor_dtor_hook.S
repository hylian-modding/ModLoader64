.set      actor_dtor_func, ACTOR_DTOR_FUNC_ADDR

.section  .text

.ent      actor_dtor_hook
.type     actor_dtor_hook, @function
actor_dtor_hook:

/* call hook function */
.set      noreorder
jal       actor_dtor_func

.end      actor_dtor_hook

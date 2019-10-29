.set      actor_ctor_func, ACTOR_CTOR_FUNC_ADDR

.section  .text

.ent      actor_ctor_hook
.type     actor_ctor_hook, @function
actor_ctor_hook:

/* call hook function */
.set      noreorder
jal       actor_ctor_func

.end      actor_ctor_hook

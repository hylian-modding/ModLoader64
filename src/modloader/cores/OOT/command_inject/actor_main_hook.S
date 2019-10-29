.set      actor_main_func, ACTOR_MAIN_FUNC_ADDR

.section  .text

.ent      actor_main_hook
.type     actor_main_hook, @function
actor_main_hook:

/* call hook function */
.set      noreorder
jal       actor_main_func

.end      actor_main_hook

.set      room_actor_func, ROOM_ACTOR_FUNC_ADDR

.section  .text

.ent      room_actor_hook
.type     room_actor_hook, @function
room_actor_hook:

/* call hook function */
.set      noreorder
jal       room_actor_func

.end      room_actor_hook

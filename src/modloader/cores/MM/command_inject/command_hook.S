.set      command_func, COMMAND_FUNC_ADDR

.section  .text

.ent      command_hook
.type     command_hook, @function
command_hook:

/* call hook function */
.set      noreorder
jal       command_func

.end      command_hook

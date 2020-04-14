.set    noreorder

/* jump to hook function */
move    $t9, $ra
jal     spawn_actor_func
nop

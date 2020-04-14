#include "z64.h"

.set    noreorder

#if Z64_VERSION == Z64_OOTDEBUG
move    $t0, $ra
move    $ra, $t9
move    $t9, $t0
#endif
/* compare source actor against player actor */
la      $t0, z64_ctxt
lw      $t0, 0x1C44($t0) /* z64_game.actor_list[2].first (player) */
bne     $t0, $a0, 1f
lui     $t0, 0x8060
/* compare sfx id against voice bank */
andi    $t1, $a1, 0xFF00
ori     $t2, $zero, 0x6800
bnel    $t2, $t1, 0f
ori     $t2, $zero, 0x1800
/* voice bank; store id to 0x80600088 if not occupied */
lhu     $t1, 0x0088($t0)
beql    $zero, $t1, 1f
sh      $a1, 0x0088($t0)
beq     $zero, $zero, 1f
nop
0:
/* not voice bank; compare against item bank */
bne     $t2, $t1, 1f
lhu     $t1, 0x008A($t0)
/* item bank; store id to 0x8060008A if not occupied */
beql    $zero, $t1, 1f
sh      $a1, 0x008A($t0)
1:
#if Z64_VERSION == Z64_OOT10
jr      $ra
#elif Z64_VERSION == Z64_OOTDEBUG
sw      $a1, 0x0024($sp)
jr      $t9
#endif
move    $a1, $a0

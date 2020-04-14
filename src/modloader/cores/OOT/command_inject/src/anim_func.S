#include "z64.h"

.set    noreorder

ori     $t1, $t1, 0x0000
ori     $t2, $zero, 0x0010
0:
  ld      $t3, 0x0000($t0)
  sd      $t3, 0x0000($t1)
  addiu   $t0, $t0, 0x0008
  addiu   $t1, $t1, 0x0008
  bnezl   $t2, 0b
  addiu   $t2, $t2, -0x0001
jr      $ra
#if Z64_VERSION == Z64_OOT10
addiu   $sp, $sp, 0x0078
#elif Z64_VERSION == Z64_OOTDEBUG
addiu   $sp, $sp, 0x0080
#endif

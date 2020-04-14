#include "z64.h"

.set    noreorder

#if Z64_VERSION == Z64_OOT10
jal     sfx_func
sw      $a1, 0x0024($sp)
#elif Z64_VERSION == Z64_OOTDEBUG
move    $t9, $ra
jal     sfx_func
sw      $a0, 0x0020($sp)
#endif

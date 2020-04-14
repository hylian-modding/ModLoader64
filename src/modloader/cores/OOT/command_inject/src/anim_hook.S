#include "z64.h"

.set    noreorder

#if Z64_VERSION == Z64_OOT10
lw      $t0, 0x0080($sp)
#elif Z64_VERSION == Z64_OOTDEBUG
lw      $t0, 0x0088($sp)
#endif
j       anim_func
lui     $t1, 0x8060

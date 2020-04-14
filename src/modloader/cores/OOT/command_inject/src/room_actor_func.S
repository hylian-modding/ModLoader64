#include "notif.h"

/* set up stack frame */
addiu   $sp, $sp, -0x0018
sw      $ra, 0x0010($sp)
sw      $a1, 0x001C($sp)

/* disable regular actor spawn notifications */
la      $t0, notif_ctxt
li      $t1, NOTIF_CTXT_NONOTIF
sw      $t1, 0x0000($t0)

/* forward arguments to z64_SpawnActorIndirect */
jal     z64_SpawnActorIndirect
/* notify even on failure i guess, do not bother checking */

/* enable regular actor spawn notifications */
la      $t0, notif_ctxt
sw      $zero, 0x0000($t0)

/* look up vrom address of room actor table entry */
la      $t0, z64_room_ctxt
la      $t1, z64_room_list
lb      $t2, 0x0000($t0)
lw      $t1, 0x0000($t1)
sll     $t2, $t2, 0x0003 /* multiply by 0x0008 */
addu    $t1, $t1, $t2
lw      $t1, 0x0000($t1)
lw      $t2, 0x000C($t0)
lw      $a1, 0x001C($sp)
subu    $t7, $a1, $t2
addu    $t7, $t7, $t1

/* compute notification address */
la      $t0, notif_pos
la      $t1, notif_buf
lbu     $t2, 0x0000($t0)
sll     $t3, $t2, 0x0004 /* multiply by 0x0010 */
addu    $t1, $t1, $t3

/* increment notification pos */
addiu   $t2, $t2, 0x0001
sb      $t2, 0x0000($t0)

/* set notification */
li      $t0, NOTIF_ROOM_ACTOR
lh      $t2, 0x0000($a1)
lh      $t3, 0x000E($a1)
sw      $v0, 0x0004($t1)
sw      $t7, 0x0008($t1)
sh      $t2, 0x000C($t1)
sh      $t3, 0x000E($t1)
sw      $t0, 0x0000($t1)

/* return */
lw      $ra, 0x0010($sp)
addiu   $sp, $sp, 0x0018
jr      $ra

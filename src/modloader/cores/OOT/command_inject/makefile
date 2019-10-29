AS                    = mips64-gcc
OBJCOPY               = mips64-objcopy
BIN2GSC               = gru bin2gsc.lua
ASMFLAGS              = -Os
CPPFLAGS              =
ACTOR_CTOR_FUNC_ADDR  = 0x80609200
ACTOR_CTOR_HOOK_ADDR  = 0x800210D0
ACTOR_DTOR_FUNC_ADDR  = 0x80609300
ACTOR_DTOR_HOOK_ADDR  = 0x80021104
ROOM_ACTOR_FUNC_ADDR  = 0x80609400
ROOM_ACTOR_HOOK_ADDR  = 0x80023DE8
ACTOR_MAIN_FUNC_ADDR  = 0x80609500
ACTOR_MAIN_HOOK_ADDR  = 0x800240D8
SPAWN_ACTOR_FUNC_ADDR = 0x80609600
SPAWN_ACTOR_HOOK_ADDR = 0x80025110
TNSN_ACTOR_FUNC_ADDR  = 0x80609700
TNSN_ACTOR_HOOK_ADDR  = 0x8002557C
COMMAND_FUNC_ADDR     = 0x80609800
COMMAND_HOOK_ADDR     = 0x800A0BF8

GSC                   = actor_ctor_hook.gsc \
                        actor_dtor_hook.gsc \
                        room_actor_hook.gsc \
                        actor_main_hook.gsc \
                        spawn_actor_hook.gsc \
                        tnsn_actor_hook.gsc \
                        command_hook.gsc \
                        actor_ctor_func.gsc \
                        actor_dtor_func.gsc \
                        room_actor_func.gsc \
                        actor_main_func.gsc \
                        spawn_actor_func.gsc \
                        tnsn_actor_func.gsc \
                        command_func.gsc

all                   : all.gsc
clean                 :
	rm -f *.o *.bin *.gsc
.PHONY                : all clean

%.o                   : %.S
	$(AS) $(CPPFLAGS) $(ASMFLAGS) -c $< -o $@
%.bin                 : %.o
	$(OBJCOPY) -j .text -j .data -O binary $< $@
%.gsc                 : %.bin
	$(BIN2GSC) $< $(GSC_ADDR) $@
all.gsc               : $(GSC)
	cat $^ > $@

actor_ctor_hook.gsc   : CPPFLAGS             += -DACTOR_CTOR_FUNC_ADDR=$(ACTOR_CTOR_FUNC_ADDR)
actor_dtor_hook.gsc   : CPPFLAGS             += -DACTOR_DTOR_FUNC_ADDR=$(ACTOR_DTOR_FUNC_ADDR)
room_actor_hook.gsc   : CPPFLAGS             += -DROOM_ACTOR_FUNC_ADDR=$(ROOM_ACTOR_FUNC_ADDR)
actor_main_hook.gsc   : CPPFLAGS             += -DACTOR_MAIN_FUNC_ADDR=$(ACTOR_MAIN_FUNC_ADDR)
spawn_actor_hook.gsc  : CPPFLAGS             += -DSPAWN_ACTOR_FUNC_ADDR=$(SPAWN_ACTOR_FUNC_ADDR)
tnsn_actor_hook.gsc   : CPPFLAGS             += -DTNSN_ACTOR_FUNC_ADDR=$(TNSN_ACTOR_FUNC_ADDR)
command_hook.gsc      : CPPFLAGS             += -DCOMMAND_FUNC_ADDR=$(COMMAND_FUNC_ADDR)

actor_ctor_func.gsc   : GSC_ADDR              = $(ACTOR_CTOR_FUNC_ADDR)
actor_ctor_hook.gsc   : GSC_ADDR              = $(ACTOR_CTOR_HOOK_ADDR)
actor_dtor_func.gsc   : GSC_ADDR              = $(ACTOR_DTOR_FUNC_ADDR)
actor_dtor_hook.gsc   : GSC_ADDR              = $(ACTOR_DTOR_HOOK_ADDR)
room_actor_func.gsc   : GSC_ADDR              = $(ROOM_ACTOR_FUNC_ADDR)
room_actor_hook.gsc   : GSC_ADDR              = $(ROOM_ACTOR_HOOK_ADDR)
actor_main_func.gsc   : GSC_ADDR              = $(ACTOR_MAIN_FUNC_ADDR)
actor_main_hook.gsc   : GSC_ADDR              = $(ACTOR_MAIN_HOOK_ADDR)
spawn_actor_func.gsc  : GSC_ADDR              = $(SPAWN_ACTOR_FUNC_ADDR)
spawn_actor_hook.gsc  : GSC_ADDR              = $(SPAWN_ACTOR_HOOK_ADDR)
tnsn_actor_func.gsc   : GSC_ADDR              = $(TNSN_ACTOR_FUNC_ADDR)
tnsn_actor_hook.gsc   : GSC_ADDR              = $(TNSN_ACTOR_HOOK_ADDR)
command_func.gsc      : GSC_ADDR              = $(COMMAND_FUNC_ADDR)
command_hook.gsc      : GSC_ADDR              = $(COMMAND_HOOK_ADDR)

CCAS                  = mips64-gcc -x assembler-with-cpp
LD                    = mips64-g++
OBJCOPY               = mips64-objcopy
NM                    = mips64-nm
ELF2GSC               = OBJCOPY='$(OBJCOPY)' NM='$(NM)' ./elf2gsc
ALL_CPPFLAGS          = -Iinclude $(CPPFLAGS)
ALL_ASMFLAGS          = -mabi=o64 -Os $(ASMFLAGS)
ALL_LDFLAGS           = -nostdlib -Llib -T elf32ebmip-bin.x $(LDFLAGS)
ALL_LDLIBS            = $(LDLIBS)
VERSIONS              = oot-1.0 oot-debug
SRCDIR                = src
OBJDIR                = obj
BINDIR                = bin
GSCDIR                = gsc

ALL                   = $(foreach v,$(VERSIONS),all-$(v).gsc)
all                   : $(ALL)
clean                 :
	rm -rf $(OBJDIR) $(BINDIR) $(GSCDIR) $(ALL)
.PHONY                : all clean

define version_template
SRCDIR-$(1)           = $$(SRCDIR)
OBJDIR-$(1)           = $$(OBJDIR)/$(1)
BINDIR-$(1)           = $$(BINDIR)/$(1)
GSCDIR-$(1)           = $$(GSCDIR)/$(1)
OUTDIR-$(1)           = $$(OBJDIR-$(1)) $$(BINDIR-$(1)) $$(GSCDIR-$(1))
ASMSRC-$(1)          := $$(wildcard $$(SRCDIR-$(1))/*.S)
ASMOBJ-$(1)           = $$(patsubst $$(SRCDIR-$(1))/%.S,$$(OBJDIR-$(1))/%.o,$$(ASMSRC-$(1)))
OBJ-$(1)              = $$(ASMOBJ-$(1))
DEPS-$(1)             = $$(patsubst %.o,%.d,$$(OBJ-$(1)))
ELF-$(1)              = $$(patsubst $$(OBJDIR-$(1))/%.o,$$(BINDIR-$(1))/%.elf,$$(OBJ-$(1)))
GSC-$(1)              = $$(patsubst $$(BINDIR-$(1))/%.elf,$$(GSCDIR-$(1))/%.gsc,$$(ELF-$(1)))
ALL-$(1)              = all-$(1).gsc
BUILD-$(1)            = $(1)
CLEAN-$(1)            = clean-$(1)
-include $$(DEPS-$(1))
$$(BUILD-$(1))        : $$(ALL-$(1))
$$(CLEAN-$(1))        :
	rm -rf $$(OUTDIR-$(1))
.PHONY                : $$(BUILD-$(1)) $$(CLEAN-$(1))
$$(ALL-$(1))          : $$(GSC-$(1))
	cat $$^ >$$@
$$(GSC-$(1))          : $$(GSCDIR-$(1))/%.gsc: $$(BINDIR-$(1))/%.elf | $$(GSCDIR-$(1))
	$$(ELF2GSC) $$< >$$@
$$(ELF-$(1))          : $$(BINDIR-$(1))/%.elf: $$(OBJDIR-$(1))/%.o | $$(BINDIR-$(1))
	$$(LD) $$(ALL_LDFLAGS) $$^ $$(ALL_LDLIBS) -Wl,--defsym,start=$$(patsubst $$(BINDIR-$(1))/%.elf,%,$$@) -o $$@
$$(ASMOBJ-$(1))       : $$(OBJDIR-$(1))/%.o: $$(SRCDIR-$(1))/%.S | $$(OBJDIR-$(1))
	$$(CCAS) -c -MMD -MP $$(ALL_CPPFLAGS) $$(ALL_ASMFLAGS) $$^ -o $$@
$$(OUTDIR-$(1))       :
	mkdir -p $$@

endef

$(foreach v,$(VERSIONS),$(eval \
  $(call version_template,$(v)) \
))

$(OBJ-oot-1.0)        : ALL_CPPFLAGS         += -DZ64_VERSION=Z64_OOT10
$(OBJ-oot-debug)      : ALL_CPPFLAGS         += -DZ64_VERSION=Z64_OOTDEBUG
$(ELF-oot-1.0)        : ALL_LDLIBS           += -loot-1.0
$(ELF-oot-debug)      : ALL_LDLIBS           += -loot-debug

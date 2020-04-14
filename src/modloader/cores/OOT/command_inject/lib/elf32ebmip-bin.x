OUTPUT_FORMAT("elf32-bigmips", "elf32-bigmips", "elf32-littlemips")
OUTPUT_ARCH(mips)
ENTRY(_start)

SECTIONS
{
  . = start ;

  .text :
  {
    PROVIDE(_start = .) ;
    *(.text .text.*)
  }
  .data :
  {
    *(.data .data.*)
  }
  .bss (NOLOAD) :
  {
    *(.bss .bss.*)
  }

  /DISCARD/ :
  {
    *(.*)
  }
}

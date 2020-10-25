import IMemory from './IMemory'

const HEAP_BLOCK_HEADER_SIZE: number = 0x20
const HEAP_BLOCK_ALIGNMENT: number = 16

function Heap_Align(lhs: number) {
    //return ((lhs + HEAP_BLOCK_ALIGNMENT - 1) & ~(HEAP_BLOCK_ALIGNMENT - 1))
    return lhs
}

interface IHeapBlock {
    free_last: number
    free_next: number
    used_last: number
    used_next: number

    used: number
    free: number
}

class HeapBlock implements IHeapBlock {
    pointer: number
    emulator: IMemory

    constructor(emulator: IMemory, pointer: number = 0) {
        this.emulator = emulator
        this.pointer = pointer
    }

    get free_last(): number {
        return this.emulator.rdramRead32(this.pointer)
    }

    get free_next(): number {
        return this.emulator.rdramRead32(this.pointer + 4)
    }

    get used_last(): number {
        return this.emulator.rdramRead32(this.pointer + 8)
    }

    get used_next(): number {
        return this.emulator.rdramRead32(this.pointer + 0xC)
    }

    get used(): number {
        return this.emulator.rdramRead32(this.pointer + 0x10)
    }

    get free(): number {
        return this.emulator.rdramRead32(this.pointer + 0x14)
    }


    set free_last(value: number) {
        this.emulator.rdramWrite32(this.pointer, value)
    }

    set free_next(value: number) {
        this.emulator.rdramWrite32(this.pointer + 4, value)
    }

    set used_last(value: number) {
        this.emulator.rdramWrite32(this.pointer + 8, value)
    }

    set used_next(value: number) {
        this.emulator.rdramWrite32(this.pointer + 0xC, value)
    }

    set used(value: number) {
        this.emulator.rdramWrite32(this.pointer + 0x10, value)
    }

    set free(value: number) {
        this.emulator.rdramWrite32(this.pointer + 0x14, value)
    }
}

export class Heap {
    free_head: number = 0
    free_tail: number = 0
    used_head: number = 0

    start: number = 0
    end: number = 0
    size: number = 0
    emulator!: IMemory

    constructor(emulator: IMemory, start: number = 0, size: number = 0) {
        let block: HeapBlock = new HeapBlock(emulator)

        this.emulator = emulator
        this.start = start
        this.size = size

        block.pointer = Heap_Align(this.start)
        size -= (block.pointer - this.start)
        size = Heap_Align(size)

        block.free_last = 0
        block.free_next = 0
        block.used_last = 0
        block.used_next = 0

        block.used = HEAP_BLOCK_HEADER_SIZE
        block.free = size - HEAP_BLOCK_HEADER_SIZE

        this.used_head = block.pointer

        if (block.free) this.free_head = block.pointer
        else this.free_head = 0
    }

    malloc(size: number): number {
        let block: HeapBlock
        let new_block: HeapBlock

        size = Heap_Align(size) + HEAP_BLOCK_HEADER_SIZE
        block = new HeapBlock(this.emulator, this.free_head)

        while (block) {
            // does block have space?
            if (block.free >= size) {
                new_block = new HeapBlock(this.emulator, block.pointer + block.used)

                new_block.used = size
                new_block.free = block.free - size

                if (new_block.free) {
                    new_block.free_last = block.pointer
                    new_block.free_next = new HeapBlock(this.emulator, block.free_next).pointer

                    if (block.free_next) new HeapBlock(this.emulator, new_block.free_next).free_last = new_block.pointer
                    block.free_next = new_block.pointer

                    if (this.free_tail == block.pointer) this.free_tail = new_block.pointer
                }
                else {
                    new_block.free_next = 0
                    new_block.free_last = 0
                }

                block.free = 0

                if (block.free_last) new HeapBlock(this.emulator, block.free_last).free_next = block.free_next
                if (block.free_next) new HeapBlock(this.emulator, block.free_next).free_last = block.free_last

                if (this.free_head == block.pointer) this.free_head = block.free_next
                if (this.free_tail == block.pointer) {
                    if (block.free_next) this.free_tail = block.free_next
                    else this.free_tail = block.free_last
                }

                block.free_last = 0
                block.free_next = 0

                new_block.used_last = block.pointer
                new_block.used_next = block.used_next

                if (block.used_next) new HeapBlock(this.emulator, new_block.used_next).used_last = new_block.pointer
                block.used_next = new_block.pointer

                return (new_block.pointer + HEAP_BLOCK_HEADER_SIZE)
            }

            block.pointer = block.free_next
        }


        return 0
    }

    free(address: number) {
        let block: HeapBlock
        let free_last: HeapBlock
        let used_last: HeapBlock

        block = new HeapBlock(this.emulator, address - HEAP_BLOCK_HEADER_SIZE)
        used_last = new HeapBlock(this.emulator, block.used_last)

        if (!used_last.free) {

            // find previous free block
            if (block.free_last) free_last = new HeapBlock(this.emulator, block.free_last)
            else {
                free_last = new HeapBlock(this.emulator, block.used_last)
                while (free_last.pointer) {
                    if (free_last.free) break
                    free_last = new HeapBlock(this.emulator, free_last.used_last)
                }
            }

            // choose where to add to the free list
            if (free_last) {
                used_last.free_last = free_last.pointer
                used_last.free_next = free_last.free_next

                if (free_last.free_next) new HeapBlock(this.emulator, used_last.free_next).free_last = used_last.pointer

                free_last.free_next = used_last.pointer

                if (this.free_tail == free_last.pointer) this.free_tail = used_last.pointer
            }
            else {
                used_last.free_next = this.free_head

                if (this.free_head) new HeapBlock(this.emulator, this.free_head).free_last = used_last.pointer
                else this.free_tail = used_last.pointer
                this.free_head = used_last.pointer
            }
        }

        used_last.free += block.used + block.free

        if (block.used_next) new HeapBlock(this.emulator, block.used_next).used_last = block.used_last
        new HeapBlock(this.emulator, block.used_last).used_next = block.used_next

        if (block.free) {
            if (block.free_last) new HeapBlock(this.emulator, block.free_last).free_next = block.free_next
            if (block.free_next) new HeapBlock(this.emulator, block.free_next).free_last = block.free_last

            if (this.free_tail == block.pointer) this.free_tail = block.free_last
        }
    }

    realloc(address: number, size: number) {
        let block: HeapBlock
        let new_block: HeapBlock

        size = Heap_Align(size)
        block = new HeapBlock(this.emulator, address - HEAP_BLOCK_HEADER_SIZE)

        if (size <= block.used || block.free >= size - block.used) {
            return (block.pointer + HEAP_BLOCK_HEADER_SIZE)
        }
        else {
            new_block = new HeapBlock(this.emulator, this.malloc(size))
            this.emulator.rdramWriteBuffer(new_block.pointer, this.emulator.rdramReadBuffer(address, block.used))
            this.free(address)
            return new_block.pointer
        }
    }

    wipe() {
        while (new HeapBlock(this.emulator, this.used_head).used_next) {
            this.free((new HeapBlock(this.emulator, this.used_head).used_next) + HEAP_BLOCK_HEADER_SIZE)
        }
    }

    get_free(): number {
        let total: number = 0
        let block: HeapBlock

        block = new HeapBlock(this.emulator, this.free_head)
        while(block) {
            total += block.free
            block = new HeapBlock(this.emulator, block.free_next)
        }

        return total
    }

    get_largest_free(): number {
        let largest: number = 0
        let block: HeapBlock
        let largest_block: HeapBlock

        block = new HeapBlock(this.emulator, this.start)
        largest_block = new HeapBlock(this.emulator, this.start)

        while (block.pointer)
        {
            if (block.free >= largest) {
                largest = block.free
                largest_block = new HeapBlock(this.emulator, block.pointer)
            }

            block = new HeapBlock(this.emulator, block.free_next)
        }

        return largest_block.pointer
    }
}



import * as API from 'modloader64_api/BK/Imports';

export class Inventory extends API.BaseObj implements API.IInventory {
    private inst: number = global.ModLoader[API.AddressType.INVENTORY];

    private acorn_addr = this.inst + API.InventoryType.CUR_LVL_ACORNS;
    private caterpillar_addr = this.inst + API.InventoryType.CUR_LVL_CATERPILLARS;
    private eggs_addr = this.inst + API.InventoryType.EGGS;
    private feathers_red_addr = this.inst + API.InventoryType.FEATHERS_RED;
    private feathers_gold_addr = this.inst + API.InventoryType.FEATHERS_GOLD;
    private gold_bullions_addr = this.inst + API.InventoryType.CUR_LVL_GOLD_BULLION;
    private health_upgrade_addr = this.inst + API.InventoryType.HEALTH_CONTAINERS;
    private honeycombs_addr = this.inst + API.InventoryType.HONEYCOMBS_EMPTY;
    private jiggies_addr = this.inst + API.InventoryType.JIGGIES;
    private jinjos_addr = this.inst + API.InventoryType.CUR_LVL_JINJOS;
    private mumbo_tokens_addr = this.inst + API.InventoryType.MUMBO_TOKENS_HELD;
    private notes_addr = this.inst + API.InventoryType.CUR_LVL_NOTES;
    private present_green_addr = this.inst + API.InventoryType.CUR_LVL_PRESENT_GREEN;
    private present_blue_addr = this.inst + API.InventoryType.CUR_LVL_PRESENT_BLUE;
    private present_red_addr = this.inst + API.InventoryType.CUR_LVL_PRESENT_RED;
    private orange_addr = this.inst + API.InventoryType.CUR_LVL_ORANGE;

    private text_jiggies_addr = this.inst + API.InventoryType.TEXT_JIGGIES;
    private text_mumbo_tokens_addr = global.ModLoader[API.AddressType.TEXT_MUMBO_TOKENS];

    get acorn(): number { return this.emulator.rdramRead32(this.acorn_addr); }
    set acorn(val: number) { this.emulator.rdramWrite32(this.acorn_addr, val); }

    get caterpillar(): number { return this.emulator.rdramRead32(this.caterpillar_addr); }
    set caterpillar(val: number) { this.emulator.rdramWrite32(this.caterpillar_addr, val); }

    get eggs(): number { return this.emulator.rdramRead32(this.eggs_addr); }
    set eggs(val: number) {
        if (val < 0) {
            val = 0;
        } else if (val > 200) {
            val = 200;
        }
        this.emulator.rdramWrite32(this.eggs_addr, val);
    }

    get gold_bullions(): number { return this.emulator.rdramRead32(this.gold_bullions_addr); }
    set gold_bullions(val: number) { this.emulator.rdramWrite32(this.gold_bullions_addr, val); }

    get gold_feathers(): number { return this.emulator.rdramRead32(this.feathers_gold_addr); }
    set gold_feathers(val: number) {
        if (val < 0) {
            val = 0;
        } else if (val > 20) {
            val = 20;
        }
        this.emulator.rdramWrite32(this.feathers_gold_addr, val);
    }

    get health_upgrades(): number { return this.emulator.rdramRead32(this.health_upgrade_addr) - 5; }
    set health_upgrades(val: number) {
        if (val < 0) val = 0;
        this.emulator.rdramWrite32(this.health_upgrade_addr, val + 5);
    }

    get honeycombs(): number { return this.emulator.rdramRead32(this.honeycombs_addr); }
    set honeycombs(val: number) {
        if (val > 6) {
            val = 6;
        } else if (val < 0) {
            val = 0;
        }
        this.emulator.rdramWrite32(this.honeycombs_addr, val);
    }

    get jiggies(): number { return this.emulator.rdramRead32(this.jiggies_addr); }
    set jiggies(val: number) {
        if (val < 0) val = 0;
        this.emulator.rdramWrite32(this.jiggies_addr, val);
        this.emulator.rdramWrite32(this.text_jiggies_addr, val);
    }

    get jinjos(): number { return this.emulator.rdramRead32(this.jinjos_addr); }
    set jinjos(val: number) { this.emulator.rdramWrite32(this.jinjos_addr, val); }

    get mumbo_tokens(): number { return this.emulator.rdramRead32(this.mumbo_tokens_addr); }
    set mumbo_tokens(val: number) {
        if (val < 0) val = 0;
        this.emulator.rdramWrite32(this.mumbo_tokens_addr, val);
        this.emulator.rdramWrite32(this.text_mumbo_tokens_addr, val);
    }

    get notes(): number { return this.emulator.rdramRead32(this.notes_addr); }
    set notes(val: number) { this.emulator.rdramWrite32(this.notes_addr, val); }

    get present_green(): number { return this.emulator.rdramRead32(this.present_green_addr); }
    set present_green(val: number) { this.emulator.rdramWrite32(this.present_green_addr, val); }

    get present_blue(): number { return this.emulator.rdramRead32(this.present_blue_addr); }
    set present_blue(val: number) { this.emulator.rdramWrite32(this.present_blue_addr, val); }

    get present_red(): number { return this.emulator.rdramRead32(this.present_red_addr); }
    set present_red(val: number) { this.emulator.rdramWrite32(this.present_red_addr, val); }

    get orange(): number { return this.emulator.rdramRead32(this.orange_addr); }
    set orange(val: number) { this.emulator.rdramWrite32(this.orange_addr, val); }

    get red_feathers(): number { return this.emulator.rdramRead32(this.feathers_red_addr); }
    set red_feathers(val: number) {
        if (val < 0) {
            val = 0;
        } else if (val > 100) {
            val = 100;
        }
        this.emulator.rdramWrite32(this.feathers_red_addr, val);
    }
}
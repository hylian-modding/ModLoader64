export const enum GameVersion {
  AUS_1_0,
  JP_1_0,
  PAL_1_0,
  USA_1_0,
}

export const enum AddressType {
  // Runtime
  RT_MAP_TRIGGER = 'BT:rt_map_trigger',
  RT_MAP_TRIGGER_TARGET = 'BT:rt_map_trigger_target',
  RT_MAP_DESTINATION = 'BT:rt_map_destination',
  RT_DCW_LOCATION = 'BT:rt_dcw_location',

  RT_PROF_HOVER = 'BT:rt_prof_hover',
  RT_PROF_SELECT = 'BT:rt_prof_select',

  RT_CUR_HEALTH_BEAR_BIRD = 'BT:rt_current_health_bear_bird',
  RT_CUR_HEALTH_BEAR = 'BT:rt_current_health_bear',
  RT_CUR_HEALTH_MUMBO = 'BT:rt_current_health_mumbo',
  RT_CUR_HEALTH_DETONATOR = 'BT:rt_current_health_detonator',
  RT_CUR_HEALTH_SUBMARINE = 'BT:rt_current_health_submarine',
  RT_CUR_HEALTH_T_REX = 'BT:rt_current_health_t_rex',
  RT_CUR_HEALTH_BEE = 'BT:rt_current_health_bee',
  RT_CUR_HEALTH_SNOWBALL = 'BT:rt_current_health_snowball',
  RT_CUR_HEALTH_WASHING_MACHINE = 'BT:rt_current_health_washing_machine',
  RT_CUR_HEALTH_BIRD = 'BT:rt_current_health_bird_bird',
  RT_CURRENT_MAP = 'BT:rt_current_map',

  // Save
  SAVE_GAME_FLAGS = 'BT:save_game_flags',
  SAVE_GLOBAL_FLAGS = 'BT:save_global_flags',
}

export enum AnimationType {
  UNKNOWN = 0x0000,
  // [0x01] = "Crouching",
  // [0x02] = "Creeping",
  // [0x03] = "Walking",
  // [0x04] = "Swimming", -- IoH Wigwam Transformation
  // [0x05] = "Pecking",
  // [0x06] = "Shuffling (Right)", -- Ledge Grab
  // [0x07] = "Exiting Talon Trot",
  // [0x08] = "Jumping",
  // [0x09] = "Death",
  // [0x0A] = "Climbing",
  // [0x0B] = "Creeping",
  // [0x0C] = "Running",
  // [0x0D] = "Pecking (Right)", -- On Ledge
  // [0x0E] = "Skidding",
  // [0x0F] = "Knockback", -- IoH Wigwam Transformation

  // [0x10] = "Nodding", -- Solo Kazooie, Locked
  // [0x11] = "Walking", -- Wonderwing
  // [0x12] = "Grabbing Up", -- Ledge
  // [0x13] = "Grabbing Ledge",
  // [0x14] = "Damaged", -- Swimming
  // [0x15] = "Talon Trot",
  // [0x16] = "Entering Talon Trot",
  // [0x17] = "Feathery Flap",
  // [0x18] = "Feathery Flap", -- Start
  // [0x19] = "Rat-a-tat Rap",
  // [0x1A] = "Rat-a-tat Rap",
  // [0x1C] = "Beak Barge",
  // [0x1D] = "Beak Buster",
  // [0x1E] = "Pecking (Left)", -- On Ledge
  // [0x1F] = "Launching", -- Jinjo Collection Start

  // [0x20] = "Breegull Bash",
  // [0x22] = "Entering Wonderwing",
  // [0x23] = "Idle", -- Wonderwing
  // [0x24] = "Encircling", -- Jinjo Collection
  // [0x26] = "Idle", -- Talon Trot
  // [0x27] = "Jumping", -- Talon Trot
  // [0x2A] = "Shooting", -- 3rd Person Egg
  // [0x2B] = "Pooping", -- Egg
  // [0x2D] = "Idle", -- Jinjo/Minjo
  // [0x2F] = "Waving", -- Jinjo/Minjo Help

  // [0x31] = "Jumping", -- Jinjo/Minjo
  // [0x32] = "Death", -- Washing Machine
  // [0x33] = "Death", -- Stony
  // [0x38] = "Flying",
  // [0x39] = "Paddling",
  // [0x3C] = "Diving",
  // [0x3D] = "Jumping", -- Stilt Stride
  // [0x3E] = "Splatting", -- Beak Bomb
  // [0x3F] = "Swimming", -- B Swimming

  // [0x40] = "Entering Stilt Stride",
  // [0x41] = "Idle", -- Stilt Stride
  // [0x42] = "Wading", -- Stilt Stride
  // [0x43] = "Charging Beak Bomb",
  // [0x44] = "Sprinting", -- Turbo Trainers
  // [0x45] = "Launching", -- Taking Flight
  // [0x46] = "Splatting", -- BK, Falling too far
  // [0x47] = "Beak Bomb",
  // [0x48] = "Charging Shock Spring",
  // [0x49] = "Shock Spring",
  // [0x4A] = "Opening/Closing", -- Superstash Door
  // [0x4B] = "Flip Flap", -- Start
  // [0x4C] = "Falling", -- Flip Flap
  // [0x4D] = "Damage",
  // [0x4F] = "Rolling",

  // [0x50] = "Thinking", -- Locked
  // [0x51] = "Shuffling (Left)", -- Ledge Grab
  // [0x52] = "Idle", -- Ledge Grab
  // [0x54] = "Idle", -- Beehive
  // [0x55] = "Idle", -- Ledge Grab, Looking Around
  // [0x56] = "Idle", -- Ledge Grab, Almost Letting Go
  // [0x57] = "Treading Water",
  // [0x59] = "Slipping", -- BK
  // [0x5A] = "Slipping",
  // [0x5B] = "Listening", -- Talking to NPC (Eg. Jamjars, Jingaling)
  // [0x5E] = "Idle", -- Snowball
  // [0x5F] = "Rolling / Jumping", -- Snowball

  // [0x61] = "Bill Drill",
  // [0x62] = "Waddling", -- Stony
  // [0x63] = "Idle", -- Stony
  // [0x64] = "Barging", -- Stony
  // [0x66] = "Damaged", -- Talon Trot
  // [0x67] = "Idle", -- Wading Boots Object
  // [0x68] = "Falling (Splat)", -- Falling too far
  // [0x6F] = "Idle", -- Normal

  // [0x70] = "Idle", -- Swimming
  // [0x71] = "Swimming", -- A Swimming
  // [0x72] = "Idle", -- Holding Gold Idol
  // [0x73] = "Walking", -- Holding Gold Idol

  // [0x83] = "Pushcart", -- Canary Mary 1/2
  // [0x85] = "Celebrating", -- Canary Mary
  // [0x86] = "Idle", -- Claw Clamber Boots

  // [0x91] = "Idle", -- Saucer of Peril Object
  // [0x95] = "Idle", -- Kazooie pecking Banjo's head
  // [0x99] = "Departing", -- Chuffy
  // [0x9A] = "Arriving", -- Chuffy
  // [0x9C] = "Paddling", -- Mumbo
  // [0x9D] = "Treading Water", -- Mumbo
  // [0x9F] = "Attacking", -- Mumbo/Mingy, Wand

  // [0xA0] = "Entering Claw Clamber Boots",
  // [0xA1] = "Walking", -- Claw Clamber Boots
  // [0xA2] = "Splitting", -- Split Up
  // [0xA4] = "Idle", -- Cwk Kazooie
  // [0xA5] = "Idle", -- Solo Kazooie, Pecking
  // [0xA6] = "Walking", -- Kazooie
  // [0xA7] = "Creeping", -- Kazooie
  // [0xA8] = "Crouching", -- Solo Kazooie
  // [0xA9] = "Jumping", -- Kazooie
  // [0xAA] = "Flying", -- Solo Kazooie
  // [0xAB] = "Launching", -- Entering Flight, Solo Kazooie
  // [0xAC] = "Idle", -- Solo Kazooie, Looking under wing
  // [0xAD] = "Idle", -- Solo Kazooie, Flapping
  // [0xAF] = "Pack Whack",

  // [0xB0] = "Falling",
  // [0xB1] = "Idle", -- Vine, Looking Around
  // [0xB2] = "Idle", -- Vine
  // [0xB3] = "Creeping", -- Mumbo
  // [0xB4] = "Walking", -- Mumbo
  // [0xB5] = "Idle", -- Mumbo
  // [0xB6] = "Juggling Wand", -- Mumbo
  // [0xB7] = "Damaged", -- Mumbo
  // [0xB8] = "Death", -- Mumbo
  // [0xB9] = "Drowning", -- BK
  // [0xBA] = "Slipping", -- Mumbo
  // [0xBB] = "Falling", -- Mumbo
  // [0xBC] = "Falling (Splat)", -- Mumbo
  // [0xBD] = "Jumping", -- Mumbo
  // [0xBF] = "Damaged", -- Old King Coal, Head taken off

  // [0xC2] = "Damaged", -- Old King Coal, Right Arm taken off
  // [0xC3] = "Damaged", -- Old King Coal, Left Arm taken off
  // [0xC4] = "Stretching", -- Old King Coal
  // [0xC5] = "Arising", -- Old King Coal
  // [0xC6] = "Moving", -- Old King Coal
  // [0xC7] = "Damaged", -- Old King Coal
  // [0xC9] = "Damaged", -- Solo Kazooie
  // [0xCA] = "Death", -- Solo Kazooie
  // [0xCB] = "Splatting", -- Mumbo, Falling too far
  // [0xCC] = "Exiting Beak Bomb",
  // [0xCE] = "Getting Up", -- Mumbo/Mingy Jongo (in Chair)
  // [0xCF] = "Pulling out Wand", -- Mumbo/Mingy Jongo (in Chair)

  // [0xD1] = "Sneezing", -- Salty Joe
  // [0xD2] = "Recovering",
  // [0xD3] = "Damage", -- Beak Bomb Recoil
  // [0xD4] = "Idle", -- CCL Cwk Kazooie Buttons
  // [0xD6] = "Idle", -- Turbo Trainers Object
  // [0xD7] = "Death", -- Solo Banjo
  // [0xD8] = "Death", -- Lava
  // [0xDC] = "Sneezing", -- Big Al
  // [0xDE] = "Walking", -- Jippo Jim
  // [0xDF] = "Alerted", -- Jippo Jim

  // [0xE0] = "Breathing Fire", -- BK (Dragon)
  // [0xE1] = "Breathing Fire", -- Solo Kazooie (Dragon)
  // [0xE2] = "Hopping", -- Detonator
  // [0xE5] = "Idle", -- Detonator
  // [0xE6] = "Detonator", -- Detonator
  // [0xE7] = "Treading Water", -- Detonator/Van
  // [0xE8] = "Paddling", -- Detonator/Van
  // [0xE9] = "Damaged", -- Detonator
  // [0xEA] = "Splashing",
  // [0xEB] = "Swimming", -- A+B Swimming
  // [0xEC] = "Driving", -- Van
  // [0xED] = "Jumping", -- Van
  // [0xEE] = "Idle", -- Van
  // [0xEF] = "Knockback", -- Transform from Wigwam

  // [0xF1] = "Opening Rear Doors", -- Van
  // [0xF2] = "Paying", -- Van
  // [0xF3] = "Entering Taxi Pack",
  // [0xF4] = "Walking", -- Taxi Pack
  // [0xF5] = "Scooping", -- Taxi Pack
  // [0xF6] = "Idle", -- Banjo choking/stretching Kazooie
  // [0xF7] = "Death", -- Minjo/Jippo Jim
  // [0xF8] = "Running", -- Jippo Jim
  // [0xFB] = "Putting away Bag", -- Mumbo's Magic
  // [0xFC] = "Retrieving Bag", -- Mumbo's Magic
  // [0xFD] = "Sitting Down", -- Mumbo (Getting back in Chair)
  // [0xFE] = "Idle", -- Conga

  // [0x10C] = "Crouching", -- Idle
  // [0x10D] = "Recoiling", -- Flying

  // [0x111] = "Idle", -- Humba Wumba
  // [0x115] = "Idle", -- Pawno
  // [0x116] = "Crouching", -- Looking Around
  // [0x11B] = "Throwing",
  // [0x11C] = "Damaged", -- Solo Kazooie, Gliding
  // [0x11D] = "Splatting", -- Falling too far, Solo Kazooie
  // [0x11E] = "Recovering", -- Falling too far, Solo Kazooie
  // [0x11F] = "Jumping", -- Claw Clamber Boots

  // [0x121] = "Grabbing", -- Taxi Pack
  // [0x122] = "Jumping", -- Stony
  // [0x124] = "Idle", -- Taxi Pack
  // [0x125] = "Jumping", -- Taxi Pack
  // [0x126] = "Stuffing", -- Taxi Pack, Successful Scoop
  // [0x128] = "Leaving Taxi Pack",
  // [0x129] = "Retrieving", -- Taxi Pack, Successful Retrieval
  // [0x12C] = "Putting on Backpack", -- Taxi Pack
  // [0x12E] = "Idle / Slow Moving", -- Submarine
  // [0x12F] = "Fast Moving", -- Submarine

  // [0x130] = "Damaged", -- Submarine
  // [0x131] = "Deploying Talon Torpedo",
  // [0x132] = "Swimming", -- Talon Torpedo
  // [0x133] = "Entering Talon Torpedo",
  // [0x136] = "Joining", -- Talon Torpedo
  // [0x137] = "Wing Whack (Stationary)", -- Solo Kazooie
  // [0x138] = "Wing Whack",
  // [0x139] = "Paddling", -- Solo Kazooie
  // [0x13A] = "Diving", -- Solo Kazooie
  // [0x13B] = "Falling", -- Solo Kazooie
  // [0x13C] = "Falling (Splat)", -- Solo Kazooie
  // [0x13D] = "Gliding", -- Solo Kazooie
  // [0x13E] = "Feathery Flap", -- Solo Kazooie
  // [0x13F] = "Hatching", -- Solo Kazooie

  // [0x140] = "Hatching (Success)", -- Solo Kazooie
  // [0x141] = "Crouching", -- Looking Around, Solo Kazooie
  // [0x142] = "Leg Spring", -- Solo Kazooie
  // [0x143] = "Entering Sack Pack",
  // [0x144] = "Hopping", -- Sack Pack
  // [0x145] = "Entering Shack Pack",
  // [0x146] = "Idle", -- Shack Pack
  // [0x147] = "Damaged", -- T-Rex
  // [0x148] = "Death", -- T-Rex
  // [0x149] = "Idle", -- Stilt Stride, Solo Kazooie
  // [0x14A] = "Jumping", -- Stilt Stride, Solo Kazooie
  // [0x14E] = "Idle", -- Blubbul
  // [0x14F] = "Stunned", -- Blubbul

  // [0x150] = "Waking", -- Blubbul
  // [0x153] = "Idle", -- Captain Blackeye
  // [0x155] = "Celebrating", -- Jolly Roger
  // [0x156] = "Idle", -- Merry Maggie Malpass
  // [0x158] = "Swimming", -- Seemee Fish
  // [0x15A] = "Celebrating", -- Captain Blubber
  // [0x15C] = "Damaged", -- Terry
  // [0x15D] = "Falling", -- Terry
  // [0x15E] = "Critically Damaged", -- Terry
  // [0x15F] = "Firing", -- Terry

  // [0x160] = "Flying", -- Terry (Able to be hit)
  // [0x161] = "Flying", -- Terry
  // [0x162] = "Taking Flight", -- Terry
  // [0x163] = "Idle", -- Terry
  // [0x165] = "Damage", -- Zubba
  // [0x169] = "Appearing", -- Chompasaurus
  // [0x16A] = "Stomping", -- Stomponadon
  // [0x16C] = "Celebrating", -- Chris P Bacon

  // [0x172] = "Idle", -- Inky

  // [0x180] = "Idle", -- Fruity
  // [0x181] = "Dispensing", -- Fruity
  // [0x182] = "Attacking", -- Fruity
  // [0x184] = "Hatching", -- Tiptup Jr
  // [0x185] = "On Back", -- Tiptup Jr
  // [0x189] = "Celebrating", -- Tiptup
  // [0x18D] = "Moving", -- Mucoid

  // [0x190] = "Flying", -- Gruntydactyl
  // [0x193] = "Sleeping", -- Ssslumber
  // [0x194] = "Waking", -- Ssslumber
  // [0x195] = "Idle", -- Ssslumber
  // [0x196] = "Falling Asleep", -- Ssslumber
  // [0x198] = "Celebrating", -- Bovina
  // [0x199] = "Idle", -- Officer Unogopaz

  // [0x1A5] = "Dormant", -- Snapdragon
  // [0x1A6] = "Attacking", -- Snapdragon
  // [0x1AB] = "Death", -- Snapdragon
  // [0x1AD] = "Charging", -- Minjo
  // [0x1AF] = "Sleeping", -- Mumbo/Mingy Jongo (in Chair)

  // [0x1B0] = "Waking", -- Mumbo (in Chair)
  // [0x1B1] = "Holding Bag", -- Mumbo (in Chair)
  // [0x1B2] = "Holding Bag", -- Mumbo (in Chair)
  // [0x1B3] = "Receiving", -- Mumbo (in Chair)
  // [0x1B6] = "Celebrating", -- Chief Bloatazin
  // [0x1B9] = "Charging", -- Diggit
  // [0x1BA] = "Attacking", -- Diggit
  // [0x1BB] = "Stretching", -- Diggit

  // [0x1C1] = "Recovering", -- Terry
  // [0x1C7] = "Charging", -- Demented Beehive
  // [0x1C8] = "Swimming", -- Swellbelly
  // [0x1C9] = "Changing Size", -- Swellbelly
  // [0x1CA] = "Attacking", -- Swellbelly
  // [0x1CE] = "Creeping", -- T-Rex
  // [0x1CF] = "Walking", -- T-Rex

  // [0x1D0] = "Roaring", -- T-Rex
  // [0x1D1] = "Jumping", -- T-Rex
  // [0x1D2] = "Idle", -- T-Rex
  // [0x1D4] = "Idle", -- Stop 'n' Swop Eggs
  // [0x1DB] = "Celebrating", -- Dilberta
  // [0x1DC] = "Flying", -- Bee
  // [0x1DD] = "Walking", -- Bee
  // [0x1DE] = "Idle", -- Bee

  // [0x1E0] = "Damaged", -- Bee
  // [0x1E1] = "Death", -- Bee
  // [0x1E2] = "Jumping", -- Bee
  // [0x1E4] = "Laughing", -- Dragunda, After being bitten
  // [0x1E5] = "Walking", -- Golden Goliath
  // [0x1E6] = "Roaming", -- Ugger
  // [0x1E7] = "Idle", -- Ugger
  // [0x1E8] = "Running", -- Ugger, Aggressive
  // [0x1E9] = "Alerted", -- Ugger
  // [0x1EA] = "Death", -- Ugger
  // [0x1EC] = "Idle", -- Bang Box
  // [0x1EE] = "Idle", -- Golden Goliath
  // [0x1EF] = "Jumping", -- Golden Goliath

  // [0x1F0] = "Kicking", -- Golden Goliath
  // [0x1F1] = "Deactivating", -- Golden Goliath
  // [0x1F7] = "Idle", -- Terry

  // [0x202] = "Idle", -- Mr Patch (Stage 2)
  // [0x203] = "Moving", -- Mr Patch
  // [0x204] = "Inflating", -- Mr Patch (To Stage 1)
  // [0x205] = "Inflating", -- Mr Patch (To Stage 2)
  // [0x206] = "Damaged", -- Mr Patch
  // [0x208] = "Idle", -- Mr Patch (Stage 1)
  // [0x209] = "Attacking", -- Mr Patch
  // [0x20A] = "Deflating", -- Mr Patch

  // [0x212] = "Roaming", -- Glowbo
  // [0x214] = "Idle", -- Springy Step Shoes
  // [0x218] = "Alerted", -- Billy Bob, Aggressive
  // [0x219] = "Hiding", -- Billy Bob, Transition to Inactive
  // [0x21A] = "Moving", -- Billy Bob
  // [0x21B] = "Death", -- Billy Bob
  // [0x21C] = "Idle", -- Billy Bob, Inactive

  // [0x220] = "Idle", -- Cheato
  // [0x222] = "Celebrating", -- Gobi
  // [0x229] = "Closed", -- Silo
  // [0x22A] = "Closing", -- Silo
  // [0x22B] = "Opening", -- Silo (Move already learnt)
  // [0x22C] = "Closing", -- Silo (Move already learnt)
  // [0x22D] = "Open", -- Silo (Move already learnt)

  // [0x238] = "Idle", -- Loggo

  // [0x242] = "Idle", -- Moggy
  // [0x244] = "Celebrating", -- Soggy
  // [0x246] = "Idle", -- Groggy
  // [0x24A] = "Floating", -- Floatus Floatsum
  // [0x24B] = "Idle", -- Springy Step Shoes, Solo Kazooie
  // [0x24C] = "Springing", -- Springy Step Shoes, Solo Kazooie
  // [0x24D] = "Walking", -- Springy Step Shoes, Solo Kazooie

  // [0x250] = "Turning (Sharp)", -- Dodgem Car
  // [0x251] = "Turning", -- Dodgem Car
  // [0x252] = "Bumping", -- Dodgem Car
  // [0x253] = "Bumping", -- Dodgem Car
  // [0x254] = "Bumping", -- Dodgem Car
  // [0x255] = "Bumping", -- Dodgem Car
  // [0x25C] = "Idle", -- Klungo
  // [0x25D] = "Eating Potion", -- Klungo
  // [0x25E] = "Enlarging", -- Klungo
  // [0x25F] = "Attacking", -- Klungo (Enlarged)

  // [0x260] = "Damage", -- Klungo
  // [0x261] = "Throwing Potion", -- Klungo
  // [0x262] = "Critically Damaged", -- Klungo
  // [0x263] = "Recovering", -- Klungo
  // [0x264] = "Walking", -- Klungo
  // [0x266] = "Damage", -- Klungo (Duplication)
  // [0x267] = "Idle", -- Klungo (Enlarged)
  // [0x268] = "Shrinking", -- Klungo (Enlarged)

  // [0x270] = "Walking", -- Breegull Blaster, Banjo, Faster
  // [0x271] = "Walking", -- Breegull Blaster, Banjo, Slow
  // [0x272] = "Idle", -- Breegull Blaster, Banjo
  // [0x273] = "Damage",
  // [0x276] = "Entering Snooze Pack",
  // [0x277] = "Snoozing", -- Snooze Pack
  // [0x279] = "Leaving Snooze Pack",
  // [0x27B] = "Failed Flip", -- Solo Banjo
  // [0x27D] = "Diving", -- Solo Banjo
  // [0x27E] = "Swimming", -- Solo Banjo
  // [0x27F] = "Entering Stilt Stride", -- Solo Kazooie

  // [0x280] = "Wading", -- Stilt Stride, Solo Kazooie
  // [0x281] = "Driving", -- Dodgem Car
  // [0x282] = "Celebrating", -- 10th Jiggy Jig from BK
  // [0x288] = "Falling", -- Leg Spring
  // [0x289] = "Idle", -- Sack Pack
  // [0x28A] = "Exiting Sack Pack",
  // [0x28D] = "Shooting", -- Solo Kazooie, Egg
  // [0x28E] = "Pooping", -- Solo Kazooie, Egg
  // [0x28F] = "Crouching", -- Idle, Solo Kazooie

  // [0x290] = "Slipping", -- Solo Kazooie
  // [0x293] = "Idle", -- Shack Pack
  // [0x294] = "Jumping", -- Shack Pack
  // [0x295] = "Exiting Shack Pack",
  // [0x296] = "Joining", -- Split Up
  // [0x298] = "Springing", -- Spring Step Shoes
  // [0x299] = "Idle", -- Claw Clamber Boots Object
  // [0x29B] = "Idle", -- Spring Step Shoes
  // [0x29C] = "Walking", -- Spring Step Shoes
  // [0x29D] = "Charging Beak Bomb", -- Solo Kazooie
  // [0x29E] = "Beak Bomb", -- Solo Kazooie
  // [0x29F] = "Entering Spring Step Shoes",

  // [0x2A4] = "Celebrating", -- Bullion Bill

  // [0x2B0] = "Idle", -- Dingpot
  // [0x2B4] = "Idle", -- Trotty
  // [0x2B8] = "Tapping Stick", -- Jamjars
  // [0x2BB] = "Saluting", -- Jamjars
  // [0x2BC] = "Teaching", -- Jamjars
  // [0x2BE] = "Appearing", -- Jamjars

  // [0x2C0] = "Celebrating", -- Piggles
  // [0x2C1] = "Disappearing", -- Jamjars
  // [0x2C2] = "Lifting Lid", -- Jamjars
  // [0x2C3] = "Disappearing", -- Jamjars
  // [0x2C4] = "Peering", -- Jamjars
  // [0x2C5] = "Leering", -- Old King Coal
  // [0x2C6] = "Idle", -- Old King Coal
  // [0x2C8] = "Idle", -- Jamjars
  // [0x2C9] = "Bonking", -- Jamjars

  // [0x2D6] = "Celebrating", -- Oogle Boogle
  // [0x2DC] = "Celebrating", -- Dippy
  // [0x2DE] = "Appearing", -- Dippy

  // [0x2EE] = "Laughing", -- Unga Bunga
  // [0x2EF] = "Surprised", -- Unga Bunga

  // [0x2F0] = "Running", -- Unga Bunga
  // [0x2F1] = "Sleeping", -- Unga Bunga
  // [0x2F2] = "Waking", -- Unga Bunga
  // [0x2F3] = "Raging", -- Unga Bunga
  // [0x2F4] = "Wailing", -- Unga Bunga
  // [0x2F5] = "Guarding", -- Unga Bunga
  // [0x2FC] = "Idle", -- Sabreman

  // [0x301] = "Sitting", -- Mumbo/Mingy Jongo
  // [0x303] = "Raising", -- Targitzan
  // [0x304] = "Idle", -- Targitzan (5 Layers)
  // [0x305] = "Spinning", -- Targitzan (5 Layers)
  // [0x306] = "Spinning", -- Targitzan (4 Layers)
  // [0x307] = "Spinning", -- Targitzan (3 Layers)
  // [0x308] = "Spinning", -- Targitzan (2 Layers)
  // [0x309] = "Alerted", -- Targitzan
  // [0x30A] = "Idle", -- Targitzan (1 Layer)
  // [0x30B] = "Death", -- Targitzan
  // [0x30C] = "Entering/Exiting Breegull Blaster",

  // [0x314] = "Beak Bayonet", -- Breegull Blaster, Banjo
  // [0x315] = "Firing Egg", -- Breegull Blaster, Banjo, Grenade/Cwk Kazooie
  // [0x31A] = "Death", -- Breegull Blaster, Banjo

  // [0x320] = "Idle", -- Targitzan (4 Layers)
  // [0x321] = "Idle", -- Targitzan (3 Layers)
  // [0x322] = "Idle", -- Targitzan (2 Layers)
  // [0x325] = "Celebrating", -- Betette
  // [0x32C] = "Celebrating", -- Alphette/Gamette

  // [0x330] = "Idle", -- Lord Woo Fak Fak
  // [0x334] = "Firing", -- Chilli Brothers
  // [0x335] = "Damage", -- Chilli Brothers
  // [0x336] = "Stunned", -- Chilli Brothers
  // [0x337] = "Licking", -- Chilli Brothers
  // [0x338] = "Flying", -- Chilli Brothers
  // [0x33E] = "Firing", -- Lord Woo Fak Fak
  // [0x33F] = "Damaged", -- Lord Woo Fak Fak

  // [0x340] = "Death", -- Lord Woo Fak Fak
  // [0x341] = "Dead", -- Lord Woo Fak Fak
  // [0x342] = "Lowering Head", -- Chilli Brothers
  // [0x343] = "Extending Tongue", -- Chilli Brothers
  // [0x344] = "Waking", -- Chilli Brothers
  // [0x346] = "Idle", -- Chilli Brothers
  // [0x347] = "Retracting Tongue", -- Chilli Brothers
  // [0x348] = "Roaming", -- Guvnor
  // [0x349] = "Running", -- Guvnor, Aggressive
  // [0x34A] = "Alerted", -- Guvnor, Aggressive
  // [0x34B] = "Attacking", -- Guvnor, Aggressive
  // [0x34C] = "Death", -- Guvnor
  // [0x34D] = "Damage", -- Guvnor
  // [0x34E] = "Idle", -- Guvnor

  // [0x351] = "Critically Damaged", -- Chilli Brothers
  // [0x352] = "Idle", -- Chilli Brothers
  // [0x353] = "Idle", -- Chilli Brothers (Jiggy Spawn)
  // [0x354] = "Cleaning", -- Washing Machine
  // [0x355] = "Falling", -- Washing Machine
  // [0x356] = "Idle", -- Washing Machine
  // [0x357] = "Firing", -- Washing Machine (Underwear)
  // [0x358] = "Damaged", -- Washing Machine
  // [0x359] = "Rolling", -- Washing Machine
  // [0x35B] = "Shaking", -- Main Menu Items
  // [0x35C] = "Idle", -- Chilli Brothers
  // [0x35E] = "Celebrating", -- Skivvy
  // [0x35F] = "Taking Flight", -- Chilli Brothers

  // [0x369] = "Idle", -- Guffo
  // [0x36B] = "Celebrating", -- Guffo
  // [0x36C] = "Disappearing", -- Mingy Jongo
  // [0x36D] = "Reappearing", -- Mingy Jongo
  // [0x36E] = "Laughing", -- Mingy Jongo
  // [0x36F] = "Idle", -- Weldar

  // [0x370] = "Lowering Head", -- Weldar
  // [0x371] = "Crawling", -- Weldar
  // [0x372] = "Standing Up", -- Weldar
  // [0x373] = "Swallowing",
  // [0x374] = "Sucking", -- Weldar
  // [0x375] = "Jumping", -- Weldar
  // [0x376] = "Firing", -- Weldar
  // [0x377] = "Damaged", -- Mingy Jongo
  // [0x378] = "Malfunctioning", -- Mingy Jongo  -- TODO: Which one is 0x378
  // [0x379] = "Death", -- Mingy Jongo
  // [0x37A] = "Idle", -- Weldar Head
  // [0x37B] = "Dormant", -- Flatso
  // [0x37C] = "Charging", -- Flatso
  // [0x37D] = "Attacking", -- Flatso
  // [0x378] = "Disappearing", -- Flatso  -- TODO: Which one is 0x378

  // [0x389] = "Idle", -- Biggafoot

  // [0x391] = "Idle", -- Cannon Flower
  // [0x392] = "Launching", -- Cannon Flower
  // [0x393] = "Dormant", -- Eyeballus Jiggium Plant
  // [0x396] = "Alerted", -- Eyeballus Jiggium Plant
  // [0x397] = "Idle", -- Eyeballus Jiggium Plant, Aggressive
  // [0x398] = "Attacking", -- Eyeballus Jiggium Plant
  // [0x399] = "Death", -- Eyeballus Jiggium Plant
  // [0x39B] = "Looking around", -- Klungo (Intro)
  // [0x39C] = "Idle", -- Klungo (Intro)
  // [0x39D] = "Dormant", -- Pansie
  // [0x39E] = "Alerted", -- Pansie
  // [0x39F] = "Charging", -- Pansie

  // [0x3A0] = "Calming", -- Pansie, Switching to Dormant
  // [0x3A1] = "Damaged", -- Pansie
  // [0x3A6] = "Lumbering", -- Jingaling (Zombie)
  // [0x3AB] = "Crumbling", -- Pile of Rocks (Intro)
  // [0x3AD] = "Idle", -- Scrotty

  // [0x3CB] = "Flying", -- Zubba
  // [0x3CC] = "Charging", -- Zubba
  // [0x3CD] = "Dying", -- Zubba
  // [0x3CE] = "Death", -- Zubba

  // [0x3D0] = "Hovering", -- Banjo's Hand
  // [0x3D3] = "Holding", -- Banjo's Hand
  // [0x3D4] = "Thumbs Up", -- Banjo's Hand
  // [0x3D5] = "Placing", -- Banjo's Hand
  // [0x3DF] = "Attacking", -- Ugger

  // [0x3E0] = "Damage", -- Ugger
  // [0x3E1] = "Attacking", -- Billy Bob, Aggressive
  // [0x3E2] = "Damaged", -- Billy Bob
  // [0x3E5] = "Launching", -- Weldar
  // [0x3E6] = "Landing", -- Weldar
  // [0x3E7] = "Spitting out", -- Weldar
  // [0x3EB] = "Sleeping", -- Lord Woo Fak Fak
  // [0x3EC] = "Waking", -- Lord Woo Fak Fak
  // [0x3EE] = "Celebrating", -- Mrs Boggy
  // [0x3EF] = "Idle", -- Angel Bottles

  // [0x3F8] = "Celebrating", -- Styracosaurus Children
  // [0x3F9] = "Exercising", -- Mr. Fit
  // [0x3FD] = "Celebrating", -- Mr. Fit

  // [0x408] = "Spinning", -- Hag 1 Drill (Intro)
  // [0x40A] = "Idle", -- Cheese Wedge Onions
  // [0x40F] = "Appearing", -- Hag 1 (Intro)

  // [0x410] = "Crumbling", -- Pile of Rocks (Intro)
  // [0x411] = "Lifting Drill", -- Hag 1 (Intro)
  // [0x412] = "Idle", -- Hag 1 (Intro)
  // [0x413] = "Crumbled", -- Pile of Rocks (Intro)
  // [0x414] = "Walking", -- Mingella (Intro)
  // [0x415] = "Walking", -- Mingella (Intro)
  // [0x416] = "Idle", -- Mingella (Intro)
  // [0x417] = "Falling", -- Mingella (Intro)
  // [0x418] = "Fallen", -- Mingella (Intro)
  // [0x41A] = "Running", -- Blobbelda (Intro)
  // [0x41C] = "Examining", -- Mingella (Intro)
  // [0x41E] = "Tripping", -- Blobbelda (Intro)
  // [0x41F] = "Reading", -- Mingella (Intro)

  // [0x420] = "Idle", -- Blobbelda (Intro)
  // [0x421] = "Casting Spell", -- Mingella (Intro)
  // [0x425] = "Closing Book", -- Mingella (Intro)
  // [0x428] = "Attacking", -- Jippo Jim
  // [0x429] = "Pulling out First Mortar", -- Hag 1
  // [0x42A] = "With Mortar", -- Hag 1
  // [0x42B] = "Pulling out Second Mortar", -- Hag 1
  // [0x42C] = "With Mortars", -- Hag 1
  // [0x42D] = "Retracting Both Mortars", -- Hag 1
  // [0x42E] = "Opening Exhaust Port", -- Hag 1
  // [0x42F] = "Opening 2nd Hatch", -- Hag 1

  // [0x431] = "Laughing", -- Rocknut
  // [0x435] = "Opening Hatch", -- Grunty, Hag 1
  // [0x436] = "Reading", -- Grunty, Hag 1
  // [0x437] = "Idle (With Card)", -- Grunty, Hag 1
  // [0x438] = "Putting Card Away", -- Grunty, Hag 1
  // [0x439] = "Launching Spell", -- Grunty, Hag 1
  // [0x43A] = "Damaged", -- Grunty, Hag 1
  // [0x43B] = "Closing Hatch", -- Grunty, Hag 1
  // [0x43C] = "Weilding Purple Spell", -- Grunty, Hag 1
  // [0x43D] = "Holding Purple Spell", -- Grunty, Hag 1
  // [0x43E] = "Throwing Purple Spell", -- Grunty, Hag 1
  // [0x43F] = "Idle", -- Grunty, Hag 1

  // [0x440] = "Dropping Spell", -- Grunty, Hag 1
  // [0x443] = "Idle", -- Boggy
  // [0x446] = "Getting up", -- Grunty (Intro)
  // [0x447] = "Closing Drill", -- Hag 1 (Intro)
  // [0x448] = "Hiding", -- Hag 1 (Intro)
  // [0x449] = "Inspecting", -- Grunty (Intro)
  // [0x44A] = "Idle", -- Grunty
  // [0x44B] = "Peering", -- Mumbo (Intro)
  // [0x44C] = "Cheering", -- Klungo (Intro)
  // [0x44D] = "Idle", -- Klungo (Intro)
  // [0x44E] = "Idle", -- Klungo (Intro)
  // [0x44F] = "Running", -- Grunty (Intro)

  // [0x450] = "Attacking", -- Grunty (Intro, attacking Mumbo)
  // [0x451] = "Hit", -- Grunty (Intro, eye knocked out)
  // [0x453] = "Idle", -- Grunty (Intro)
  // [0x454] = "Summoning Spell", -- Grunty (Intro)
  // [0x455] = "Attacking", -- Klungo (Intro, knocking grunty's eye out)
  // [0x456] = "Idle", -- Klungo (Intro)
  // [0x457] = "Miming", -- Mingella (Intro)
  // [0x458] = "Angered", -- Grunty (Intro)
  // [0x459] = "Idle", -- Blobbelda
  // [0x45A] = "Idle", -- Mingella (Intro)
  // [0x45B] = "Waving", -- Blobbelda (Intro)
  // [0x45C] = "Cheering", -- Blobbelda (Intro)
  // [0x45D] = "Surprised", -- Mingella (Intro)
  // [0x45F] = "Limping", -- Burnt Bottles (Intro)

  // [0x460] = "Death", -- Bottles (Intro)
  // [0x461] = "Panting", -- Mumbo (Intro)
  // [0x462] = "Running", -- Mumbo (Intro)
  // [0x463] = "Holding Cards", -- BK (Intro)
  // [0x464] = "Holding Cards", -- BK (Intro)
  // [0x465] = "Holding Cards", -- Mumbo (Intro)
  // [0x466] = "Holding Cards", -- BK (Intro)
  // [0x467] = "Surprised", -- Mumbo (Intro)
  // [0x468] = "Shaking", -- Mumbo (Intro)
  // [0x469] = "Holding Cards", -- BK (Intro)
  // [0x46A] = "Getting up", -- Mumbo (Intro)
  // [0x46B] = "Holding Cards", -- Bottles (Intro)
  // [0x46C] = "Surprised", -- Bottles (Intro)
  // [0x46D] = "Holding Cards", -- Bottles (Intro)
  // [0x46E] = "Shaking", -- Bottles (Intro)
  // [0x46F] = "Annoyed", -- Bottles (Intro)

  // [0x470] = "Cheering", -- Mumbo (Intro)
  // [0x471] = "Holding Cards", -- BK (Intro)
  // [0x472] = "Shaking", -- BK (Intro)
  // [0x473] = "Confusion", -- Mumbo (Intro)
  // [0x474] = "Shaking", -- Grunty Rock
  // [0x475] = "Holding Cards", -- BK (Intro)
  // [0x476] = "Holding Cards", -- BK (Intro)
  // [0x477] = "Idle", -- Breegull Blaster, Mumbo/Jinjo
  // [0x478] = "Walking", -- Breegull Blaster, Mumbo/Jinjo, Slow
  // [0x479] = "Walking", -- Breegull Blaster, Mumbo/Jinjo, Fast
  // [0x47A] = "Damaged", -- Breegull Blaster, Mumbo/Jinjo
  // [0x47B] = "Death", -- Breegull Blaster, Mumbo/Jinjo
  // [0x47C] = "Death", -- Breegull Blaster, Mumbo/Jinjo, Explosive

  // [0x480] = "Idle", -- Mingy Jongo
  // [0x481] = "Controlling Saucer of Peril",
  // [0x48B] = "Escaping", -- BK (Intro)
  // [0x48C] = "Stealing", -- BK (Intro)
  // [0x48E] = "Holding Cards", -- BK (Intro)

  // [0x490] = "Confused", -- BK (Intro)
  // [0x492] = "Cleaning", -- Grunty (Intro)
  // [0x493] = "Tripping", -- Blobbelda (Intro)
  // [0x495] = "Holding Cards", -- BK (Intro)
  // [0x498] = "Rising", -- Angel Bottles (Intro)
  // [0x499] = "Idle", -- Angel Bottles (Intro)
  // [0x49E] = "Moving", -- BK Cart
  // [0x49F] = "Idle", -- BK Cart

  // [0x4A1] = "Performing Magic", -- Mumbo
  // [0x4A2] = "Beak Bayonet", -- Breegull Blaster, Mumbo/Jinjo
  // [0x4A3] = "Firing Egg", -- Breegull Blaster, Mumbo/Jinjo, Grenade/Cwk Kazooie
  // [0x4A5] = "Idle", -- Heggy
  // [0x4A8] = "Waking", -- Mildred/George
  // [0x4A9] = "Idle", -- Mildred/George
  // [0x4AA] = "Idle", -- Warp Silo
  // [0x4AD] = "Idle", -- Honey B

  // [0x4B2] = "Falling", -- Klungo III
  // [0x4B3] = "Landing", -- Klungo III
  // [0x4B6] = "Idle", -- Chilli Brothers

  // [0x4C1] = "Idle", -- Master Jiggywiggy
  // [0x4C9] = "Idle", -- Disciple of Jiggywiggy
  // [0x4CA] = "Preparing to Conjure", -- Master Jiggywiggy
  // [0x4CB] = "Conjuring", -- Master Jiggywiggy

  // [0x4D3] = "Firing Egg", -- Breegull Blaster, Grunty, Grenade/Cwk Kazooie
  // [0x4D4] = "Beak Bayonet", -- Breegull Blaster, Grunty
  // [0x4D5] = "Walking", -- Breegull Blaster, Grunty, Fast
  // [0x4D6] = "Idle", -- Breegull Blaster, Grunty
  // [0x4D7] = "Walking", -- Breegull Blaster, Grunty, Slow
  // [0x4D8] = "Damaged", -- Breegull Blaster, Grunty
  // [0x4D9] = "Death", -- Breegull Blaster, Grunty
  // [0x4DA] = "Death", -- Breegull Blaster, Grunty, Explosive
  // [0x4DD] = "Running", -- Jingaling, Eating CS
  // [0x4DE] = "Damaged", -- Breegull Blaster, Jamjars
  // [0x4DF] = "Firing Egg", -- Breegull Blaster, Jamjars, Grenade/Cwk Kazooie

  // [0x4E0] = "Beak Bayonet", -- Breegull Blaster, Jamjars
  // [0x4E1] = "Walking", -- Breegull Blaster, Jamjars, Fast
  // [0x4E2] = "Idle", -- Breegull Blaster, Jamjars
  // [0x4E3] = "Walking", -- Breegull Blaster, Jamjars, Slow
  // [0x4E4] = "Death", -- Breegull Blaster, Jamjars
  // [0x4E5] = "Death", -- Breegull Blaster, Jamjars, Explosive
  // [0x4EC] = "Explaining", -- Jingaling, Eating CS
  // [0x4ED] = "Celebrating", -- Jingaling, Eating CS
  // [0x4EE] = "Idle", -- Jingaling, Restoration
  // [0x4EF] = "Idle", -- Jingaling, Eating CS

  // [0x4F0] = "Arguing", -- Mingella
  // [0x4F1] = "Laughing", -- Mingella
  // [0x4F2] = "Explaining", -- Klungo, Eating CS
  // [0x4F3] = "Idle", -- Klungo, Eating CS
  // [0x4F4] = "Sleeping", -- Klungo, Credits
  // [0x4F5] = "Idle", -- Mumbo, Credits
  // [0x4F6] = "Complaining", -- Mumbo, Credits
  // [0x4F7] = "Accepting", -- Grunty
  // [0x4F8] = "Demonstrating", -- Blobbelda
  // [0x4F9] = "Approving", -- Grunty
  // [0x4FA] = "Excited", -- Grunty
  // [0x4FB] = "Thinking", -- Grunty
  // [0x4FC] = "Pressing Button", -- Grunty
  // [0x4FD] = "Idle", -- Humba Wumba, Credits
  // [0x4FE] = "Rubbing hands together", -- Grunty
  // [0x4FF] = "Dismissing", -- Grunty

  // [0x500] = "Laughing", -- Grunty
  // [0x501] = "Laughing", -- Blobbelda
  // [0x502] = "Picking Up Cake", -- Humba Wumba, Credits
  // [0x509] = "Arguing", -- Humba Wumba, Credits
  // [0x50A] = "Idle", -- Mrs Bottles, Eating CS
  // [0x50B] = "Surprised", -- Mrs Bottles, Eating CS
  // [0x50C] = "Idle", -- Mrs Bottles, Eating CS
  // [0x50D] = "Idle", -- Humba Wumba, Credits
  // [0x50E] = "Idle", -- Mingella
  // [0x50F] = "Arguing", -- Mumbo, Credits

  // [0x510] = "Idle", -- Bottles, Eating CS
  // [0x511] = "Idle", -- Bottles, Eating CS
  // [0x512] = "Cutting", -- Bottles, Eating CS
  // [0x513] = "Sleeping", -- Bottles, Credits
  // [0x514] = "Arguing", -- Mumbo, Credits
  // [0x515] = "Waking Up", -- Bottles, Credits
  // [0x516] = "Shouting", -- Bottles, Credits
  // [0x518] = "Restoring", -- Burnt Bottles, Restortion
  // [0x519] = "Getting up", -- Burnt Bottles, Restoration
  // [0x51A] = "Panicking", -- Burnt Bottles, Restoration
  // [0x51B] = "Returning to Body", -- Angel Bottles, Restoration
  // [0x51C] = "Idle", -- Angel Bottles, Restoration
  // [0x51D] = "Running", -- Burnt Bottles, Restoration
  // [0x51E] = "Running", -- Jamjars, Credits
  // [0x51F] = "Kicking", -- Mumbo, Credits

  // [0x520] = "Idle", -- BK At Controls
  // [0x521] = "Pressing Buttons", -- BK At Controls
  // [0x522] = "Anticipating", -- BK At Controls
  // [0x524] = "Idle", -- Jamjars, Credits
  // [0x525] = "Complaining", -- Jamjars, Credits
  // [0x526] = "Idle", -- Jamjars, Credits
  // [0x527] = "Surprised", -- Jamjars, Credits
  // [0x528] = "Alerted", -- Gruntydactyl, Aggressive
  // [0x529] = "Charging", -- Gruntydactyl, Aggressive
  // [0x52A] = "Damage", -- Gruntydactyl
  // [0x52B] = "Dying", -- Gruntydactyl
  // [0x52C] = "Death", -- Gruntydactyl
  // [0x52D] = "Idle", -- BK, Credits
  // [0x52E] = "Surprised", -- BK, Credits
  // [0x52F] = "Idle", -- BK, Credits

  // [0x530] = "Arguing", -- BK, Credits
  // [0x531] = "Confusion", -- Jamjars, Credits
  // [0x532] = "Proposing", -- BK, Credits
  // [0x533] = "Kicking", -- Humba Wumba, Credits
  // [0x534] = "Idle", -- Bottles, Credits
  // [0x536] = "Kicking", -- BK, Credits
  // [0x537] = "Excited", -- Jamjars, Credits
  // [0x538] = "Kicking", -- Jamjars, Credits
  // [0x539] = "Riding", -- Captain Blubber, Credits
  // [0x53A] = "Floating", -- Saucer of Peril, Credits
  // [0x53B] = "Cheering", -- Captain Blubber, Credits
  // [0x53C] = "Idle", -- Saucer of Peril, Credits
  // [0x53F] = "Running", -- Humba Wumba, Credits

  // [0x542] = "Surprised", -- Klungo, Eating CS
}

export enum FormType {
  UNKNOWN = 0x00,
  BEAR_BIRD = 0x01,
  SNOWBALL = 0x02,
  UNKNOWN_0x03 = 0x03,
  CUTSCENE = 0x04,
  UNKNOWN_0x05 = 0x05,
  BEE = 0x06,
  WASHING_MACHINE = 0x07,
  STONY = 0x08,
  BREEGULL_BLASTER = 0x09,
  BEAR = 0x0a,
  BIRD = 0x0b,
  SUBMARINE = 0x0c,
  MUMBO = 0x0d,
  GOLDEN_GOLIATH = 0x0e,
  DETONATOR = 0x0f,
  VAN = 0x10,
  CLOCKWORK_BIRD = 0x11,
  T_REX_SMALL = 0x12,
  T_REX_LARGE = 0x13,
}

export enum MovementType {
  UNKNOWN = 0x0000,
  // [0x01] = "Idle",
  // [0x02] = "Walking", -- Slow
  // [0x03] = "Walking", -- Medium
  // [0x04] = "Walking", -- Fast
  // [0x05] = "Jumping",
  // [0x06] = "Pecking", -- Bear Punch replacement
  // [0x07] = "Crouching",
  // [0x08] = "Jumping", -- Talon Trot
  // [0x09] = "Shooting Egg", -- BK on ground
  // [0x0A] = "Pooping Egg", -- BK on ground

  // [0x0C] = "Slipping",
  // -- 0x0D Taken to JV
  // [0x0E] = "Damaged",
  // [0x0F] = "Beak Buster",

  // [0x10] = "Feathery Flap",
  // [0x11] = "Rat-a-tat Rap",
  // [0x12] = "Flap Flip",
  // [0x13] = "Beak Barge",
  // [0x14] = "Entering Talon Trot",
  // [0x15] = "Idle", -- Talon Trot
  // [0x16] = "Walking", -- Talon Trot
  // [0x17] = "Leaving Talon Trot",
  // [0x18] = "Recoil", -- Flying
  // [0x19] = "Swimming (A+B)",
  // [0x1A] = "Entering Wonderwing",
  // [0x1B] = "Idle", -- Wonderwing
  // [0x1C] = "Walking", -- Wonderwing
  // [0x1D] = "Jumping", -- Wonderwing
  // [0x1E] = "Leaving Wonderwing",

  // [0x20] = "Landing",
  // [0x21] = "Charging Shock Spring Jump",
  // [0x22] = "Shock Spring Jump",
  // [0x23] = "Taking Flight",
  // [0x24] = "Flying",
  // [0x25] = "Entering Stilt Stride",
  // [0x26] = "Idle", -- Stilt Stride
  // [0x27] = "Walking", -- Stilt Stride
  // [0x28] = "Jumping", -- Stilt Stride
  // [0x29] = "Leaving Stilt Stride",
  // [0x2A] = "Beak Bomb",
  // [0x2B] = "Idle", -- Underwater
  // [0x2C] = "Swimming (B)",
  // [0x2D] = "Idle", -- Water Surface
  // [0x2E] = "Paddling", -- Water Surface
  // [0x2F] = "Falling",

  // [0x30] = "Diving",
  // [0x31] = "Rolling",
  // [0x32] = "Idle", -- Washing Machine
  // [0x33] = "Rolling", -- Washing Machine
  // [0x34] = "Celebrating", -- Unused Jiggy Jig (10th Jiggy Jig from BK)
  // [0x35] = "Jumping", -- Washing Machine
  // [0x36] = "Falling", -- Washing Machine
  // [0x37] = "Cleaning", -- Washing Machine
  // [0x38] = "Launching Underwear", -- Washing Machine
  // [0x39] = "Swimming (A)",
  // [0x3A] = "Idle", -- With Gold Idol
  // [0x3B] = "Walking", -- With Gold Idol

  // [0x3D] = "Falling (Splat)",
  // [0x3E] = "Damaged", -- Washing Machine

  // [0x40] = "Locked", -- CWK Kazooie Explosion (under some conditions)
  // [0x41] = "Death",
  // [0x42] = "Locked", -- Silo
  // [0x43] = "Death", -- Washing Machine
  // -- 0x44 10th Jiggy Jig Initiation
  // [0x45] = "Locked", -- Talon Trot, sliding
  // [0x46] = "Knockback", -- Submarine
  // [0x47] = "Entering Stilt Stride", -- Solo Kazooie
  // [0x48] = "Idle", -- Solo Kazooie, Stilt Stride
  // [0x49] = "Walking", -- Solo Kazooie, Stilt Stride
  // [0x4A] = "Jumping", -- Solo Kazooie, Stilt Stride
  // [0x4B] = "Exiting Stilt Stride", -- Solo Kazooie
  // [0x4C] = "Landing", -- Water Surface

  // [0x4F] = "Idle", -- Climbing

  // [0x50] = "Climbing",
  // -- 0x53 Taken to JV
  // [0x54] = "Drowning",
  // -- 0x55 Leads into leaving stilt stride
  // [0x56] = "Knockback", -- Solo Banjo
  // [0x57] = "Exiting Beak Bomb", -- BK
  // [0x58] = "Damaged", -- Crash Landing
  // [0x59] = "Damaged", -- Beak Bomb

  // [0x5B] = "Throwing Object", -- Glowbo
  // [0x5C] = "Knockback",
  // [0x5D] = "Locked", -- Washing Machine, Loading Zones & Sliding
  // [0x5E] = "Locked", -- Shack Pack, Talking, moving to target
  // [0x5F] = "Locked", -- Shack pack, Talking

  // [0x60] = "Locked", -- Snooze Pack, Talking, moving to target
  // [0x61] = "Locked", -- Snooze Pack, Talking

  // [0x65] = "Locked", -- Solo Kazooie, Swimming, Text Boxes
  // [0x66] = "Locked", -- Solo Kazooie - Water surface?
  // [0x67] = "Shooting Egg", -- Solo Kazooie
  // [0x68] = "Pooping Egg", -- Solo Kazooie
  // [0x69] = "Joining", -- Split up pad
  // [0x6A] = "Joining", -- Split up pad
  // [0x6B] = "Locked", -- Bee, Text Boxes
  // [0x6C] = "Failed Flip", -- Solo Banjo Z+A
  // [0x6D] = "Diving", -- Solo Banjo
  // [0x6E] = "Locked", -- Sack Pack, Talking, moving to target
  // [0x6F] = "Floating", -- Solo Banjo, CCL

  // [0x70] = "Locked", -- Golden Goliath
  // [0x71] = "Falling", -- Talon Trot
  // [0x72] = "Recovering", -- Splat
  // [0x73] = "Locked",
  // [0x74] = "Locked", -- Mumbo's Skull
  // [0x75] = "Locked", -- Signpost
  // [0x76] = "Locked", -- Flying
  // [0x77] = "Locked", -- Water Surface
  // [0x78] = "Locked", -- Underwater
  // [0x79] = "Locked", -- Talon Trot
  // [0x7A] = "Walking", -- Damaging Ground, eg. quicksand
  // [0x7B] = "Damaged", -- Talon Trot
  // [0x7C] = "Clockwork Mouse", -- Canary Mary 3 & 4
  // [0x7D] = "Damaged", -- Solo Banjo - Sack Pack

  // [0x7F] = "Damaged", -- Underwater

  // [0x80] = "Locked", -- Sack Pack, Talking
  // [0x81] = "Swimming (A)", -- Solo Banjo
  // [0x82] = "Swimming (B)", -- Solo Banjo
  // [0x83] = "Knockback", -- Submarine on land
  // [0x84] = "Joining", -- Talon Torpedo
  // [0x85] = "Idle", -- Bee
  // [0x86] = "Walking", -- Bee
  // [0x87] = "Jumping", -- Bee
  // [0x88] = "Falling", -- Bee
  // [0x89] = "Damaged", -- Bee
  // [0x8A] = "Death", -- Bee
  // -- 0x8B Flight pad launch into bee flying
  // [0x8C] = "Flying", -- Bee
  // [0x8D] = "Locked", -- Bee, Eyeball Plant FTT
  // [0x8E] = "Knockback", -- Washing Machine
  // [0x8F] = "Locked", -- Solo Kazooie

  // [0x90] = "Swimming (A+B)", -- Solo Banjo
  // [0x91] = "Damaged", -- Flying
  // [0x92] = "Locked", -- Washing Machine, Elevators & Text Boxes
  // [0x93] = "Locked", -- Solo Kazooie, Loading Zone, First Person Camera, Slipping
  // [0x94] = "Locked", -- CWK Kazooie Explosion (under some conditions)
  // [0x95] = "Jumping", -- Claw Clamber
  // [0x96] = "Locked", -- Transforming
  // [0x97] = "Locked", -- Underwater - Loading Zone
  // [0x98] = "Locked", -- First person camera, some damage sources, loading zones

  // [0x9A] = "Locked", -- Talon Trot, loading zone etc
  // [0x9B] = "Locked", -- Stilt Stride, Prison Compound Buttons etc
  // [0x9C] = "Jumping", -- Springy Step Shoes
  // [0x9D] = "Locked", -- Bee, Loading Zones
  // -- 0x9E Taken to 0,0,0
  // [0x9F] = "Creeping", -- With Gold Idol

  // [0xA0] = "Locked", -- With Gold Idol, Detection
  // [0xA2] = "Knockback", -- After transform from Sub to BK
  // [0xA3] = "Knockback", -- Bee
  // [0xA4] = "Locked", -- Wonderwing, Prison Compound Buttons etc
  // -- 0xA5 Leads into Leaving Wonderwing
  // [0xA6] = "Idle", -- Grip Grab
  // [0xA7] = "Moving", -- Grip Grab
  // [0xA8] = "Grabbing Ledge", -- Grip Grab
  // [0xA9] = "Pecking", -- Grip Grab
  // [0xAA] = "Pulling up", -- Grip Grab
  // [0xAB] = "Death", -- Stony
  // [0xAC] = "Locked", -- Stony - Loading zone, transformation
  // [0xAD] = "Falling", -- Stony
  // [0xAE] = "Jumping", -- Stony
  // [0xAF] = "Damaged", -- Stony

  // [0xB0] = "Knockback", -- Stony
  // [0xB1] = "Locked", -- Stony
  // [0xB2] = "Walking", -- Stony
  // [0xB3] = "Idle", -- Stony
  // [0xB4] = "Diving", -- Stony
  // -- 0xB5 Something with Stony
  // [0xB6] = "Bill Drill",
  // [0xB7] = "Pushcart", -- Canary Mary 1 & 2
  // [0xB8] = "Splitting", -- Split up pad
  // [0xB9] = "Splitting", -- Split up pad

  // [0xBB] = "Idle", -- Solo Kazooie
  // [0xBC] = "Creeping", -- Solo Kazooie
  // [0xBD] = "Jumping", -- Solo Kazooie
  // [0xBE] = "Gliding", -- Solo Kazooie
  // [0xBF] = "Stunned", -- Swimming

  // -- 0xC0 Something with the bee?
  // [0xC1] = "Shock Spring Jump", -- Solo Kazooie
  // [0xC2] = "Wing Whack", -- Solo Kazooie
  // [0xC3] = "Charging Shock Spring Jump", -- Solo Kazooie
  // [0xC4] = "Wing Whack", -- Solo Kazooie - Moving
  // [0xC5] = "Hatching", -- Solo Kazooie
  // [0xC6] = "Leg Spring", -- Solo Kazooie
  // [0xC7] = "Walking", -- Solo Kazooie
  // [0xC8] = "Entering Breegull Blaster",
  // [0xC9] = "Exiting Breegull Blaster",
  // [0xCA] = "Idle", -- Breegull Blaster
  // [0xCB] = "Entering First Person", -- Breegull Blaster

  // [0xCE] = "Locked", -- Breegull Blaster, Loading Zone

  // [0xD0] = "Locked", -- Breegull Blaster
  // [0xD1] = "Walking", -- Breegull Blaster
  // [0xD2] = "Beak Bayonet",

  // [0xD6] = "Firing Egg", -- Breegull Blaster
  // [0xD7] = "Clockwork Kazooie", -- Breegull Blaster
  // [0xD8] = "Firing Egg", -- Breegull Blaster
  // [0xD9] = "Frozen", -- Breegull Blaster (Multiplayer Only?)
  // [0xDA] = "Damaged", -- Breegull Blaster
  // [0xDB] = "Death", -- Breegull Blaster
  // [0xDC] = "Death", -- Breegull Blaster (Multiplayer Only?)
  // [0xDD] = "Crouching", -- Solo Kazooie
  // [0xDE] = "Landing", -- Solo Kazooie
  // [0xDF] = "Falling", -- Solo Kazooie
  // [0xE0] = "Falling (Splat)", -- Solo Kazooie

  // [0xE4] = "Pack Whack", -- Solo Banjo
  // [0xE5] = "Idle", -- Mumbo
  // [0xE6] = "Walking", -- Mumbo, slow
  // [0xE7] = "Walking", -- Mumbo, fast
  // [0xE8] = "Jumping", -- Mumbo
  // [0xE9] = "Falling", -- Mumbo
  // [0xEA] = "Damaged", -- Mumbo
  // [0xEB] = "Death", -- Mumbo

  // [0xED] = "Exiting Talon Torpedo",
  // [0xEE] = "Falling (Splat)", -- Mumbo
  // [0xEF] = "Landing", -- Mumbo

  // [0xF0] = "Idle", -- Mumbo - Water Surface
  // [0xF1] = "Paddling", -- Mumbo
  // [0xF2] = "Locked", -- Mumbo, Swimming, Text Boxes
  // [0xF3] = "Locked", -- Mumbo first person camera water surface
  // [0xF4] = "Landing", -- Mumbo - Water Surface
  // [0xF5] = "Locked", -- Mumbo
  // [0xF6] = "Locked", -- Mumbo
  // [0xF7] = "Attacking", -- Mumbo's Wand
  // [0xF8] = "Failure", -- Golden Goliath, Premature Failure
  // [0xF9] = "Idle", -- Golden Goliath
  // [0xFA] = "Walking", -- Golden Goliath
  // [0xFB] = "Jumping", -- Golden Goliath
  // [0xFC] = "Kicking", -- Golden Goliath
  // [0xFD] = "Failure", -- Golden Goliath, Run out of time
  // [0xFE] = "Locked", -- Golden Goliath, Loading Zone
  // [0xFF] = "Recovering", -- Mumbo

  // [0x100] = "Damaged", -- Solo Kazooie
  // [0x101] = "Death", -- Solo Kazooie
  // [0x102] = "Death", -- Solo Banjo - Sack Pack
  // [0x103] = "Death", -- Solo Banjo
  // [0x104] = "Death", -- Detonator
  // [0x105] = "Locked", -- Detonator, Loading Zone, First Person Camera
  // -- 0x106 Something with Detonator
  // [0x107] = "Jumping", -- Detonator
  // [0x108] = "Walking", -- Detonator
  // [0x109] = "Damaged", -- Detonator
  // [0x10A] = "Knockback", -- Detonator
  // [0x10B] = "Locked", -- Detonator, Talking
  // [0x10C] = "Idle", -- Detonator
  // [0x10D] = "Detonating", -- Detonator, Scripted
  // [0x10E] = "Detonating", -- Detonator
  // [0x10F] = "Idle", -- Detonator, Water Surface

  // [0x110] = "Paddling", -- Detonator, Water Surface
  // [0x111] = "Landing", -- Detonator, Water Surface
  // -- 0x112 Det/Bee Death?
  // [0x113] = "Locked", -- Van - Loading zone etc
  // [0x114] = "Falling", -- Van
  // [0x115] = "Jumping", -- Van
  // [0x116] = "Driving", -- Van

  // [0x118] = "Knockback", -- Van
  // [0x119] = "Locked", -- Van
  // [0x11A] = "Idle", -- Van
  // [0x11B] = "Idle", -- Van, Surface Swimming
  // [0x11C] = "Paddling", -- Van
  // [0x11D] = "Landing", -- Van - Water Surface
  // [0x11E] = "Casting Spell", -- Mumbo

  // [0x120] = "Death", -- Toxic Gas
  // [0x121] = "Paying Coin", -- Van
  // [0x122] = "Entering Taxi Pack",
  // [0x123] = "Walking", -- Taxi Pack
  // [0x124] = "Scooping", -- Taxi Pack
  // [0x125] = "Idle", -- Taxi Pack
  // [0x126] = "Jumping", -- Taxi Pack
  // [0x127] = "Leaving Taxi Pack",
  // [0x128] = "Grabbing", -- Taxi Pack, Successful
  // [0x129] = "Grabbing", -- Taxi Pack
  // [0x12A] = "Driving", -- Dodgem Car
  // [0x12B] = "Saucer of Peril",
  // [0x12C] = "Swimming", -- Submarine
  // [0x12D] = "Damaged", -- Submarine
  // [0x12E] = "Death", -- Submarine
  // [0x12F] = "Locked", -- Submarine - Signpost etc

  // [0x130] = "Locked", -- Submarine - Loading Zone, Transforming etc
  // [0x131] = "Idle", -- Submarine
  // [0x132] = "Landing", -- Clockwork Kazooie
  // [0x133] = "Falling", -- Clockwork Kazooie
  // [0x134] = "Jumping", -- Clockwork Kazooie
  // [0x135] = "Walking", -- Clockwork Kazooie
  // [0x136] = "Idle", -- Clockwork Kazooie
  // [0x137] = "Locked", -- Clockwork Kazooie, Loading Zone
  // [0x138] = "Locked", -- Clockwork Kazooie, Slipping, Loading Zone

  // [0x13A] = "Knockback", -- Solo Kazooie
  // [0x13B] = "Landing", -- Small T. Rex
  // [0x13C] = "Death", -- Small T. Rex
  // [0x13D] = "Locked", -- Small T. Rex
  // [0x13E] = "Falling", -- Small T. Rex
  // [0x13F] = "Jumping", -- Small T. Rex

  // [0x140] = "Damaged", -- Small T. Rex
  // [0x141] = "Knockback", -- Small T. Rex
  // [0x142] = "Locked", -- Small T. Rex, Talking
  // [0x143] = "Roar", -- Small T. Rex
  // [0x144] = "Walking", -- Small T. Rex
  // [0x145] = "Idle", -- Small T. Rex
  // [0x146] = "Walking", -- Small T. Rex, Slow
  // [0x147] = "Landing", -- Big T. Rex

  // [0x149] = "Locked", -- Big T. Rex, Loading Zone
  // [0x14A] = "Falling", -- Big T. Rex
  // [0x14B] = "Jumping", -- Big T. Rex

  // [0x14D] = "Knockback", -- Big T. Rex
  // [0x14E] = "Locked", -- Big T. Rex, Talking
  // [0x14F] = "Roar", -- Big T. Rex

  // [0x150] = "Walking", -- Big T. Rex
  // [0x151] = "Idle", -- Big T. Rex
  // [0x152] = "Walking", -- Big T. Rex, Slow
  // [0x153] = "Entering Talon Torpedo",
  // [0x154] = "Swimming", -- Talon Torpedo
  // [0x155] = "Locked", -- Talon Torpedo (Jinjo Collection)
  // [0x157] = "Deploying Talon Torpedo",

  // [0x159] = "Swimming (A)", -- Talon Torpedo
  // -- 0x15A Aquatic Theme, Something with Talon Torpedo
  // [0x15B] = "Damaged", -- Solo Kazooie - Gliding
  // [0x15C] = "Feathery Flap", -- Solo Kazooie
  // [0x15D] = "Idle", -- Solo Kazooie - Water Surface
  // [0x15E] = "Paddling", -- Solo Kazooie
  // [0x15F] = "Diving", -- Solo Kazooie

  // [0x160] = "Landing", -- Solo Kazooie - Water Surface
  // [0x161] = "Entering Flight", -- Solo Kazooie
  // [0x162] = "Flying", -- Solo Kazooie
  // [0x163] = "Entering Sack Pack",
  // [0x164] = "Leaving Sack Pack",
  // [0x165] = "Idle", -- Sack Pack
  // [0x166] = "Walking", -- Sack Pack
  // -- 0x167 leads into leaving sack pack
  // -- 0x168 Aquatic Theme
  // [0x169] = "Jumping", -- Sack Pack
  // [0x16A] = "Entering Shack Pack",
  // [0x16B] = "Leaving Shack Pack",
  // [0x16C] = "Idle", -- Shack Pack
  // [0x16D] = "Walking", -- Shack Pack
  // [0x16E] = "Jumping", -- Shack Pack
  // [0x16F] = "Snoozing", -- Snooze Pack

  // -- 0x170 leads into leaving snooze pack
  // [0x171] = "Entering Snooze Pack",
  // [0x172] = "Leaving Snooze Pack",

  // [0x174] = "Beak Bomb", -- Solo Kazooie
  // [0x175] = "Exiting Beak Bomb", -- Solo Kazooie
  // [0x176] = "Recovering", -- Solo Kazooie, post splat
  // [0x177] = "Damaged", -- Solo Kazooie, Hitting Wall in Beak Bomb

  // [0x17B] = "Idle", -- On Wall, Claw Clamber
  // [0x17C] = "Walking", -- On Wall, Claw Clamber
  // [0x17D] = "Idle", -- Snowball
  // [0x17E] = "Rolling", -- Snowball
  // [0x17F] = "Jumping", -- Snowball

  // [0x180] = "Falling", -- Snowball
  // [0x181] = "Damaged", -- Snowball
  // [0x182] = "Death", -- Snowball
  // [0x183] = "Locked", -- Snowball, Loading Zone
  // [0x184] = "Knockback", -- Snowball
  // [0x185] = "Locked", -- Snowball, Text Boxes
  // [0x186] = "Jumping", -- Solo Kazooie - Springy Step Shoes
  // [0x187] = "Idle", -- Solo Kazooie - On Wall, Claw Clamber
  // [0x188] = "Walking", -- Solo Kazooie - On Wall, Claw Clamber
  // [0x189] = "Breegull Bash",
  // [0x18A] = "Breathing Fire", -- BK
  // [0x18B] = "Breathing Fire", -- Solo Kazooie
  // [0x18C] = "Damage", -- Bee, Flying
  // -- 0x18D Leads into gliding
  // -- 0x18F leads into landing

  // -- 0x190 likely the last animation
}

export enum ProfileType {
  Title = -1,
  A = 0,
  B = 1,
  C = 2,
}

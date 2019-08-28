if type(ScriptHawk) ~= "table" then
	print("This script is not designed to run by itself");
	print("Please run ScriptHawk.lua from the parent directory instead");
	print("Thanks for using ScriptHawk :)");
	return;
end

encircle_enabled = false;
object_filter = nil; -- String

local Game = {
	maps = {
		"!Unknown 0x0001", "!Unknown 0x0002", "!Unknown 0x0003", "!Unknown 0x0004", "!Unknown 0x0005", "!Unknown 0x0006", "!Unknown 0x0007", "!Unknown 0x0008", "!Unknown 0x0009", "!Unknown 0x000A", "!Unknown 0x000B", "!Unknown 0x000C", "!Unknown 0x000D", "!Unknown 0x000E", "!Unknown 0x000F",
		"!Unknown 0x0010", "!Unknown 0x0011", "!Unknown 0x0012", "!Unknown 0x0013", "!Unknown 0x0014", "!Unknown 0x0015", "!Unknown 0x0016", "!Unknown 0x0017", "!Unknown 0x0018", "!Unknown 0x0019", "!Unknown 0x001A", "!Unknown 0x001B", "!Unknown 0x001C", "!Unknown 0x001D", "!Unknown 0x001E", "!Unknown 0x001F",
		"!Unknown 0x0020", "!Unknown 0x0021", "!Unknown 0x0022", "!Unknown 0x0023", "!Unknown 0x0024", "!Unknown 0x0025", "!Unknown 0x0026", "!Unknown 0x0027", "!Unknown 0x0028", "!Unknown 0x0029", "!Unknown 0x002A", "!Unknown 0x002B", "!Unknown 0x002C", "!Unknown 0x002D", "!Unknown 0x002E", "!Unknown 0x002F",
		"!Unknown 0x0030", "!Unknown 0x0031", "!Unknown 0x0032", "!Unknown 0x0033", "!Unknown 0x0034", "!Unknown 0x0035", "!Unknown 0x0036", "!Unknown 0x0037", "!Unknown 0x0038", "!Unknown 0x0039", "!Unknown 0x003A", "!Unknown 0x003B", "!Unknown 0x003C", "!Unknown 0x003D", "!Unknown 0x003E", "!Unknown 0x003F",
		"!Unknown 0x0040", "!Unknown 0x0041", "!Unknown 0x0042", "!Unknown 0x0043", "!Unknown 0x0044", "!Unknown 0x0045", "!Unknown 0x0046", "!Unknown 0x0047", "!Unknown 0x0048", "!Unknown 0x0049", "!Unknown 0x004A", "!Unknown 0x004B", "!Unknown 0x004C", "!Unknown 0x004D", "!Unknown 0x004E", "!Unknown 0x004F",
		"!Unknown 0x0050", "!Unknown 0x0051", "!Unknown 0x0052", "!Unknown 0x0053", "!Unknown 0x0054", "!Unknown 0x0055", "!Unknown 0x0056", "!Unknown 0x0057", "!Unknown 0x0058", "!Unknown 0x0059", "!Unknown 0x005A", "!Unknown 0x005B", "!Unknown 0x005C", "!Unknown 0x005D", "!Unknown 0x005E", "!Unknown 0x005F",
		"!Unknown 0x0060", "!Unknown 0x0061", "!Unknown 0x0062", "!Unknown 0x0063", "!Unknown 0x0064", "!Unknown 0x0065", "!Unknown 0x0066", "!Unknown 0x0067", "!Unknown 0x0068", "!Unknown 0x0069", "!Unknown 0x006A", "!Unknown 0x006B", "!Unknown 0x006C", "!Unknown 0x006D", "!Unknown 0x006E", "!Unknown 0x006F",
		"!Unknown 0x0070", "!Unknown 0x0071", "!Unknown 0x0072", "!Unknown 0x0073", "!Unknown 0x0074", "!Unknown 0x0075", "!Unknown 0x0076", "!Unknown 0x0077", "!Unknown 0x0078", "!Unknown 0x0079", "!Unknown 0x007A", "!Unknown 0x007B", "!Unknown 0x007C", "!Unknown 0x007D", "!Unknown 0x007E", "!Unknown 0x007F",
		"!Unknown 0x0080", "!Unknown 0x0081", "!Unknown 0x0082", "!Unknown 0x0083", "!Unknown 0x0084", "!Unknown 0x0085", "!Unknown 0x0086", "!Unknown 0x0087", "!Unknown 0x0088", "!Unknown 0x0089", "!Unknown 0x008A", "!Unknown 0x008B", "!Unknown 0x008C", "!Unknown 0x008D", "!Unknown 0x008E", "!Unknown 0x008F",
		"!Unknown 0x0090", "!Unknown 0x0091", "!Unknown 0x0092", "!Unknown 0x0093", "!Unknown 0x0094", "!Unknown 0x0095", "!Unknown 0x0096", "!Unknown 0x0097", "!Unknown 0x0098", "!Unknown 0x0099", "!Unknown 0x009A", "!Unknown 0x009B", "!Unknown 0x009C", "!Unknown 0x009D", "!Unknown 0x009E", "!Unknown 0x009F",
		"!Unknown 0x00A0",

		"Cutscene - Two Years have passed..",
		"Cutscene - Hag 1 Arrives",
		"Cutscene - Arrival of Mingella & Blobbelda",
		"Cutscene - Revival of Gruntilda",
		"Cutscene - Gruntilda casts the spell",
		"Cutscene - Hag 1 leaves",
		"Cutscene - Banjo vows to defeat Grunty",
		"Cutscene - Playing Poker",
		"Cutscene - Earthquake",
		"Cutscene - Mumbo takes a look outside",
		"Cutscene - Mumbo warns Banjo & Bottles",
		"Cutscene - Banjo's house is destroyed",

		"SM - Grunty's Lair",
		"SM - Behind the waterfall",
		"SM - Spiral Mountain",

		"!Crash 0x00B0", "!Crash 0x00B1", "!Unknown 0x00B2", "!Crash 0x00B3", "!Unknown 0x00B4", "!Crash 0x00B5",

		"MT - Wumba's Wigwam",
		"MT - Mumbo's Skull",
		"MT",
		"MT - Prison Compound",
		"MT - Columns Vault",
		"MT - Mayan Kickball Stadium (Lobby)",
		"MT - Code Chamber",

		"!Crash 0x00BD", "!Crash 0x00BE", "!Unknown 0x00BF",
		"!Crash 0x00C0", "!Crash 0x00C1", "!Crash 0x00C2", "!Crash 0x00C3",

		"MT - Jade Snake Grove",
		"MT - Treasure Chamber",
		"MT - Kickball Arena 1",
		"GGM",
		"MT - Kickball Arena 2",
		"MT - Kickball Arena 3",
		"GGM - Fuel Depot",
		"GGM - Crushing Shed",
		"GGM - Flooded Caves",
		"GGM - Water Storage",
		"GGM - Waterfall Cavern",
		"GGM - Power Hut Basement",
		"GGM - Chuffy's Cab",
		"GGM - Inside Chuffy's Boiler",
		"GGM - Gloomy Caverns",
		"GGM - Generator Cavern",
		"GGM - Power Hut",
		"WW - Wumba's Wigwam",
		"WW",
		"GGM - Train Station",
		"GGM - Prospector's Hut",
		"GGM - Mumbo's Skull",
		"GGM - Toxic Gas Cave",
		"GGM - Canary Cave",
		"GGM - Ordnance Storage",
		"WW - Dodgem Dome Lobby",
		"WW - Dodgem Challenge 1 vs 1",
		"WW - Dodgem Challenge 2 vs 1",
		"WW - Dodgem Challenge 3 vs 1",
		"WW - Crazy Castle Stockade",
		"WW - Crazy Castle Lobby",
		"WW - Crazy Castle Pump Room",
		"WW - Balloon Burst Game",
		"WW - Hoop Hurry",
		"WW - Star Spinner",
		"WW - The Inferno",

		"!Crash 0x00E8",

		"GGM - Wumba's Wigwam",
		"WW - Cave of Horrors",
		"WW - Haunted Cavern",
		"WW - Train Station",
		"JRL - Jolly's",
		"JRL - Pawno's Emporium",
		"JRL - Mumbo's Skull",

		"!Crash 0x00F0",

		"JRL - Inside the UFO",

		"!Unknown 0x00F2", "!Crash 0x00F3",

		"JRL - Ancient Swimming Baths",

		"!Crash 0x00F5",

		"JRL - Electric Eel's lair",
		"JRL - Seaweed Sanctum",
		"JRL - Inside the Big Fish",
		"WW - Mr. Patch",
		"JRL - Temple of the Fishes",

		"!Crash 0x00FB",

		"JRL - Lord Woo Fak Fak",

		"!Crash 0x00FD", "!Crash 0x00FE",

		"JRL - Blubber's Wave Race Hire",
		"GI",
		"GI - Floor 1",
		"GI - Train Station",
		"GI - Workers' Quarters",
		"GI - Trash Compactor",
		"GI - Elevator shaft",
		"GI - Floor 2",
		"GI - Floor 2 (Electromagnet Chamber)",
		"GI - Floor 3",
		"GI - Floor 3 (Boiler Plant)",
		"GI - Floor 3 (Packing Room)",
		"GI - Floor 4",
		"GI - Floor 4 (Cable Room)",
		"GI - Floor 4 (Quality Control)",
		"GI - Floor 5",
		"GI - Basement",
		"GI - Basement (Repair Depot)",
		"GI - Basement (Waste Disposal)",
		"TDL",
		"TDL - Terry's Nest",
		"TDL - Train Station",
		"TDL - Oogle Boogles' Cave",
		"TDL - Inside the Mountain",
		"TDL - River Passage",
		"TDL - Styracosaurus Family Cave",
		"TDL - Unga Bunga's Cave",
		"TDL - Stomping Plains",
		"TDL - Bonfire Cavern",

		"!Crash 0x011C", "!Crash 0x011D",

		"TDL - Wumba's Wigwam (Small)",
		"GI - Wumba's Wigwam",
		"JRL - Wumba's Wigwam",
		"GGM - Inside Chuffy's Wagon",
		"TDL - Wumba's Wigwam (Big)",
		"TDL - Inside Chompa's Belly",
		"WW - Saucer of Peril",
		"GI - Water Supply Pipe",
		"GGM - Water Supply Pipe",
		"HFP - Lava Side",
		"HFP - Icy Side",
		"HFP - Lava Train Station",
		"HFP - Ice Train Station",
		"HFP - Chilli Billi",
		"HFP - Chilly Willy",
		"HFP - Kickball Stadium lobby",
		"HFP - Kickball Stadium 1",
		"HFP - Kickball Stadium 2",
		"HFP - Kickball Stadium 3",
		"HFP - Boggy's Igloo",
		"HFP - Icicle Grotto",
		"HFP - Inside the Volcano",
		"HFP - Mumbo's Skull",
		"HFP - Wumba's Wigwam",
		"CCL",
		"CCL - Inside the Trash Can",
		"CCL - Inside the Cheese Wedge",
		"CCL - Zubbas' Nest",
		"CCL - Central Cavern",
		"WW - Crazy Castle Stockade (Saucer)",
		"WW - Star Spinner (Saucer)",
		"CCL - Inside the Pot o' Gold",
		"CCL - Mumbo's Skull",
		"CCL - Mingy Jongo's Skull",
		"CCL - Wumba's Wigwam",
		"SM - Inside the Digger Tunnel",
		"JV",
		"JV - Bottles' House",
		"JV - King Jingaling's Throne Room",
		"JV - Green Jinjo's house",
		"JV - Black Jinjo's house",
		"JV - Yellow Jinjo's house",
		"JV - Blue Jinjo's house",

		"!Crash 0x0149", -- Unused Jinjo House? https://tcrf.net/Banjo-Tooie

		"JV - Brown Jinjo's house",
		"JV - Orange Jinjo's house",
		"JV - Purple Jinjo's house",
		"JV - Red Jinjo's house",
		"JV - White Jinjo's house",
		"IoH - Wooded Hollow",
		"IoH - Heggy's Egg Shed",
		"IoH - Jiggywiggy's Temple",
		"IoH - Plateau",
		"IoH - Plateau - Honey B's Hive",
		"IoH - Pine Grove",
		"IoH - Cliff Top",
		"IoH - Cliff Top - Mumbo's Skull",
		"IoH - Pine Grove - Wumba's Wigwam",
		"Game Select Screen",
		"Cutscene - Opening cutscene",
		"IoH - Wasteland",
		"IoH - Inside another digger tunnel",
		"IoH - Quagmire",
		"CK",
		"CK - The Gatehouse",
		"CK - Tower of Tragedy",
		"CK - Gun Chamber",
		"CCL - Canary Mary Race",
		"GI - Floor 4 (Clinker's Cavern)",
		"GGM - Ordnance Storage Entrance",
		"GI - Clinker's Cavern (multiplayer)",
		"GGM - Ordnance Storage (multiplayer)",
		"MT - Targitzan's Temple (multiplayer)",
		"MT - (character parade)",
		"HFP - Icy Side (character parade)",
		"JV - Bottles' House (character parade)",
		"CK - Gun Chamber (character parade)",

		"!Crash 0x016B", "!Crash 0x016C", "!Crash 0x016D", "!Crash 0x016E",

		"GGM - Canary Mary Race (1)",
		"GGM - Canary Mary Race (2)",
		"TDL - Mumbo's Skull",
		"GI - Mumbo's Skull",
		"SM - Banjo's House",

		"!Crash 0x0174", "!Crash 0x0175",

		"WW - Mumbo's Skull",
		"MT - Targitzan's Slightly Sacred Chamber",
		"MT - Inside Targitzan's Temple",
		"MT - Targitzan's Temple Lobby",
		"MT - Targitzan's Really Sacred Chamber",
		"WW - Balloon burst (multiplayer)",
		"WW - Jump the Hoops (multiplayer)",
		"GI - Packing Game",
		"Cutscene - Zombified Throne Room",
		"MT - Kickball Arena 4",
		"HFP - Kickball Arena",
		"JRL - Sea Bottom Cavern",
		"JRL - Submarine (multiplayer)",
		"TDL - Chompa's Belly (multiplayer)",

		"!Crash 0x0184",

		"CCL - Trash Can Mini",
		"WW - Dodgems",
		"GI - Sewer Entrance",
		"CCL - Zubbas' Nest (multiplayer)",
		"CK - Tower of Tragedy Quiz (Multiplayer)",
		"CK - Inside HAG 1",
		"Intro Screen",
		"Cutscene - Introduction to B.O.B.",
		"Cutscene - Jingaling Zapped",
		"Cutscene - Meanwhile.... Jingaling Zapping",
		"Cutscene - B.O.B preparing to fire",
		"Cutscene - Jingaling Getting Zapped",
		"Cutscene - Sad Party at Bottles'",
		"Cutscene - Bottles Eating Burnt Food",
		"Cutscene - Bottles' energy restoring",
		"Cutscene - Banjo and Kazooie Running Into Gun Chamber",
		"Cutscene - Banjo and Kazooie at B.O.B's controls",
		"Cutscene - Kick About",
		"Cutscene - `I wonder what we'll hit...` Kazooie",
		"Cutscene - Jingaling Restoring",
		"Cutscene - All Jinjos Happy Again",

		"CK - HAG 1",
		"JV - Jingaling's Zombified Palace",

		"Cutscene - Roll the credits",
		"Cutscene - Character Parade",

		"!Crash 0x019E", "!Crash 0x019F", "!Unknown 0x01A0", "!Unknown 0x01A1", "!Unknown 0x01A2", "!Unknown 0x01A3", "!Unknown 0x01A4", "!Unknown 0x01A5",

		"JRL - Smuggler's cavern",
		"JRL",
		"JRL - Atlantis",
		"JRL - Sea Bottom",
	},
	Memory = { -- Version order: Australia, Europe, Japan, USA
		consumable_base = {0x11FFB0, 0x120170, 0x115340, 0x11B080},
		consumable_pointer = {0x12FFC0, 0x1301D0, 0x125420, 0x12B250},
		object_array_pointer = {0x13BBD0, 0x13BE60, 0x131020, 0x136EE0},
		player_pointer = {0x13A210, 0x13A4A0, 0x12F660, 0x135490},
		player_pointer_index = {0x13A25F, 0x13A4EF, 0x12F6AF, 0x1354DF},
		global_flag_base = {0x131500, 0x131790, 0x126950, 0x12C780},
		camera_pointer_pointer = {0x12C478, 0x12C688, 0x1218D8, 0x127728},
		air = {0x12FDC0, 0x12FFD0, 0x125220, 0x12B050},
		frame_timer = {0x083550, 0x083550, 0x0788F8, 0x079138},
		linked_list_root = {0x13C380, 0x13C680, 0x131850, 0x137800},
		map = {0x137B42, 0x137DD2, 0x12CF92, 0x132DC2},
		map_trigger_target = {0x12C390, 0x12C5A0, 0x1217F0, 0x127640},
		map_trigger = {0x12C392, 0x12C5A2, 0x1217F2, 0x127642},
		map_destination = {0x044E32, 0x044E32, 0x044EB2, 0x045702},
		DCW_location = {0x12C33A, 0x12C54A, 0x12179A, 0x1275EA},
		character_state = {0x13BC53, 0x13BEE3, 0x1310A3, 0x136F63},
		character_change = {0x12BD9C, 0x12BFAC, 0x1211FC, 0x12704C},
		iconAddress = {0x11FF95, 0x120155, 0x115325, 0x11B065},
		animation_pointer = {0x13BB60, 0x13BDF0, 0x130FB0, 0x136E70},
	},
	defaultFloor = -18000,
	speedy_speeds = { .001, .01, .1, 1, 5, 10, 20, 50, 100 },
	speedy_index = 7,
	rot_speed = 10,
	max_rot_units = 360,
};

local function checksumToString(checksum)
	return toHexString(checksum[1], 8)..toHexString(checksum[2], 8, "");
end

local function readChecksum(address)
	return {memory.read_u32_be(address, "EEPROM"), memory.read_u32_be(address + 4, "EEPROM")};
end

local function checksumsMatch(checksum1, checksum2)
	return checksum1[1] == checksum2[1] and checksum1[2] == checksum2[2];
end

local eep_checksum = {
	{ address = 0x78, value = {0, 0} }, -- Global Flags (1)
	{ address = 0xF8, value = {0, 0} }, -- Global Flags (2)
	{ address = 0x2B8, value = {0, 0} }, -- Save Slot 1
	{ address = 0x478, value = {0, 0} }, -- Save Slot 2
	{ address = 0x638, value = {0, 0} }, -- Save Slot 3
	{ address = 0x7F8, value = {0, 0} }, -- Save Slot 4
};

--------------------
-- Region/Version --
--------------------

function Game.detectVersion(romName, romHash)
	-- Read EEPROM checksums
	for i = 1, #eep_checksum do
		eep_checksum[i].value = readChecksum(eep_checksum[i].address);
	end

	-- Squish Game.Memory tables down to a single address for the relevant version
	for k, v in pairs(Game.Memory) do
		if k == "healthAddresses" then
			for key, value in pairs(Game.Memory[k]) do
				Game.Memory[k][key] = value[Game.version];
			end
		else
			Game.Memory[k] = v[Game.version];
		end
	end

	return true;
end

-------------------
-- Physics/Scale --
-------------------

function Game.isPhysicsFrame()
	local frameTimerValue = mainmemory.read_s32_be(Game.Memory.frame_timer);
	return frameTimerValue <= 0 and not emu.islagged();
end

function Game.getFrameRate()
	local numerator = 60;
	if Game.version < 3 then -- PAL
		numerator = 50;
	end
	local denominator = math.max(1, mainmemory.read_s32_be(Game.Memory.frame_timer + 4));
	return numerator / denominator;
end

-------------------
-- Player object --
-------------------

-- Relative to objects in linked list, including player
local previous_item = 0x00;
local next_item = 0x04;

local floor_pointer_index = 37 * 4;
local slope_pointer_index = 40 * 4;
local velocity_pointer_index = 50 * 4;
local rot_x_pointer_index = 55 * 4;
local position_pointer_index = 57 * 4;
local rot_z_pointer_index = 61 * 4;
local rot_y_pointer_index = 62 * 4;
local movement_state_pointer_index = 72 * 4;
local grounded_pointer_index = 84 * 4;
local animation_pointer_index = 104 * 4;

-- Relative to Position object
local x_pos = 0x00;
local y_pos = 0x04;
local z_pos = 0x08;

-- Relative to Rot X object
local x_rot_current = 0x00;
local x_rot_target = 0x04;

-- Relative to Rot Y object
local facing_angle = 0x00;
local moving_angle = 0x04;
local y_rot_current = 0x00;
local y_rot_target = 0x04;

-- Relative to Rot Z object
local z_rot_current = 0x00;
local z_rot_target = 0x04;

-- Relative to Slope object
local slope_timer = 0x38;

-- Relative to Velocity object
local x_velocity = 0x10;
local y_velocity = 0x14;
local z_velocity = 0x18;
local gravity = 0x34;
local terminal_velocity = 0x38;

function Game.getPlayerObject()
	local playerPointerIndex = mainmemory.readbyte(Game.Memory.player_pointer_index);
	return dereferencePointer(Game.Memory.player_pointer + 4 * playerPointerIndex);
end

function Game.getCameraObject()
	local cameraPointerPointer = dereferencePointer(Game.Memory.camera_pointer_pointer);
	if isRDRAM(cameraPointerPointer) then
		return dereferencePointer(cameraPointerPointer + 4);
	end
end

function Game.getPlayerSubObject(index)
	local player = Game.getPlayerObject();
	if isRDRAM(player) then
		return dereferencePointer(player + index);
	end
end

function Game.getCameraSubObject(index)
	local camera = Game.getCameraObject();
	if isRDRAM(camera) then
		return dereferencePointer(camera + index);
	end
end

function output_objects()
	local playerObject = Game.getPlayerObject();
	if isRDRAM(playerObject) then
		dprint("Player: "..toHexString(playerObject, nil, ""));
		dprint("Position: "..toHexString(dereferencePointer(playerObject + position_pointer_index), nil, ""));
		dprint("Rot X: "..toHexString(dereferencePointer(playerObject + rot_x_pointer_index), nil, ""));
		dprint("Rot Y: "..toHexString(dereferencePointer(playerObject + rot_y_pointer_index), nil, ""));
		dprint("Rot Z: "..toHexString(dereferencePointer(playerObject + rot_z_pointer_index), nil, ""));
		dprint("Slope: "..toHexString(dereferencePointer(playerObject + slope_pointer_index), nil, ""));
		dprint("Velocity: "..toHexString(dereferencePointer(playerObject + velocity_pointer_index), nil, ""));
		dprint("Movement State: "..toHexString(dereferencePointer(playerObject + movement_state_pointer_index), nil, ""));
		print_deferred();
	else
		print("Can't get a read...");
	end
end

----------------
-- Jinjo Dump --
----------------

local JinjoAddresses = {
	{{0x11FA71, 0x11FC31, 0x114E01, 0x11AB41}, "MT: Jade Snake Grove"},
	{{0x11FA74, 0x11FC34, 0x114E04, 0x11AB44}, "MT: Roof of Stadium"},
	{{0x11FA77, 0x11FC37, 0x114E07, 0x11AB47}, "MT: Targitzan's Temple"},
	{{0x11FA7A, 0x11FC3A, 0x114E0A, 0x11AB4A}, "MT: Pool of Water"},
	{{0x11FA7D, 0x11FC3D, 0x114E0D, 0x11AB4D}, "MT: Bridge"},
	{{0x11FA80, 0x11FC40, 0x114E10, 0x11AB50}, "GGM: Water Storage"},
	{{0x11FA83, 0x11FC43, 0x114E13, 0x11AB53}, "GGM: Jail"},
	{{0x11FA86, 0x11FC46, 0x114E16, 0x11AB56}, "GGM: Toxic Gas Cave"},
	{{0x11FA89, 0x11FC49, 0x114E19, 0x11AB59}, "GGM: Boulder"},
	{{0x11FA8C, 0x11FC4C, 0x114E1C, 0x11AB5C}, "GGM: Mine Tracks"},
	{{0x11FA8F, 0x11FC4F, 0x114E1F, 0x11AB5F}, "WW: Big Top"},
	{{0x11FA92, 0x11FC52, 0x114E22, 0x11AB62}, "WW: Cave of Horrors"},
	{{0x11FA95, 0x11FC55, 0x114E25, 0x11AB65}, "WW: Van Door"},
	{{0x11FA98, 0x11FC58, 0x114E28, 0x11AB68}, "WW: Dodgem Dome"},
	{{0x11FA9B, 0x11FC5B, 0x114E2B, 0x11AB6B}, "WW: Cactus of Strength"},
	{{0x11FA9E, 0x11FC5E, 0x114E2E, 0x11AB6E}, "JRL: Lagoon Alcove"},
	{{0x11FAA1, 0x11FC61, 0x114E31, 0x11AB71}, "JRL: Blubber"},
	{{0x11FAA4, 0x11FC64, 0x114E34, 0x11AB74}, "JRL: Big Fish"},
	{{0x11FAA7, 0x11FC67, 0x114E37, 0x11AB77}, "JRL: Seaweed Sanctum"},
	{{0x11FAAA, 0x11FC6A, 0x114E3A, 0x11AB7A}, "JRL: Sunken Ship"},
	{{0x11FAAD, 0x11FC6D, 0x114E3D, 0x11AB7D}, "TDL: Talon Torpedo"},
	{{0x11FAB0, 0x11FC70, 0x114E40, 0x11AB80}, "TDL: Cutscene Skip"},
	{{0x11FAB3, 0x11FC73, 0x114E43, 0x11AB83}, "TDL: Beside Rocknut"},
	{{0x11FAB6, 0x11FC76, 0x114E46, 0x11AB86}, "TDL: Big T. Rex Skip"},
	{{0x11FAB9, 0x11FC79, 0x114E49, 0x11AB89}, "TDL: Stomping Plains"},
	{{0x11FABC, 0x11FC7C, 0x114E4C, 0x11AB8C}, "GI: Floor 5"},
	{{0x11FABF, 0x11FC7F, 0x114E4F, 0x11AB8F}, "GI: Leg Spring"},
	{{0x11FAC2, 0x11FC82, 0x114E52, 0x11AB92}, "GI: Toxic Waste"},
	{{0x11FAC5, 0x11FC85, 0x114E55, 0x11AB95}, "GI: Boiler Plant"},
	{{0x11FAC8, 0x11FC88, 0x114E58, 0x11AB98}, "GI: Outside"},
	{{0x11FACB, 0x11FC8B, 0x114E5B, 0x11AB9B}, "HFP: Lava Waterfall"},
	{{0x11FACE, 0x11FC8E, 0x114E5E, 0x11AB9E}, "HFP: Boiling Hot Pool"},
	{{0x11FAD1, 0x11FC91, 0x114E61, 0x11ABA1}, "HFP: Windy Hole"},
	{{0x11FAD4, 0x11FC94, 0x114E64, 0x11ABA4}, "HFP: Icicle Grotto"},
	{{0x11FAD7, 0x11FC97, 0x114E67, 0x11ABA7}, "HFP: Mildred Ice Cube"},
	{{0x11FADA, 0x11FC9A, 0x114E6A, 0x11ABAA}, "CCL: Trash Can"},
	{{0x11FADD, 0x11FC9D, 0x114E6D, 0x11ABAD}, "CCL: Cheese Wedge"},
	{{0x11FAE0, 0x11FCA0, 0x114E70, 0x11ABB0}, "CCL: Central Cavern"},
	{{0x11FAE3, 0x11FCA3, 0x114E73, 0x11ABB3}, "CCL: Mingy Jongo"},
	{{0x11FAE6, 0x11FCA6, 0x114E76, 0x11ABB6}, "CCL: Wumba's"},
	{{0x11FAE9, 0x11FCA9, 0x114E79, 0x11ABB9}, "IoH: Wooded Hollow"},
	{{0x11FAEC, 0x11FCAC, 0x114E7C, 0x11ABBC}, "IoH: Wasteland"},
	{{0x11FAEF, 0x11FCAF, 0x114E7F, 0x11ABBF}, "IoH: Cliff Top"},
	{{0x11FAF2, 0x11FCB2, 0x114E82, 0x11ABC2}, "IoH: Plateau"},
	{{0x11FAF5, 0x11FCB5, 0x114E85, 0x11ABC5}, "IoH: Spiral Mountain"},
};

local JinjoColors = {
	[0] = "White",
	[1] = "Orange",
	[2] = "Yellow",
	[3] = "Brown",
	[4] = "Green",
	[5] = "Red",
	[6] = "Blue",
	[7] = "Purple",
	[8] = "Black",
};

local knownPatterns = { -- To test for more patterns: Freeze u32_be 0x12C7F0 at a desired value and create a new file then run isKnownPattern(), tested up to 0xFF inclusive
	{0, 1, 8, 7, 1, 6, 6, 4, 2, 2, 2, 3, 4, 3, 6, 3, 4, 5, 4, 4, 3, 5, 6, 8, 5, 5, 5, 6, 7, 8, 6, 8, 8, 7, 7, 6, 7, 8, 5, 7, 7, 8, 8, 8, 7}, -- 1
	{0, 2, 2, 4, 7, 3, 7, 2, 6, 4, 8, 3, 4, 3, 7, 6, 5, 5, 8, 6, 6, 4, 8, 3, 1, 5, 5, 5, 5, 1, 6, 7, 4, 6, 6, 7, 7, 7, 8, 7, 8, 8, 8, 8, 8},
	{0, 2, 5, 2, 1, 1, 6, 3, 6, 3, 7, 3, 7, 2, 7, 6, 3, 8, 7, 6, 8, 7, 7, 7, 7, 4, 5, 5, 4, 6, 5, 8, 6, 4, 5, 8, 8, 6, 5, 8, 4, 4, 8, 8, 8},
	{0, 3, 6, 5, 8, 8, 4, 8, 5, 8, 7, 2, 6, 8, 1, 1, 8, 3, 8, 4, 6, 2, 7, 6, 6, 7, 2, 4, 3, 7, 7, 6, 5, 3, 6, 5, 4, 8, 7, 8, 5, 5, 7, 7, 4},
	{0, 4, 7, 3, 1, 4, 5, 4, 3, 2, 4, 8, 7, 3, 5, 8, 1, 2, 3, 8, 6, 4, 8, 5, 8, 2, 6, 6, 5, 7, 8, 5, 5, 7, 8, 6, 7, 7, 6, 8, 8, 7, 7, 6, 6},
	{0, 6, 6, 1, 3, 5, 7, 3, 4, 7, 5, 6, 4, 8, 7, 8, 5, 5, 4, 8, 1, 2, 3, 2, 3, 2, 4, 7, 4, 8, 8, 8, 7, 7, 6, 7, 5, 8, 5, 7, 6, 8, 8, 6, 6},
	{0, 7, 5, 8, 4, 6, 4, 1, 6, 5, 3, 6, 4, 1, 3, 8, 6, 2, 7, 2, 5, 5, 2, 4, 4, 6, 5, 3, 7, 8, 3, 5, 8, 7, 8, 6, 7, 7, 8, 8, 6, 7, 8, 8, 7},
	{1, 6, 7, 3, 0, 7, 8, 6, 1, 6, 5, 6, 3, 5, 5, 5, 4, 6, 3, 7, 4, 8, 2, 5, 3, 8, 7, 7, 4, 8, 6, 5, 4, 8, 8, 4, 7, 8, 8, 6, 2, 8, 7, 2, 7},
	{2, 1, 2, 1, 5, 3, 6, 8, 7, 8, 2, 7, 7, 7, 4, 3, 7, 4, 5, 8, 5, 6, 3, 0, 8, 4, 4, 4, 8, 6, 6, 8, 6, 3, 6, 8, 5, 5, 6, 5, 7, 7, 7, 8, 8},
	{2, 2, 1, 8, 6, 5, 1, 2, 8, 6, 3, 5, 4, 5, 4, 7, 7, 6, 0, 4, 6, 4, 3, 7, 7, 3, 5, 5, 3, 4, 8, 5, 8, 7, 7, 7, 6, 8, 7, 6, 8, 6, 8, 8, 8}, -- 10
	{2, 4, 0, 5, 7, 6, 5, 5, 4, 2, 4, 3, 7, 7, 5, 6, 2, 8, 8, 7, 4, 6, 4, 3, 1, 6, 6, 6, 6, 7, 3, 5, 1, 3, 8, 5, 7, 7, 7, 8, 8, 8, 8, 8, 8},
	{2, 4, 6, 7, 0, 3, 7, 8, 6, 4, 7, 5, 7, 2, 7, 1, 1, 3, 3, 6, 2, 8, 5, 8, 4, 3, 8, 8, 6, 7, 5, 4, 8, 6, 6, 6, 5, 8, 4, 7, 7, 8, 8, 5, 5},
	{2, 6, 5, 5, 2, 1, 7, 1, 6, 0, 3, 4, 7, 2, 6, 5, 4, 5, 3, 5, 5, 4, 7, 3, 6, 3, 8, 8, 4, 7, 7, 7, 6, 8, 8, 6, 4, 8, 7, 6, 8, 7, 8, 8, 8},
	{2, 8, 4, 3, 3, 2, 2, 4, 4, 7, 5, 1, 1, 3, 8, 4, 6, 3, 7, 5, 7, 6, 8, 4, 5, 8, 7, 5, 0, 7, 5, 8, 5, 6, 7, 6, 6, 7, 8, 6, 7, 8, 8, 8, 6},
	{3, 4, 7, 0, 7, 2, 3, 8, 2, 2, 4, 7, 1, 6, 7, 5, 3, 5, 7, 3, 7, 5, 8, 7, 5, 4, 8, 6, 4, 6, 1, 7, 4, 8, 8, 8, 8, 8, 6, 8, 5, 6, 5, 6, 6},
	{3, 6, 6, 7, 8, 3, 7, 2, 5, 3, 8, 8, 7, 7, 2, 2, 8, 5, 6, 7, 8, 5, 0, 7, 6, 4, 7, 7, 8, 4, 1, 1, 5, 8, 4, 6, 6, 5, 8, 4, 3, 8, 4, 5, 6},
	{3, 8, 5, 5, 0, 4, 3, 6, 8, 4, 4, 5, 3, 6, 4, 8, 4, 1, 8, 1, 3, 5, 6, 2, 8, 2, 6, 8, 6, 5, 8, 6, 7, 2, 8, 5, 8, 6, 7, 7, 7, 7, 7, 7, 7},
	{4, 1, 1, 5, 4, 8, 4, 2, 6, 3, 5, 4, 7, 6, 6, 6, 7, 5, 2, 3, 6, 2, 5, 3, 3, 8, 4, 6, 5, 6, 5, 0, 8, 7, 7, 8, 7, 7, 7, 7, 8, 8, 8, 8, 8},
	{4, 3, 0, 2, 5, 1, 8, 5, 8, 2, 8, 6, 2, 4, 1, 7, 6, 6, 8, 4, 5, 4, 7, 6, 5, 6, 3, 6, 7, 6, 3, 8, 4, 3, 7, 7, 5, 8, 8, 5, 7, 8, 8, 7, 7},
	{4, 8, 2, 7, 3, 7, 0, 8, 3, 1, 7, 4, 6, 1, 4, 5, 8, 2, 2, 7, 3, 6, 6, 4, 6, 8, 5, 5, 4, 3, 7, 7, 7, 6, 7, 8, 5, 5, 6, 8, 8, 8, 8, 6, 5}, -- 20
	{5, 1, 2, 7, 1, 2, 5, 3, 0, 7, 2, 5, 8, 8, 3, 5, 7, 7, 3, 7, 6, 8, 7, 4, 8, 4, 3, 8, 6, 8, 5, 4, 6, 8, 7, 8, 6, 8, 5, 7, 4, 6, 4, 6, 6},
	{5, 3, 1, 5, 3, 3, 0, 6, 3, 7, 7, 6, 6, 6, 5, 1, 2, 8, 8, 8, 2, 5, 2, 4, 8, 8, 6, 5, 5, 6, 4, 6, 4, 8, 4, 8, 4, 8, 7, 7, 8, 7, 7, 7, 7},
	{5, 3, 7, 6, 5, 6, 6, 8, 7, 4, 1, 1, 8, 4, 0, 6, 5, 3, 7, 6, 3, 5, 5, 6, 7, 2, 8, 3, 6, 2, 4, 5, 7, 4, 8, 7, 2, 4, 7, 7, 8, 8, 8, 8, 8},
	{5, 5, 6, 4, 6, 7, 1, 2, 1, 5, 6, 2, 5, 5, 2, 0, 5, 4, 3, 7, 3, 8, 6, 7, 8, 3, 7, 3, 6, 6, 6, 4, 7, 7, 7, 7, 4, 8, 4, 8, 8, 8, 8, 8, 8},
	{5, 7, 5, 2, 7, 8, 5, 6, 4, 6, 2, 3, 3, 7, 0, 4, 1, 4, 7, 4, 3, 6, 1, 5, 7, 7, 5, 7, 2, 5, 8, 7, 3, 4, 8, 6, 6, 6, 6, 8, 8, 8, 8, 8, 8},
	{5, 8, 3, 0, 1, 6, 6, 6, 4, 1, 4, 5, 6, 2, 4, 2, 6, 5, 4, 8, 3, 7, 7, 5, 2, 5, 7, 3, 8, 8, 5, 7, 6, 4, 8, 7, 6, 8, 7, 3, 7, 8, 7, 8, 8},
	{7, 0, 2, 4, 8, 5, 8, 3, 5, 8, 7, 7, 4, 4, 8, 4, 3, 3, 3, 4, 6, 8, 1, 8, 1, 5, 6, 5, 6, 7, 6, 5, 8, 2, 2, 5, 8, 6, 8, 6, 7, 6, 7, 7, 7},
	{7, 2, 1, 2, 0, 7, 3, 6, 8, 4, 8, 5, 1, 5, 2, 6, 4, 7, 3, 8, 3, 5, 5, 3, 4, 6, 7, 5, 4, 8, 5, 4, 7, 8, 7, 7, 6, 7, 6, 6, 8, 6, 8, 8, 8},
	{7, 3, 0, 8, 2, 8, 7, 2, 1, 3, 7, 4, 3, 5, 2, 1, 6, 4, 6, 7, 4, 6, 7, 6, 6, 7, 3, 5, 4, 5, 4, 8, 8, 8, 6, 7, 8, 5, 8, 7, 6, 5, 8, 5, 8},
	{7, 5, 5, 8, 5, 3, 8, 6, 8, 7, 8, 5, 2, 1, 4, 4, 3, 5, 5, 0, 6, 3, 8, 4, 3, 8, 4, 8, 7, 8, 4, 1, 2, 2, 6, 7, 6, 7, 8, 7, 6, 7, 7, 6, 6}, -- 30
	{7, 5, 7, 6, 3, 0, 2, 4, 4, 1, 5, 2, 4, 5, 6, 1, 4, 7, 5, 5, 8, 3, 8, 8, 8, 8, 2, 6, 7, 3, 7, 5, 3, 8, 4, 6, 7, 6, 8, 8, 8, 6, 7, 6, 7},
	{7, 7, 4, 6, 7, 4, 3, 0, 2, 8, 4, 6, 7, 8, 6, 3, 4, 8, 2, 8, 1, 6, 1, 8, 8, 7, 6, 8, 4, 8, 2, 6, 3, 8, 5, 3, 6, 5, 5, 7, 7, 5, 5, 7, 5},
	{7, 7, 6, 4, 5, 1, 6, 7, 7, 2, 1, 3, 7, 0, 4, 6, 7, 7, 7, 3, 6, 5, 2, 6, 2, 3, 5, 6, 4, 3, 4, 4, 8, 8, 8, 6, 5, 8, 8, 5, 8, 8, 8, 5, 8},
};

function getCurrentPattern()
	local pattern = {};
	for i = 1, #JinjoAddresses do
		table.insert(pattern, mainmemory.readbyte(JinjoAddresses[i][1][Game.version]));
	end
	return pattern;
end

-- TODO: Output Jinjo colours & locations in a more readable format
function printCurrentPattern()
	local patternString = "{";
	local pattern = getCurrentPattern();
	for i = 1, #pattern do
		patternString = patternString..pattern[i]..", ";
	end
	print(patternString.."},");
end

function isKnownPattern()
	local currentPattern = getCurrentPattern();
	for i = 1, #knownPatterns do
		local patternMatch = true;
		for j = 1, #currentPattern do
			if currentPattern[j] ~= knownPatterns[i][j] then
				patternMatch = false;
			end
		end
		if patternMatch then
			return tostring(true).." index: "..i;
		end
	end
	console.clear();
	printCurrentPattern();
	return false;
end

-----------------
-- Randomizers --
-----------------

-- TODO: Randomizer stuff, read set patterns from flags
function outputRandomizerPattern(randomizerType)
	if randomizerType == "Jinjo" then
		print("Outputting Jinjo Randomizer");
	elseif randomizerType == "Klungo" then
		print("Outputting Klungo Randomizer");
	elseif randomizerType == "Boggy" then
		print("Outputting Boggy Randomizer");
	elseif randomizerType == "Prison Compound" then
		print("Outputting Prison Compound Randomizer");
	end
end

--------------
-- Position --
--------------

function Game.getXPosition()
	local positionObject = Game.getPlayerSubObject(position_pointer_index);
	if isRDRAM(positionObject) then
		return mainmemory.readfloat(positionObject + x_pos, true);
	end
	return 0;
end

function Game.getYPosition()
	local positionObject = Game.getPlayerSubObject(position_pointer_index);
	if isRDRAM(positionObject) then
		return mainmemory.readfloat(positionObject + y_pos, true);
	end
	return 0;
end

function Game.getZPosition()
	local positionObject = Game.getPlayerSubObject(position_pointer_index);
	if isRDRAM(positionObject) then
		return mainmemory.readfloat(positionObject + z_pos, true);
	end
	return 0;
end

function Game.setXPosition(value)
	local positionObject = Game.getPlayerSubObject(position_pointer_index);
	if isRDRAM(positionObject) then
		mainmemory.writefloat(positionObject + x_pos, value, true);
		mainmemory.writefloat(positionObject + x_pos + 12, value, true);
		mainmemory.writefloat(positionObject + x_pos + 24, value, true);
	end
end

function Game.setYPosition(value)
	local positionObject = Game.getPlayerSubObject(position_pointer_index);
	if isRDRAM(positionObject) then
		mainmemory.writefloat(positionObject + y_pos, value, true);
		mainmemory.writefloat(positionObject + y_pos + 12, value, true);
		mainmemory.writefloat(positionObject + y_pos + 24, value, true);
		Game.setYVelocity(0);
	end
end

function Game.setZPosition(value)
	local positionObject = Game.getPlayerSubObject(position_pointer_index);
	if isRDRAM(positionObject) then
		mainmemory.writefloat(positionObject + z_pos, value, true);
		mainmemory.writefloat(positionObject + z_pos + 12, value, true);
		mainmemory.writefloat(positionObject + z_pos + 24, value, true);
	end
end

function Game.getPredictedYPosition()
	local frameRate = Game.getFrameRate();
	local currentGravity = Game.getGravity() / frameRate;
	return Game.getYPosition() + ((Game.getYVelocity() + currentGravity) / frameRate);
end

--------------
-- Velocity --
--------------

function Game.getXVelocity()
	local velocityObject = Game.getPlayerSubObject(velocity_pointer_index);
	if isRDRAM(velocityObject) then
		return mainmemory.readfloat(velocityObject + x_velocity, true);
	end
	return 0;
end

function Game.getYVelocity()
	local velocityObject = Game.getPlayerSubObject(velocity_pointer_index);
	if isRDRAM(velocityObject) then
		return mainmemory.readfloat(velocityObject + y_velocity, true);
	end
	return 0;
end

function Game.getZVelocity()
	local velocityObject = Game.getPlayerSubObject(velocity_pointer_index);
	if isRDRAM(velocityObject) then
		return mainmemory.readfloat(velocityObject + z_velocity, true);
	end
	return 0;
end

function Game.getVelocity() -- Calculated VXZ
	local vX = Game.getXVelocity();
	local vZ = Game.getZVelocity();
	return math.sqrt(vX*vX + vZ*vZ);
end

-- Divide by framerate for change to velocity per frame
function Game.getGravity()
	local velocityObject = Game.getPlayerSubObject(velocity_pointer_index);
	if isRDRAM(velocityObject) then
		return mainmemory.readfloat(velocityObject + gravity, true);
	end
	return 0;
end

function Game.getTerminalVelocity()
	local velocityObject = Game.getPlayerSubObject(velocity_pointer_index);
	if isRDRAM(velocityObject) then
		return mainmemory.readfloat(velocityObject + terminal_velocity, true);
	end
	return 0;
end

function Game.getFloor()
	local floorObject = Game.getPlayerSubObject(floor_pointer_index);
	if isRDRAM(floorObject) then
		floorObject = dereferencePointer(floorObject); -- Gotta dereference again
		if isRDRAM(floorObject) then
			return mainmemory.readfloat(floorObject + 0x70, true);
		end
	end
	return 0;
end

function Game.setXVelocity(value)
	local velocityObject = Game.getPlayerSubObject(velocity_pointer_index);
	if isRDRAM(velocityObject) then
		mainmemory.writefloat(velocityObject + x_velocity, value, true);
	end
end

function Game.setYVelocity(value)
	local velocityObject = Game.getPlayerSubObject(velocity_pointer_index);
	if isRDRAM(velocityObject) then
		mainmemory.writefloat(velocityObject + y_velocity, value, true);
	end
end

function Game.setZVelocity(value)
	local velocityObject = Game.getPlayerSubObject(velocity_pointer_index);
	if isRDRAM(velocityObject) then
		mainmemory.writefloat(velocityObject + z_velocity, value, true);
	end
end

--------------
-- Rotation --
--------------

function Game.getXRotation()
	local rotationObject = Game.getPlayerSubObject(rot_x_pointer_index);
	if isRDRAM(rotationObject) then
		return mainmemory.readfloat(rotationObject + x_rot_current, true);
	end
	return 0;
end

function Game.getYRotation()
	local rotationObject = Game.getPlayerSubObject(rot_y_pointer_index);
	if isRDRAM(rotationObject) then
		return mainmemory.readfloat(rotationObject + facing_angle, true);
	end
	return 0;
end

function Game.getMovingAngle()
	local rotationObject = Game.getPlayerSubObject(rot_y_pointer_index);
	if isRDRAM(rotationObject) then
		return mainmemory.readfloat(rotationObject + moving_angle, true);
	end
	return 0;
end

function Game.getZRotation()
	local rotationObject = Game.getPlayerSubObject(rot_z_pointer_index);
	if isRDRAM(rotationObject) then
		return mainmemory.readfloat(rotationObject + z_rot_current, true);
	end
	return 0;
end

function Game.setXRotation(value)
	local rotXObject = Game.getPlayerSubObject(rot_x_pointer_index);
	if isRDRAM(rotXObject) then
		mainmemory.writefloat(rotXObject + x_rot_current, value, true);
		mainmemory.writefloat(rotXObject + x_rot_target, value, true);
	end
end

function Game.setYRotation(value)
	local rotYObject = Game.getPlayerSubObject(rot_y_pointer_index);
	if isRDRAM(rotYObject) then
		mainmemory.writefloat(rotYObject + facing_angle, value, true);
		mainmemory.writefloat(rotYObject + moving_angle, value, true);
	end
end

function Game.setZRotation(value)
	local rotZObject = Game.getPlayerSubObject(rot_z_pointer_index);
	if isRDRAM(rotZObject) then
		mainmemory.writefloat(rotZObject + z_rot_current, value, true);
		mainmemory.writefloat(rotZObject + z_rot_target, value, true);
	end
end

----------------
-- Never Slip --
----------------

local function neverSlip()
	local slope_object = Game.getPlayerSubObject(slope_pointer_index);
	if isRDRAM(slope_object) then
		mainmemory.writefloat(slope_object + slope_timer, 0.0, true);
	end
end

function Game.getSlopeTimer()
	local slope_object = Game.getPlayerSubObject(slope_pointer_index);
	if isRDRAM(slope_object) then
		return mainmemory.readfloat(slope_object + slope_timer, true);
	end
	return 0;
end

function Game.colorSlopeTimer()
	if ScriptHawk.UI.ischecked("toggle_neverslip") then
		return colors.blue;
	end
	local slopeTimer = Game.getSlopeTimer();
	if slopeTimer >= 0.75 then
		return getColor(slopeTimer);
	end
end

---------------------
-- Camera Position --
---------------------

camera_lock = {
	x = 0,
	y = 0,
	z = 0,
	enabled = false,
};

function Game.enableCameraLock()
	camera_lock.x = Game.getCameraXPosition();
	camera_lock.y = Game.getCameraYPosition();
	camera_lock.z = Game.getCameraZPosition();
	camera_lock.enabled = true;
end

function Game.disableCameraLock()
	camera_lock.enabled = false;
end

function Game.toggleCameraLock()
	if camera_lock.enabled then
		Game.disableCameraLock();
	else
		Game.enableCameraLock();
	end
end

function Game.getCameraXPosition()
	local cameraObject = Game.getCameraObject();
	if isRDRAM(cameraObject) then
		return mainmemory.readfloat(cameraObject + 0x74, true);
	end
	return 0;
end

function Game.getCameraYPosition()
	local cameraObject = Game.getCameraObject();
	if isRDRAM(cameraObject) then
		return mainmemory.readfloat(cameraObject + 0x78, true);
	end
	return 0;
end

function Game.getCameraZPosition()
	local cameraObject = Game.getCameraObject();
	if isRDRAM(cameraObject) then
		return mainmemory.readfloat(cameraObject + 0x7C, true);
	end
	return 0;
end

function Game.setCameraXPosition(value)
	local cameraObject = Game.getCameraObject();
	if isRDRAM(cameraObject) then
		mainmemory.writefloat(cameraObject + 0x74, value, true);
	end
end

function Game.setCameraYPosition(value)
	local cameraObject = Game.getCameraObject();
	if isRDRAM(cameraObject) then
		mainmemory.writefloat(cameraObject + 0x78, value, true);
	end
end

function Game.setCameraZPosition(value)
	local cameraObject = Game.getCameraObject();
	if isRDRAM(cameraObject) then
		mainmemory.writefloat(cameraObject + 0x7C, value, true);
	end
end

-----------------
-- Moves stuff --
-----------------

local movementStates = {
	[0x00] = "Null",
	
};

function Game.getCurrentMovementState()
	local movementStateObject = Game.getPlayerSubObject(movement_state_pointer_index);
	if isRDRAM(movementStateObject) then
		return mainmemory.read_u32_be(movementStateObject + 4);
	end
	return 0;
end

function Game.getCurrentMovementStateOSD()
	local movementState = Game.getCurrentMovementState();
	return movementStates[movementState] or toHexString(movementState);
end

function Game.getPreviousMovementState()
	local movementStateObject = Game.getPlayerSubObject(movement_state_pointer_index);
	if isRDRAM(movementStateObject) then
		return mainmemory.read_u32_be(movementStateObject + 0);
	end
	return 0;
end

function Game.getPreviousMovementStateOSD()
	local movementState = Game.getPreviousMovementState();
	return movementStates[movementState] or toHexString(movementState);
end

function Game.setMovementState(state)
	local movementStateObject = Game.getPlayerSubObject(movement_state_pointer_index);
	if isRDRAM(movementStateObject) then
		mainmemory.write_u32_be(movementStateObject + 4, state);
	end
end

function Game.playerIsGrounded()
	local playerGroundedObject = Game.getPlayerSubObject(grounded_pointer_index);
	if isRDRAM(playerGroundedObject) then
		return mainmemory.readbyte(playerGroundedObject + 2) == 1;
	end
	return false;
end

---------------------
-- Animation Stuff --
---------------------

local animationList = {
	[0x00] = "Null",
	
};

function Game.getAnimationValue()
	local animationPointer = Game.getPlayerSubObject(animation_pointer_index);
	if isRDRAM(animationPointer) then
		return mainmemory.read_u16_be(animationPointer + 0x34);
	end
	return 0;
end

function Game.getAnimationOSD()
	local animationValue = Game.getAnimationValue();
	return animationList[animationValue] or toHexString(animationValue);
end

function Game.setAnimationValue(value)
	local animationPointer = Game.getPlayerSubObject(animation_pointer_index);
	if isRDRAM(animationPointer) then
		mainmemory.write_u16_be(animationPointer + 0x34, value);
	end
end

function Game.getAnimationAddress()
	local animationPointer = Game.getPlayerSubObject(animation_pointer_index);
	if isRDRAM(animationPointer) then
		return toHexString(animationPointer + 0x34);
	end
end

--------------
-- Autojump --
--------------

local holdingAPostJump = false;
function autoJump()
	local currentMovementState = Game.getCurrentMovementState();
	local YVelocity = Game.getYVelocity();

	-- Frame perfect mid air talon trot slide jump
	if (currentMovementState == 0x15 and not Game.playerIsGrounded()) or holdingAPostJump then
		holdingAPostJump = true;
		if holdingAPostJump then
			holdingAPostJump = holdingAPostJump and (currentMovementState == 0x15 or YVelocity > 0); -- TODO: Better method for detecting end of a jump, velocity > 0 is janky
		end
		joypad.set({A=true}, 1);
	end
end

------------
-- Health --
------------

function Game.getCurrentHealth()
	local currentTransformation = mainmemory.readbyte(Game.Memory.iconAddress);
	if type(Game.Memory.healthAddresses[currentTransformation]) == 'number' then
		return mainmemory.read_u8(Game.Memory.healthAddresses[currentTransformation]);
	end
	return 1;
end

function Game.setCurrentHealth(value)
	local currentTransformation = mainmemory.readbyte(Game.Memory.iconAddress);
	if type(Game.Memory.healthAddresses[currentTransformation]) == 'number' then
		value = value or 0;
		value = math.max(0x00, value);
		value = math.min(0xFF, value);
		return mainmemory.write_u8(Game.Memory.healthAddresses[currentTransformation], value);
	end
end

function Game.getMaxHealth()
	local currentTransformation = mainmemory.readbyte(Game.Memory.iconAddress);
	if type(Game.Memory.healthAddresses[currentTransformation]) == 'number' then
		return mainmemory.read_u8(Game.Memory.healthAddresses[currentTransformation] + 1);
	end
	return 1;
end

function Game.setMaxHealth(value)
	local currentTransformation = mainmemory.readbyte(Game.Memory.iconAddress);
	if type(Game.Memory.healthAddresses[currentTransformation]) == 'number' then
		value = value or 0;
		value = math.max(0x00, value);
		value = math.min(0xFF, value);
		return mainmemory.write_u8(Game.Memory.healthAddresses[currentTransformation] + 1, value);
	end
end

function dumpPointerListStrings()
	local object;
	local index = 0;
	repeat
		object = dereferencePointer(0x126738 + index * 4);
		if isRDRAM(object) then
			local string, checkPointer;
			local checkPointerOffset = 0x3C;
			repeat
				checkPointerOffset = checkPointerOffset + 4;
				checkPointer = dereferencePointer(object + checkPointerOffset);
			until not isRDRAM(checkPointer);
			string = readNullTerminatedString(object + checkPointerOffset);

			print(index.." "..toHexString(object)..": "..string); -- TODO: dprint
		end
		index = index + 1;
	until not isRDRAM(object);
end

-----------
-- Flags --
-----------

local global_flag_block_cache = {};
local flag_block_cache = {};
function clearFlagCache()
	global_flag_block_cache = {};
	flag_block_cache = {};
end

local global_flag_names = {};
local flags_by_address = {};
local flag_names = {};

for i = 1, #flag_array do
	if not flag_array[i].ignore then
		flag_names[i] = flag_array[i].name;
	end
	if flags_by_address[flag_array[i].byte] == nil then
		flags_by_address[flag_array[i].byte] = {};
	end
	flags_by_address[flag_array[i].byte][flag_array[i].bit] = flag_array[i];
end

for i = 0, flag_block_size - 1 do
	if type(flags_by_address[i]) ~= "table" then
		flags_by_address[i] = {};
	end
end

for i = 1, #global_flag_array do
	if not global_flag_array[i].ignore then
		global_flag_names[i] = global_flag_array[i].name;
	end
end

function isKnown(byte, bit)
	return flags_by_address[byte][bit] ~= nil;
end

function getFlagName(byte, bit)
	local flag = flags_by_address[byte][bit];
	if type(flag) == "table" then
		return flag.name;
	end
	return "Unknown at "..toHexString(byte)..">"..bit;
end

local function getFlagByName(flagName)
	for i = 1, #flag_array do
		if flagName == flag_array[i].name then
			return flag_array[i];
		end
	end
end

function setFlagByName(name)
	local flag = getFlagByName(name);
	if type(flag) == "table" then
		setFlag(flag.byte, flag.bit);
	end
end

function clearFlagByName(name)
	local flag = getFlagByName(name);
	if type(flag) == "table" then
		clearFlag(flag.byte, flag.bit);
	end
end

function checkFlagByName(name, suppressPrint)
	local flag = getFlagByName(name);
	if type(flag) == "table" then
		return checkFlag(flag.byte, flag.bit, suppressPrint);
	end
	return false;
end

function toggleFlagByName(name)
	if checkFlagByName(name, true) then
		clearFlagByName(name);
	else
		setFlagByName(name);
	end
end

function setFlagsByType(_type)
	if type(_type) == "string" then
		if _type == "Note" then
			setFlagsByType("Nest");
			setFlagsByType("Treble Clef");
			return;
		end
		local numSet = 0;
		for i = 1, #flag_array do
			if flag_array[i].type == _type then
				setFlag(flag_array[i].byte, flag_array[i].bit, true);
				numSet = numSet + 1;
			end
		end
		if numSet > 0 then
			print("Set "..numSet.." flags of type '".._type.."'");
		else
			print("No flags found of type '".._type.."'");
		end
	end
end

function clearFlag(byte, bit)
	if type(byte) == "number" and type(bit) == "number" and bit >= 0 and bit < 8 then
		local flags = dereferencePointer(Game.Memory.flag_block_pointer);
		if isRDRAM(flags) then
			local currentValue = mainmemory.readbyte(flags + byte);
			mainmemory.writebyte(flags + byte, clear_bit(currentValue, bit));
		end
	end
end

function clearFlagsByType(_type)
	if type(_type) == "string" then
		if _type == "Note" then
			clearFlagsByType("Nest");
			clearFlagsByType("Treble Clef");
			return;
		end
		local numSet = 0;
		for i = 1, #flag_array do
			if flag_array[i].type == _type then
				clearFlag(flag_array[i].byte, flag_array[i].bit, true);
				numSet = numSet + 1;
			end
		end
		if numSet > 0 then
			print("Cleared "..numSet.." flags of type '".._type.."'");
		else
			print("No flags found of type '".._type.."'");
		end
	end
end

function setFlag(byte, bit)
	if type(byte) == "number" and type(bit) == "number" and bit >= 0 and bit < 8 then
		local flags = dereferencePointer(Game.Memory.flag_block_pointer);
		if isRDRAM(flags) then
			local currentValue = mainmemory.readbyte(flags + byte);
			mainmemory.writebyte(flags + byte, set_bit(currentValue, bit));
		end
	end
end

function clearAllFlags()
	local flagBlock = dereferencePointer(Game.Memory.flag_block_pointer);
	if isRDRAM(flagBlock) then
		for byte = 0, flag_block_size - 1 do
			mainmemory.writebyte(flagBlock + byte, 0x00);
		end
	end
end

function setAllFlags()
	local flagBlock = dereferencePointer(Game.Memory.flag_block_pointer);
	if isRDRAM(flagBlock) then
		for byte = 0, flag_block_size - 1 do
			mainmemory.writebyte(flagBlock + byte, 0xFF);
		end
	end
end

function checkFlag(byte, bit, suppressPrint)
	if type(byte) == "string" then
		local flag = getFlagByName(byte);
		if type(flag) == "table" then
			byte = flag.byte;
			bit = flag.bit;
		end
	end
	if type(byte) == "number" and type(bit) == "number" and bit >= 0 and bit < 8 then
		local flagBlock = dereferencePointer(Game.Memory.flag_block_pointer);
		if isRDRAM(flagBlock) then
			local currentValue = mainmemory.readbyte(flagBlock + byte);
			if check_bit(currentValue, bit) then
				if not suppressPrint then
					print(getFlagName(byte, bit).." is SET");
				end
				return true;
			else
				if not suppressPrint then
					print(getFlagName(byte, bit).." is NOT set");
				end
				return false;
			end
		end
	else
		if not suppressPrint then
			print("Warning: Flag not found");
		end
	end
	return false;
end

function checkFlags()
	local flags = dereferencePointer(Game.Memory.flag_block_pointer);
	if isRDRAM(flags) then
		local flagBlock = mainmemory.readbyterange(flags, flag_block_size);

		if #flag_block_cache == flag_block_size - 1 then
			local currentValue, previousValue, isSet, wasSet;
			local changeDetected = false;
			for byte = 0, flag_block_size - 1 do
				currentValue = flagBlock[byte];
				previousValue = flag_block_cache[byte];
				if currentValue ~= previousValue then
					for _bit = 0, 7 do
						isSet = bit.check(currentValue, _bit);
						wasSet = bit.check(previousValue, _bit);
						if isSet and not wasSet then
							if isKnown(byte, _bit) then
								local flag = flags_by_address[byte][_bit];
								if not flag.ignore then
									changeDetected = true;
									dprint("Flag "..toHexString(byte, 2)..">".._bit..': "'..getFlagName(byte, _bit)..'" was set on frame '..emu.framecount());
								end
							else
								changeDetected = true;
								dprint("{byte="..toHexString(byte, 2)..", bit=".._bit..', name="Name"},');
							end
						elseif not isSet and wasSet then
							if isKnown(byte, _bit) then
								local flag = flags_by_address[byte][_bit];
								if not flag.ignore then
									changeDetected = true;
									dprint("Flag "..toHexString(byte, 2)..">".._bit..': "'..getFlagName(byte, _bit)..'" was cleared on frame '..emu.framecount());
								end
							else
								changeDetected = true;
								dprint("Flag "..toHexString(byte, 2)..">".._bit..': "'..getFlagName(byte, _bit)..'" was cleared on frame '..emu.framecount());
							end
						end
					end
				end
			end
			if changeDetected then
				flag_block_cache = flagBlock;
				print_deferred();
			end
		else
			flag_block_cache = flagBlock;
			print("Populated flag block cache");
		end
	end
end

local function formatOutputString(caption, value, max)
	return caption..value.."/"..max.." or "..round(value / max * 100, 2).."%";
end

function flagStats(verbose)
	local abilitiesKnown = 0;
	local cheatoPagesKnown = 0; local maxCheatoPages = 25;
	local glowbosKnown = 0; local maxGlowbos = 17;
	local honeycombsKnown = 0; local maxHoneycombs = 25;
	local jiggiesKnown = 0; local maxJiggies = 90;
	local jinjosKnown = 0; local maxJinjos = 45;
	local notesKnown = 0; local maxNotes = 900;
	local silosKnown = 0; local maxSilos = 7;
	local warpsKnown = 0; local maxWarps = 39; -- I think this is right?

	local untypedFlags = 0;
	local flagsWithUnknownType = 0;
	local flagsWithMap = 0;

	-- Setting this to true warns the user of flags without types
	verbose = verbose or false;

	local flag, name, flagType, validType;
	for i = 1, #flag_array do
		flag = flag_array[i];
		name = flag.name;
		flagType = flag.type;
		validType = false;
		if flagType == "Ability" then
			abilitiesKnown = abilitiesKnown + 1;
			validType = true;
		elseif flagType == "Cheato Page" then
			cheatoPagesKnown = cheatoPagesKnown + 1;
			validType = true;
		elseif flagType == "Glowbo" then
			glowbosKnown = glowbosKnown + 1;
			validType = true;
		elseif flagType == "Honeycomb" then
			honeycombsKnown = honeycombsKnown + 1;
			validType = true;
		elseif flagType == "Jiggy" then
			jiggiesKnown = jiggiesKnown + 1;
			validType = true;
		elseif flagType == "Jinjo" then
			jinjosKnown = jinjosKnown + 1;
			validType = true;
		elseif flagType == "Nest" then
			notesKnown = notesKnown + 5;
			validType = true;
		elseif flagType == "Silo" then
			silosKnown = silosKnown + 1;
			validType = true;
		elseif flagType == "Treble Clef" then
			notesKnown = notesKnown + 20;
			validType = true;
		elseif flagType == "Warp" then
			warpsKnown = warpsKnown + 1;
			validType = true;
		end
		if flagType == nil then
			untypedFlags = untypedFlags + 1;
			if verbose then
				dprint("Warning: Flag without type at "..toHexString(flag.byte, 2)..">"..flag.bit..' with name: "'..name..'"');
			end
		else
			if flagType == "Cheat" then
				validType = true;
			elseif flagType == "Cutscene" then
				validType = true;
			elseif flagType == "Doubloon" then
				validType = true;
			elseif flagType == "FTT" then
				validType = true;
			elseif flagType == "Glowbo Paid" then
				validType = true;
			elseif flagType == "Mumbo's Magic" then
				validType = true;
			elseif flagType == "Physical" then
				validType = true;
			elseif flagType == "Progress" then
				validType = true;
			elseif flagType == "Targitzan Statue" then
				validType = true;
			elseif flagType == "Unknown" then
				validType = true;
			end
			if not validType then
				flagsWithUnknownType = flagsWithUnknownType + 1;
				if verbose then
					dprint("Warning: Flag with unknown type at "..toHexString(flag.byte, 2)..">"..flag.bit..' with name: "'..name..'"'..' and type: "'..flagType..'"');
				end
			end
		end
		if flag.map ~= nil or flag.nomap == true then
			flagsWithMap = flagsWithMap + 1;
		elseif verbose then
			--dprint("Warning: Flag without map tag at "..toHexString(flag.byte, 2)..">"..flag.bit..' with name: "'..name..'"');
		end
	end

	local knownFlags = #flag_array;
	local totalFlags = flag_block_size * 8;

	dprint("Block size: "..toHexString(flag_block_size));
	dprint(formatOutputString("Flags known: ", knownFlags, totalFlags));
	dprint(formatOutputString("Without types: ", untypedFlags, knownFlags));
	dprint(formatOutputString("Unknown types: ", flagsWithUnknownType, knownFlags));
	dprint(formatOutputString("With map tag: ", flagsWithMap, knownFlags));
	dprint("");
	dprint(formatOutputString("Jiggies: ", jiggiesKnown, maxJiggies));
	dprint(formatOutputString("Jinjos: ", jinjosKnown, maxJinjos));
	dprint(formatOutputString("Notes: ", notesKnown, maxNotes));
	dprint("");
	dprint("Abilities: "..abilitiesKnown);
	dprint(formatOutputString("Cheato Pages: ", cheatoPagesKnown, maxCheatoPages));
	dprint(formatOutputString("Honeycombs: ", honeycombsKnown, maxHoneycombs));
	dprint(formatOutputString("Glowbos: ", glowbosKnown, maxGlowbos));
	dprint(formatOutputString("Silos: ", silosKnown, maxSilos));
	dprint(formatOutputString("Warps: ", warpsKnown, maxWarps));
	dprint("");
	print_deferred();
end

local function flagSetButtonHandler()
	setFlagByName(forms.getproperty(ScriptHawk.UI.form_controls["Flag Dropdown"], "SelectedItem"));
end

local function flagClearButtonHandler()
	clearFlagByName(forms.getproperty(ScriptHawk.UI.form_controls["Flag Dropdown"], "SelectedItem"));
end

local function flagCheckButtonHandler()
	checkFlag(forms.getproperty(ScriptHawk.UI.form_controls["Flag Dropdown"], "SelectedItem"));
end

------------------
-- Global Flags --
------------------

function isKnownGlobal(byte, bit)
	for i = 1, #global_flag_array do
		if global_flag_array[i].byte == byte and global_flag_array[i].bit == bit then
			return true;
		end
	end
	return false;
end

function getGlobalFlag(byte, bit)
	for i = 1, #global_flag_array do
		if byte == global_flag_array[i].byte and bit == global_flag_array[i].bit then
			return global_flag_array[i];
		end
	end
end

function setGlobalFlag(byte, bit)
	if type(byte) == "number" and type(bit) == "number" and bit >= 0 and bit < 8 then
		local flags = Game.Memory.global_flag_base;
		if isRDRAM(flags) then
			local currentValue = mainmemory.readbyte(flags + byte);
			mainmemory.writebyte(flags + byte, set_bit(currentValue, bit));
		end
	end
end

function clearGlobalFlag(byte, bit)
	if type(byte) == "number" and type(bit) == "number" and bit >= 0 and bit < 8 then
		local flags = Game.Memory.global_flag_base;
		if isRDRAM(flags) then
			local currentValue = mainmemory.readbyte(flags + byte);
			mainmemory.writebyte(flags + byte, clear_bit(currentValue, bit));
		end
	end
end

function getGlobalFlagName(byte, bit)
	for i = 1, #global_flag_array do
		if byte == global_flag_array[i].byte and bit == global_flag_array[i].bit and not global_flag_array[i].ignore then
			return global_flag_array[i].name;
		end
	end
	return "Unknown at "..toHexString(byte)..">"..bit;
end

function checkGlobalFlags()
	local flags = Game.Memory.global_flag_base;
	local flagBlock = mainmemory.readbyterange(flags, global_flag_block_size);
	local currentValue, previousValue, isSet, wasSet, flag, ignore;
	for byte = 0, global_flag_block_size - 1 do
		currentValue = flagBlock[byte];
		previousValue = global_flag_block_cache[byte];
		if previousValue == nil then
			previousValue = currentValue;
		end
		for bit = 0, 7 do
			isSet = check_bit(currentValue, bit);
			wasSet = check_bit(previousValue, bit);
			flag = getGlobalFlag(byte, bit);
			ignore = type(flag) == "table" and flag.ignore;
			if not ignore then
				if isSet and not wasSet then
					if isKnownGlobal(byte, bit) then
						dprint("Global Flag "..toHexString(byte, 2)..">"..bit..': "'..flag.name..'" was set on frame '..emu.framecount());
					else
						dprint("{byte="..toHexString(byte, 2)..", bit="..bit..', name="Name"}, (GLOBAL)');
					end
				elseif not isSet and wasSet then
					dprint("Global Flag "..toHexString(byte, 2)..">"..bit..': "'..getGlobalFlagName(byte, bit)..'" was cleared on frame '..emu.framecount());
				end
			end
		end
	end
	global_flag_block_cache = flagBlock;
	print_deferred();
end

--------------------
-- Object Model 1 --
--------------------

local slot_base = 0x10;
local slot_size = 0x9C;
local object_index = 1;

local object_model1 = {
	id_struct = 0x00, -- Pointer
	x_position = 0x04, -- Float
	y_position = 0x08, -- Float
	z_position = 0x0C, -- Float
	scale = 0x38, -- Float
	y_rotation = 0x48, -- Float
	z_rotation = 0x4C, -- Float
	health = 0x5E; -- Byte
	jinjo_identifier = 0x6F; -- Byte
	--movement_state = 0x72; -- Byte
	animation_index = 0x8C; -- 2 Byte
	transparency = 0x9B, -- Byte
	models = {
		--TODO: Import list from
			-- http://thumbsupmaster.blogspot.com.au/p/banjo-tooie-image-modifications.html
			-- http://bsfree.shadowflareindustries.com/index.php?s=39&d=6&g=15729&c=72210
			-- https://www.youtube.com/watch?v=9DDV52RXyiM
			-- Wumba's Wigwam https://banjosbackpack.com/forums/showthread.php?8165-Wumba-s-Wigwam-BT-Setup-Viewer
			-- Possibly other sources
		[0x5DD] = "Sign", -- Pay Here

		[0x5E1] = "Lantern", -- GGM
		[0x5E7] = "1st Floor Sign",
		[0x5E8] = "2nd Floor Sign",
		[0x5E9] = "3rd Floor Sign",
		[0x5EA] = "4th Floor Sign",
		[0x5EB] = "5th Floor Sign",
		[0x5EC] = "Floating Barrel",
		[0x5EE] = "Boggy's Sled",

		[0x5F9] = "Bed", -- Opening CS
		[0x5FD] = "Door", -- Opening CS

		[0x610] = "Jiggy",
		[0x612] = "Empty Honeycomb",
		[0x615] = "Beehive",
		[0x616] = "Wading Boots",
		[0x617] = "Turbo Trainers",
		[0x61C] = "Kazooie", -- Character Parade

		[0x627] = "Missiles", -- Submarine Projectile
		[0x629] = "Molehill",
		[0x62A] = "Banjo-Kazooie", -- ToT
		[0x62B] = "Banjo-Kazooie", -- ToT Multiplayer
		[0x62C] = "Cheese Wedge",
		[0x62D] = "Jelly", -- Heart

		[0x635] = "Shock Spring Pad",
		[0x636] = "Fly Pad",
		[0x637] = "Shadow",
		[0x63B] = "Ice Key",
		[0x63E] = "Loggo",

		[0x641] = "Warp Pad",
		[0x643] = "Jinjo",
		[0x644] = "Star Pad", -- Prison Compound
		[0x645] = "Moon Pad", -- Prison Compound
		[0x646] = "Sun Pad", -- Prison Compound
		[0x647] = "Door", -- MT Prison Compound
		[0x648] = "Mumbo's Skull", -- GGM
		[0x649] = "Column", -- MT Prison Compound
		[0x64A] = "Column", -- MT Column Chamber
		[0x64C] = "Right Arm", -- Old King Coal
		[0x64D] = "Left Arm", -- Old King Coal
		[0x64F] = "Torso", -- Old King Coal

		[0x650] = "Old King Coal",
		[0x651] = "Breakable Door", -- MT Code Chamber
		[0x653] = "Door", -- Bottles after Credits
		[0x654] = "Mayan Door (Left)",
		[0x655] = "Mayan Door (Right",
		[0x656] = "Breakable Stone", -- Entrance to Prison Compound
		[0x657] = "Door", -- Relic Temple
		[0x658] = "Snake Head", -- MT
		[0x65D] = "Door", -- MT Kickball
		[0x65E] = "Gruntydactyl",
		[0x65F] = "Ssslumber",

		[0x660] = "Bovina",
		[0x661] = "Officer Unogopaz",
		[0x662] = "Globble", -- Fly, Bovina
		[0x663] = "Sput Sput",
		[0x664] = "Blowdart",
		[0x665] = "Mumbo", -- Also Mingy Jongo?
		[0x666] = "Snapdragon",
		[0x667] = "Moggy",
		[0x66A] = "Enemy Kickball Player",
		[0x66B] = "Chief Bloatazin",
		[0x66C] = "Generator",
		[0x66D] = "Dilberta",
		[0x66E] = "Dragunda",
		[0x66F] = "Diggit",

		[0x670] = "Yellow Ball", -- Kickball
		[0x671] = "Ugger",
		[0x672] = "Red Ball", -- Kickball
		[0x673] = "Golden Goliath",
		[0x675] = "Humba Wumba",
		[0x676] = "Stony", -- NPC
		[0x677] = "Bomb Ball", -- Kickball
		--[0x678] = "!Crash",
		--[0x679] = "!Crash",
		[0x67B] = "Canary Mary",
		[0x67C] = "Minecart", -- Canary Mary Race
		[0x67D] = "Cage", -- Canary Mary
		--[0x67E] = "!Crash",
		--[0x67F] = "!Crash",

		[0x680] = "Waterfall Grate Switch", -- GGM
		[0x681] = "Waterfall Grate", -- GGM
		[0x682] = "Boulder", -- Bill Drill
		[0x683] = "Crusher", -- Crushing Shed
		[0x684] = "Conveyor", -- Crushing Shed
		[0x685] = "Button (Wall)", -- GGM Crushing Shed
		[0x686] = "Grinder", -- GGM Crushing Shed
		[0x687] = "Jiggy Rock",
		[0x68B] = "Minecart", -- Broken
		[0x68C] = "Gas", -- Eg. Cheese Wedge
		[0x68F] = "Bang Box",

		[0x691] = "Saucer of Peril", -- In Box
		[0x692] = "Pile of Rocks", -- GGM
		[0x693] = "Conga",
		[0x697] = "Remains", -- Mingy Jongo
		[0x690] = "Saucer of Peril", -- Stationary/Kick about
		[0x698] = "Fish", -- Multiple
		[0x69D] = "Spell", -- Projectile, Mingy Jongo

		[0x6A1] = "TNT",
		[0x6A2] = "Rareware Box", -- SM
		[0x6A5] = "Jiggy Chunk", -- Crushed Jiggy Rock
		[0x6A6] = "Invisibility Honey",
		[0x6A7] = "Button (Floor)", -- Power Hut
		[0x6A8] = "Wooden Hut", -- GGM
		[0x6A9] = "Chuffy", -- Train
		[0x6AA] = "Gun Powder", -- JRL
		[0x6AB] = "Breakable Door", -- GGM Gloomy Caverns
		[0x6AC] = "Shadow", -- Crusher, Crushing Shed
		[0x6AD] = "Salty Joe",
		[0x6AE] = "Big Al",
		[0x6AF] = "Burger",

		[0x6B0] = "Fries",
		[0x6B1] = "Jippo Jim", -- Ringmaster
		[0x6B2] = "Jippo Jim", -- Frankenstein
		[0x6B3] = "Jippo Jim", -- Cowboy
		[0x6B4] = "Jippo Jim", -- Alien
		[0x6B6] = "Particles", -- Mumbo's Wand
		[0x6B7] = "Mrs. Boggy",
		[0x6B8] = "Hothead",
		[0x6B9] = "Pole Electricity",
		[0x6BA] = "Enemy Dodgem Car",
		[0x6BD] = "Bouncy Castle",
		[0x6BE] = "Ghost", -- WW Haunted Cavern

		[0x6C3] = "Pawno",
		[0x6C4] = "Cash Register", -- Pawno's Emporium
		[0x6C5] = "Big Fish",
		[0x6C6] = "Egg", -- Tiptup
		[0x6C7] = "Tiptup Jr.",
		[0x6C8] = "Tiptup",
		[0x6C9] = "Fruity",
		[0x6CA] = "Coin", -- Projectile, Fruity
		[0x6CB] = "Frazzle",
		[0x6CC] = "Scrut",
		[0x6CD] = "Alien",
		[0x6CE] = "Whirlweed",
		[0x6CF] = "Plant",

		[0x6D0] = "Inky",
		[0x6D1] = "Chris P. Bacon",
		[0x6D2] = "Blubbul",
		[0x6D3] = "Stomponadon",
		[0x6D4] = "Captain Blackeye",
		[0x6D5] = "Chompasaurus",
		[0x6D6] = "Jolly Roger",
		[0x6D7] = "Soarasaurs",
		[0x6D8] = "Merry Maggie Malpass",
		[0x6D9] = "Seemee Fish",
		[0x6DA] = "Terry",
		[0x6DC] = "Mucoid", -- Terry, Projectile
		[0x6DD] = "Mucoid", -- Terry
		[0x6DB] = "Captain Blubber",
		[0x6DE] = "Fish",

		[0x6E6] = "Swellbelly",
		[0x6E8] = "Stepping Stone",
		[0x6E9] = "Code Statues",
		[0x6EA] = "Nest (Eggs)",
		[0x6EC] = "Nest (Note)",
		[0x6ED] = "Nest (Treble Clef)",
		[0x6EF] = "Nest (Feathers)",

		[0x6F1] = "Fan", -- Water Supply
		[0x6F2] = "Wumba's Wigwam", -- TDL
		[0x6F3] = "Cage", -- Chris P. Bacon
		[0x6FA] = "Roysten",
		[0x6FB] = "Interactive Object", -- Inc. Warp Clouds, Fire places, UFO Ice Hole
		[0x6FC] = "UFO", -- Cutscene
		[0x6FE] = "Rareware Box",
		[0x6FF] = "Door", -- Chris P. Bacon entrance

		[0x700] = "Rareware Box",
		[0x701] = "Door", -- Madame Grunty's
		[0x702] = "Terry's Egg",
		[0x703] = "Small Pterodactyl",
		[0x704] = "Honeycomb",
		[0x705] = "Honeycomb (Skill/Random)",
		[0x706] = "Stegosaurus", -- Small
		[0x707] = "Klungo",
		[0x708] = "Potion", -- Yellow
		[0x709] = "Toxi-Gag",
		[0x70A] = "Electomagnet",
		[0x70B] = "Door", -- Electromagnet
		[0x70C] = "Door", -- Restricted Access
		[0x70D] = "Door", -- Exterior Jinjo Door GI
		[0x70E] = "Breakable Window", -- GI

		[0x710] = "Breakable Plate", -- GI

		[0x73F] = "Fish", -- Multiple, JRL

		[0x743] = "Spinning Light", -- GI
		[0x744] = "Industrial Fan", -- GI
		[0x745] = "Spinning Pipe", -- GI
		[0x746] = "Crusher", -- GI Trash Compactor
		[0x747] = "Crusher Arm", -- GI Trash Compactor
		[0x748] = "Door", -- Elevator GI
		[0x749] = "Button (Wall)", -- GI
		[0x74A] = "Crusher",
		[0x74B] = "Bridge", -- TDL Inside the Mountain

		[0x752] = "Button (Floor)", -- Shock Spring Spawn
		[0x753] = "Breakable Dirt", -- Terry
		[0x754] = "Button (Floor)", -- Cactus of Strength
		[0x755] = "Stadium Light", -- Mr. Patch
		[0x756] = "Shattered Shock Spring Pad",
		[0x757] = "Glass Box", -- Pawno's
		[0x759] = "Moggy", -- Boggy
		[0x75A] = "Soggy", -- Boggy
		[0x75B] = "Groggy", -- Boggy
		[0x75D] = "Ice", -- Ice Eggs on Enemies
		[0x75F] = "Breakable Gate", -- Talon Torpedo

		[0x760] = "Button (Floor)", -- Al's Burger
		[0x761] = "Breakable Gate", -- Talon Torpedo
		[0x762] = "Breakable Plate", -- JRL
		[0x763] = "Door", -- Jolly's
		[0x764] = "Pile of Dirt", -- JRL
		[0x765] = "Breakable Chest", -- JRL
		[0x766] = "Glowbo",
		[0x767] = "Door", -- Dodgem, 1
		[0x768] = "Door", -- Dodgem, 2
		[0x769] = "Door", -- Dodgem, 3
		[0x76A] = "Door", -- Saucer of Peril
		[0x76B] = "Zubba (Red)",
		[0x76C] = "Zubba (Green)",
		[0x76D] = "Zubba (Blue)",
		[0x76E] = "Red Mine",
		[0x76F] = "Green Mine",

		[0x770] = "Blue Mine",
		[0x774] = "Big Al's (Top)",
		[0x775] = "Salty Joe's (Top)",
		[0x776] = "Boxing Glove", -- Mr. Patch Fight
		[0x777] = "Planet", -- Star Spinner
		[0x778] = "Ring", -- Star Spinner
		[0x779] = "Spinning Star",
		[0x77A] = "Breakable Circuit", -- Star Spinner
		[0x77B] = "Door", -- GGM Old King Coal
		[0x77C] = "Bell", -- Cactus of Strength
		[0x77D] = "Cable Car",
		[0x77E] = "Inferno Door",
		[0x77F] = "Cable Car Button",

		[0x780] = "Electric Gates",
		[0x781] = "Gate", -- Bottle's House
		[0x782] = "Doors", -- WW Train Station
		[0x783] = "Doors", -- WW Train Station
		[0x784] = "Button (Giant T-Rex)", -- Caged Jinjo
		[0x786] = "Breakable Box", -- JRL
		[0x787] = "Cheato",
		[0x788] = "Gobi",
		[0x789] = "Billy Bob",
		[0x78A] = "Billy Bob (Inactive)",
		[0x78B] = "Breakable Door", -- WW Cave of Horrors
		[0x78C] = "Blue Balloon",
		[0x78D] = "Green Balloon",
		[0x78E] = "Cactus of Strength Bar",

		[0x790] = "Bullion Bill",
		[0x791] = "Box", -- GGM Prospector's Hut
		[0x793] = "Breakable Rock", -- MT
		[0x794] = "Mr. Patch",
		[0x795] = "Feet", -- Old King Coal
		[0x796] = "Red Balloon", -- Balloon Burst
		[0x79D] = "Electric Field",
		[0x79F] = "Screw",

		[0x7A0] = "Door", -- Crazy Castle
		[0x7A1] = "Red Hoop", -- Hoop Hurry
		[0x7A2] = "Signpost",
		[0x7A3] = "Door", -- GI Trash Compactor
		[0x7A4] = "Fries", -- Giving to Soggy/Caveman
		[0x7A5] = "Van Door",
		[0x7A6] = "Burger", -- Giving to Groggy/Caveman
		[0x7A7] = "Dingpot",
		[0x7A8] = "Falling Box",
		[0x7A9] = "Falling Platform",
		[0x7AA] = "Springy Step Shoes",
		[0x7AB] = "Service Elevator",
		[0x7AC] = "Ice Cube",
		[0x7AD] = "Screw Seal",
		[0x7AE] = "Gate", -- Metal
		[0x7AF] = "Breakable Door", -- GI Worker's Quarters

		[0x7B1] = "Icicle",
		[0x7B2] = "Icicle",
		[0x7B3] = "Icicle",
		[0x7B4] = "Icicle",
		[0x7B5] = "Icicle",
		[0x7B6] = "Icicle",
		[0x7B7] = "Icicle",
		[0x7B8] = "Button (Floor)", -- Solo Banjo
		[0x7B9] = "Button (Floor)", -- Solo Kazooie
		[0x7BA] = "Button (Floor)", -- Flight Pad
		[0X7BB] = "Fireball", -- HFP Volcano
		[0x7BF] = "Ticket", -- Big Top

		[0x7C0] = "Doubloon",
		[0x7C1] = "Button (Floor)", -- Toxic Waste
		[0x7C2] = "Barrier", -- Targitzan
		[0x7C3] = "Targitzan Base",
		[0x7C4] = "Gate", -- Crossed
		[0x7C5] = "Twinkly (Blue)",
		[0x7C6] = "Twinkly (Green)",
		[0x7C7] = "Twinkly (Red)",
		[0x7C8] = "Targitzan (part)",
		[0x7C9] = "Targitzan (part)",
		[0x7CA] = "Targitzan (part)",
		[0x7CB] = "Targitzan (part)",
		[0x7CC] = "Targitzan (top)",
		[0x7CD] = "Button (Floor)", -- Opens crossed gate
		[0x7CE] = "Button (Wall)", -- Opens crossed gate
		[0x7CF] = "Toxi-Klang", -- GI

		[0x7D0] = "Klang",
		[0x7D1] = "Tintup",
		[0x7D2] = "Silver Coin", -- Van
		[0x7D3] = "Toll Box", -- WW
		[0x7D4] = "Piggles", -- JRL Piglet
		[0x7D5] = "Trotty", -- JRL Piglet
		[0x7D6] = "Jamjars",
		[0x7D7] = "Silo", -- Jamjars
		[0x7D8] = "Green Mumbo Pad",
		[0x7D9] = "Blue Mumbo Pad",
		[0x7DA] = "Purple Mumbo Pad",
		[0x7DB] = "Yellow Mumbo pad",
		[0x7DC] = "Cyan Mumbo Pad",
		[0x7DD] = "Red Mumbo Pad",
		[0x7DE] = "Orange Mumbo Pad",
		[0x7DF] = "Grey Mumbo Pad",

		[0x7E0] = "Purple Mumbo Pad",
		[0x7E1] = "Kazooie Split Pad",
		[0x7E2] = "Banjo Split Pad",
		[0x7E3] = "Spy-I-Cam",
		[0x7E4] = "Bazza",
		[0x7E5] = "Oogle Boogle",
		[0x7E9] = "Dippy",
		[0x7EA] = "Nutta",
		[0x7EB] = "Washup",
		[0x7EC] = "Boltoid",
		[0x7ED] = "Ice", -- Sabreman
		[0x7EE] = "Unga Bunga",
		[0x7EF] = "Sabreman",

		[0x7F3] = "Cheato Page",
		[0x7F4] = "Targitzan",
		[0x7F5] = "Betette",
		[0x7F6] = "Alphette",
		[0x7F7] = "Gamette",
		[0x7F8] = "Ice", -- HFP
		[0x7F9] = "Lord Woo Fak Fak",
		[0x7FA] = "Baby T. Rex",
		[0x7FB] = "Glowing Light", -- Lord Woo Projectile
		[0x7FC] = "Chilli Billi",
		[0x7FD] = "Chilly Willy",
		[0x7FE] = "Keelhaul",
		[0x7FF] = "Guvnor", -- GI Worker Enemy

		[0x800] = "Washing Machine",
		[0x801] = "Cannon", -- Dragon Fights
		[0x802] = "Skivvy", -- GI Worker
		[0x803] = "Skivvy", -- GI Worker
		[0x804] = "Germ", -- Green
		[0x805] = "Germ", -- Red
		[0x806] = "Germ", -- Blue
		[0x807] = "Alien Dad",
		[0x808] = "Guffo",
		[0x809] = "Big T. Rex",
		[0x80A] = "Clockwork Kazooie",
		[0x80C] = "File Select (1)",
		[0x80D] = "File Select (2)",
		[0x80E] = "File Select (3)",
		[0x80F] = "Camera",

		[0x810] = "Video Player", -- Main Menu
		[0x811] = "Honeycomb Television",
		[0x812] = "N64 Console",
		[0x813] = "Dustbin", -- Main Menu
		[0x814] = "Ice Ball", -- Chilly Willy
		[0x815] = "Fire Ball", -- Chilli Billi
		[0x816] = "Mingy Jongo",
		[0x817] = "Weldar",
		[0x818] = "Flatso", -- Green
		[0x819] = "Flatso", -- Blue
		[0x81A] = "Flatso", -- Pink
		[0x81B] = "Energy Beam", -- Jiggywiggy's Temple
		[0x81C] = "Bigfoot",
		[0x81E] = "Biggafoot",

		[0x822] = "Klungo Shield",
		[0x823] = "Floor", -- Mingy Jongo cover to exit
		[0x824] = "Invisible Wall", -- Most Wumba's to cover secret passage
		[0x825] = "Red Target", -- Saucer of Peril
		[0x826] = "Green Target", -- Saucer of Peril
		[0x827] = "Blue Target", -- Saucer of Peril
		[0x828] = "Blue Dodgem Car",
		[0x82C] = "Dirt", -- CCL
		[0x82D] = "Pot O' Gold Button", -- CCL
		[0x82E] = "Door", -- Pot O' Gold
		[0x82F] = "Platform", -- Pot O'Gold

		[0x830] = "Protection Screen", -- Quality Control
		[0x832] = "Claw Clamber Boots",
		[0x837] = "Dart", -- Bee
		[0x83B] = "Skivvy", -- Embarrassed
		[0x83C] = "Overalls", -- Clean
		[0x83D] = "Overalls", -- GI Worker
		[0x83E] = "Golden Goliath", -- In Ground
		[0x83F] = "Door", -- Targitzan's Temple, Sacred

		[0x840] = "Door", -- Targitzan's Temple, Entrance
		[0x841] = "Door", -- Targitzan's Temple, Octagonal
		[0x842] = "Door", -- Targitzan's Temple, Green
		[0x843] = "Door", -- Targitzan's Temple, Brown
		[0x844] = "Door", -- Targitzan's Temple, Grey
		[0x845] = "Door", -- Targitzan's Temple, Blue
		[0x846] = "Door", -- Targitzan's Temple, Brown
		[0x847] = "Door", -- Targitzan's Temple, Red/Grey
		[0x848] = "Door", -- Targitzan's Temple, Golden
		[0x849] = "Door", -- Targitzan's Lobby
		[0x84B] = "Dynamite Ticker", -- Ordnance Storage
		[0x84C] = "Dynamite Remains", -- Ordnance Storage
		[0x84D] = "Clinker",
		[0x84F] = "Door", -- Entrance to Clinker's

		[0x850] = "Door", -- Ordnance Storage
		[0x854] = "Mumbo Jumbo",
		[0x85A] = "Press Start", -- Title Demos
		[0x85D] = "Big Tent",
		[0x85F] = "Zubba",

		[0x862] = "Banjo's Hand", -- File Select
		[0x863] = "Puzzle", -- Jiggywiggy
		[0x864]	= "Empty Puzzle", -- Jiggywiggy
		[0x867] = "Red Skull",
		[0x869] = "Door (Left)",
		[0x86A] = "Door (Right)",
		[0x86B] = "Weldar Head",
		[0x86C] = "Electricity Box",
		[0x86D] = "Train Station Switch", -- TDL
		[0x86E] = "Weldar Part",
		[0x86F] = "Weldar",

		[0x870] = "Weldar Head",
		[0x871] = "Electrical Component", -- Weldar
		[0x872] = "Doors", -- HFP Ice Train Station
		[0x873] = "Doors", -- HFP Ice Train Station
		[0x874] = "Tintups Spawner",
		[0x876] = "Goop", -- Terry
		[0x877] = "Green Hoop", -- Hoop Hurry
		[0x878] = "Blue Hoop", -- Hoop Hurry
		[0x87B] = "Door", -- Electric Caution, GI
		[0x87C] = "Metal Door", -- GI
		[0x87D] = "Travelator", -- GI Trash Compactor
		[0x87E] = "Button (Floor)", -- EM Room
		[0x87F] = "Toxic Waste Hatch",

		[0x880] = "Door", -- Fire Hazard, Weldar
		[0x881] = "Breakable Grate", -- GI/ww
		[0x883] = "Button (Floor)", -- Cable Room
		[0x884] = "Toxic Barrel", -- Quality Control
		[0x885] = "Rareware Barrel", -- Quality Control
		[0x886] = "Fan", -- Quality Control
		[0x887] = "Door", -- GI Floor 2
		[0x888] = "Roar Door",
		[0x889] = "Button (Floor)", -- GI
		[0x88F] = "S'Hard",

		[0x892] = "Cannon Flower", -- CCL
		[0x893] = "Eyeballus Jiggium Plant",
		[0x895] = "Pansie",
		[0x896] = "King Jingaling",
		[0x897] = "King Jingaling", -- Zombie
		[0x898] = "Throne", -- King Jingaling
		[0x899] = "Scrotty",
		[0x89A] = "Scrit",
		[0x89B] = "Scrat",
		[0x89C] = "Weldar Fireball",
		[0x89E] = "Mr. Fit",
		[0x89F] = "Onion",

		[0x8A0] = "Mouse", -- CCL, Fixed
		[0x8A1] = "Mouse", -- CCL, Broken
		[0x8A5] = "Sky", -- Opening Cutscene
		[0x8A8] = "Logo", -- Title Demos
		[0x8A9] = "Rock", -- Grunty's Rock
		[0x8AE] = "Mumbo Jumbo", -- Kick About
		[0x8AF] = "Playing Cards", -- Opening CS

		[0x8B0] = "Banjo-Kazooie", -- BK at Controls CS
		[0x8B1] = "Curtains", -- Opening CS
		[0x8B3] = "Rocks", -- Opening CS
		[0x8B4] = "Drill (Hag 1)", -- Opening CS
		[0x8B5] = "Bottles", -- Bottles eating burnt food CS
		[0x8B7] = "Clock", -- Opening CS
		[0x8BA] = "Hag 1", -- Opening CS
		[0x8BB] = "Mingella",
		[0x8BD] = "Blobbelda",
		[0x8BE] = "Gruntilda", -- Jingaling Zapped CS7
		[0x8BF] = "Partcle Spawner",

		[0x8C3] = "Bottles (Burnt)",
		[0x8C5] = "Pile of Money", -- Opening CS
		[0x8C6] = "Power Beam", -- BoB Cutscenes, Green
		[0x8C7] = "Power Beam", -- Jingaling Zapped, Green
		[0x8C8] = "BOB Control Panel",
		[0x8C9] = "Power Beam", -- BoB Cutscenes, Blue
		[0x8CA] = "Power Beam", -- Jingaling/Bottles Restored, Blue
		[0x8CC] = "Door", -- Inside Trash Can
		[0x8CD] = "Door", -- Rear Door GI
		[0x8CE] = "Rainbow", -- CCL
		[0x8CF] = "Bean", -- CCL

		[0x8D0] = "Zubba's Target",
		[0x8D1] = "Door", -- Zubba's
		[0x8D2] = "Glass Bottle", -- Trash Can
		[0x8D4] = "Panel", -- HFP
		[0x8D5] = "Button (Floor)", -- HFP
		[0x8D6] = "Button (Floor)", -- HFP Kickball Lobby
		[0x8D8] = "Gate", -- HFP
		[0x8DA] = "Door", -- Superstash
		[0x8DB] = "Button (Floor)", -- Superstash
		[0x8DC] = "No Food Sign",
		[0x8DD] = "Beanstalk", -- CCL

		[0x8E0] = "Mumbo's Skull", -- TDL
		[0x8E1] = "Blue Skull",
		[0x8E2] = "Breakable Stone", -- JRL/HFP Mumbo's
		[0x8E3] = "Panel", -- Most Mumbo's to hide secret passage
		[0x8E4] = "Locker Door",
		[0x8E5] = "Locker Door",
		[0x8E6] = "Locker Door",
		[0x8E7] = "Locker Door",
		[0x8E8] = "Locker Door",
		[0x8E9] = "Locker Door",
		[0x8EA] = "Locker Door",
		[0x8EB] = "Locker Door",
		[0x8EC] = "Locker Door",
		[0x8ED] = "Electricity", -- CK
		[0x8EE] = "Drawbridge", -- CK
		[0x8EF] = "Breakable Stone", -- JRL

		[0x8F0] = "Breakable Temple", -- HFP
		[0x8F1] = "Boggy",
		[0x8F2] = "Glass Box", -- Toxic Waste
		[0x8F6] = "Door", -- HFP Lava Side Train Station
		[0x8F9] = "Breakable Wall", -- GFP
		[0x8FA] = "Fish", -- Boggy's
		[0x8FC] = "Stick of Dynamite",
		[0x8FE] = "HAG 1",
		[0x8FF] = "Rocknut",

		[0x900] = "Gobgoyle",
		[0x901] = "Gruntilda (HAG 1)",
		[0x902] = "Gobgoyle",
		[0x903] = "Chuffy Pad",
		[0x904] = "Mortar", -- Hag 1
		[0x905] = "Mortar Fragment", -- Hag 1
		[0x906] = "Mortar Fragment", -- Hag 1
		[0x907] = "Mortar Fragment", -- Hag 1
		[0x908] = "Mortar Fragment", -- Hag 1
		[0x909] = "Bigga-Bazza",
		[0x90A] = "Bigga-Bazza",
		[0x90B] = "Mrs. Bottles",
		[0x90C] = "Klungo", -- Hurt
		[0x90D] = "Klungo", -- Very Hurt
		[0x90E] = "Bottles (Angel)",
		[0x90F] = "Bottles (Devil)",

		[0x910] = "B-K Cartridge",
		[0x911] = "Gold Idol",
		[0x912] = "Water", -- HFP Gobi
		[0x913] = "Jade Idol", -- Targitzan's Temple
		[0x914] = "Heggy",
		[0x915] = "George", -- Ice Cube
		[0x916] = "Mildred", -- Ice Cube
		[0x917] = "Warp Silo",
		[0x918] = "Honey B.",
		[0x919] = "Speccy", -- Bottles' Child
		[0x91A] = "Goggles", -- Bottles' Child
		[0x91B] = "Buzzer", -- ToT
		[0x91C] = "Pieces of HAG 1", -- CK
		[0x91D] = "Buzzer", -- ToT
		[0x91E] = "Buzzer", -- Jamjars ToT Multiplayer
		[0x91F] = "Drill",

		[0x923] = "Floatus Floatsum Egg",
		[0x924] = "Floatus Floatsum", -- CCL
		[0x925] = "Hothand", -- HFP Lava Side
		[0x926] = "Flame", -- HFP Lava Side
		[0x927] = "Flame", -- HFP Lava Side
		[0x92A] = "Breakable Rock", -- Talon Torpedo
		[0x92B] = "Jelly", -- CCL
		[0x92C] = "Hothand", -- HFP Lava Side
		[0x92D] = "Jelly Castle", -- CCL
		[0x92E] = "Jelly", -- Landing pads in CCL

		[0x930] = "Superstash",
		[0x931] = "Chuffy Sign",
		[0x932] = "Button (Floor)",  -- HFP Drill
		[0x933] = "Buzzer", -- Mumbo ToT Multiplayer
		[0x934] = "Buzzer", -- Humba ToT Multiplayer
		[0x935] = "Master Jiggywiggy",
		[0x936] = "Gruntilda", -- ToT
		[0x937] = "Disciple of Jiggywiggy",
		[0x939] = "Particle Spawner",
		[0x93B] = "Burnt Food", -- Bottles eating burnt food CS
		[0x93C] = "Breakable Door", -- Talon Torpedo, UFO
		[0x93D] = "Fries Button",
		[0x93E] = "Beach Ball", -- Projectile, Mr. Patch

		[0x942] = "Button (Floor)", -- Banjo-Kazooie
		[0x943] = "Door", -- Mr. Patch
		[0x944] = "Gate", -- Lord Woo
		[0x945] = "Button (Floor)", -- HFP Volcano
		[0x946] = "Hot Waterfall", -- HFP Lava Side
		[0x947] = "Door", -- HFP to JRL
		[0x948] = "Button (Talon Torpedo)", -- TDL
		[0x949] = "Doors", -- TDL Train Station
		[0x94A] = "Doors", -- TDL Train Station
		[0x94B] = "Button (Wall)", -- Chompa
		[0x94C] = "Electricity", -- Gatehouse
		[0x94D] = "Electricity", -- Gatehouse
		[0x94E] = "Electricity", -- ToT
		[0x94F] = "Doors", -- IoH Train Station

		[0x950] = "Doors", -- IoH Train Station
		[0x951] = "Breakable Door", -- SM Talon Torpedo
		[0x952] = "Breakable Grate", -- Rusted
		[0x956] = "Red Hoop", -- Hoop Hurry
		[0x957] = "Green Hoop", -- Hoop Hurry
		[0x958] = "Blue Hoop", -- Hoop Hurry
		[0x95A] = "Gate", -- HFP Kickball
		[0x95B] = "Button (Floor)", -- HFP Bridge
		[0x96E] = "Gate", -- IoH to JRL
		[0x96F] = "Gate", -- IoH to HFP

		[0x965] = "Door", -- Ice Key
		[0x966] = "Energy Beam", -- Jiggywiggy's Temple
		[0x967] = "Door", -- IoH to MT
		[0x968] = "Door", -- To Jiggywiggy's Temple
		[0x969] = "Grate", -- IoH to GGM
		[0x96A] = "Gate", -- Plateau to Pine Grove
		[0x96B] = "Gate", -- Plateau to Cliff Top
		[0x96C] = "Gate (Left)", -- IoH to WW
		[0x96D] = "Gate (Right)", -- IoH to WW

		[0x970] = "Rock Teeth", -- IoH to TDL
		[0x971] = "Gate (Left)", -- IoH to GI
		[0x972] = "Gate (Right)", -- IoH to GI
		[0x973] = "No Entry Sign", -- GI
		[0x974] = "Purple Mystery Egg",
		[0x975] = "Blue Mystery Egg",
		[0x976] = "Yellow Egg", -- Heggy
		[0x977] = "Jiggywiggy's Altar of Knowledge",
		[0x978] = "Electricty", -- IoH to CK/CK to Hag 1

		[0x999] = "Cracked Ice", -- Heggy
		[0x99A] = "1 Ton Weight", -- ToT
		[0x99B] = "Button (Wall)", -- Fire Switch
		[0x99C] = "Jukebox",
		[0x99D] = "Red Germ", -- Chompa's Belly
		[0x99E] = "Green Germ", -- Chompa's Belly
		[0x99F] = "Blue Germ", -- Chompa's Belly

		[0x9A0] = "Overlay", -- Credits/Character Parade
		[0x9A2] = "Applause Sign",
		[0x9A3] = "Bed", -- Jolly's
		[0x9AF] = "Pointer", -- Grunty Life-Force Machine

		[0x9B4] = "Klungo", -- Sad Party CS
		[0x9BE] = "Red Feather Particles", -- Beak Bomb
		[0x9BF] = "Gold Feath Particles", -- Wonderwing

		[0x9C0] = "Ice Egg", -- Projectile
		[0x9C1] = "Fire Egg", -- Projectile
		[0x9C2] = "Grenade Egg", -- Projectile
		[0x9C3] = "Golden Egg", -- Projectile
		[0x9C4] = "Clockwork Kazooie Egg", -- Projectile
		[0x9C5] = "Proximity Egg", -- Projectile/Wall
		[0x9C7] = "Light (Wall)",

		[0x9D1] = "Underwear", -- Washing Machine
		[0x9D7] = "Blue Egg", -- Projectile

		[0xFFFF] = "Player Model",
	},
	nest = {
		contents = 0x1E -- 2 Byte
	},
	nest_contents_list = {
		[0] = "Normal Eggs",
		[1] = "Fire Eggs",
		[2] = "Grenade Eggs",
		[3] = "Ice Eggs",
		[4] = "Clockwork Kazooie Eggs",
		-- 5 unknown
		[6] = "Red Feathers",
		[7] = "Gold Feathers",
		[10] = "Golden Eggs",
		[11] = "Proximity Eggs",
		[12] = "5-Note",
		[13] = "Treble Clef",
		-- 14 unknown. Game crash
		-- 15 unknown. Maybe extra life
		-- 16+ likely doesn't exist
	},
	banjo_hand = {
		item_selected = 0x79 -- 1 Byte
	},
	hand_item_selected = {
		[0] = "File 1",
		[1] = "File 2",
		[2] = "File 3",
		[3] = "Copy File",
		[4] = "Delete File",
		[5] = "Multiplayer",
		[6] = "Screen Settings",
		[7] = "Bonus Features",
	},
};

function Game.getObjectAnimationValue(pointer)
	local ObjAnimPointer = mainmemory.read_u16_be(pointer + object_model1.animation_index);
	local ObjAnimPointer_global = dereferencePointer(Game.Memory.animation_pointer);
	if isRDRAM(ObjAnimPointer_global) and ObjAnimPointer ~= 0 then
		return mainmemory.read_u16_be(ObjAnimPointer_global + 0x38 + (0x3C * ObjAnimPointer));
	end
	return 0;
end

function Game.getObjectAnimationOSD(pointer)
	local ObjAnimValue = Game.getObjectAnimationValue(pointer);
	return animationList[ObjAnimValue] or toHexString(ObjAnimValue);
end

local function getNestContentsOSD(value)
	local eggType = "Unknown ("..value..")";
	if object_model1.nest_contents_list[value] ~= nil then
		eggType = object_model1.nest_contents_list[value];
	end
	return eggType;
end

local function getHandItemSelected(value)
	local correctedValue = math.floor(value/16);
	local itemSelected = "Unknown ("..correctedValue..")";
	if object_model1.hand_item_selected[correctedValue] ~= nil then
		itemSelected = object_model1.hand_item_selected[correctedValue];
	end
	return itemSelected;
end

local function getJinjoIdentifierOSD(pointer)
	local jinjo_value = mainmemory.readbyte(pointer + object_model1.jinjo_identifier);
	local jinjo_ident = "Unknown";
	if jinjo_value == 0 then
		jinjo_ident = "Minjo (Random)";
	elseif jinjo_value > 0 and jinjo_value < 46 then
		jinjo_ident = JinjoAddresses[jinjo_value][2].." ("..JinjoColors[mainmemory.readbyte(JinjoAddresses[jinjo_value][1][Game.version])]..")";
	end
	return jinjo_ident;
end

local function getNumSlots()
	local objectArray = dereferencePointer(Game.Memory.object_array_pointer);
	if isRDRAM(objectArray) then
		local firstObject = dereferencePointer(objectArray + 0x04);
		local lastObject = dereferencePointer(objectArray + 0x08);
		if isRDRAM(firstObject) and isRDRAM(lastObject) then
			return math.floor((lastObject - firstObject) / slot_size) + 1;
		end
	end
	return 0;
end

local function getSlotBase(index)
	--if index < 0 or index > getNumSlots() then
	--	print("Warning: OOB call to getSlotBase() with index"..index);
	--end
	return slot_base + index * slot_size;
end

local function incrementObjectIndex()
	object_index = object_index + 1;
	if object_index > getNumSlots() then
		object_index = 1;
	end
end

local function decrementObjectIndex()
	object_index = object_index - 1;
	if object_index <= 0 then
		object_index = getNumSlots();
	end
end

local script_modes = {
	"Disabled",
	"List",
	"Examine",
};

local script_mode_index = 1;
local script_mode = script_modes[script_mode_index];

local function toggleObjectAnalysisToolsMode()
	script_mode_index = script_mode_index + 1;
	if script_mode_index > #script_modes then
		script_mode_index = 1;
	end
	script_mode = script_modes[script_mode_index];
end

local function getObjectModel1Pointers()
	local pointers = {};
	local objectArray = dereferencePointer(Game.Memory.object_array_pointer);
	if isRDRAM(objectArray) then
		local num_slots = getNumSlots();
		for i = 0, num_slots - 1 do
			table.insert(pointers, objectArray + getSlotBase(i)); -- TODO: Check for bone arrays before adding to table, we don't want to move stuff we can't see
		end
	end
	return pointers;
end

local function setObjectModel1Position(pointer, x, y, z)
	if isRDRAM(pointer) then
		mainmemory.writefloat(pointer + object_model1.x_position, x, true);
		mainmemory.writefloat(pointer + object_model1.y_position, y, true);
		mainmemory.writefloat(pointer + object_model1.z_position, z, true);
	end
end

local function zipTo(index)
	local objectArray = dereferencePointer(Game.Memory.object_array_pointer);
	if isRDRAM(objectArray) then
		local objectPointer = objectArray + getSlotBase(index);
		local xPos = mainmemory.readfloat(objectPointer + object_model1.x_position, true);
		local yPos = mainmemory.readfloat(objectPointer + object_model1.y_position, true);
		local zPos = mainmemory.readfloat(objectPointer + object_model1.z_position, true);
		Game.setPosition(xPos, yPos, zPos);
	end
end

local function zipToSelectedObject()
	zipTo(object_index - 1);
end

function everythingIs(modelIndex)
	local model1Pointers = getObjectModel1Pointers();
	if #model1Pointers > 0 then
		for i = 1, #model1Pointers do
			local objectIDPointer = dereferencePointer(model1Pointers[i] + object_model1.id_struct);
			if isRDRAM(objectIDPointer) then
				mainmemory.write_u16_be(objectIDPointer + 0x14, modelIndex);
			end
		end
	end
end

local function getAnimationType(model1Base)
	local objectIDPointer = dereferencePointer(model1Base + object_model1.id_struct);
	if isRDRAM(objectIDPointer) then
		local modelIndex = mainmemory.read_u16_be(objectIDPointer + 0x14);
		return object_model1.models[modelIndex] or toHexString(modelIndex);
	end
	return "Unknown";
end

local function getExamineData(pointer)
	local examine_data = {};
	if not isRDRAM(pointer) then
		return examine_data;
	end

	local modelPointer = dereferencePointer(pointer + object_model1.id_struct);

	local xPos = mainmemory.readfloat(pointer + object_model1.x_position, true);
	local yPos = mainmemory.readfloat(pointer + object_model1.y_position, true);
	local zPos = mainmemory.readfloat(pointer + object_model1.z_position, true);
	local hasPosition = hasModel or xPos ~= 0 or yPos ~= 0 or zPos ~= 0;

	local currentObjectName = getAnimationType(pointer); -- Required for special data

	table.insert(examine_data, { "Separator", 1 });

	table.insert(examine_data, { "X", round(xPos, precision) });
	table.insert(examine_data, { "Y", round(yPos, precision) });
	table.insert(examine_data, { "Z", round(zPos, precision) });
	table.insert(examine_data, { "Health", mainmemory.readbyte(pointer + object_model1.health) });
	table.insert(examine_data, { "Separator", 1 });

	table.insert(examine_data, { "Scale", round(mainmemory.readfloat(pointer + object_model1.scale, true),precision) });
	table.insert(examine_data, { "Opacity", mainmemory.readbyte(pointer + object_model1.transparency) });
	table.insert(examine_data, { "Rot Y", round(mainmemory.readfloat(pointer + object_model1.y_rotation, true),precision) });
	table.insert(examine_data, { "Rot Z", round(mainmemory.readfloat(pointer + object_model1.z_rotation, true),precision) });
	table.insert(examine_data, { "Separator", 1 });
	table.insert(examine_data, { "Animation", Game.getObjectAnimationOSD(pointer) });
	--table.insert(examine_data, { "Movement State", toHexString(mainmemory.readbyte(pointer + object_model1.movement_state)) });

	table.insert(examine_data, { "Separator", 1 });
	if currentObjectName == "Nest (Eggs)" or currentObjectName == "Nest (Note)" or currentObjectName == "Nest (Treble Clef)" or currentObjectName == "Nest (Feathers)" then
		table.insert(examine_data, { "Nest Contents", getNestContentsOSD(mainmemory.read_u16_be(pointer + object_model1.nest.contents)) });
	end

	if currentObjectName == "Jinjo" then
		table.insert(examine_data, { "Jinjo Identifier", getJinjoIdentifierOSD(pointer) });
	end

	if currentObjectName == "Banjo's Hand" then
		table.insert(examine_data, { "Option Selected", getHandItemSelected(mainmemory.readbyte(pointer + object_model1.banjo_hand.item_selected)) });
	end

	return examine_data;
end

local max_page_size = 40;

function Game.drawUI()
	if script_mode == "Disabled" then
		return;
	end

	local row = 0;
	local objectArray = dereferencePointer(Game.Memory.object_array_pointer);
	local numSlots = getNumSlots();

	gui.text(Game.OSDPosition[1], 2 + Game.OSDRowHeight * row, "Mode: "..script_mode, nil, 'bottomright');
	row = row + 1;
	gui.text(Game.OSDPosition[1], 2 + Game.OSDRowHeight * row, "Index: "..(object_index).."/"..(numSlots), nil, 'bottomright');
	row = row + 1;

	if script_mode == "Examine" and isRDRAM(objectArray) then
		local currentSlotBase = objectArray + getSlotBase(object_index - 1);
		local objectName = getAnimationType(currentSlotBase);

		local examine_data = getExamineData(objectArray + getSlotBase(object_index - 1));
		for i = #examine_data, 1, -1 do
			if examine_data[i][1] ~= "Separator" then
				gui.text(Game.OSDPosition[1], 2 + Game.OSDRowHeight * row, examine_data[i][1]..": "..examine_data[i][2], nil, 'bottomright');
				row = row + 1; -- Separator
			else
				row = row + examine_data[i][2];
			end
		end

		gui.text(Game.OSDPosition[1], 2 + Game.OSDRowHeight * row, "Object: "..objectName, nil, 'bottomright');
		row = row + 1;
		gui.text(Game.OSDPosition[1], 2 + Game.OSDRowHeight * row, "Address: "..toHexString(currentSlotBase or 0), nil, 'bottomright');
		row = row + 1;
	end

	if script_mode == "List" and isRDRAM(objectArray) then
		local page_total = math.ceil(numSlots / max_page_size);
		local page_pos = math.floor((object_index - 1) / max_page_size) + 1;
		local page_index = max_page_size + object_index - (page_pos * max_page_size);

		if page_pos < page_total then
			page_size = max_page_size;
		else
			page_size = numSlots - ((page_total - 1) * max_page_size);
		end

		gui.text(Game.OSDPosition[1], 2 + Game.OSDRowHeight * row, "Page: "..page_pos.."/"..page_total, nil, 'bottomright');
		row = row + 1;

		for i = page_size, 1, -1 do
			local currentSlotBase = objectArray + getSlotBase(i + ((page_pos - 1) * max_page_size) - 1);

			local color = nil;
			if page_index == i then
				color = colors.yellow;
			end

			local xPos = mainmemory.readfloat(currentSlotBase + object_model1.x_position, true);
			local yPos = mainmemory.readfloat(currentSlotBase + object_model1.y_position, true);
			local zPos = mainmemory.readfloat(currentSlotBase + object_model1.z_position, true);

			local animationType = getAnimationType(currentSlotBase);
			if type(object_filter) == "string" and not string.contains(animationType, object_filter) then
				-- Skip
			else
				gui.text(Game.OSDPosition[1], 2 + Game.OSDRowHeight * row, i..": "..animationType..": "..toHexString(currentSlotBase or 0), color, 'bottomright');
				row = row + 1;
			end
		end
	end
end

------------
-- Events --
------------

Game.takeMeThereType = "Checkbox";
function Game.setMap(value)
	mainmemory.write_u16_be(Game.Memory.map_destination, value);
end

function Game.getMap()
	return mainmemory.read_u16_be(Game.Memory.map);
end

function Game.forceReload()
	local trigger_value = mainmemory.read_u16_be(Game.Memory.map_trigger);
	local currentMap = Game.getMap();
	local dropdown_map_value = ScriptHawk.UI.findMapValue();
	if trigger_value == 0 then
		if ScriptHawk.UI.ischecked("Map Checkbox") then
			mainmemory.write_u16_be(Game.Memory.map_trigger_target, dropdown_map_value);
		else
			mainmemory.write_u16_be(Game.Memory.map_trigger_target, currentMap);
		end

		-- Force game to reload with desired map
		mainmemory.write_u16_be(Game.Memory.map_trigger, 0x0101);
	end
end

function Game.getMapOSD()
	local currentMap = Game.getMap();
	local currentMapName = "Unknown";
	if Game.maps[currentMap] ~= nil then
		currentMapName = Game.maps[currentMap];
	end
	return currentMapName.." ("..toHexString(currentMap)..")";
end

function Game.getDCWLocation()
	local DCW_locationMap = mainmemory.read_u16_be(Game.Memory.DCW_location);
	local DCW_locationMapName = "Unknown";
	if Game.maps[DCW_locationMap] ~= nil then
		DCW_locationMapName = Game.maps[DCW_locationMap];
	end
	return DCW_locationMapName.." ("..toHexString(DCW_locationMap)..")";
end

function Game.getMaxAir()
	if checkFlagByName("Roysten Rescued", true) then
		return 100;
	end
	return 60;
end

function Game.getCharacterState()
	local characterStateValue = mainmemory.readbyte(Game.Memory.character_state);
	if Game.character_states[characterStateValue] ~= nil then
		return Game.character_states[characterStateValue];
	end
	return characterStateValue;
end

local obfuscatedConsumables = {
	[0] = {key=0x27BD, name="Blue Eggs"},
	[1] = {key=0x0C03, name="Fire Eggs"},
	[2] = {key=0x0002, name="Ice Eggs"},
	[3] = {key=0x01EE, name="Grenade Eggs"},
	[4] = {key=0x2401, name="CWK Eggs"},
	[5] = {key=0x15E0, name="Proximity Eggs"},
	[6] = {key=0x1000, name="Red Feathers"},
	[7] = {key=0x3C18, name="Gold Feathers"},
	[8] = {key=0x0003, name="Glowbos"},
	[9] = {key=0x3C0C, name="Empty Honeycombs"},
	[10] = {key=0x0319, name="Cheato Pages"},
	[11] = {key=0x858C, name="Burgers"},
	[12] = {key=0x03E0, name="Fries"},
	[13] = {key=0x27BD, name="Tickets"},
	[14] = {key=0x0C03, name="Doubloons"},
	[15] = {key=0x3C05, name="Gold Idols"},
	[16] = {key=0x0002, name="Beans"}, -- CCL
	[17] = {key=0x85E3, name="Fish"}, -- HFP
	[18] = {key=0x0040, name="Eggs"}, -- Stop'n'Swop
	[19] = {key=0x8FBF, name="Ice Keys"}, -- Stop'n'Swop
	[20] = {key=0x1461, name="Mega Glowbos"},
	[21] = {key=0x7680, name="???"},
	[22] = {key=0x0DE3, name="???"},
	[23] = {key=0x5E79, name="???"},
};

function Game.setConsumable(index, value)
	if type(obfuscatedConsumables[index]) == "table" then
		local consumablesBlock = dereferencePointer(Game.Memory.consumable_pointer);
		if isRDRAM(consumablesBlock) then
			mainmemory.write_u16_be(consumablesBlock + index * 2, bit.bxor(value, obfuscatedConsumables[index].key));
		end
	end
end

function Game.getConsumable(index)
	local consumablesBlock = dereferencePointer(Game.Memory.consumable_pointer);
	if isRDRAM(consumablesBlock) then
		local normalValue = mainmemory.read_u16_be(Game.Memory.consumable_base + index * 0x0C);
		local obfuscatedValue = mainmemory.read_u16_be(consumablesBlock + index * 2);
		local key = bit.bxor(obfuscatedValue, normalValue);
		return toHexString(obfuscatedValue, 4, "").." XOR "..toHexString(key, 4, "").." = "..normalValue;
	end
	return "Unknown";
end

function Game.applyInfinites()
	Game.setConsumable(0, 999); -- Blue Eggs
	Game.setConsumable(1, 999); -- Fire Eggs
	Game.setConsumable(2, 999); -- Ice Eggs
	Game.setConsumable(3, 999); -- Grenade Eggs
	Game.setConsumable(4, 999); -- CWK Eggs
	Game.setConsumable(6, 999); -- Red Feathers
	Game.setConsumable(7, 999); -- Gold Feathers
	Game.setConsumable(8, 999); -- Glowbos
	Game.setConsumable(9, 999); -- Empty Honeycombs
	Game.setConsumable(10, 999); -- Cheato Pages
	Game.setConsumable(11, 999); -- Burgers
	Game.setConsumable(12, 999); -- Fries
	Game.setConsumable(13, 999); -- Tickets
	Game.setConsumable(14, 999); -- Doubloons
	Game.setConsumable(15, 999); -- Gold Idols
	mainmemory.writefloat(Game.Memory.air, Game.getMaxAir(), true);
	Game.setCurrentHealth(Game.getMaxHealth());
end

local move_levels = {
	All  = {0xFFFFFFFF, 0xFFFFFFFF, true},
	None = {0xE0FFFF01, 0x00004000, false},
};

function Game.unlockMoves()
	local level = forms.gettext(ScriptHawk.UI.form_controls.moves_dropdown);
	local flagBlock = dereferencePointer(Game.Memory.flag_block_pointer);
	if isRDRAM(flagBlock) then
		mainmemory.write_u32_be(flagBlock + 0x18, move_levels[level][1]);
		mainmemory.write_u32_be(flagBlock + 0x1C, move_levels[level][2]);
		if move_levels[level][3] then
			setFlagByName("First Time Jamjars Cutscene");
			setFlagByName("Jamjars First Time Text");
		else
			clearFlagByName("First Time Jamjars Cutscene");
			clearFlagByName("Jamjars First Time Text");
		end
	end
end

function Game.toggleDragonKazooie()
	toggleFlagByName("Ability: Dragon Kazooie");
end

function Game.initUI()
	if not TASSafe then
		-- Force Reload
		ScriptHawk.UI.button(5, 4, {4, 10}, nil, nil, "Force Reload", Game.forceReload);

		-- Flag stuff
		ScriptHawk.UI.button(10, 7, {46}, nil, "Set Flag Button", "Set", flagSetButtonHandler);
		ScriptHawk.UI.button(12, 7, {46}, nil, "Check Flag Button", "Check", flagCheckButtonHandler);
		ScriptHawk.UI.button(14, 7, {46}, nil, "Clear Flag Button", "Clear", flagClearButtonHandler);

		ScriptHawk.UI.checkbox(0, 6, "toggle_neverslip", "Never Slip");

		-- Moves
		ScriptHawk.UI.button(10, 0, {4, 10}, nil, nil, "Toggle Dragon Kazooie", Game.toggleDragonKazooie);
		ScriptHawk.UI.form_controls.moves_dropdown = forms.dropdown(ScriptHawk.UI.options_form, { "All", "None" }, ScriptHawk.UI.col(7) - ScriptHawk.UI.dropdown_offset + 2, ScriptHawk.UI.row(1) + ScriptHawk.UI.dropdown_offset, ScriptHawk.UI.col(2) + 8, ScriptHawk.UI.button_height);
		ScriptHawk.UI.button(10, 1, {4, 10}, nil, nil, "Unlock Moves", Game.unlockMoves);

		-- Camera lock
		ScriptHawk.UI.button(10, 2, {4, 10}, nil, nil, "Toggle Camera Lock", Game.toggleCameraLock);

		-- Character Dropdown
		ScriptHawk.UI.form_controls["Character Dropdown"] = forms.dropdown(ScriptHawk.UI.options_form, { "BK", "Snowball", "Cutscene", "Bee", "W. Machine", "Stony", "Breegull B.", "Solo Banjo", "Solo Kazooie", "Submarine", "Mumbo", "G. Goliath", "Detonator", "Van", "Cwk Kazooie", "Small T-Rex", "Big T-Rex" }, ScriptHawk.UI.col(5) - ScriptHawk.UI.dropdown_offset + 2, ScriptHawk.UI.row(5) + ScriptHawk.UI.dropdown_offset, ScriptHawk.UI.col(3) + 8, ScriptHawk.UI.button_height);
		ScriptHawk.UI.checkbox(9, 5, "Character Checkbox", "");
	else
		-- Use a bigger check flags button if the others are hidden by TASSafe
		ScriptHawk.UI.button(10, 7, {4, 10}, nil, "Check Flag Button", "Check Flag", flagCheckButtonHandler);
	end

	-- Flag stuff
	ScriptHawk.UI.form_controls["Flag Dropdown"] = forms.dropdown(ScriptHawk.UI.options_form, flag_names, ScriptHawk.UI.col(0) + ScriptHawk.UI.dropdown_offset, ScriptHawk.UI.row(7) + ScriptHawk.UI.dropdown_offset, ScriptHawk.UI.col(9) + 8, ScriptHawk.UI.button_height);
	ScriptHawk.UI.checkbox(10, 6, "realtime_flags", "Realtime Flags", true);

	ScriptHawk.UI.checkbox(5, 6, "toggle_autojump", "Autojump");

	flagStats();
end

function Game.onLoadState()
	clearFlagCache();
end

function Game.eachFrame()
	if ScriptHawk.UI.ischecked("toggle_neverslip") then
		neverSlip();
	end
	if ScriptHawk.UI.ischecked("toggle_autojump") then
		autoJump();
	end
	if ScriptHawk.UI.ischecked("realtime_flags") then
		checkFlags();
		checkGlobalFlags();
	end
	if encircle_enabled then
		encircle_banjo();
	end

	-- Check EEPROM checksums
	local checksum_value;
	for i = 1, #eep_checksum do
		checksum_value = readChecksum(eep_checksum[i].address);
		if not checksumsMatch(checksum_value, eep_checksum[i].value) then
			if i > 2 then
				print("Slot "..(i - 2).." Checksum: "..checksumToString(eep_checksum[i].value).." -> "..checksumToString(checksum_value));
			else
				print("Global Flags "..i.." Checksum: "..checksumToString(eep_checksum[i].value).." -> "..checksumToString(checksum_value));
			end
			eep_checksum[i].value = checksum_value;
		end
	end

	if camera_lock.enabled then
		Game.setCameraXPosition(camera_lock.x);
		Game.setCameraYPosition(camera_lock.y);
		Game.setCameraZPosition(camera_lock.z);
	end

	if ScriptHawk.UI.ischecked("Character Checkbox") then
		local characterString = forms.getproperty(ScriptHawk.UI.form_controls["Character Dropdown"], "SelectedItem");
		if type(Game.character_change_lookup[characterString]) == "number" then
			mainmemory.write_u8(Game.Memory.character_change, Game.character_change_lookup[characterString]);
		end
	end
end

Game.OSD = {
	{"Map", Game.getMapOSD, category="mapData"},
	{"DCW", Game.getDCWLocation, category="mapData"},
	{"Separator"},
	{"X", category="position"},
	{"Y", category="position"},
	{"Z", category="position"},
	{"Separator"},
	{"Floor", Game.getFloor, category="position"},
	{"Next Y Pos", Game.getPredictedYPosition, category="positionStats"},
	{"Separator"},
	{"dY", category="positionStats"},
	{"dXZ", category="positionStats"},
	{"Velocity", Game.getVelocity, category="speed"},
	{"Y Velocity", Game.getYVelocity, category="speed"},
	{"Separator"},
	{"Max dY", category="positionStatsMore"},
	{"Max dXZ", category="positionStatsMore"},
	{"Odometer", category="positionStatsMore"},
	{"Separator"},
	{"Rot. X", Game.getXRotation, category="angle"},
	{"Facing", Game.getYRotation, category="angle"},
	{"Moving", Game.getMovingAngle, category="angle"},
	{"Moving Angle", category="angle"},
	{"Rot. Z", Game.getZRotation, category="angle"},
	{"Separator"},
	{"Player", hexifyOSD(Game.getPlayerObject), category="player"},
	{"Character", Game.getCharacterState, category="character"},
	{"Movement", Game.getCurrentMovementStateOSD, category="movement"},
	{"Animation", Game.getAnimationOSD, category="animation"},
	{"Slope Timer", Game.getSlopeTimer, Game.colorSlopeTimer, category="floorProperties"},
	{"Grounded", Game.playerIsGrounded, category="floorProperties"},
	{"Separator"},
	{"Camera", hexifyOSD(Game.getCameraObject), category="camera"},
	{"Camera X", Game.getCameraXPosition, category="camera"},
	{"Camera Y", Game.getCameraYPosition, category="camera"},
	{"Camera Z", Game.getCameraZPosition, category="camera"},
};

return Game;
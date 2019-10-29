local arg = {...}
if #arg < 3 then
  print("usage: gru bin2gsc.lua <binary-file> <address> <output-file>")
  return
end

local bin = gru.blob_load(arg[1])
local gsc = gru.gsc_create()

local n = 0
local p = 0
local addr = tonumber(arg[2]) & 0x00FFFFFF
while p < bin:size() do
  if p < bin:size() - 1 then
    gsc:insert(n, addr | 0x81000000, bin:read16be(p))
  else
    gsc:insert(n, addr | 0x80000000, bin:read8(p))
  end
  n = n + 1
  p = p + 2
  addr = addr + 2
end

gsc:save(arg[3])

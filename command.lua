/c
local EOL = "\n"
local file_name = "entity-item-map.txt"
local file_content = ""
function check_prototype(proto)
    if proto.items_to_place_this then
        local item = proto.items_to_place_this[1]
        if type(item) == "string" then
            item = { name = item, count = game.item_prototypes[item].stack_size }
        end
        if proto.name ~= item.name or item.count ~= 1 then
            local section = "\"" .. proto.name .. "\": {"
            if proto.name ~= item.name then
                section = section .. " item: \"" .. item.name .. "\""
            end
            if proto.name ~= item.name and item.count ~= 1 then
                section = section .. ","
            end
            if item.count ~= 1 then
                section = section .. " count: " .. item.count .. ""
            end
            section = section .. " },"
            file_content = file_content .. section .. EOL
        end
    end
end
for _, entity_prototype in pairs(game.entity_prototypes) do
    check_prototype(entity_prototype)
end
for _, tile_prototype in pairs(game.tile_prototypes) do
    check_prototype(tile_prototype)
end
game.write_file(file_name, file_content)

/c
local EOL = "\n"
local file_name = "entity-item-map.txt"
local file_content = ""
for _, entity_prototype in pairs(game.entity_prototypes) do
    if entity_prototype.items_to_place_this then
        local item = entity_prototype.items_to_place_this[1]
        if type(item) == "string" then
            item = { name = item, count = game.item_prototypes[item].stack_size }
        end
        if entity_prototype.name ~= item.name or item.count ~= 1 then
            local section = "\"" .. entity_prototype.name .. "\": {"
            if entity_prototype.name ~= item.name then
                section = section .. " item: \"" .. item.name .. "\""
            end
            if entity_prototype.name ~= item.name and item.count ~= 1 then
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
game.write_file(file_name, file_content)

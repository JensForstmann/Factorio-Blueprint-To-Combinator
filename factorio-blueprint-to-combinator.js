let bpstring2Obj = (bpstring) => {
    return JSON.parse(
        new TextDecoder("utf-8").decode(
            pako.inflate(
                Base64.decode(
                    bpstring.substring(1)
                )
            )
        )
    );
};

let obj2bpstring = (obj) => {
    return "0" + Base64.encodeU(
        pako.deflate(
            new TextEncoder("utf-8").encode(
                JSON.stringify(obj)
            ),
            { level: 9 }
        )
    );
};

let convert = () => {
    let inputStringTextArea = document.getElementById("inputString");
    let outputStringTextArea = document.getElementById("outputString");
    let decodedInputStringTextArea = document.getElementById("decodedInputString");
    let decodedOutputStringTextArea = document.getElementById("decodedOutputString");
    let maxSignalCount = document.getElementById("maxSignalCount").value;
    let includeRequesterChests = document.getElementById("includeRequesterChests").checked;
    let itemList = document.getElementById("itemList");

    let inputString = inputStringTextArea.value;

    // check bp version
    if (inputString[0] !== "0") {
        //console.log("Wrong blueprint version");
        outputStringTextArea.value = "";
        return;
    }

    let json = bpstring2Obj(inputString);

    decodedInputStringTextArea.value = JSON.stringify(json, null, 2);


    let entities = {};

    let blueprints = [];

    if (json.blueprint) blueprints = [json];
    if (json.blueprint_book && json.blueprint_book.blueprints) blueprints = json.blueprint_book.blueprints;

    blueprints.forEach(blueprint => {
        if (blueprint.blueprint && blueprint.blueprint.entities) blueprint.blueprint.entities.forEach(e => {
            let inc = 1;
            if (e.name === "straight-rail") {
                e.name = "rail";
            }
            if (e.name === "curved-rail") {
                inc = 4;
                e.name = "rail";
            }
            if (entities[e.name] == undefined) entities[e.name] = 0;
            entities[e.name] += inc;
            if (e.items !== undefined) {
                for (let name in e.items) {
                    let count = e.items[name];
                    if (entities[name] == undefined) entities[name] = 0;
                    entities[name] += count;
                }
            }
        });
        if (blueprint.blueprint && blueprint.blueprint.tiles) blueprint.blueprint.tiles.forEach(e => {
            if (e.name === "refined-hazard-concrete-right" || e.name === "refined-hazard-concrete-left") {
                e.name = "refined-hazard-concrete";
            }
            if (entities[e.name] == undefined) entities[e.name] = 0;
            entities[e.name]++;
            if (e.items !== undefined) {
                for (let name in e.items) {
                    let count = e.items[name];
                    if (entities[name] == undefined) entities[name] = 0;
                    entities[name] += count;
                }
            }
        });
    });

    //console.log(entities);

    let blueprintDraft = {
        "blueprint": {
            "icons": [
                {
                    "signal": {
                        "type": "item",
                        "name": "constant-combinator"
                    },
                    "index": 1
                }
            ],
            "entities": [],
            "item": "blueprint",
            "version": 68722819072
        }
    };

    let bp = JSON.parse(JSON.stringify(blueprintDraft));
    let constantCombinator = null;
    let constantCombinatorCount = 0;
    let requesterChest = null;
    let list = "<ul>";

    for (let name in entities) {
        let count = entities[name];
        if (constantCombinator == null) {
            constantCombinator = {
                "entity_number": bp.blueprint.entities.length + 1,
                "name": "constant-combinator",
                "position": {
                    "x": constantCombinatorCount,
                    "y": 0
                },
                "control_behavior": {
                    "filters": []
                }
            };

            if (includeRequesterChests) {
                constantCombinator.connections = {
                    "1": {
                        "green": [
                            {
                                "entity_id": bp.blueprint.entities.length + 2
                            }
                        ]
                    }
                }
                requesterChest = {
                    "entity_number": bp.blueprint.entities.length + 2,
                    "name": "logistic-chest-requester",
                    "position": {
                        "x": constantCombinatorCount,
                        "y": 1
                    },
                    "control_behavior": {
                        "circuit_mode_of_operation": 1
                    },
                    "connections": {
                        "1": {
                            "green": [
                                {
                                    "entity_id": bp.blueprint.entities.length + 1
                                }
                            ]
                        }
                    }
                }
            }

            bp.blueprint.entities.push(constantCombinator);

            if (includeRequesterChests) {
                bp.blueprint.entities.push(requesterChest);
            }

            constantCombinatorCount++;
        }

        constantCombinator.control_behavior.filters.push({
            "signal": {
                "type": "item",
                "name": name
            },
            "count": count,
            "index": constantCombinator.control_behavior.filters.length + 1
        });

        if (constantCombinator.control_behavior.filters.length == maxSignalCount) {
            constantCombinator = null;
        }

        list += "<li>" + count + "x " + name + "</li>";
    }

    list += "</ul>";
    itemList.innerHTML = list;

    let outputString = obj2bpstring(bp);

    outputStringTextArea.value = outputString;
    decodedOutputStringTextArea.value = JSON.stringify(bp, null, 2);

};
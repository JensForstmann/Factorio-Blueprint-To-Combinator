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
    let cc = null;
    let list = "<ul>";

    for (let name in entities) {
        let count = entities[name];
        if (cc == null) {
            cc = {
                "entity_number": bp.blueprint.entities.length + 1,
                "name": "constant-combinator",
                "position": {
                    "x": bp.blueprint.entities.length,
                    "y": 0
                },
                "control_behavior": {
                    "filters": []
                }
            };

            bp.blueprint.entities.push(cc);
        }

        cc.control_behavior.filters.push({
            "signal": {
                "type": "item",
                "name": name
            },
            "count": count,
            "index": cc.control_behavior.filters.length + 1
        });

        if (cc.control_behavior.filters.length == maxSignalCount) {
            cc = null;
        }

        list += "<li>" + count + "x " + name + "</li>";
    }

    list += "</ul>";
    itemList.innerHTML = list;

    let outputString = obj2bpstring(bp);

    outputStringTextArea.value = outputString;
    decodedOutputStringTextArea.value = JSON.stringify(bp, null, 2);

};
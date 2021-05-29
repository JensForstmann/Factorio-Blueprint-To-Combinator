# Factorio Blueprint Entities And Items To Combinator Converter

This [simple script](https://jensforstmann.github.io/Factorio-Blueprint-To-Combinator/factorio-blueprint-to-combinator.html) takes a factorio blueprint string and converts it to constant combinators holding the signals of items needed to build the blueprint.

Tested with 0.16 but as long as the bp string format does not change it should work in the future as well.

Thanks to [u/Tmin10](https://www.reddit.com/user/Tmin10) and his [Factorio 0.15 blueprints decoder/encoder](https://factorio.tmin10.ru/) (see [original post on reddit](https://www.reddit.com/r/factorio/comments/6ffrvx/i_write_a_simple_decoderencoder_for_factorio_015/))

## Import error: Unknown item name: **** ?

You play modded and have issues importing the blueprint string with the error message `Unknown item name: ****`?

Then please do the following:

- Save the game (since you are about to execute a cheat command which disables achievements)
- Execute [this command](command.lua) in the ingame console/chat (you may have to execute it twice to confirm disabling achievements)
- Open a new [issue](https://github.com/JensForstmann/Factorio-Blueprint-To-Combinator/issues/new) and upload the file `entity-item-map.txt` created by the cheat command in your [script-output](https://wiki.factorio.com/Application_directory) folder
- Reload your last savegame

Alternatively you can open a pull request with an updated [entity-item-map.js](entity-item-map.js) file.

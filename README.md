# tally

Tally is a keyboard driven, minmalistic habit tracker. 

## Commands
Tally is modal like vim. The `command` mode can be accessed by `:`; use `esc` to exit from `command` mode. 

New habits are added by 
```
:add [HABIT NAME]
```
and deleted by
```
:del [HABIT NAME]
```
. Habit names can be at most 10 characters long. 

## Usage
Press `enter` to toggle whether the habit being hovered was completed today. You can hover over different habits by going up/down the list with `k/j`. 

## Export/Importing Data
You can export your data with the `:export` command. The command will create `storage.json` with the data. To import data, simply drag `storage.json` onto Tally. Note that this will override the current data stored.

## Inspirations
* [Left](https://github.com/hundredrabbits/Left)
* [Orca](https://github.com/hundredrabbits/Orca) 
* [dijo](https://github.com/NerdyPepper/dijo)

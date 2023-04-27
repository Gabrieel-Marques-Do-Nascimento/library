This command creates a character at the coordinates point. Using this command requires the model to be already loaded, usually through REQUEST_MODEL, or else the game can crash. The major script editors like Sanny Builder support using the character's DFF model name and automatically converts it to the corresponding model ID number upon compilation. All characters created by this command outside the standard mission structure will become near-permanent in the game until MARK_CHAR_AS_NO_LONGER_NEEDED is used to mark it as no longer needed or removed from the world through other means like DELETE_CHAR or REMOVE_CHAR_ELEGANTLY.
var Ottoman = require("ottoman");

module.exports = {
    schema: {
        "created_at": "Date",
        "status": {
            "type": "String",
            validator: Ottoman.Validator.in(["open", "closed"])
        },
        "participants": {
            "type": "List",
            "subtype": "Participant"
        }
    },
    options: {

    }
};
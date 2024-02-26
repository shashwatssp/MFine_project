const mongoose = require('mongoose');

const MedicineSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the medicine name"],
        },
        composition: {
            type: String,
            required: [true],
        }
    }
);

const Medicine = mongoose.model("Medicine", MedicineSchema);

module.exports = Medicine;
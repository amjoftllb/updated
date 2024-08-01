import mongoose from "mongoose";

const availability = new mongoose.Schema(
    {
        timezones: [
            {
                roleId: {
                    type: String,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
            }
        ],
        daysoftheweek: [
            {
                roleId: {
                    type: String,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
            }
        ],
        timeofday: [
            {
                roleId: {
                    type: String,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
            }
        ]
    },
    { timestamps: true }
);

const Availability = mongoose.models.Availability || mongoose.model("Availability", availability);
export default Availability;


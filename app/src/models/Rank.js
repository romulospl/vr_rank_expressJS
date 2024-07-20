import mongoose from "mongoose";

const rankSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    nickname: { type: String },
    score: { type: Number },
    createdAt: { type: Date }
}, { versionKey: false })

const rank = mongoose.model("ranks", rankSchema)

export default rank
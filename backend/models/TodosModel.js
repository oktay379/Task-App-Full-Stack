import mongoose from "mongoose";

const TodosSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    tags: {
        type: String,
        enum: ['work', 'school', 'sports', 'other'],
        default: 'other'
    }
},{timestamps: true});

export const TodosModel = mongoose.model("todos", TodosSchema);

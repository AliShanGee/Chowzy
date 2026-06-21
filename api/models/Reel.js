const isNode = typeof process !== "undefined" && process.versions && process.versions.node; const mongoose = isNode ? require("mongoose") : {};
const { Schema } = mongoose;

const ReelSchema = new Schema({
    videoUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    saves: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

ReelSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Reel', ReelSchema);

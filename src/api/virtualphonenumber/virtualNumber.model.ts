import { Schema, model, Document, Types } from "mongoose";

// Define enum types
enum NumberStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

const Feature = {
  VOICE: "voice",
  SMS: "sms",
  VOICE_MAIL: "voice-mail",
};

// Define interface for the document
interface IVirtualNumber extends Document {
  number: string;
  userId: Types.ObjectId;
  status: NumberStatus;
  features: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const virtualNumberSchema = new Schema<IVirtualNumber>(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(NumberStatus),
      default: NumberStatus.PENDING,
    },

    features: {
      type: [String],
      validate: {
        validator: function (values: string[]) {
          return values.every((value) =>
            Object.values(Feature).includes(value)
          );
        },
        message: "Invalid feature value",
      },
      default: [Feature.VOICE],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
virtualNumberSchema.index({ userId: 1, isDeleted: 1 });

// Export the model and interfaces
export { IVirtualNumber, NumberStatus, Feature };
export const VirtualNumberModel = model<IVirtualNumber>(
  "VirtualNumber",
  virtualNumberSchema
);

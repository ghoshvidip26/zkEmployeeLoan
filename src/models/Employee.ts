import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  walletAddress: string;
  email: string;
  department?: string;
  position?: string;
  salary?: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>({
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid wallet address format'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  department: {
    type: String,
    trim: true,
    maxlength: [50, 'Department cannot exceed 50 characters']
  },
  position: {
    type: String,
    trim: true,
    maxlength: [50, 'Position cannot exceed 50 characters']
  },
  salary: {
    type: Number,
    min: [0, 'Salary must be positive']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      if (ret.__v !== undefined) delete ret.__v;
      return ret;
    }
  }
});

// Create indexes for better query performance
employeeSchema.index({ email: 1 });
employeeSchema.index({ walletAddress: 1 });
employeeSchema.index({ status: 1 });

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', employeeSchema);

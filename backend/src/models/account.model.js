import mongoose from 'mongoose';

const accountSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction'
        }
    ],
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP','INR'],
        default: 'USD'
    },
    status: {
        type: String,
        enum: ['active', 'inactive','suspended'],
        default: 'active'
    }
},{timestamps:true})
const Account=mongoose.model('Account',accountSchema);
export default Account;

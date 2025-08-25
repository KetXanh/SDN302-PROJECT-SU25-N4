const mongoose = require('mongoose');
const cron = require("node-cron");

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    type: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isVerified: { type: Boolean, default: false }
});

// Function to schedule deletion of an OTP
const scheduleOtpDeletion = (otpId, expiresAt) => {
    const now = new Date();
    if (expiresAt > now) {
        const scheduleTime = `${expiresAt.getSeconds()} ${expiresAt.getMinutes()} ${expiresAt.getHours()} ${expiresAt.getDate()} ${expiresAt.getMonth() + 1} *`;
        console.log(`Scheduling deletion for OTP with ID ${otpId} at ${scheduleTime}.`);
        // Schedule the deletion task
        const task = cron.schedule(scheduleTime, async () => {
            try {
                console.log(`Deleting OTP with ID ${otpId} after expiration.`);
                const deletedOtp = await Otp.findByIdAndDelete(otpId);
                if (deletedOtp) {
                    console.log(`OTP with ID ${otpId} deleted after expiration.`);
                }
            } catch (error) {
                console.error(`Failed to delete OTP with ID ${otpId}:`, error);
            } finally {
                // Stop and remove the task from memory after execution
                task.stop();
                delete scheduledTasks[otpId];
            }
        });

        // Store the task to manage it later if needed
        scheduledTasks[otpId] = task;
    } else {
        console.error('Cannot schedule deletion: expiration time is in the past.');
    }
};

// Pre-save hook to schedule deletion on OTP creation
OtpSchema.post('save', function () {
    const otp = this;
    scheduleOtpDeletion(otp._id, otp.expiresAt);
});


const Otp = mongoose.model('Otp', OtpSchema);

module.exports = Otp;

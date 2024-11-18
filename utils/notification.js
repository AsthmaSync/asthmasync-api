import cron from 'node-cron';
import {MedicationModel} from '../models/medication.js';
import {mailtransporter} from '../utils/mail.js';

const sendNotifications = async () => {
    try {
        // Fetch medications with due notifications
        const now = new Date();
        const medications = await MedicationModel.find({
            nextNotification: { $lte: now }, // Notifications due
            taken: false                     // Medication not yet marked as taken
        }).populate('user');                 // Include user details

        for (const med of medications) {
            const user = med.user;

            // Send email notification
            if (user.email) {
                await mailtransporter.sendMail({
                    from: 'gidodoom@gmail.com',
                    to: user.email,
                    subject: `Medication Reminder: ${med.name}`,
                    html: `<p>Hi ${user.name},</p>
                           <p>This is a friendly reminder to take your medication:</p>
                           <ul>
                               <li><strong>Name:</strong> ${med.name}</li>
                               <li><strong>Dosage:</strong> ${med.dosage}</li>
                               <li><strong>Purpose:</strong> ${med.purpose}</li>
                           </ul>
                           <p>Thank you for using AsthmaSync!</p>`
                });
            }

            // Update nextNotification field based on frequency
            const frequencyMap = {
                daily: 1,
                weekly: 7,
                monthly: 30
            };

            const nextNotification = new Date(med.nextNotification);
            nextNotification.setDate(nextNotification.getDate() + frequencyMap[med.frequency]);

            await MedicationModel.updateOne({ _id: med._id }, { nextNotification });
        }

        console.log('Notifications sent successfully.');
    } catch (error) {
        console.error('Error sending notifications:', error.message);
    }
};

// Schedule the job to run every hour
cron.schedule('0 * * * *', sendNotifications);

export default sendNotifications;

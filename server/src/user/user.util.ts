// user.util.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserUtilService {
    async sendMailToUser(mailOptions: any): Promise<void> {
        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'abdelmounaim.abounore@gmail.com',
                pass: 'fmwn tkqf inxe kqim',
            },
        });

        // Send the email
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Error sending email');
        }
    }
}

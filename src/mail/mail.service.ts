import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { GateUser } from '../users/gate-user.schema';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get<string>('MAIL_HOST'),
      port: config.get<number>('MAIL_PORT'),
      secure: false, // TLS
      auth: {
        user: config.get<string>('MAIL_USER'),
        pass: config.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendWelcomeEmail(user: GateUser): Promise<void> {
    const from = this.config.get<string>('MAIL_FROM') || 'LAMA Platform <noreply@lama-platform.com>';

    await this.transporter.sendMail({
      from,
      to: user.email,
      subject: 'Welcome to the LAMA Platform — You now have full access!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#15803d,#16a34a);padding:32px 40px;text-align:center;">
                      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                        LAMA Platform
                      </h1>
                      <p style="color:#bbf7d0;margin:8px 0 0;font-size:14px;">
                        Locally-led Adaptation and Monitoring in Africa
                      </p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 16px;">
                        Welcome, ${user.firstName}!
                      </h2>
                      <p style="color:#444;font-size:15px;line-height:1.6;margin:0 0 16px;">
                        Thank you for registering with the <strong>LAMA Platform</strong>.
                        Your account has been successfully created and you now have <strong>full access</strong>
                        to all our climate adaptation data, research, and resources.
                      </p>
                      <p style="color:#444;font-size:15px;line-height:1.6;margin:0 0 24px;">
                        Here's a summary of what you can now access:
                      </p>
                      <ul style="color:#444;font-size:15px;line-height:1.8;margin:0 0 24px;padding-left:20px;">
                        <li>Interactive climate adaptation maps across Africa</li>
                        <li>Research data, indicators, and impact stories</li>
                        <li>Farming systems, land ownership, and climate dashboards</li>
                        <li>Downloadable datasets and resources</li>
                      </ul>
                      <!-- CTA -->
                      <div style="text-align:center;margin:32px 0;">
                        <a href="https://lama-arin-africa.org"
                           style="display:inline-block;background:#15803d;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:700;font-size:15px;">
                          Visit the Platform
                        </a>
                      </div>
                      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
                      <p style="color:#888;font-size:13px;margin:0;">
                        <strong>Your registration details:</strong><br />
                        Name: ${user.firstName} ${user.lastName}<br />
                        Email: ${user.email}<br />
                        Country: ${user.country}<br />
                        ${user.organization ? `Organisation: ${user.organization}<br />` : ''}
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                      <p style="color:#9ca3af;font-size:12px;margin:0;">
                        You are receiving this email because you registered on the LAMA Platform.<br />
                        If you did not register, please ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
  }
}

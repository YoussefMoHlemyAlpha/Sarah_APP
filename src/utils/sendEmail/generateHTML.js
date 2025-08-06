export function Template(code, name, subject) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Hello ${name},</h2>
      <p>Thank you for signing up!</p>
      <p><strong>${subject}</strong></p>
      <p>Please use the code below to confirm your email address:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #2c3e50;">
        ${code}
      </div>
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <br>
      <p>Best regards,<br>Your Company Team</p>
    </div>
  `;
}

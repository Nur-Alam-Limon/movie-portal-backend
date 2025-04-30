import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or your provider like "Mailgun", "SendGrid", etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPaymentSuccessEmail = async ({
  to,
  movieTitle,
  accessLink,
  accessType,
  expiresAt,
}: {
  to: string;
  movieTitle: string;
  accessLink: string;
  accessType: "BUY" | "RENT";
  expiresAt?: Date | null;
}) => {
  const subject = `Payment Successful – ${movieTitle}`;
  const expiryText =
    accessType === "RENT" && expiresAt
      ? `<p>This rental will expire on <b>${expiresAt.toLocaleString()}</b>.</p>`
      : "";

  const html = `
    <h2>Hi,</h2>
    <p>Your payment for <strong>${movieTitle}</strong> was successful.</p>
    <p>You can now access your content here:</p>
    <p><a href="${accessLink}">${accessLink}</a></p>
    ${expiryText}
    <p>Thank you for using our platform!</p>
  `;

  await transporter.sendMail({
    from: `"MoviePortal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

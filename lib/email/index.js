import { sendEmail } from "./sendEmail.js";
import { buildForgotPasswordEmail } from "./templates/forgotPassword.js";
import { buildEmailChangeCodeEmail } from "./templates/emailChangeCode.js";

export async function sendForgotPasswordEmail({ to, name, resetUrl }) {
  const email = buildForgotPasswordEmail({ name, resetUrl });
  await sendEmail({ to, ...email });
}

export async function sendEmailChangeVerification({
  to,
  name,
  code,
  newEmail,
  expiresMinutes = 10,
}) {
  const email = buildEmailChangeCodeEmail({
    name,
    code,
    newEmail,
    expiresMinutes,
  });
  await sendEmail({ to, ...email });
}

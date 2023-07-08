const resend = require('./resend');

let i = 0;
const GREETING = ["Let's get it!", "It's gym time.", "It's go time."];
async function sendMagicLink({ email, magicLink }) {
  if (!email || !magicLink)
    return console.error('Cannot send a magic link into the void.');

  console.info('Attempting to send magic link email.', email, magicLink);

  try {
    const result = await resend.emails.send({
      from: 'FitPlot <noreply@fitplot.io>',
      to: email,
      subject: 'FitPlot | Magic Link',
      // prettier-ignore
      html: 
        `<h1 style="color:#333;font-size:20px">Sign-In</h1>` +
        `<p>` +
          GREETING[i++] +
          `<a href="${magicLink}" target="_blank">` +
            `✨ Click here to login with this magic link.` +
          `</a>` +
        `</p>` +
        `<div style="color:#aaaaaa;margin-top:12px">If you didn't try to sign-in, you can safely ignore this email.</div>`,
      tags: [
        {
          name: 'category',
          value: 'send_magic_link',
        },
      ],
    });

    console.info('Email sent with `resend`: ', result);
  } catch (emailError) {
    console.error('Failed to send magic link email.', emailError);
  }
}

module.exports = {
  sendMagicLink,
};

const CONFIG = {
  SITE_NAME: "Clickmax",
  NOTIFICATION_TO: "hello@clickmax.com.au",
  AUTOREPLY_FROM: "Clickmax <hello@clickmax.com.au>",
  AUTOREPLY_SUBJECT: "Got it — thanks for reaching out to Clickmax",
  GALLERY_URL: "https://clickmax.com.au/gallery"
};

export async function onRequestPost({ request, env }) {
  let data;
  try {
    const formData = await request.formData();
    data = {
      name: (formData.get("name") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      project_type: (formData.get("project_type") || "").toString().trim(),
      message: (formData.get("message") || "").toString().trim(),
      botcheck: (formData.get("botcheck") || "").toString().trim()
    };
  } catch (e) {
    return jsonResponse({ success: false, message: "Invalid form data" }, 400);
  }

  if (data.botcheck) {
    return jsonResponse({ success: true }, 200);
  }

  if (!data.name || !data.email || !data.message) {
    return jsonResponse({ success: false, message: "Please fill in all required fields" }, 400);
  }

  const projectLabel = {
    "new-site": "A brand new website",
    "update-existing": "Updating an existing site",
    "not-sure": "Not sure yet — exploring"
  }[data.project_type] || data.project_type || "Not specified";

  const submittedAt = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Melbourne",
    dateStyle: "medium",
    timeStyle: "short"
  });

  const notificationHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0A0B1A;">
      <h2 style="margin: 0 0 8px; font-size: 20px;">New contact form submission</h2>
      <p style="margin: 0 0 24px; color: #6b6b7a; font-size: 13px;">Submitted ${submittedAt} (Melbourne time)</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; width: 140px; color: #6b6b7a; vertical-align: top;">Name</td><td style="padding: 12px 0; border-bottom: 1px solid #eee;"><strong>${escapeHtml(data.name)}</strong></td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #6b6b7a; vertical-align: top;">Email</td><td style="padding: 12px 0; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(data.email)}" style="color: #4F46E5; text-decoration: none;">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #6b6b7a; vertical-align: top;">Project</td><td style="padding: 12px 0; border-bottom: 1px solid #eee;">${escapeHtml(projectLabel)}</td></tr>
        <tr><td style="padding: 12px 0; color: #6b6b7a; vertical-align: top;">Message</td><td style="padding: 12px 0; white-space: pre-wrap;">${escapeHtml(data.message)}</td></tr>
      </table>
      <p style="margin: 24px 0 0; color: #6b6b7a; font-size: 12px;">Reply directly to this email to respond to ${escapeHtml(data.name)}.</p>
    </div>
  `;

  const firstName = data.name.split(" ")[0];
  const autoreplyHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0A0B1A;">
      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px;">Hey ${escapeHtml(firstName)},</p>
      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px;">Thanks for reaching out to ${CONFIG.SITE_NAME}. Your message has landed in our inbox and we'll get back to you within 24 hours, Monday to Friday — usually much sooner.</p>
      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px;">If your enquiry is urgent, feel free to reply directly to this email and it'll come straight through.</p>
      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">In the meantime, you can have a look through some of our recent work at <a href="${CONFIG.GALLERY_URL}" style="color: #4F46E5; text-decoration: none;">${CONFIG.GALLERY_URL.replace("https://", "")}</a>.</p>
      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 4px;">Cheers,</p>
      <p style="font-size: 16px; line-height: 1.5; margin: 0; font-weight: 600;">The ${CONFIG.SITE_NAME} team</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 32px 0;">
      <p style="font-size: 12px; color: #6b6b7a; line-height: 1.5; margin: 0;">${CONFIG.SITE_NAME} — Custom websites for Australian businesses<br><a href="https://clickmax.com.au" style="color: #6b6b7a;">clickmax.com.au</a> · <a href="mailto:hello@clickmax.com.au" style="color: #6b6b7a;">hello@clickmax.com.au</a></p>
    </div>
  `;

  try {
    const notifRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: CONFIG.AUTOREPLY_FROM,
        to: CONFIG.NOTIFICATION_TO,
        reply_to: data.email,
        subject: `New enquiry from ${data.name} — ${projectLabel}`,
        html: notificationHtml
      })
    });

    if (!notifRes.ok) {
      const errText = await notifRes.text();
      console.error("Notification email failed:", errText);
      throw new Error("Notification send failed");
    }

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: CONFIG.AUTOREPLY_FROM,
        to: data.email,
        reply_to: CONFIG.NOTIFICATION_TO,
        subject: CONFIG.AUTOREPLY_SUBJECT,
        html: autoreplyHtml
      })
    });

    return jsonResponse({ success: true, message: "Submission received" }, 200);

  } catch (err) {
    console.error("Function error:", err.message);
    return jsonResponse({ success: false, message: "Submission failed" }, 500);
  }
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

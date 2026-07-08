var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
app.use("/assets", import_express.default.static(import_path.default.join(process.cwd(), "src/assets")));
var logoDir = import_path.default.join(process.cwd(), "logo");
var logo2Dir = import_path.default.join(process.cwd(), "logo2");
if (!import_fs.default.existsSync(logoDir)) {
  import_fs.default.mkdirSync(logoDir, { recursive: true });
}
if (!import_fs.default.existsSync(logo2Dir)) {
  import_fs.default.mkdirSync(logo2Dir, { recursive: true });
}
app.use("/logo", import_express.default.static(logoDir));
app.use("/logo2", import_express.default.static(logo2Dir));
app.get("/api/logo.png", (req, res) => {
  const customLogoPath = import_path.default.join(logo2Dir, "logo.png");
  const defaultLogoPath = import_path.default.join(logoDir, "logo.png");
  if (import_fs.default.existsSync(customLogoPath)) {
    return res.sendFile(customLogoPath);
  } else if (import_fs.default.existsSync(defaultLogoPath)) {
    return res.sendFile(defaultLogoPath);
  } else {
    return res.status(404).send("Logo not found");
  }
});
app.post("/api/upload-logo", (req, res) => {
  const { logoData } = req.body;
  if (!logoData) {
    return res.status(400).json({ error: "No logo data provided" });
  }
  try {
    const base64Data = logoData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const customLogoPath = import_path.default.join(logo2Dir, "logo.png");
    import_fs.default.writeFileSync(customLogoPath, buffer);
    return res.json({ success: true, logoUrl: "/api/logo.png" });
  } catch (error) {
    console.error("Error writing custom logo:", error);
    return res.status(500).json({ error: "Failed to write logo to file system" });
  }
});
app.post("/api/delete-logo", (req, res) => {
  try {
    const customLogoPath = import_path.default.join(logo2Dir, "logo.png");
    if (import_fs.default.existsSync(customLogoPath)) {
      import_fs.default.unlinkSync(customLogoPath);
      return res.json({ success: true });
    } else {
      return res.json({ success: true, message: "Custom logo was already empty" });
    }
  } catch (error) {
    console.error("Error deleting custom logo:", error);
    return res.status(500).json({ error: "Failed to delete logo from file system" });
  }
});
app.post("/api/send-test-email", async (req, res) => {
  const { to, subject, html, messageType, athleteName, senderName } = req.body;
  if (!to) {
    return res.status(400).json({ error: "Endere\xE7o de e-mail de destino \xE9 obrigat\xF3rio." });
  }
  const sgApiKey = process.env.SENDGRID_API_KEY;
  const sgFromEmail = process.env.SENDGRID_FROM_EMAIL || "noreply@academia.com";
  const sgFromName = process.env.SENDGRID_FROM_NAME || "Team Gorilas";
  console.log(`[SendGrid Email Test] Tentando enviar e-mail para ${to}. Tipo: ${messageType}. Sujeito: ${subject}`);
  const hasCredentials = !!sgApiKey;
  const emailHtml = html || `
    <div style="font-family: sans-serif; background-color: #0f0f11; color: #f4f4f5; padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #27272a;">
      <div style="text-align: center; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: -1px; font-style: italic;">TEAM GORILAS</h1>
        <span style="color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">Notifica\xE7\xF5es e Alertas do Tatame</span>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #d4d4d8;">
        Ol\xE1, <strong>${athleteName || "Atleta"}</strong>!
      </p>
      
      <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <h3 style="color: #dc2626; margin-top: 0; margin-bottom: 10px; font-size: 16px; border-bottom: 1px solid #27272a; padding-bottom: 8px;">
          ${subject || "Teste de Conex\xE3o com o Tatame"}
        </h3>
        <p style="font-size: 13px; line-height: 1.6; color: #a1a1aa; margin: 0;">
          Este \xE9 um e-mail de teste disparado de forma segura e direta pelo painel comunit\xE1rio da Equipe Gorilas.
        </p>
        <p style="font-size: 13px; line-height: 1.6; color: #e4e4e7; margin-top: 15px; margin-bottom: 0; background-color: #09090b; padding: 12px; border-radius: 8px; border-left: 3px solid #dc2626;">
          <em>"O Jiu-Jitsu n\xE3o \xE9 para se mostrar, \xE9 para se defender. E no tatame formamos irm\xE3os."</em>
        </p>
      </div>

      <div style="margin-top: 25px; font-size: 12px; color: #71717a; line-height: 1.5; border-top: 1px solid #27272a; padding-top: 15px;">
        <p style="margin: 0;">Disparado por: <strong>${senderName || "Administrador"}</strong></p>
        <p style="margin: 5px 0 0 0;">Se voc\xEA n\xE3o solicitou este teste, por favor ignore esta mensagem.</p>
        <p style="margin: 15px 0 0 0; text-align: center; font-size: 10px; color: #52525b; font-family: monospace; text-transform: uppercase; letter-spacing: 1px;">OSS! Irmandade de Tatame</p>
      </div>
    </div>
  `;
  if (hasCredentials) {
    try {
      const sgMail = (await import("@sendgrid/mail")).default;
      sgMail.setApiKey(sgApiKey);
      await sgMail.send({
        to,
        from: {
          email: sgFromEmail,
          name: sgFromName
        },
        subject: subject || "Teste de E-mail - Team Gorilas",
        html: emailHtml
      });
      console.log(`[SendGrid Email Test] E-mail enviado com sucesso via SendGrid!`);
      return res.json({
        success: true,
        realDelivery: true,
        messageId: "SendGrid_API_Call",
        details: {
          to,
          subject: subject || "Teste de E-mail - Team Gorilas",
          from: `${sgFromName} <${sgFromEmail}>`,
          provider: "SendGrid"
        }
      });
    } catch (err) {
      console.error("[SendGrid Email Test] Erro ao enviar e-mail via SendGrid:", err);
      const errorDetails = err.response ? err.response.body : err.message;
      return res.status(500).json({
        error: `Erro ao enviar e-mail via SendGrid: ${err.message}`,
        details: errorDetails,
        smtpConfigured: false,
        realDelivery: false
      });
    }
  } else {
    console.log(`[SendGrid Email Test] SENDGRID_API_KEY n\xE3o configurado. Retornando simula\xE7\xE3o de alta fidelidade.`);
    return res.json({
      success: true,
      realDelivery: false,
      smtpConfigured: false,
      // For front-end backwards compatibility
      sendgridConfigured: false,
      message: "Servidor SendGrid n\xE3o configurado. Para e-mails reais, adicione as vari\xE1veis SENDGRID_API_KEY no menu Settings do AI Studio.",
      details: {
        to,
        from: `${sgFromName} <${sgFromEmail}>`,
        subject: subject || "Teste de E-mail - Team Gorilas",
        html: emailHtml,
        instructions: "Para habilitar o envio de e-mails reais via SendGrid no ambiente de produ\xE7\xE3o, configure as vari\xE1veis de ambiente SENDGRID_API_KEY, SENDGRID_FROM_EMAIL e SENDGRID_FROM_NAME no menu Settings do Google AI Studio."
      }
    });
  }
});
app.post("/api/send-test-push", async (req, res) => {
  const { title, message, targetType, targetValue, recipientName, senderName } = req.body;
  const onesignalAppId = process.env.ONESIGNAL_APP_ID;
  const onesignalApiKey = process.env.ONESIGNAL_API_KEY;
  const hasPushConfig = !!(onesignalAppId && onesignalApiKey);
  console.log(`[OneSignal Push Test] Tentando enviar push. T\xEDtulo: ${title}. Destino: ${targetType} (${targetValue})`);
  const pushTitle = title || "Alerta do Tatame \u{1F94B}";
  const pushMessage = message || "Este \xE9 um teste de notifica\xE7\xE3o push em tempo real.";
  if (hasPushConfig) {
    try {
      const body = {
        app_id: onesignalAppId,
        headings: { en: pushTitle, pt: pushTitle },
        contents: { en: pushMessage, pt: pushMessage }
      };
      if (targetType === "all") {
        body.included_segments = ["Subscribed Users"];
      } else if (targetType === "player_id") {
        body.include_subscription_ids = [targetValue];
      } else if (targetType === "user_id") {
        body.include_aliases = {
          external_id: [targetValue]
        };
        body.target_channel = "push";
      } else {
        body.included_segments = ["Subscribed Users"];
      }
      const response = await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": `Basic ${onesignalApiKey}`
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`[OneSignal Push Test] Notifica\xE7\xE3o enviada com sucesso!`, data);
        return res.json({
          success: true,
          realDelivery: true,
          provider: "OneSignal",
          details: data
        });
      } else {
        console.error(`[OneSignal Push Test] Erro retornado pela API do OneSignal:`, data);
        return res.status(400).json({
          success: false,
          error: data.errors ? Array.isArray(data.errors) ? data.errors.join(", ") : JSON.stringify(data.errors) : "Erro desconhecido na API do OneSignal.",
          details: data
        });
      }
    } catch (err) {
      console.error("[OneSignal Push Test] Erro ao disparar push via OneSignal:", err);
      return res.status(500).json({
        success: false,
        error: `Erro ao enviar push via OneSignal: ${err.message}`
      });
    }
  } else {
    console.log(`[OneSignal Push Test] OneSignal n\xE3o configurado. Retornando simula\xE7\xE3o de alta fidelidade.`);
    return res.json({
      success: true,
      realDelivery: false,
      onesignalConfigured: false,
      message: "Servidor OneSignal n\xE3o configurado. Para disparar notifica\xE7\xF5es reais, adicione as credenciais no menu Settings.",
      details: {
        appId: onesignalAppId || "MOCK_ONESIGNAL_APP_ID_12345",
        title: pushTitle,
        message: pushMessage,
        targetType: targetType || "all",
        targetValue: targetValue || "Subscribed Users",
        instructions: "Para habilitar o envio de push reais, configure as vari\xE1veis de ambiente ONESIGNAL_APP_ID e ONESIGNAL_API_KEY no menu Settings do Google AI Studio."
      }
    });
  }
});
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[TeamGorilas] Full-stack Server listening on http://localhost:${PORT}`);
  });
}
setupServer();
//# sourceMappingURL=server.cjs.map

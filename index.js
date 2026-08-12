const { 
  default: makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  makeInMemoryStore, 
  makeCacheableSignalKeyStore,
  jidDecode, 
  jidEncode,
  jidNormalizedUser,
  getContentType, 
  proto, 
  fetchLatestBaileysVersion, 
  downloadContentFromMessage, 
  generateForwardMessageContent, 
  generateWAMessageFromContent, 
  generateWAMessage, 
  generateMessageID, 
  prepareWAMessageMedia, 
  areJidsSameUser, 
  delay,
  extractMessageContent,
  Browsers,
  isJidGroup,
  isJidBroadcast,
  isJidStatusBroadcast,
  isJidNewsletter,
  getAggregateVotesInPollMessage,
  getDevice,
  WAVersion
} = require('@whiskeysockets/baileys');

const P = require("pino");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const os = require("os");
const chalk = require("chalk");
const gradient = require("gradient-string");
const { smsg } = require("./lib/smsg");

function question(text) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("Arc-Session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: P({ level: "silent" }),
        printQRInTerminal: false,
        markOnlineOnConnection: true,
        generateHighQualityImage: true,
        browser: Browsers.ubuntu("Chrome")
    });

    if (!sock.authState.creds.registered) {
        const rawNum = await question(chalk.green(`Input Your Number To Continue\nExample (+628xxx)\n> `));
        const sanitizedNum = rawNum.replace(/[^0-9]/g, '');

        setTimeout(async () => {
            const code = await sock.requestPairingCode(sanitizedNum, "ARCVYNXX");
            console.log(chalk.yellow("Code: ") + gradient.atlas(code));
        }, 3000);
    }

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log(chalk.red("Session Logged Out"));
            }
        } else if (connection === "open") {
            console.log(gradient.cristal(`Bot Has Been Connected`));
            sock.newsletterFollow("120363410944362020@newsletter")
        }
    });

    sock.public = true;

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek || !mek.message) return;
            if (!sock.public && !mek.key.fromMe && chatUpdate.type === "notify") return;
            const m = smsg(sock, mek);
            require("./messages")(sock, m, chatUpdate);
        } catch (err) {
            console.log(err);
        }
    });

    sock.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

    return sock;
}

startBot();
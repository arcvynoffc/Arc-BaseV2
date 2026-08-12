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
const util = require("util");
const { exec } = require("child_process");
const jimp = require("jimp")
const cfg = require("./config.json");

module.exports = async (sock, m, chatUpdate) => {
try {
const { type, quotedMsg, mentioned, now, fromMe } = m;

const body = m.message?.conversation || m.message?.extendedTextMessage?.text || m.message?.imageMessage?.caption || m.message?.videoMessage?.caption || m.message?.documentMessage?.caption || m.message?.buttonsResponseMessage?.selectedButtonId || m.message?.listResponseMessage?.singleSelectReply?.selectedRowId || m.message?.templateButtonReplyMessage?.selectedId || (m.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : '') || m.message?.buttonsMessage?.contentText || m.message?.listMessage?.description || m.message?.listMessage?.title || m.message?.viewOnceMessage?.message?.conversation || m.message?.viewOnceMessage?.message?.extendedTextMessage?.text || m.message?.viewOnceMessage?.message?.imageMessage?.caption || m.message?.viewOnceMessage?.message?.videoMessage?.caption || m.message?.viewOnceMessageV2?.message?.conversation || m.message?.viewOnceMessageV2?.message?.extendedTextMessage?.text || m.message?.viewOnceMessageV2?.message?.imageMessage?.caption || m.message?.viewOnceMessageV2?.message?.videoMessage?.caption || m.message?.viewOnceMessageV2Extension?.message?.conversation || m.message?.viewOnceMessageV2Extension?.message?.extendedTextMessage?.text || m.message?.viewOnceMessageV2Extension?.message?.imageMessage?.caption || m.message?.viewOnceMessageV2Extension?.message?.videoMessage?.caption || m.message?.editedMessage?.message?.conversation || m.message?.editedMessage?.message?.extendedTextMessage?.text || m.message?.editedMessage?.message?.imageMessage?.caption || m.message?.editedMessage?.message?.videoMessage?.caption || '';  
const prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^><]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^><]/gi)[0] : '';
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1);
const text = args.join(" ");
const q = text;
const isGroup = m.chat.endsWith('@g.us');
const sender = m.key.fromMe ? jidNormalizedUser(sock.user.id) : (m.key.participant || m.chat);
const pushname = m.pushName || "Anonymous";
const botNumber = jidNormalizedUser(sock.user.id);
const ownerNumber = cfg.owner;
const Premium = JSON.parse(fs.readFileSync('./database/premium.json'));
const isPremium = Premium.includes(sender);
const isOwner = ownerNumber.some(number => {
    const ownerJid = number.includes('@') ? number : `${number}@s.whatsapp.net`;
    return ownerJid === sender;
}) || m.key.fromMe;
const groupMetadata = isGroup ? await sock.groupMetadata(m.chat).catch(() => null) : null;
const groupName = groupMetadata ? groupMetadata.subject : '';
const participants = groupMetadata ? groupMetadata.participants : [];
const groupAdmins = isGroup ? participants.filter(v => v.admin !== null).map(v => v.id) : [];
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage ? m.message.extendedTextMessage.contextInfo : null;
const quotedType = quoted ? getContentType(quoted.quotedMessage) : null;
const isMedia = /image|video|sticker|audio|document/.test(type);
const isQuotedImage = type === 'extendedTextMessage' && quotedType === 'imageMessage';
const isQuotedVideo = type === 'extendedTextMessage' && quotedType === 'videoMessage';
const isQuotedSticker = type === 'extendedTextMessage' && quotedType === 'stickerMessage';
const isQuotedAudio = type === 'extendedTextMessage' && quotedType === 'audioMessage';
const isQuotedDocument = type === 'extendedTextMessage' && quotedType === 'documentMessage';

const downloadMedia = async (message, filename) => {
const stream = await downloadContentFromMessage(message, message.mimetype.split('/')[0]);
let buffer = Buffer.from([]);
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);
}
if (filename) fs.writeFileSync(filename, buffer);
return buffer;
};

if (m.message) {
console.log(chalk.hex("#FF0000").bold(`cr : ⏤ 𝖠𝗋𝖼𝗏𝗒𝗇`));
console.log(chalk.hex("#FFD700").bold(`🎭 SUCCESSFULLY CONNECTED 🎭`));
console.log(chalk.hex("#1E90FF").bold("┌───────────────────────────────┐"));
console.log(chalk.hex("#1E90FF").bold("│      NEW MESSAGE LOG          │"));
console.log(chalk.hex("#1E90FF").bold("├───────────────────────────────┤"));
console.log(chalk.hex("#FF8C00")(`│ 📅 ${chalk.hex("#FFFFFF")("Date       :")} ${chalk.hex("#DA00FF")(new Date().toLocaleString())}`));
console.log(chalk.hex("#00CED1")(`│ 💭 ${chalk.hex("#FFFFFF")("Type       :")} ${chalk.hex("#DA00FF")(isGroup ? "GROUP" : "PRIVATE")}`));
console.log(chalk.hex("#7CFC00")(`│ 👤 ${chalk.hex("#FFFFFF")("Sender     :")} ${chalk.hex("#DA00FF")(pushname || "Unknown")}`));
console.log(chalk.hex("#00FA9A")(`│ 🆔 ${chalk.hex("#FFFFFF")("JID        :")} ${chalk.hex("#DA00FF")(sender)}`));
console.log(chalk.hex("#FF69B4")(`│ 💬 ${chalk.hex("#FFFFFF")("Chat       :")} ${chalk.hex("#DA00FF")(m.chat)}`));
console.log(chalk.hex("#FFA500")(`│ 📝 ${chalk.hex("#FFFFFF")("Command    :")} ${chalk.hex("#DA00FF")(isCmd ? command : "-")}`));
console.log(chalk.hex("#20B2AA")(`│ 📨 ${chalk.hex("#FFFFFF")("Message    :")} ${chalk.hex("#DA00FF")((body || "[ Media ]").slice(0, 60))}`));
if (isGroup) {
console.log(chalk.hex("#9370DB")(`│ 👥 ${chalk.hex("#FFFFFF")("Group      :")} ${chalk.hex("#DA00FF")(groupName)}`));
}
console.log(chalk.hex("#1E90FF").bold("└───────────────────────────────┘"));
}

const thumb = fs.readFileSync("./lib/menuv2.jpg")

const runtime = (seconds) => {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${d}d ${h}h ${m}m ${s}s`;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const czx = {
    key: {
        participant: "13135550002@s.whatsapp.net",
        fromMe: false,
        remoteJid: "status@broadcast"
    },
    message: {
        locationMessage: {
            degreesLatitude: 0,
            degreesLongitude: 0,
            name: "⿻ Arc-BaseV2 ⿻",
            address: "⿻ Arc-BaseV2 ⿻"
        }
    }
}

const ArcReply = async (text) => {
    return await sock.sendMessage(m.chat, {
        text,
        contextInfo: {
            forwardingScore: 99999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363410944362020@newsletter",
                newsletterName: "⿻ Arc-BaseV2 ⿻"
            }
        }
    }, { quoted: czx })
}

if (!sock.public && !isOwner) {
return;
}
switch (command) {
case "menu": {
    await sock.sendMessage(
        m.chat,
        {
            image: thumb,
            caption: `おい *${pushname}* 、俺は Arcvyn のアニキによって創られた *${cfg.BotName}* だ。このボットを使ってくれて感謝するぜ。

╭╮ ➟ *Bot Information*
││ *Bot Name:* ${cfg.BotName}
││ *Status:* ${sock.public ? "public" : "self"}
││ *Version:* ${cfg.version}
││ *Type:* Case - CJS/CommonJS
││ *Runtime:* ${runtime(process.uptime())}
╰╯

╭╮ ➟ *Bot Command*
││ - insp
││ - self
││ - public
││ - addown
││ - delown
││ - addprem
││ - delprem
││ - > 
││ - $
╰╯`,
            footer: cfg.BotName,
            contextInfo: {
                forwardingScore: 99999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363410944362020@newsletter",
                    newsletterName: "⿻ Arc-BaseV2 ⿻"
                }
            },
            interactiveButtons: [
                {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: " ",
                        icon: "DOCUMENT",
                        sections: [
                            {
                                title: "Arcvyn AsynCzx",
                                highlight_label: "Ngentoddd",
                                rows: [
                                    {
                                        title: cfg.BotName,
                                        description: "Just For Example",
                                        id: "example"
                                    }
                                ]
                            }
                        ]
                    })
                }
            ]
        },
        {
            quoted: czx
        }
    );
}
break;

case 'addowner': {
    if (!isOwner) return ArcReply("Fitur ini khusus untuk Owner!");

    let target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] 
        || m.message?.extendedTextMessage?.contextInfo?.participant 
        || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

    if (!target || target === '@s.whatsapp.net' || target.length < 16) {
        return ArcReply(`Format salah!\nPenggunaan: ${prefix + command} @tag / reply chat / 628xxx`);
    }

    if (cfg.owner.includes(target)) return ArcReply("Nomor tersebut sudah menjadi Owner!");

    cfg.owner.push(target);

    ArcReply(`Berhasil menambahkan @${target.split('@')[0]} sebagai Owner!`);
}
break;

case 'delowner': {
    if (!isOwner) return ArcReply("Fitur ini khusus untuk Owner!");

    let target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] 
        || m.message?.extendedTextMessage?.contextInfo?.participant 
        || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

    if (!target || target === '@s.whatsapp.net' || target.length < 16) {
        return ArcReply(`Format salah!\nPenggunaan: ${prefix + command} @tag / reply chat / 628xxx`);
    }

    if (!cfg.owner.includes(target)) return ArcReply("Nomor tersebut bukan Owner!");

    const index = cfg.owner.indexOf(target);
    cfg.owner.splice(index, 1);

    ArcReply(`Berhasil menghapus @${target.split('@')[0]} dari daftar Owner!`);
}
break;

case 'addprem': {
    if (!isOwner) return ArcReply("Fitur ini khusus untuk Owner!");

    let target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] 
        || m.message?.extendedTextMessage?.contextInfo?.participant 
        || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

    if (!target || target === '@s.whatsapp.net' || target.length < 16) {
        return ArcReply(`Format salah!\nPenggunaan: ${prefix + command} @tag / reply chat / 628xxx`);
    }

    if (Premium.includes(target)) return ArcReply("User tersebut sudah menjadi User Premium!");

    Premium.push(target);
    fs.writeFileSync('./database/premium.json', JSON.stringify(Premium, null, 2));

    ArcReply(`Berhasil menambahkan @${target.split('@')[0]} ke user Premium!`);
}
break;

case 'delprem': {
    if (!isOwner) return ArcReply("Fitur ini khusus untuk Owner!");

    let target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] 
        || m.message?.extendedTextMessage?.contextInfo?.participant 
        || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

    if (!target || target === '@s.whatsapp.net' || target.length < 16) {
        return ArcReply(`Format salah!\nPenggunaan: ${prefix + command} @tag / reply chat / 628xxx`);
    }

    if (!Premium.includes(target)) return ArcReply("User tersebut bukan User Premium!");

    const index = Premium.indexOf(target);
    Premium.splice(index, 1);
    fs.writeFileSync('./database/premium.json', JSON.stringify(Premium, null, 2));

    ArcReply(`Berhasil menghapus @${target.split('@')[0]} dari daftar User Premium!`);
}
break;

case 'inspect':
case 'insp': {
    if (!isOwner) return ArcReply("Khusus Owner!");
    if (!m.quoted) {
        return ArcReply("⚠️ *Format Salah!*\n\nSilakan Reply pesan yang mau di-inspect untuk dijadikan file dokumen!");
    }
    await sock.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });
    try {
        let target = m.quoted;
        let type = target.mtype;
        let msgStructure = target.message || 
                           (target.fakeObj && target.fakeObj.message) || 
                           target.msg;
        let realType = "unknown";
        if (msgStructure) {
            let tempStructure = msgStructure;
            if (tempStructure.ephemeralMessage && tempStructure.ephemeralMessage.message) {
                tempStructure = tempStructure.ephemeralMessage.message;
            }
            if (tempStructure.viewOnceMessage && tempStructure.viewOnceMessage.message) {
                tempStructure = tempStructure.viewOnceMessage.message;
            } else if (tempStructure.viewOnceMessageV2 && tempStructure.viewOnceMessageV2.message) {
                tempStructure = tempStructure.viewOnceMessageV2.message;
            } else if (tempStructure.viewOnceMessageV2Extension && tempStructure.viewOnceMessageV2Extension.message) {
                tempStructure = tempStructure.viewOnceMessageV2Extension.message;
            } else if (tempStructure.documentWithCaptionMessage && tempStructure.documentWithCaptionMessage.message) {
                tempStructure = tempStructure.documentWithCaptionMessage.message;
            }
            realType = Object.keys(tempStructure)[0] || type || "unknown";
        } else {
            realType = type || "unknown";
        }
        let finalCodeOutput = "";
        if (realType === 'pollCreationMessageV3' || realType === 'pollCreationMessage') {
            let actualData = msgStructure[realType] || msgStructure || {};
            let optionsArray = actualData.options ? actualData.options.map(opt => opt.optionName) : [];
            let pollTemplate = {
                poll: {
                    name: actualData.name || "Polling",
                    values: optionsArray,
                    selectableCount: actualData.selectableOptionsCount || 1
                }
            };
            finalCodeOutput = `await sock.sendMessage(m.chat, ${JSON.stringify(pollTemplate, null, 2)})`;
        } else {
            let contentRaw = msgStructure ? msgStructure : { [realType]: target };
            finalCodeOutput = `await sock.relayMessage(m.chat, ${JSON.stringify(contentRaw, null, 2)}, {})`;
        }
        let randomId = Math.random().toString(16).substring(2, 14);
        let fileName = `insp-${randomId}.js`;
        let fileBuffer = Buffer.from(`// Inspect Result for type: ${realType}\n${finalCodeOutput}`, 'utf-8');
        await sock.sendMessage(m.chat, {
            document: fileBuffer,
            mimetype: 'application/javascript',
            fileName: fileName,
            caption: `*INSPECTED SUCCESS*`
        }, { quoted: czx });

    } catch (err) {
        ArcReply(`❌ Gagal Inspect: ${err.message}`);
    }
}
break;

case 'self': {
    if (!isOwner) return ArcReply('Khusus Owner!')
    sock.public = false
    await ArcReply('Mode bot berhasil diubah ke *Self* (Hanya Owner).')
}
break

case 'public': {
    if (!isOwner) return ArcReply('Khusus Owner!')
    sock.public = true
    await ArcReply('Mode bot berhasil diubah ke *Public* (Semua User).')
}
break

case 'owner':
case 'creator': {
    let contacts = [];
    
    for (let jid of cfg.owner) {
        let number = jid.split('@')[0];
        let vcard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${cfg.ownerName}`,
            `ORG:${cfg.BotName}`,
            `TEL;type=CELL;type=VOICE;waid=${number}:+${number}`,
            'END:VCARD'
        ].join('\n');

        contacts.push({
            displayName: cfg.ownerName,
            vcard: vcard
        });
    }

    await sock.sendMessage(m.chat, {
        contacts: {
            displayName: `Owner ${cfg.BotName}`,
            contacts: contacts
        }
    }, { quoted: m });
}
break;

default:
if (body.startsWith('=>') && isOwner) {
try {
let evaled = await eval(`(async () => { return ${body.slice(3)} })()`);
if (typeof evaled !== 'string') evaled = util.inspect(evaled, { depth: 2 });
await ArcReply(evaled);
} catch (err) {
await ArcReply(util.format(err));
}
} else if (body.startsWith('>') && isOwner) {
try {
let evaled = await eval(body.slice(2));
if (typeof evaled !== 'string') evaled = util.inspect(evaled, { depth: 2 });
await ArcReply(evaled);
} catch (err) {
await ArcReply(util.format(err));
}
} else if (body.startsWith('$') && isOwner) {
try {
exec(body.slice(2), (err, stdout, stderr) => {
if (err) return ArcReply(util.format(err));
if (stderr) return ArcReply(util.format(stderr));
if (stdout) return ArcReply(util.format(stdout));
});
} catch (err) {
await ArcReply(util.format(err));
}
}
break;
}

} catch (err) {
console.log(chalk.red(err));
}
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
fs.unwatchFile(file);
console.log(chalk.red(`Update ${path.basename(file)}`));
delete require.cache[file];
require(file);
});

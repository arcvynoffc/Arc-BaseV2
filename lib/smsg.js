const { getContentType, jidNormalizedUser } = require("@whiskeysockets/baileys");
exports.smsg = (sock, m, store) => {
    if (!m || !m.message) return m;
    if (m.key) {
        m.id = m.key.id;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');

        m.sender = jidNormalizedUser(
            m.fromMe && sock.user.id ||
            m.participant ||
            m.key.participant ||
            m.chat ||
            ''
        );
        if (m.isGroup) {
            m.participant = jidNormalizedUser(m.key.participant) || '';
        }
    }
    m.mtype = getContentType(m.message);
    if (!m.mtype) return m;
    m.msg = (
        m.mtype === 'viewOnceMessage'
        ? m.message[m.mtype]?.message?.[
            getContentType(m.message[m.mtype].message)
          ]
        : m.message[m.mtype]
    );
    if (!m.msg) return m;
    m.body =
        m.message.conversation ||
        m.msg.caption ||
        m.msg.text ||
        (
            m.mtype === 'listResponseMessage'
            ? m.msg.singleSelectReply?.selectedRowId
            : ''
        ) ||
        (
            m.mtype === 'buttonsResponseMessage'
            ? m.msg.selectedButtonId
            : ''
        ) ||
        m.text ||
        '';
    let context = m.msg.contextInfo || {};
    m.mentionedJid = context.mentionedJid || [];
    let quoted = context.quotedMessage || null;
    if (quoted) {
        let type = getContentType(quoted);
        if (!type || !quoted[type]) return m;
        m.quoted = quoted[type];
        if (['productMessage'].includes(type)) {
            type = getContentType(m.quoted);
            if (type) {
                m.quoted = m.quoted[type];
            }
        }
        if (typeof m.quoted === 'string') {
            m.quoted = {
                text: m.quoted
            };
        }
        if (m.quoted) {
            m.quoted.mtype = type;
            m.quoted.id = context.stanzaId;
            m.quoted.chat =
                context.remoteJid ||
                m.chat;
            m.quoted.sender =
                jidNormalizedUser(
                    context.participant || ''
                );
            m.quoted.fromMe =
                m.quoted.sender ===
                jidNormalizedUser(sock.user.id);
            m.quoted.text =
                m.quoted.text ||
                m.quoted.caption ||
                m.quoted.conversation ||
                m.quoted.contentText ||
                m.quoted.selectedDisplayText ||
                m.quoted.title ||
                '';
            m.quoted.mentionedJid =
                context.mentionedJid || [];
            m.quoted.download = () =>
                sock.downloadMediaMessage(m.quoted);

        }
    }
    m.text =
        m.msg?.text ||
        m.msg?.caption ||
        m.message?.conversation ||
        m.msg?.contentText ||
        m.msg?.selectedDisplayText ||
        m.msg?.title ||
        '';
    m.reply = (text, options = {}) => {
        return sock.sendMessage(
            m.chat,
            {
                text,
                ...options
            },
            {
                quoted: m
            }
        );

    };
    return m;
};
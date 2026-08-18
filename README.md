<p align="center">
  <img src="https://files.catbox.moe/3njq3m.png" width="500">
</p>

<h2 align="center">HOW TO INSTALL</h2>

```
git clone https://github.com/arcvynoffc/Arc-BaseV2.git
cd Arc-Base
npm i
```

<h2 align="center">WHATSAPP OLD BUTTONS</h2>

```
case "menu": {
    await sock.sendMessage(
        m.chat,
        {
            buttonsMessage: {
                locationMessage: {
                    degreesLatitude: 0,
                    degreesLongitude: -0,
                    address: global.version,
                    name: global.BotName,
                    jpegThumbnail: thumb
                },
                contentText: `おい *${pushname}* 、俺は Arcvyn のアニキによって創られた *${cfg.BotName}* だ。このボットを使ってくれて感謝するぜ。

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
                footerText: cfg.BotName,
                contextInfo: {
                    forwardingScore: 99999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363410944362020@newsletter",
                        newsletterName: "⿻ Arc-BaseV2 ⿻"
                    }
                },
                buttons: [
                    {
                        buttonId: "example",
                        buttonText: {
                            displayText: "Example Buttons"
                        },
                        type: 1,
                        nativeFlowInfo: {
                            name: "single_select",
                            paramsJson: JSON.stringify({
                                title: "nigga",
                                sections: [
                                    {
                                        title: "Nigga",
                                        highlight_label: "Ngentod",
                                        rows: [
                                            {
                                                title: "Example",
                                                description: "Just For Example",
                                                id: "TEMPEKKK"
                                            }
                                        ]
                                    }
                                ]
                            })
                        }
                    }
                ],
                headerType: 6
            }
        },
        {
            quoted: czx
        }
    );
}
break;
```

<h2 align="center">CONTACT</h2>

<p align="center">
  <a href="https://wa.me/628998052763">
    <img src="https://img.shields.io/badge/WhatsApp-Contact-25D366?style=for-the-badge&logo=whatsapp&logoColor=white">
  </a>
  <a href="https://t.me/ArcvynX">
    <img src="https://img.shields.io/badge/Telegram-Contact-26A5E4?style=for-the-badge&logo=telegram&logoColor=white">
  </a>
  <a href="https://t.me/FunctionBugWhatsApp">
    <img src="https://img.shields.io/badge/Telegram-Channel-26A5E4?style=for-the-badge&logo=telegram&logoColor=white">
  </a>
</p>


const Discord = require('discord.js');
const client = new Discord.Client();

const Parser = require('rss-parser');
const parser = new Parser();

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

var server_update = new FileSync(`${__dirname}/database/server.json`);
var serverConfig = low(server_update);
var config_update = new FileSync(`${__dirname}/database/config.json`);
var config = low(config_update);

var rss_time = 60*15
var color = '141414'

client.once('ready', () => {
    console.log('K-ONNN!');
    var time = 60
    var status = ["Faire des dons", "V0.1| By Rifze ", "Lire un novel"]
    setInterval(function() {
        client.user.setActivity(status[ Math.floor(Math.random()*status.length) ])
    }, 1000*time)
    setInterval(async() => {
        let feed = await parser.parseURL('https://www.novelupdates.fr/feed/')
        console.log(feed);
        feed.items.forEach(item => {
            if (config.get("history").value().indexOf(item.title) < 0) {
                let channels = serverConfig.get(`server`).map('rss_channel').filter(ch => ch !== false).value()
                for (i in channels) client.channels.find(ch => ch.id == channels[i]).send(
                    new Discord.RichEmbed()
                    .setTitle(item.title)
                    .setURL(item.link)
                    .setDescription(`**${item.categories[0]}**\n*par ${item.creator}*`)
                    .setThumbnail(feed.image.url)
                    .setColor(color)
                    )
                config.get("history").push(item.title).write()
                }
            })
        }, 1000*rss_time)
    }
    )
    
    client.login('NzA3Mjk1MTQ2MzI0MTMxOTIw.XrGuZA.FifAQ9f_h31fzSnARHH_NSDORNU');
    
    const prefix = '!'
    
    client.on('guildCreate', guild => {
        serverConfig.set(`server.${guild.id}`, {id:guild.id, name: guild.name, rss_channel: false}).write()
    })
    
    client.on('message', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        
        const args = message.content.slice(prefix.length).split(' ');
        const command = args.shift().toLowerCase();
        
        if (command == 'rss') {
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("il faut la permission Adminstrateur pour utiliser cette commande...")
            if (args.length == 0) return message.reply("tu n'as mentionné aucun salon. (tape `off` pour le désactiver)")
            if (args[0].toLowerCase() == "off") {
                serverConfig.set(`server.${message.guild.id}.rss_channel`, false).write()
                return message.react('✅')
            } 
            var reg = /^<#(\d+)>$/
            var result = reg.test(args[0])
            if (!result) return message.reply("tu n'as mentionné aucun salon.")
            serverConfig.set(`server.${message.guild.id}.rss_channel`, args[0].slice(2, -1)).write()
            message.react('✅')
        }

        if (command == "checkserver") {
            client.guilds.map(a => a).forEach(item => {
                serverConfig.set(`server.${item.id}`, {id:item.id, name: item.name, rss_channel: false}).write()
                console.log('lol')
            })
        }
        
        if (command === 'help'){
            if(args == ''){ 
                let embed = new Discord.RichEmbed()
                .setTitle('Aide NovelFR')
                .setDescription(`
                Pour afficher les novels disponible : 
                !list
                Pour afficher les teams :
                !team
                Pour afficher les novel classer par team : 
                !novel [Team]
                Pour les autres commandes sans rapport avec les novels :
                !help autres
                `)
                .setImage('https://i.pinimg.com/originals/2a/90/2e/2a902e66622a4eba63cf8cf610d489e8.gif')
                .setThumbnail(`${message.author.avatarURL}`)
                .setFooter('NovelFR | By Rifze')
                message.channel.send(embed)
            }
            if(args == 'autres'){
                let embed = new Discord.RichEmbed()
                .setTitle('Aide NovelFR (Autres)')
                .setDescription(`
                !pp
                !ping
                En dév :c`)
                message.channel.send(embed)
            }
        }
        if (command === 'pp'){
            if(!args.length){
                let embed = new Discord.RichEmbed()
                .setTitle('Votre Avatar :')
                .setURL(`${message.author.avatarURL}`)
                .setImage(`${message.author.avatarURL}`)
                message.channel.send(embed)
            }
            else{
                var user = message.mentions.users.first();
                let embed = new Discord.RichEmbed()
                
                .setTitle(`Avatar de ${user.username} :`)
                .setURL(`${user.avatarURL}`)
                .setImage(`${user.avatarURL}`)
                
                message.channel.send(embed)
            }
        }
        if (command === 'ping'){
            message.channel.send(`Ping : ${client.ping} ms`)
        }
        ///////////////////////////////////////////List/////////////////////////////////////////////////
        if(command === 'list'){
            let pages = [`
            **1-**Relâchez cette Sorcière | Release that witch (!rts)
            **2-**La Bataille à Travers Les Cieux | Battle Through the Heavens (!btth)
            **3-**Je Scellerai Les Cieux | I Shall Seal The Heavens (!issth)
            **4-**L'enfant de la Lumière | Child of Light (!col)
            **5-**L'Avatar du Roi | Expert Omniclasses | The King's Avatar (!eo)
            **6-**Tales of Demons and Gods (!todag)
            **7-**Le Monde des Arts Martiaux | Martial World (!mw)
            **8-**Le Dieu Alchimiste Défiant le Monde｜World Defying Dan God(!wddg)
            **9-**Asura, la Divinité des Arts Martiaux｜Martial-God Asura(!mga)
            **10-**Panlong | Coiling Dragon(!panlong)
            **11-**La Voie Céleste | Library of Heaven’s Path (!lohp)
            **12-**Le Véritable Monde des Arts Martiaux｜True Martial World(!tmw)
            **13-**Le Journal d'un Démon | Demon’s Diary (!dd)
            **14-**La Renaissance du Plus Puissant des Dieux Épéistes | Reincarnation of the strongest sword god (!rssg)
            **15-**LiangZhu (!lz)
            **16-**Le Système Technologique d’un Etudiant Hors Pair | Scholar's Advanced Technological System (!sats)
            **17-**Shadow Hack (!sh)
            **18-**Crazy Detective (!cd)
            **19-**Le Quotidien d'un Prodige Immortel | The Daily Life of the Immortal King (!tdlik)
            `,`
            **20-**Laissez-moi Jouer en Paix｜Let me game in peace (!lmgip)
            **21-**Le Maître des Secrets | Lord of the Mysteries (lm)
            **22-**Le Restaurant d'un Père dans un Univers Extraordinaire | A Stay-at-home Dad's Restaurant In An Alternate World(!asahd) 
            `]; 
            
            
            
            let page = 1;
            
            
            let embed = new Discord.RichEmbed()           
            .setColor('#0099ff')
            .setTitle("Liste des Novels :")
            .setDescription(`${pages[page-1]}`) 
            .setFooter(`Page ${page}/${pages.length}`);
            console.log("AH")
            message.channel.send(embed).then(m => {
                m.react("⏪").then( r => {
                    m.react("⏩")
                    const arr = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id; //Filetre a emote <=
                    const avant = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;//filtre a emote =>
                    const arr1 = m.createReactionCollector(arr, { time: 60000});      //Timer <=
                    const avant1 = m.createReactionCollector(avant, { time: 60000}); //Timer =>
                    arr1.on('collect', r => {
                        if (page === 1) return;
                        page--;
                        embed.setDescription(pages[page-1]);
                        embed.setFooter(`Page ${page}/${pages.length}`);
                        m.edit(embed)
                    })
                    avant1.on('collect', r => {
                        if (page === pages.length) return;
                        page++;
                        embed.setDescription(pages[page-1]);
                        embed.setFooter(`Page ${page}/${pages.length}`);
                        m.edit(embed)
                    })
                })
            })   
        }
        if(command === 'team'){
            let pages = [`
            Chireadshttps://discord.com/oauth2/authorize?client_id=707295146324131920&scope=bot&permissions=537394392
            `
            
        ]; 
        
        
        
        let page = 1;
        
        
        let embed = new Discord.RichEmbed()           
        .setColor('#0099ff')
        .setTitle("Liste des Teams :")
        .setDescription(`${pages[page-1]}`) 
        .setFooter(`Page ${page}/${pages.length}`);
        console.log("AH")
        message.channel.send(embed).then(m => {
            m.react("⏪").then( r => {
                m.react("⏩")
                const arr = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id; //Filetre a emote <=
                const avant = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;//filtre a emote =>
                const arr1 = m.createReactionCollector(arr, { time: 60000});      //Timer <=
                const avant1 = m.createReactionCollector(avant, { time: 60000}); //Timer =>
                arr1.on('collect', r => {
                    if (page === 1) return;
                    page--;
                    embed.setDescription(pages[page-1]);
                    embed.setFooter(`Page ${page}/${pages.length}`);
                    m.edit(embed)
                })
                avant1.on('collect', r => {
                    if (page === pages.length) return;
                    page++;
                    embed.setDescription(pages[page-1]);
                    embed.setFooter(`Page ${page}/${pages.length}`);
                    m.edit(embed)
                })
            })
        })   
    }
    //////////////////////////////////////////////////Info Team////////////////////////////////////////
    if (command === 'infoteam'){
        if (args == ''){
            message.channel.send('Tu as oublié de mettre le nom de la team :)')
        }
        if(args == 'chireads'){
            message.channel.send('En dév')
        }
    }
    ////////////////////////////////////////////Novel Team ////////////////////////////////////////////
    if (command === "novel"){
        if(args == ''){
            message.channel.send("Tu as oublié de mettre le nom de la team ;)")
        }
        if(args == 'chireads'){
            let pages = [`
            **1-**Relâchez cette Sorcière | Release that witch (!rts)
            **2-**La Bataille à Travers Les Cieux | Battle Through the Heavens (!btth)
            **3-**Je Scellerai Les Cieux | I Shall Seal The Heavens (!issth)
            **4-**L'enfant de la Lumière | Child of Light (!col)
            **5-**L'Avatar du Roi | Expert Omniclasses | The King's Avatar (!eo)
            **6-**Tales of Demons and Gods (!todag)
            **7-**Le Monde des Arts Martiaux | Martial World (!mw)
            **8-**Le Dieu Alchimiste Défiant le Monde｜World Defying Dan God(!wddg)
            **9-**Asura, la Divinité des Arts Martiaux｜Martial-God Asura(!mga)
            **10-**Panlong | Coiling Dragon(!panlong)
            **11-**La Voie Céleste | Library of Heaven’s Path (!lohp)
            **12-**Le Véritable Monde des Arts Martiaux｜True Martial World(!tmw)
            **13-**Le Journal d'un Démon | Demon’s Diary (!dd)
            **14-**La Renaissance du Plus Puissant des Dieux Épéistes | Reincarnation of the strongest sword god (!rssg)
            **15-**LiangZhu (!lz)
            **16-**Le Système Technologique d’un Etudiant Hors Pair | Scholar's Advanced Technological System (!sats)
            **17-**Shadow Hack (!sh)
            **18-**Crazy Detective (!cd)
            **19-**Le Quotidien d'un Prodige Immortel | The Daily Life of the Immortal King (!tdlik)
            `,`
            **20-**Laissez-moi Jouer en Paix｜Let me game in peace (!lmgip)
            **21-**Le Maître des Secrets | Lord of the Mysteries (lm)
            **22-**Le Restaurant d'un Père dans un Univers Extraordinaire | A Stay-at-home Dad's Restaurant In An Alternate World(!asahd) 
            `]; 
            
            
            
            let page = 1;
            
            
            let embed = new Discord.RichEmbed()           
            .setColor('#0099ff')
            .setTitle("Liste des Novels de la Chireads :")
            .setDescription(`${pages[page-1]}`) 
            .setFooter(`Page ${page}/${pages.length}`);
            console.log("AH")
            message.channel.send(embed).then(m => {
                m.react("⏪").then( r => {
                    m.react("⏩")
                    const arr = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id; //Filetre a emote <=
                    const avant = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;//filtre a emote =>
                    const arr1 = m.createReactionCollector(arr, { time: 60000});      //Timer <=
                    const avant1 = m.createReactionCollector(avant, { time: 60000}); //Timer =>
                    arr1.on('collect', r => {
                        if (page === 1) return;
                        page--;
                        embed.setDescription(pages[page-1]);
                        embed.setFooter(`Page ${page}/${pages.length}`);
                        m.edit(embed)
                    })
                    avant1.on('collect', r => {
                        if (page === pages.length) return;
                        page++;
                        embed.setDescription(pages[page-1]);
                        embed.setFooter(`Page ${page}/${pages.length}`);
                        m.edit(embed)
                    })
                })
            })   
        }
    }
    ////////////////////////////////////// Chiread (22)//////////////////////////////////////////////
    if ( command === 'rts'){
        let embed = new Discord.RichEmbed()
        .setTitle("Relâchez cette Sorcière | Release that witch | 放开那个女巫")
        .setColor('#e21711')
        .setURL("https://chireads.com/category/translatedtales/liberez-la-sorciere-release-that-witch/")
        .setDescription(`Suite à un épuisement professionnel, Cheng Yan, jeune ingénieur en informatique chinois, perd connaissance et se réveille en Europe Médiévale dans la peau du Prince Roland, héritier potentiel du trône de Graycastle. 
        Malgré certaines similitudes, ce monde est très différent du sien. Plongé, par décret du Roi, au cœur d’une bataille acharnée contre ses « frères et sœurs » et catalogué par son « père » de cas désespéré, Roland va devoir redoubler d’ingéniosité et user de son expérience passée s’il veut l’emporter…. 
        Qui sont vraiment les sorcières, qualifiées de servantes du diable et pourchassées par l’Eglise? Qu’est-ce que le pouvoir magique? Autant de questions auxquelles il va devoir répondre s’il souhaite un jour changer la face du monde.`)
        .setImage('https://image.noelshack.com/fichiers/2020/19/4/1588870850-0.jpg    ')
        .addField(`Auteur : Er Mu    Traducteur : Galadriel` , `Statut de Parution : 3 Chapitres ：Mar-Jeu-Sam\n\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/chapitre-1-je-suis-un-prince-royal/2017/07/16/)\n` )
        message.channel.send(embed)
    }
    if ( command === 'btth'){
        let embed = new Discord.RichEmbed()
        .setTitle("La Bataille à Travers Les Cieux | Battle Through the Heavens | 斗破苍穹")
        .setColor('#4daed8')
        .setURL("https://chireads.com/category/translatedtales/battle-through-the-heavens/")
        .setDescription(`
        C’est l’histoire d’un territoire ou seuls quelques-uns accèdent à la force et au pouvoir, un monde où les plus forts donnent le ton et où les faibles doivent obéir… 
        Dans cet univers riche de trésors et de beautés, mais aussi de dangers imprévisibles, le jeune Xiao Yan qui avait montré trois ans plus tôt un talent sans précédent avait soudain tout perdu: Ses pouvoirs, sa réputation et la promesse faite à sa mère. Quelle sorcellerie lui avait fait perdre sa force? Et pourquoi sa jeune compagne était-elle aussitôt apparue?`)
        .setImage('https://4.bp.blogspot.com/-hdXWaCDAnMY/W6f-Z-QtkPI/AAAAAAAABOs/lNwipPuSiCsUg05VEt8FRiEvMgBBocR4wCLcBGAs/s1600/Battle-through-the-heavens-main-characters.jpg   ')
        .addField(`Auteur : Er Mu    Traducteur : Galadriel` , `Statut de Parution : 3 Chapitres ：Mar-Jeu-Sam\n\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/chapitre-1-le-genie-dechu/2017/07/13/)\n` )
        message.channel.send(embed)
    }       
    if ( command === 'issth'){
        let embed = new Discord.RichEmbed()
        .setTitle("Je Scellerai Les Cieux | I Shall Seal The Heavens | 我欲封 ")
        .setColor('#e21711')
        .setURL("https://chireads.com/category/translatedtales/je-scellerai-les-cieux/")
        .setDescription(`
        Je scellerai les Cieux est une des plus populaires histoires Xianxia en Chine. L’histoire raconte l’évolution d’un jeune érudit qui s’appelle Meng Hao. Il est forcé de rejoindre une Secte des Cultivateurs Immortels. Dans le monde des Cultivateurs, les forts dominent les faibles, et la loi de la jungle règne. Meng Hao doit s’adapter pour survivre. Pourtant, il n’a jamais oublié ses idéaux de confucianisme et daoisme avec lesquels il a grandi. Cette faculté d’adaptation ajoutée à sa personnalité tenace, lui ont permis d’embarquer sur une voie pour devenir un vrai héro. Qu’est que veut dire « Scellerai les Cieux ? » ça c’est un secret que vous devrez découvrir avec Meng Hao.`)
        .setImage('https://images6.alphacoders.com/952/thumb-350-952033.jpg  ')
        .addField(`Auteur : Er Gen          Babelcheck : Tatyr ` , `Statut de Parution : 3 Chapitres，Lun-Mer-Ven\n\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/chapitre-1-leleve-meng-hao/2017/07/27/)\n` )
        message.channel.send(embed)
    }
    if ( command === 'col'){
        let embed = new Discord.RichEmbed()
        .setTitle("L'enfant de la Lumière | Child of Light | 光之子        ")
        .setColor('#f3f508')
        .setURL("https://chireads.com/category/translatedtales/child-of-light-lenfant-de-la-lumiere/")
        .setDescription(`Le paresseux Zhang Gong décide d'apprendre la magie de la lumière,
        une magie souvent ridiculisée comme inutile pour sa nature défensive.
        Cependant, il devient finalement le légendaire Grand Magister. En
        essayant de mettre fin à la séparation est/ ouest du continent pour unir
        toutes les races différentes, il devient l'Enfant de la Lumière de chacune
        d’entre elles.`)
        .setImage('https://n.sinaimg.cn/sinacn10122/339/w640h499/20191010/ebac-ifvwfti3453909.png   ')
        .addField(`Auteur : Tang Jia San Shao          Traducteur : Thor` , `      Statut de Parution : Terminé\n   Nombre de Chapitre : 356\n\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/lenfant-de-la-lumiere/2017/07/24/)\n` )
        message.channel.send(embed)
    } 
    if ( command === 'eo'){
        let embed = new Discord.RichEmbed()
        .setTitle("L'Avatar du Roi | Expert Omniclasses | The King's Avatar | 全职高手        ")
        .setColor('#000000')
        .setURL("https://chireads.com/category/translatedtales/lavatar-du-roi-expert-omniclasses-the-kings-avatar/")
        .setDescription(`Dans le MMORPG Glory, Ye Qiu est connu comme un joueur professionnel de premier ordre, parfait. Cepandant, dû à une myriade de raisons, il est renvoyé de son équipe. Après avoir quitté la scène pro, il trouve un travail en tant que manager dans un cybercafé. Lorsque Glory ouvre son dixième serveur, il se lance de nouveau dans le jeu. Avec plus de 10 ans d'expérience, la mémoire de son passé, et une arme faite main incomplète, il entame son retour vers les sommets !`)
        .setImage('https://empiredesnovels.fr/wp-content/uploads/2017/01/12.jpg  ')
        .addField(`Auteur : Butterfly Blue          Babelcheck : Geofraynils` , `      Statut de Parution : 3 Chapitres, Mar-Jeu-Sam        \n\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/lavatar-du-roi-expert-omniclasses-the-kings-avatar/chapitre-1-le-dieu-du-combat-banni/2020/04/10/)\n` )
        message.channel.send(embed)
    }        
    if ( command === 'todag'){
        let embed = new Discord.RichEmbed()
        .setTitle("Tales of Demons and Gods | 妖神记        ")
        .setColor('#f8971d')
        .setURL("https://chireads.com/category/translatedtales/tales-of-demons-and-gods/")
        .setDescription(`Nie Li, le plus puissant spirite démon dans sa précédente vie, se tenait au sommet du monde des arts martiaux. Malheureusement, il perdit la vie durant la bataille contre l’Empereur Vertueux et ses six bêtes de rang Divin. Son âme retourna alors dans le temps jusqu’à l’époque où il avait 13 ans. Bien qu’il soit le plus faible de sa classe et celui avec le plus mauvais talent inné, avec l’aide des vastes connaissances qu’il a accumulées dans sa vie passée, il s’entraînera plus vite que quiconque.
        
        Cette fois, il protégera Bourg-Triomphe qui, dans le futur, sera assailli par des bêtes démon et détruite. Il protégera également son amour, ses amis et sa famille qui tous finirent par mourir. Et enfin, il détruira la Famille Sacrée qui avait abandonné son devoir et trahi Bourg-Triomphe.`)
        .setImage('https://www.thefashionpool.com/wp-content/uploads/2020/05/553f9.jpg ')
        .addField(`Auteur : Mad Snail          Traducteur : Babel` , `      Statut de Parution : en pause       \n\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/tales-of-demons-and-gods/chapitre-1-renaitre/2020/03/26/)\n` )
        message.channel.send(embed)
    }     
    if ( command === 'mw'){
        let embed = new Discord.RichEmbed()
        .setTitle("Le Monde des Arts Martiaux | Martial World | 武极天下        ")
        .setColor('#000000')
        .setURL("https://chireads.com/category/translatedtales/le-monde-des-arts-martiaux-martial-world/")
        .setDescription(`Dans le Domaine des Dieux, d’innombrables légendes se sont battues pour obtenir le Cube. Pourtant, après une bataille, celui-ci disparaît à travers le vide en emportant tous ses secrets. Lin Ming, un jeune homme d’un monde lointain, tombe par hasard sur cet artéfact mystérieux et tant convoité. C’est alors que commence son voyage pour devenir un héros.
        
        "Feu, douleur inexorable du désaveu.
        Au cour de ma journée, je devrai t'affronter.
        Calciné, de mes cendres je m’élèverai.
        Tel un phénix réincarné, j'affronterai ma destinée, sans chercher à m’en préserver.
        Franchir mon samsara, Vivre le nirvana.
        Tel est mon Dao"
        Lin Ming`)
        .setImage('https://lh3.googleusercontent.com/proxy/Twloy51Jp4VkY9GRyB7m2qA6ox5VfZavS4FKB4AwolLKNtcMX2raNDYctwtc6qoHsyphi4GFk4gFMFrenAq0ec2m6pI1vLCfBjVcYGcl-aYo32mkdAgRalrO5o8331e4S3jY ')
        .addField(`Auteur : Cocooned Cow          Traducteur : Vili | check: Yoda   ` , `        Statut de Parution : 2 chapitres , Mer Dim       \n\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/chapitre-0-le-cube-magique/2017/08/14/)\n` )
        message.channel.send(embed)    
    }
    if ( command === 'wddg'){
        let embed = new Discord.RichEmbed()
        .setTitle("Le Dieu Alchimiste Défiant le Monde｜World Defying Dan God | 傲世丹神        ")
        .setColor('#4daed8')
        .setURL("https://chireads.com/category/translatedtales/world-defying-dan-god/")
        .setDescription(`       Chen Xiang fut frappé par le malheur, il naquit sans veine spirituelle, pour cause, il ne pouvait pas pratiquer les arts martiaux. Cependant, par le plus grand des hasards, il eut une rencontre fatidique avec deux mystérieuses beautés. Avec cette rencontre, sa vie prit une autre tournure bien meilleure. Grâce à cela, les chemins de la cultivation et de l’alchimie s’ouvrirent. Ce nouveau monde passionnant était rempli d’immortels, de démons, de dieux, et de bêtes mystiques célestes. En commençant son aventure de la vie, il rencontra de nombreux secrets et de mystères cachés dans ce monde. Explorez et contemplez avec notre héros ces mystères cachés où nul ne l’aurait imaginé, son ascension pour atteindre le sommet de la voie martiale, pendant qu’il flirte avec les femmes, se fait des amis et défis les seigneurs, les immortels et les démons dans l’immensité de ce monde martial.`)
        .setImage('https://vignette.wikia.nocookie.net/world-defying-dan-god/images/2/2f/327976.jpg/revision/latest?cb=20190608214050  ')
        .addField(`Auteur : Solitary Little Thief          Babelcheck : Zoro ` , ` Statut de Parution : 3 Chapitres ：Mar-Jeu-Sam\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/sur-le-web/chapitre-01-lherbe-spirituelle-infernale/2017/08/17/)\n` )
        message.channel.send(embed)
    }       
    if ( command === 'mga'){
        let embed = new Discord.RichEmbed()
        .setTitle("Asura, la Divinité des Arts Martiaux｜Martial-God Asura | 修罗武神        ")
        .setColor('#f04040')
        .setURL("https://chireads.com/category/translatedtales/world-defying-dan-god/")
        .setDescription(`      Considérant le potentiel, mêmes si vous n’êtes pas un génie, vous pouvez toujours apprendre des techniques martiales. N’importe qui peut en apprendre sans même l’aide d’un maître. Considérant la force, même si vous possédez une myriade d’artefacts ou d’objet magiques, cela ne suffira pas à vaincre mon armée d’Esprits. J'étais faible et je domine maintenant le monde des arts martiaux.
        
        Qui suis-je ?
        
        Le monde me connaît sous le nom d’Asura, mais cela ne me suffit pas. Dorénavant, je serai Asura, la Divinité des Arts Martiaux !
        `)
        .setImage('https://2.bp.blogspot.com/-mjYX2XkmQpY/XCB3zMcg0dI/AAAAAAAAAhU/VBgHAx-jxHsW0-lKc4bxgk_1fU8qXej1QCLcBGAs/s1600/tumblr_inline_oslm4rQQd81ux6g80_1280.jpg ')
        .addField(`Auteur : Kindhearted Bee          Babelcheck : Porthos ` , ` Statut de Parution : 3 Chapitres Lun-Mer-Ven        \n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/sur-le-web/chapitre-1-disciple-du-cercle-exterieur/2017/08/17/)\n` )
        message.channel.send(embed)
    }           
    if ( command === 'panlong'){
        let embed = new Discord.RichEmbed()
        .setTitle("Panlong | Coiling Dragon | 盘龙            ")
        .setColor('#ec6565')
        .setURL("https://chireads.com/category/translatedtales/panlong-coiling-dragon/")
        .setDescription(`     
        Les Empires se créent et se détruisent sur le continent de Yulan. Les Saints, des immortels d’un pouvoir inimaginable, combattent avec des sorts et des épées, laissant dans leurs sillages destructions et ravages. Les Créatures Magiques règnent sur les montagnes où les braves (ou les fous) viennent tester leur force. Même les meilleurs peuvent tomber sous les coups des plus puissants. Les plus forts vivent royalement, les plus faibles luttent pour survivre jusqu’au lendemain. C’est dans ce monde que Linley est né. Élevé dans le village Wushan, Linley est l’héritier du clan Baruch, le clan des légendaires Guerriers DragonBlood. Leur renommée fit auparavant trembler le monde, mais le clan est maintenant si misérable que même leurs héritages ancestraux ont été vendus. Investi de la mission de regagner la gloire passée de son clan, Linley va traverser d’innombrables épreuves et tribulations, se faisant de puissants amis, mais aussi de mortels ennemis. Venez assister à la nouvelle légende qui est en train de se créer : La légende de Linley Baruch !`)
        .setImage('https://scans-mangas.com/uploads/manga/panlong/chapters/0001/001.jpg ')
        .addField(`Auteur : I Eat Tomatoes          Traducteur : Galadriel ` , `    Statut de Parution : 3 Chapitres Lun-Mer-Ven\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/sur-le-web/chapitre-01-matinee-au-village/2017/08/17/)\n` )
        message.channel.send(embed)
    }      
    if ( command === 'lohp'){
        let embed = new Discord.RichEmbed()
        .setTitle("La Voie Céleste | Library of Heaven’s Path | 天道图书馆        ")
        .setColor('#000000')
        .setURL("https://chireads.com/category/translatedtales/la-voie-celeste/")
        .setDescription(`Venu d’une autre époque, Zhang Xuan, un simple bibliothécaire, se retrouve dans la peau d’un professeur dépressif dont la réputation reste à faire. 
        Sa mission serait compromise si, à son arrivée dans ce monde, il n'avait reçu le don de faire apparaître dans son esprit une incroyable bibliothèque.
        
        En effet, tout ce qu’il rencontre, fut-ce un être humain, un animal ou un objet, est immédiatement recensé dans un livre qui lui en indique tous les défauts et les points faibles. 
        Grâce à ce don, il va pouvoir guider au mieux ses élèves et faire de simples étudiants les plus grands experts au monde.`)
        .setImage('https://vignette.wikia.nocookie.net/fandom-fanon/images/9/98/Yang_Xuan.jpg/revision/latest?cb=20190114134051  ')
        .addField(`Auteur : Heng Sao Tian Ya          Traducteur : Thor  ` , `      Statut de Parution : 7 chapitres / semaine        \n\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/vol-1-chapitre-01-escroc/2018/06/23/)\n` )
        message.channel.send(embed)
    }           
    if ( command === 'tmw'){ 
        let embed = new Discord.RichEmbed()
        .setTitle("Le Véritable Monde des Arts Martiaux｜True Martial World｜真武世界        ")
        .setColor('#4daed8')
        .setURL("https://chireads.com/category/translatedtales/le-veritable-monde-des-arts-martiaux/")
        .setDescription(`  Suite à la victoire finale de l’Empereur des Hommes et de ses experts sur le Roi des Démons Abyssaux, la mystérieuse carte de Cristal Pourpre qui avait autrefois retenu le Roi des Démons prisonnier a disparu dans un vortex de l’espace-temps.
        Yi Yun, un jeune adulte, se retrouve malgré lui plongé dans un monde où les Arts Martiaux ont une place primordiale, ou des maîtres hors-pair ont déjà fait leur chemin et découvre une carte de cristal d’origine inconnue. Ici commence son aventure au sein de ce monde merveilleux !`)
        .setImage('https://pbs.twimg.com/media/DnLeDkXUYAEvxiQ.jpg')
        .addField(`Auteur : Cocooned Cow          Traducteur : Bard  ` , `  Statut de Parution : Traduction en pause\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/chapitre-1-la-tombe-de-yi-yun/2019/07/02/)\n` )
        message.channel.send(embed)
    }    
    if ( command === 'dd'){ 
        let embed = new Discord.RichEmbed()
        .setTitle("Le Journal d'un Démon | Demon’s Diary | 魔天记        ")
        .setColor('#7925e2')
        .setURL("https://chireads.com/category/translatedtales/demons-diary/")
        .setDescription(`Depuis sa plus tendre enfance, Liu Ming vivait dans une prison appelée l’Île Sauvage, où les prisonniers n’étaient ni contrôlés par des gardes, ni par des systèmes de sécurité. Lorsqu’en raison d’événements mystérieux l’île sombra, seule une poignée de personnes survécut. Ces survivants sont alors poursuivis par l’armée impériale...`)
        .setImage('https://lh3.googleusercontent.com/proxy/AZpTYHVCYbTX_rMF9zIBd1Rs2zTgCwghxpqOrJMoy_mbjL8IxbDacflFmZVPR7Ybxys4LLSa-RyZ0nP_LAWTesrnl5B35tPjvgp5WZcnV00w')
        .addField(`Auteur : Wang Yu          Babelcheck : bipbipetitsonstressant    ` , `     Statut de Parution : 5 Chapitres : Mercredi à Dimanche\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/chapitre-1-evasion-de-lile-sauvage/2020/02/05/)\n` )
        message.channel.send(embed)
    }     
    if ( command === 'rssg'){ 
        let embed = new Discord.RichEmbed()
        .setTitle("La Renaissance du Plus Puissant des Dieux Épéistes | Reincarnation of the strongest sword god | 重生之最强剑神")
        .setColor('#4daed8')
        .setURL("https://chireads.com/category/translatedtales/la-renaissance-du-plus-puissant-des-dieux-epeistes/")
        .setDescription(`Après un nouveau départ, Shi Feng entre dans un jeu virtuel qu’il connaît bien afin de maîtriser sa destinée. Cette fois-ci, il ne se laissera pas manipuler.
        Il avait été Roi Epéiste de niveau 200. Grâce à cette seconde chance, il atteindra des sommets! 
        Des méthodes pour amasser des richesses ; des stratégies de conquête de donjon ; des quêtes légendaires ; des maps secrètes ; des techniques de combat enfouies !
        Tous les secrets que même les Bêta-Testeurs n’avaient pas découverts, lui les percera à jour.
        Entre les guerres massives dans le monde virtuel et sa vie florissante dans le réel, il deviendra une divinité et marquera l’histoire de son épée. 
        La légende d'un homme devenu Dieu Épéiste commence ici…`)
        .setImage('https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/1991232/201665_866104.png')
        .addField(`Auteur : Lucky Old Cat          Traducteur : Crycks  ` , `  Statut de Parution : 3 Chapitres ：Mar-Jeu-Sam\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/chapitre-1-un-nouveau-depart/2019/11/25/)\n` )
        message.channel.send(embed)
    }      
    if ( command === 'lz'){ //image a changé
        let embed = new Discord.RichEmbed()
        .setTitle("LiangZhu | 良渚        ")
        .setColor('#4daed8')
        .setURL("https://chireads.com/category/translatedtales/liang-zhu/")
        .setDescription(`Liang Zhu est avant toute chose le nom d’un site archéologique inscrit depuis peu au patrimoine mondial de l’UNESCO. C’est aussi le nom d’une civilisation urbaine très ancienne du delta du Yangzi Jiang, sur la côte sud-est de la Chine.
        
        L’auteur de ce roman s’est directement inspiré des découvertes concernant ce peuple vivant il y a près de 5000 ans, pour nous raconter l’histoire d’un talentueux chasseur, le jeune Liang, et de Zhu, une jeune fille de la même tribu destinée à partir, comme toutes les jeunes filles, vers un autre clan. Le jeune Liang ne cessera d’apprendre les différents arts de leur culture, comme la poterie ou le travail du jade, notamment au côté du grand-père Rivière, directement inspiré par le ciel et la lune, ou de son amie Zhu et de ses compagnons de chasse avec qui il vivra de nombreuses péripéties.
        `)
        .setImage('https://afpbb.ismcdn.jp/mwimgs/0/3/810x540/img_03d92b29ec3089b0c64c585c0fa0e7f7216589.jpg')
        .addField(`Auteur : Jie Yu 2          Babelcheck : Yoda             ` , `      Statut de Parution : 2 chapitres / semaine \n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/chapitre-1-2/2019/12/27/)\n` )
        message.channel.send(embed)
    }                                                                 
    if ( command === 'sats'){ 
        let embed = new Discord.RichEmbed()
        .setTitle("Le Système Technologique d’un Etudiant Hors Pair | Scholar's Advanced Technological System | 学霸的黑科技系统     ")
        .setColor('#7925e2')
        .setURL("https://chireads.com/category/translatedtales/le-systeme-technologique-dun-etudiant-hors-pair/")
        .setDescription(`
        Après avoir subi un important coup de chaleur lors d’un été torride, Lu Zhou, un étudiant universitaire très travailleur mais fauché, hérite d’un système technologique de pointe. Avec cet atout inattendu, sa vie universitaire change du jour au lendemain.
        
        Obtenir son Master ? Facile… Un Doctorat ? Pas de problème…
        
        Il n'était qu'un étudiant ordinaire, mais devient rapidement une véritable célébrité dans le monde de la science et des mathématiques. Avec les missions confiées par le système, il est en passe de remporter un prix Nobel.
        
        "Système, les points peuvent-ils être échangés contre de l'argent?"
        
        "Non."
        
        "Bon sang, à quoi tu sers alors!?"
        
        "Ce système fera de vous l’érudit ultime qui culmine aux sommets, alors à quoi vous servirait l’argent?"`)
        .setImage('https://lh3.googleusercontent.com/proxy/e5E6QylxQt40rV7Xu5vaMcA96LXioCorJRtspdzUEh7UkMIJcqhTnTNo1PIeH5QKckgIgQhb9o1NQiegRWtKjKkml-8gEld9VjwkXPNejflIB-Y')
        .addField(`Auteur : Morning Star LL          Babelcheck : Popolato    ` , `   Statut de Parution : 3 Chapitres: Lun Mer Ven\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/chapitre-1-choque-un-travail-a-six-chiffres-est-en-fait/2020/01/07/)\n` )
        message.channel.send(embed)
    }    
    if ( command === 'sh'){ 
        let embed = new Discord.RichEmbed()
        .setTitle("Shadow Hack | 我的影子会挂机        ")
        .setColor('#7925e2')
        .setURL("https://chireads.com/category/translatedtales/shadow-hack/")
        .setDescription(`
        Par coïncidence, Li Yunmu a découvert une super machine de l’ère des ténèbres de l’humanité. À partir de ce moment, sa vie ordinaire ne sera plus jamais la même ! Aptitude ? Talent inné ? Qu’est-ce que c’est ? Ça se mange ? Je n’ai ni aptitude ni compétence innée, mais mon ombre peut monter en niveau en utilisant des Hack. Expérience, points de compétence, prouesse au combat …… .
        Tous pourraient être Hacké. Même endormi ou fatigué, je pourrais encore améliorer ses compétences. [Ding, ton ombre a tué une fourmi, tu as gagné des points d’expérience et des points d’aptitude.] [Ding, ton ombre a tué une libellule, elle a laissé tomber une boîte dimensionnelle.] Merde, même tuer des insectes peut également augmenter son expérience et obtenir des récompenses. 
        Quoi de mieux !`)
        .setImage('https://www.mtlnovel.com/wp-content/uploads/2019/12/shadow-hack-225x300.jpg.webp')
        .addField(`Auteur : Great Lord of Cloudland          Babelcheck : Zoro        ` , `  Statut de Parution : 3 Chaps. Lun-Mer-Dim\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/chapitre-1-ombre-mysterieuse/2020/02/08/)\n` )
        message.channel.send(embed)
    }     
    if ( command === 'cd'){ 
        let embed = new Discord.RichEmbed()
        .setTitle("Crazy Detective｜狂探      ")
        .setColor('#7925e2')
        .setURL("https://chireads.com/category/translatedtales/crazy-detective/")
        .setDescription(`Que se passe-t-il quand un voyou traverse le couloir de la mort à cause d'une histoire de cœur et reviens à la vie dans un monde parallèle dans son propre corps (mais quelque peu différent^^), portant le même nom, mais ... cette fois en tant que détective ! Détective ou voyou, peu importe, je vous présente l'inspecteur fou aux méthodes de voyou ! `)
        .setImage('https://p0.ssl.qhimg.com/t01242a91d0b3a6e1a0.jpg')
        .addField(`Auteur : Kuang Hai Wang Hu          Babelcheck : Zoro    ` , ` Statut de Parution : 3 Chapitres ：Lun-Mer-Ven\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/crazy-detective/chapitre-1-taser-taser/2020/03/26/)\n` )
        message.channel.send(embed)
    }          
    if ( command === 'tdlik'){ 
        let embed = new Discord.RichEmbed()
        .setTitle("Le Quotidien d'un Prodige Immortel | The Daily Life of the Immortal King | 仙王的日常生活     ")
        .setColor('#7925e2')
        .setURL("https://chireads.com/category/translatedtales/le-quotidien-dun-prodige-immortel/")
        .setDescription(`Dans un avenir lointain, la terre deviendra un monde de cultivation des Arts Martiaux. Un être destiné à surpasser la civilisation naîtra et défiera toutes les normes en progressant de deux royaumes complets tous les deux ans, une vitesse de cultivation encore jamais égalée. A 16 ans vient la période du lycée et pour ce jeune homme qui possède déjà une puissance insondable, même pour les puissants de ce monde, le jour de la rentrée des classes est la chose qu'il redoute le plus! Appréhension que sa toute puissance ne peut résoudre ... ... ce pratiquant des arts martiaux qui défie les lois de la cultivation parviendra-t-il à vivre comme il le souhaite, à savoir, en tant qu'étudiant ordinaire ?`)
        .setImage('https://i.ytimg.com/vi/XnC8oRaPO-8/maxresdefault.jpg')
        .addField(`Auteur : Kuxuan          Babelcheck : Zoro   ` , `    Statut de Parution : 3 Chapitres ：Mar-Jeu-Sam\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/le-quotidien-dun-prodige-immortel/chapitre-1-le-plus-riche-des-riches/2020/03/30/)\n` )
        message.channel.send(embed)
    }  
    if ( command === 'lmgip'){ 
        let embed = new Discord.RichEmbed()
        .setTitle("Laissez-moi Jouer en Paix｜Let me game in peace｜我只想安静地打游戏       ")
        .setColor('#7925e2')
        .setURL("https://chireads.com/category/translatedtales/laissez-moi-jouer-en-paix/")
        .setDescription(`
        1 goutte de sang = 1 vie 
        Les autres dorment la nuit, moi je joue et je saigne.
        
        Depuis que les tempêtes dimensionnelles sont apparues sur Terre, de nombreuses zones dimensionnelles se sont formées, amenant avec elles toutes sortes de créatures dimensionnelles... des Immortels, des Bouddhas, des Démons, des Anges, des Elfes, et bien d’autres encore.
        
        Pourtant, toutes ces étranges zones dimensionnelles peuvent se transformer en donjons sur mon téléphone. D'autres personnes risquent leur vie en s'y aventurant mais moi je n’utilise qu’une goutte de sang pour les explorer.
        
        Les monstres lâchent des Cristaux qui augmentent les statistiques, donnent de nouvelles compétences et peuvent même devenir des bêtes de compagnie. Ces compagnons se battent à mes côtés ou seuls, m'apportant leurs compétences et leur force. Des monstres rares dans la vie réelle ? Je dois juste relancer le jeu avec une goutte de sang pour pouvoir continuer à farmer.
        
        J'ai vraiment besoin d'une transfusion sanguine.`)
        .setImage('https://novelfull.com/uploads/thumbs/let-me-game-in-peace-452c1858e4-15434589f8ba4e308ea18d67359d2665.jpg')
        .addField(`Auteur : Twelve-Winged Dark Seraphim 十二翼黑暗炽天使          Babelcheck : Crycks   ` , `     tatut de Parution : 3 Chapitres Lun-Mer-Ven\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/laissez-moi-jouer-en-paix/chapitre-1-sabandonner-au-vice/2020/04/07/)\n` )
        message.channel.send(embed)
    }          
    if ( command === 'lm'){ 
        let embed = new Discord.RichEmbed()
        .setTitle("Le Maître des Secrets | Lord of the Mysteries | 诡秘之主        ")
        .setColor('#7925e2')
        .setURL("https://chireads.com/category/translatedtales/le-maitre-des-secrets/")
        .setDescription(`Avec l'émergence de l'énergie-vapeur et des machines, qui oserait devenir Transcendant ? Tapi dans le brouillard de l'histoire et de l'obscurité, le mal nous murmure-t-il quelque chose à l'oreille ?
        
        Voyageur du temps projeté dans la peau de Klein Moretti, Zhou Mingrui se retrouve propulsé dans un monde alternatif de l'époque victorienne, face à toute une série de mystères. Des machines, des canons, des cuirassés, des dirigeables, des potions, de la divination, des sortilèges, des cartes de tarot, des Artefacts Scellés...
        
        Si la Lumière brille toujours, le mystère n'est jamais très loin. Accompagnez Klein qui se retrouve empêtré dans les églises de ce monde - plus ou moins orthodoxes - et acquiert progressivement de nouveaux pouvoirs grâce aux potions des Transcendants.
        
        Suivons ensemble la légende du "Fou", carte de tarot numérotée 0, aux potentiels illimités.`)
        .setImage('https://cdnb.artstation.com/p/assets/images/images/019/760/383/large/emily-baker-.jpg?1564915578')
        .addField(`Auteur : 爱潜水的乌贼           Traducteur : Galadriel | check: KTA007 / Yoda   ` , `    Statut de Parution : 3 Chaps. Mer-Ven-Dim\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `[Commencer la lecture](https://chireads.com/translatedtales/le-maitre-des-secrets/chapitre-1-cramoisi/2020/04/27/)\n` )
        message.channel.send(embed)
    }   
    if ( command === 'asahd'){ 
        let embed = new Discord.RichEmbed()
        .setTitle("Le Restaurant d'un Père dans un Univers Extraordinaire | A Stay-at-home Dad's Restaurant In An Alternate World | 奶爸的异界餐厅       ")
        .setColor('#7925e2')
        .setURL("https://chireads.com/category/translatedtales/le-restaurant-dun-pere-dans-un-univers-extraordinaire/")
        .setDescription(`Il était une fois, dans la ville extraordinaire du Chaos où vivaient de nombreuses créatures, un dénommé Mag qui avait ouvert un restaurant très étrange. Il était malade et sa fille, Amy, une enfant très dévouée, s'occupait beaucoup de lui.
        
        Cet étrange et merveilleux restaurant aux règles atypiques, et qui attirait de nombreux clients étrangers, devint la vocation de Mag. Il recevait des directives et des missions à accomplir d’un mystérieux Système afin de s'améliorer en échange de sa guérison. Il apprit donc à cuisiner et à tenir le restaurant aux côtés de sa petite créature. Mais qu'adviendrait-il de Mag s’il ne menait pas à bien les missions qui lui étaient confiées ?`)
        .setImage('https://pbs.twimg.com/media/EE01ZVZU4AAdTus.png')
        .addField(`Auteur : 轻语江湖          Babelcheck : Océan    ` , `    Statut de Parution : 3 Chapitres ：Lun-Mer-Ven\n\n `)
        .setFooter("De la team Chireads" , 'https://scontent.falg1-2.fna.fbcdn.net/v/t1.0-9/89299473_893538324436845_5873832930828091392_n.jpg?_nc_cat=102&_nc_sid=85a577&_nc_eui2=AeGjHdpWAd5loHVuYbnW8lHkaoRBTtOhEHNqhEFO06EQc599uuapfSedYfFn_bee-yTfkY5ZwRMXW8DyNNaFuWDG&_nc_ohc=byGDbJ_35xgAX8-r0I4&_nc_ht=scontent.falg1-2.fna&oh=625875f49bde50039754c027efee0f0f&oe=5EDBBD8A')
        .addField('```Liens :```' , `Bientôt !\n` )
        message.channel.send(embed)
    }              
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////                                
})
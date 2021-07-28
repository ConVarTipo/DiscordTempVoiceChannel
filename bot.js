const {
    token,
    categoryID,
    voiceID,
    voiceZona,
    commandChannelName,
    permissions
} = require('./config.json'), {
    Client, Role
} = require('discord.js'),
    client = new Client();

const command = require('./command.js')
let channel = []

client.once('ready', () => { 
    console.info('Bot started.') 
    command(client, 'добавить', (message) => {
        const { member, mentions } = message

        const target = mentions.users.first();

        if(!target)
            return message.delete();

        const targetMember = message.guild.members.cache.get(target.id);

        if(commandChannelName !== message.channel.name)
            return message.delete();
      
        let permiss = message.member.guild.me.hasPermission("MANAGE_CHANNELS")
        if(permiss && channel[message.guild.member(message.author.id).voice.channelID] == message.author.id && message.guild.member(message.author.id).voice.channelID == message.guild.member(message.author.id).voice.channelID ){
            message.guild.member(message.author.id).voice.channel.updateOverwrite(targetMember, {CONNECT: true, VIEW_CHANNEL: true, USE_VAD: false})
            message.delete();
            message.channel.send(`Частота рации подобрана ${targetMember}`);
        }
        else{
            message.delete();
        }
    })

    command(client, 'убрать', (message) => {
        const { member, mentions } = message

        const target = mentions.users.first();

        if(!target)
            return message.delete();

        const targetMember = message.guild.members.cache.get(target.id);

        if(commandChannelName !== message.channel.name)
            return message.delete();
        
        let permiss = message.member.guild.me.hasPermission("MANAGE_CHANNELS")
        if(permiss && channel[message.guild.member(message.author.id).voice.channelID] == message.author.id && message.guild.member(message.author.id).voice.channelID == message.guild.member(message.author.id).voice.channelID ){
            message.guild.member(targetMember).voice.setChannel(null);
            message.guild.member(message.author.id).voice.channel.updateOverwrite(targetMember, {CONNECT: false, VIEW_CHANNEL: false})      
            message.delete();
            message.channel.send(`Частота рации утеряна ${targetMember}`);
        }
        else{
            message.delete();
        }
    })
});

function generateRandomNumber() {
    var min = 100.1,
        max = 200.9;

    return Math.random() * (max - min) + min;
};

client.on('voiceStateUpdate',  async function (old,voice) {
    try{
    let oldVoice = old.channelID;
    let newVoice = voice.channelID;
    if(newVoice == voiceID){
            let name = generateRandomNumber().toFixed(1).toString()
            voice.guild.channels.create(name, {
                type: 'voice',
                parent: categoryID               
            }) 
                .then((result) => {
                    channel[result.id] = voice.member.user.id
                    result.updateOverwrite(voice.member.user.id, permissions[0]);
                    result.updateOverwrite(voice.guild.id, permissions[1]);
                    result.updateOverwrite(voice.guild.roles.everyone, { VIEW_CHANNEL: false });
                    voice.member.voice.setChannel(result.id)
                })
    }

    if(old.channelID !=null){
        try {
            if (old.channel.members.size == 0 && channel[old.channelID] == old.member.user.id) {

                if(old.channelID == voiceID)
                    return
           
                if(old.channelID == voiceZona)
                    return

                await old.channel.delete()
                    return

            } else if (old.channel.members.size == 0 && old.channel.parentID == categoryID) {
                
                if(old.channelID == voiceID)
                    return
            
                if(old.channelID == voiceZona)
                    return

                await old.channel.delete()
                    return
            }
        } catch (e) {
            return
        }
    }else if(oldVoice != null && newVoice !=null){
        try {
            if (old.channel.members.size == 0 && channel[old.channelID] == old.member.user.id) {
                
                if(old.channelID == voiceID)
                    return

                if(old.channelID == voiceZona)
                    return

                await old.channel.delete()
                    return

            } else if (old.channel.members.size == 0 && old.channel.parentID == categoryID) {
                
                if(old.channelID == voiceID)
                    return
              
                if(old.channelID == voiceZona)
                    return

                await old.channel.delete()
                    return
            }
        } catch (e) {
            return
        }
    }}catch(e){
        return
    }
});

client.login(token);

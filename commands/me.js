const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('me')
		.setDescription('Shows sleep data'),

	async execute(interaction) {
		var now = Date.now()
		const DiscordID = interaction.user.id
		const DiscordUsername = interaction.user.username

		//Check to see if user exists
		try {
			fs.readFileSync('./cache/users/' + DiscordID + '.json')
		}
		catch (e){
			interaction.reply({ content: 'You\'re not registered!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] CHECK - 401: User not registered')
			return
		}

		//Load User Data
		const userData = JSON.parse(fs.readFileSync('./cache/users/' + DiscordID + '.json'))

		//Math
		var lastSleepAgo = Math.floor(((((Number(now) - Number(userData.LastSleepEnd)) / Number(1000)) / Number(60)) / Number(60)))
		var nextSleepUntil = userData.CycleLength - lastSleepAgo
		var sleepdebt = Math.floor(Number(lastSleepAgo) / userData.CycleLength)
		var sleepperday = (Number (24) / Number (userData.CycleLength)) * Number(userData.CycleSleep)

		//Status
		var status = "⚫cy"
		switch(sleepdebt){
			case 0:
				status = "🟢"
				break;
			case 1:
				status = "🟡"
				break;
			case 2:
				status = "🟠"
				break;
			case 3:
				status = "🔴"
				break;
		}


		//Respond
		{
			interaction.reply({ content: `# ${status} ${userData.DiscordUsername}\nUID#${userData.DiscordID}\n## Cycle Data\n`+'```'+`Your cycle length is ${userData.CycleLength} hours.\nYou need ${userData.CycleSleep} hours of sleep per cycle.\nYou're sleeping ${sleepperday} hours per day.`+'```'+`*You can use /cycle to change your cycle settings.*\n## Sleep Data\n`+'```'+`\nYour last sleep was ${lastSleepAgo} hour(s) ago.\nYour next sleep is in ${nextSleepUntil} hour(s).\nYour current sleep debt is ${sleepdebt} cycle(s).`+'```'+`*You can use /Sleep to log sleep.*`, ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] CHECK - 200: Data returned')
		}

		//Update User Data
		const userUpdate =`{"DiscordID":"${userData.DiscordID}","DiscordUsername":"${userData.DiscordUsername}","Registered":${userData.Registered},"Last active":${now},"LastSleepEnd":${userData.LastSleepEnd},"CycleLength":${userData.CycleLength},"CycleSleep":${userData.CycleSleep}}`
		fs.writeFileSync('./cache/users/' + DiscordID + '.json', userUpdate)
	},
};
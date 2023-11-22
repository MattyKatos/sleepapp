const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('cancel')
		.setDescription('delete that pesky mistake sleep session'),

	async execute(interaction) {
		const now = Date.now()
		const DiscordID = interaction.user.id
		const DiscordUsername = interaction.user.username

		//Check to see if user exists
		try {
			fs.readFileSync('./cache/users/' + DiscordID + '.json')
		}
		catch (e) {
			interaction.reply({ content: 'You\'re not registered!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] CANCEL - 401: User not registered')
			return
		}

		//Check to see if sleep file exists
		try {
			fs.readFileSync('./cache/sleep/' + DiscordID + '.json')
		}
		catch (e) {
			interaction.reply({ content: 'You don\'t have an active sleep session!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] CANCEL - 401: Sleep item doesn\'t exist.')
			return
		}

		//Load User Data
		const userData = JSON.parse(fs.readFileSync('./cache/users/' + DiscordID + '.json'))

		//Math
		var lastSleepAgo = Math.floor(((((Number(now) - Number(userData.LastSleepEnd)) / Number(1000)) / Number(60)) / Number(60)))
		var sleepdebt = Math.floor(Number(lastSleepAgo) / userData.CycleLength)

		//Status
		var status = "⚫"
		switch (sleepdebt) {
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
			interaction.reply({ content: `# ${status} ${userData.DiscordUsername}\nUID#${userData.DiscordID}\nSleep session canceled.`, ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] CANCEL - 200: Sleep canceled.')
		}

		//Delete Sleep Item
		{
			fs.unlinkSync('./cache/sleep/' + DiscordID + '.json')
		}

		//Update User Data
		{
			const userUpdate = `{"DiscordID":"${userData.DiscordID}","DiscordUsername":"${userData.DiscordUsername}","Registered":${userData.Registered},"Last active":${now},"LastSleepEnd":${userData.LastSleepEnd},"CycleLength":${userData.CycleLength},"CycleSleep":${userData.CycleSleep}}`
			fs.writeFileSync('./cache/users/' + DiscordID + '.json', userUpdate)
		}
	},
};
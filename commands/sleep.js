const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('sleep')
		.setDescription('honk shoo mememememe'),

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
			console.log('[' + DiscordUsername + '#' + DiscordID + '] SLEEP - 401: User not registered')
			return
		}

		//Check to see if sleep file exists
		try {
			fs.readFileSync('./cache/sleep/' + DiscordID + '.json')
			interaction.reply({ content: 'You\'ve already got an active sleep session!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] SLEEP - 401: Sleep item already exists.')
			return
		}
		catch (e) {
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
			interaction.reply({ content: `# ${status} ${userData.DiscordUsername}\nUID#${userData.DiscordID}\nIt's currently ${Date(now)}.\nTo make up for your ${sleepdebt} cycles of sleep debt, you should set your alarm for ${userData.CycleSleep * sleepdebt} hours.\n*Your sleep session has been created. Use /wake to end your session.*`, ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] CHECK - 200: Sleep Started')
		}

		//Create Sleep Item
		{
			const sleepdata = `{"DiscordID":"${userData.DiscordID}","DiscordUsername":"${userData.DiscordUsername}","SleepStart":${now},"SleepDebt":${sleepdebt},"CycleSleep":${userData.CycleLength}}`
			fs.writeFileSync('./cache/sleep/' + DiscordID + '.json', sleepdata)
		}

		//Update User Data
		{
			const userUpdate = `{"DiscordID":"${userData.DiscordID}","DiscordUsername":"${userData.DiscordUsername}","Registered":${userData.Registered},"Last active":${now},"LastSleepEnd":${userData.LastSleepEnd},"CycleLength":${userData.CycleLength},"CycleSleep":${userData.CycleSleep}}`
			fs.writeFileSync('./cache/users/' + DiscordID + '.json', userUpdate)
		}
	},
};
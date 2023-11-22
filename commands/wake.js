const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('wake')
		.setDescription('end a sleep session and remove your sleep debt'),

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
			console.log('[' + DiscordUsername + '#' + DiscordID + '] WAKE - 401: User not registered')
			return
		}

		//Check to see if sleep file exists
		try {
			fs.readFileSync('./cache/sleep/' + DiscordID + '.json')
		}
		catch (e) {
			interaction.reply({ content: 'You don\'t have an active sleep session!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] WAKE - 401: Sleep item doesn\'t exist.')
			return
		}

		//Load User Data
		const userData = JSON.parse(fs.readFileSync('./cache/users/' + DiscordID + '.json'))

		//Load Sleep Data
		const sleepData = JSON.parse(fs.readFileSync('./cache/sleep/' + DiscordID + '.json'))

		//Sleep Score
		var sleepdebt = sleepData.SleepDebt
		var starttime = sleepData.SleepStart
		var sleepgoal = sleepData.CycleSleep * sleepdebt
		var sleeptime = (((((now - starttime) / Number(1000)) / Number(60)) / Number(60)))
		var sleepscore = ""
		var wiggleroom = .3
		if (sleeptime > sleepgoal + wiggleroom) {
			sleepscore = "overslept"
		}else if (sleeptime < sleepgoal - wiggleroom) {
			sleepscore = "underslept"
		}else { sleepscore = "got proper sleep"}

		//Status
		var status = "🟢"

		//Respond
		{
			interaction.reply({ content: `# ${status} ${userData.DiscordUsername}\nUID#${userData.DiscordID}\n## Sleep session complete.\n`+'```'+`You slept for ${sleeptime}/${sleepgoal} hours.\nYou ${sleepscore}.`+'```', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] WAKE - 200: Sleep complete.')
		}

		//Update User Data
		{
			const userUpdate = `{"DiscordID":"${userData.DiscordID}","DiscordUsername":"${userData.DiscordUsername}","Registered":${userData.Registered},"Last active":${now},"LastSleepEnd":${now},"CycleLength":${userData.CycleLength},"CycleSleep":${userData.CycleSleep}}`
			fs.writeFileSync('./cache/users/' + DiscordID + '.json', userUpdate)
		}

		//Delete Sleep Item
		{
			fs.unlinkSync('./cache/sleep/' + DiscordID + '.json')
		}
	},
};
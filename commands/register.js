const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Create a user.json for your discord UID'),

	async execute(interaction) {
		var now = Date.now()
		var d = new Date();
		var lastMidnight = d.setHours(0,0,0,0);
		var nextMidnight = d.setHours(24,0,0,0);
		const DiscordID = interaction.user.id
		const DiscordUsername = interaction.user.username
		const userData = `{"DiscordID":"${DiscordID}","DiscordUsername":"${DiscordUsername}","Registered":${now},"Last active":${now},"LastSleepEnd":${lastMidnight},"CycleLength":8,"CycleSleep":1.5}`

		//Check to see if user already exists
		try {
			fs.readFileSync('./cache/users/' + DiscordID + '.json')
			interaction.reply({ content: 'You\'re already registered!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] REGISTER - 400: User already registered')
			return
		}
		catch (e){}

		//Create User.json
		{
			fs.writeFileSync('./cache/users/' + DiscordID + '.json', userData)
			interaction.reply({ content: 'Registered ' + DiscordUsername + '!', ephemeral: true });
			console.log('[' + DiscordUsername + '#' + DiscordID + '] REGISTER - 200: User registered')
		}
	},
};
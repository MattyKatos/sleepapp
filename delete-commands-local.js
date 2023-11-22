const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
require('dotenv').config();

//DISCORD CONFIG
const app_id = process.env.DISCORD_APP_ID
const public_key = process.env.DISCORD_PUBLIC_KEY
const bot_token = process.env.DISCORD_BOT_TOKEN
const guild_id = process.env.DISCORD_GUILD_ID

//DELETE WHAT COMMAND?
var command_id = '1170936453589639271'

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(bot_token);

rest.delete(Routes.applicationGuildCommand(app_id, guild_id, command_id))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);
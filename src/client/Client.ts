import * as DCJS from "discord.js";
import * as error_msg from "../error_msg.json";
import {SlashCommand} from "../util/Commands";

export class Client extends DCJS.Client{
	/**
	 * Push the slash commands to Discord
	 * @param {object[]} [commands] the list of commands to deploy
	 * @returns {Promise<void>}
	 */
	async PutSlashCommands(commands:(object|SlashCommand)[]):Promise<void>{
		let rest=new DCJS.REST({version:"10"});
		if (this.token) {
			rest.setToken(this.token);
		}else{
			throw new Error(error_msg.bot_not_start_up);
		}
		if(this.user){
			for(let i of commands){
				if(i instanceof SlashCommand){
					if(i.action){
						this.on("interactionCreate",async(interaction)=>{
							if(
									i instanceof SlashCommand &&
									interaction.isChatInputCommand() &&
									interaction.commandName==i.name){
								if(i.action instanceof Function){
									i.action(interaction);
								}else if(i.action instanceof Promise){
									await i.action;
								}
							}
						});
					}
					i=i.toJSON();
				}
			}
			await rest.put(DCJS.Routes.applicationCommands(this.user.id),{body:commands});
			return;
		}else{
			throw new Error(error_msg.bot_not_start_up);
		}
	};
	async GetCommands():Promise<object[]>{
		let re:object[]=[];
		if(this.user){

		}else{
			throw new Error(error_msg.bot_not_start_up);
		}

		return re;
	};
};

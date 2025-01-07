import * as DCJS from "discord.js";
import * as error_msg from "../error_msg.json";


export class SlashCommandsChoices{
	/**
	 * The name of the choice
	 */
	name:string|null=null;
	/**
	 * The value of the choice
	 */
	value:string|null=null;
	toJSON():{name:string;value:string}{
		if(!this.name){
			throw new Error(error_msg.missing_param+"name");
		}
		if(!this.value){
			throw new Error(error_msg.missing_param+"value");
		}
		return {
			name:this.name,
			value:this.value
		};
	};
};

/**
 * the type of the command
 * @see SlashCommand.type
 * @see https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
 */
export const SlashCommandType={
	command:1,
	Subcommand:1,
	SubcommandGroup:2,
	String:3,
	/**
	 * Integer type, allow any integer between -2^53 and 2^53
	 */
	Integer:4,
	Boolean:5,
	User:6,
	/** 
	 * Channel type, Includes all channel types + categories
	*/
	Channel:7,
	Role:8,
	/**
	 * Mentionable type, Includes users and roles
	 */
	Mentionable:9,
	Number:10,
	/**
	 * Attachment type.
	 * @see https://discord.com/developers/docs/resources/message#attachment-object
	 */
	Attachment:11,
};

const SlashCommandTypeList=[
	"",
	"Command, Subcommand",
	"Subcommand Group",
	"String",
	"Integer",
	"Boolean",
	"User",
	"Channel",
	"Role",
	"Mentionable",
	"Number",
	"Attachment"
];

/**
 * Slash commands are the most common type of command. They are accessed by typing a forward slash (/) followed by the command’s name, or by using the plus button (+) to the left of the message input.
 * More detail: https://discord.com/developers/docs/tutorials/upgrading-to-application-commands#slash-commands
 */
export class SlashCommand{
	/**
	 * The name of the command
	 * @default null
	 */
	name:string|null=null;
	/**
	 * The description of the command
	 * @default null
	 */
	description:string|null=null;
	/**
	 * The type of the command
	 * @default SlashCommandType.command
	 * @see SlashCommandType
	 */
	type:number|null=1;
	/**
	 * (optional) The options of the command
	 */
	options:(object|SlashCommand)[]|null=null;
	/**
	 * (optional) The default permission of the command for the bot
	 * 
	 */
	choice:(object|SlashCommandsChoices)[]|null=null;
	required:boolean|null=null;
	action:Function|Promise<any>|null=null;
	toJSON(check:boolean=true):{[key:string]:any}{
		let re:{[key:string]:any}={};
		/*data 2 json*/{
			if(this.name){
				re["name"]=this.name;
			}else{
				console.warn(error_msg.missing_param + "name");
			}
			if(this.description){
				re["description"]=this.description;
			}
			if(this.type){
				re["type"]=this.type;
			}else{
				re["type"]=SlashCommandType.command;
			}
			if(this.options){
				re["options"]=[];
				for(let i of this.options){
					if(i instanceof SlashCommand){
						re["options"].push(i.toJSON(false));
					}else{
						re["options"].push(i);
					}
				}
			}
			if(this.choice){
				re["choices"]=[];
				for(let i of this.choice){
					if(i instanceof SlashCommandsChoices){
						re["choices"].push(i.toJSON());
					}else{
						re["choices"].push(i);
					}
				}
			}
			if(this.required !== null){
				re["required"]=this.required;
			}
		}
		// check the struct of command is correct
		if(!check)return re;
		function dfs(nw:{[key:string]:any},lv:number=1){
			if(lv>3){
				if(nw.type===1 || nw.type===2){
					console.warn(error_msg.SlashCommand.to_many_layers);
				}
			}else{
				if(!(nw.type===1 || nw.type===2) && nw.options){
					console.warn(error_msg.SlashCommand.no_options_under_non_command+SlashCommandTypeList[nw.type]);
				}
				if(nw.options){
					for(let i of nw.options){
						if(lv>1 && nw.type===1 && nw.type===2){
							console.warn(error_msg.SlashCommand.Group_under_command);
						}
						dfs(i,lv+1);
					}
				}
			}
		};
		dfs(this);

		return re;
	};
};
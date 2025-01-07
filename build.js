// @ts-nocheck
import { fileURLToPath } from 'url';
import {execSync} from "child_process";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function find_file(dir=path.join(__dirname,"./src")){
	let re=[];
	let files=fs.readdirSync(dir);
	files.forEach(file=>{
		if(file.endsWith(".ts")){
			re.push({"type":"file","name":file});
		}else if(fs.statSync(path.join(dir,file)).isDirectory()){
			re.push({
				"type":"dir",
				"name":file,
				"children":find_file(path.join(dir,file))
			});
		}
	});
	let write_file_path=path.join(dir,"index.ts");
	let content="";
	for(let i of re){
		if(i.type=="file"){
			content+=`export * from "./${i.name.replace(".ts","")}";\n`;
		}else{
			content+=`export * from "./${i.name}";\n`;
		}
	}
	fs.writeFileSync(write_file_path,content);

	return re;
}

function cmd(cmd){
	console.log(chalk.yellow("> ")+chalk.cyan(cmd));
	try{execSync(cmd,()=>{});}catch(e){
		console.error(chalk.red.bold("! =====[ERROR]===== !"));
		// console.error(e);
		// console.error(chalk.red.bold("! =====[ERROR]===== !"));
	}
}

console.log(chalk.blue("i ")+chalk.green("cleaning up ..."));
cmd("rm -rf dist");
cmd("rm -rf typings");
cmd("rm -rf node_modules");
// cmd("rm src/index.ts");
// cmd("rm src/*/index.ts");
console.log(chalk.blue("i ")+chalk.green("installing dependencies ..."));
cmd("npm install discord.js@14.17.2");
cmd("npm install typescript@5.7.2");
console.log(chalk.blue("i ")+chalk.green("building ..."));
find_file();
cmd("tsc");
cmd("tsc --emitDeclarationOnly");
cmd("rm src/index.ts");
cmd("rm src/*/index.ts");
console.log(chalk.blue("i ")+chalk.green("done"));

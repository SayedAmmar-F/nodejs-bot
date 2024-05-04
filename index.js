const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const fs = require("fs");

// const commands = [
//   {
//     name: "verify",
//     description: "Activated Badge Now!",
//   },
//   {
//     name: "choco",
//     description: "is stupid ?",
//   },
// ];

async function loadCommands(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    const commands = JSON.parse(data);
    // const commands1 = [...commands, newCommand];

    return commands;
  } catch (error) {
    console.error("Error reading commands file:", error);
    return [];
  }
}

const newCommand = {
  name: "create",
  description:
    "Creates a new slash command (static, requires interactionCreate handler)",
  type: 3,
  options: [
    {
      name: "command_name",
      description: "The name of the new slash command (required)",
      type: 3,
      required: true,
    },
    {
      name: "response",
      description: "The response message for the new command (required)",
      type: 3,
      required: true,
    },
  ],
};

const rest = new REST({ version: "10" }).setToken(process.env["token"]);
const clientId = "1233439964520382488"; // Replace with your client ID

(async () => {
  const commands = await loadCommands("./commands.json");

  try {
    console.log("Started registering commands...");

    await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log("Commands registered successfully! ✅✅");
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let Token = process.env["token"];

client.on("ready", () => {
  console.log(`Logged ${client.user.tag} | ✅✅✅✅`);
});

client.on("interactionCreate", async (interaction) => {
  console.log(interaction.commandName);
  if (!interaction.isChatInputCommand()) return;

  const responses = await loadCommands("./response.json"); // Replace with your file path
  if (interaction.commandName == "create") {
    const commandName = interaction.options.getString("command_name");
    const response = interaction.options.getString("response");

    if (!commandName || !response) {
      await interaction.reply(
        "Missing required arguments! Specify both command name and response message.",
      );
      return;
    }

    await interaction.reply(`Created a new slash command: ${commandName}`);
  } else {
    const response = responses[interaction.commandName];
    if (response) {
      await interaction.reply(response);
    } else {
      console.warn(
        `Command "${interaction.commandName}" not found in responses.`,
      );
      await interaction.reply("Unknown command. Try `/help` for assistance.");
    }
  }
});

client.login(Token);

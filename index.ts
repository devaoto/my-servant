import {
  GatewayIntentBits,
  Client,
  ActivityType,
  Guild,
  Message,
} from "discord.js";
import * as unicodeEmojis from "unicode-emoji";
import fs from "fs";
import path from "path";

import { genderIdentities } from "./genders";

const rolesFilePath = path.join(__dirname, "rolesMap.json");

const client = new Client({
  intents: Object.keys(GatewayIntentBits).map(
    (k) => GatewayIntentBits[k as keyof typeof GatewayIntentBits]
  ),
});

client.on("ready", (c) => {
  console.log(`${c.user.displayName} is ready!`);
  c.user.setActivity({ type: ActivityType.Custom, name: "I serve my master" });
});

function generatePastelColor(): number {
  const randomValue = () => Math.floor(Math.random() * 128 + 127);

  const r = randomValue();
  const g = randomValue();
  const b = randomValue();

  const toHex = (value: number) => value.toString(16).padStart(2, "0");

  return Number(`0x${toHex(r)}${toHex(g)}${toHex(b)}`);
}

const generateChunks = <T>(
  arr: T[],
  divide: number
): { [key: string]: T[] } => {
  const result: { [key: string]: T[] } = {};

  for (let i = 0; i < arr.length; i += divide) {
    const chunk = arr.slice(i, i + divide);
    const chunkKey = `${i / divide + 1}`;
    result[chunkKey] = chunk;
  }

  return result;
};

async function createRoles(arr: string[], guild: Guild) {
  const chunks = generateChunks(arr, 10);

  for (const chunkKey in chunks) {
    const chunk = chunks[chunkKey];
    const createRolePromises = chunk.map(async (element) => {
      await Bun.sleep(3000);
      console.log(`Created ${element}`);
      return guild.roles.create({
        name: element,
        color: generatePastelColor(),
      });
    });
    await Promise.all(createRolePromises);
  }
}

async function deleteRoles(arr: string[], guild: Guild) {
  const roles = guild.roles.cache;

  const rolesToDelete = roles.filter((role) => arr.includes(role.name));

  console.log(rolesToDelete);

  const deleteRolePromises = rolesToDelete.map(async (role) => {
    console.log("Deleted");
    return role.delete();
  });

  await Promise.all(deleteRolePromises);
}

let rolesMap: Map<string, string> = new Map();

function loadRolesMap(): void {
  if (fs.existsSync(rolesFilePath)) {
    const data = fs.readFileSync(rolesFilePath, "utf8");
    const json = JSON.parse(data);
    rolesMap = new Map(Object.entries(json));
  }
}

function saveRolesMap(): void {
  const json = JSON.stringify(Object.fromEntries(rolesMap));
  fs.writeFileSync(rolesFilePath, json, "utf8");
}

loadRolesMap();

async function sendMessagesOnChunk(arr: string[], message: Message) {
  const chunks = generateChunks(arr, 10);
  const channelToSend = message.channel;
  const cacheRole = message.guild?.roles.cache;

  for (const chunk in chunks) {
    let messageContent = "Choose a gender:\n\n";
    const emojis = unicodeEmojis.getEmojis();
    const currentChunk = chunks[chunk];
    const usedEmojis = new Set<string>();

    for (const item of currentChunk) {
      let randomEmojiObj;
      do {
        randomEmojiObj = emojis[Math.floor(Math.random() * emojis.length)];
      } while (usedEmojis.has(randomEmojiObj.emoji));

      usedEmojis.add(randomEmojiObj.emoji);
      messageContent += !emojis.includes(randomEmojiObj)
        ? `${randomEmojiObj.emoji} - <@&${
            cacheRole?.find((r) => r.name === item)?.id
          }>\n`
        : !cacheRole?.find((r) => r.name === item)
        ? `- <@&${cacheRole?.find((r) => r.name === item)?.id}>\n`
        : "";
      rolesMap.set(randomEmojiObj.emoji, item);
    }

    saveRolesMap();

    const sentMessage = await channelToSend.send({ content: messageContent });

    for (const emoji of usedEmojis) {
      await sentMessage.react(emoji);
    }
  }
}

client.on("messageCreate", async (msg) => {
  if (msg.content === "!createRole") {
    if (msg.author.id !== "829000568559108107") return;

    const guild = await client.guilds.fetch("913778869356601434");

    await createRoles(genderIdentities, guild);
    console.log(`Created roles for ${genderIdentities.length} genders`);
    await msg.channel.send(
      `Created roles for ${genderIdentities.length + 1} genders`
    );
  } else if (msg.content === "!delRole") {
    if (msg.author.id !== "829000568559108107") return;

    const guild = await client.guilds.fetch("913778869356601434");

    await deleteRoles(genderIdentities, guild);
    console.log(`Deleted roles for ${genderIdentities.length} genders`);
    await msg.channel.send(
      `Deleted roles for ${genderIdentities.length} genders`
    );
  } else if (msg.content.startsWith("!sendRoles")) {
    if (msg.author.id !== "829000568559108107") return;

    const cachedRoles = await msg.guild?.roles.cache;

    const roles = cachedRoles
      ?.filter((r) => genderIdentities.includes(r.name))
      .map((r) => r.name);

    await sendMessagesOnChunk(roles!, msg);
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;

  const emoji = reaction.emoji.name;
  const item = rolesMap.get(emoji!);

  if (!item) return;

  const role = reaction.message.guild?.roles.cache.find((r) => r.name === item);

  if (role) {
    const member = reaction.message.guild?.members.cache.get(user.id);
    await member?.roles.add(role);
    console.log(`Added role ${role.name} to ${user.username}`);
  }
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot) return;

  const emoji = reaction.emoji.name;
  const item = rolesMap.get(emoji!);

  if (!item) return;

  const role = reaction.message.guild?.roles.cache.find((r) => r.name === item);

  if (role) {
    const member = reaction.message.guild?.members.cache.get(user.id);
    await member?.roles.remove(role);
    console.log(`Removed role ${role.name} from ${user.username}`);
  }
});

await client.login(process.env.BOT_TOKEN);

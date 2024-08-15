import { writeFileSync } from "fs";
import { emojis } from "./emojis";

export const genderIdentities: string[] = [
  "Abimegender",
  "Adamas gender",
  "Aerogender",
  "Aesthetigender",
  "Affectugender",
  "Agender",
  "Agenderflux",
  "Alexigender",
  "Alien",
  "Aliusgender",
  "Ambigender",
  "Ambivert",
  "Ambonec",
  "Amaregender",
  "Amicagender",
  "Androgyne",
  "Anesigender",
  "Angenital",
  "Anogender",
  "Anongender",
  "Antegender",
  "Anxiegender",
  "Apache Helicopter",
  "Apagender",
  "Apconsugender",
  "Astral gender",
  "Astergender",
  "Attack Helicopter",
  "Audi",
  "Autigender",
  "Autogender",
  "Axigender",
  "Bigender",
  "Biogender",
  "Biology Textbook",
  "Blurgender",
  "Blueberry",
  "Body bag",
  "Boyflux",
  "Burstgender",
  "Caelgender",
  "Cassflux",
  "Cassgender",
  "Cavusgender",
  "Cendgender",
  "Ceterofluid",
  "Ceterogender",
  "Cisgender",
  "Cloudgender",
  "Collgender",
  "Colorgender",
  "Compiler",
  "Computer",
  "Condigender",
  "Deliciagender",
  "Demifluid",
  "Demiflux",
  "Demigender",
  "Dirty",
  "Dolphin",
  "Domgender",
  "Dragonkin",
  "Duragender",
  "Egogender",
  "Epicene",
  "Esspigender",
  "Exgender",
  "Existigender",
  "Extrovert",
  "Femfluid",
  "Femgender",
  "Fluidflux",
  "Furry",
  "Gemigender",
  "Gender",
  "Genderblank",
  "Genderflow",
  "Genderfluid",
  "Genderflux",
  "Genderfuzz",
  "Genderpuck",
  "Genderqueer",
  "Gender witched",
  "Girlflux",
  "Heart Attack",
  "Healgender",
  "Hex",
  "HLS",
  "HSL",
  "I'd rather not say",
  "Image book",
  "Inital",
  "Interpreter",
  "Introvert",
  "Jackfruit",
  "Kawasaki Ninja",
  "Lambo",
  "Lichi",
  "Lmao",
  "Male",
  "Mango",
  "McLaren",
  "Mirrorgender",
  "Moon",
  "Non-binary",
  "Note book",
  "Omnigender",
  "Pervert",
  "Pin",
  "Potato",
  "RGB",
  "Rest",
  "Robot",
  "Shark",
  "Sleeping Bag",
  "Strawberry",
  "Sun",
  "Text book",
  "Toaster",
  "Unicorn",
  "Walmart Bag",
  "Your mom",
  "Your mom's pin",
  "Your mom's unwashed cloth",
];

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

console.log("Emojis", emojis.length);
console.log("Genders", genderIdentities.length);

function generateRoleMap() {
  if (emojis.length !== genderIdentities.length) {
    throw new Error(
      "The number of emojis must match the number of gender identities."
    );
  }

  const shuffledEmojis = shuffleArray([...emojis]);
  const roleMap: Record<string, string> = {};

  genderIdentities.forEach((gender, index) => {
    roleMap[shuffledEmojis[index]] = gender;
  });

  const roleMapContent = `export const roleMap = ${JSON.stringify(
    roleMap,
    null,
    2
  )};`;

  writeFileSync("roleMap.ts", roleMapContent, "utf8");
  console.log("roleMap.ts file generated successfully.");
}

// generateRoleMap();

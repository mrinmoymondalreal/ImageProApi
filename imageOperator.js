import { Jimp } from "jimp";
import path from "path";

const __dirname = path.resolve();

async function readImage(imagePath) {
  try {
    imagePath = path.join(__dirname, "uploads", imagePath);
    const image = await Jimp.read(imagePath);
    return image;
  } catch (err) {
    console.error("Error reading image:", err);
    return null;
  }
}

export async function processImage(imagePath, operations) {
  const image = await readImage(imagePath);
  let format = "png";
  const getImage = () => image.getBuffer("image/" + format);
  if (!image) return null;

  for (const operation of operations) {
    if (operation.name == "format") {
      format = operation.args[0];
      continue;
    }
    const { name, args } = operation;
    await performOperation(image, name, args);
  }

  return getImage();
}

async function performOperation(image, functionName, args) {
  switch (functionName) {
    case "resize":
      await image.resize({ w: args[0], h: args[1] });
      break;
    case "crop":
      await image.crop(args.x, args.y, args.width, args.height);
      break;
    case "rotate":
      await image.rotate(args[0]);
      break;
    case "flip":
      await image.flip(args.horizontal, args.vertical);
      break;
    case "blur":
      await image.blur(args[0]);
      break;
    case "brightness":
      await image.brightness(args[0]);
      break;
    default:
      throw new Error(`Unknown operation: ${functionName}`);
  }
}

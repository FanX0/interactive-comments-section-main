import amyPng from "@/assets/avatars/image-amyrobson.png";
import amyWebp from "@/assets/avatars/image-amyrobson.webp";
import juliusPng from "@/assets/avatars/image-juliusomo.png";
import juliusWebp from "@/assets/avatars/image-juliusomo.webp";
import maxPng from "@/assets/avatars/image-maxblagun.png";
import maxWebp from "@/assets/avatars/image-maxblagun.webp";
import ramsesPng from "@/assets/avatars/image-ramsesmiron.png";
import ramsesWebp from "@/assets/avatars/image-ramsesmiron.webp";

import type { Image } from "@/shared/types/Comments";

const map: Record<string, Image> = {
  amyrobson: { png: amyPng, webp: amyWebp },
  juliusomo: { png: juliusPng, webp: juliusWebp },
  maxblagun: { png: maxPng, webp: maxWebp },
  ramsesmiron: { png: ramsesPng, webp: ramsesWebp },
};

export const getUserAvatar = (username: string): Image => {
  return map[username] ?? { png: juliusPng, webp: juliusWebp };
};
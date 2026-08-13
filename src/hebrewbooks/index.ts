/**
 * Skill hebrewbooks-source — répondre aux questions religieuses depuis les
 * textes primaires réellement lus (vérification Sefaria, liens hebrewbooks.org
 * pour la lecture), jamais de mémoire.
 */
// @ts-ignore — bundled as text by wrangler (rules: type=Text)
import skillMd from "./SKILL.md";

import type { ToolDefinition, ToolHandler } from "../sefaria";

const SKILL_MD = skillMd as unknown as string;

export const HEBREWBOOKS_INSTRUCTIONS = `# Étude des sources (hebrewbooks + Sefaria)

Pour toute question religieuse (halakha, Tanakh, Talmud, responsa, hassidout,
moussar, kabbale) : charger d'abord le skill via \`hebrewbooks_skill\` et suivre
sa méthode — les réponses se fondent sur des textes réellement lus via les
tools \`sefaria_*\`, jamais sur la mémoire du modèle. Donner les liens
hebrewbooks.org pour la lecture des sources, comme le skill l'indique.`;

export const hebrewbooksTools: ToolDefinition[] = [
  {
    name: "hebrewbooks_skill",
    title: "Méthode d'étude des sources juives",
    annotations: { readOnlyHint: true },
    description:
      "Charge le skill d'étude des sources juives : méthode pour répondre aux questions " +
      "religieuses (halakha, Talmud, Tanakh, responsa, hassidout, moussar) depuis les " +
      "textes primaires vérifiés via Sefaria, avec liens hebrewbooks.org pour la lecture. " +
      "À charger AVANT de répondre à toute question religieuse.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
];

export const hebrewbooksHandlers: Record<string, ToolHandler> = {
  hebrewbooks_skill: async () => SKILL_MD,
};

export function listHebrewbooksPrompts() {
  return [
    {
      name: "hebrewbooks",
      description:
        "Méthode d'étude des sources juives : réponses fondées sur les textes primaires (Sefaria + hebrewbooks.org).",
      arguments: [],
    },
  ];
}

export function getHebrewbooksPrompt(name: string) {
  if (name !== "hebrewbooks") throw new Error(`Prompt inconnu : "${name}".`);
  return {
    description: "Méthode d'étude des sources juives.",
    messages: [{ role: "user", content: { type: "text", text: SKILL_MD } }],
  };
}

export const RANKS = {
  DEFAULT: {
    label: "Отмычка",
    className: "rank-default",
  },
  RANK_NEWBIE: {
    label: "Новичок",
    className: "rank-newbie",
  },
  RANK_STALKER: {
    label: "Сталкер",
    className: "rank-stalker",
  },
  RANK_VETERAN: {
    label: "Ветеран",
    className: "rank-veteran",
  },
  RANK_MASTER: {
    label: "Мастер",
    className: "rank-master",
  },
  RANK_LEGEND: {
    label: "Легендарный",
    className: "rank-legend",
  },
};

export const RANK_ORDER = {
  DEFAULT: 0,
  RANK_NEWBIE: 1,
  RANK_STALKER: 2,
  RANK_VETERAN: 3,
  RANK_MASTER: 4,
  RANK_LEGEND: 5,
};

export function getRankOrder(rank) {
  return RANK_ORDER[rank] ?? 0;
}

export const MAIN_CATEGORY_LABELS = {
  weapon: "Оружие",
  armor: "Броня",
  backpacks: "Рюкзаки",
  containers: "Контейнеры",
  artefact: "Артефакты",
  ammo: "Боеприпасы",
  medicine: "Медицина",
  food: "Еда",
  drink: "Напитки",
  barter: "Бартер",
  misc: "Разное",
  tools: "Инструменты",
  attachment: "Модули",
  cases: "Кейсы",
  bullet: "Пули",
  grenade: "Гранаты",
  weapon_modules: "Оружейные модули",
  other: "Другое",
};

export const SUBCATEGORY_LABELS = {
  pistol: "Пистолеты",
  assault_rifle: "Штурмовые винтовки",
  rifle: "Винтовки",
  shotgun: "Дробовики",
  sniper_rifle: "Снайперские винтовки",
  submachine_gun: "Пистолеты-пулемёты",
  machine_gun: "Пулемёты",
  melee: "Ближний бой",
  device: "Устройства",
  suit: "Костюмы",
  clothes: "Одежда",
  combat: "Боевая",
  combined: "Комбинированая",
  scientist: "Научная",
  helmet: "Шлемы",
  backpack: "Рюкзаки",
  container: "Контейнеры",
  artifact: "Артефакты",
};



export function getRankInfo(rank) {
  return RANKS[rank] || RANKS.DEFAULT;
}

export function getMainCategory(category) {
  if (!category) {
    return "other";
  }

  return category.split("/")[0] || "other";
}

export function getSubCategory(category) {
  if (!category) {
    return "";
  }

  return category.split("/")[1] || "";
}

export function translateMainCategory(category) {
  return MAIN_CATEGORY_LABELS[category] || category || "Другое";
}

export function translateSubCategory(category) {
  return SUBCATEGORY_LABELS[category] || category || "Без подкатегории";
}

export function translateFullCategory(category) {
  const main = getMainCategory(category);
  const sub = getSubCategory(category);

  if (!sub) {
    return translateMainCategory(main);
  }

  return `${translateMainCategory(main)} / ${translateSubCategory(sub)}`;
}

export function parseRawJson(rawJson) {
  try {
    return JSON.parse(rawJson);
  } catch {
    return null;
  }
}

export function textToString(node) {
  if (!node) {
    return "";
  }

  if (typeof node === "string") {
    return node.replaceAll("@", "\n");
  }

  if (typeof node === "number" || typeof node === "boolean") {
    return String(node);
  }

  if (node.lines?.ru) {
    return String(node.lines.ru).replaceAll("@", "\n");
  }

  if (node.text) {
    return textToString(node.text);
  }

  if (node.value) {
    return textToString(node.value);
  }

  if (node.name) {
    return textToString(node.name);
  }

  if (Array.isArray(node)) {
    return node.map(textToString).filter(Boolean).join("\n");
  }

  return "";
}

export function findRuText(node) {
  return textToString(node);
}

export function extractDescription(raw) {
  if (!raw?.infoBlocks || !Array.isArray(raw.infoBlocks)) {
    return "";
  }

  const textBlocks = raw.infoBlocks.filter((block) => block.type === "text");

  return textBlocks
    .map((block) => textToString(block.text))
    .filter(Boolean)
    .join("\n\n");
}

function getVariants(raw) {
  return raw?._variants || raw?.variants || raw?.upgrades || null;
}

export function hasUpgradeVariants(raw) {
  const variants = getVariants(raw);

  if (!variants) {
    return false;
  }

  if (Array.isArray(variants)) {
    return variants.length > 0;
  }

  if (typeof variants === "object") {
    return Object.keys(variants).length > 0;
  }

  return false;
}


export function normalizeUpgradeLevel(value) {
  const number = Number.parseInt(value, 10);

  if (Number.isNaN(number)) {
    return 0;
  }

  if (number < 0) {
    return 0;
  }

  if (number > 15) {
    return 15;
  }

  return number;
}

function getVariantByLevel(raw, level) {
  const variants = getVariants(raw);

  if (!variants) {
    return null;
  }

  const normalizedLevel = normalizeUpgradeLevel(level);

  if (normalizedLevel === 0) {
    return null;
  }

  if (Array.isArray(variants)) {
    return (
      variants.find((variant) => Number(variant?.level) === normalizedLevel) ||
      variants[normalizedLevel] ||
      variants[normalizedLevel - 1] ||
      null
    );
  }

  if (typeof variants === "object") {
    return (
      variants[String(normalizedLevel)] ||
      variants[`+${normalizedLevel}`] ||
      variants[`level_${normalizedLevel}`] ||
      variants[normalizedLevel] ||
      null
    );
  }

  return null;
}

function getBaseInfoBlocks(raw) {
  if (!Array.isArray(raw?.infoBlocks)) {
    return [];
  }

  return raw.infoBlocks.filter((block) => {
    const blockKey = String(block.key || block.name || block.title || "").toLowerCase();

    return (
      !blockKey.includes("variant") &&
      !blockKey.includes("upgrade") &&
      !blockKey.includes("заточ")
    );
  });
}

function getInfoBlocksForLevel(raw, level) {
  const normalizedLevel = normalizeUpgradeLevel(level);

  if (normalizedLevel === 0) {
    return getBaseInfoBlocks(raw);
  }

  const variant = getVariantByLevel(raw, normalizedLevel);

  if (variant?.infoBlocks && Array.isArray(variant.infoBlocks)) {
    return variant.infoBlocks;
  }

  if (variant?.info_blocks && Array.isArray(variant.info_blocks)) {
    return variant.info_blocks;
  }

  if (Array.isArray(variant)) {
    return variant;
  }

  return getBaseInfoBlocks(raw);
}

function formatNumber(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  if (Number.isInteger(number)) {
    return String(number);
  }

  return String(Math.round(number * 100) / 100);
}

function formatElementValue(element) {
  if (!element) {
    return "";
  }

  if (element.type === "numeric") {
    const value = element.value;

    if (value === null || value === undefined) {
      return "";
    }

    const unit = textToString(element.unit);
    const formattedValue = formatNumber(value);

    return unit ? `${formattedValue} ${unit}` : formattedValue;
  }

  if (element.type === "key-value") {
    return textToString(element.value);
  }

  if (element.type === "range") {
    const min = element.min ?? "";
    const max = element.max ?? "";
    const unit = textToString(element.unit);

    const range = `[${min}; ${max}]`;

    return unit ? `${range} ${unit}` : range;
  }

  if (element.value !== undefined) {
    return textToString(element.value);
  }

  if (element.text) {
    return textToString(element.text);
  }

  return "";
}

function getElementName(element) {
  if (!element) {
    return "";
  }

  return (
    textToString(element.name) ||
    textToString(element.key) ||
    textToString(element.title)
  );
}

function getBlockElements(block) {
  if (Array.isArray(block.elements)) {
    return block.elements;
  }

  if (Array.isArray(block.items)) {
    return block.items;
  }

  if (Array.isArray(block.value)) {
    return block.value;
  }

  return [];
}

function extractRowsFromListBlock(block) {
  const elements = getBlockElements(block);

  return elements
    .map((element) => {
      const label = getElementName(element);
      const value = formatElementValue(element);

      if (!label || !value) {
        return null;
      }

      return {
        label,
        value,
      };
    })
    .filter(Boolean);
}

export function extractKnownCharacteristics(raw, level = 0) {
  const infoBlocks = getInfoBlocksForLevel(raw, level);
  const rows = [];

  infoBlocks.forEach((block) => {
    if (block.type === "list") {
      rows.push(...extractRowsFromListBlock(block));
    }

    if (block.type === "numeric") {
      const label = getElementName(block);
      const value = formatElementValue(block);

      if (label && value) {
        rows.push({ label, value });
      }
    }

    if (block.type === "key-value") {
      const label = getElementName(block);
      const value = formatElementValue(block);

      if (label && value) {
        rows.push({ label, value });
      }
    }
  });

  const seenLabels = new Set();

  return rows.filter((row) => {
    const label = String(row.label).trim();
    const value = String(row.value).trim();

    if (!label || !value) {
      return false;
    }

    const lowerLabel = label
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

    if (
      lowerLabel.includes("особенности") ||
      lowerLabel.includes("описание")
    ) {
      return false;
    }


    if (seenLabels.has(lowerLabel)) {
      return false;
    }

    seenLabels.add(lowerLabel);

    return true;
  });
}

export function extractItemFeatures(raw) {
  if (!raw?.infoBlocks || !Array.isArray(raw.infoBlocks)) {
    return [];
  }

  const description = extractDescription(raw);

  return raw.infoBlocks
    .filter((block) => block.type === "list")
    .filter((block) => {
      const title = textToString(block.title).toLowerCase();

      return (
        title.includes("особ") ||
        title.includes("feature") ||
        title.includes("special")
      );
    })
    .flatMap((block) => {
      const elements = getBlockElements(block);

      return elements
        .map((element) =>
          textToString(element.text || element.value || element.name)
        )
        .filter(Boolean);
    })
    .filter((feature) => feature !== description);
}
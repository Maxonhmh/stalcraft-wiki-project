package com.example.demo.common;

import java.text.Normalizer;
import java.util.Locale;
import java.util.Map;

public class SlugUtils {

    private static final Map<Character, String> RU_TO_LATIN = Map.ofEntries(
            Map.entry('а', "a"), Map.entry('б', "b"), Map.entry('в', "v"),
            Map.entry('г', "g"), Map.entry('д', "d"), Map.entry('е', "e"),
            Map.entry('ё', "e"), Map.entry('ж', "zh"), Map.entry('з', "z"),
            Map.entry('и', "i"), Map.entry('й', "y"), Map.entry('к', "k"),
            Map.entry('л', "l"), Map.entry('м', "m"), Map.entry('н', "n"),
            Map.entry('о', "o"), Map.entry('п', "p"), Map.entry('р', "r"),
            Map.entry('с', "s"), Map.entry('т', "t"), Map.entry('у', "u"),
            Map.entry('ф', "f"), Map.entry('х', "h"), Map.entry('ц', "c"),
            Map.entry('ч', "ch"), Map.entry('ш', "sh"), Map.entry('щ', "sch"),
            Map.entry('ъ', ""), Map.entry('ы', "y"), Map.entry('ь', ""),
            Map.entry('э', "e"), Map.entry('ю', "yu"), Map.entry('я', "ya")
    );

    private SlugUtils() {
    }

    public static String createSlug(String source) {
        if (source == null || source.isBlank()) {
            return "item";
        }

        String lower = source.toLowerCase(Locale.ROOT).trim();
        StringBuilder transliterated = new StringBuilder();

        for (char character : lower.toCharArray()) {
            transliterated.append(RU_TO_LATIN.getOrDefault(character, String.valueOf(character)));
        }

        String normalized = Normalizer
                .normalize(transliterated.toString(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");

        String slug = normalized
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");

        if (slug.isBlank()) {
            return "item";
        }

        return slug;
    }
}
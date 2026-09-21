use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FontFeature {
    pub tag: String,
    pub label: String,
    pub group: Option<&'static str>,
    pub sample: &'static str,
}

const KANJI: &str = "字形";
const WIDTH: &str = "字幅";
const FIGURE: &str = "数字";
const CAPS: &str = "大文字";

// 4 文字タグは CSS の font-feature-settings にそのまま渡せる
type Known = (
    &'static str,
    &'static str,
    Option<&'static str>,
    &'static str,
);

const KNOWN: &[Known] = &[
    ("jp78", "JIS78 字形", Some(KANJI), "辻飴海"),
    ("jp83", "JIS83 字形", Some(KANJI), "辻飴海"),
    ("jp90", "JIS90 字形", Some(KANJI), "辻飴海"),
    ("jp04", "JIS2004 字形", Some(KANJI), "辻飴海"),
    ("nlck", "印刷標準字体", Some(KANJI), "辻飴海"),
    ("trad", "旧字体", Some(KANJI), "国体学"),
    ("smpl", "新字体", Some(KANJI), "國體學"),
    ("expt", "専門家用字形", Some(KANJI), "辻飴海"),
    ("hojo", "補助漢字", Some(KANJI), "辻飴海"),
    ("pwid", "プロポーショナル字幅", Some(WIDTH), "あア亜A1"),
    ("hwid", "半角字幅", Some(WIDTH), "あア亜A1"),
    ("fwid", "全角字幅", Some(WIDTH), "あア亜A1"),
    ("twid", "三分字幅", Some(WIDTH), "あア亜A1"),
    ("qwid", "四分字幅", Some(WIDTH), "あア亜A1"),
    ("palt", "プロポーショナルメトリクス", None, "「あいうえお」"),
    (
        "vpal",
        "縦組プロポーショナルメトリクス",
        None,
        "「あいうえお」",
    ),
    ("halt", "縦組半角メトリクス", None, "「あいうえお」"),
    ("vert", "縦組用字形", None, "「あ、」"),
    ("vrt2", "縦組回転字形", None, "「あ、」"),
    ("vkrn", "縦組カーニング", None, "「あいうえお」"),
    ("ruby", "ルビ用字形", None, "ふりがな"),
    ("ital", "イタリック", None, "Italic"),
    ("liga", "標準合字", None, "fi fl ffi"),
    ("dlig", "任意合字", None, "st ct"),
    ("clig", "文脈依存合字", None, "fi fl"),
    ("hlig", "古典合字", None, "st ct"),
    ("calt", "文脈依存字形", None, "AVATAR"),
    ("smcp", "スモールキャップス", Some(CAPS), "Small Caps"),
    (
        "c2sc",
        "大文字をスモールキャップスに",
        Some(CAPS),
        "SMALL CAPS",
    ),
    ("pcap", "ペティットキャップス", Some(CAPS), "Petite Caps"),
    ("onum", "オールドスタイル数字", Some(FIGURE), "0123456789"),
    ("lnum", "ライニング数字", Some(FIGURE), "0123456789"),
    ("tnum", "等幅数字", Some(FIGURE), "0123456789"),
    ("pnum", "プロポーショナル数字", Some(FIGURE), "0123456789"),
    ("zero", "スラッシュ付きゼロ", None, "0O"),
    ("frac", "分数", None, "1/2 3/4"),
    ("afrc", "垂直分数", None, "1/2 3/4"),
    ("sups", "上付き", None, "x2 m3"),
    ("subs", "下付き", None, "H2O"),
    ("swsh", "スワッシュ", None, "Quick"),
    ("aalt", "すべての異体字", None, "辻飴海"),
    ("salt", "異体字", None, "辻飴海"),
    ("kern", "カーニング", None, "AVATAR To"),
    ("case", "大文字用字形", None, "(A-B)"),
];

pub fn describe(tag: &str) -> FontFeature {
    if let Some((_, label, group, sample)) = KNOWN.iter().find(|(known, ..)| *known == tag) {
        return FontFeature {
            tag: tag.to_string(),
            label: (*label).to_string(),
            group: *group,
            sample,
        };
    }

    let label = match tag.split_at_checked(2) {
        Some(("ss", digits)) if digits.chars().all(|c| c.is_ascii_digit()) => {
            format!("スタイルセット {digits}")
        }
        Some(("cv", digits)) if digits.chars().all(|c| c.is_ascii_digit()) => {
            format!("文字異体 {digits}")
        }
        _ => format!("{tag}（不明な機能）"),
    };

    FontFeature {
        tag: tag.to_string(),
        label,
        group: None,
        sample: "辻飴海 Quick 0123",
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // 既知のタグは日本語ラベルと排他グループを持つ
    #[test]
    fn known_tags_have_japanese_labels() {
        let jp90 = describe("jp90");
        assert_eq!(jp90.label, "JIS90 字形");
        assert_eq!(jp90.group, Some(KANJI));
        assert_eq!(describe("palt").group, None);
    }

    // ss / cv は連番からラベルを組み立てる
    #[test]
    fn numbered_tags_are_generated() {
        assert_eq!(describe("ss01").label, "スタイルセット 01");
        assert_eq!(describe("cv23").label, "文字異体 23");
    }

    // 未知のタグもタグ名を出して落とさない
    #[test]
    fn unknown_tag_falls_back() {
        assert_eq!(describe("zzzz").label, "zzzz（不明な機能）");
    }

    // ラベル表にタグの重複がない
    #[test]
    fn known_tags_are_unique() {
        let mut tags: Vec<&str> = KNOWN.iter().map(|(tag, ..)| *tag).collect();
        let before = tags.len();
        tags.sort_unstable();
        tags.dedup();
        assert_eq!(before, tags.len());
    }

    // 排他グループは同じ文字列で束ねられている
    #[test]
    fn exclusive_groups_are_shared() {
        assert_eq!(describe("jp78").group, describe("jp04").group);
        assert_eq!(describe("onum").group, describe("lnum").group);
        assert_ne!(describe("jp78").group, describe("onum").group);
    }
}

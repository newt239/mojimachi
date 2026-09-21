use std::collections::HashMap;

use read_fonts::tables::name::Name;
use read_fonts::types::NameId;

// 日本語 > 英語 の順に選び、同点なら先に現れたものを残す
fn score(platform_id: u16, language_id: u16) -> u8 {
    match (platform_id, language_id) {
        (3, 0x0411) => 100,
        (1, 11) => 90,
        (3, 0x0409) => 80,
        (0, _) => 70,
        (1, 0) => 60,
        (3, _) => 50,
        _ => 10,
    }
}

pub fn collect(name: &Name) -> HashMap<u16, String> {
    let data = name.string_data();
    let mut best: HashMap<u16, (u8, String)> = HashMap::new();

    for record in name.name_record() {
        let Ok(text) = record.string(data) else {
            continue;
        };
        let value = text.chars().collect::<String>();
        if value.is_empty() {
            continue;
        }
        let key = record.name_id().to_u16();
        let rank = score(record.platform_id(), record.language_id());
        match best.get(&key) {
            Some((current, _)) if *current >= rank => {}
            _ => {
                best.insert(key, (rank, value));
            }
        }
    }

    best.into_iter()
        .map(|(key, (_, value))| (key, value))
        .collect()
}

pub fn get(names: &HashMap<u16, String>, id: NameId) -> Option<String> {
    names.get(&id.to_u16()).cloned()
}

// 情報タブに出す name テーブルの項目（表示順）
pub const DISPLAY_IDS: [(NameId, &str); 17] = [
    (NameId::FULL_NAME, "フルネーム"),
    (NameId::FAMILY_NAME, "ファミリー"),
    (NameId::SUBFAMILY_NAME, "サブファミリー"),
    (NameId::TYPOGRAPHIC_FAMILY_NAME, "優先ファミリー"),
    (NameId::POSTSCRIPT_NAME, "PostScript 名"),
    (NameId::UNIQUE_ID, "識別子"),
    (NameId::VERSION_STRING, "バージョン"),
    (NameId::DESIGNER, "デザイナー"),
    (NameId::MANUFACTURER, "製造元"),
    (NameId::COPYRIGHT_NOTICE, "著作権"),
    (NameId::TRADEMARK, "商標"),
    (NameId::DESCRIPTION, "説明"),
    (NameId::LICENSE_DESCRIPTION, "ライセンス"),
    (NameId::LICENSE_URL, "ライセンス URL"),
    (NameId::VENDOR_URL, "ベンダー URL"),
    (NameId::DESIGNER_URL, "デザイナー URL"),
    (NameId::SAMPLE_TEXT, "サンプルテキスト"),
];

#[cfg(test)]
mod tests {
    use super::*;

    // 日本語の name レコードが英語より優先される
    #[test]
    fn japanese_outranks_english() {
        assert!(score(3, 0x0411) > score(3, 0x0409));
        assert!(score(1, 11) > score(1, 0));
    }

    // 表示する name 項目は 17 件で重複がない
    #[test]
    fn display_ids_are_unique() {
        let mut ids: Vec<u16> = DISPLAY_IDS.iter().map(|(id, _)| id.to_u16()).collect();
        let before = ids.len();
        ids.sort_unstable();
        ids.dedup();
        assert_eq!(before, 17);
        assert_eq!(ids.len(), 17);
    }
}

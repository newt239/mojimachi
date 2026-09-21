use read_fonts::FontRef;
use roaring::RoaringBitmap;
use serde::Serialize;
use skrifa::MetadataProvider;

use super::charset::{self, CharsetCoverage};

pub struct UnicodeBlock {
    pub name: &'static str,
    pub start: u32,
    pub end: u32,
}

pub const BLOCKS: &[UnicodeBlock] = &[
    UnicodeBlock {
        name: "基本ラテン",
        start: 0x0020,
        end: 0x007E,
    },
    UnicodeBlock {
        name: "ラテン 1 補助",
        start: 0x00A0,
        end: 0x00FF,
    },
    UnicodeBlock {
        name: "ラテン拡張 A",
        start: 0x0100,
        end: 0x017F,
    },
    UnicodeBlock {
        name: "ラテン拡張 B",
        start: 0x0180,
        end: 0x024F,
    },
    UnicodeBlock {
        name: "IPA 拡張",
        start: 0x0250,
        end: 0x02AF,
    },
    UnicodeBlock {
        name: "前進を伴う修飾文字",
        start: 0x02B0,
        end: 0x02FF,
    },
    UnicodeBlock {
        name: "ダイアクリティカルマーク",
        start: 0x0300,
        end: 0x036F,
    },
    UnicodeBlock {
        name: "ギリシャ・コプト",
        start: 0x0370,
        end: 0x03FF,
    },
    UnicodeBlock {
        name: "キリル",
        start: 0x0400,
        end: 0x04FF,
    },
    UnicodeBlock {
        name: "ヘブライ",
        start: 0x0590,
        end: 0x05FF,
    },
    UnicodeBlock {
        name: "アラビア",
        start: 0x0600,
        end: 0x06FF,
    },
    UnicodeBlock {
        name: "デーヴァナーガリー",
        start: 0x0900,
        end: 0x097F,
    },
    UnicodeBlock {
        name: "タイ",
        start: 0x0E00,
        end: 0x0E7F,
    },
    UnicodeBlock {
        name: "記号と句読点",
        start: 0x2000,
        end: 0x206F,
    },
    UnicodeBlock {
        name: "上付き・下付き",
        start: 0x2070,
        end: 0x209F,
    },
    UnicodeBlock {
        name: "通貨記号",
        start: 0x20A0,
        end: 0x20CF,
    },
    UnicodeBlock {
        name: "文字様記号",
        start: 0x2100,
        end: 0x214F,
    },
    UnicodeBlock {
        name: "数字に準じるもの",
        start: 0x2150,
        end: 0x218F,
    },
    UnicodeBlock {
        name: "矢印",
        start: 0x2190,
        end: 0x21FF,
    },
    UnicodeBlock {
        name: "数学記号",
        start: 0x2200,
        end: 0x22FF,
    },
    UnicodeBlock {
        name: "囲み英数字",
        start: 0x2460,
        end: 0x24FF,
    },
    UnicodeBlock {
        name: "罫線素片",
        start: 0x2500,
        end: 0x257F,
    },
    UnicodeBlock {
        name: "ブロック要素",
        start: 0x2580,
        end: 0x259F,
    },
    UnicodeBlock {
        name: "幾何学模様",
        start: 0x25A0,
        end: 0x25FF,
    },
    UnicodeBlock {
        name: "その他の記号",
        start: 0x2600,
        end: 0x26FF,
    },
    UnicodeBlock {
        name: "装飾記号",
        start: 0x2700,
        end: 0x27BF,
    },
    UnicodeBlock {
        name: "CJK 記号と句読点",
        start: 0x3000,
        end: 0x303F,
    },
    UnicodeBlock {
        name: "ひらがな",
        start: 0x3040,
        end: 0x309F,
    },
    UnicodeBlock {
        name: "カタカナ",
        start: 0x30A0,
        end: 0x30FF,
    },
    UnicodeBlock {
        name: "注音字母",
        start: 0x3100,
        end: 0x312F,
    },
    UnicodeBlock {
        name: "ハングル互換字母",
        start: 0x3130,
        end: 0x318F,
    },
    UnicodeBlock {
        name: "囲み CJK 文字・月",
        start: 0x3200,
        end: 0x32FF,
    },
    UnicodeBlock {
        name: "CJK 互換文字",
        start: 0x3300,
        end: 0x33FF,
    },
    UnicodeBlock {
        name: "CJK 統合漢字拡張 A",
        start: 0x3400,
        end: 0x4DBF,
    },
    UnicodeBlock {
        name: "CJK 統合漢字",
        start: 0x4E00,
        end: 0x9FFF,
    },
    UnicodeBlock {
        name: "ハングル音節",
        start: 0xAC00,
        end: 0xD7A3,
    },
    UnicodeBlock {
        name: "CJK 互換漢字",
        start: 0xF900,
        end: 0xFAFF,
    },
    UnicodeBlock {
        name: "半角・全角形",
        start: 0xFF00,
        end: 0xFFEF,
    },
    UnicodeBlock {
        name: "その他の記号と絵文字",
        start: 0x1F300,
        end: 0x1F5FF,
    },
    UnicodeBlock {
        name: "顔文字",
        start: 0x1F600,
        end: 0x1F64F,
    },
    UnicodeBlock {
        name: "交通と地図の記号",
        start: 0x1F680,
        end: 0x1F6FF,
    },
    UnicodeBlock {
        name: "補助記号と絵文字",
        start: 0x1F900,
        end: 0x1F9FF,
    },
    UnicodeBlock {
        name: "CJK 統合漢字拡張 B",
        start: 0x20000,
        end: 0x2A6DF,
    },
];

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BlockGlyphs {
    pub id: u32,
    pub name: &'static str,
    pub code_points: Vec<u32>,
}

// cmap を総当たりせず、実際に写像のあるコードポイントだけを拾う
pub fn code_points(font: &FontRef<'_>) -> RoaringBitmap {
    let mut bitmap = RoaringBitmap::new();
    for (code, glyph) in font.charmap().mappings() {
        if glyph.to_u32() != 0 {
            bitmap.insert(code);
        }
    }
    bitmap
}

pub fn encode(bitmap: &RoaringBitmap) -> Vec<u8> {
    let mut bytes = Vec::with_capacity(bitmap.serialized_size());
    let _ = bitmap.serialize_into(&mut bytes);
    bytes
}

pub fn decode(bytes: &[u8]) -> RoaringBitmap {
    RoaringBitmap::deserialize_from(bytes).unwrap_or_default()
}

pub fn covered_chars(bitmap: &RoaringBitmap, chars: &[char]) -> usize {
    chars
        .iter()
        .filter(|ch| bitmap.contains(**ch as u32))
        .count()
}

pub fn blocks(bitmap: &RoaringBitmap) -> Vec<BlockGlyphs> {
    BLOCKS
        .iter()
        .filter_map(|block| {
            let code_points: Vec<u32> = bitmap.range(block.start..=block.end).collect();
            if code_points.is_empty() {
                return None;
            }
            Some(BlockGlyphs {
                id: block.start,
                name: block.name,
                code_points,
            })
        })
        .collect()
}

pub fn charset_coverage(bitmap: &RoaringBitmap) -> Vec<CharsetCoverage> {
    charset::all()
        .iter()
        .map(|set| CharsetCoverage {
            id: set.id,
            name: set.name,
            covered: covered_chars(bitmap, &set.chars),
            total: set.chars.len(),
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    // ブロックは 43 件あり、範囲が重ならず昇順に並ぶ
    #[test]
    fn blocks_are_ordered_and_disjoint() {
        assert_eq!(BLOCKS.len(), 43);
        for pair in BLOCKS.windows(2) {
            let (left, right) = (&pair[0], &pair[1]);
            assert!(left.start <= left.end, "{} の範囲が逆転している", left.name);
            assert!(
                left.end < right.start,
                "{} と {} が重なっている",
                left.name,
                right.name
            );
        }
    }

    // ブロック名に重複がない
    #[test]
    fn block_names_are_unique() {
        let mut names: Vec<&str> = BLOCKS.iter().map(|block| block.name).collect();
        names.sort_unstable();
        names.dedup();
        assert_eq!(names.len(), 43);
    }

    // ビットマップは往復しても内容が変わらない
    #[test]
    fn bitmap_round_trips() {
        let mut bitmap = RoaringBitmap::new();
        bitmap.insert(0x3042);
        bitmap.insert(0x1F600);
        let restored = decode(&encode(&bitmap));
        assert_eq!(restored, bitmap);
        assert_eq!(decode(b"broken"), RoaringBitmap::new());
    }

    // 文字セットの収録数を数える
    #[test]
    fn counts_covered_chars() {
        let mut bitmap = RoaringBitmap::new();
        bitmap.insert('あ' as u32);
        assert_eq!(covered_chars(&bitmap, &['あ', 'い']), 1);
        assert_eq!(covered_chars(&bitmap, &[]), 0);
    }

    // 収録のないブロックは結果に出さない
    #[test]
    fn empty_blocks_are_skipped() {
        let mut bitmap = RoaringBitmap::new();
        bitmap.insert(0x0041);
        let result = blocks(&bitmap);
        assert_eq!(result.len(), 1);
        assert_eq!(result[0].name, "基本ラテン");
        assert_eq!(result[0].code_points, vec![0x0041]);
    }
}

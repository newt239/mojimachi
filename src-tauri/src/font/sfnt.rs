use read_fonts::{FileRef, FontRef};
use write_fonts::FontBuilder;

use crate::error::{AppError, AppResult};

pub fn is_collection(data: &[u8]) -> bool {
    matches!(FileRef::new(data), Ok(FileRef::Collection(_)))
}

// .ttc は @font-face が先頭 face しか読まないため、face 単体の sfnt に組み直す
pub fn single_face_sfnt(data: &[u8], index: u32) -> AppResult<Vec<u8>> {
    if index == 0 && !is_collection(data) {
        return Ok(data.to_vec());
    }

    let font = FontRef::from_index(data, index)
        .map_err(|err| AppError::Font(format!("face {index} を開けません: {err}")))?;

    let mut builder = FontBuilder::new();
    builder.copy_missing_tables(font);
    Ok(builder.build())
}

#[cfg(test)]
mod tests {
    use read_fonts::types::Tag;

    use super::*;

    const HEAD: Tag = Tag::new(b"head");
    const TEST_TAG: Tag = Tag::new(b"TEST");

    fn tiny_font(marker: u8) -> Vec<u8> {
        let mut builder = FontBuilder::new();
        builder.add_raw(HEAD, vec![0xFF_u8; 54]);
        builder.add_raw(TEST_TAG, vec![marker; 8]);
        builder.build()
    }

    // テーブルのオフセットはファイル先頭からの絶対値なので、連結時にずらす
    fn shift_offsets(font: &mut [u8], delta: u32) {
        let count = u16::from_be_bytes([font[4], font[5]]) as usize;
        for i in 0..count {
            let at = 12 + i * 16 + 8;
            let offset = u32::from_be_bytes([font[at], font[at + 1], font[at + 2], font[at + 3]]);
            font[at..at + 4].copy_from_slice(&(offset + delta).to_be_bytes());
        }
    }

    fn make_ttc(fonts: &[Vec<u8>]) -> Vec<u8> {
        let header_len = 12 + 4 * fonts.len();
        let mut out = Vec::from(*b"ttcf");
        out.extend_from_slice(&0x0001_0000_u32.to_be_bytes());
        out.extend_from_slice(&(fonts.len() as u32).to_be_bytes());

        let mut offset = header_len as u32;
        let mut bodies = Vec::new();
        for font in fonts {
            out.extend_from_slice(&offset.to_be_bytes());
            let mut body = font.clone();
            shift_offsets(&mut body, offset);
            offset += body.len() as u32;
            bodies.push(body);
        }
        for body in bodies {
            out.extend_from_slice(&body);
        }
        out
    }

    // .ttc の 2 番目の face を取り出すと、その face のテーブルが得られる
    #[test]
    fn extracts_second_face_of_collection() {
        let ttc = make_ttc(&[tiny_font(0xAA), tiny_font(0xBB)]);
        assert!(is_collection(&ttc));
        assert!(FontRef::from_index(&ttc, 1).is_ok());

        let extracted = single_face_sfnt(&ttc, 1).expect("face を取り出せること");
        assert!(!is_collection(&extracted));

        let font = FontRef::new(&extracted).expect("単体 sfnt として読めること");
        let table = font.table_data(TEST_TAG).expect("TEST テーブルがあること");
        assert_eq!(table.as_bytes(), &[0xBB_u8; 8]);
    }

    // 取り出した sfnt は head の checkSumAdjustment が組み直され、元の値のままにならない
    #[test]
    fn recomputes_head_checksum_adjustment() {
        let ttc = make_ttc(&[tiny_font(0xAA), tiny_font(0xBB)]);
        let extracted = single_face_sfnt(&ttc, 0).expect("face を取り出せること");
        let font = FontRef::new(&extracted).expect("単体 sfnt として読めること");
        let head = font.table_data(HEAD).expect("head があること");
        assert_eq!(head.as_bytes().len(), 54);
        assert_ne!(&head.as_bytes()[8..12], &[0xFF, 0xFF, 0xFF, 0xFF]);
    }

    // コレクションでない単体フォントはそのまま返す
    #[test]
    fn passes_through_single_face_file() {
        let font = tiny_font(0xCC);
        assert_eq!(single_face_sfnt(&font, 0).expect("そのまま返る"), font);
    }

    // 範囲外の index はエラーになる
    #[test]
    fn rejects_out_of_range_index() {
        let ttc = make_ttc(&[tiny_font(0xAA)]);
        assert!(single_face_sfnt(&ttc, 5).is_err());
    }
}

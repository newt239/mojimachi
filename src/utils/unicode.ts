// unicodeの範囲をjson形式で定義
// 各objectは、{start: number, end: number, name: string}の形式
type UnicodeRange = {
  start: number;
  end: number;
  name: string;
};

export const unicodeRanges: { [key: string]: UnicodeRange } = {
  "Basic Latin": {
    start: 0x0000,
    end: 0x007f,
    name: "基本ラテン文字",
  },
  "Latin-1 Supplement": {
    start: 0x0080,
    end: 0x00ff,
    name: "ラテン-1補助",
  },
  "Latin Extended-A": {
    start: 0x0100,
    end: 0x017f,
    name: "ラテン拡張-A",
  },
  "Latin Extended-B": {
    start: 0x0180,
    end: 0x024f,
    name: "ラテン拡張-B",
  },
  "IPA Extensions": {
    start: 0x0250,
    end: 0x02af,
    name: "国際音声記号拡張",
  },
  "Spacing Modifier Letters": {
    start: 0x02b0,
    end: 0x02ff,
    name: "修飾記号付き文字",
  },
  "Combining Diacritical Marks": {
    start: 0x0300,
    end: 0x036f,
    name: "結合分音記号",
  },
  Greek: {
    start: 0x0370,
    end: 0x03ff,
    name: "ギリシャ文字",
  },
  Cyrillic: {
    start: 0x0400,
    end: 0x04ff,
    name: "キリル文字",
  },
  "Cyrillic Supplement": {
    start: 0x0500,
    end: 0x052f,
    name: "キリル文字補助",
  },
  Armenian: {
    start: 0x0530,
    end: 0x058f,
    name: "アルメニア文字",
  },
  Hebrew: {
    start: 0x0590,
    end: 0x05ff,
    name: "ヘブライ文字",
  },
  Arabic: {
    start: 0x0600,
    end: 0x06ff,
    name: "アラビア文字",
  },
  Syriac: {
    start: 0x0700,

    end: 0x074f,
    name: "シリア文字",
  },
  Thaana: {
    start: 0x0780,
    end: 0x07bf,
    name: "ターナ文字",
  },
  Devanagari: {
    start: 0x0900,
    end: 0x097f,
    name: "デーヴァナーガリー文字",
  },
  Bengali: {
    start: 0x0980,
    end: 0x09ff,
    name: "ベンガル文字",
  },
  Gurmukhi: {
    start: 0x0a00,
    end: 0x0a7f,
    name: "グルムキー文字",
  },
  Gujarati: {
    start: 0x0a80,
    end: 0x0aff,
    name: "グジャラート文字",
  },
  Oriya: {
    start: 0x0b00,
    end: 0x0b7f,
    name: "オリヤー文字",
  },
  Tamil: {
    start: 0x0b80,
    end: 0x0bff,
    name: "タミル文字",
  },
  Telugu: {
    start: 0x0c00,
    end: 0x0c7f,
    name: "テルグ文字",
  },
  Kannada: {
    start: 0x0c80,
    end: 0x0cff,
    name: "カンナダ文字",
  },
  Malayalam: {
    start: 0x0d00,
    end: 0x0d7f,
    name: "マラヤーラム文字",
  },
  Sinhala: {
    start: 0x0d80,
    end: 0x0dff,
    name: "シンハラ文字",
  },
  Thai: {
    start: 0x0e00,
    end: 0x0e7f,
    name: "タイ文字",
  },
  Lao: {
    start: 0x0e80,
    end: 0x0eff,
    name: "ラオ文字",
  },
  Tibetan: {
    start: 0x0f00,
    end: 0x0fff,
    name: "チベット文字",
  },
  Myanmar: {
    start: 0x1000,
    end: 0x109f,
    name: "ミャンマー文字",
  },
  Georgian: {
    start: 0x10a0,
    end: 0x10ff,
    name: "グルジア文字",
  },
  HangulJamo: {
    start: 0x1100,
    end: 0x11ff,
    name: "ハングル字母",
  },
  Ethiopic: {
    start: 0x1200,
    end: 0x137f,
    name: "エチオピア文字",
  },
  Cherokee: {
    start: 0x13a0,
    end: 0x13ff,
    name: "チェロキー文字",
  },
  UnifiedCanadianAboriginalSyllabics: {
    start: 0x1400,
    end: 0x167f,
    name: "カナダ先住民音節文字",
  },
  Ogham: {
    start: 0x1680,
    end: 0x169f,
    name: "オガム文字",
  },
  Runic: {
    start: 0x16a0,
    end: 0x16ff,
    name: "ルーン文字",
  },
  Tagalog: {
    start: 0x1700,
    end: 0x171f,
    name: "タガログ文字",
  },
  Hanunoo: {
    start: 0x1720,
    end: 0x173f,
    name: "ハヌノオ文字",
  },
  Buhid: {
    start: 0x1740,
    end: 0x175f,
    name: "ブヒッド文字",
  },
  Tagbanwa: {
    start: 0x1760,
    end: 0x177f,
    name: "タグバヌア文字",
  },
  Khmer: {
    start: 0x1780,
    end: 0x17ff,
    name: "クメール文字",
  },
  Mongolian: {
    start: 0x1800,
    end: 0x18af,
    name: "モンゴル文字",
  },
  UnifiedCanadianAboriginalSyllabicsExtended: {
    start: 0x18b0,
    end: 0x18ff,
    name: "カナダ先住民音節文字拡張",
  },
  Limbu: {
    start: 0x1900,
    end: 0x194f,
    name: "リンブ文字",
  },
  TaiLe: {
    start: 0x1950,
    end: 0x197f,
    name: "タイ・レ文字",
  },
  NewTaiLue: {
    start: 0x1980,
    end: 0x19df,
    name: "新タイ・レ文字",
  },
  KhmerSymbols: {
    start: 0x19e0,
    end: 0x19ff,
    name: "クメール記号",
  },
  Buginese: {
    start: 0x1a00,
    end: 0x1a1f,
    name: "ブギス文字",
  },
  TaiTham: {
    start: 0x1a20,
    end: 0x1aaf,
    name: "タイ・タム文字",
  },
  Balinese: {
    start: 0x1b00,
    end: 0x1b7f,
    name: "バリ文字",
  },
  Sundanese: {
    start: 0x1b80,
    end: 0x1bbf,
    name: "スンダ文字",
  },
  Batak: {
    start: 0x1bc0,
    end: 0x1bff,
    name: "バタク文字",
  },
  Lepcha: {
    start: 0x1c00,
    end: 0x1c4f,
    name: "レプチャ文字",
  },
  OlChiki: {
    start: 0x1c50,
    end: 0x1c7f,
    name: "オル・チキ文字",
  },
  CyrillicExtendedC: {
    start: 0x1c80,
    end: 0x1c8f,
    name: "キリル文字拡張-C",
  },
  GeorgianExtended: {
    start: 0x1c90,
    end: 0x1cbf,
    name: "グルジア文字拡張",
  },
  SundaneseSupplement: {
    start: 0x1cc0,
    end: 0x1ccf,
    name: "スンダ文字補助",
  },
  VedicExtensions: {
    start: 0x1cd0,
    end: 0x1cff,
    name: "ヴェーダ拡張",
  },
  PhoneticExtensions: {
    start: 0x1d00,
    end: 0x1d7f,
    name: "音声拡張",
  },
  PhoneticExtensionsSupplement: {
    start: 0x1d80,
    end: 0x1dbf,
    name: "音声拡張補助",
  },
  CombiningDiacriticalMarksSupplement: {
    start: 0x1dc0,
    end: 0x1dff,
    name: "結合分音記号補助",
  },
  LatinExtendedAdditional: {
    start: 0x1e00,
    end: 0x1eff,
    name: "追加ラテン拡張",
  },
  GreekExtended: {
    start: 0x1f00,
    end: 0x1fff,
    name: "ギリシャ文字拡張",
  },
  GeneralPunctuation: {
    start: 0x2000,
    end: 0x206f,
    name: "一般句読点",
  },
  SuperscriptsAndSubscripts: {
    start: 0x2070,
    end: 0x209f,
    name: "上付き・下付き文字",
  },
  CurrencySymbols: {
    start: 0x20a0,
    end: 0x20cf,
    name: "通貨記号",
  },
  CombiningDiacriticalMarksForSymbols: {
    start: 0x20d0,
    end: 0x20ff,
    name: "記号用結合分音記号",
  },
  LetterlikeSymbols: {
    start: 0x2100,
    end: 0x214f,
    name: "文字のような記号",
  },
  NumberForms: {
    start: 0x2150,
    end: 0x218f,
    name: "数値記号",
  },
  Arrows: {
    start: 0x2190,
    end: 0x21ff,
    name: "矢印",
  },
  MathematicalOperators: {
    start: 0x2200,
    end: 0x22ff,
    name: "数学記号",
  },
  MiscellaneousTechnical: {
    start: 0x2300,
    end: 0x23ff,
    name: "その他の技術記号",
  },
  ControlPictures: {
    start: 0x2400,
    end: 0x243f,
    name: "制御画像",
  },
  OpticalCharacterRecognition: {
    start: 0x2440,
    end: 0x245f,
    name: "光学文字認識",
  },
  EnclosedAlphanumerics: {
    start: 0x2460,
    end: 0x24ff,
    name: "囲み英数字",
  },
  BoxDrawing: {
    start: 0x2500,
    end: 0x257f,
    name: "罫線",
  },
  BlockElements: {
    start: 0x2580,
    end: 0x259f,
    name: "ブロック要素",
  },
  GeometricShapes: {
    start: 0x25a0,
    end: 0x25ff,
    name: "幾何学的記号",
  },
  MiscellaneousSymbols: {
    start: 0x2600,
    end: 0x26ff,
    name: "その他の記号",
  },
  Dingbats: {
    start: 0x2700,
    end: 0x27bf,
    name: "ディンバット",
  },
  MiscellaneousMathematicalSymbolsA: {
    start: 0x27c0,
    end: 0x27ef,
    name: "その他の数学記号-A",
  },
  SupplementalArrowsA: {
    start: 0x27f0,
    end: 0x27ff,
    name: "補助矢印-A",
  },
  BraillePatterns: {
    start: 0x2800,
    end: 0x28ff,
    name: "点字パターン",
  },
  SupplementalArrowsB: {
    start: 0x2900,
    end: 0x297f,
    name: "補助矢印-B",
  },
  MiscellaneousMathematicalSymbolsB: {
    start: 0x2980,
    end: 0x29ff,
    name: "その他の数学記号-B",
  },
  SupplementalMathematicalOperators: {
    start: 0x2a00,
    end: 0x2aff,
    name: "補助数学演算子",
  },
  MiscellaneousSymbolsAndArrows: {
    start: 0x2b00,
    end: 0x2bff,
    name: "その他の記号と矢印",
  },
  Glagolitic: {
    start: 0x2c00,
    end: 0x2c5f,
    name: "グラゴル文字",
  },
  LatinExtendedC: {
    start: 0x2c60,
    end: 0x2c7f,
    name: "拡張ラテン-C",
  },
  Coptic: {
    start: 0x2c80,
    end: 0x2cff,
    name: "コプト文字",
  },
  GeorgianSupplement: {
    start: 0x2d00,
    end: 0x2d2f,
    name: "グルジア文字補助",
  },
  Tifinagh: {
    start: 0x2d30,
    end: 0x2d7f,
    name: "ティフナグ文字",
  },
  EthiopicExtended: {
    start: 0x2d80,
    end: 0x2ddf,
    name: "エチオピア文字拡張",
  },
  CyrillicExtendedA: {
    start: 0x2de0,
    end: 0x2dff,
    name: "キリル文字拡張-A",
  },
  SupplementalPunctuation: {
    start: 0x2e00,
    end: 0x2e7f,
    name: "補助句読点",
  },
  CJKRadicalsSupplement: {
    start: 0x2e80,
    end: 0x2eff,
    name: "CJK部首補助",
  },
  KangxiRadicals: {
    start: 0x2f00,
    end: 0x2fdf,
    name: "康煕部首",
  },
  IdeographicDescriptionCharacters: {
    start: 0x2ff0,
    end: 0x2fff,
    name: "表意文字記述文字",
  },
  CJKSymbolsAndPunctuation: {
    start: 0x3000,
    end: 0x303f,
    name: "CJK記号と句読点",
  },
  Hiragana: {
    start: 0x3040,
    end: 0x309f,
    name: "ひらがな",
  },
  Katakana: {
    start: 0x30a0,
    end: 0x30ff,
    name: "カタカナ",
  },
  Bopomofo: {
    start: 0x3100,
    end: 0x312f,
    name: "注音字母",
  },
  HangulCompatibilityJamo: {
    start: 0x3130,
    end: 0x318f,
    name: "ハングル互換字母",
  },
  Kanbun: {
    start: 0x3190,
    end: 0x319f,
    name: "漢文用字",
  },
  BopomofoExtended: {
    start: 0x31a0,
    end: 0x31bf,
    name: "注音字母拡張",
  },
  CJKStrokes: {
    start: 0x31c0,
    end: 0x31ef,
    name: "CJKストローク",
  },
  KatakanaPhoneticExtensions: {
    start: 0x31f0,
    end: 0x31ff,
    name: "カタカナ音声拡張",
  },
  EnclosedCJKLettersAndMonths: {
    start: 0x3200,
    end: 0x32ff,
    name: "囲みCJK文字と月",
  },
  CJKCompatibility: {
    start: 0x3300,
    end: 0x33ff,
    name: "CJK互換",
  },
  CJKUnifiedIdeographsExtensionA: {
    start: 0x3400,
    end: 0x4dbf,
    name: "CJK統合漢字拡張-A",
  },
  YijingHexagramSymbols: {
    start: 0x4dc0,
    end: 0x4dff,
    name: "易経六十四卦符号",
  },
  CJKUnifiedIdeographs: {
    start: 0x4e00,
    end: 0x9fff,
    name: "CJK統合漢字",
  },
  YiSyllables: {
    start: 0xa000,
    end: 0xa48f,
    name: "イ文字音節",
  },
  YiRadicals: {
    start: 0xa490,
    end: 0xa4cf,
    name: "イ文字部首",
  },
  Lisu: {
    start: 0xa4d0,
    end: 0xa4ff,
    name: "リス文字",
  },
  Vai: {
    start: 0xa500,
    end: 0xa63f,
    name: "ヴァイ文字",
  },
  CyrillicExtendedB: {
    start: 0xa640,
    end: 0xa69f,
    name: "キリル文字拡張-B",
  },
  Bamum: {
    start: 0xa6a0,
    end: 0xa6ff,
    name: "バムン文字",
  },
  ModifierToneLetters: {
    start: 0xa700,
    end: 0xa71f,
    name: "声調修飾文字",
  },
  LatinExtendedD: {
    start: 0xa720,
    end: 0xa7ff,
    name: "拡張ラテン-D",
  },
  SylotiNagri: {
    start: 0xa800,
    end: 0xa82f,
    name: "シロティ・ナグリ文字",
  },
  CommonIndicNumberForms: {
    start: 0xa830,
    end: 0xa83f,
    name: "共通インド数字形",
  },
  PhagsPa: {
    start: 0xa840,
    end: 0xa87f,
    name: "パスパ文字",
  },
  Saurashtra: {
    start: 0xa880,
    end: 0xa8df,
    name: "サウラーシュトラ文字",
  },
  DevanagariExtended: {
    start: 0xa8e0,
    end: 0xa8ff,
    name: "デーヴァナーガリー拡張",
  },
  KayahLi: {
    start: 0xa900,
    end: 0xa92f,
    name: "カヤフ・リー文字",
  },
  Rejang: {
    start: 0xa930,
    end: 0xa95f,
    name: "レジャン文字",
  },
  HangulJamoExtendedA: {
    start: 0xa960,
    end: 0xa97f,
    name: "ハングル互換字母補助-A",
  },
  Javanese: {
    start: 0xa980,
    end: 0xa9df,
    name: "ジャワ文字",
  },
  MyanmarExtendedB: {
    start: 0xa9e0,
    end: 0xa9ff,
    name: "ミャンマー文字拡張-B",
  },
  Cham: {
    start: 0xaa00,
    end: 0xaa5f,
    name: "チャム文字",
  },
  MyanmarExtendedA: {
    start: 0xaa60,
    end: 0xaa7f,
    name: "ミャンマー文字拡張-A",
  },
  TaiViet: {
    start: 0xaa80,
    end: 0xaadf,
    name: "タイ・ヴェト文字",
  },
  MeeteiMayekExtensions: {
    start: 0xaae0,
    end: 0xaaff,
    name: "メーティ・マヤック拡張",
  },
  EthiopicExtendedA: {
    start: 0xab00,
    end: 0xab2f,
    name: "エチオピア文字拡張-A",
  },
  LatinExtendedE: {
    start: 0xab30,
    end: 0xab6f,
    name: "拡張ラテン-E",
  },
  CherokeeSupplement: {
    start: 0xab70,
    end: 0xabbf,
    name: "チェロキー文字補助",
  },
  MeeteiMayek: {
    start: 0xabc0,
    end: 0xabff,
    name: "メーティ・マヤック",
  },
  HangulSyllables: {
    start: 0xac00,
    end: 0xd7af,
    name: "ハングル音節",
  },
  HangulJamoExtendedB: {
    start: 0xd7b0,
    end: 0xd7ff,
    name: "ハングル互換字母補助-B",
  },
  HighSurrogates: {
    start: 0xd800,
    end: 0xdb7f,
    name: "高位サロゲート",
  },
  HighPrivateUseSurrogates: {
    start: 0xdb80,
    end: 0xdbff,
    name: "高位私用サロゲート",
  },
  LowSurrogates: {
    start: 0xdc00,
    end: 0xdfff,
    name: "低位サロゲート",
  },
  PrivateUseArea: {
    start: 0xe000,
    end: 0xf8ff,
    name: "私用領域",
  },
  CJKCompatibilityIdeographs: {
    start: 0xf900,
    end: 0xfaff,
    name: "CJK互換漢字",
  },
  AlphabeticPresentationForms: {
    start: 0xfb00,
    end: 0xfb4f,
    name: "アルファベット表示形式",
  },
  ArabicPresentationFormsA: {
    start: 0xfb50,
    end: 0xfdff,
    name: "アラビア文字表示形式-A",
  },
  VariationSelectors: {
    start: 0xfe00,
    end: 0xfe0f,
    name: "変異セレクタ",
  },
  VerticalForms: {
    start: 0xfe10,
    end: 0xfe1f,
    name: "縦書き形式",
  },
  CombiningHalfMarks: {
    start: 0xfe20,
    end: 0xfe2f,
    name: "結合半記号",
  },
  CJKCompatibilityForms: {
    start: 0xfe30,
    end: 0xfe4f,
    name: "CJK互換形式",
  },
  SmallFormVariants: {
    start: 0xfe50,
    end: 0xfe6f,
    name: "小形式のバリアント",
  },
  ArabicPresentationFormsB: {
    start: 0xfe70,
    end: 0xfeff,
    name: "アラビア文字表示形式-B",
  },
  HalfwidthAndFullwidthForms: {
    start: 0xff00,
    end: 0xffef,
    name: "半角と全角の形式",
  },
  Specials: {
    start: 0xfff0,
    end: 0xffff,
    name: "特殊",
  },
};

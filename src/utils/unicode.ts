// Unicodeの範囲をjson形式で定義
// 各objectは、{start: number, end: number, name: string}の形式
type UnicodeRange = {
  start: number;
  end: number;
  name: string;
};

export const unicodeRanges: Record<string, UnicodeRange> = {
  AlphabeticPresentationForms: {
    end: 0xfb4f,
    name: "アルファベット表示形式",
    start: 0xfb00,
  },
  Arabic: {
    end: 0x06ff,
    name: "アラビア文字",
    start: 0x0600,
  },
  ArabicPresentationFormsA: {
    end: 0xfdff,
    name: "アラビア文字表示形式-A",
    start: 0xfb50,
  },
  ArabicPresentationFormsB: {
    end: 0xfeff,
    name: "アラビア文字表示形式-B",
    start: 0xfe70,
  },
  Armenian: {
    end: 0x058f,
    name: "アルメニア文字",
    start: 0x0530,
  },
  Arrows: {
    end: 0x21ff,
    name: "矢印",
    start: 0x2190,
  },
  Balinese: {
    end: 0x1b7f,
    name: "バリ文字",
    start: 0x1b00,
  },
  Bamum: {
    end: 0xa6ff,
    name: "バムン文字",
    start: 0xa6a0,
  },
  "Basic Latin": {
    end: 0x007f,
    name: "基本ラテン文字",
    start: 0x0000,
  },
  Batak: {
    end: 0x1bff,
    name: "バタク文字",
    start: 0x1bc0,
  },
  Bengali: {
    end: 0x09ff,
    name: "ベンガル文字",
    start: 0x0980,
  },
  BlockElements: {
    end: 0x259f,
    name: "ブロック要素",
    start: 0x2580,
  },
  Bopomofo: {
    end: 0x312f,
    name: "注音字母",
    start: 0x3100,
  },
  BopomofoExtended: {
    end: 0x31bf,
    name: "注音字母拡張",
    start: 0x31a0,
  },
  BoxDrawing: {
    end: 0x257f,
    name: "罫線",
    start: 0x2500,
  },
  BraillePatterns: {
    end: 0x28ff,
    name: "点字パターン",
    start: 0x2800,
  },
  Buginese: {
    end: 0x1a1f,
    name: "ブギス文字",
    start: 0x1a00,
  },
  Buhid: {
    end: 0x175f,
    name: "ブヒッド文字",
    start: 0x1740,
  },
  CJKCompatibility: {
    end: 0x33ff,
    name: "CJK互換",
    start: 0x3300,
  },
  CJKCompatibilityForms: {
    end: 0xfe4f,
    name: "CJK互換形式",
    start: 0xfe30,
  },
  CJKCompatibilityIdeographs: {
    end: 0xfaff,
    name: "CJK互換漢字",
    start: 0xf900,
  },
  CJKRadicalsSupplement: {
    end: 0x2eff,
    name: "CJK部首補助",
    start: 0x2e80,
  },
  CJKStrokes: {
    end: 0x31ef,
    name: "CJKストローク",
    start: 0x31c0,
  },
  CJKSymbolsAndPunctuation: {
    end: 0x303f,
    name: "CJK記号と句読点",
    start: 0x3000,
  },
  CJKUnifiedIdeographs: {
    end: 0x9fff,
    name: "CJK統合漢字",
    start: 0x4e00,
  },
  CJKUnifiedIdeographsExtensionA: {
    end: 0x4dbf,
    name: "CJK統合漢字拡張-A",
    start: 0x3400,
  },
  Cham: {
    end: 0xaa5f,
    name: "チャム文字",
    start: 0xaa00,
  },
  Cherokee: {
    end: 0x13ff,
    name: "チェロキー文字",
    start: 0x13a0,
  },
  CherokeeSupplement: {
    end: 0xabbf,
    name: "チェロキー文字補助",
    start: 0xab70,
  },
  "Combining Diacritical Marks": {
    end: 0x036f,
    name: "結合分音記号",
    start: 0x0300,
  },
  CombiningDiacriticalMarksForSymbols: {
    end: 0x20ff,
    name: "記号用結合分音記号",
    start: 0x20d0,
  },
  CombiningDiacriticalMarksSupplement: {
    end: 0x1dff,
    name: "結合分音記号補助",
    start: 0x1dc0,
  },
  CombiningHalfMarks: {
    end: 0xfe2f,
    name: "結合半記号",
    start: 0xfe20,
  },
  CommonIndicNumberForms: {
    end: 0xa83f,
    name: "共通インド数字形",
    start: 0xa830,
  },
  ControlPictures: {
    end: 0x243f,
    name: "制御画像",
    start: 0x2400,
  },
  Coptic: {
    end: 0x2cff,
    name: "コプト文字",
    start: 0x2c80,
  },
  CurrencySymbols: {
    end: 0x20cf,
    name: "通貨記号",
    start: 0x20a0,
  },
  Cyrillic: {
    end: 0x04ff,
    name: "キリル文字",
    start: 0x0400,
  },
  "Cyrillic Supplement": {
    end: 0x052f,
    name: "キリル文字補助",
    start: 0x0500,
  },
  CyrillicExtendedA: {
    end: 0x2dff,
    name: "キリル文字拡張-A",
    start: 0x2de0,
  },
  CyrillicExtendedB: {
    end: 0xa69f,
    name: "キリル文字拡張-B",
    start: 0xa640,
  },
  CyrillicExtendedC: {
    end: 0x1c8f,
    name: "キリル文字拡張-C",
    start: 0x1c80,
  },
  Devanagari: {
    end: 0x097f,
    name: "デーヴァナーガリー文字",
    start: 0x0900,
  },
  DevanagariExtended: {
    end: 0xa8ff,
    name: "デーヴァナーガリー拡張",
    start: 0xa8e0,
  },
  Dingbats: {
    end: 0x27bf,
    name: "ディンバット",
    start: 0x2700,
  },
  EnclosedAlphanumerics: {
    end: 0x24ff,
    name: "囲み英数字",
    start: 0x2460,
  },
  EnclosedCJKLettersAndMonths: {
    end: 0x32ff,
    name: "囲みCJK文字と月",
    start: 0x3200,
  },
  Ethiopic: {
    end: 0x137f,
    name: "エチオピア文字",
    start: 0x1200,
  },
  EthiopicExtended: {
    end: 0x2ddf,
    name: "エチオピア文字拡張",
    start: 0x2d80,
  },
  EthiopicExtendedA: {
    end: 0xab2f,
    name: "エチオピア文字拡張-A",
    start: 0xab00,
  },
  GeneralPunctuation: {
    end: 0x206f,
    name: "一般句読点",
    start: 0x2000,
  },
  GeometricShapes: {
    end: 0x25ff,
    name: "幾何学的記号",
    start: 0x25a0,
  },
  Georgian: {
    end: 0x10ff,
    name: "グルジア文字",
    start: 0x10a0,
  },
  GeorgianExtended: {
    end: 0x1cbf,
    name: "グルジア文字拡張",
    start: 0x1c90,
  },
  GeorgianSupplement: {
    end: 0x2d2f,
    name: "グルジア文字補助",
    start: 0x2d00,
  },
  Glagolitic: {
    end: 0x2c5f,
    name: "グラゴル文字",
    start: 0x2c00,
  },
  Greek: {
    end: 0x03ff,
    name: "ギリシャ文字",
    start: 0x0370,
  },
  GreekExtended: {
    end: 0x1fff,
    name: "ギリシャ文字拡張",
    start: 0x1f00,
  },
  Gujarati: {
    end: 0x0aff,
    name: "グジャラート文字",
    start: 0x0a80,
  },
  Gurmukhi: {
    end: 0x0a7f,
    name: "グルムキー文字",
    start: 0x0a00,
  },
  HalfwidthAndFullwidthForms: {
    end: 0xffef,
    name: "半角と全角の形式",
    start: 0xff00,
  },
  HangulCompatibilityJamo: {
    end: 0x318f,
    name: "ハングル互換字母",
    start: 0x3130,
  },
  HangulJamo: {
    end: 0x11ff,
    name: "ハングル字母",
    start: 0x1100,
  },
  HangulJamoExtendedA: {
    end: 0xa97f,
    name: "ハングル互換字母補助-A",
    start: 0xa960,
  },
  HangulJamoExtendedB: {
    end: 0xd7ff,
    name: "ハングル互換字母補助-B",
    start: 0xd7b0,
  },
  HangulSyllables: {
    end: 0xd7af,
    name: "ハングル音節",
    start: 0xac00,
  },
  Hanunoo: {
    end: 0x173f,
    name: "ハヌノオ文字",
    start: 0x1720,
  },
  Hebrew: {
    end: 0x05ff,
    name: "ヘブライ文字",
    start: 0x0590,
  },
  HighPrivateUseSurrogates: {
    end: 0xdbff,
    name: "高位私用サロゲート",
    start: 0xdb80,
  },
  HighSurrogates: {
    end: 0xdb7f,
    name: "高位サロゲート",
    start: 0xd800,
  },
  Hiragana: {
    end: 0x309f,
    name: "ひらがな",
    start: 0x3040,
  },
  "IPA Extensions": {
    end: 0x02af,
    name: "国際音声記号拡張",
    start: 0x0250,
  },
  IdeographicDescriptionCharacters: {
    end: 0x2fff,
    name: "表意文字記述文字",
    start: 0x2ff0,
  },
  Javanese: {
    end: 0xa9df,
    name: "ジャワ文字",
    start: 0xa980,
  },
  Kanbun: {
    end: 0x319f,
    name: "漢文用字",
    start: 0x3190,
  },
  KangxiRadicals: {
    end: 0x2fdf,
    name: "康煕部首",
    start: 0x2f00,
  },
  Kannada: {
    end: 0x0cff,
    name: "カンナダ文字",
    start: 0x0c80,
  },
  Katakana: {
    end: 0x30ff,
    name: "カタカナ",
    start: 0x30a0,
  },
  KatakanaPhoneticExtensions: {
    end: 0x31ff,
    name: "カタカナ音声拡張",
    start: 0x31f0,
  },
  KayahLi: {
    end: 0xa92f,
    name: "カヤフ・リー文字",
    start: 0xa900,
  },
  Khmer: {
    end: 0x17ff,
    name: "クメール文字",
    start: 0x1780,
  },
  KhmerSymbols: {
    end: 0x19ff,
    name: "クメール記号",
    start: 0x19e0,
  },
  Lao: {
    end: 0x0eff,
    name: "ラオ文字",
    start: 0x0e80,
  },
  "Latin Extended-A": {
    end: 0x017f,
    name: "ラテン拡張-A",
    start: 0x0100,
  },
  "Latin Extended-B": {
    end: 0x024f,
    name: "ラテン拡張-B",
    start: 0x0180,
  },
  "Latin-1 Supplement": {
    end: 0x00ff,
    name: "ラテン-1補助",
    start: 0x0080,
  },
  LatinExtendedAdditional: {
    end: 0x1eff,
    name: "追加ラテン拡張",
    start: 0x1e00,
  },
  LatinExtendedC: {
    end: 0x2c7f,
    name: "拡張ラテン-C",
    start: 0x2c60,
  },
  LatinExtendedD: {
    end: 0xa7ff,
    name: "拡張ラテン-D",
    start: 0xa720,
  },
  LatinExtendedE: {
    end: 0xab6f,
    name: "拡張ラテン-E",
    start: 0xab30,
  },
  Lepcha: {
    end: 0x1c4f,
    name: "レプチャ文字",
    start: 0x1c00,
  },
  LetterlikeSymbols: {
    end: 0x214f,
    name: "文字のような記号",
    start: 0x2100,
  },
  Limbu: {
    end: 0x194f,
    name: "リンブ文字",
    start: 0x1900,
  },
  Lisu: {
    end: 0xa4ff,
    name: "リス文字",
    start: 0xa4d0,
  },
  LowSurrogates: {
    end: 0xdfff,
    name: "低位サロゲート",
    start: 0xdc00,
  },
  Malayalam: {
    end: 0x0d7f,
    name: "マラヤーラム文字",
    start: 0x0d00,
  },
  MathematicalOperators: {
    end: 0x22ff,
    name: "数学記号",
    start: 0x2200,
  },
  MeeteiMayek: {
    end: 0xabff,
    name: "メーティ・マヤック",
    start: 0xabc0,
  },
  MeeteiMayekExtensions: {
    end: 0xaaff,
    name: "メーティ・マヤック拡張",
    start: 0xaae0,
  },
  MiscellaneousMathematicalSymbolsA: {
    end: 0x27ef,
    name: "その他の数学記号-A",
    start: 0x27c0,
  },
  MiscellaneousMathematicalSymbolsB: {
    end: 0x29ff,
    name: "その他の数学記号-B",
    start: 0x2980,
  },
  MiscellaneousSymbols: {
    end: 0x26ff,
    name: "その他の記号",
    start: 0x2600,
  },
  MiscellaneousSymbolsAndArrows: {
    end: 0x2bff,
    name: "その他の記号と矢印",
    start: 0x2b00,
  },
  MiscellaneousTechnical: {
    end: 0x23ff,
    name: "その他の技術記号",
    start: 0x2300,
  },
  ModifierToneLetters: {
    end: 0xa71f,
    name: "声調修飾文字",
    start: 0xa700,
  },
  Mongolian: {
    end: 0x18af,
    name: "モンゴル文字",
    start: 0x1800,
  },
  Myanmar: {
    end: 0x109f,
    name: "ミャンマー文字",
    start: 0x1000,
  },
  MyanmarExtendedA: {
    end: 0xaa7f,
    name: "ミャンマー文字拡張-A",
    start: 0xaa60,
  },
  MyanmarExtendedB: {
    end: 0xa9ff,
    name: "ミャンマー文字拡張-B",
    start: 0xa9e0,
  },
  NewTaiLue: {
    end: 0x19df,
    name: "新タイ・レ文字",
    start: 0x1980,
  },
  NumberForms: {
    end: 0x218f,
    name: "数値記号",
    start: 0x2150,
  },
  Ogham: {
    end: 0x169f,
    name: "オガム文字",
    start: 0x1680,
  },
  OlChiki: {
    end: 0x1c7f,
    name: "オル・チキ文字",
    start: 0x1c50,
  },
  OpticalCharacterRecognition: {
    end: 0x245f,
    name: "光学文字認識",
    start: 0x2440,
  },
  Oriya: {
    end: 0x0b7f,
    name: "オリヤー文字",
    start: 0x0b00,
  },
  PhagsPa: {
    end: 0xa87f,
    name: "パスパ文字",
    start: 0xa840,
  },
  PhoneticExtensions: {
    end: 0x1d7f,
    name: "音声拡張",
    start: 0x1d00,
  },
  PhoneticExtensionsSupplement: {
    end: 0x1dbf,
    name: "音声拡張補助",
    start: 0x1d80,
  },
  PrivateUseArea: {
    end: 0xf8ff,
    name: "私用領域",
    start: 0xe000,
  },
  Rejang: {
    end: 0xa95f,
    name: "レジャン文字",
    start: 0xa930,
  },
  Runic: {
    end: 0x16ff,
    name: "ルーン文字",
    start: 0x16a0,
  },
  Saurashtra: {
    end: 0xa8df,
    name: "サウラーシュトラ文字",
    start: 0xa880,
  },
  Sinhala: {
    end: 0x0dff,
    name: "シンハラ文字",
    start: 0x0d80,
  },
  SmallFormVariants: {
    end: 0xfe6f,
    name: "小形式のバリアント",
    start: 0xfe50,
  },
  "Spacing Modifier Letters": {
    end: 0x02ff,
    name: "修飾記号付き文字",
    start: 0x02b0,
  },
  Specials: {
    end: 0xffff,
    name: "特殊",
    start: 0xfff0,
  },
  Sundanese: {
    end: 0x1bbf,
    name: "スンダ文字",
    start: 0x1b80,
  },
  SundaneseSupplement: {
    end: 0x1ccf,
    name: "スンダ文字補助",
    start: 0x1cc0,
  },
  SuperscriptsAndSubscripts: {
    end: 0x209f,
    name: "上付き・下付き文字",
    start: 0x2070,
  },
  SupplementalArrowsA: {
    end: 0x27ff,
    name: "補助矢印-A",
    start: 0x27f0,
  },
  SupplementalArrowsB: {
    end: 0x297f,
    name: "補助矢印-B",
    start: 0x2900,
  },
  SupplementalMathematicalOperators: {
    end: 0x2aff,
    name: "補助数学演算子",
    start: 0x2a00,
  },
  SupplementalPunctuation: {
    end: 0x2e7f,
    name: "補助句読点",
    start: 0x2e00,
  },
  SylotiNagri: {
    end: 0xa82f,
    name: "シロティ・ナグリ文字",
    start: 0xa800,
  },
  Syriac: {
    end: 0x074f,

    name: "シリア文字",

    start: 0x0700,
  },
  Tagalog: {
    end: 0x171f,
    name: "タガログ文字",
    start: 0x1700,
  },
  Tagbanwa: {
    end: 0x177f,
    name: "タグバヌア文字",
    start: 0x1760,
  },
  TaiLe: {
    end: 0x197f,
    name: "タイ・レ文字",
    start: 0x1950,
  },
  TaiTham: {
    end: 0x1aaf,
    name: "タイ・タム文字",
    start: 0x1a20,
  },
  TaiViet: {
    end: 0xaadf,
    name: "タイ・ヴェト文字",
    start: 0xaa80,
  },
  Tamil: {
    end: 0x0bff,
    name: "タミル文字",
    start: 0x0b80,
  },
  Telugu: {
    end: 0x0c7f,
    name: "テルグ文字",
    start: 0x0c00,
  },
  Thaana: {
    end: 0x07bf,
    name: "ターナ文字",
    start: 0x0780,
  },
  Thai: {
    end: 0x0e7f,
    name: "タイ文字",
    start: 0x0e00,
  },
  Tibetan: {
    end: 0x0fff,
    name: "チベット文字",
    start: 0x0f00,
  },
  Tifinagh: {
    end: 0x2d7f,
    name: "ティフナグ文字",
    start: 0x2d30,
  },
  UnifiedCanadianAboriginalSyllabics: {
    end: 0x167f,
    name: "カナダ先住民音節文字",
    start: 0x1400,
  },
  UnifiedCanadianAboriginalSyllabicsExtended: {
    end: 0x18ff,
    name: "カナダ先住民音節文字拡張",
    start: 0x18b0,
  },
  Vai: {
    end: 0xa63f,
    name: "ヴァイ文字",
    start: 0xa500,
  },
  VariationSelectors: {
    end: 0xfe0f,
    name: "変異セレクタ",
    start: 0xfe00,
  },
  VedicExtensions: {
    end: 0x1cff,
    name: "ヴェーダ拡張",
    start: 0x1cd0,
  },
  VerticalForms: {
    end: 0xfe1f,
    name: "縦書き形式",
    start: 0xfe10,
  },
  YiRadicals: {
    end: 0xa4cf,
    name: "イ文字部首",
    start: 0xa490,
  },
  YiSyllables: {
    end: 0xa48f,
    name: "イ文字音節",
    start: 0xa000,
  },
  YijingHexagramSymbols: {
    end: 0x4dff,
    name: "易経六十四卦符号",
    start: 0x4dc0,
  },
};

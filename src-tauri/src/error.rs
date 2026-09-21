use serde::{Serialize, Serializer};

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("フォントを読み取れませんでした: {0}")]
    Font(String),

    #[error("ファイル操作に失敗しました: {0}")]
    Io(String),

    #[error("指定されたフォントが見つかりません")]
    FaceNotFound,
}

impl Serialize for AppError {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_str(&self.to_string())
    }
}

impl From<std::io::Error> for AppError {
    fn from(value: std::io::Error) -> Self {
        Self::Io(value.to_string())
    }
}

pub type AppResult<T> = Result<T, AppError>;

use tauri::http::{Request, Response};
use tauri::{Manager, UriSchemeContext, UriSchemeResponder};

use crate::state::AppState;

pub const SCHEME: &str = "fontface";

// 数十 MB の face を返すことがあるのでメインスレッドを塞がない
pub fn handle<R: tauri::Runtime>(
    ctx: UriSchemeContext<'_, R>,
    request: Request<Vec<u8>>,
    responder: UriSchemeResponder,
) {
    let app = ctx.app_handle().clone();
    let face_id = request.uri().path().trim_start_matches('/').to_string();

    std::thread::spawn(move || {
        let response = match app.state::<AppState>().sfnt_bytes(&face_id) {
            Ok(body) => Response::builder()
                .status(200)
                .header("Content-Type", "font/ttf")
                .header("Cache-Control", "public, max-age=31536000, immutable")
                .header("Access-Control-Allow-Origin", "*")
                .body(body),
            Err(err) => Response::builder()
                .status(404)
                .header("Content-Type", "text/plain; charset=utf-8")
                .body(err.to_string().into_bytes()),
        };
        if let Ok(response) = response {
            responder.respond(response);
        }
    });
}

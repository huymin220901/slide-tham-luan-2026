# Hướng dẫn trình chiếu và chỉnh sửa

## Trình chiếu
Mở `index.html` bằng Chrome, Edge hoặc Safari. Máy cần có mạng để tải font chữ.

| Phím | Tác dụng |
|---|---|
| → · Space · PageDown · bấm chuột | Slide sau |
| ← · PageUp | Slide trước |
| F | Bật/tắt toàn màn hình |
| R | Chạy lại hiệu ứng của slide đang mở |
| Home · End | Về slide đầu · tới slide cuối |

Bút trình chiếu (presenter) dùng được luôn vì nó gửi phím PageUp/PageDown.
Mở link hoặc tải lại trang luôn bắt đầu từ slide 1. Muốn nhảy nhanh tới slide cuối, bấm End.

## Các file

```
index.html                 ← NỘI DUNG 18 slide (sửa chữ ở đây)
style.css                  ← màu, font, kiểu thẻ, kiểu hiệu ứng
deck.js                    ← điều khiển + chữ chân trang, logo
assets/                    ← ảnh xuất từ Figma
figma-assets.json          ← bảng ghép ảnh ↔ lớp Figma
cap-nhat-anh-tu-figma.py   ← lệnh tải lại ảnh từ Figma
```

## Sửa chữ
1. Mở `index.html` bằng trình soạn thảo, ví dụ VS Code. TextEdit cũng được, nhưng phải để ở chế độ văn bản thuần.
2. Mỗi slide bắt đầu bằng một dòng chú thích, ví dụ `<!-- 06 · BA YÊU CẦU MỚI -->`.
3. Sửa chữ nằm giữa các thẻ, ví dụ `<div class="h">…</div>`. Muốn xuống dòng thì dùng `<br>`.
4. Lưu file rồi tải lại trang (Cmd+R hoặc F5).

Chữ chân trang và chữ logo dùng chung cho mọi slide. Bạn sửa chúng ở đầu file `deck.js` (`FOOTER_TEXT`, `LOGO_LINE1`, `LOGO_LINE2`). Số trang tự đánh.

## Sửa hiệu ứng
Mỗi phần tử có hiệu ứng mang thuộc tính `data-a="…"`:

| Giá trị | Hiệu ứng |
|---|---|
| `up` / `down` | Trồi lên / rơi xuống |
| `left` / `right` | Trượt vào từ trái / phải |
| `zoom` | Phóng nhẹ từ nhỏ ra |
| `pop` | Bật ra (nảy) |
| `fade` | Hiện mờ dần |
| `wipe` | Quét từ trái sang phải |
| `drop` | Hạ xuống, thu nhỏ vào vị trí |

- Mặc định các phần tử hiện lần lượt theo thứ tự trong file.
- Muốn đặt thời điểm cụ thể, thêm `data-d="1.2"` (tính bằng giây, kể từ lúc vào slide).
- Bỏ hẳn hiệu ứng: xóa `data-a="…"`.
- Hiệu ứng nền chạy liên tục có thể thêm vào `class`: `kb` (ảnh phóng chậm), `breathe` (hào quang thở), `float` (lơ lửng), `spin` (xoay chậm).

## Đổi ảnh
**Cách 1, sửa trong Figma rồi tải lại:**
1. Đổi ảnh trong Figma, giữ nguyên lớp đó (không xóa rồi tạo lại).
2. Tạo token tại Figma → Settings → Security → Personal access tokens.
3. Chạy trong Terminal, tại thư mục này:
   ```bash
   export FIGMA_TOKEN="token-cua-ban"
   python3 cap-nhat-anh-tu-figma.py
   ```
   Muốn tải lại chỉ vài ảnh thì ghi tên file sau lệnh, ví dụ `python3 cap-nhat-anh-tu-figma.py photo8a.jpg`.

**Cách 2, thay trực tiếp:** chép ảnh mới vào `assets/` với **đúng tên cũ** (xem bảng trong `figma-assets.json`).
Ảnh nền và ảnh chiến sĩ dùng định dạng `.avif` cho nhẹ. Nếu ảnh mới là JPG/PNG, chuyển sang AVIF bằng lệnh (thay tên file cho đúng):
```bash
sips -s format avif -s formatOptions 60 anh-moi.jpg --out assets/nenA.avif
```

**Ảnh chân dung slide 2:** khung đang để trống. Chèn ảnh bằng cách thay khối có `portrait-photo` trong `index.html` bằng:
```html
<img class="el" src="assets/chan-dung.jpg" alt="" style="left:14px;top:14px;width:432px;height:572px;object-fit:cover;border-radius:216px 216px 0 0">
```

## Thêm slide
Chép nguyên một khối `<section class="slide" …> … </section>` có bố cục giống slide bạn cần, dán vào chỗ muốn chèn, rồi sửa chữ. Số trang và thanh tiến trình tự cập nhật. Thanh tiến trình đổi bằng `data-prog="I"` … `"V"`, hoặc `"mo-dau"` cho phần mở đầu.

Khung thiết kế là 1920×1080, giống frame trong Figma. Vị trí `left`/`top` (px) lấy đúng theo tọa độ Figma.

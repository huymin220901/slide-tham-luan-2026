# Bàn giao dự án cho agent: Slide tham luận 2026

> File này dành cho AI agent (Claude, Codex, Cursor…) tiếp tục chỉnh sửa dự án.
> Người dùng là người Việt: trả lời bằng tiếng Việt, giữ nguyên chữ tiếng Việt có dấu trong slide.
> Hướng dẫn cho người dùng cuối nằm trong `README.md`.

## 1. Dự án là gì

Bản trình chiếu HTML 18 slide có hiệu ứng, dựng lại từ thiết kế Figma, dùng cho tham luận
"Giải pháp nâng cao chất lượng huấn luyện, diễn tập sát thực tế tác chiến"
(Đoàn Cảnh sát đặc nhiệm số 1, Hội nghị tổng kết công tác 2026).

- **Link trình chiếu (GitHub Pages):** https://huymin220901.github.io/slide-tham-luan-2026/
- **Repo:** https://github.com/huymin220901/slide-tham-luan-2026 (công khai, nhánh `main`; Pages build từ thư mục gốc `main`)
- **Bản cũ trên claude.ai:** https://claude.ai/artifact/QMXAL9tR6aEB6eikmR6SoU. Bản này **không** tự đồng bộ với repo; nếu cần cập nhật thì phải đăng lại thủ công.
- **Nguồn thiết kế:** Figma file key `19K1M6yfGbXw8zi2aVo7KR`, trang `Animation`, section `133:11906` ("Bản B · Nhiều hình ảnh").

**Nguyên tắc đã thống nhất với người dùng ("kết hợp"):**
- Toàn bộ **chữ là chữ thật trong HTML**, sửa trực tiếp trong `index.html`.
- **Ảnh, nền, hình trang trí** lấy từ Figma (`assets/`), tải lại bằng `cap-nhat-anh-tu-figma.py`.
- Giữ bố cục sát thiết kế Figma: khung 1920×1080, tọa độ `left/top` (px) lấy theo Figma.

## 2. Cấu trúc file

```
index.html                 Nội dung 18 slide (mỗi slide là 1 <section class="slide">), CSS riêng vài slide trong <style> đầu file
style.css                  Token màu, font, component (thẻ, băng vàng, ô lưới…), keyframes hiệu ứng, loader, thanh tiến trình
deck.js                    Điều khiển: dựng logo/chân trang/thanh tiến trình, icon SVG, co giãn, chuyển slide, tải trước ảnh
assets/                    Ảnh (AVIF cho nền/ảnh chìm/ảnh tách nền; JPG cho ảnh chụp; PNG cho huy hiệu, sao)
figma-assets.json          Bảng ghép tên file ảnh ↔ node Figma (mode render|fill, format, scale)
cap-nhat-anh-tu-figma.py   Tải lại ảnh từ Figma REST API (cần FIGMA_TOKEN), tự chuyển sang AVIF bằng `sips` (macOS)
thumbnail.jpg              Ảnh xem trước link (og:image), chụp slide 1, 1200×675
README.md                  Hướng dẫn cho người dùng (tiếng Việt)
work/                      Thư mục nháp cũ, bị .gitignore, không dùng
```

Không có build step, không dependency. Chỉ là file tĩnh. Font lấy từ Google Fonts: Be Vietnam Pro, Montserrat, Playfair Display, Tinos (dự phòng cho Times New Roman).

## 3. Kiến trúc

### Sân khấu và co giãn
- `#stage` là khung 1920×1080 `position:fixed`, căn giữa bằng `translate(-50%,-50%) scale(s)`.
  Trong đó `s = min(clientWidth/1920, clientHeight/1080)`, tính trong hàm `fit()` của `deck.js`.
- Mọi phần tử trong slide dùng `class="el"` (position:absolute) với `left/top/width` tính bằng px của khung 1920×1080.
- `html{text-size-adjust:100%}` và `#stage{position:fixed}` là **bắt buộc**: thiếu hai dòng này, điện thoại sẽ tự phóng chữ và làm chữ đè nhau (lỗi đã gặp).

### Slide
```html
<section class="slide" data-chrome="logo footer" data-prog="III">
  <div class="bg" style="background-image:url(assets/nenA.avif)"></div>                  <!-- nền -->
  <div class="bg" style="background-image:url(assets/img_22c.avif);opacity:.16"></div>   <!-- ảnh chìm: opacity đặt ở CSS -->
  <div class="el ptitle" data-a="left">…</div>                                           <!-- nội dung -->
</section>
```
- `data-chrome="logo footer"`: `deck.js` tự chèn logo đơn vị góc phải trên và chân trang (có số trang tự đánh theo thứ tự slide).
  Chữ chân trang và logo là hằng số ở đầu `deck.js` (`FOOTER_TEXT`, `LOGO_LINE1`, `LOGO_LINE2`).
- `data-prog="mo-dau|I|II|III|IV|V"`: thanh tiến trình I–V ở chân trang, dựng bằng HTML/CSS (`.prog`). Dùng `data-prog-top` nếu cần đổi vị trí dọc.
- Slide 1 và 18 không có chrome.
- Mỗi slide có comment dạng `<!-- 06 · BA YÊU CẦU MỚI -->` để tìm nhanh.

### Hiệu ứng
- Phần tử có `data-a="up|down|left|right|zoom|pop|fade|wipe|draw|drop"` sẽ chạy hiệu ứng xuất hiện khi slide được kích hoạt (`.slide.active`).
- Thời điểm: `deck.js` tự rải theo thứ tự DOM (`0.25s + k*0.14s`); `data-d="1.2"` để đặt tay (giây).
- Hiệu ứng nền chạy liên tục: class `kb` (Ken Burns), `breathe`, `float`, `spin`. Băng vàng `.band` có vệt sáng quét qua (`::after`).
- **Bẫy đã gặp:** không gắn `data-a` và một class hiệu ứng liên tục (`float`, `kb`…) **trên cùng một phần tử**. Thuộc tính `animation` sẽ ghi đè nhau và phần tử ẩn mãi (opacity 0). Cách làm đúng là bọc: ngoài `data-a`, trong `float` (xem ảnh chiến sĩ slide 3).
- **Bẫy đã gặp:** `backdrop-filter` không hoạt động nếu nằm trong phần tử đang có animation (cha thành backdrop root). Vì vậy nhãn "KHÔNG PHẢI" ở slide 4 là phần tử riêng (`.chead`), không nằm trong thẻ.
- Chuyển slide: crossfade. Slide cũ giữ class `.leaving` 850ms để nội dung không biến mất đột ngột.
- Tôn trọng `prefers-reduced-motion`.

### Điều khiển (`deck.js`)
- Phím →/Space/PageDown/Enter/↓: sau · ←/PageUp/Backspace/↑: trước · Home/End · F: toàn màn hình · R: chạy lại hiệu ứng.
- Click: 70% bên phải = sau, 30% bên trái = trước. Vuốt trên điện thoại.
- **Luôn bắt đầu từ slide 1** sau khi tải; hash trên URL bị xóa và không ghi số slide vào URL (người dùng yêu cầu).
- Hàm toàn cục `go(n, force)` (n tính từ 0) dùng được trong console để nhảy slide.
- **Tải trước:** `preload()` gom mọi `src` và `url(...)` trong stage, gọi `Image.decode()` cho từng ảnh và chờ `document.fonts.ready`, tối đa 15 giây, rồi ẩn `#loader` và gọi `go(0)`.
- Icon SVG nằm trong object `ICONS` (target, clock, star, shield, doc, group, person, check, vr, flag, clock36, x, tick, arrow, shuffle, shieldPlain, chevL, chevR). Gắn bằng `data-icon="ten"`; SVG được chèn vào đầu phần tử và tô màu theo `currentColor`.

### Chế độ soát bố cục
Thêm `?tinh` vào URL (ví dụ `index.html?tinh=1`): tắt mọi hiệu ứng, hiện ngay toàn bộ nội dung. Dùng khi chụp màn hình để so với Figma.

## 4. Token thiết kế (style.css `:root`)
- Vàng `--gold #f3c653`, kem `--cream #fff8e6`, đỏ chữ `--red #b8121a`, đỏ rượu `--wine #7a0a0f`.
- Gradient kim loại `--g1` (#fff3c4 → #f6d06a → #c99030 → #fbe6a2 → #b07a1e); gradient nhạt `--pale` (#fffbea → #f7dc93).
- Chữ ánh kim: `.t-gold` / `.t-pale` (background-clip:text). Bóng chữ dùng `filter: drop-shadow` qua `.sh-lg` / `.sh-sm`, vì `text-shadow` không hợp với chữ gradient.
- Component: `.ptitle` (tiêu đề trang), `.band` (băng vàng; `.band.mid` = căn giữa, dùng ở slide 6/8/9/10, slide 3 căn trái), `.cell` / `.cell.row` (ô lưới), `.card.cream` / `.card.glass` / `.card.dark` (thẻ), `.toc` (dòng mục lục), `.bul` (gạch đầu dòng sao), `.stars` (dải sao), `.node.gold` / `.node.dark` (nút sơ đồ tròn), `.halo`, `.dots`.

## 5. Bản đồ slide ↔ Figma

| # | Nội dung | Frame Figma |
|---|---|---|
| 01 | Bìa | 133:12208 |
| 02 | Người trình bày (khung chân dung đang trống) | 133:12238 |
| 03 | Đặt vấn đề (ảnh chiến sĩ chào) | 133:11907 |
| 04 | Thông điệp cốt lõi (so sánh 2 thẻ) | 133:11935 |
| 05 | Bố cục tham luận (mục lục I–V) | 133:11963 |
| 06 | Ba yêu cầu mới (3 thẻ kem + huy chương ảnh) | 133:11979 |
| 07 | Câu nhấn (trích dẫn) | 133:11999 |
| 08 | Năm hạn chế (+ 3 ảnh) | 133:12009 |
| 09 | Bảy nhóm giải pháp (7 ô lưới) | 133:12027 |
| 10 | Giải pháp 01 & 02 | 133:12042 |
| 11 | Giải pháp 03 & 04 (sơ đồ 3 vòng) | 133:12052 |
| 12 | Giải pháp 05 (vòng cải tiến) | 133:12074 |
| 13 | Giải pháp 06 (3 khung ảnh) | 133:12101 |
| 14 | Giải pháp 07 (ảnh 2 chiến sĩ) | 133:12114 |
| 15 | Nguyên tắc "Năm lấy" | 133:12132 |
| 16 | Kiến nghị, đề xuất (4 thẻ) | 133:12164 |
| 17 | Quyết tâm thực hiện (ảnh xe + nền đỏ mờ dần) | 133:12175 |
| 18 | Lời cảm ơn | 133:12194 |

Ảnh ↔ node: xem `figma-assets.json`.
- `mode:"render"` xuất nguyên lớp qua `/v1/images`.
- `mode:"fill"` lấy ảnh gốc của lớp (giữ nền trong suốt) qua `/v1/files/{key}/nodes` + `/v1/files/{key}/images`.

## 6. Bẫy khi lấy ảnh từ Figma (quan trọng)
1. **Ảnh xuất bị phẳng nền trắng.** Ảnh xuất qua Figma MCP `download_assets` từ các lớp có image fill / mask thường bị trộn lên nền trắng (mất alpha). Áp dụng cho huy chương, khung ảnh, huy hiệu, thanh tiến trình, ảnh tách nền.
   - Ảnh tách nền (`soldier3`, `soldier14`), huy hiệu, sao: dùng **ảnh gốc của fill** (mode `fill`).
   - Huy chương slide 6: dùng ảnh xuất + `clip-path:circle(73px at 88px 78px)`. Tâm lệch lên 10px vì vùng xuất có cả bóng đổ (0,10). Phần trắng giữa vòng viền và ảnh vẫn còn; người dùng đã thử bỏ rồi yêu cầu quay lại cách này.
   - Khung ảnh slide 13: ảnh xuất + `clip-path:inset(18px round 12px)` + div quầng sáng riêng phía sau.
   - Thanh tiến trình: dựng lại bằng HTML/CSS (không dùng ảnh).
2. **Opacity của chính lớp bị bỏ khi xuất.** Lớp "Ảnh nền · Chìm" có opacity 16% (slide 1 là 22%), nên đặt `opacity:.16` trong HTML.
3. **Slide 17:** "Mask group" xuất ra bị mất mask. Nền đỏ dựng lại bằng `nenB.avif` + `mask-image: linear-gradient(90deg,#000 44%,transparent 64%)`.
4. **AVIF qua `sips`:** ảnh PNG có alpha kích thước lớn có thể bị nén thành ảnh **trong suốt hoàn toàn**. Đã gặp với `soldier14`. Phải thu về ≤1400px (`sips -Z 1400`) trước khi chuyển. Sau khi chuyển, kiểm tra bằng canvas (đếm pixel alpha > 0).
5. Vị trí ảnh xuất: dùng `absoluteRenderBounds` (gồm cả hiệu ứng/bóng) chứ không dùng khung node.

## 7. Triển khai
- Đẩy lên `main` thì GitHub Pages tự build sau khoảng 1–2 phút.
- **Cache:** Pages đặt `max-age=600`. Mỗi lần sửa `style.css` hoặc `deck.js`, **tăng số phiên bản** trong `index.html` (`style.css?v=N`, `deck.js?v=N`; hiện là v=4) để trình duyệt không trộn bản cũ với bản mới.
- Ảnh xem trước link: thẻ `og:*` / `twitter:*` trong `<head>` trỏ tới `thumbnail.jpg` bằng URL tuyệt đối của Pages. Đổi tên miền thì sửa các thẻ này.
- Commit message tiếng Việt, mô tả ngắn thay đổi.

## 8. Cách kiểm tra sau khi sửa
1. Chạy server tĩnh: `python3 -m http.server 8766`, mở `http://127.0.0.1:8766/`.
2. Soát bố cục: `http://127.0.0.1:8766/?tinh=1`, gọi `go(n,true)` trong console, so với ảnh chụp frame Figma.
3. Soát hiệu ứng ở tốc độ thật trên tab đang hiển thị. Tab bị ẩn thì animation và timer chạy chậm hoặc dừng, dễ tưởng là lỗi.
4. Thử khung điện thoại (375×812 và 812×375): `innerWidth` phải bằng chiều rộng màn hình. Nếu lớn hơn nghĩa là có phần tử làm tràn trang.
5. Kiểm tra mọi đường dẫn `assets/...` đều tồn tại.

## 9. Việc còn mở / ghi chú
- Slide 2: khung chân dung đang để trống. Cách chèn ảnh có trong README (thay khối `.portrait-photo`).
- Chữ không đồng bộ từ Figma: sửa chữ trong Figma thì phải sửa tay trong `index.html`.
- `cap-nhat-anh-tu-figma.py` chưa chạy thử với token thật.
- Chưa thử trên máy chiếu và điện thoại thật; mới thử trên trình duyệt desktop và khung giả lập điện thoại.

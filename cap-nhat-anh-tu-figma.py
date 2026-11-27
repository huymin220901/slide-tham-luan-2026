#!/usr/bin/env python3
"""
Cập nhật ảnh của bản trình chiếu từ file Figma.

Dùng khi bạn đã đổi ảnh / nền / huy hiệu trong Figma và muốn bản HTML lấy ảnh mới.
(Chữ KHÔNG lấy từ Figma — chữ sửa trực tiếp trong index.html.)

Cách chạy (trong thư mục chứa file này):
    export FIGMA_TOKEN="token-cua-ban"      # tạo tại Figma > Settings > Security > Personal access tokens
    python3 cap-nhat-anh-tu-figma.py           # cập nhật tất cả
    python3 cap-nhat-anh-tu-figma.py photo8a.jpg soldier3.png   # chỉ cập nhật vài ảnh

Danh sách ảnh ↔ lớp Figma nằm trong figma-assets.json. Muốn thêm ảnh mới:
thêm một dòng vào đó (lấy node id bằng chuột phải lớp > Copy link, phần node-id=133-11934 → "133:11934").
"""
import json, os, sys, urllib.request, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(HERE, 'figma-assets.json'), encoding='utf-8'))
TOKEN = os.environ.get('FIGMA_TOKEN')
if not TOKEN:
    sys.exit('Chưa có FIGMA_TOKEN. Chạy: export FIGMA_TOKEN="token-cua-ban" rồi chạy lại.')
KEY = CFG['fileKey']
API = 'https://api.figma.com/v1'

def get(url):
    req = urllib.request.Request(url, headers={'X-Figma-Token': TOKEN})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()

def save(name, url):
    data = urllib.request.urlopen(url, timeout=300).read()
    with open(os.path.join(HERE, 'assets', name), 'wb') as f:
        f.write(data)
    print(f'  ✓ {name}  ({len(data)//1024} KB)')

only = set(sys.argv[1:])
items = {k: v for k, v in CFG['assets'].items() if not only or k in only}
if not items:
    sys.exit('Không có ảnh nào khớp tên đã nhập.')

# 1) Ảnh xuất nguyên lớp (render): gom theo định dạng + tỉ lệ
groups = {}
for name, a in items.items():
    if a['mode'] == 'render':
        groups.setdefault((a['format'], a['scale']), []).append((name, a['node']))
for (fmt, scale), lst in groups.items():
    ids = ','.join(n for _, n in lst)
    q = urllib.parse.urlencode({'ids': ids, 'format': fmt, 'scale': scale})
    res = json.loads(get(f'{API}/images/{KEY}?{q}'))
    for name, node in lst:
        url = res.get('images', {}).get(node)
        if url: save(name, url)
        else: print(f'  ✗ {name}: không xuất được lớp {node}')

# 2) Ảnh gốc của lớp (giữ nền trong suốt): đọc imageRef rồi tải ảnh gốc
fills = [(n, a['node']) for n, a in items.items() if a['mode'] == 'fill']
if fills:
    ids = ','.join(n for _, n in fills)
    nodes = json.loads(get(f'{API}/files/{KEY}/nodes?ids={urllib.parse.quote(ids)}'))['nodes']
    refs = json.loads(get(f'{API}/files/{KEY}/images'))['meta']['images']
    for name, node in fills:
        doc = (nodes.get(node) or {}).get('document') or {}
        ref = next((f.get('imageRef') for f in doc.get('fills', []) if f.get('type') == 'IMAGE'), None)
        if ref and ref in refs: save(name, refs[ref])
        else: print(f'  ✗ {name}: không tìm thấy ảnh trong lớp {node}')

print('Xong. Mở lại index.html (hoặc tải lại trang) để xem.')

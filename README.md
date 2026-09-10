# Xì Dách Bạn Bè

## Chạy
Mở `index.html` trên trình duyệt.

## Đăng thành link miễn phí
Có thể upload toàn bộ thư mục lên GitHub Pages, Netlify hoặc Vercel.

## Chức năng
- Chủ phòng làm Cái
- Mã phòng 5 ký tự
- Tối đa 10 người
- Chia / rút / dừng
- Tự tính Xì Dách, Xì Bàng, Ngũ Linh, Quắc
- Realtime qua PeerJS
- Điểm ảo, không tiền thật

## Lưu ý
Bản này dùng PeerJS Cloud để thiết lập kết nối ngang hàng. Nếu muốn vận hành ổn định lâu dài, có thể nâng cấp sang Firebase/Supabase + server authoritative.

## Bản sửa kết nối
- Link mời có dạng `?room=ABCDE` và tự điền mã phòng khi bạn bè mở link.
- Thêm kiểm tra lỗi PeerJS, STUN và trạng thái kết nối.
- Khi khách vào phòng, máy chủ gửi xác nhận rồi đồng bộ danh sách người chơi.
- Nên chạy bằng GitHub Pages/HTTPS; không nên mở file `index.html` trực tiếp bằng `file://`.

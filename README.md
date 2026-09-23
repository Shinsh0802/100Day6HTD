3D 旋转相册

基于 HTML + CSS + JavaScript 实现的 3D 环形旋转相册，支持鼠标拖拽、滚轮缩放、自动旋转。





这是一个纯前端实现的 3D 立体相册，

无需后端，打开即可运行，可部署到 GitHub Pages 直接展示。



功能：

• 3D 立体环形图片布局

• 鼠标拖拽旋转视角

• 鼠标滚轮缩放大小

• 自动缓慢旋转

• 点击查看大图







&#x20;使用方法

1\. 将你的图片放入 img 文件夹

2\. 直接打开 index.html 即可预览效果

3\. 可部署到 GitHub Pages 在线展示







&#x20;操作说明

• 鼠标拖拽：旋转相册

• 鼠标滚轮：放大/缩小

• 点击图片：查看大图

• 页面空白处：关闭大图







&#x20;技术栈

• HTML

• CSS3 3D 变换

• JavaScript 原生交互






## Thêm ảnh kỷ niệm

1. Chép ảnh vào thư mục `img/` (JPG, PNG, WebP…; tên và đuôi file phải khớp chính xác).
2. Mở `photos.js`, thêm dòng vào cuối danh sách, trước `];`:

   ```js
   'img/photo11.jpg',
   { src: 'img/di-choi.jpg', caption: 'Một ngày bên em' },
   ```

3. Lưu và tải lại trang. Nếu xuất bản, đưa cả ảnh mới và `photos.js` lên hosting.

Số ảnh và góc xoay tự cập nhật. Mỗi nhóm có tối đa 10 ảnh; nút Trước/Tiếp xuất hiện khi có nhiều nhóm. Ảnh không có chú thích sẽ dùng “Kỷ niệm N”. Đổi thứ tự dòng để đổi thứ tự ảnh; xóa dòng để bỏ ảnh khỏi album. Trang tĩnh không tự quét thư mục, nên cần thêm tên ảnh vào danh sách.
# 100Day6HTD

# Thư viện model 3D

## Đọc STL trực tiếp

Ứng dụng hỗ trợ STL ASCII và binary. Cấu hình giống GLB, chỉ thay `file`
bằng đường dẫn `.stl`. Ví dụ đang được chọn trong `catalog.json`:

```json
{
  "active": "cylinder-head",
  "models": [{
    "id": "cylinder-head",
    "name": "Cylinder Head Assembly",
    "file": "Cylinder Head Assembly/0 Cylinder head Assembly.stl"
  }]
}
```

Viewer tự căn giữa và chuẩn hóa kích thước hiển thị, không thay đổi file gốc.
STL được đọc thành một mesh: có thể xoay, zoom, chọn, ẩn, X-ray và reset.
Không sử dụng dữ liệu linh kiện demo cho STL. Nút exploded view bị vô hiệu hóa
vì một file STL không chứa cây linh kiện. Hiện chọn một file mỗi lần; để xem
file linh kiện khác, thêm mục vào danh mục rồi đổi `active` và refresh.
Ghép nhiều STL thành cụm có cấu hình linh kiện riêng chưa được triển khai.

Đặt model trong `files/`, mỗi model một thư mục:

```text
models/
├── catalog.json
└── files/
    ├── diesel-engine/
    │   └── engine.glb
    └── generator/
        ├── scene.gltf
        ├── scene.bin
        └── textures/
```

Ưu tiên GLB vì có thể chứa geometry và texture trong một file. Với glTF,
giữ nguyên đường dẫn tương đối đến `.bin` và textures.

## Thêm và chọn model

1. Tạo thư mục `models/files/diesel-engine/` rồi chép `engine.glb` vào.
2. Sửa `models/catalog.json`:

```json
{
  "active": "diesel-engine",
  "models": [
    {
      "id": "diesel-engine",
      "name": "Diesel engine",
      "file": "diesel-engine/engine.glb"
    }
  ]
}
```

3. Refresh trang web. File và cấu hình được đọc trực tiếp, không cần rebuild.
   Lần đầu nâng cấp tính năng này cần `docker compose up --build -d`.

Đổi `active` sang ID khác để chọn model. Đặt `active` thành `null` để dùng
mô hình minh họa (hoặc model S3 nếu đã cấu hình `ENGINE_MODEL_KEY`).
Đổi `name` để quản lý tên trong danh mục. Xóa mục khỏi danh mục trước khi
xóa file; nếu đó là model đang chọn, đổi `active` trước.

`GET /api/v1/models` trả danh sách cùng trạng thái file có tồn tại hay không.
Các file trong `files/` được phục vụ qua `/api/v1/model-files/` cho trình duyệt;
không đặt tài liệu riêng tư hay credentials trong đó. Chỉ GLB/glTF, BIN và các
định dạng texture được phép tải. Không đi theo symlink ra ngoài thư mục.

Các binary model không được đưa vào Git mặc định. Sao lưu `models/` riêng.
Model nên dùng đơn vị mét, Y-up, tâm gần gốc tọa độ. Các mesh cần tên riêng.
Danh mục linh kiện hiện tại vẫn là dữ liệu demo trong database: cần cập nhật
`modelObjectName` và nội dung tương ứng để chọn/hiển thị thông tin đúng model
thật. Việc thêm file chưa tự tạo bài học hoặc metadata linh kiện. KTX2 chưa
được cấu hình trong viewer.

# Thư viện model 3D

Mỗi model nằm trong một thư mục riêng. Không đặt GLB và metadata trực tiếp ở
`models/`; mọi model production dùng cấu trúc sau:

```text
models/
├── catalog.json
└── library/
    ├── rotating-system/
    │   ├── model.glb
    │   └── components.json
    ├── cylinder-head/
    │   ├── model.glb
    │   └── components.json
    └── generator-common-bed/
        ├── model.glb
        └── components.json
```

`catalog.json` là danh sách model và đặt `active` thành ID model cần hiển thị.
Ví dụ, đổi sang Cylinder Head:

```json
{
  "active": "cylinder-head"
}
```

Refresh trình duyệt sau khi đổi catalogue. Không cần rebuild vì thư mục
`models/` được backend đọc trực tiếp.

## Thêm model GLB

1. Tạo `models/library/<model-id>/` với ID chữ thường và dấu gạch ngang.
2. Đặt GLB tên `model.glb` và tạo `components.json` cạnh nó.
3. Thêm model vào `catalog.json`:

```json
{
  "id": "new-model",
  "name": "New Model",
  "file": "library/new-model/model.glb",
  "components": "library/new-model/components.json"
}
```

4. Đổi `active` thành `new-model` khi muốn hiển thị model đó.

## Quản lý component

`components.json` là menu, nội dung học và mapping từ ứng dụng vào GLB.
`modelObjectName` phải bằng đúng tên object Three.js đọc từ GLB. Với các GLB
mới, tên PascalCase như `ConnectingRod`, `CamShaft` và `FlexibleCoupling` được
giữ nguyên khi tải. Không dùng khoảng trắng, dấu chấm hoặc dấu gạch dưới.

```json
{
  "id": "connecting-rod",
  "name": "Connecting rod",
  "system": "Rotating system",
  "modelObjectName": "ConnectingRod",
  "function": "Transfers piston motion to the crankshaft.",
  "location": "Between piston and crankshaft",
  "maintenance": "Inspect bearings, bolts and alignment."
}
```

Không đổi `modelObjectName` nếu chưa đổi tên object tương ứng trong GLB. Có
thể thay `name`, `system`, nội dung học và màu `color` tự do. Các trường
`position`, `explodeOffset`, `shape`, `size` đang được giữ cho tính năng
exploded view; chúng chưa được cấu hình cho các GLB mới.

Ứng dụng hiện hỗ trợ GLB/glTF và STL. GLB là định dạng nên dùng cho model có
nhiều component vì giữ được mesh riêng, vật liệu và hierarchy.

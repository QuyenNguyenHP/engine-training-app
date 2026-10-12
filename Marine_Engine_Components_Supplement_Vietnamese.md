# Bổ sung nội dung học tập — Các bộ phận động cơ diesel tàu thủy

Tài liệu tiếng Việt dành cho bảng **Thông tin bộ phận (Component Info)** trong hệ thống học động cơ 3D. Mỗi bộ phận gồm **Tổng quan**, **Chức năng chính** và **Nguyên lý hoạt động**.

> **Lưu ý:** Đây là nguyên lý chung của động cơ diesel tàu thủy bốn kỳ, không phải thông số xác nhận cho mô hình cụ thể. Đối chiếu tên chi tiết, đường dầu/khí và kết cấu với bản vẽ và sổ tay động cơ.

## Danh mục

| Nhóm | Số bộ phận |
|---|---:|
| Bộ tăng áp | 5 |
| Hệ thống dầu bôi trơn | 7 |
| Hệ thống chuyển động quay | 25 |
| Cụm nắp xi lanh | 7 |
| Máy phát điện và bệ chung | 6 |
| **Tổng cộng** | **50** |

---

## 1. Bộ tăng áp

### 1.1 Vỏ ổ đỡ (Bearing casing)

**Tổng quan**

Thân giữa của bộ tăng áp, chứa các ổ đỡ trục nối bánh tua-bin và bánh máy nén.

**Chức năng chính**

Đỡ và định vị cụm rô-to; giữ đồng tâm giữa tua-bin và máy nén; bố trí đường dầu bôi trơn và bộ phận làm kín.

**Nguyên lý hoạt động**

Trục chung quay trong các ổ đỡ được bôi trơn nhằm giảm ma sát và tản nhiệt. Kết cấu ổ đỡ và làm kín tùy thiết kế.

### 1.2 Vỏ máy nén (Compressor casing)

**Tổng quan**

Vỏ cố định bao quanh bánh công tác và các đường dẫn khí của máy nén.

**Chức năng chính**

Dẫn hướng luồng khí; thu gom khí nén; hỗ trợ chuyển động năng thành áp năng.

**Nguyên lý hoạt động**

Bánh máy nén tăng năng lượng cho không khí. Bộ khuếch tán và vỏ làm giảm vận tốc để tăng áp suất, sau đó đưa khí tới hệ thống nạp.

### 1.3 Nắp bộ tăng áp (Turbocharger cover)

**Tổng quan**

Nắp bảo vệ hoặc che kín một vị trí trên bộ tăng áp; chức năng cụ thể phụ thuộc vị trí lắp.

**Chức năng chính**

Che chắn chi tiết; hạn chế bụi bẩn hoặc tiếp xúc ngoài ý muốn; hỗ trợ tiếp cận khi bảo dưỡng.

**Nguyên lý hoạt động**

Nắp đứng yên trong khi rô-to quay. Cần xác nhận bản vẽ trước khi khẳng định nắp có chức năng giữ áp suất hoặc làm kín dầu.

### 1.4 Bộ giảm âm khí nạp (Air intake silencer)

**Tổng quan**

Cụm lắp ở cửa hút máy nén để giảm tiếng ồn.

**Chức năng chính**

Giảm tiếng ồn hút khí; dẫn khí vào máy nén; chỉ lọc bụi nếu có phần tử lọc.

**Nguyên lý hoạt động**

Không khí đi qua các khoang hoặc vật liệu hấp thụ âm trước khi vào máy nén. Bộ giảm âm không mặc nhiên là bộ lọc.

### 1.5 Vỏ tua-bin (Turbine casing)

**Tổng quan**

Vỏ phía khí xả của bộ tăng áp.

**Chức năng chính**

Dẫn khí xả đến bánh tua-bin; bao kín dòng khí nóng; dẫn khí ra cửa xả.

**Nguyên lý hoạt động**

Khí xả truyền năng lượng cho bánh tua-bin, làm quay trục chung với máy nén. Vỏ đứng yên và chịu nhiệt độ khí xả.

---

## 2. Hệ thống dầu bôi trơn

### 2.1 Bộ lọc dầu ly tâm (Centrifugal oil filter)

**Tổng quan**

Thiết bị tách cặn bẩn khỏi dầu bằng rô-to quay nhanh.

**Chức năng chính**

Loại bỏ hạt rắn và bùn dầu; bổ trợ lọc chính; giảm mài mòn.

**Nguyên lý hoạt động**

Dầu đi vào rô-to quay; hạt nặng bị đẩy về thành ngoài và tích tụ, dầu sạch thoát ra. Cần xác nhận đường dầu theo sơ đồ.

### 2.2 Bộ lọc tự rửa ngược (Automatic backwash filter)

**Tổng quan**

Bộ lọc có khả năng tự làm sạch phần tử lọc bằng dòng chảy ngược.

**Chức năng chính**

Giữ lại tạp chất; tự làm sạch khi vận hành; duy trì lưu lượng dầu qua các phần tử còn hoạt động.

**Nguyên lý hoạt động**

Khi đến chu kỳ hoặc chênh áp đạt ngưỡng, một phần tử được rửa bằng dòng ngược để đẩy cặn ra đường xả rửa.

### 2.3 Đầu nối bộ lọc dầu bôi trơn (Lubricating oil filter fitting)

**Tổng quan**

Chi tiết kết nối hoặc gá lắp bộ lọc vào mạch dầu.

**Chức năng chính**

Liên kết đường dầu vào/ra; cố định bộ lọc; bảo đảm độ kín.

**Nguyên lý hoạt động**

Dầu có áp suất đi qua các đường nối. Gioăng và mối ghép ngăn rò rỉ; không giả định có van bypass nếu chưa xác minh.

### 2.4 Bơm dầu bôi trơn (Lubricating oil pump)

**Tổng quan**

Bơm tạo dòng tuần hoàn dầu tới các bề mặt cần bôi trơn.

**Chức năng chính**

Cấp dầu cho ổ đỡ; tuần hoàn qua thiết bị lọc/làm mát; hỗ trợ tản nhiệt.

**Nguyên lý hoạt động**

Bơm hút dầu từ cácte hoặc két chứa và đẩy vào mạch. Trở lực tạo áp suất, còn van điều áp hoặc an toàn giới hạn áp suất quá cao.

### 2.5 Đường ống bơm dầu bôi trơn (Lubricating oil pump piping)

**Tổng quan**

Các đường ống hút và đẩy nối bơm với hệ thống dầu.

**Chức năng chính**

Dẫn dầu đến cửa hút; đưa dầu đến thiết bị phía sau; bảo đảm kết nối kín.

**Nguyên lý hoạt động**

Chênh áp do bơm tạo ra làm dầu chuyển động. Thứ tự bơm, lọc, làm mát phải kiểm tra theo sơ đồ thực tế.

### 2.6 Van điều nhiệt dầu bôi trơn (Lubricating oil thermostatic valve)

**Tổng quan**

Van điều chỉnh lượng dầu qua bộ làm mát và nhánh đi tắt theo nhiệt độ.

**Chức năng chính**

Ổn định nhiệt độ dầu; tránh làm mát quá mức lúc khởi động; phân chia lưu lượng.

**Nguyên lý hoạt động**

Phần tử cảm nhiệt thay đổi vị trí van để điều chỉnh tỷ lệ dầu qua két làm mát và đường bypass; van không trực tiếp điều chỉnh áp suất dầu.

### 2.7 Bộ trao đổi nhiệt dạng tấm (Plate heat exchanger)

**Tổng quan**

Thiết bị truyền nhiệt giữa dầu nóng và chất làm mát qua các tấm mỏng.

**Chức năng chính**

Làm mát dầu; giữ hai lưu chất tách biệt; tăng diện tích truyền nhiệt.

**Nguyên lý hoạt động**

Dầu và chất làm mát chảy trong các kênh riêng ở hai mặt tấm; nhiệt truyền qua tấm mà không trộn lẫn hai dòng.

---

## 3. Hệ thống chuyển động quay

### 3.1 Bánh răng dẫn động phụ (Auxiliary driving gear)

**Tổng quan**

Bánh răng truyền chuyển động từ hệ bánh răng động cơ tới cơ cấu phụ.

**Chức năng chính**

Truyền mô-men; tạo tỷ số truyền; đồng bộ chuyển động cơ cấu được dẫn động.

**Nguyên lý hoạt động**

Các răng ăn khớp truyền lực và tốc độ; cần bản vẽ để xác định thiết bị phụ được dẫn động.

### 3.2 Đối trọng cân bằng (Balance weight)

**Tổng quan**

Khối lượng lắp trên bộ phận quay, thường là trục khuỷu, nhằm giảm mất cân bằng.

**Chức năng chính**

Cân bằng khối lượng quay; giảm một phần tải quán tính lên ổ đỡ; hạn chế rung.

**Nguyên lý hoạt động**

Khi quay, đối trọng tạo lực ly tâm bù cho các lực mất cân bằng đã tính toán; không triệt tiêu mọi dạng rung động.

### 3.3 Trục cam (Cam shaft)

**Tổng quan**

Trục mang các vấu cam để điều khiển thời điểm mở van.

**Chức năng chính**

Quy định thời điểm và độ nâng van; phối hợp với vị trí piston; dẫn động cơ cấu định thời khác nếu có.

**Nguyên lý hoạt động**

Ở động cơ bốn kỳ, trục cam quay một vòng trong hai vòng trục khuỷu. Vấu cam đẩy con đội để mở van theo biên dạng thiết kế.

### 3.4 Ổ đỡ trục cam (Cam shaft bearing)

**Tổng quan**

Ổ đỡ định vị và nâng đỡ trục cam.

**Chức năng chính**

Giữ thẳng hàng trục cam; chịu tải cơ cấu van; giảm ma sát quay.

**Nguyên lý hoạt động**

Cổ trục quay trên ổ đỡ; với ổ trượt, màng dầu bôi trơn ngăn tiếp xúc kim loại trực tiếp khi hoạt động bình thường.

### 3.5 Thanh truyền 1 (Connecting rod 1)

**Tổng quan**

Chi tiết nối piston với chốt khuỷu của trục khuỷu.

**Chức năng chính**

Truyền lực từ piston; liên kết chuyển động tịnh tiến và chuyển động quay; chịu tải cháy và quán tính.

**Nguyên lý hoạt động**

Đầu nhỏ quay quanh chốt piston, đầu to quay quanh chốt khuỷu. Lực từ piston tạo mô-men trên trục khuỷu và trục khuỷu cũng dẫn động piston ở các kỳ khác.

### 3.6 Thanh truyền 2 (Connecting rod 2)

**Tổng quan**

Chi tiết nối piston với chốt khuỷu của trục khuỷu.

**Chức năng chính**

Truyền lực từ piston; liên kết chuyển động tịnh tiến và chuyển động quay; chịu tải cháy và quán tính.

**Nguyên lý hoạt động**

Đầu nhỏ quay quanh chốt piston, đầu to quay quanh chốt khuỷu. Lực từ piston tạo mô-men trên trục khuỷu và trục khuỷu cũng dẫn động piston ở các kỳ khác.

### 3.7 Thanh truyền 3 (Connecting rod 3)

**Tổng quan**

Chi tiết nối piston với chốt khuỷu của trục khuỷu.

**Chức năng chính**

Truyền lực từ piston; liên kết chuyển động tịnh tiến và chuyển động quay; chịu tải cháy và quán tính.

**Nguyên lý hoạt động**

Đầu nhỏ quay quanh chốt piston, đầu to quay quanh chốt khuỷu. Lực từ piston tạo mô-men trên trục khuỷu và trục khuỷu cũng dẫn động piston ở các kỳ khác.

### 3.8 Thanh truyền 4 (Connecting rod 4)

**Tổng quan**

Chi tiết nối piston với chốt khuỷu của trục khuỷu.

**Chức năng chính**

Truyền lực từ piston; liên kết chuyển động tịnh tiến và chuyển động quay; chịu tải cháy và quán tính.

**Nguyên lý hoạt động**

Đầu nhỏ quay quanh chốt piston, đầu to quay quanh chốt khuỷu. Lực từ piston tạo mô-men trên trục khuỷu và trục khuỷu cũng dẫn động piston ở các kỳ khác.

### 3.9 Thanh truyền 5 (Connecting rod 5)

**Tổng quan**

Chi tiết nối piston với chốt khuỷu của trục khuỷu.

**Chức năng chính**

Truyền lực từ piston; liên kết chuyển động tịnh tiến và chuyển động quay; chịu tải cháy và quán tính.

**Nguyên lý hoạt động**

Đầu nhỏ quay quanh chốt piston, đầu to quay quanh chốt khuỷu. Lực từ piston tạo mô-men trên trục khuỷu và trục khuỷu cũng dẫn động piston ở các kỳ khác.

### 3.10 Thanh truyền 6 (Connecting rod 6)

**Tổng quan**

Chi tiết nối piston với chốt khuỷu của trục khuỷu.

**Chức năng chính**

Truyền lực từ piston; liên kết chuyển động tịnh tiến và chuyển động quay; chịu tải cháy và quán tính.

**Nguyên lý hoạt động**

Đầu nhỏ quay quanh chốt piston, đầu to quay quanh chốt khuỷu. Lực từ piston tạo mô-men trên trục khuỷu và trục khuỷu cũng dẫn động piston ở các kỳ khác.

### 3.11 Thanh truyền 7 (Connecting rod 7)

**Tổng quan**

Chi tiết nối piston với chốt khuỷu của trục khuỷu.

**Chức năng chính**

Truyền lực từ piston; liên kết chuyển động tịnh tiến và chuyển động quay; chịu tải cháy và quán tính.

**Nguyên lý hoạt động**

Đầu nhỏ quay quanh chốt piston, đầu to quay quanh chốt khuỷu. Lực từ piston tạo mô-men trên trục khuỷu và trục khuỷu cũng dẫn động piston ở các kỳ khác.

### 3.12 Thanh truyền 8 (Connecting rod 8)

**Tổng quan**

Chi tiết nối piston với chốt khuỷu của trục khuỷu.

**Chức năng chính**

Truyền lực từ piston; liên kết chuyển động tịnh tiến và chuyển động quay; chịu tải cháy và quán tính.

**Nguyên lý hoạt động**

Đầu nhỏ quay quanh chốt piston, đầu to quay quanh chốt khuỷu. Lực từ piston tạo mô-men trên trục khuỷu và trục khuỷu cũng dẫn động piston ở các kỳ khác.

### 3.13 Trục khuỷu (Crank shaft)

**Tổng quan**

Trục quay chính nhận lực từ các thanh truyền và cung cấp công suất cơ.

**Chức năng chính**

Biến lực piston thành mô-men; truyền công suất tới máy phát; dẫn động hệ cam và thiết bị phụ nếu có.

**Nguyên lý hoạt động**

Thanh truyền tác dụng lực lên chốt khuỷu lệch tâm, tạo mô-men quay. Ổ đỡ chính truyền tải xuống thân máy; trục chịu uốn và xoắn.

### 3.14 Khớp nối mềm (Flexible coupling)

**Tổng quan**

Bộ phận truyền mô-men giữa trục động cơ và trục máy được dẫn động.

**Chức năng chính**

Truyền mô-men; cho phép sai lệch nhỏ trong giới hạn; thay đổi đặc tính dao động xoắn.

**Nguyên lý hoạt động**

Phần tử đàn hồi biến dạng khi truyền mô-men. Mức giảm chấn tùy kết cấu, không phải khớp mềm nào cũng giảm rung đáng kể.

### 3.15 Bộ giảm dao động đầu trục (Front end damper)

**Tổng quan**

Thiết bị lắp ở đầu trục khuỷu để hạn chế dao động xoắn.

**Chức năng chính**

Giảm dao động xoắn; giảm ứng suất chu kỳ; bảo vệ trục và cơ cấu dẫn động.

**Nguyên lý hoạt động**

Khối quán tính chuyển động tương đối với phần gắn trục; cơ cấu nhớt hoặc giảm chấn khác tiêu tán năng lượng dao động.

### 3.16 Bánh răng trung gian (Idle gear)

**Tổng quan**

Bánh răng nằm giữa các bánh răng trong hệ truyền động.

**Chức năng chính**

Truyền chuyển động và mô-men; nối khoảng cách giữa các trục; thay đổi chiều quay theo số cặp ăn khớp.

**Nguyên lý hoạt động**

Bánh dẫn động quay bánh trung gian, rồi truyền sang bánh kế tiếp. Bánh trung gian đơn không làm thay đổi độ lớn tỷ số truyền tổng thể.

### 3.17 Ổ đỡ chính trục khuỷu (Main bearing)

**Tổng quan**

Ổ đỡ nâng đỡ cổ trục chính của trục khuỷu, khác ổ đầu to thanh truyền.

**Chức năng chính**

Đỡ và định tâm trục khuỷu; truyền tải trọng vào thân máy; giảm ma sát quay.

**Nguyên lý hoạt động**

Dầu được cấp vào khe hở giữa cổ trục và bạc. Khi quay, màng dầu thủy động hình thành để chịu tải và tản nhiệt; ổ chặn dọc trục có thể là bộ phận riêng.

### 3.18 Piston 1 (Piston 1)

**Tổng quan**

Chi tiết chuyển động tịnh tiến trong sơ mi xi lanh, nối với thanh truyền qua chốt piston.

**Chức năng chính**

Nhận áp suất cháy; thay đổi thể tích xi lanh trong bốn kỳ; cùng xéc-măng làm kín và kiểm soát dầu; truyền nhiệt.

**Nguyên lý hoạt động**

Trong chu trình bốn kỳ, piston đi xuống ở kỳ nạp, đi lên ở kỳ nén, đi xuống ở kỳ sinh công và đi lên ở kỳ xả. Bốn hành trình tương ứng hai vòng trục khuỷu.

### 3.19 Piston 2 (Piston 2)

**Tổng quan**

Chi tiết chuyển động tịnh tiến trong sơ mi xi lanh, nối với thanh truyền qua chốt piston.

**Chức năng chính**

Nhận áp suất cháy; thay đổi thể tích xi lanh trong bốn kỳ; cùng xéc-măng làm kín và kiểm soát dầu; truyền nhiệt.

**Nguyên lý hoạt động**

Trong chu trình bốn kỳ, piston đi xuống ở kỳ nạp, đi lên ở kỳ nén, đi xuống ở kỳ sinh công và đi lên ở kỳ xả. Bốn hành trình tương ứng hai vòng trục khuỷu.

### 3.20 Piston 3 (Piston 3)

**Tổng quan**

Chi tiết chuyển động tịnh tiến trong sơ mi xi lanh, nối với thanh truyền qua chốt piston.

**Chức năng chính**

Nhận áp suất cháy; thay đổi thể tích xi lanh trong bốn kỳ; cùng xéc-măng làm kín và kiểm soát dầu; truyền nhiệt.

**Nguyên lý hoạt động**

Trong chu trình bốn kỳ, piston đi xuống ở kỳ nạp, đi lên ở kỳ nén, đi xuống ở kỳ sinh công và đi lên ở kỳ xả. Bốn hành trình tương ứng hai vòng trục khuỷu.

### 3.21 Piston 4 (Piston 4)

**Tổng quan**

Chi tiết chuyển động tịnh tiến trong sơ mi xi lanh, nối với thanh truyền qua chốt piston.

**Chức năng chính**

Nhận áp suất cháy; thay đổi thể tích xi lanh trong bốn kỳ; cùng xéc-măng làm kín và kiểm soát dầu; truyền nhiệt.

**Nguyên lý hoạt động**

Trong chu trình bốn kỳ, piston đi xuống ở kỳ nạp, đi lên ở kỳ nén, đi xuống ở kỳ sinh công và đi lên ở kỳ xả. Bốn hành trình tương ứng hai vòng trục khuỷu.

### 3.22 Piston 5 (Piston 5)

**Tổng quan**

Chi tiết chuyển động tịnh tiến trong sơ mi xi lanh, nối với thanh truyền qua chốt piston.

**Chức năng chính**

Nhận áp suất cháy; thay đổi thể tích xi lanh trong bốn kỳ; cùng xéc-măng làm kín và kiểm soát dầu; truyền nhiệt.

**Nguyên lý hoạt động**

Trong chu trình bốn kỳ, piston đi xuống ở kỳ nạp, đi lên ở kỳ nén, đi xuống ở kỳ sinh công và đi lên ở kỳ xả. Bốn hành trình tương ứng hai vòng trục khuỷu.

### 3.23 Piston 6 (Piston 6)

**Tổng quan**

Chi tiết chuyển động tịnh tiến trong sơ mi xi lanh, nối với thanh truyền qua chốt piston.

**Chức năng chính**

Nhận áp suất cháy; thay đổi thể tích xi lanh trong bốn kỳ; cùng xéc-măng làm kín và kiểm soát dầu; truyền nhiệt.

**Nguyên lý hoạt động**

Trong chu trình bốn kỳ, piston đi xuống ở kỳ nạp, đi lên ở kỳ nén, đi xuống ở kỳ sinh công và đi lên ở kỳ xả. Bốn hành trình tương ứng hai vòng trục khuỷu.

### 3.24 Piston 7 (Piston 7)

**Tổng quan**

Chi tiết chuyển động tịnh tiến trong sơ mi xi lanh, nối với thanh truyền qua chốt piston.

**Chức năng chính**

Nhận áp suất cháy; thay đổi thể tích xi lanh trong bốn kỳ; cùng xéc-măng làm kín và kiểm soát dầu; truyền nhiệt.

**Nguyên lý hoạt động**

Trong chu trình bốn kỳ, piston đi xuống ở kỳ nạp, đi lên ở kỳ nén, đi xuống ở kỳ sinh công và đi lên ở kỳ xả. Bốn hành trình tương ứng hai vòng trục khuỷu.

### 3.25 Piston 8 (Piston 8)

**Tổng quan**

Chi tiết chuyển động tịnh tiến trong sơ mi xi lanh, nối với thanh truyền qua chốt piston.

**Chức năng chính**

Nhận áp suất cháy; thay đổi thể tích xi lanh trong bốn kỳ; cùng xéc-măng làm kín và kiểm soát dầu; truyền nhiệt.

**Nguyên lý hoạt động**

Trong chu trình bốn kỳ, piston đi xuống ở kỳ nạp, đi lên ở kỳ nén, đi xuống ở kỳ sinh công và đi lên ở kỳ xả. Bốn hành trình tương ứng hai vòng trục khuỷu.

---

## 4. Cụm nắp xi lanh

### 4.1 Nắp đậy nắp máy (Cylinder head cover)

**Tổng quan**

Nắp tháo được bao quanh cơ cấu cò mổ và van phía trên nắp xi lanh.

**Chức năng chính**

Bảo vệ cơ cấu phối khí; giữ dầu bôi trơn; tạo lối tiếp cận bảo dưỡng.

**Nguyên lý hoạt động**

Nắp đứng yên và được làm kín bằng gioăng; không phải chi tiết trực tiếp chịu áp suất cháy như nắp xi lanh.

### 4.2 Nắp xi lanh HFO (Cylinder head HFO)

**Tổng quan**

Cụm nắp xi lanh có nhãn HFO trên mô hình; HFO thường là dầu nhiên liệu nặng.

**Chức năng chính**

Đóng kín phía trên buồng cháy; lắp van và vòi phun; truyền tải trọng và nhiệt vào kết cấu.

**Nguyên lý hoạt động**

Nắp được bắt chặt lên thân máy. Nhiên liệu phun vào khí nén nóng để cháy; các van điều khiển nạp/xả. Cần kiểm tra ý nghĩa nhãn HFO theo bản vẽ.

### 4.3 Sơ mi xi lanh (Cylinder liner)

**Tổng quan**

Ống lót tạo bề mặt làm việc cho piston và xéc-măng.

**Chức năng chính**

Dẫn hướng piston; cùng các chi tiết khác bao kín áp suất cháy; truyền nhiệt.

**Nguyên lý hoạt động**

Piston trượt trong sơ mi trên màng dầu mỏng. Nhiệt truyền qua thành sơ mi tới nước làm mát hoặc kết cấu xung quanh.

### 4.4 Con đội van nạp và xả (Inlet and exhaust tappet)

**Tổng quan**

Chi tiết tiếp xúc cam, truyền chuyển động tới cơ cấu van.

**Chức năng chính**

Bám theo biên dạng cam; truyền chuyển động; hỗ trợ tạo quy luật nâng van.

**Nguyên lý hoạt động**

Vấu cam đẩy con đội và cơ cấu liên kết để mở van; lò xo đưa van về vị trí đóng khi vấu cam đi qua.

### 4.5 Van chỉ thị áp suất xi lanh (Indicator valve)

**Tổng quan**

Van nhỏ dùng để kết nối đường đo áp suất buồng cháy.

**Chức năng chính**

Cho phép lắp thiết bị đo áp suất; cách ly đường đo; hỗ trợ quy trình kiểm tra được phép.

**Nguyên lý hoạt động**

Khi đóng, van cách ly áp suất trong xi lanh. Khi mở đúng quy trình, khí thông tới thiết bị đo hoặc đường xả cho phép; không phải van an toàn thông thường.

### 4.6 Van nạp và van xả (Intake and exhaust valve)

**Tổng quan**

Các van điều khiển khí nạp vào và khí cháy thoát khỏi xi lanh.

**Chức năng chính**

Cho khí mới đi vào; thải khí cháy; làm kín trong kỳ nén và sinh công.

**Nguyên lý hoạt động**

Cơ cấu phối khí mở van theo thời điểm thiết kế; lò xo thường đóng van về đế. Thời điểm mở/đóng có thể có góc sớm, muộn và trùng điệp.

### 4.7 Cò mổ van (Valve rocker arm)

**Tổng quan**

Đòn bẩy quay quanh trục để truyền lực tới thân van hoặc cầu van.

**Chức năng chính**

Truyền và đổi hướng chuyển động; tạo tỷ số đòn bẩy; hỗ trợ chỉnh khe hở nếu thiết kế cho phép.

**Nguyên lý hoạt động**

Chuyển động từ cam làm cò mổ quay, đầu còn lại ấn mở van chống lại lực lò xo; khi lực giảm, lò xo đóng van.

---

## 5. Máy phát điện và bệ chung

### 5.1 Bệ chung động cơ – máy phát (Common bed)

**Tổng quan**

Kết cấu bệ đỡ chung cho động cơ và máy phát.

**Chức năng chính**

Chịu trọng lượng; giữ tương quan căn chỉnh; truyền tải xuống nền móng tàu.

**Nguyên lý hoạt động**

Động cơ và máy phát được bắt trên bệ; độ cứng bệ hạn chế chuyển vị tương đối và truyền tải qua gối đỡ xuống kết cấu tàu.

### 5.2 Vỏ che bánh đà (Flywheel cover)

**Tổng quan**

Vỏ cố định bảo vệ khu vực bánh đà.

**Chức năng chính**

Ngăn tiếp xúc với phần quay; hạn chế vật lạ lọt vào; tạo cửa kiểm tra nếu có.

**Nguyên lý hoạt động**

Bánh đà quay phía trong vỏ trong khi vỏ đứng yên. Vỏ không tích trữ động năng quay; đó là chức năng bánh đà.

### 5.3 Máy phát điện (Generator)

**Tổng quan**

Máy điện biến cơ năng từ động cơ thành điện năng, thường là máy phát đồng bộ.

**Chức năng chính**

Biến công suất trục thành điện; cấp nguồn hệ thống; phối hợp bộ kích từ điều chỉnh điện áp.

**Nguyên lý hoạt động**

Động cơ kéo rô-to quay tạo từ trường biến thiên tương đối với dây quấn stato, cảm ứng điện áp xoay chiều. Tần số phụ thuộc tốc độ và số cực.

### 5.4 Công tắc mức (Level switch)

**Tổng quan**

Thiết bị phát tín hiệu khi chất lỏng đạt mức xác định.

**Chức năng chính**

Phát hiện mức cao/thấp; đưa tín hiệu số về bộ điều khiển; hỗ trợ cảnh báo hoặc liên động.

**Nguyên lý hoạt động**

Phao hoặc cảm biến khác đổi trạng thái khi chất lỏng qua ngưỡng. Cần xác nhận loại chất lỏng và tác động điều khiển thực tế.

### 5.5 Bơm mồi dầu bôi trơn (LO priming pump)

**Tổng quan**

Bơm phụ tạo dòng dầu bôi trơn trước khi động cơ khởi động.

**Chức năng chính**

Bôi trơn trước khởi động; cấp dầu tới ổ đỡ và đường dầu; có thể bôi trơn sau dừng nếu được thiết kế.

**Nguyên lý hoạt động**

Bơm tuần hoàn dầu trước khi đề máy; cảm biến áp suất có thể xác nhận điều kiện cho phép khởi động. Logic vận hành phải đối chiếu tài liệu.

### 5.6 Thiết bị quay trục chậm (Turning device)

**Tổng quan**

Cơ cấu quay động cơ ở tốc độ thấp để kiểm tra hoặc bảo dưỡng.

**Chức năng chính**

Định vị trục khuỷu/piston; quay chậm có kiểm soát; cung cấp tín hiệu liên động khởi động nếu có.

**Nguyên lý hoạt động**

Bộ truyền giảm tốc bằng tay hoặc mô-tơ ăn khớp với vành răng bánh đà để quay trục mà không đốt nhiên liệu; cần khóa khởi động khi thiết bị đang gài.

---

## Ghi chú khi triển khai

- Giữ nguyên tên tiếng Anh trong ngoặc để đối chiếu với nhãn mesh của mô hình 3D.
- Các số 1–8 ở piston và thanh truyền chỉ là nhãn mesh cho đến khi đối chiếu với sơ đồ đánh số xi lanh; không suy ra thứ tự nổ.
- Cần xác minh riêng: Turbocharger cover, Lubricating oil filter fitting, Cylinder head HFO và Level switch.
- “Idle gear” thường được gọi chuẩn là “idler gear”; “LO” là lubricating oil (dầu bôi trơn).
- Các ghi chú này dành cho người biên tập, không cần hiển thị trong bảng thông tin của học viên.

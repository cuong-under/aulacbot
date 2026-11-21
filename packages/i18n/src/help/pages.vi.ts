import type { HelpSlug } from "./index";
import type { HelpDocument } from "./types";

export const helpVi: Record<HelpSlug, HelpDocument> = {
  "run-on-your-computer": {
    title: "Chạy AULACBOT trên máy của bạn",
    summary:
      "Ứng dụng AULACBOT cũng chạy được chính AULACBOT, trên máy Mac, máy PC hoặc máy Linux, cho bạn hoặc một nhóm nhỏ.",
    sections: [
      {
        id: "download",
        heading: "Tải ứng dụng",
        blocks: [
          "[Tải ứng dụng AULACBOT](/download) cho máy Mac, PC hoặc Linux rồi mở lên. Chọn **Trên server của bạn**, bấm **Tiếp tục trên server của tôi**, rồi **Chạy AULACBOT trên máy này**.",
        ],
      },
      {
        id: "how",
        heading: "Nó chạy thế nào",
        blocks: [
          "Nó chạy ngay trong ứng dụng, có sẵn cơ sở dữ liệu riêng, và giữ mọi thứ trong một thư mục trên máy này: `.agentes` trong thư mục người dùng của bạn. Không phải cài gì thêm: không Docker, không phải dựng cơ sở dữ liệu.",
          "Nó khởi động cùng ứng dụng và dừng khi bạn thoát. Thoát thì ứng dụng sẽ hỏi trước, vì không ai dùng được AULACBOT cho tới khi mở lại. Muốn tạm dừng mà không thoát, bấm biểu tượng AULACBOT cạnh đồng hồ rồi chọn **Dừng** trong menu **⋯** của thẻ đó.",
        ],
      },
      {
        id: "who",
        heading: "Dành cho ai",
        blocks: [
          "Bạn hoặc một nhóm nhỏ. Một chiếc Mac mini, một PC để không hoặc một laptop luôn bật là chỗ đặt hợp lý: thiết lập như ở [Giữ nó luôn chạy](#keep-on). Trên máy Mac hay PC, ứng dụng là cách chạy AULACBOT mà không cần Docker.",
          "Với nhóm lớn hơn, xem [Chọn cách cài nào](/help/install-on-a-server#choose). Sau này dữ liệu của bạn chuyển được lên server.",
        ],
      },
      {
        id: "keep-on",
        heading: "Giữ nó luôn chạy",
        blocks: [
          "Trên máy mà người khác cũng dùng, hãy thiết lập một lần. **Giữ nó luôn chạy**, trong **Tùy chọn\u00a0›\u00a0Server**, cho biết còn thiếu gì và mở đúng phần cài đặt:",
          {
            list: [
              "**Mở khi đăng nhập** tự bật sau khi thiết lập.",
              "Trên máy Mac, bật **Đăng nhập tự động** trong **Cài đặt hệ thống\u00a0›\u00a0Người dùng & Nhóm** để ứng dụng mở lại sau khi khởi động máy. FileVault sẽ tắt đăng nhập tự động.",
              "Trên máy Mac, bật **Tự khởi động lại sau khi mất điện** trong **Cài đặt hệ thống\u00a0›\u00a0Năng lượng**.",
              "Máy Mac thức trong lúc server chạy và **Truy cập từ điện thoại và đồng đội** đang bật. Trên Windows và Linux, tắt chế độ ngủ trong phần cài đặt nguồn của hệ thống.",
            ],
          },
        ],
      },
      {
        id: "agents",
        heading: "Agent của bạn cũng làm việc ở đây",
        blocks: [
          "Agent của bạn cũng làm việc trên máy này, trong thư mục riêng của từng agent, có trình duyệt, và có Claude Code hoặc Codex nếu chúng được cài ở đây.",
          "Agent ở đây chạy dưới quyền bạn. **Lệnh** mặc định được bật, và khi bật thì agent của mọi workspace dùng máy này chạm được mọi thứ trên máy, kể cả dữ liệu của server. Tắt chúng trong **Tùy chọn\u00a0›\u00a0Công cụ**. Xem [Agent chạm được những gì](/help/computers#reach).",
        ],
      },
      {
        id: "another-workspace",
        heading: "Cho workspace khác dùng chung",
        blocks: [
          "Workspace của server bạn chạy ở đây tự dùng máy này. Muốn một workspace ở nơi khác cũng dùng được, ví dụ workspace trên AULACBOT Cloud, bấm **Thêm workspace…** ở cuối thẻ đầu tiên trong **Tùy chọn\u00a0›\u00a0Chung**, hoặc **Thêm server…** trong **Tùy chọn\u00a0›\u00a0Server**. Đăng nhập vào workspace đó rồi bấm **Cho phép** khi ứng dụng hỏi.",
          "Mỗi workspace có agent và thư mục riêng trên máy này. **Lệnh** cũng mặc định bật cho workspace đó. Tắt chúng ngay ở bước ứng dụng hỏi trước khi bấm **Cho phép**, hoặc sau đó trong **Tùy chọn\u00a0›\u00a0Công cụ**, nơi mỗi workspace có công tắc riêng và ứng dụng sẽ hỏi trước khi bật lại.",
        ],
      },
      {
        id: "reach",
        heading: "Từ điện thoại và đồng đội",
        blocks: [
          "**Truy cập từ điện thoại và đồng đội** đưa AULACBOT lên Tailscale, một mạng riêng cho các thiết bị của bạn: điện thoại của bạn và những người bạn mời cùng vào, không ai khác chạm được AULACBOT. Tailscale miễn phí: https://tailscale.com/download. Tắt nó thì AULACBOT chỉ chạy trên máy này.",
          "Nếu máy này đã chia sẻ thứ khác trên cổng 443 của Tailscale, AULACBOT lấy cổng 8443 và địa chỉ của nó kết thúc bằng `:8443`.",
        ],
      },
      {
        id: "password",
        heading: "Đăng nhập từ thiết bị khác",
        blocks: [
          "Chủ sở hữu bắt đầu mà không có mật khẩu: ứng dụng tự đăng nhập bạn trên máy này. Muốn đăng nhập từ trình duyệt trên máy khác, thêm mật khẩu trong **Cài đặt\u00a0›\u00a0Tài khoản của bạn**. Cho tới khi làm vậy, **Tùy chọn\u00a0›\u00a0Server** sẽ nhắc, và **Thêm mật khẩu** mở đúng trang đó. Ứng dụng điện thoại kết nối bằng cách quét mã QR dưới **Trên điện thoại**, trong **Tùy chọn\u00a0›\u00a0Server**. Mã QR cần bật **Truy cập từ điện thoại và đồng đội**.",
          "Khi chủ sở hữu xóa tài khoản, trong **Cài đặt\u00a0›\u00a0Tài khoản của bạn**, tài khoản đó mất hẳn sau 7 ngày, và workspace chỉ có họ cũng mất theo. Trước lúc đó, đăng nhập và bấm **Khôi phục tài khoản** để lấy lại. Khi đã mất hẳn, nếu không còn tài khoản nào, ứng dụng mở cửa sổ chào mừng để tạo chủ sở hữu mới. Nếu người khác vẫn còn tài khoản, mỗi người đăng nhập bằng email của mình.",
        ],
      },
      {
        id: "updates",
        heading: "Cập nhật",
        blocks: [
          "Ứng dụng tự tìm bản cập nhật. Khi bật **Tự cài bản cập nhật vào ban đêm**, trong **Tùy chọn\u00a0›\u00a0Cập nhật**, nó cài trong khoảng 3:00 đến 5:00 lúc ứng dụng đang mở. Mặc định bật khi server chạy ở đây. Nếu không, bấm **Cập nhật và mở lại**. Server và mọi agent khởi động lại theo. Cơ sở dữ liệu được sao lưu trước, và nếu bản mới không phản hồi trong 3 phút, ứng dụng tự quay về bản trước cùng dữ liệu của bản đó.",
        ],
      },
      {
        id: "backups",
        heading: "Sao lưu",
        blocks: [
          "Khi bật **Sao lưu mỗi đêm** (ứng dụng 0.8.1 trở lên), trong **Tùy chọn\u00a0›\u00a0Server**, ứng dụng lưu cơ sở dữ liệu, các tệp và `.env` vào `.agentes/backups` trong thư mục người dùng của bạn, mỗi đêm lúc 3:00. Máy đang ngủ thì sẽ sao lưu khi thức. **Sao lưu ngay** làm việc đó ngay lập tức. Mỗi lần sao lưu dừng server trong chốc lát, và hai bản mới nhất được giữ.",
          "**Sao chép tới** còn đặt mỗi bản sao lưu mới vào một thư mục bạn chọn, như ổ USB hay iCloud Drive, nơi hai bản mới nhất được giữ. Chúng chứa khóa của bạn: hãy giữ riêng tư. **Khôi phục…** đưa AULACBOT về một bản sao lưu: tin nhắn, tệp và cài đặt. Nó dừng khoảng một phút, và những gì có trước đó được giữ trong thư mục sao lưu.",
        ],
      },
      {
        id: "uninstall",
        heading: "Bắt đầu lại hoặc gỡ cài đặt",
        blocks: [
          "Mọi thứ AULACBOT giữ trên máy này nằm trong các thư mục ở thư mục người dùng của bạn, không nằm trong ứng dụng. Nên chuyển ứng dụng vào Thùng rác không xóa gì cả, và cũng không dừng AULACBOT nếu nó đang chạy.",
          "Muốn bắt đầu lại, bấm **Xóa dữ liệu và bắt đầu lại…** trong **Tùy chọn\u00a0›\u00a0Server**. Nó dừng AULACBOT ở đây và chuyển mọi thứ sang một thư mục mới trong thư mục người dùng của bạn, tên là `agentes.chat erased` kèm ngày hôm đó, và ở đó cho tới khi bạn xóa. Những gì agent giữ trên máy này, như trình duyệt và phiên đăng nhập, bị xóa khỏi `.agentes-runner`. Workspace của nó mất với mọi người dùng chúng. Rồi cửa sổ chào mừng mở ra, và bạn thiết lập lại với tài khoản chủ sở hữu mới. Tệp của agent, trong `agentes` ở thư mục người dùng của bạn, vẫn nguyên chỗ.",
          "Muốn lấy lại sau này, thoát ứng dụng, dời một thư mục `.agentes` mới hơn ra chỗ khác nếu có, đổi tên thư mục `agentes.chat erased` thành `.agentes`, rồi mở ứng dụng và thiết lập lại trên máy này. Nó khởi động với workspace và chủ sở hữu như cũ. Những gì agent giữ trên máy này không trở lại, nên chúng cần đăng nhập lại.",
          "Muốn gỡ AULACBOT khỏi máy này hoàn toàn:",
          {
            list: [
              "Tắt **Mở khi đăng nhập** trong **Tùy chọn\u00a0›\u00a0Chung**.",
              "Thoát ứng dụng. Đóng cửa sổ là không đủ. Trên máy Mac, bấm biểu tượng trong Dock rồi chọn **Thoát AULACBOT** trong menu AULACBOT ở trên cùng màn hình, hoặc bấm ⌘Q. Trên Windows và Linux, bấm biểu tượng AULACBOT cạnh đồng hồ rồi chọn **Thoát AULACBOT**. Nếu nó hỏi **Thoát AULACBOT?**, bấm **Thoát**.",
              "Xóa ứng dụng. Trên máy Mac, chuyển vào Thùng rác. Trên Windows và Linux, gỡ như mọi ứng dụng khác.",
              "Xóa các thư mục này trong thư mục người dùng của bạn. Chúng giữ dữ liệu của bạn, và đã xóa là không lấy lại được, nên hãy sao lưu ở nơi khác trước nếu bạn có thể cần: `.agentes` (tin nhắn, tệp, tài khoản, cài đặt và bản sao lưu), mọi thư mục `agentes.chat erased`, `.agentes-runner` (những gì agent giữ trên máy này, như trình duyệt và phiên đăng nhập) và `agentes` (tệp của agent). Thư mục có tên bắt đầu bằng dấu chấm là thư mục ẩn. Trên máy Mac, mở thư mục người dùng trong Finder và bấm ⇧⌘. (Shift, Command và phím chấm) để hiện chúng.",
              "Xóa các thư mục riêng của ứng dụng. Chúng chỉ giữ cài đặt, phiên đăng nhập của cửa sổ và nhật ký. Trên máy Mac: mọi thứ có tên bắt đầu bằng `chat.agentes.desktop` trong các thư mục Application Support, Caches, HTTPStorages, Logs, Preferences và WebKit của `~/Library`, và `agentes.chat.plist` trong `~/Library/LaunchAgents`. Trên Windows: `%APPDATA%\\chat.agentes.desktop` và `%LOCALAPPDATA%\\chat.agentes.desktop`. Trên Linux: `~/.config/chat.agentes.desktop` và `~/.local/share/chat.agentes.desktop`. Trên máy Mac, muốn mở một trong các thư mục đó, bấm ⇧⌘G trong Finder rồi gõ đường dẫn, ví dụ `~/Library/Caches`.",
            ],
          },
        ],
      },
      {
        id: "ai-programs",
        heading: "Claude Code và Codex",
        blocks: [
          "Ứng dụng tìm Claude Code và Codex qua `PATH` của shell đăng nhập, cộng các thư mục quen thuộc như `~/.local/bin`, `/opt/homebrew/bin` và `/usr/local/bin`. Nếu **Tùy chọn\u00a0›\u00a0Công cụ** báo **Không tìm thấy**, nó hiện dòng lệnh cài đặt. Chạy dòng đó trong Terminal rồi bấm **Kiểm tra lại**.",
        ],
      },
      {
        id: "moving",
        heading: "Chuyển lên server",
        blocks: [
          {
            list: ["Thoát ứng dụng, rồi kết xuất cơ sở dữ liệu bằng bản server có sẵn trong ứng dụng. Trên máy Mac:"],
          },
          {
            code: "BUN_BE_BUN=1 /Applications/AULACBOT.app/Contents/MacOS/agentes-runner \\\n  ~/.agentes/app/current/server/native.js db dump --data ~/.agentes --out agentes.sql",
          },
          {
            list: [
              "[Cài AULACBOT trên một server](/help/install-on-a-server), nhưng chưa khởi động. Trong `.env` của nó, đặt `AGENTES_SECRET` lấy từ `~/.agentes/.env`, rồi chỉ khởi động cơ sở dữ liệu: `docker compose up -d postgres`.",
              "Nạp bản kết xuất: `docker compose exec -T postgres psql -U agentes -d agentes -v ON_ERROR_STOP=1 < agentes.sql`.",
              "Khởi động bằng `docker compose up -d`, chép `~/.agentes/files` vào như hướng dẫn đầy đủ chỉ, rồi đăng nhập như trước.",
            ],
          },
        ],
      },
    ],
  },
  "workspace-computer": {
    title: "Máy tính của workspace",
    summary: "Mỗi workspace có một máy tính riêng, luôn bật, nơi agent của nó làm việc.",
    sections: [
      {
        id: "what",
        heading: "Đó là gì",
        blocks: [
          "Một máy tính chỉ dành cho workspace này, luôn bật. Mỗi agent có người dùng riêng trên đó, với thư mục, màn hình, trình duyệt và tệp riêng. Từ trang của một agent, bạn xem được nó làm việc và nắm quyền điều khiển khi cần.",
        ],
      },
      {
        id: "own",
        heading: "Máy tính và điện thoại của bạn",
        blocks: [
          "Agent cũng làm việc được trên máy tính và điện thoại bạn mang vào: máy Mac hay PC có ứng dụng AULACBOT, một server, điện thoại Android hoặc iPhone. Xem [Máy tính và điện thoại bạn mang vào](/help/computers).",
        ],
      },
      {
        id: "plans",
        heading: "Gói AI của bạn",
        blocks: [
          "Agent của bạn nghĩ được bằng gói AI của chính bạn, như Claude, ChatGPT, GLM hay Kimi, đã đăng nhập trên máy này: không cần API key. Tài khoản ở lại trên máy này, và AULACBOT không bao giờ thấy mật khẩu hay quyền truy cập.",
          "Gói AI Pro và Ultra của Google không dùng được ở đây: điều khoản của Google không cho dùng trong sản phẩm khác. Còn API key Gemini thì được.",
        ],
      },
      {
        id: "size",
        heading: "Kích thước của nó",
        blocks: ["CPU, bộ nhớ và ổ đĩa hiện trong **Cài đặt\u00a0›\u00a0Thiết bị**."],
      },
      {
        id: "trouble",
        heading: "Nếu nó ngừng phản hồi",
        blocks: ["Thường vài phút là nó trở lại, và chúng tôi đang xử lý: phía bạn không phải làm gì."],
      },
    ],
  },
  computers: {
    title: "Máy tính và điện thoại của bạn",
    summary:
      "Mang một máy Mac, PC, máy Linux, server hay điện thoại vào, và agent của bạn làm việc trên đó. Trên AULACBOT Cloud hay server của chính bạn đều vậy.",
    sections: [
      {
        id: "app",
        heading: "Từ ứng dụng AULACBOT",
        blocks: [
          "Cài ứng dụng trên máy, mở lên và đăng nhập vào workspace của bạn. Nó hỏi **Cho agent của <workspace> dùng máy Mac này?** (máy PC này trên Windows, máy tính này trên Linux). Chọn ai dùng được rồi bấm **Cho phép**. Chỉ vậy thôi.",
          "Đã đăng nhập rồi? Mở **Tùy chọn\u00a0›\u00a0Chung** và bấm **Cho phép** ở dòng của workspace trong thẻ đầu tiên. Không thấy? Bấm **Thêm workspace…** ở cuối thẻ đó rồi đăng nhập.",
        ],
      },
      {
        id: "web",
        heading: "Từ trang web",
        blocks: [
          "Trong **Cài đặt\u00a0›\u00a0Thiết bị**, bấm **Kết nối thiết bị**:",
          {
            list: [
              "**Máy Mac này** hoặc **Máy PC này**: mở ứng dụng, và ứng dụng hỏi bạn trước.",
              "**Máy tính khác**: cài ứng dụng ở đó, đăng nhập bằng chính bạn rồi bấm **Cho phép**. Nó tự hiện ra ở đây.",
              "**Một server hoặc VPS**: chạy một dòng trong terminal của nó, rồi cho nó tham gia. Dòng đó dùng được một lần, trong 10 phút.",
            ],
          },
          "Ứng dụng chỉ kết nối một bấm với địa chỉ có https, ví dụ địa chỉ Tailscale kết thúc bằng `.ts.net`. Với địa chỉ http thường, dùng dòng lệnh trong terminal.",
        ],
      },
      {
        id: "phones",
        heading: "Điện thoại",
        blocks: [
          "Điện thoại Android kết nối qua một máy tính đã kết nối: bằng cáp, hoặc qua Wi-Fi trên Android 14 trở lên với bản vá bảo mật tháng 5 năm 2026. iPhone kết nối qua một máy Mac có ứng dụng và Xcode, ứng dụng lo phần còn lại. Cả hai đều bắt đầu từ **Kết nối thiết bị**.",
        ],
      },
      {
        id: "who",
        heading: "Ai dùng được",
        blocks: [
          "Thiết bị mới là của riêng bạn: **Chỉ mình tôi** nghĩa là bạn và những agent làm việc cho bạn. Mở cho mọi người trong workspace, hoặc cho vài người và vai trò, lúc bạn cho phép hoặc sau đó ở trang của nó trong **Cài đặt\u00a0›\u00a0Thiết bị**.",
        ],
      },
      {
        id: "open",
        heading: "Khi ứng dụng đang mở",
        blocks: [
          "Agent chỉ làm việc trên một máy tính khi ứng dụng đang chạy ở đó và máy đang thức. Khi ứng dụng hỏi, hãy để nguyên **Giữ sẵn sàng: mở AULACBOT khi đăng nhập**. Máy tắt hay đang ngủ hiện **Ngoại tuyến**, và agent chờ nó trở lại.",
        ],
      },
      {
        id: "pausing",
        heading: "Tạm dừng và ngắt kết nối",
        blocks: [
          "Trên máy tính, biểu tượng AULACBOT cạnh đồng hồ tạm dừng agent của mọi workspace, hoặc của riêng một workspace. Trong **Tùy chọn\u00a0›\u00a0Chung**, công tắc của mỗi workspace chỉ tạm dừng workspace đó, và **Rời** trong menu **⋯** của nó ngắt kết nối. Không có gì mới khởi chạy khi đang tạm dừng, và việc đang chạy thì chạy nốt. Ngắt kết nối vẫn giữ thư mục của agent trên đĩa.",
          "Từ trang web, **Gỡ** ở trang của thiết bị sẽ ngắt kết nối nó.",
        ],
      },
      {
        id: "organizations",
        heading: "Nhiều workspace, một máy tính",
        blocks: [
          "Đăng nhập từng workspace trong cùng ứng dụng và bấm **Cho phép** cho từng cái. Workspace trên AULACBOT Cloud và trên server của bạn dùng chung được một máy tính (ứng dụng 0.6.1 trở lên). Mỗi workspace có agent và thư mục riêng ở đó, và ngắt một cái không đụng tới các cái khác.",
          "Server mà ứng dụng chạy trên máy này thì đã kết nối sẵn, không cần gì. Muốn cho workspace ở nơi khác dùng chung máy đó, xem [Cho workspace khác dùng chung](/help/run-on-your-computer#another-workspace).",
          "Chỉ dùng ứng dụng trên laptop như một cửa sổ vào workspace? Khi nó hỏi có cho agent dùng laptop không, **Để sau** giữ nó là cửa sổ thường.",
          "Server kết nối bằng dòng lệnh terminal thì chỉ phục vụ một workspace. Kết nối nó từ workspace khác sẽ chuyển server sang workspace đó, và workspace đầu không còn chạm được nó. Muốn nhiều workspace trên một máy tính, hãy dùng ứng dụng.",
        ],
      },
      {
        id: "line",
        heading: "Khi agent phải xếp hàng",
        blocks: [
          "Mỗi phần việc của agent dùng bộ nhớ của máy. Khi bộ nhớ trống ít, phần tiếp theo xếp hàng chờ phần khác xong. Việc của người được ưu tiên. Số CPU không làm thay đổi điều này.",
          "Máy có 4 GB bộ nhớ chạy hai hoặc ba việc cùng lúc, máy 8 GB khoảng chín. Máy Mac hay PC chạy tới tám. Trình duyệt và màn hình agent giữ mở cũng tốn bộ nhớ. Muốn hàng ngắn hơn, dùng máy nhiều bộ nhớ hơn, hoặc kết nối thêm máy và chia agent giữa chúng trong **Cài đặt\u00a0›\u00a0Thiết bị**. Các workspace dùng chung một máy thì chia sẻ bộ nhớ của máy đó.",
        ],
      },
      {
        id: "folders",
        heading: "Thư mục",
        blocks: [
          "Mỗi agent luôn có thư mục riêng, trong `~/agentes/<workspace>`. Thêm thư mục chỉ làm được trên chính máy tính, không bao giờ từ trang web: trong ứng dụng là **Tùy chọn\u00a0›\u00a0Thư mục**, trên server là `agentes-runner folders allow`. Mỗi workspace tự cho phép thư mục của mình: cái bạn cho workspace này chỉ tính cho agent của nó. Gỡ một thư mục không xóa gì, chỉ thu quyền truy cập.",
        ],
      },
      {
        id: "reach",
        heading: "Agent chạm được những gì",
        blocks: [
          "Agent chạy dưới quyền bạn, người dùng của máy. Công cụ tệp của nó ở trong thư mục của nó, nhưng một lệnh thì đọc được mọi thứ bạn đọc được:",
          {
            list: [
              "tệp và phiên đăng nhập của bạn",
              "thư mục của agent khác, kể cả workspace khác, và phiên đăng nhập trình duyệt của chúng giữ",
              "token kết nối máy tính này",
              "trên máy cũng chạy AULACBOT, cơ sở dữ liệu và khóa của nó trong `.agentes`",
            ],
          },
          "AULACBOT từ chối các lệnh nhắc tới khóa, token và phiên đăng nhập của nó, nhưng đó là quy tắc, không phải bức tường. **Lệnh** mặc định bật. Tắt chúng ngay ở bước ứng dụng hỏi trước khi bấm **Cho phép**, hoặc sau đó trong **Tùy chọn\u00a0›\u00a0Công cụ**, nơi mỗi workspace có công tắc riêng (ứng dụng 0.8.1 trở lên) và ứng dụng hỏi trước khi bật lại. Claude Code và Codex chạy lệnh của riêng chúng trong thư mục của agent, theo quy tắc của chúng, kể cả khi đã tắt Lệnh.",
          "Muốn một bức tường thật, hãy dùng server Linux. Trên Debian 13, cài với `--system`, mỗi agent là một người dùng riêng. Trên Ubuntu, các agent dùng chung một người dùng, `agentes`: chúng thấy thư mục của nhau, không thấy của bạn hay của server. Hoặc cấp cho agent một máy tính riêng.",
        ],
      },
    ],
  },
  import: {
    title: "Mang agent của bạn vào",
    summary:
      "Mang agent từ ứng dụng khác, hoặc từ workspace AULACBOT khác, cùng hướng dẫn, skill, lịch định kỳ và bộ nhớ của chúng.",
    sections: [
      {
        id: "comes",
        heading: "Những gì đi theo",
        blocks: [
          {
            list: [
              "Agent, cùng tên, vai trò, hướng dẫn và diện mạo.",
              "Skill, bật cho những agent đã có chúng.",
              "Kênh công khai, cùng các agent trong đó.",
              "Lịch định kỳ, đang chạy và đúng lịch của nó. Tạm dừng trong **Lịch định kỳ** nếu bạn muốn.",
              "Bộ nhớ: những gì mỗi agent ghi nhớ.",
              "Tệp riêng của từng agent (thư mục tệp của OpenBot.run, một workspace OpenClaw), trong một thư mục mang tên nó ở **Drive**. Khóa, phiên đăng nhập và tệp hệ thống ở lại, và không gì đã có sẵn bị ghi đè.",
            ],
          },
        ],
      },
      {
        id: "never",
        heading: "Những gì không bao giờ đi theo",
        blocks: [
          "Khóa, mật khẩu, phiên đăng nhập và lịch sử trò chuyện không bao giờ đi theo: agent nghĩ bằng AI của workspace. Vài thứ chưa có tương đương ở đây, hoặc không nên đi trong một tệp. Bạn tạo lại sau được.",
          "Tệp và thư mục được đọc ngay trong trình duyệt của bạn. Link GitHub đi qua server của workspace. Tệp khóa và tệp đăng nhập không bao giờ bị mở, và không gì thay đổi cho tới khi bạn xác nhận.",
        ],
      },
      {
        id: "mcp",
        heading: "Kết nối bằng MCP",
        blocks: [
          "MCP cho ứng dụng AI của bạn chạm tới workspace này, để nó tự tạo agent ở đây, cùng hướng dẫn, skill và lịch định kỳ. Chọn ứng dụng của bạn, chọn **Kết nối bằng MCP**, rồi:",
          {
            list: [
              "Kết nối địa chỉ ở bước đó, theo đúng các bước của ứng dụng ấy. [Cách kết nối, từng ứng dụng](/help/apps-de-ia#connect)",
              "Ở trang đăng nhập, chọn **Tạo và sửa agent, lịch định kỳ và skill**.",
              "Dán yêu cầu vào ứng dụng. Agent hiện ra ngay ở bước đó khi chúng tới.",
            ],
          },
          "Khi một ứng dụng không kết nối được, chọn **Từ một tệp** hoặc **Chỉ dùng câu lệnh**, tuỳ bước đó hiện gì. [Từ ứng dụng khác](/help/import#other-apps) nói về yêu cầu đó.",
        ],
      },
      {
        id: "other-apps",
        heading: "Từ ứng dụng khác",
        blocks: [
          "Chọn **Grok Bot**, **ChatGPT dots** hoặc **Ứng dụng khác**. Sao yêu cầu, dán vào ứng dụng đó, rồi mang kết quả về: thả tệp, hoặc dán cả câu trả lời. Mỗi ứng dụng đặt nó ở đâu:",
          {
            list: [
              "**Grok Bot**: trong cuộc trò chuyện với bot của bạn. Nó trả lời bằng JSON: sao cả câu trả lời.",
              "**ChatGPT dots**: trong một cuộc trò chuyện mới. Tải tệp nó tạo ra.",
              "**Claude**: trong một cuộc trò chuyện mới, hoặc trong dự án của agent. Tải tệp nó tạo ra.",
              "**Manus**: trong một tác vụ mới. Tệp nằm trong kết quả của tác vụ.",
              "**Rakazo**: gửi cho agent của bạn. Nó trả lời bằng JSON: sao cả câu trả lời.",
              "**OpenBot**: không cần yêu cầu. Kéo thả thư mục tenant (agents.yaml, agents/, model.yaml, skills.yaml) hoặc dán link GitHub của nó.",
            ],
          },
        ],
      },
      {
        id: "export",
        heading: "Xuất một workspace",
        blocks: [
          "**Cài đặt\u00a0›\u00a0Nhập và xuất\u00a0›\u00a0Xuất** tải về một tệp .json, để mang agent sang workspace khác hoặc giữ một bản. Trong tệp có:",
          {
            list: [
              "Agent, cùng hướng dẫn, model và diện mạo",
              "Skill, cùng toàn bộ SKILL.md",
              "Kênh công khai, cùng agent trong đó",
              "Lịch định kỳ đã hẹn (bên kia nhận ở trạng thái đang chạy)",
              "Bộ nhớ mà mọi người trong workspace thấy được",
            ],
          },
          "Không bao giờ có trong đó:",
          {
            list: [
              "API key và mật khẩu",
              "Trình kết nối và phiên đăng nhập",
              "Máy tính",
              "Cuộc trò chuyện, tin nhắn và kênh riêng",
              "Mức dùng, chi phí và lịch sử hoạt động",
            ],
          },
          "Muốn dùng tệp đó, mở **Cài đặt\u00a0›\u00a0Nhập và xuất** ở workspace kia và thả tệp .json vào.",
        ],
      },
    ],
  },
  wiki: {
    title: "Wiki",
    summary: "Những gì công ty biết, thành các trang liên kết với nhau.",
    sections: [
      {
        id: "links",
        heading: "Liên kết",
        blocks: [
          "Gõ [[ để liên kết sang trang khác. Liên kết ngược và đồ thị cho thấy các trang nối với nhau thế nào.",
        ],
      },
      {
        id: "agents",
        heading: "Agent dùng wiki thế nào",
        blocks: ["Agent đọc wiki khi trả lời. Chúng chỉ viết vào đó khi có người nhờ."],
      },
      {
        id: "obsidian",
        heading: "Mang một vault Obsidian vào",
        blocks: [
          "Thả thư mục của vault, hoặc tệp .zip của nó, vào bước Context của phần thiết lập hoặc vào phần nhập của chính wiki. [[Liên kết]], [[note|alias]] và [[note#section]] vẫn hoạt động. Thẻ lấy từ frontmatter và phần văn bản. Tệp đính kèm vào Drive, và ảnh hay tệp nhúng thành thẻ trên trang. Callout vẫn là callout. Truy vấn Dataview vào dưới dạng văn bản: nhờ một agent dựng bảng. Canvas và cài đặt của Obsidian (.obsidian) ở ngoài.",
        ],
      },
    ],
  },
  memory: {
    title: "Bộ nhớ",
    summary: "Những gì mỗi agent học được từ cuộc trò chuyện và từ chỉnh sửa của nhóm.",
    sections: [
      {
        id: "learns",
        heading: "Agent học thế nào",
        blocks: [
          "Agent học từ cuộc trò chuyện và từ chỉnh sửa của nhóm. Những gì một agent biết sẽ vào ngữ cảnh của nó khi cần. Ở tab **Bộ nhớ** của nó, sửa, ghim hoặc lưu trữ những gì sai hay cũ.",
        ],
      },
      {
        id: "permissions",
        heading: "Bộ nhớ không cấp quyền",
        blocks: [
          "Không gì trong bộ nhớ cho agent làm được nhiều hơn. Những gì nó làm được nằm ở **Công cụ và quyền truy cập**.",
        ],
      },
      {
        id: "proposals",
        heading: "Đề xuất thay đổi",
        blocks: [
          "Khi một bài học lặp lại, agent có thể đề xuất sửa hướng dẫn của chính nó hoặc ngữ cảnh của workspace. Không gì thay đổi cho tới khi có người chấp nhận, và văn bản sửa được trước. Bản trước vẫn nằm trong lịch sử. Đề xuất bị từ chối được giữ làm bài học, nên nó không đề xuất lại.",
        ],
      },
    ],
  },
  approvals: {
    title: "Phê duyệt",
    summary: "Hành động nhạy cảm chờ một người, một lần hoặc luôn luôn.",
    sections: [
      {
        id: "what",
        heading: "Việc gì phải hỏi trước",
        blocks: [
          "Khi agent muốn merge, triển khai, quay lui, gửi thứ gì ra ngoài hoặc xóa dữ liệu, nó hỏi trước. Đó là **Chỉ việc rủi ro**, mức mà mọi agent bắt đầu. Ở trang của agent, dưới **Phê duyệt**, **Luôn hỏi** khiến nó hỏi trước mọi thay đổi, còn **Không bao giờ hỏi** khiến nó không hỏi gì cả, kể cả merge, triển khai, thanh toán và lịch định kỳ. Yêu cầu hiện trong **Phê duyệt** và trong cuộc trò chuyện, cùng hành động chính xác và lý do.",
        ],
      },
      {
        id: "always",
        heading: "Một lần, hay luôn luôn",
        blocks: [
          "Chấp thuận là cho đúng một hành động, với đúng các giá trị của nó. Nếu agent đổi bất cứ thứ gì, nó hỏi lại.",
          "**Luôn cho phép** để agent làm loại hành động đó từ giờ, với mọi giá trị, không hỏi nữa. Với yêu cầu của một lịch định kỳ, **Luôn cho phép trong lịch này** làm điều đó chỉ cho lịch ấy. **Luôn cho phép** có cho mọi loại hành động, kể cả merge và triển khai, khi agent đang ở **Chỉ việc rủi ro**. **Luôn cho phép trong lịch này** không có cho merge, triển khai, quay lui và tương tự. Muốn bỏ, vào **Công cụ và quyền truy cập** ở trang của agent, hoặc vào cài đặt của lịch định kỳ.",
        ],
      },
      {
        id: "who",
        heading: "Ai phê duyệt",
        blocks: [
          {
            list: [
              "Chủ sở hữu agent, cho yêu cầu của nó.",
              "Ai có vai trò **Phê duyệt hành động của agent**, cho mọi agent.",
              "Những người agent chỉ định khi nó hỏi, thay cho chủ sở hữu.",
              "Ai đang thay mặt người khác trong **Ai phê duyệt thay tôi**, cho những gì người đó được hỏi. Merge, triển khai và các hành động rủi ro khác chỉ khi mục đó được bật.",
            ],
          },
          "Một hành động trong hộp thư riêng của ai thì chờ đúng người đó. Quyền truy cập mới cho một agent thì chờ những người quản lý agent.",
          "Lodi, cánh tay phải của bạn, cũng phê duyệt thay bạn được các agent mới do agent khác đề xuất và các thay đổi về model, ngân sách và kênh của một agent, nhưng chỉ với những gì bạn đã nhờ. Ai thay mặt bạn và Lodi phê duyệt gì được chọn trong **Cài đặt\u00a0›\u00a0Bạn\u00a0›\u00a0Phê duyệt**.",
        ],
      },
      {
        id: "refusing",
        heading: "Từ chối",
        blocks: ["Nói lý do nếu bạn muốn: agent đọc lý do, chỉnh kế hoạch và giữ nó làm bài học."],
      },
      {
        id: "meetings",
        heading: "Cuộc họp",
        blocks: ["Agent chỉ đề xuất giờ. Lời mời tới người khác luôn đi qua người đã nhờ."],
      },
    ],
  },
  "who-answers": {
    title: "Ai trả lời một tin nhắn",
    summary: "Có lượt nhắc thì agent đó trả lời. Không có, AULACBOT chọn thay bạn, theo thứ tự này.",
    sections: [
      {
        id: "order",
        heading: "Một tin nhắn tìm ra agent của nó thế nào",
        blocks: [
          "Tin nhắn @nhắc một agent thì tới agent đó. Tin nhắn không nhắc ai sẽ do thứ đầu tiên trong số này mà workspace có đọc:",
          {
            list: [
              "**Jev**, một model nhỏ, nhanh, làm cho những quyết định như thế này.",
              "**Một model nhỏ trên API key của workspace**, như Claude Haiku 5.5 hay GPT-6 Luna.",
              "**Gói Claude hay ChatGPT của chính bạn**, cho những tin bạn viết, trên server bạn tự chạy. Nó đọc trên máy đã đăng nhập, mất vài giây.",
              "**Quy tắc đơn giản**: trả lời một agent thì tới agent đó, và tin nối tiếp ngay sau khi bạn nói chuyện với nó cũng vậy, hoặc tin trong kênh mà bạn chỉ có một agent.",
            ],
          },
          "Khi không cái nào hợp, không agent nào trả lời. Hãy nhắc một agent để gọi nó.",
        ],
      },
      {
        id: "jev",
        heading: "Jev",
        blocks: [
          "Khi AULACBOT host workspace của bạn, Jev có sẵn. Trên server bạn tự chạy, nó dùng khóa TypeSafe hoặc OpenRouter của chủ sở hữu, khoảng 0,0001 USD một tin: [Thiết lập Jev](/help/jev#setup).",
        ],
      },
      {
        id: "plans",
        heading: "Vì sao gói của bạn chỉ chọn cho tin của bạn",
        blocks: ["Gói Claude và ChatGPT là của cá nhân, nên gói của bạn chỉ chọn cho những tin bạn viết."],
      },
      {
        id: "see",
        heading: "Xem ai đã chọn",
        blocks: ["Mở phần kiểm tra dưới một tin nhắn. Dòng cuối cho biết ai đã chọn agent."],
      },
    ],
  },
  jev: {
    title: "Jev",
    summary:
      "Một model nhanh của TypeSafe, đưa ra quyết định nhanh cho agent của bạn. Trên server của bạn thì nó tuỳ chọn, với khóa của chính bạn.",
    sections: [
      {
        id: "what",
        heading: "Nó làm gì",
        blocks: [
          {
            list: [
              "**Chọn ai trả lời.** Tin không @nhắc ai tới đúng agent trong chưa tới một giây, kể cả khi agent của bạn nghĩ bằng một gói và bạn không có API key.",
              "**Giữ bộ nhớ gọn.** Nó nhận ra chỗ lặp hay một dữ kiện mới hơn dù nói bằng từ khác: chỗ lặp gộp vào điều agent đã biết, còn dữ kiện mới thay cái cũ. Mỗi ngày một lần nó dọn phần còn lại.",
              "**Nhìn màn hình.** Trên trình duyệt và màn hình của agent, nó tìm nút và ô nhập từ một mô tả, nhìn gần hơn ở các ô nhỏ, và kiểm tra trên ảnh màn hình xem một bước đã xong chưa.",
              "**Đọc ít hơn.** Mỗi lượt chỉ nạp những công cụ agent có thể cần, nên AI của bạn đọc ít hơn và tốn ít hơn.",
            ],
          },
        ],
      },
      {
        id: "without",
        heading: "Không có nó",
        blocks: [
          "Mọi thứ vẫn chạy, chậm hơn và kém kỹ hơn.",
          {
            list: [
              "**Ai trả lời:** một model nhỏ trên một trong các API key của bạn sẽ chọn, như Claude Haiku 5.5 hay GPT-6 Luna. Không có khóa, gói Claude hay ChatGPT của từng người chọn cho tin họ viết, trong vài giây. Nếu không, trả lời hay tin nối tiếp vẫn tới đúng agent. Hãy nhắc một agent để gọi nó. [Cách chọn agent](/help/who-answers)",
              "**Bộ nhớ:** chỗ lặp đúng nguyên từ vẫn gộp. Chỗ lặp và cập nhật nói bằng từ khác thì để riêng.",
              "**Màn hình:** agent dùng con số hiện trên màn hình và tên chính xác. Không đọc gì từ ảnh.",
            ],
          },
        ],
      },
      {
        id: "setup",
        heading: "Thiết lập",
        blocks: [
          {
            list: [
              "Mở https://console.typesafe.ai và đăng nhập bằng Google hoặc email. Tài khoản mới cũng tạo theo cách đó.",
              "Nạp tiền trong console. Jev là trả trước.",
              "Mở https://console.typesafe.ai/keys, tạo một khóa và sao lại ngay.",
              "Trong AULACBOT, mở **Cài đặt\u00a0›\u00a0AI và mức dùng** và dán khóa dưới **Jev**. Chỉ người đã thiết lập server này thấy nó.",
            ],
          },
          "Đang trả tiền cho OpenRouter? Chọn **OpenRouter** dưới **Jev** và dán khóa từ https://openrouter.ai/keys, hoặc bật Jev bằng khóa OpenRouter của workspace chỉ với một bấm. Vẫn là Jev đó, tính tiền qua OpenRouter với cùng mức giá.",
          "Trên server bạn chạy bằng Docker, bạn đặt khóa trong `.env` với tên `TYPESAFE_API_KEY` cũng được. Khóa đó thắng khóa trong Cài đặt.",
        ],
      },
      {
        id: "cost",
        heading: "Tốn bao nhiêu",
        blocks: [
          {
            list: [
              "0,042 USD mỗi triệu token Jev đọc. Câu trả lời của nó miễn phí. Chọn ai trả lời đọc khoảng 2.500 token, tức khoảng 0,0001 USD. Một ảnh chụp màn hình khoảng 3.900 token.",
              "Tiền nạp dùng được 12 tháng. Bật nạp lại tự động trong console để Jev không hết tiền.",
              "**Cài đặt\u00a0›\u00a0AI và mức dùng** cho biết tháng này Jev đã ra bao nhiêu quyết định và tốn bao nhiêu.",
            ],
          },
        ],
      },
      {
        id: "data",
        heading: "Dữ liệu của bạn",
        blocks: [
          "Những gì Jev đọc để quyết định:",
          {
            list: [
              "Tên và mô tả của kênh, tin nhắn và vài tin trước đó",
              "Tên và vai trò của agent, phần đầu hướng dẫn của chúng và những công cụ chúng dùng được",
              "Các mục bộ nhớ mà nó đem so",
              "Tác vụ của một agent và phần đầu kết quả công cụ của nó",
              "Mục tiêu của một nhiệm vụ và những lệnh agent muốn chạy cho nhiệm vụ đó",
              "Các công cụ mà một ứng dụng đã kết nối đưa ra",
              "Trang hay màn hình agent đang dùng, kể cả ảnh chụp màn hình",
            ],
          },
          "TypeSafe chạy Jev ở Hoa Kỳ và không huấn luyện model của họ trên những gì bạn gửi. Họ giữ dữ liệu trong khoảng thời gian cần để chạy dịch vụ. Gói doanh nghiệp của họ có tuỳ chọn không lưu gì.",
          "Chính sách riêng tư của TypeSafe: https://typesafe.ai/legal/privacy-policy. Thỏa thuận xử lý dữ liệu: https://typesafe.ai/legal/data-processing.",
          "Với khóa OpenRouter, đúng những yêu cầu đó đi qua OpenRouter trên đường tới TypeSafe, theo điều khoản của OpenRouter và thiết lập riêng tư của bạn ở đó: https://openrouter.ai/privacy.",
        ],
      },
      {
        id: "problems",
        heading: "Khi nó dừng",
        blocks: [
          {
            list: [
              "**Khóa không được nhận:** tạo khóa mới và dán vào **Cài đặt\u00a0›\u00a0AI và mức dùng**.",
              "**Hết tiền:** nạp thêm trong console. Jev thử lại trong 30 phút, hoặc bấm **Kiểm tra lại**.",
              "**Bận hoặc không tới được:** TypeSafe có thể giới hạn số yêu cầu mỗi giây, hoặc ngừng phản hồi một lúc. Jev tự chạy lại. Giới hạn của bạn: https://console.typesafe.ai/rate-limits. Muốn mức cao hơn, viết cho sales@typesafe.ai.",
            ],
          },
          "Trong lúc đó, agent làm việc như ở [Không có nó](/help/jev#without).",
        ],
      },
    ],
  },
  "apps-de-ia": {
    title: "Ứng dụng AI",
    summary:
      "Nhờ agent của AULACBOT làm việc từ Claude, Cursor hay ứng dụng MCP khác, không cần rời khỏi đó, và nhận câu trả lời ngay tại chỗ.",
    sections: [
      {
        id: "what",
        heading: "Nó hoạt động thế nào",
        blocks: [
          "AULACBOT là một server MCP. Bạn dán địa chỉ của nó vào ứng dụng AI, đăng nhập bằng tài khoản của bạn và chọn một workspace. Từ đó, ứng dụng liệt kê được agent và kênh, gửi tác vụ tới một agent với tư cách bạn, chờ câu trả lời và đọc các tác vụ gần đây.",
          'Ví dụ, đang dựng cảnh trong Unity hay Blender, bạn nhờ Claude: "Nhờ agent marketing viết đoạn giới thiệu ra mắt". Tin nhắn hiện trong AULACBOT là của bạn, có nhãn **qua Claude**, và câu trả lời của agent quay lại Claude.',
          "Địa chỉ nằm trong **Cài đặt\u00a0›\u00a0Ứng dụng AI**. Nó kết thúc bằng `/mcp`.",
        ],
      },
      {
        id: "connect",
        heading: "Kết nối một ứng dụng",
        blocks: [
          {
            list: [
              "**Claude** (claude.ai, Claude Desktop và điện thoại): trong **Customize\u00a0›\u00a0Connectors**, bấm **+ Add**, rồi **Add custom connector**, đặt tên AULACBOT, dán địa chỉ và bấm **Continue**. Chọn **Sign in now**, bấm **Add** và cấp quyền. Trên gói Team và Enterprise, Owner của tổ chức Claude thêm trình kết nối trong Organization settings\u00a0›\u00a0Connectors, và mỗi người bấm **Connect** trong Customize\u00a0›\u00a0Connectors. Gói miễn phí của Claude có chỗ cho một trình kết nối tự tạo.",
              "**Claude Code:** chạy `claude mcp add --transport http --scope user agentes <địa chỉ>`, rồi gõ `/mcp`, chọn agentes và **Authenticate**. Chỉ cho thư mục hiện tại thì bỏ `--scope user`.",
              "**Cursor:** **Add to Cursor** trong **Cài đặt\u00a0›\u00a0Ứng dụng AI**, hoặc địa chỉ trong `~/.cursor/mcp.json`. Cursor sẽ hỏi bạn đăng nhập lần đầu dùng.",
              '**VS Code:** **Add to VS Code**, hoặc địa chỉ trong `.vscode/mcp.json` với `"type": "http"`.',
              "**Ứng dụng khác:** ChatGPT, Gemini, Grok, Perplexity, Codex, Zed, JetBrains và nhiều ứng dụng khác, mỗi cái có các bước riêng trong **Kết nối một ứng dụng**, với địa chỉ của bạn điền sẵn.",
            ],
          },
          "Khi bạn đăng nhập, AULACBOT cho biết ứng dụng nào xin quyền và nó quay về đâu. Chỉ tiếp tục nếu bạn vừa mới bắt đầu kết nối.",
        ],
      },
      {
        id: "tools",
        heading: "Ứng dụng làm được gì",
        blocks: [
          {
            list: [
              "`send_to_agent`: gửi một tin từ bạn tới một agent, trong cuộc trò chuyện riêng với nó hoặc trong một kênh, và chờ câu trả lời. Chỉ khi có quyền **Đọc và gửi tác vụ cho agent**.",
              "`wait_for_reply`: tiếp tục chờ câu trả lời của một tác vụ.",
              "`list_agents`: những agent bạn thấy.",
              "`list_channels`: những kênh bạn đọc được.",
              "`read_conversation`: tin gần đây của một kênh, một thread hay một tác vụ.",
              "`list_recent_tasks`: những tác vụ bạn đã gửi từ ứng dụng và việc agent đang làm.",
            ],
          },
          "Ứng dụng hành động với tư cách bạn và chỉ thấy những gì bạn thấy. Nó không bao giờ phê duyệt hành động của agent: khi agent dừng lại để xin phê duyệt, câu trả lời nói rõ kèm một liên kết, và một người quyết định trong AULACBOT. Nó cũng không đổi cài đặt, thành viên hay quyền.",
        ],
      },
      {
        id: "workspace",
        heading: "Mỗi kết nối một workspace",
        blocks: [
          "Mỗi kết nối gắn với workspace đã chọn lúc đăng nhập. Muốn dùng workspace khác, kết nối ứng dụng lại và chọn workspace kia.",
          "Trong **Cài đặt\u00a0›\u00a0Ứng dụng AI** bạn thấy các ứng dụng đã kết nối, lần dùng cuối của từng cái, và ngắt được bất kỳ cái nào. Người quản lý thành viên thấy ứng dụng của cả workspace và ngắt được. Mọi tin gửi từ ứng dụng đều hiện trong Nhật ký.",
        ],
      },
      {
        id: "tokens",
        heading: "Token cá nhân",
        blocks: [
          "Với script và ứng dụng không đăng nhập bằng OAuth, tạo token cá nhân trong **Cài đặt\u00a0›\u00a0Ứng dụng AI** và gửi trong header `Authorization: Bearer`. Token chỉ hiện một lần, chỉ dùng được trong workspace đã tạo nó, và hết hạn sau 30 ngày, 90 ngày, 1 năm hoặc không bao giờ.",
          "Trên server không có https, ở xa máy của nó, hãy dùng token cá nhân: đăng nhập OAuth cần https.",
        ],
      },
      {
        id: "limits",
        heading: "Giới hạn",
        blocks: [
          {
            list: [
              "Tối đa 120 yêu cầu một phút và 5.000 một ngày cho mỗi kết nối.",
              "Tối đa 20 tin một phút và 500 một ngày cho mỗi người trong mỗi workspace.",
              "Một lần chờ kéo dài tối đa 45 giây. Khi agent vẫn đang làm, ứng dụng chờ tiếp.",
            ],
          },
        ],
      },
      {
        id: "safety",
        heading: "Văn bản của người khác",
        blocks: [
          "Câu trả lời mang văn bản do agent và người trong AULACBOT viết. Ứng dụng nhận văn bản đó với nhãn là nội dung, không phải chỉ dẫn, nhưng văn bản vẫn có thể tìm cách dụ ứng dụng làm việc khác. Hãy xem ứng dụng của bạn sắp làm gì trước khi xác nhận.",
        ],
      },
      {
        id: "problems",
        heading: "Khi nó không kết nối",
        blocks: [
          {
            list: [
              "**Yêu cầu hết hạn:** trang đăng nhập dùng được 30 phút và chỉ một lần. Quay lại ứng dụng và kết nối lại.",
              "**Ứng dụng đòi đăng nhập lại:** kết nối đã bị ngắt, mật khẩu đã đổi hoặc bạn đã rời workspace. Đăng nhập lại từ ứng dụng.",
              "**Cursor kẹt ở lần đăng nhập cũ:** thoát Cursor, xóa thư mục `~/.mcp-auth` rồi kết nối lại.",
            ],
          },
        ],
      },
    ],
  },
  "install-on-a-server": {
    title: "Cài AULACBOT trên một server",
    summary: "Chạy AULACBOT trên server của bạn, miễn phí, cho cả nhóm. Một lệnh là cài xong.",
    sections: [
      {
        id: "choose",
        heading: "Chọn cách cài nào",
        blocks: [
          {
            list: [
              "**AULACBOT Cloud**: cho mọi nhóm, mở từ bất cứ đâu. Chúng tôi chạy, cập nhật và sao lưu. Mỗi workspace có máy tính riêng, nơi mỗi agent là một người dùng riêng.",
              "**Máy của bạn, cùng ứng dụng**: cho bạn hoặc nhóm nhỏ, mở được khi máy đó đang bật. Một chiếc Mac mini luôn bật là hợp. Bạn cập nhật bằng một bấm và sao lưu bằng tay. Agent chạy dưới quyền bạn trên máy đó.",
              "**Một server**: cho nhóm lớn hơn, chạy liên tục. Bạn cập nhật bằng ba lệnh, và nó tự sao lưu mỗi ngày. Trên Debian 13, mỗi agent là một người dùng riêng.",
            ],
          },
          "Từ máy của bạn lên server: [Chuyển lên server](/help/run-on-your-computer#moving). Cách nào cũng mang agent từ nơi khác về được bằng [Mang agent của bạn vào](/help/import).",
        ],
      },
      {
        id: "need",
        heading: "Bạn cần gì",
        blocks: [
          {
            list: [
              "Một server hoặc VPS chạy Linux 64-bit, trên x64 hoặc arm64. Cho nhóm nhỏ, 2 CPU, 4 GB bộ nhớ và 20 GB ổ đĩa là khởi đầu tốt. Trên máy Mac hay PC, [ứng dụng chạy AULACBOT](/help/run-on-your-computer) mà không cần Docker.",
              "Docker cùng Compose. Trên Linux, bộ cài thêm chúng khi thiếu, sau khi hỏi.",
              "Một đường vào: tài khoản Tailscale miễn phí (mặc định, riêng tư, không cần tên miền và không mở cổng), hoặc một tên miền trỏ về server với cổng 80 và 443 mở.",
            ],
          },
        ],
      },
      {
        id: "install",
        heading: "Cài đặt",
        blocks: [
          "Trên server, chạy:",
          {
            code: "curl -fsSL https://github.com/cuong-under/aulacbot/releases/download/installer-latest/install.sh | sh",
          },
          "Nó cài những gì còn thiếu, rồi hỏi vài câu: mọi người vào bằng cách nào, email, server này có phải máy tính của agent không, và có gửi thống kê dùng ẩn danh không. Bấm Enter để nhận câu trả lời gợi ý. Nó cài vào `/opt/agentes` (`~/agentes` nếu người dùng đã dùng được Docker), và lần đầu tải khoảng 2 GB.",
          "Kết thúc bằng địa chỉ server của bạn và một mã QR cho điện thoại. Chạy lại vẫn an toàn: nó giữ cài đặt của bạn và chỉ điền phần còn thiếu.",
          "Không dùng bộ cài, cùng bộ thiết lập đó chạy từ ảnh của ứng dụng, trong thư mục hiện tại, và kết thúc bằng các lệnh khởi động phần còn lại:",
          {
            code: 'docker run --rm -it --user "$(id -u):$(id -g)" -v "$PWD":/work -w /work ghcr.io/cuong-under/aulacbot:latest setup',
          },
        ],
      },
      {
        id: "reach",
        heading: "Mọi người vào bằng cách nào",
        blocks: [
          {
            list: [
              "**Tailscale**, mặc định: HTTPS riêng tư tại `https://agentes.<tailnet-của-bạn>.ts.net`, chỉ cho thiết bị trong mạng Tailscale của bạn. Trước khi cài, bật MagicDNS và HTTPS tại https://console.tailscale.com/admin/dns và tạo auth key tại https://console.tailscale.com/admin/settings/keys để bộ thiết lập hỏi tới.",
              "**Một tên miền công khai**: ai trên internet cũng mở được, ví dụ `https://chat.example.com`. Trỏ tên miền về server và mở cổng 80 và 443. Bộ thiết lập lấy chứng chỉ và gia hạn, và cho bạn tạo tài khoản trước khi tên miền chạy thật.",
              "**Chỉ máy này**: `http://localhost:3000`, để thử trên máy của bạn.",
            ],
          },
          "Trên Tailscale, server rời mạng khi khóa của nó hết hạn, sau 180 ngày. Muốn giữ, mở menu **⋯** của server tại https://console.tailscale.com/admin/machines và chọn **Disable Key Expiry**.",
          "Webhook khởi chạy lịch định kỳ, và ứng dụng AI gọi từ server của chúng, cần một địa chỉ công khai. Trên Tailscale, Funnel mở đúng địa chỉ đó ra internet: thêm Funnel vào policy của tailnet tại https://console.tailscale.com/admin/acls và đặt `TAILSCALE_FUNNEL=true` trong `.env`, rồi chạy `docker compose up -d`.",
        ],
      },
      {
        id: "owner",
        heading: "Tài khoản của bạn",
        blocks: [
          "Mở địa chỉ server của bạn và đăng ký: tài khoản đầu tiên thành chủ sở hữu. Sau đó đăng ký đóng lại, và mọi người vào bằng lời mời, từ **Cài đặt\u00a0›\u00a0Thành viên và lời mời**.",
          "Trên Tailscale, người bạn mời cũng cần vào tailnet của bạn. Mời họ trước tại https://console.tailscale.com/admin/users rồi mới mời trong AULACBOT.",
        ],
      },
      {
        id: "email",
        heading: "Email",
        blocks: [
          "Không có email, AULACBOT ghi mỗi email vào nhật ký thay vì gửi, nên link mời vẫn sao được từ đó. Đặt lại mật khẩu bị tắt, và email mới cho một tài khoản đổi ngay, không cần mã hay liên kết.",
          {
            code: "docker compose logs agentes | grep 'email (not sent'",
          },
          "Bộ thiết lập nhận mail server của bạn (SMTP) hoặc khóa cho API tương thích Resend, như MillionSend hay Resend. Email đi từ `ping@<tên miền server của bạn>` trừ khi bạn chọn người gửi khác, và tên miền đó phải được xác minh với nhà cung cấp email. Muốn đặt sau, chạy lại bộ cài.",
        ],
      },
      {
        id: "phone",
        heading: "Điện thoại của bạn",
        blocks: [
          {
            list: [
              "Trên Tailscale, cài ứng dụng Tailscale trên điện thoại và đăng nhập cùng tailnet.",
              "Cài ứng dụng AULACBOT.",
              "Quét mã QR mà bộ thiết lập in ra, hoặc mã trong **Cài đặt\u00a0›\u00a0Tài khoản của bạn\u00a0›\u00a0Mở trên điện thoại**, mã này cũng đăng nhập luôn.",
            ],
          },
        ],
      },
      {
        id: "computers",
        heading: "Máy tính của agent",
        blocks: [
          "Bộ thiết lập biến server này thành máy tính của agent được luôn, nơi chúng chạy lệnh, dùng trình duyệt và giữ tệp. Nó sẽ hỏi, và gợi ý có nếu server làm tốt việc đó. Trên Debian 13, mỗi agent có người dùng riêng, kèm màn hình. Trên Ubuntu, các agent dùng chung một người dùng, `agentes`. Nếu đã trả lời không, chạy lại bộ cài với `--computer yes`:",
          {
            code: "curl -fsSL https://github.com/cuong-under/aulacbot/releases/download/installer-latest/install.sh | sh -s -- --computer yes",
          },
          "Thêm máy tính, như một máy Mac có ứng dụng AULACBOT hay một server khác, kết nối từ **Cài đặt\u00a0›\u00a0Thiết bị**, như ở [Máy tính và điện thoại của bạn](/help/computers). Trên Tailscale, chúng vào tailnet của bạn trước.",
        ],
      },
      {
        id: "backups",
        heading: "Sao lưu và khôi phục",
        blocks: [
          "Server của bạn gồm ba thứ: cơ sở dữ liệu, các tệp đã tải lên, và `AGENTES_SECRET` trong `.env`. Giữ một bản `.env` ở nơi an toàn, tách khỏi các bản sao lưu: không có secret đó, khóa lưu trong cơ sở dữ liệu khôi phục về thì không đọc được.",
          "Muốn sao lưu mỗi ngày, tạo một bucket riêng tư trên Cloudflare R2 hoặc nơi tương thích S3 khác, và một khóa đọc, ghi và xóa được trong đó. Thêm vào `.env`, cùng `backup` trong `COMPOSE_PROFILES` (`https,backup` nếu có tên miền công khai):",
          {
            code: "S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com\nS3_ACCESS_KEY_ID=…\nS3_SECRET_ACCESS_KEY=…\nS3_BACKUP_BUCKET=agentes-backups\nCOMPOSE_PROFILES=tailscale,backup",
          },
          "Rồi chạy `docker compose up -d` trong thư mục cài. Cơ sở dữ liệu được kết xuất lúc 03:00 UTC và mỗi bản giữ 14 ngày. `docker compose run --rm backup now` lấy ngay một bản, và `docker compose run --rm backup list` liệt kê chúng. Bản kết xuất chỉ chứa cơ sở dữ liệu: tệp đã tải lên, trong volume `files`, cần bản sao riêng, và hướng dẫn đầy đủ bên dưới có các lệnh đó.",
          "Muốn khôi phục, kéo một bản kết xuất về bằng `docker compose run --rm -T backup fetch <tên> > agentes.dump`, rồi nạp vào một cơ sở dữ liệu trống khi ứng dụng đã dừng:",
          {
            code: "docker compose stop agentes\ndocker compose exec -T postgres dropdb -U agentes --force agentes\ndocker compose exec -T postgres createdb -U agentes agentes\ndocker compose exec -T postgres pg_restore -U agentes -d agentes --exit-on-error < agentes.dump\ndocker compose start agentes",
          },
          "Khôi phục vào đúng phiên bản đã kết xuất, hoặc phiên bản mới hơn.",
        ],
      },
      {
        id: "upgrades",
        heading: "Nâng cấp",
        blocks: [
          "Trong thư mục cài, chạy:",
          {
            code: "curl -fsSLO https://github.com/cuong-under/aulacbot/releases/download/installer-latest/docker-compose.yml\ndocker compose pull\ndocker compose up -d",
          },
          "Cơ sở dữ liệu tự cập nhật khi bản mới khởi động. Giữ cài đặt trong `.env` và đừng bao giờ sửa `docker-compose.yml`, vì mỗi lần nâng cấp là thay tệp đó. Sao lưu trước khi nhảy xa: cơ sở dữ liệu đã được bản mới cập nhật thì bản cũ không mở được.",
        ],
      },
      {
        id: "data",
        heading: "Nó gửi những gì",
        blocks: [
          "Mỗi ngày một lần, server gửi cho AULACBOT thống kê dùng ẩn danh: các con số như số người, số agent, kích thước máy, số token AI đã dùng và lượng dữ liệu trình duyệt của agent gửi nhận. Không bao giờ có tin nhắn, tệp, tên hay trang web. `docker compose run --rm agentes telemetry` in ra đúng những gì nó sẽ gửi. Chủ sở hữu tắt trong **Cài đặt\u00a0›\u00a0Chung**, hoặc bằng `TELEMETRY=off` trong `.env`.",
          "Báo lỗi không đi đâu cả trừ khi bạn đặt `SENTRY_DSN` trỏ tới một server tương thích Sentry do bạn chọn. Báo cáo chỉ chứa lỗi và nơi xảy ra, không bao giờ có tin nhắn, email, địa chỉ IP, cookie hay token.",
        ],
      },
      {
        id: "reference",
        heading: "Hướng dẫn đầy đủ",
        blocks: [
          "Mọi cài đặt, một proxy của riêng bạn như nginx, chạy không cần Docker, một runbook cho agent AI cài đặt, và phải làm gì khi có sự cố, đều nằm trong `SELF_HOSTING.md`, trong kho của AULACBOT.",
        ],
      },
    ],
  },
};

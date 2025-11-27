export const PLAYBOOK_SETUPS = [
  // ====================== 1. FVG Trend Continuation ======================
  {
    id: 1,
    name: "FVG Trend Continuation",
    Version: "v1.0",
    instruments: ["EURUSD", "XAUUSD"],
    timeframes: ["H1", "H4"],
    direction: "Trend",

    universal_checklist: `
☐ Higher TF bias rõ ràng (D1/H4)
☐ Không có news đỏ ≤ 1 giờ tới
☐ Volatility ≥ 70% ATR14 hiện tại
☐ R:R tiềm năng ≥ 1:2.0
☐ Tâm lý hôm nay ổn (không revenge/FOMO)
☐ Đã tick đủ 80% Setup Checklist bên dưới
    `.trim(),

    setup_checklist: `
☐ H4 đang trong xu hướng rõ ràng (HH-HL hoặc LL-LH)
☐ FVG được tạo bởi impulsive leg ≥ 3 nến liên tiếp
☐ FVG nằm trên HL gần nhất (buy) / dưới HH gần nhất (sell)
☐ Có ít nhất 1 confluence: HTF OB / Key Level / Fib 50-61.8%
☐ Có liquidity sweep trước đó cùng chiều (plus point)
☐ Limit đặt trong 50–100% vùng FVG
☐ SL dưới đáy impulsive leg hoặc mép dưới FVG + buffer
    `.trim(),

    context:
      `- Chỉ trade thuận xu hướng H4 (HH–HL cho buy, LL–LH cho sell).\n- Không trade khi H4 đang range chặt.\n- Ưu tiên FVG trùng với HTF OB / key level / fib 50–61.8%.`.trim(),
    entry_rules:
      `1. Chờ H1 tạo impulsive leg rõ ràng để lại FVG (3 nến liên tiếp, nến giữa không chồng).\n2. Xác nhận FVG nằm trên H4 HL gần nhất (buy) hoặc dưới HH (sell).\n3. Đặt limit tại 50–100% vùng FVG.`.trim(),
    sl_tp_rules:
      `- SL: dưới đáy impulsive leg H1 hoặc mép dưới FVG + buffer 5–10 pip.\n- TP1: 2R | TP2: 4R hoặc H4 swing high/low gần nhất.\n- Chỉ vào nếu RR ≥ 1:2.`.trim(),
    management:
      `- +1R → dời SL về BE.\n- Nếu giá lấp kín FVG nhưng không khớp trong 2 nến → huỷ lệnh.`.trim(),
    invalidation:
      `- H4 phá cấu trúc trend → bỏ toàn bộ FVG cũ.\n- News mạnh ±30 phút → không đặt lệnh mới.`.trim(),
    mistakes:
      `- Vào FVG ngược trend H4.\n- Đặt SL quá sát mép FVG.\n- Trade FVG giữa range.`.trim(),
    notes: "WR 71% – Avg R:R 1:2.8 (backtest 11/2025)",
  },

  // ====================== 2. Liquidity Grab Reversal ======================
  {
    id: 2,
    name: "Liquidity Grab Reversal",
    Version: "v1.0",
    instruments: ["EURUSD", "XAUUSD", "GBPUSD"],
    timeframes: ["H1", "M15"],
    direction: "Reversal",

    universal_checklist: `
☐ Higher TF bias rõ ràng (D1/H4)
☐ Không có news đỏ ≤ 1 giờ tới
☐ Volatility ≥ 70% ATR14 hiện tại
☐ R:R tiềm năng ≥ 1:2.0
☐ Tâm lý hôm nay ổn (không revenge/FOMO)
☐ Đã tick đủ 80% Setup Checklist bên dưới
    `.trim(),

    setup_checklist: `
☐ Có cụm ≥ 2 equal highs (sell) hoặc equal lows (buy) rõ ràng trên H1
☐ Giá đã quét thanh khoản (phá high/low của cụm đó)
☐ Trên M15 xuất hiện nến xác nhận mạnh (pinbar, engulfing, closing pin)
☐ Close nến xác nhận nằm ngoài vùng đã quét ≥ 50%
☐ Có confluence: key level H4/D1, FVG, OB, order block
☐ SL trên wick cao nhất (sell) hoặc dưới wick thấp nhất (buy) + buffer
☐ R:R tối thiểu 1:3
    `.trim(),

    context:
      `- Giá tiếp cận vùng supply/demand quan trọng H4/D1.\n- Phía trên có cụm equal highs (sell) hoặc equal lows (buy).\n- Thị trường đang có dấu hiệu quá mua/quá bán nhẹ trên HTF.`.trim(),
    entry_rules:
      `1. Chờ giá quét thanh khoản (fake breakout).\n2. Trên M15 xuất hiện nến đảo chiều mạnh đóng lại dưới vùng quét (sell) hoặc trên vùng quét (buy).\n3. Entry tại close nến xác nhận hoặc 50% thân nến đó.`.trim(),
    sl_tp_rules:
      `- SL: trên wick cao nhất của nến quét + buffer.\n- TP1: quay về origin (vùng demand/supply gần nhất).\n- TP2: H4 swing low/high.\n- Ưu tiên RR ≥ 1:3.`.trim(),
    management:
      `- +1.5R → dời SL về BE.\n- Nếu sau 5–7 nến H1 vẫn sideway → cân nhắc cắt sớm.`.trim(),
    invalidation:
      `- Không có nến xác nhận trong 3 cây M15 → bỏ setup.\n- Trend D1 quá mạnh cùng chiều fake breakout → tránh trade.`.trim(),
    mistakes:
      `- Vào lệnh ngay khi vừa phá high/low, chưa có confirm.\n- Đặt TP quá tham, bỏ qua vùng logical TP1.`.trim(),
    notes: "Setup cực chất khi thị trường overextend – WR ~68%",
  },

  // ====================== 3. Pinbar at Key Level ======================
  {
    id: 3,
    name: "Pinbar at Key Level",
    Version: "v1.0",
    instruments: ["Major FX", "XAUUSD"],
    timeframes: ["H4", "H1"],
    direction: "Both",

    universal_checklist: `
☐ Higher TF bias rõ ràng (D1/H4)
☐ Không có news đỏ ≤ 1 giờ tới
☐ Volatility ≥ 70% ATR14 hiện tại
☐ R:R tiềm năng ≥ 1:2.0
☐ Tâm lý hôm nay ổn (không revenge/FOMO)
☐ Đã tick đủ 80% Setup Checklist bên dưới
    `.trim(),

    setup_checklist: `
☐ Key level H4/D1 rõ ràng (S/R, FVG, OB, breaker)
☐ Pinbar reject ≥ 2 cây nến trước (hoặc chạm ≥ 2 lần)
☐ Wick ≥ 2 lần thân nến
☐ Close nằm trong 1/3 phía đối diện wick
☐ Có ít nhất 1 confluence mạnh (FVG, OB, liquidity sweep…)
☐ Cùng chiều HTF bias (hoặc reversal signal cực mạnh)
☐ SL trên/dưới đỉnh wick pinbar + buffer
    `.trim(),

    context:
      `- Chỉ trade pinbar tại key level H4/D1 đã test 0–1 lần.\n- Ưu tiên cùng chiều trend D1/H4.\n- Tránh pinbar lơ lửng giữa range.`.trim(),
    entry_rules:
      `1. Pinbar xuất hiện sau nhịp mạnh vào vùng key level.\n2. Wick ≥ 2× thân nến, close trong 1/3 phía đối diện.\n3. Entry tại close hoặc 50% pullback thân pinbar.`.trim(),
    sl_tp_rules:
      `- SL: trên/dưới đỉnh wick pinbar + buffer.\n- TP1: 2R | TP2: mức kháng cự/hỗ trợ tiếp theo.\n- RR tối thiểu 1:1.8.`.trim(),
    management:
      `- +1R → dời SL lên dưới/thân pinbar.\n- Nến tiếp theo phá cấu trúc pinbar → cân nhắc thoát.`.trim(),
    invalidation:
      `- News cực mạnh trước giờ đóng nến pinbar.\n- Pinbar quá nhỏ so với ATR trung bình.`.trim(),
    mistakes:
      `- Thấy pinbar nào cũng vào, không cần level.\n- Trade ngược trend mạnh mà không có confluence cực mạnh.`.trim(),
    notes: "Setup “ăn chắc mặc bền” – WR ~70% khi có confluence",
  },
];

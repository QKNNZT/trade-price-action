// utils/validateTradeForm.js

export function validateTradeForm(form, position) {
  const errors = [];

  if (!form.date) errors.push("• Ngày (Date) không được để trống");
  if (!form.symbol) errors.push("• Symbol không được để trống");
  if (!form.direction) errors.push("• Chọn Direction (Long/Short)");

  const entry = parseFloat(form.entry);
  const sl = parseFloat(form.sl);
  const tp = parseFloat(form.tp);
  const capital = parseFloat(form.capital);
  const dir = form.direction;

  if (!form.entry || isNaN(entry) || entry <= 0) {
    errors.push("• Entry phải là số dương");
  }

  if (!form.sl || isNaN(sl) || sl <= 0) {
    errors.push("• Stop Loss phải là số dương");
  }

  if (!form.capital || isNaN(capital) || capital <= 0) {
    errors.push("• Capital phải là số dương");
  }

  if (entry && sl && Math.abs(entry - sl) < 0.00001) {
    errors.push("• Entry và SL không được bằng nhau");
  }

  // Logic direction
  if (dir === "Long" && entry && sl) {
    if (sl >= entry) {
      errors.push("• Với lệnh Long: SL phải nhỏ hơn Entry");
    }
    if (tp && tp <= entry) {
      errors.push("• Với lệnh Long: TP phải lớn hơn Entry");
    }
  }

  if (dir === "Short" && entry && sl) {
    if (sl <= entry) {
      errors.push("• Với lệnh Short: SL phải lớn hơn Entry");
    }
    if (tp && tp >= entry) {
      errors.push("• Với lệnh Short: TP phải nhỏ hơn Entry");
    }
  }

  if (!position.isValid) {
    errors.push("• Entry và SL không hợp lệ → không tính được lot size");
  }

  return errors;
}

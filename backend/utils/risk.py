# utils/risk.py
def calculate_profit_and_pct(
    exit_price: float,
    entry: float,
    direction: str,
    capital: float,
    sl: float,
    tp: float,
    risk_percent: float = 0.01,
    pip_multiplier: int = 10000,
    pip_value_per_lot: float = 10.0,
):
    """
    Tính profit ($) và profit_pct (%) dựa trên:
      - risk 1% / lệnh (mặc định)
      - pip_multiplier: 10000 cho cặp 4-digit
      - pip_value_per_lot: 10$ / pip cho 1 lot (chuẩn forex)
    """

    capital = capital or 0
    entry = entry or 0
    sl = sl or 0
    exit_price = exit_price or 0

    # Nếu không có vốn hoặc SL = entry -> không tính được
    if capital <= 0:
        return 0.0, 0.0

    stop_pips = abs(entry - sl) * pip_multiplier
    if stop_pips == 0:
        return 0.0, 0.0

    # Số pip lãi/lỗ
    pip_diff = abs(exit_price - entry) * pip_multiplier

    # Số tiền risk cho 1 lệnh
    risk_amount = capital * risk_percent

    # Lot size dựa trên risk và stop_pips
    lot_size = risk_amount / (stop_pips * pip_value_per_lot)

    # Profit theo $
    profit = pip_diff * lot_size * pip_value_per_lot

    # Điều chỉnh sign theo direction & chiều exit
    direction = (direction or "").lower()

    if direction == "short":
        if exit_price > entry:
            profit = -profit
    else:  # mặc định coi là long
        if exit_price < entry:
            profit = -profit

    profit_pct = (profit / capital) * 100 if capital > 0 else 0

    return round(profit, 2), round(profit_pct, 2)

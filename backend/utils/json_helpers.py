# utils/json_helpers.py
import json


def to_json_list(value):
    """
    Chuẩn hóa một input bất kỳ thành JSON string của list.
    Chấp nhận:
      - None / "" -> "[]"
      - list/tuple -> json.dumps(list)
      - string JSON sẵn (["a", "b"]) -> giữ nguyên dưới dạng list
      - string "a,b,c" -> ["a","b","c"]
    """
    if value is None or value == "":
        return "[]"

    # Nếu đã là list/tuple
    if isinstance(value, (list, tuple)):
        return json.dumps(value)

    # Thử parse như JSON
    try:
        parsed = json.loads(value)
        if isinstance(parsed, list):
            return json.dumps(parsed)
    except Exception:
        pass

    # Fallback: tách bằng dấu phẩy
    return json.dumps([v.strip() for v in str(value).split(",") if v.strip()])

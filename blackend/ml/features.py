TRAITS = ["social", "independence", "planning", "analysis", "calmness"]


def to_features(answers):
    if len(answers) != 10:
        raise ValueError("ต้องมีคำตอบ 10 ข้อ")
    if any(a < 1 or a > 5 for a in answers):
        raise ValueError("คำตอบต้องอยู่ในช่วง 1-5")
    return [(answers[i] + answers[i + 1]) / 2 for i in range(0, 10, 2)]


def df_to_features(df):
    out = df[[]].copy()
    for i, name in enumerate(TRAITS):
        out[name] = (df[f"q{2*i+1}"] + df[f"q{2*i+2}"]) / 2
    return out
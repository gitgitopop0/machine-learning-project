from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

from features import TRAITS, df_to_features, to_features

BASE = Path(__file__).resolve().parent
CSV = BASE.parent / "data" / "animal_personality_dataset_25000.csv"
OUT = BASE / "model.pkl"


df = pd.read_csv(CSV, encoding="utf-8-sig")
X = df_to_features(df)
y = df["animal"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

candidates = {
    "LogisticRegression": LogisticRegression(max_iter=1000),
    "RandomForest": RandomForestClassifier(
        n_estimators=200, random_state=42, n_jobs=-1
    ),
}

best_name, best_model, best_acc = None, None, 0
for name, model in candidates.items():
    model.fit(X_train, y_train)
    acc = model.score(X_test, y_test)
    print(f"{name:20s} accuracy = {acc:.4f}")
    if acc > best_acc:
        best_name, best_model, best_acc = name, model, acc

print(f"\nเลือก: {best_name} ({best_acc:.2%})\n")
print(classification_report(y_test, best_model.predict(X_test)))

joblib.dump({"model": best_model, "traits": TRAITS}, OUT)
print(f"บันทึกแล้ว -> {OUT}")

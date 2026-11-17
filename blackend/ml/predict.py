from pathlib import Path

import joblib
import pandas as pd

from ml.features import TRAITS, to_features

_bundle = joblib.load(Path(__file__).resolve().parent / "model.pkl")
_model = _bundle["model"]


def predict(answers):
    feats = to_features(answers)
    X = pd.DataFrame([feats], columns=TRAITS)
    proba = _model.predict_proba(X)[0]
    i = int(proba.argmax())
    scores = {t: round(v, 2) for t, v in zip(TRAITS, feats)}
    return str(_model.classes_[i]), round(float(proba[i]) * 100, 1), scores
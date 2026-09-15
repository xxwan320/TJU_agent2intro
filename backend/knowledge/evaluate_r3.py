"""Frozen development retrieval only. M owns holdout and itinerary execution."""
import argparse
from datetime import datetime, timezone
from hashlib import sha256
import json
from pathlib import Path
from time import perf_counter
from .service import DATA_DIRECTORY, LocalKnowledge
from .evaluate import evaluate as legacy_evaluate


def digest(path):
    return sha256(path.read_text(encoding="utf-8").replace("\r\n", "\n").encode()).hexdigest()


def evaluate_development():
    directory = DATA_DIRECTORY / "r3"
    corpus = json.loads((directory / "evaluation-v1.json").read_text(encoding="utf-8"))
    k = LocalKnowledge()
    results = []
    for case in corpus["questions"]:
        if case["split"] != "development" or case["kind"] == "itinerary":
            continue
        start = perf_counter()
        hits = k.search(case["query"], case["campus_id"], 5)
        elapsed_ms = (perf_counter() - start) * 1000
        ids = {hit.id for hit in hits}
        expected = set(case["relevant_fact_ids"])
        recall = len(ids & expected) / len(expected) if expected else None
        results.append({"case_id": case["id"], "expected_ids": sorted(expected),
                        "retrieved_ids": [hit.id for hit in hits], "recall_at_5": recall,
                        "pass": recall == 1 if expected else not hits,
                        "latency_ms": round(elapsed_ms, 3)})
    evidence = [r for r in results if r["expected_ids"]]
    negative = [r for r in results if not r["expected_ids"]]
    return {
        "dataset_id": corpus["dataset_id"], "data_version": k.get_status().version,
        "measured_at": datetime.now(timezone.utc).isoformat(),
        "dataset_sha256_lf": digest(directory / "evaluation-v1.json"),
        "implementation_sha256_lf": {name: digest(Path(__file__).parent / name)
                                     for name in ("service.py", "evaluate.py", "evaluate_r3.py")},
        "scope": "Local development retrieval only; no LLM, map, field visit, or task execution.",
        "legacy": legacy_evaluate(),
        "service_development": {"evidence_questions": len(evidence),
            "recall_at_5": sum(r["recall_at_5"] for r in evidence) / len(evidence),
            "no_evidence_questions": len(negative), "no_evidence_pass": sum(r["pass"] for r in negative)},
        "results": results, "holdout_evaluation": "NOT_RUN_BY_D",
        "itinerary_evaluation": "NOT_RUN; M owns task acceptance",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = evaluate_development()
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n",
                               encoding="utf-8", newline="\n")
    print(json.dumps({"data_version": report["data_version"],
                      "legacy_recall_at_5": report["legacy"]["recall_at_5"],
                      "legacy_other_pass": report["legacy"]["other_pass"],
                      "service_development": report["service_development"],
                      "holdout": report["holdout_evaluation"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()

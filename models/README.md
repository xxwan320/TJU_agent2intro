# Bundled reconstruction models

This directory contains the pinned model weights, vendored upstream source, and successful GLB outputs from the campus reconstruction runs. `MANIFEST.json` records SHA-256 hashes and byte counts. Large weights and GLB files use Git LFS; install Git LFS and run `git lfs pull` after cloning.

The normal image path uses TripoSR. Shap-E supplies text-conditioned generation and the recovery path after image reconstruction fails. SmolVLM describes image pixels only when that recovery path is needed. U2-Net weights are used for foreground extraction. `models/vendor` includes the pinned upstream repositories and their license files.

TripoSR and SmolVLM declare MIT and Apache-2.0 licenses in their upstream model cards. Shap-E source code is MIT licensed; its upstream model card asks against commercial use, and the weight license is not clearly stated in the upstream repository. Review upstream terms before redistribution or commercial use. Generated models are reconstructions and concepts, not survey-grade geometry.

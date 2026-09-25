"""Refresh the existing R2 JSON schema bundle from server types."""
import json
import sys
from pathlib import Path
from pydantic import TypeAdapter

root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root))
from backend import r2_contracts as r2

path=root/'shared/r2.schema.json'
bundle=json.loads(path.read_text('utf-8'))
bundle['schemas']={name:TypeAdapter(getattr(r2,name)).json_schema() for name in bundle['schemas']}
output=json.dumps(bundle,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:
    assert path.read_text('utf-8')==output,'R2 schema drift'
else:
    path.write_text(output,encoding='utf-8')
print('R2 schema checked' if '--check' in sys.argv else 'R2 schema exported')

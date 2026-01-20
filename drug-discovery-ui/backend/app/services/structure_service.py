import httpx
from typing import Optional, Tuple
from urllib.parse import quote

PUBCHEM_BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound"

class StructureService:
    def __init__(self) -> None:
        pass

    async def fetch_pubchem_sdf(self, query: str) -> Optional[str]:
        # Try name/SMILES/InChIKey paths with 3D first then 2D
        async with httpx.AsyncClient(timeout=20) as client:
            for path in [
                f"/name/{quote(query)}/SDF?record_type=3d",
                f"/smiles/{quote(query)}/SDF?record_type=3d",
                f"/inchikey/{quote(query)}/SDF?record_type=3d",
                f"/name/{quote(query)}/SDF",
                f"/smiles/{quote(query)}/SDF",
                f"/inchikey/{quote(query)}/SDF",
            ]:
                url = PUBCHEM_BASE + path
                try:
                    r = await client.get(url)
                    if r.status_code == 200 and r.text.strip():
                        return r.text
                except Exception:
                    continue
        return None

    def sdf_to_json(self, sdf: str) -> Optional[dict]:
        try:
            lines = sdf.splitlines()
            # find counts line (4th line, 0-based index 3)
            if len(lines) < 5:
                return None
            counts = lines[3]
            if len(counts) < 6:
                return None
            nat = int(counts[0:3])
            nb = int(counts[3:6])
            atoms = []
            bonds = []
            idx = 4
            for i in range(nat):
                parts = lines[idx + i].split()
                if len(parts) < 4:
                    return None
                x, y, z = float(parts[0]), float(parts[1]), float(parts[2])
                el = parts[3]
                atoms.append((el, [x, y, z]))
            idx += nat
            for j in range(nb):
                parts = lines[idx + j].split()
                if len(parts) < 3:
                    break
                a = int(parts[0]) - 1
                b = int(parts[1]) - 1
                order = int(parts[2]) if parts[2].isdigit() else 1
                bonds.append([a, b, order])
            elements = [a[0] for a in atoms]
            positions = [a[1] for a in atoms]
            return {"elements": elements, "positions": positions, "bonds": bonds, "source": "pubchem"}
        except Exception:
            return None

import json
import math
import struct
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "pro" / "hobbies" / "basketball-figure.glb"


materials = [
    ("skin", [0.72, 0.42, 0.28, 1.0], [0.04, 0.015, 0.008], 0.0, 0.46),
    ("skin_glow", [0.78, 0.48, 0.33, 1.0], [0.08, 0.03, 0.01], 0.0, 0.44),
    ("uniform_black", [0.008, 0.01, 0.018, 1.0], [0.0, 0.018, 0.026], 0.05, 0.58),
    ("shorts_black", [0.015, 0.018, 0.032, 1.0], [0.0, 0.012, 0.018], 0.03, 0.62),
    ("white_trim", [0.92, 0.92, 0.88, 1.0], [0.03, 0.03, 0.03], 0.0, 0.4),
    ("hair_black", [0.015, 0.012, 0.01, 1.0], [0.0, 0.0, 0.0], 0.0, 0.86),
    ("shoe_black", [0.01, 0.012, 0.02, 1.0], [0.0, 0.035, 0.045], 0.12, 0.5),
    ("cyan_glow", [0.0, 0.9, 1.0, 1.0], [0.0, 0.75, 0.85], 0.04, 0.32),
]


def mat4_identity():
    return [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0],
    ]


def mat4_mul(a, b):
    out = [[0.0] * 4 for _ in range(4)]
    for r in range(4):
        for c in range(4):
            out[r][c] = sum(a[r][k] * b[k][c] for k in range(4))
    return out


def translate(x, y, z):
    m = mat4_identity()
    m[0][3] = x
    m[1][3] = y
    m[2][3] = z
    return m


def scale(x, y, z):
    m = mat4_identity()
    m[0][0] = x
    m[1][1] = y
    m[2][2] = z
    return m


def rotate_x(a):
    c, s = math.cos(a), math.sin(a)
    m = mat4_identity()
    m[1][1], m[1][2] = c, -s
    m[2][1], m[2][2] = s, c
    return m


def rotate_y(a):
    c, s = math.cos(a), math.sin(a)
    m = mat4_identity()
    m[0][0], m[0][2] = c, s
    m[2][0], m[2][2] = -s, c
    return m


def rotate_z(a):
    c, s = math.cos(a), math.sin(a)
    m = mat4_identity()
    m[0][0], m[0][1] = c, -s
    m[1][0], m[1][1] = s, c
    return m


def transform_point(m, p):
    x, y, z = p
    return (
        m[0][0] * x + m[0][1] * y + m[0][2] * z + m[0][3],
        m[1][0] * x + m[1][1] * y + m[1][2] * z + m[1][3],
        m[2][0] * x + m[2][1] * y + m[2][2] * z + m[2][3],
    )


def transform_normal(m, n):
    x, y, z = n
    nx = m[0][0] * x + m[0][1] * y + m[0][2] * z
    ny = m[1][0] * x + m[1][1] * y + m[1][2] * z
    nz = m[2][0] * x + m[2][1] * y + m[2][2] * z
    l = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
    return (nx / l, ny / l, nz / l)


def compose(pos=(0, 0, 0), rot=(0, 0, 0), scl=(1, 1, 1)):
    m = translate(*pos)
    m = mat4_mul(m, rotate_z(rot[2]))
    m = mat4_mul(m, rotate_y(rot[1]))
    m = mat4_mul(m, rotate_x(rot[0]))
    return mat4_mul(m, scale(*scl))


def sphere(rx, ry, rz, seg=32, rings=16):
    verts, norms, idx = [], [], []
    for y in range(rings + 1):
        v = y / rings
        phi = v * math.pi
        for x in range(seg + 1):
            u = x / seg
            th = u * math.tau
            nx = math.sin(phi) * math.cos(th)
            ny = math.cos(phi)
            nz = math.sin(phi) * math.sin(th)
            verts.append((rx * nx, ry * ny, rz * nz))
            norms.append((nx, ny, nz))
    for y in range(rings):
        for x in range(seg):
            a = y * (seg + 1) + x
            b = a + seg + 1
            idx.extend([a, b, a + 1, a + 1, b, b + 1])
    return verts, norms, idx


def cylinder(rt, rb, h, seg=32):
    verts, norms, idx = [], [], []
    for y, r in [(h / 2, rt), (-h / 2, rb)]:
        for i in range(seg):
            th = i / seg * math.tau
            verts.append((r * math.cos(th), y, r * math.sin(th)))
            norms.append((math.cos(th), 0, math.sin(th)))
    for i in range(seg):
        j = (i + 1) % seg
        idx.extend([i, seg + i, j, j, seg + i, seg + j])
    top_center = len(verts)
    verts.append((0, h / 2, 0))
    norms.append((0, 1, 0))
    bottom_center = len(verts)
    verts.append((0, -h / 2, 0))
    norms.append((0, -1, 0))
    for i in range(seg):
        j = (i + 1) % seg
        idx.extend([top_center, i, j])
        idx.extend([bottom_center, seg + j, seg + i])
    return verts, norms, idx


def box(w, h, d):
    x, y, z = w / 2, h / 2, d / 2
    faces = [
        ((0, 0, 1), [(-x, -y, z), (x, -y, z), (x, y, z), (-x, y, z)]),
        ((0, 0, -1), [(x, -y, -z), (-x, -y, -z), (-x, y, -z), (x, y, -z)]),
        ((1, 0, 0), [(x, -y, z), (x, -y, -z), (x, y, -z), (x, y, z)]),
        ((-1, 0, 0), [(-x, -y, -z), (-x, -y, z), (-x, y, z), (-x, y, -z)]),
        ((0, 1, 0), [(-x, y, z), (x, y, z), (x, y, -z), (-x, y, -z)]),
        ((0, -1, 0), [(-x, -y, -z), (x, -y, -z), (x, -y, z), (-x, -y, z)]),
    ]
    verts, norms, idx = [], [], []
    for n, ps in faces:
        base = len(verts)
        verts.extend(ps)
        norms.extend([n] * 4)
        idx.extend([base, base + 1, base + 2, base, base + 2, base + 3])
    return verts, norms, idx


def add_part(prims, shape, material, pos=(0, 0, 0), rot=(0, 0, 0), scl=(1, 1, 1)):
    verts, norms, idx = shape
    m = compose(pos, rot, scl)
    base_verts = [transform_point(m, v) for v in verts]
    base_norms = [transform_normal(m, n) for n in norms]
    prims.append((material, base_verts, base_norms, idx))


def build_primitives():
    p = []
    add_part(p, cylinder(0.34, 0.45, 1.08, 36), 2, (0, 1.95, 0), scl=(0.86, 1, 0.42))
    add_part(p, box(0.26, 0.18, 0.018), 4, (0, 2.06, 0.19))
    add_part(p, cylinder(0.44, 0.47, 0.12, 36), 3, (0, 1.36, 0), scl=(0.9, 1, 0.46))
    add_part(p, cylinder(0.46, 0.56, 0.54, 36), 3, (0, 1.1, 0), scl=(0.92, 1, 0.48))
    add_part(p, box(0.1, 0.38, 0.025), 4, (-0.34, 1.05, 0.2), rot=(0, 0, -0.18))
    add_part(p, box(0.1, 0.38, 0.025), 4, (0.34, 1.05, 0.2), rot=(0, 0, 0.18))
    add_part(p, cylinder(0.12, 0.13, 0.18, 24), 1, (0, 2.57, 0))
    add_part(p, sphere(0.24, 0.29, 0.22, 32, 16), 1, (0.01, 2.86, 0.02))
    add_part(p, sphere(0.11, 0.065, 0.08, 18, 10), 1, (0.005, 2.68, 0.105))
    for x, y, z, r in [
        (-0.18, 3.07, -0.02, 0.13), (-0.06, 3.12, 0.03, 0.15), (0.08, 3.1, 0.02, 0.14),
        (0.2, 3.04, -0.02, 0.12), (-0.27, 2.96, 0, 0.12), (0.27, 2.96, 0, 0.12),
        (-0.12, 3.0, 0.12, 0.1), (0.12, 3.0, 0.12, 0.1), (0.0, 3.18, -0.03, 0.11)
    ]:
        add_part(p, sphere(r, r, r, 14, 8), 5, (x, y, z))
    add_part(p, sphere(0.018, 0.018, 0.018, 10, 6), 5, (-0.075, 2.9, 0.23))
    add_part(p, sphere(0.018, 0.018, 0.018, 10, 6), 5, (0.08, 2.9, 0.23))
    add_part(p, box(0.12, 0.012, 0.01), 5, (0.005, 2.72, 0.245))
    for name_x, zrot in [(-0.43, -0.16), (0.43, 0.16)]:
        add_part(p, cylinder(0.09, 0.08, 0.62, 24), 0, (name_x, 2.02, 0.03), rot=(0, 0, zrot))
    add_part(p, cylinder(0.075, 0.065, 0.62, 24), 0, (-0.53, 1.48, 0.02), rot=(0, 0, -0.08))
    add_part(p, cylinder(0.075, 0.065, 0.62, 24), 0, (0.53, 1.48, 0.02), rot=(0, 0, 0.08))
    add_part(p, sphere(0.06, 0.082, 0.042, 16, 10), 0, (-0.57, 1.13, 0.02))
    add_part(p, sphere(0.06, 0.082, 0.042, 16, 10), 0, (0.57, 1.13, 0.02))
    add_part(p, cylinder(0.14, 0.12, 0.58, 24), 0, (-0.19, 0.62, 0), rot=(0, 0, 0.03))
    add_part(p, cylinder(0.14, 0.12, 0.58, 24), 0, (0.19, 0.62, 0), rot=(0, 0, -0.03))
    add_part(p, cylinder(0.105, 0.075, 0.62, 24), 0, (-0.19, 0.03, 0.01), rot=(0, 0, -0.02))
    add_part(p, cylinder(0.105, 0.075, 0.62, 24), 0, (0.19, 0.03, 0.01), rot=(0, 0, 0.02))
    add_part(p, box(0.28, 0.11, 0.48), 6, (-0.2, -0.34, 0.1), rot=(0.02, 0, 0))
    add_part(p, box(0.28, 0.11, 0.48), 6, (0.2, -0.34, 0.1), rot=(0.02, 0, 0))
    add_part(p, box(0.16, 0.018, 0.012), 4, (-0.2, -0.3, 0.345), rot=(0, 0, -0.28))
    add_part(p, box(0.16, 0.018, 0.012), 4, (0.2, -0.3, 0.345), rot=(0, 0, 0.28))
    add_part(p, cylinder(0.58, 0.58, 0.012, 64), 7, (0, -0.42, 0), scl=(1, 0.08, 1))
    return p


def pad4(data):
    return data + (b"\x00" * ((4 - len(data) % 4) % 4))


def pad4_json(data):
    return data + (b" " * ((4 - len(data) % 4) % 4))


def write_glb():
    primitives = build_primitives()
    bin_blob = bytearray()
    buffer_views = []
    accessors = []
    gltf_prims = []

    def add_blob(raw, target=None):
        nonlocal bin_blob
        bin_blob.extend(b"\x00" * ((4 - len(bin_blob) % 4) % 4))
        offset = len(bin_blob)
        bin_blob.extend(raw)
        idx = len(buffer_views)
        view = {"buffer": 0, "byteOffset": offset, "byteLength": len(raw)}
        if target:
            view["target"] = target
        buffer_views.append(view)
        return idx

    for mat_i, verts, norms, idx in primitives:
        pos_raw = b"".join(struct.pack("<3f", *v) for v in verts)
        norm_raw = b"".join(struct.pack("<3f", *n) for n in norms)
        idx_raw = b"".join(struct.pack("<I", i) for i in idx)
        pos_view = add_blob(pos_raw, 34962)
        norm_view = add_blob(norm_raw, 34962)
        idx_view = add_blob(idx_raw, 34963)
        xs, ys, zs = zip(*verts)
        pos_acc = len(accessors)
        accessors.append({
            "bufferView": pos_view, "componentType": 5126, "count": len(verts),
            "type": "VEC3", "min": [min(xs), min(ys), min(zs)], "max": [max(xs), max(ys), max(zs)]
        })
        norm_acc = len(accessors)
        accessors.append({"bufferView": norm_view, "componentType": 5126, "count": len(norms), "type": "VEC3"})
        idx_acc = len(accessors)
        accessors.append({"bufferView": idx_view, "componentType": 5125, "count": len(idx), "type": "SCALAR"})
        gltf_prims.append({
            "attributes": {"POSITION": pos_acc, "NORMAL": norm_acc},
            "indices": idx_acc,
            "material": mat_i
        })

    bin_padded = pad4(bytes(bin_blob))
    doc = {
        "asset": {"version": "2.0", "generator": "Codex procedural basketball figure"},
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0, "name": "basketballFigure"}],
        "meshes": [{"name": "basketballFigureMesh", "primitives": gltf_prims}],
        "materials": [
            {
                "name": name,
                "pbrMetallicRoughness": {
                    "baseColorFactor": color,
                    "metallicFactor": metallic,
                    "roughnessFactor": roughness,
                },
                "emissiveFactor": emissive,
            }
            for name, color, emissive, metallic, roughness in materials
        ],
        "buffers": [{"byteLength": len(bin_padded)}],
        "bufferViews": buffer_views,
        "accessors": accessors,
    }
    json_chunk = pad4_json(json.dumps(doc, separators=(",", ":")).encode("utf-8"))
    total = 12 + 8 + len(json_chunk) + 8 + len(bin_padded)
    glb = bytearray()
    glb.extend(b"glTF")
    glb.extend(struct.pack("<II", 2, total))
    glb.extend(struct.pack("<I4s", len(json_chunk), b"JSON"))
    glb.extend(json_chunk)
    glb.extend(struct.pack("<I4s", len(bin_padded), b"BIN\x00"))
    glb.extend(bin_padded)
    OUT.write_bytes(glb)
    print(f"Wrote {OUT} ({len(glb)} bytes)")


if __name__ == "__main__":
    write_glb()

"""EIDOLON kit: a dress-form mannequin and a thread spool prop. Deterministic.
Run: Blender -b -P model/build.py   (writes model/source.blend, model/exports/*.glb, model/renders/poster.png)"""
import bpy, math, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "exports")
os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.join(HERE, "renders"), exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

def mat(name, color, metal=0.0, rough=0.5, emit=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    return m

M = {
    "bone": mat("Bone", (0.92, 0.89, 0.86), 0, 0.7),
    "chrome": mat("Chrome", (0.78, 0.79, 0.79), 0.9, 0.2),
    "thread": mat("ElectricThread", (0.42, 0.36, 1.0), 0, 0.3, (0.42, 0.36, 1.0), 1.2),
}

def obj(name, mesh_fn, material, loc=(0, 0, 0), parent=None):
    bpy.ops.object.select_all(action="DESELECT")
    mesh_fn()
    o = bpy.context.active_object
    o.name = name
    o.location = loc
    o.data.materials.append(M[material] if isinstance(material, str) else material)
    if parent:
        o.parent = parent
    return o

def empty(name, loc, parent=None):
    e = bpy.data.objects.new(name, None)
    scene.collection.objects.link(e)
    e.location = loc
    if parent:
        e.parent = parent
    return e

def smooth(o):
    for p in o.data.polygons: p.use_smooth = True

# --- dress form: a torso cone/ellipsoid on a chrome stand
form_root = empty("DressForm", (0, 0, 0))
torso = obj("FormTorso", lambda: bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=14, radius=0.5), "bone", (0, 0, 1.1), form_root)
torso.scale = (0.8, 0.55, 1.1); smooth(torso)
neck = obj("FormNeck", lambda: bpy.ops.mesh.primitive_cylinder_add(vertices=14, radius=0.08, depth=0.2), "bone", (0, 0, 1.75), form_root)
pole = obj("FormPole", lambda: bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.03, depth=1.1), "chrome", (0, 0, 0.45), form_root)
base = obj("FormBase", lambda: bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.3, depth=0.04), "chrome", (0, 0, -0.08), form_root)

# --- thread spool
spool_root = empty("ThreadSpool", (0, 0, 0))
body = obj("SpoolBody", lambda: bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.15, depth=0.3), "thread", (0, 0, 0), spool_root)
for sz in (-0.16, 0.16):
    obj("SpoolCap", lambda: bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.18, depth=0.02), "chrome", (0, 0, sz), spool_root)
smooth(body)

def hide(o):
    o.hide_render = True
    for c in o.children: hide(c)
bpy.ops.object.camera_add(location=(2.4, -2.6, 1.6)); cam_o = bpy.context.active_object
cam_o.name = "PosterCam"; scene.camera = cam_o; cam_o.data.lens = 42
cam_o.rotation_euler = (1.2, 0, 0.6)
for name, loc, e, col in (("Key", (-2, -3, 3), 900, (0.92, 0.89, 0.86)), ("Rim", (3, 2, 2), 700, (0.72, 0.07, 0.17)), ("Fill", (0, -1, -1), 200, (0.42, 0.36, 1.0))):
    bpy.ops.object.light_add(type="POINT", location=loc); l = bpy.context.active_object
    l.name = name; l.data.energy = e; l.data.color = col
world = bpy.data.worlds.new("Ink"); scene.world = world; world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.004, 0.004, 0.004, 1)
scene.render.engine = "BLENDER_EEVEE_NEXT"
scene.render.resolution_x, scene.render.resolution_y = 1280, 720
scene.render.filepath = os.path.join(HERE, "renders", "poster.png")

def export(name, parents):
    bpy.ops.object.select_all(action="DESELECT")
    def pick(o):
        o.select_set(True)
        for c in o.children: pick(c)
    for p in parents: pick(p)
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, name), export_format="GLB", use_selection=True,
                              export_apply=True, export_yup=True, export_cameras=False, export_lights=False)

export("dress-form.glb", [form_root])
export("thread-spool.glb", [spool_root])
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "source.blend"))
try:
    bpy.ops.render.render(write_still=True)
except Exception as e:
    print("poster render failed:", e)
print("BUILD OK")

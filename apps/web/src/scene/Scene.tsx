"use client";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { drapeAmountAt, walkPhaseAt, wrapAmountAt } from "@eidolon/domain";
import type { Data } from "../data";
import { base } from "../data";
import { live, state, useStore } from "../store";

// Palette: Ink #090909, Bone #EAE4DA, Chrome #C6C8CA, Couture Red #B7112C, Electric Thread #6A5CFF, Skin #D7B9A3.
const garmentVert = /* glsl */ `
uniform float uWrap; uniform float uDrape; uniform float uSew;
varying vec3 vN; varying vec2 vUv;
void main(){
  vUv = uv;
  float cx = (uv.x - 0.5);
  float angle = cx * 2.6;
  float radius = 0.5;
  vec3 flatP = vec3(cx * 1.3, (0.5 - uv.y) * 1.7 + 1.0, 0.0);
  vec3 wrapP = vec3(sin(angle) * radius, flatP.y, cos(angle) * radius - radius * 0.3);
  vec3 p = mix(flatP, wrapP, uWrap);
  float sag = sin(uv.x * 3.14159) * pow(uv.y, 1.6) * uDrape * 0.5;
  p.y -= sag; p.z += sag * 0.6;
  p.x *= uSew; // seam stage: panels pull together from the sides
  vec4 world = modelMatrix * vec4(p, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}`;
const garmentFrag = /* glsl */ `
uniform vec3 uColor;
varying vec3 vN; varying vec2 vUv;
void main(){
  float light = 0.5 + 0.5 * max(0.0, dot(vN, normalize(vec3(0.4, 0.6, 0.8))));
  vec3 col = uColor * (0.35 + light * 0.75);
  float seamLine = smoothstep(0.0, 0.015, abs(vUv.x - 0.5));
  col = mix(vec3(0.42, 0.36, 1.0), col, seamLine);
  gl_FragColor = vec4(col, 1.0);
}`;

function Garment({ data }: { data: Data }) {
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1, 24, 32), []);
  const mat = useMemo(() => new THREE.ShaderMaterial({ side: THREE.DoubleSide, vertexShader: garmentVert, fragmentShader: garmentFrag, uniforms: { uWrap: { value: 0 }, uDrape: { value: 0 }, uSew: { value: 0.3 }, uColor: { value: new THREE.Color("#D7B9A3") } } }), []);
  const ref = useRef<THREE.Group>(null);
  useFrame((st) => {
    const s = state, fabric = data.fabrics.find((f) => f.id === s.fabricId) ?? data.fabrics[0];
    mat.uniforms.uWrap.value = wrapAmountAt(s.t);
    mat.uniforms.uDrape.value = drapeAmountAt(s.t, fabric.stiffness);
    mat.uniforms.uSew.value = THREE.MathUtils.lerp(0.3, 1, Math.min(1, s.t / 3));
    mat.uniforms.uColor.value.set(fabric.colorHex);
    if (ref.current) { const walk = walkPhaseAt(s.t, st.clock.elapsedTime); ref.current.rotation.y = walk * Math.PI * 2; }
  });
  return <group ref={ref}><mesh geometry={geo} material={mat} /></group>;
}

function DressForm() {
  const gltf = useLoader(GLTFLoader, `${base}/models/dress-form.glb`);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf]);
  const ref = useRef<THREE.Group>(null);
  useFrame(() => { if (ref.current) ref.current.visible = state.t >= 2.3; });
  return <group ref={ref} position={[0, -0.05, 0]}><primitive object={scene} /></group>;
}

function ThreadSpool() {
  const gltf = useLoader(GLTFLoader, `${base}/models/thread-spool.glb`);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf]);
  const ref = useRef<THREE.Group>(null);
  useFrame(() => { if (ref.current) { ref.current.visible = state.t < 1.3; ref.current.rotation.z += 0.01; } });
  return <group ref={ref} position={[-1, 1.2, 0.3]} scale={1.4}><primitive object={scene} /></group>;
}

function Rig() {
  const { camera } = useThree(), want = useMemo(() => new THREE.Vector3(), []), tgt = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  useFrame((_, dt) => {
    const s = state;
    if (!s.introDone) want.set(-0.6 + live.sewProgress * 0.6, 1.1, 2.6 - live.sewProgress * 0.4);
    else want.set(s.t >= 5.5 ? 1.6 : 0.2, 1.3, 2.4);
    const k = s.reduced ? 1 : 1 - Math.exp(-dt * 2.6);
    camera.position.lerp(want, k); (camera as THREE.PerspectiveCamera).lookAt(tgt);
  });
  return null;
}

function Lifecycle() {
  const { setFrameloop, gl } = useThree();
  useEffect(() => {
    const vis = () => setFrameloop(document.hidden ? "never" : "always");
    const lost = (e: Event) => e.preventDefault();
    document.addEventListener("visibilitychange", vis); gl.domElement.addEventListener("webglcontextlost", lost);
    return () => { document.removeEventListener("visibilitychange", vis); gl.domElement.removeEventListener("webglcontextlost", lost); };
  }, [setFrameloop, gl]);
  return null;
}

declare global { interface Window { __eidolonData?: Data; __eidolonStats?: () => unknown } }
function Stats() {
  const gl = useThree((s) => s.gl);
  useEffect(() => { window.__eidolonStats = () => ({ calls: gl.info.render.calls, triangles: gl.info.render.triangles, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures }); }, [gl]);
  return null;
}

export default function Scene({ data }: { data: Data }) {
  useStore();
  window.__eidolonData = data;
  return (
    <Canvas className="stage" data-testid="stage" dpr={[1, 1.5]} camera={{ fov: 42, near: 0.1, far: 50, position: [0.2, 1.3, 2.4] }} gl={{ antialias: false, powerPreference: "high-performance" }} onCreated={({ gl }) => gl.setClearColor("#090909")}>
      <ambientLight intensity={0.4} color="#C6C8CA" /><directionalLight position={[2, 3, 3]} intensity={1.4} color="#EAE4DA" />
      <Rig /><Garment data={data} /><DressForm /><ThreadSpool /><Lifecycle /><Stats />
    </Canvas>
  );
}

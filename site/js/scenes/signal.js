// Act VI: Signal — contact finale with knot glyph
export function createScene(ctx) {
  const { THREE, scene, camera } = ctx;
  let group = null;

  return {
    mount() {
      group = new THREE.Group();
      scene.add(group);
      // Placeholder: rotating square
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1, -1, 0),
        new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(1, 1, 0),
        new THREE.Vector3(-1, 1, 0),
        new THREE.Vector3(-1, -1, 0)
      ]);
      const mat = new THREE.LineBasicMaterial({ color: 0x5FBF8E });
      const line = new THREE.Line(geom, mat);
      group.add(line);
      console.log('[signal] Scene mounted');
    },

    unmount() {
      if (group) {
        scene.remove(group);
        group.clear();
        group = null;
      }
    },

    tick(progress, time) {
      if (!group) return;
      group.rotation.z = time * 0.1;
    },

    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },

    setQuality(tier) {}
  };
}

// Act IV: Capital — thread trifurcation into streams
export function createScene(ctx) {
  const { THREE, scene, camera } = ctx;
  let group = null;

  return {
    mount() {
      group = new THREE.Group();
      scene.add(group);
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(1, 0, 0)
      ]);
      const mat = new THREE.LineBasicMaterial({ color: 0xE08D66 });
      const line = new THREE.LineSegments(geom, mat);
      group.add(line);
      console.log('[capital] Scene mounted');
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
    },

    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },

    setQuality(tier) {}
  };
}

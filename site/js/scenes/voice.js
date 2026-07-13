// Act V: Voice — horizon thread behind editorial index
export function createScene(ctx) {
  const { THREE, scene, camera } = ctx;
  let group = null;

  return {
    mount() {
      group = new THREE.Group();
      scene.add(group);
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2, 0, 0),
        new THREE.Vector3(2, 0, 0)
      ]);
      const mat = new THREE.LineBasicMaterial({ color: 0x56C4D6 });
      const line = new THREE.Line(geom, mat);
      group.add(line);
      console.log('[voice] Scene mounted');
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

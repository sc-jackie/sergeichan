// Act II: Work — five chords + case overlay
// Scene contract: createScene(ctx) → {mount, unmount, tick(progress, time), resize, setQuality}

export function createScene(ctx) {
  const { THREE, scene, camera } = ctx;
  let group = null;

  return {
    mount() {
      group = new THREE.Group();
      scene.add(group);

      // Placeholder: minimal geometry
      const geom = new THREE.BoxGeometry(1, 1, 1);
      const mat = new THREE.MeshBasicMaterial({ color: 0x7C93E8, wireframe: true });
      const mesh = new THREE.Mesh(geom, mat);
      group.add(mesh);

      console.log('[work] Scene mounted');
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
      group.rotation.y = time * 0.2;
    },

    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },

    setQuality(tier) {}
  };
}

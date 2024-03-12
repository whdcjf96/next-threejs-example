"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function FocusCursor() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x007bff);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    (containerRef.current as HTMLElement).appendChild(renderer.domElement);

    const onMouseMove = (event: any) => {
      const x = (event.clientX / window.innerWidth) * 2 - 3;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      const object = scene.children[0];
      if (object) {
        object.rotation.y = x * Math.PI;
        object.rotation.x = -y * Math.PI;
      }
    };

    const loader = new GLTFLoader();
    loader.load("/three/scene.gltf", (gltf) => {
      scene.add(gltf.scene);

      // 마우스 이벤트 리스너 추가
      window.addEventListener("mousemove", onMouseMove);

      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <div ref={containerRef}></div>;
}

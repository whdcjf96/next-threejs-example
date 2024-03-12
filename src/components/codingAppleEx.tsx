"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function CodingAppleEx() {
  const containerRef = useRef<HTMLCanvasElement>(null); // Change the type to HTMLCanvasElement
  useEffect(() => {
    if (typeof window !== "undefined") {
      const scene = new THREE.Scene(); // 장면 만들기
      scene.background = new THREE.Color(0x007bff); // 배경색 설정
      //   const light = new THREE.DirectionalLight(0x686868, 1); // 조명 만들기
      //   light.position.set(1, 1, 1).normalize(); // 조명 위치 설정
      //   scene.add(light); // 장면에 조명 추가
      const camera = new THREE.PerspectiveCamera( // 카메라 만들기 - PerspectiveCamera(시야각, 종횡비, 근접 클리핑 평면, 원거리 클리핑 평면, (원근법 적용 카메라)) , OrthographicCamera(좌, 우, 상, 하, 근접 클리핑 평면, 원거리 클리핑 평면, (직교 카메라))
        30, // 시야각(Field of View)
        1 // 종횡비(Aspect Ratio)
      );
      camera.position.set(0, 0, 5); // 카메라 위치 설정
      const renderer = new THREE.WebGLRenderer({
        canvas: containerRef.current as HTMLCanvasElement, // Change the type to HTMLCanvasElement
        antialias: true, // 안티앨리어싱 설정
      }); // 렌더러 만들기
      renderer.outputColorSpace = THREE.SRGBColorSpace; // 색상 공간 설정

      const loader = new GLTFLoader();
      loader.load("/three/scene.gltf", (gltf) => {
        scene.add(gltf.scene);

        // OrbitControls 초기화
        const controls = new OrbitControls(camera, renderer.domElement);

        // 컨트롤들을 원하는 대로 설정
        controls.target.set(0, 0, 0); // 컨트롤의 타겟을 설정 (모델의 위치에 따라 조정)
        controls.update(); // 컨트롤 업데이트

        function animate() {
          requestAnimationFrame(animate);
          controls.update(); // 컨트롤 업데이트

          renderer.render(scene, camera);
        }
        animate();
      });
    }
  }, []);

  return (
    <div>
      <canvas
        ref={containerRef as React.LegacyRef<HTMLCanvasElement>}
        id="canvas"
        width={300}
        height={300}
      ></canvas>
    </div>
  );
}

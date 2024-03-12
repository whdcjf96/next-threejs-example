"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Test() {
  // 컴포넌트가 마운트될 때 DOM에 접근하기 위한 ref를 생성합니다.
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 서버 사이드 렌더링을 방지하기 위해 window 객체의 존재 여부를 확인합니다.
    if (typeof window !== "undefined") {
      // 씬 생성: 3D 공간의 컨테이너 역할을 합니다.
      const scene = new THREE.Scene();

      // 카메라 생성: 3D 공간에서 사용자의 시점을 정의합니다.
      const camera = new THREE.PerspectiveCamera(
        75, // 시야각(Field of View)
        window.innerWidth / window.innerHeight, // 종횡비(Aspect Ratio)
        0.1, // 근접 클리핑 평면(Near Clipping Plane)
        1000 // 원거리 클리핑 평면(Far Clipping Plane)
      );

      // 렌더러 생성: 씬과 카메라를 이용해 화면에 그립니다.
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);

      // 생성된 렌더러의 DOM 요소를 페이지에 추가합니다.
      containerRef.current?.appendChild(renderer.domElement);
      camera.position.z = 5;

      // 큐브 생성: 기하학적 형태와 재질을 정의합니다.
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube); // 씬에 큐브 추가

      // 씬과 카메라를 렌더링합니다. (이 코드는 단 한 번만 씬을 렌더링합니다.)
      renderer.render(scene, camera);

      // 씬을 애니메이션으로 렌더링하는 함수를 정의합니다.
      const renderScene = () => {
        cube.rotation.x += 0.01; // 큐브를 X축으로 회전
        cube.rotation.y += 0.01; // 큐브를 Y축으로 회전
        renderer.render(scene, camera); // 변경된 씬을 다시 렌더링
        requestAnimationFrame(renderScene); // 다음 프레임에서 이 함수를 다시 호출
      };

      // 애니메이션 루프를 시작합니다.
      renderScene();

      // 브라우저 창 크기가 변경될 때 카메라와 렌더러를 업데이트하는 함수입니다.
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height; // 카메라 종횡비 업데이트
        camera.updateProjectionMatrix(); // 카메라 투영 매트릭스 업데이트

        renderer.setSize(width, height); // 렌더러 크기 업데이트
      };

      // 창 크기 변경 이벤트에 대응하기 위해 이벤트 리스너를 등록합니다.
      window.addEventListener("resize", handleResize);

      // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거하는 정리 함수입니다.
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);
  return <div ref={containerRef}></div>;
}

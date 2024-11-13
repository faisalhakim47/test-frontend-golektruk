import { SyntheticEvent, useCallback, useEffect, useState } from 'react';

const Soal1 = () => {
  // 1. Buat kotak dibawah menjadi elemen drag and drop tanpa menggunakan plugin
  return (
    <>
      <Solusi1 />

      {/* Ekspektasi hasil */}
      <iframe src="/soal1.mp4" style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        border: "1px solid white",
      }}></iframe>
    </>
  )
}

const Solusi1 = () => {
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const [movementX, setMovementX] = useState(0);
  const [movementY, setMovementY] = useState(0);

  // State ini tidak reactive
  // Hanya digunakan untuk menyimpan state drag tanpa mempengaruhi render
  const [dragState] = useState({
    isDragging: false,
    top: 0,
    left: 0,
    startX: 0,
    startY: 0,
    movementX: 0,
    movementY: 0,
  });

  // Ambil posisi awal
  const handleMouseDown = useCallback((event: SyntheticEvent) => {
    assertInstanceOf(event.nativeEvent, MouseEvent);
    dragState.isDragging = true;
    dragState.top = top;
    dragState.left = left;
    dragState.startY = event.nativeEvent.clientY;
    dragState.startX = event.nativeEvent.clientX;
    dragState.movementY = 0;
    dragState.movementX = 0;
  }, [dragState, top, left]);

  // Kenapa bind event ke document? Karena kecepatan cursor bisa melebihi kecepatan render
  // sehinga cursor bisa keluar dari elemen yang di-drag
  useEffect(() => {
    // Selisihkan posisi awal dengan pergerakan mouse saat drag
    const handleMouseMove = (event: unknown) => {
      assertInstanceOf(event, MouseEvent);
      if (dragState.isDragging) {
        // update realtime style posisi elemen
        setMovementX(event.clientX - dragState.startX);
        setMovementY(event.clientY - dragState.startY);
        // update state untuk perhitungan posisi akhir
        dragState.movementX = event.clientX - dragState.startX;
        dragState.movementY = event.clientY - dragState.startY;
      }
    };

    // Update posisi ke terakhir, dan reset state drag
    const handleMouseUp = (event: unknown) => {
      assertInstanceOf(event, MouseEvent);

      setTop(dragState.top + dragState.movementY);
      setLeft(dragState.left + dragState.movementX);

      setMovementY(0);
      setMovementX(0);
      dragState.isDragging = false;
      dragState.startY = 0;
      dragState.startX = 0;
      dragState.movementY = 0;
      dragState.movementX = 0;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        backgroundColor: '#fff',
        width: 40,
        height: 40,
        borderRadius: '8px',
        position: 'relative',
        top: `${top + movementY}px`,
        left: `${left + movementX}px`,
      }}
    ></div>
  );
};

export default Soal1

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertInstanceOf<T>(value: unknown, constructor: new (...args: any[]) => T, message?: string): asserts value is T {
  if (!(value instanceof constructor)) {
    throw new Error(message || `Expected value to be an instance of ${constructor.name}`);
  }
}

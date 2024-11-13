import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { assertInstanceOf } from '../tools/assert.ts';

const Soal1 = () => {
  // 1. Buat kotak dibawah menjadi elemen drag and drop tanpa menggunakan plugin
  return (
    <>
      <Solusi />

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

const Solusi = () => {
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [movementX, setMovementX] = useState(0);
  const [movementY, setMovementY] = useState(0);

  // Ambil posisi awal
  const handleMouseDown = useCallback((event: SyntheticEvent) => {
    assertInstanceOf(event.nativeEvent, MouseEvent);
    setIsDragging(true);
    setStartX(event.nativeEvent.clientX);
    setStartY(event.nativeEvent.clientY);
  }, []);

  // Selisihkan posisi awal dengan pergerakan mouse saat drag
  // const handleMouseMove = useCallback((event: SyntheticEvent) => {
  //   assertInstanceOf(event.nativeEvent, MouseEvent);
  //   if (isDragging) {
  //     setMovementX(event.nativeEvent.clientX - startX);
  //     setMovementY(event.nativeEvent.clientY - startY);
  //   }
  // }, [isDragging, startX, startY]);

  useEffect(() => {
    const handleMouseMove = (event: unknown) => {
      assertInstanceOf(event, MouseEvent);
      if (isDragging) {
        setMovementX(event.clientX - startX);
        setMovementY(event.clientY - startY);
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  // Kenapa tidak dependency ke isDragging?
  // Kita tidak perlu melisten isDragging karena hanya digunakan untuk checking.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Terapkan position akhir dan reset drag state
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setLeft(left + movementX);
    setTop(top + movementY);
    setStartX(0);
    setStartY(0);
    setMovementX(0);
    setMovementY(0);
  }, [left, top, movementX, movementY]);

  return (
    <div
      onMouseDown={handleMouseDown}
      // onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
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
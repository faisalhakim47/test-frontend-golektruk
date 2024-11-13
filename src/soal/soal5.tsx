import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Soal5 = () => {
  // 5. buatlah fungsi untuk menutup modal ketika tombol back browser diklik

  /**
   * Solusi favorit saya untuk requirement ini adalah dengan menggunakan hash URL
   * Alasan utamanya adalah mekanisme ini align dengan spesifikasi HTML dan Web API
   * Pada dasarnya hash URL digunakan untuk navigasi ke section tertentu pada suatu halaman HTML
   * Nah, kita bisa memanfaatkan hash URL untuk menampilkan section tertentu seperti modal dengan menambahkan hash tertentu seperti `#modal`
   * Dengan begitu navigasi back dan forward browser dapat bekerja sesuai ekspektasi
   * Tidak perlu melakukan manipulasi history API
   */

  const locationHash = useLocationHash();
  const isModalOpen = locationHash.includes('modal');

  const handleBackButton = useCallback((event: SyntheticEvent) => {
    if (isModalOpen) {
      assertInstanceOf(event.nativeEvent, Event);
      event.nativeEvent.preventDefault();
      window.history.back();
    }
  }, [isModalOpen]);

  return (
    <>
      <div style={{ margin: "1rem" }}>
        <Modal />
        <a
          href="#modal"
          style={{ padding: "2px 4px", background: "white" }}
          onClick={handleBackButton}
        >{isModalOpen ? "Close" : "Open"}</a>
      </div>

      {/* Ekspektasi hasil */}
      <iframe
        src="/soal5.mp4"
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          border: "1px solid white",
        }}
      ></iframe>
    </>
  );
};

const Modal = () => {
  const modalRoot = document.getElementById("modal-root");

  const locationHash = useLocationHash();
  const isModalOpen = locationHash.includes('modal');

  if (!modalRoot) return <></>;

  return ReactDOM.createPortal(
    <dialog open={isModalOpen} style={{ background: "#8f9cb0", padding: "3rem", position: "fixed", margin: "6rem" }}>
      <div>This is modal</div>
    </dialog>,
    modalRoot
  );
};

function useLocationHash() {
  const [locationHash, setLocationHash] = useState<string>(window.location.hash);

  // Listen to hash change
  useEffect(() => {
    const handleHashChange = () => {
      setLocationHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  });

  return locationHash;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertInstanceOf<T>(value: unknown, constructor: new (...args: any[]) => T, message?: string): asserts value is T {
  if (!(value instanceof constructor)) {
    throw new Error(message || `Expected value to be an instance of ${constructor.name}`);
  }
}


export default Soal5;

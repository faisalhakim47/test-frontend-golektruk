import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';

const data = [
  { id: 1, country: 'United States' },
  { id: 2, country: 'Canada' },
  { id: 3, country: 'Mexico' },
  { id: 4, country: 'Brazil' },
  { id: 5, country: 'Argentina' },
  { id: 6, country: 'United Kingdom' },
  { id: 7, country: 'France' },
  { id: 8, country: 'Germany' },
  { id: 9, country: 'Italy' },
  { id: 10, country: 'Spain' },
  { id: 11, country: 'Russia' },
  { id: 12, country: 'China' },
  { id: 13, country: 'Japan' },
  { id: 14, country: 'South Korea' },
  { id: 15, country: 'India' },
  { id: 16, country: 'Australia' },
  { id: 17, country: 'South Africa' },
  { id: 18, country: 'Egypt' },
  { id: 19, country: 'Nigeria' },
  { id: 20, country: 'Kenya' }
];

function Soal2() {
  // buatlah select box tanpa menggunakan plugin

  const selectFieldRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [openComboBox, setOpenComboBox] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);

  const handleInputOnInput = useCallback((event: SyntheticEvent) => {
    assertInstanceOf(event.target, HTMLInputElement);
    setInputValue(event.target.value);
  }, []);

  const handleInputOnFocus = useCallback(() => {
    setOpenComboBox(true);
    setFocusIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        if (openComboBox) {
          setFocusIndex((prev) => Math.min(prev + 1, data.length - 1));
        }
        else {
          setOpenComboBox(true);
        }
      }
      else if (event.key === "ArrowUp") {
        setFocusIndex((prev) => Math.max(prev - 1, 0));
      }
      else if (event.key === "Enter") {
        setOpenComboBox(false);
        setInputValue(data[focusIndex].country);
      }
      else if (event.key === "Escape") {
        setOpenComboBox(false);
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      assertInstanceOf(event.target, HTMLElement);
      if (selectFieldRef.current && !selectFieldRef.current.contains(event.target)) {
        setOpenComboBox(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [focusIndex, openComboBox]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "100px",
      }}
    >
      <div>

        <div ref={selectFieldRef} style={{ margin: "8px 0px" }}>
          <label
            htmlFor="countrySelectInput"
            style={{
              fontSize: "18px",
              color: "white",
            }}
          >Country:</label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <input
              id="countrySelectInput"
              type="text"
              placeholder="Select"
              value={inputValue}
              onInput={handleInputOnInput}
              onFocus={handleInputOnFocus}
              style={{
                backgroundColor: "white",
                padding: "8px",
                borderRadius: "8px"
              }}
            />
            <div
              style={{
                position: "relative",
                display: openComboBox ? "block" : "none",
                height: "100%",
              }}
            >
              <button
                type="button"
                style={{
                  position: "absolute",
                  top: 0,
                  right: "100%",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  padding: "8px 12px",
                }}
                onClick={() => setOpenComboBox(false)}
              >X</button>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              display: openComboBox ? "block" : "none",
            }}
          >
            <ul
              role="listbox"
              style={{
                position: "absolute",
                top: "6px",
                left: "0",
                listStyle: "none",
                backgroundColor: "white",
                width: "100%",
                padding: "0px",
                margin: "0px",
                borderRadius: "8px",
              }}
            >
              {data.map((item, index) => (
                <li
                  key={item.id}
                  role="option"
                  onMouseEnter={() => setFocusIndex(index)}
                  onClick={() => {
                    setInputValue(item.country);
                    setOpenComboBox(false);
                  }}
                  data-index={index}
                  style={{
                    padding: "4px 8px",
                    cursor: "pointer",
                    backgroundColor: focusIndex === index ? "lightgray" : "white",
                    borderRadius: "8px",
                  }}
                >{item.country}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ margin: "8px 0px" }}>
          <label
            htmlFor="countrySelectInput"
            style={{
              fontSize: "18px",
              color: "white",
            }}
          >Country (Native):</label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <input
              id="countrySelectInput"
              type="text"
              placeholder="Select"
              autoComplete="list"
              list="countryList"
              style={{
                backgroundColor: "white",
                padding: "8px",
                borderRadius: "8px"
              }}
            />
          </div>
          <datalist id="countryList">
            {data.map((item) => (
              <option key={item.id} value={item.country} />
            ))}
          </datalist>
        </div>

      </div>

      {/* Ekspektasi hasil */}
      <iframe src="/soal2.mp4" style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        border: "1px solid white",
      }}></iframe>
    </div>
  );
}

export default Soal2

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertInstanceOf<T>(value: unknown, constructor: new (...args: any[]) => T, message?: string): asserts value is T {
  if (!(value instanceof constructor)) {
    throw new Error(message || `Expected value to be an instance of ${constructor.name}`);
  }
}

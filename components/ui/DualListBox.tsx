import React, { useState } from "react";

export interface CustomDualListItem {
  key: string;
  title: string; 
  disabled?: boolean;
  [propName: string]: any;
}

export interface CustomDualListProps {
  data: CustomDualListItem[];
  targetKeys: string[];
  setTargetKeys: (keys: string[]) => void;
  titleLeft?: string;
  titleRight?: string;
  height?: number;
  disabled?: boolean;
}

const CustomDualList: React.FC<CustomDualListProps> = ({
  data,
  targetKeys,
  setTargetKeys,
  titleLeft = "Disponibles",
  titleRight = "Asignados",
  height = 300,
  disabled = false,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
  const [selectedRight, setSelectedRight] = useState<string[]>([]);
  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");

  const leftData = data.filter(
    (item) =>
      !targetKeys.includes(item.key) &&
      (
        item.plainText && typeof item.plainText === "string" ? item.plainText : item.title
      )
        .toLowerCase()
        .includes(searchLeft.toLowerCase())
  );
  const rightData = data.filter(
    (item) =>
      targetKeys.includes(item.key) &&
      (
        item.plainText && typeof item.plainText === "string" ? item.plainText : item.title
      )
        .toLowerCase()
        .includes(searchRight.toLowerCase())
  );

  const moveAllRight = () => {
    if (!disabled) {
      setTargetKeys(data.map((item) => item.key));
      setSelectedLeft([]);
      setSelectedRight([]);
    }
  };

  const moveSelectedRight = () => {
    if (!disabled) {
      const newKeys = Array.from(new Set([...targetKeys, ...selectedLeft]));
      setTargetKeys(newKeys);
      setSelectedLeft([]);
    }
  };

  const moveSelectedLeft = () => {
    if (!disabled) {
      const newKeys = targetKeys.filter((k) => !selectedRight.includes(k));
      setTargetKeys(newKeys);
      setSelectedRight([]);
    }
  };

  const moveAllLeft = () => {
    if (!disabled) {
      setTargetKeys([]);
      setSelectedLeft([]);
      setSelectedRight([]);
    }
  };

  const toggleSelect = (
    key: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(key)) {
      setSelected(selected.filter((id) => id !== key));
    } else {
      setSelected([...selected, key]);
    }
  };

  const renderList = (
    items: CustomDualListItem[],
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    searchValue: string,
    onSearchChange: (value: string) => void
  ) => (
    <>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          width: "100%",
          padding: "6px 10px",
          marginBottom: 6,
          fontSize: 14,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
        disabled={disabled}
      />
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          height,
          overflowY: "auto",
          backgroundColor: "#fff",
        }}
      >
        {items.length === 0 ? (
          <div style={{ padding: 8, textAlign: "center", color: "#999" }}>
            Sin resultados
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selected.includes(item.key);
            const isDisabled = item.disabled || disabled;

            return (
              <div
                key={item.key}
                onClick={() =>
                  !isDisabled && toggleSelect(item.key, selected, setSelected)
                }
                style={{
                  padding: "6px 10px",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  backgroundColor: isSelected ? "#007bff" : "transparent",
                  color: isSelected ? "#fff" : isDisabled ? "#ccc" : "#000",
                  borderBottom: "1px solid #eee",
                  userSelect: "none",
                }}
              >
                {/* Renderizamos el string HTML dentro del div */}
                <div
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
              </div>
            );
          })
        )}
      </div>
    </>
  );

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        borderRadius: 6,
        padding: 16,
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      {/* Lista izquierda */}
      <div style={{ flex: 1 }}>
        <div style={headerStyle}>
          <strong>{titleLeft}</strong>
          <span style={badgeStyle}>{leftData.length}</span>
        </div>
        {renderList(
          leftData,
          selectedLeft,
          setSelectedLeft,
          searchLeft,
          setSearchLeft
        )}
      </div>

      {/* Controles */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          justifyContent: "center",
        }}
      >
        <button
          onClick={moveAllRight}
          disabled={disabled}
          style={buttonStyle}
          title="Pasar todos"
        >
          ≫
        </button>
        <button
          onClick={moveSelectedRight}
          disabled={disabled}
          style={buttonStyle}
          title="Pasar seleccionados"
        >
          &gt;
        </button>
        <button
          onClick={moveSelectedLeft}
          disabled={disabled}
          style={buttonStyle}
          title="Quitar seleccionados"
        >
          &lt;
        </button>
        <button
          onClick={moveAllLeft}
          disabled={disabled}
          style={buttonStyle}
          title="Quitar todos"
        >
          ≪
        </button>
      </div>

      {/* Lista derecha */}
      <div style={{ flex: 1 }}>
        <div style={headerStyle}>
          <strong>{titleRight}</strong>
          <span style={badgeStyle}>{(data.filter(item => targetKeys.includes(item.key))).length}</span>
        </div>
        {renderList(
          rightData,
          selectedRight,
          setSelectedRight,
          searchRight,
          setSearchRight
        )}
      </div>
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  marginBottom: 6,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: "#e0e0e0",
  borderRadius: 10,
  padding: "2px 8px",
  fontSize: 12,
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontWeight: "bold",
  fontSize: 16,
  width: 36,
  height: 36,
  cursor: "pointer",
};

export default CustomDualList;

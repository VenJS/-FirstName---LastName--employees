import { useState } from "react";

const CsvReader = () => {
  const [csvFile, setCsvFile] = useState();
  const [result, setResult] = useState([""]);
  const [showGrid, setShowGrid] = useState(false);

  const formatTime = (time) => {
    return new Date(time).toLocaleDateString("en-us") === "Invalid Date"
      ? new Date().toLocaleDateString("en-us")
      : new Date(time).toLocaleDateString("en-us");
  };

  const numberOfDays = (firstDate, secondDate) => {
    const date1 = new Date(formatTime(firstDate));
    const date2 = new Date(formatTime(secondDate));

    const differenceInTime = date2.getTime() - date1.getTime();
    return differenceInTime / (1000 * 3600 * 24);
  };

  const manageCsvData = (data) => {
    const header = data.slice(0, data.indexOf("\r\n")).split(",", 4);
    const rows = data.slice(data.indexOf("\n") + 1).split("\r\n");

    const newArray = rows.map((row) => {
      const values = row.split(",");
      const objects = header.reduce((obj, headers, index) => {
        obj[headers] = values[index];
        return obj;
      }, {});
      return objects;
    });
    setResult(newArray);
  };

  const projectIDs = result.map((res) => res.ProjectID);

  const commonProjectIds = projectIDs.filter(
    (item, idx) => projectIDs.indexOf(item) !== idx
  );

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const submit = () => {
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        const text = e.target.result;
        manageCsvData(text);
      };
      fileReader.readAsText(csvFile);
    };

    if (csvFile) {
      submit();
    }

    setShowGrid(true);
  };

  const handleOnChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  return (
    <form>
      <input type={"file"} accept={".csv"} onChange={handleOnChange} />
      <button
        onClick={(e) => {
          handleOnSubmit(e);
        }}
      >
        IMPORT CSV
      </button>
      {showGrid ? (
        <div>
          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "center",
              margin: "2rem 0 1rem",
              borderBottom: "1px solid black",
            }}
          >
            <span>Employee ID</span>
            <span>DateFrom</span>
            <span>DateTo</span>
            <span>Days worked</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {result.map((res, index) => {
              return (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 100px)",
                    gap: "2rem",
                    justifyItems: "right",
                  }}
                  key={index}
                >
                  <span>{res.EmpID}</span>

                  <span>{formatTime(res.DateFrom)}</span>
                  <span>{formatTime(res.DateTo)}</span>
                  <span>
                    {Math.round(numberOfDays(res.DateFrom, res.DateTo))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </form>
  );
};

export default CsvReader;

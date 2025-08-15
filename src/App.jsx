import React, { useState, useEffect } from "react";

export default function App() {
  const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : {};
  });

  const [total, setTotal] = useState(() => {
    const savedTotal = localStorage.getItem("total");
    return savedTotal ? JSON.parse(savedTotal) : 0;
  });

  const [currentDay, setCurrentDay] = useState(0);
  const [taskName, setTaskName] = useState("");
  const [taskValue, setTaskValue] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("total", JSON.stringify(total));
  }, [tasks, total]);

  const addTask = () => {
    if (!taskName || !taskValue) return;
    const newTasks = { ...tasks };
    if (!newTasks[currentDay]) newTasks[currentDay] = [];
    newTasks[currentDay].push({ name: taskName, value: Number(taskValue), done: false });
    setTasks(newTasks);
    setTaskName("");
    setTaskValue("");
  };

  const completeTask = (dayIndex, taskIndex) => {
    const newTasks = { ...tasks };
    const task = newTasks[dayIndex][taskIndex];
    if (!task.done) {
      task.done = true;
      setTotal(total + task.value);
    }
    setTasks(newTasks);
  };

  const resetTotal = () => {
    setTotal(0);
  };

  return (
    <div style={{ padding: "20px", direction: "rtl", fontFamily: "Arial" }}>
      <h1>מטלות של רועי</h1>

      {/* טאבים של ימים */}
      <div>
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            onClick={() => setCurrentDay(index)}
            style={{
              margin: "5px",
              padding: "5px 10px",
              background: currentDay === index ? "lightblue" : "white"
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* הוספת מטלה */}
      <div style={{ marginTop: "20px" }}>
        <input
          placeholder="שם המטלה"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          placeholder="שווי המטלה"
          type="number"
          value={taskValue}
          onChange={(e) => setTaskValue(e.target.value)}
        />
        <button onClick={addTask}>הוסף מטלה</button>
      </div>

      {/* רשימת מטלות ליום הנבחר */}
      <ul>
        {(tasks[currentDay] || []).map((task, idx) => (
          <li
            key={idx}
            style={{
              textDecoration: task.done ? "line-through" : "none",
              margin: "5px 0"
            }}
          >
            {task.name} - {task.value} ₪
            {!task.done && (
              <button style={{ marginRight: "10px" }} onClick={() => completeTask(currentDay, idx)}>
                סמן כבוצע
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* סיכום */}
      <h2>סכום כללי: {total} ₪</h2>
      <button onClick={resetTotal}>אפס סכום</button>
    </div>
  );
}

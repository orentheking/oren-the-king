import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import Confetti from "react-confetti";

const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const colors = ["#FFB6C1", "#FFD700", "#87CEFA", "#90EE90", "#FFA07A", "#DA70D6", "#FF69B4"];

function App() {
  const [currentDay, setCurrentDay] = useState(0);
  const [taskName, setTaskName] = useState("");
  const [taskValue, setTaskValue] = useState("");
  const [tasks, setTasks] = useState({});
  const [total, setTotal] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const tasksDocRef = doc(db, "tasksApp", "data");

  // טעינת נתונים בזמן אמת
  useEffect(() => {
    const unsubscribe = onSnapshot(tasksDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTasks(data.tasks || {});
        setTotal(data.total || 0);
      } else {
        // יצירת מסמך רק אם הוא לא קיים
        try {
          await setDoc(tasksDocRef, { tasks: {}, total: 0 });
        } catch (err) {
          console.error("Error creating initial doc:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (!taskName || !taskValue) return;

    const newTask = { name: taskName, value: Number(taskValue), done: false };
    const dayTasks = tasks[currentDay] || [];
    const updatedDayTasks = [...dayTasks, newTask];
    const updatedTasks = { ...tasks, [currentDay]: updatedDayTasks };

    setTasks(updatedTasks);
    setTaskName("");
    setTaskValue("");

    await updateDoc(tasksDocRef, { tasks: updatedTasks });
  };

  const completeTask = async (dayIndex, taskIndex) => {
    const dayTasks = tasks[dayIndex] || [];
    const task = dayTasks[taskIndex];
    if (!task.done) {
      const updatedTask = { ...task, done: true };
      const updatedDayTasks = [...dayTasks];
      updatedDayTasks[taskIndex] = updatedTask;
      const updatedTasks = { ...tasks, [dayIndex]: updatedDayTasks };
      const newTotal = total + task.value;

      setTasks(updatedTasks);
      setTotal(newTotal);

      // הצגת קונפטי לכיף
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);

      await updateDoc(tasksDocRef, { tasks: updatedTasks, total: newTotal });
    }
  };

  const resetTotal = async () => {
    setTotal(0);
    await updateDoc(tasksDocRef, { total: 0 });
  };

  return (
    <div
      style={{
        padding: "20px",
        direction: "rtl",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        backgroundColor: "#FFF8DC",
        minHeight: "100vh",
        position: "relative"
      }}
    >
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <h1 style={{ textAlign: "center", color: "#FF4500" }}>מטלות של רועי</h1>

      {/* טאבים של ימים */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            onClick={() => setCurrentDay(index)}
            style={{
              margin: "5px",
              padding: "10px 15px",
              borderRadius: "10px",
              border: "2px solid #fff",
              cursor: "pointer",
              fontWeight: "bold",
              backgroundColor: currentDay === index ? colors[index] : "#eee",
              color: currentDay === index ? "white" : "#333",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
              transition: "0.2s"
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* הוספת מטלה */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          placeholder="שם המטלה"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          style={{ padding: "10px", borderRadius: "10px", border: "2px solid #FFB6C1", width: "150px" }}
        />
        <input
          placeholder="שווי המטלה"
          type="number"
          value={taskValue}
          onChange={(e) => setTaskValue(e.target.value)}
          style={{ padding: "10px", borderRadius: "10px", border: "2px solid #87CEFA", width: "100px" }}
        />
        <button
          onClick={addTask}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            backgroundColor: "#32CD32",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.3)"
          }}
        >
          הוסף מטלה
        </button>
      </div>

      {/* רשימת מטלות */}
      <ul style={{ listStyle: "none", padding: 0, maxWidth: "500px", margin: "0 auto" }}>
        {(tasks[currentDay] || []).map((task, idx) => (
          <li
            key={idx}
            style={{
              backgroundColor: task.done ? "#d3d3d3" : "#fff",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "1px 1px 5px rgba(0,0,0,0.2)",
              transition: "0.2s"
            }}
          >
            <span style={{ textDecoration: task.done ? "line-through" : "none", fontWeight: "bold" }}>
              {task.name} - {task.value} ₪
            </span>
            {!task.done && (
              <button
                onClick={() => completeTask(currentDay, idx)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "10px",
                  backgroundColor: "#FF6347",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                ✔ בוצע
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* סכום כללי */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h2 style={{ color: "#FF4500" }}>סכום כללי: {total} ₪</h2>
        <button
          onClick={resetTotal}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            backgroundColor: "#FF1493",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          אפס סכום
        </button>
      </div>
    </div>
  );
}

export default App;

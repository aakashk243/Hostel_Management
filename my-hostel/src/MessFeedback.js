import { useEffect, useState } from "react";
import axios from "axios";
import "./MessFeedback.css";

export default function MessFeedback() {
  const [menu, setMenu] = useState(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const load = async () => {
    const res = await axios.get("http://localhost:8080/mess/today");
    setMenu(res.data);
  };

  useEffect(() => {
    load();
    const i = setInterval(load, 2000);
    return () => clearInterval(i);
  }, []);

  const feedbackItem = (item, type) =>
    axios.post("http://localhost:8080/mess/feedback/item", null, {
      params: { item, type },
    });

  const feedbackOverall = (type) =>
    axios.post("http://localhost:8080/mess/feedback/overall", null, {
      params: { type },
    });

  if (!menu) return <p>Loading...</p>;

  return (
    <div className="mess-container">
      <h2 className="mess-title">🍽️ Today’s Mess Menu</h2>
      <div className="mess-day">{today}</div>

      {/* MENU CARD */}
      <div className="mess-card">
        <div className="section-title">Menu Feedback</div>

        {menu.items.map((item) => (
          <div className="menu-row" key={item}>
            <div className="menu-item">{item}</div>

            <div className="feedback-actions">
              <button className="feedback-btn" onClick={() => feedbackItem(item, "good")}>👍</button>
              <button className="feedback-btn" onClick={() => feedbackItem(item, "average")}>👌</button>
              <button className="feedback-btn" onClick={() => feedbackItem(item, "poor")}>👎</button>
            </div>

            <div className="feedback-count">
              G:{menu.itemFeedback[item].good} A:{menu.itemFeedback[item].average} P:{menu.itemFeedback[item].poor}
            </div>
          </div>
        ))}
      </div>

      {/* OVERALL CARD */}
      <div className="mess-card">
        <div className="section-title">Overall Feedback</div>

        <div className="overall-actions">
          <button className="feedback-btn" onClick={() => feedbackOverall("good")}>👍 Good</button>
          <button className="feedback-btn" onClick={() => feedbackOverall("average")}>👌 Average</button>
          <button className="feedback-btn" onClick={() => feedbackOverall("poor")}>👎 Poor</button>
        </div>

        <div className="overall-count">
          Good: {menu.overall.good} | Average: {menu.overall.average} | Poor: {menu.overall.poor}
        </div>
      </div>
    </div>
  );
}

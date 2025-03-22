import React from "react";
import styles from "./page.module.css"
import { Button } from "@/components/ui/button"

const page = () => {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.header}>Header</div>
        <div className={styles.content}>
          <div>
            <div className={styles.left}>
              <div className={styles.headerinner}>Pomodo Timer</div>
              <div className={styles.timer}>Timer</div>
              <div className={styles.breaks}>
                <Button style={{width: "25%"}} variant="outline">Pomodoro</Button>
                <Button style={{width: "25%"}} variant="ghost">Short Break</Button>
                <Button style={{width: "25%"}} variant="ghost">Long Break</Button>
              </div>
              <div className={styles.startreset}>
                <Button>Start</Button>
                <Button variant="secondary">Start</Button>
              </div>
              <div className={styles.sessions}>Sessions Completed</div>
            </div>
          </div>
          <div>
            <div className={styles.left}>
              <div className={styles.headerinner}>Reflection Journal</div>
              <div className={styles.timertwo}>Reflection Prompt</div>
              <div className={styles.timertwo}>Timer</div>

              <div className={styles.startresettwo}>
                <Button>Save Entry</Button>
              </div>
              <div className={styles.timertwo}>AI Productivity Insights</div>

            </div>
          </div>

        </div>
      </div>
    </div>);
};

export default page;

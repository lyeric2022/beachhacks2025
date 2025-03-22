import React from "react";
import styles from "./page.module.css"


const page = () => {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.header}>Header</div>
        <div className={styles.content}>
          <div>
            <div className={styles.left}>
              <div className={styles.header}>Pomodo Timer</div>
              <div className={styles.timer}>Timer</div>
              <div className={styles.breaks}>
                <div>Button</div>
                <div>Button</div>
                <div>Button</div>
              </div>
              <div className={styles.startreset}>
                <div>start</div>
                <div>start</div>
              </div>
              <div>Sessions Completed</div>
            </div>
          </div>
          <div>
            <div className={styles.right}>Right content</div>
          </div>
        </div>
      </div>
    </div>);
};

export default page;

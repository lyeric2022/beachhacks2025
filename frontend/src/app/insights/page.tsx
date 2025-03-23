"use client"

import React from "react";
import styles from "./page.module.css"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { BookOpen, TrendingUp, Clock, Lightbulb, Target, Calendar } from "lucide-react";

const InsightsPage = () => {
    return (
        <div className={`${styles.container}`}>
            <div>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>Learning Insights</div>
                    <Link href="/insights/all">
                        <Button variant="outline" className={styles.seeAllButton}>See all insights</Button>
                    </Link>
                </div>

                <div className={styles.content}>
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>
                            <BookOpen className={styles.icon} size={18} />
                            Study Focus
                        </div>
                        <p className={styles.cardText}>
                            Allocate 6-8 hours to CECS 329 this week for midterm prep (40% of grade).
                            Focus on Pop Quizzes 0-4 content, particularly algorithm efficiency.
                            Create summary sheets with key formulas to strengthen understanding.
                        </p>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardTitle}>
                            <TrendingUp className={styles.icon} size={18} />
                            Performance
                        </div>
                        <p className={styles.cardText}>
                            Current scores: 95.83% in CECS 448 and 93.1% in CECS 329.
                            Your strong grasp of both design and theory shows excellent academic balance.
                            Apply analytical thinking from CECS 329 to your System Programming assignments.
                        </p>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardTitle}>
                            <Clock className={styles.icon} size={18} />
                            Productivity
                        </div>
                        <p className={styles.cardText}>
                            Peak performance detected between 9-11:30 AM (Mon-Wed). Schedule difficult
                            tasks during these morning blocks. Reserve afternoons for review and
                            collaborative projects to align with your natural energy rhythm.
                        </p>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardTitle}>
                            <Lightbulb className={styles.icon} size={18} />
                            Recommendations
                        </div>

                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>
                                <Target className={styles.subIcon} size={16} />
                                Priority Tasks
                            </div>
                            <p className={styles.cardText}>
                                Complete CECS 325 Homework 2 and 3 (8 points each) this week. These form critical building blocks for upcoming midterms (20 points each). Dedicate 2 hours per assignment, focusing on implementation over concepts. Pay special attention to memory management and system calls, as these typically appear prominently on exams and require thorough understanding.


                            </p>
                        </div>

                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>
                                <Calendar className={styles.subIcon} size={16} />
                                Suggested Schedule
                            </div>
                            <p className={styles.cardText}>
                                Use Friday (9AM-6:30PM) and Saturday (10AM-5:30PM) in 90-minute focused sessions. Key blocks: Tuesday 9-11:30AM for CECS 325 HW2, Wednesday 11:45AM-1:45PM for EE 381 quiz prep, Friday 9AM-12PM for CECS 329 midterm practice. Begin each session with a 5-minute review and end with a quick self-assessment before moving to the next topic.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsPage;
const axios = require("axios");
const {
  getTodayEvents,
  getUpcomingAssignments,
  getEventsByDate,
} = require("../services/assignmentsService");

/**
 * @typedef {Object} Assignment
 * @property {number} id
 * @property {string} name
 * @property {string|null} due_at
 * @property {number|null} points_possible
 * @property {string[]} assignment_type
 * @property {number} course_id
 * @property {number} [course_grade]
 */

/**
 * @typedef {Object} TimeBlock
 * @property {Date} start
 * @property {Date} end
 * @property {number} duration - Duration in minutes
 */

/**
 * @typedef {Object} ScheduledTask
 * @property {Assignment} assignment
 * @property {TimeBlock} timeBlock
 * @property {number} priority
 */

/**
 * Fetches all upcoming assignments from the REST API
 * @returns {Promise<Assignment[]>} List of upcoming assignments
 */
async function getTaskList(userId) {
  try {
    const response = await getUpcomingAssignments(userId);
    console.log("task list");
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching task list:", error);
    return [];
  }
}

/**
 * Calculates priority score based on due date and course grade
 * @param {Date} dueDate - Due date of the assignment
 * @returns {number} Priority score between 0-100
 */
function getPriorityScore(dueDate) {
  const now = new Date();
  const daysUntilDue =
    (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  // Due date score (0-50)
  const dueDateScore = Math.min(50, Math.max(0, 50 - daysUntilDue * 2));

  // Grade score (0-50)
  // const gradeScore = Math.min(50, Math.max(0, 50 - (courseGrade / 2)));

  // return Math.round(dueDateScore + gradeScore);
  return Math.round(dueDateScore);
}

/**
 * Gets priority score for an assignment
 * @param {Assignment} assignment - Assignment object
 * @returns {Promise<number>} Priority score between 0-100
 */
async function getPriorityScoreFromTask(assignment) {
  try {
    // if (!assignment.course_grade) {
    //   const response = await axios.get(`/api/assignments/courses/${assignment.course_id}/grade`);
    //   assignment.course_grade = response.data.grade;
    // }

    const dueDate = assignment.due_at
      ? new Date(assignment.due_at)
      : new Date();
    return getPriorityScore(dueDate);
  } catch (error) {
    console.error("Error calculating priority score:", error);
    return 0;
  }
}

/**
 * Gets vacant time blocks between events
 * @param {Array} events - List of existing events
 * @returns {TimeBlock[]} List of vacant time blocks
 */
function getVacantTimeBlocks(events) {
  const startOfDay = new Date();
  startOfDay.setHours(9, 0, 0, 0); // Start at 9 AM

  const endOfDay = new Date();
  endOfDay.setHours(22, 0, 0, 0); // End at 10 PM

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const vacantBlocks = [];
  let currentTime = startOfDay;

  for (const event of sortedEvents) {
    const eventStart = new Date(event.start);
    if (eventStart.getTime() > currentTime.getTime()) {
      vacantBlocks.push({
        start: new Date(currentTime),
        end: new Date(eventStart),
        duration: (eventStart.getTime() - currentTime.getTime()) / (1000 * 60),
      });
    }
    currentTime = new Date(event.end);
  }

  if (currentTime.getTime() < endOfDay.getTime()) {
    vacantBlocks.push({
      start: new Date(currentTime),
      end: new Date(endOfDay),
      duration: (endOfDay.getTime() - currentTime.getTime()) / (1000 * 60),
    });
  }

  return vacantBlocks;
}

/**
 * Estimates task duration in minutes
 * @param {Assignment} assignment - Assignment to estimate
 * @returns {number} Estimated duration in minutes
 */
function getEstimatedDuration(assignment) {
  return assignment.points_possible ? assignment.points_possible * 2 : 30;
}

/**
 * Gets daily agenda with optimized task scheduling
 * @param {string} userId - The user ID
 * @param {Date} targetDate - The date to generate agenda for
 * @returns {Promise<ScheduledTask[]>} Ordered list of scheduled tasks
 */
async function getDailyAgenda(userId, targetDate) {
  try {
    // Get events for the specific date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get existing events for that day
    const existingEvents = await getEventsByDate(userId, startOfDay);

    // Get vacant time blocks
    const vacantBlocks = getVacantTimeBlocks(existingEvents);

    // Get and prioritize tasks
    const tasks = await getTaskList(userId);
    const tasksWithPriority = await Promise.all(
      tasks.map(async (task) => ({
        assignment: task,
        priority: await getPriorityScoreFromTask(task),
      }))
    );

    // Sort by priority
    tasksWithPriority.sort((a, b) => b.priority - a.priority);

    const scheduledTasks = [];

    // Schedule tasks in vacant blocks
    for (const block of vacantBlocks) {
      const taskIndex = tasksWithPriority.findIndex(
        (task) =>
          getEstimatedDuration(task.assignment) <=
          (new Date(block.end).getTime() - new Date(block.start).getTime()) /
            (1000 * 60)
      );

      if (taskIndex !== -1) {
        const task = tasksWithPriority.splice(taskIndex, 1)[0];
        scheduledTasks.push({
          assignment: task.assignment,
          timeBlock: block,
          priority: task.priority,
        });
      }
    }

    console.log("Generated schedule:", scheduledTasks);
    return scheduledTasks;
  } catch (error) {
    console.error("Error generating daily agenda:", error);
    return [];
  }
}

module.exports = {
  getTaskList,
  getPriorityScore,
  getPriorityScoreFromTask,
  getDailyAgenda,
};

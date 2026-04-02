import Project from "../models/Project.js";
import Notification from "../models/Notification.js";

export async function getProjects(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    filter.$or = [
      { name: { $regex: req.query.q, $options: "i" } },
      { description: { $regex: req.query.q, $options: "i" } }
    ];
  }

  const projects = await Project.find(filter)
    .populate("assignedTo", "name department")
    .sort({ createdAt: -1 });

  res.json({ projects });
}

export async function createProject(req, res) {
  const project = await Project.create(req.body);
  const populated = await project.populate("assignedTo", "name department");

  if (project.assignedTo) {
    await Notification.create({
      userId: project.assignedTo,
      message: `คุณได้รับมอบหมายในโครงการ ${project.name}`
    });
  }

  res.status(201).json({ project: populated });
}

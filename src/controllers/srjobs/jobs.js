const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const asyncWrapper = require("../../middlewares/async");
const Jobs = require("../../models/Jobs");

const createJobs = asyncWrapper(async (req, res) => {
  const jobData = req.body;

  const jobs = await Jobs.create(jobData);

  res
    .status(201)
    .json({ success: true, message: "Job created successfully.", data: jobs });
});

const getAllJobs = asyncWrapper(async (req, res) => {
  const { cat, text, companyId, myJobs, page = 1, limit = 10 } = req.query;

  const currentPage = Math.max(Number(page) || 1, 1);
  const perPage = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const skip = (currentPage - 1) * perPage;

  const filter = {};

  // Category
  if (cat && cat !== "all") {
    filter.categories = cat;
  }

  // Search
  if (text) {
    filter.title = {
      $regex: text,
      $options: "i",
    };
  }

  // Company jobs
  if (companyId) {
    filter["companyInf._id"] = companyId;
  }

  // My jobs
  if (myJobs === "true") {
    filter.userEmail = req.user.email;
  }

  const [jobs, total] = await Promise.all([
    Jobs.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage),

    Jobs.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / perPage);

  res.status(200).json({
    success: true,
    message: "Jobs retrieved successfully.",
    pagination: {
      total,
      page: currentPage,
      limit: perPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
    data: jobs,
  });
});

const singleJob = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  // const query = { _id: new ObjectId(id) };

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid job ID.", data: null });
  }

  const job = await Jobs.findById(id);

  if (!job) {
    return res
      .status(404)
      .json({ success: false, message: "Job not found.", data: null });
  }

  res
    .status(200)
    .json({ success: true, message: "Job retrieved successfully.", data: job });
});

// ==============================// Update Single Job //==============================//
const updateSingleJob = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid job ID.",
      data: null,
    });
  }

  const allowedFields = [
    "title",
    "categories",
    "workplaceType",
    "jobType",
    "experience",
    "gender",
    "location",
    "salaryRange",
    "deadline",
    "skillsAbilities",
    "jobsDescription",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const job = await Jobs.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found.",
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    message: "Job updated successfully.",
    data: job,
  });
});

// ============================== // Delete Job // ============================== //
const deleteJob = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid job ID.", data: null });
  }

  const job = await Jobs.findByIdAndDelete(id);

  if (!job) {
    return res
      .status(404)
      .json({ success: false, message: "Job not found.", data: null });
  }

  res
    .status(200)
    .json({ success: true, message: "Job deleted successfully.", data: job });
});

module.exports = {
  getAllJobs,
  singleJob,
  createJobs,
  updateSingleJob,
  deleteJob,
};

const express = require("express");

const router = express.Router();

// Controllers
const {
  getAllJobs,
  singleJob,
  createJobs,
  updateSingleJob,
  deleteJob,
  companyJobs,
  myJobs,
} = require("../controllers/srjobs");

const {
  createBookmark,
  allBookmark,
  deleteBookmark,
} = require("../controllers/bookmark");

const { createApplyJob, allJobApllication } = require("../controllers/apply");

const {
  createCompany,
  allCompany,
  singleCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/company");

// =====================================================
// JOB ROUTES
// =====================================================

// GET    /v1/jobs
// POST   /v1/jobs
router.route("/jobs").get(getAllJobs).post(createJobs);

// GET    /v1/jobs/:id
// PUT    /v1/jobs/:id
// DELETE /v1/jobs/:id
router.route("/jobs/:id").get(singleJob).put(updateSingleJob).delete(deleteJob);

// GET /v1/jobs/company/:compId
router.get("/jobs/company/:compId", companyJobs);

// GET /v1/my-jobs
router.get("/my-jobs", myJobs);

// =====================================================
// BOOKMARK ROUTES
// =====================================================

// GET    /v1/bookmarks
// POST   /v1/bookmarks
router.route("/bookmarks").get(allBookmark).post(createBookmark);

// DELETE /v1/bookmarks/:jobId
router.delete("/bookmarks/:jobId", deleteBookmark);

// =====================================================
// JOB APPLICATION ROUTES
// =====================================================

// GET    /v1/applications
// POST   /v1/applications
router.route("/applications").get(allJobApllication).post(createApplyJob);

// =====================================================
// COMPANY ROUTES
// =====================================================

// GET    /v1/companies
// POST   /v1/companies
router.route("/companies").get(allCompany).post(createCompany);

// GET    /v1/companies/:id
// PUT    /v1/companies/:id
// DELETE /v1/companies/:id
router
  .route("/companies/:id")
  .get(singleCompany)
  .put(updateCompany)
  .delete(deleteCompany);

module.exports = router;

import { courseService } from "../../services/courseService";
import {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  fetchCoursesByUniversityStart,
  fetchCoursesByUniversitySuccess,
  fetchCoursesByUniversityFailure,
  createCourseStart,
  createCourseSuccess,
  createCourseFailure,
  updateCourseStart,
  updateCourseSuccess,
  updateCourseFailure,
  deleteCourseStart,
  deleteCourseSuccess,
  deleteCourseFailure,
} from "../slices/courseSlice";

export const fetchAllCourses =
  (page = 1, limit = 10) =>
  async (dispatch) => {
    dispatch(fetchCoursesStart());
    try {
      const response = await courseService.getAllCourses(page, limit);
      dispatch(
        fetchCoursesSuccess({
          courses: response.data || [],
          pagination: response.pagination,
          count: response.count,
        })
      );
    } catch (error) {
      dispatch(
        fetchCoursesFailure(
          error.response?.data?.message || "Failed to fetch courses"
        )
      );
    }
  };

export const fetchCoursesByUniversity = (universityId) => async (dispatch) => {
  dispatch(fetchCoursesByUniversityStart());
  try {
    const response = await courseService.getCoursesByUniversity(universityId);
    // Handle both array response and object with data property
    const courses = Array.isArray(response) ? response : response.data || [];
    dispatch(
      fetchCoursesByUniversitySuccess({
        courses: courses,
        pagination: response.pagination || {
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        count: response.count || courses.length,
      })
    );
  } catch (error) {
    dispatch(
      fetchCoursesByUniversityFailure(
        error.response?.data?.message || "Failed to fetch courses"
      )
    );
  }
};

export const createCourse = (courseData) => async (dispatch) => {
  dispatch(createCourseStart());
  try {
    const response = await courseService.createCourse(courseData.universityId, {
      name: courseData.name,
      description: courseData.description,
      level: courseData.level,
      duration: courseData.duration,
      price: courseData.price,
      language: courseData.language,
      currency: courseData.currency,
    });
    dispatch(createCourseSuccess(response.data || response));
    return response.data || response;
  } catch (error) {
    dispatch(
      createCourseFailure(
        error.response?.data?.message || "Failed to create course"
      )
    );
    throw error;
  }
};

export const updateCourse = (courseData) => async (dispatch) => {
  dispatch(updateCourseStart());
  try {
    const response = await courseService.updateCourse(courseData.id, {
      name: courseData.name,
      description: courseData.description,
      level: courseData.level,
      duration: courseData.duration,
      price: courseData.price,
      language: courseData.language,
      currency: courseData.currency,
    });
    dispatch(updateCourseSuccess(response.data || response));
    return response.data || response;
  } catch (error) {
    dispatch(
      updateCourseFailure(
        error.response?.data?.message || "Failed to update course"
      )
    );
    throw error;
  }
};

export const deleteCourse = (courseId) => async (dispatch) => {
  dispatch(deleteCourseStart());
  try {
    await courseService.deleteCourse(courseId);
    dispatch(deleteCourseSuccess(courseId));
  } catch (error) {
    dispatch(
      deleteCourseFailure(
        error.response?.data?.message || "Failed to delete course"
      )
    );
    throw error;
  }
};

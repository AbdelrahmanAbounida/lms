import React from "react";

interface StudentCourseParams {
  params: {
    courseId: string;
  };
}

const StudentCourse = ({ params }: StudentCourseParams) => {
  return <div>{params.courseId}</div>;
};

export default StudentCourse;
